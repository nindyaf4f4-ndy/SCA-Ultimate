/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    UserCheck,
    Plus,
    Search,
    Share2,
    Edit,
    Trash2,
    Copy,
    ExternalLink,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    User,
    LogOut,
    Eye,
    EyeOff,
    Phone,
    Mail,
    RefreshCw,
    Shield,
    Sparkles,
    Check,
    Printer,
    ArrowLeft
} from 'lucide-react';
import { AccessStatus, AccessUser } from '../types/access';
import {
    AccessStorageService,
    addDays,
    formatDateYMD,
    generateRandomLinkToken,
    generateRandomPassword
} from '../services/accessStorage';
import { STIFIN_DATA } from '../data/stifinData';

interface Props {
    promotorUser: AccessUser;
    onLogout: () => void;
    onViewClientReport: (clientUser: AccessUser) => void;
    onOpenMasterAdmin?: () => void;
}

export const PromotorDashboard: React.FC<Props> = ({
    promotorUser,
    onLogout,
    onViewClientReport,
    onOpenMasterAdmin
}) => {
    const [clients, setClients] = useState<AccessUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'aktif' | 'expired'>('all');
    const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

    // Modal state for Input / Edit Client
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [editingClientId, setEditingClientId] = useState<string | null>(null);

    // Form data for client input
    const [clientForm, setClientForm] = useState({
        nama: '',
        bloodType: 'O' as 'O' | 'A' | 'B' | 'AB',
        stifinType: 'Si',
        whatsapp: '',
        email: '',
        passcode: '',
        token: '',
        tanggalAwal: formatDateYMD(new Date()),
        tanggalBerakhir: formatDateYMD(addDays(new Date(), 60)),
        status: 'aktif' as AccessStatus,
        catatan: ''
    });

    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

    const refreshClients = () => {
        // Fetch clients from real database: strictly only clients belonging to this promotor
        const clientList = AccessStorageService.getClients(promotorUser.id);
        setClients(clientList);
    };

    useEffect(() => {
        refreshClients();
    }, [promotorUser.id]);

    const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToastMsg({ text, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    const copyToClipboard = (text: string, label = 'Teks') => {
        navigator.clipboard.writeText(text);
        showToast(`${label} berhasil disalin ke clipboard!`, 'success');
    };

    const openCreateClientModal = () => {
        setEditingClientId(null);
        setClientForm({
            nama: '',
            bloodType: 'O',
            stifinType: 'Si',
            whatsapp: '',
            email: '',
            passcode: generateRandomPassword('readable'),
            token: generateRandomLinkToken('stifin'),
            tanggalAwal: formatDateYMD(new Date()),
            tanggalBerakhir: formatDateYMD(addDays(new Date(), 60)),
            status: 'aktif',
            catatan: `Diinput oleh Promotor: ${promotorUser.nama}`
        });
        setIsClientModalOpen(true);
    };

    const openEditClientModal = (c: AccessUser) => {
        setEditingClientId(c.id);
        setClientForm({
            nama: c.nama,
            bloodType: c.bloodType || 'O',
            stifinType: c.stifinType,
            whatsapp: c.whatsapp,
            email: c.email,
            passcode: c.passcode,
            token: c.token,
            tanggalAwal: c.tanggalAwal,
            tanggalBerakhir: c.tanggalBerakhir,
            status: c.status,
            catatan: c.catatan || ''
        });
        setIsClientModalOpen(true);
    };

    const handleSaveClient = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientForm.nama.trim()) {
            showToast('1. Nama Lengkap Subjek wajib diisi!', 'error');
            return;
        }

        AccessStorageService.saveUser({
            id: editingClientId || undefined,
            nama: clientForm.nama.trim(),
            bloodType: clientForm.bloodType,
            stifinType: clientForm.stifinType,
            whatsapp: clientForm.whatsapp.trim(),
            email: clientForm.email.trim(),
            role: 'client',
            passcode: clientForm.passcode.trim() || generateRandomPassword('readable'),
            token: clientForm.token.trim() || generateRandomLinkToken(clientForm.stifinType.toLowerCase()),
            accessLink: '',
            tanggalAwal: clientForm.tanggalAwal,
            tanggalBerakhir: clientForm.tanggalBerakhir,
            status: clientForm.status,
            catatan: clientForm.catatan.trim(),
            createdByPromotorId: promotorUser.id,
            createdByPromotorName: promotorUser.nama,
            testDate: formatDateYMD(new Date())
        });

        refreshClients();
        setIsClientModalOpen(false);
        showToast(
            editingClientId
                ? 'Data klien berhasil diperbarui di database!'
                : 'Data klien baru berhasil disimpan ke database!',
            'success'
        );
    };

    const handleDeleteClient = (id: string, name: string) => {
        if (confirm(`Yakin ingin menghapus data klien '${name}' dari database?`)) {
            AccessStorageService.deleteUser(id);
            refreshClients();
            showToast(`Data klien '${name}' telah dihapus.`, 'info');
        }
    };

    // Quick duration setter
    const setDurationPreset = (days: number) => {
        const now = new Date();
        setClientForm(prev => ({
            ...prev,
            tanggalAwal: formatDateYMD(now),
            tanggalBerakhir: formatDateYMD(addDays(now, days))
        }));
    };

    // WhatsApp Invitation / Results template
    const handleShareWhatsapp = (c: AccessUser) => {
        const pData = STIFIN_DATA.personalities[c.stifinType];
        const link = c.accessLink || `${window.location.origin}${window.location.pathname}?token=${c.token}`;
        const text = `Halo *${c.nama}*,\n\nBerikut adalah hasil tes dan kredensial akses Aplikasi *STIFIn Ultimate Analytics Suite* Anda:\n\n👤 *Nama Subjek:* ${c.nama}\n🩸 *Golongan Darah:* ${c.bloodType || 'O'}\n🧠 *Hasil Tes Genetik STIFIn:* ${c.stifinType} - ${pData?.name || c.stifinType}\n🎯 *Kecerdasan Inti:* ${pData?.quotient || '-'}\n\n🔑 *Password Akses:* ${c.passcode}\n🔗 *Link Akses Langsung:* ${link}\n📅 *Masa Berlaku Akses:* ${c.tanggalAwal} s/d ${c.tanggalBerakhir}\n\n*Promotor:* ${promotorUser.nama}\n\nBuka link di atas untuk melihat laporan analitik eksekutif lengkap Anda! ✨`;
        const url = `https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Filtered clients list
    const filteredClients = useMemo(() => {
        return clients.filter(c => {
            const matchesQuery =
                c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.whatsapp.includes(searchQuery) ||
                c.stifinType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.passcode.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesQuery) return false;

            const dateCheck = AccessStorageService.checkDateValidity(c.tanggalAwal, c.tanggalBerakhir);
            if (filterStatus === 'all') return true;
            if (filterStatus === 'aktif') return c.status === 'aktif' && dateCheck.status === 'active';
            if (filterStatus === 'expired') return dateCheck.status === 'expired';
            return true;
        });
    }, [clients, searchQuery, filterStatus]);

    const stats = useMemo(() => {
        let active = 0;
        let expired = 0;
        clients.forEach(c => {
            const check = AccessStorageService.checkDateValidity(c.tanggalAwal, c.tanggalBerakhir);
            if (check.status === 'expired') expired++;
            else if (check.status === 'active' && c.status === 'aktif') active++;
        });
        return { total: clients.length, active, expired };
    }, [clients]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Top Header Card */}
                <header className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                            <UserCheck size={26} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Dashboard Promotor STIFIn</h1>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                                    Promotor Access
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                Selamat datang, <strong className="text-slate-900 font-bold">{promotorUser.nama}</strong> • Input dan kelola data tes klien STIFIn
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {onOpenMasterAdmin && (
                            <button
                                type="button"
                                onClick={onOpenMasterAdmin}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
                            >
                                <Shield size={14} className="text-blue-600" /> Master Admin
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={openCreateClientModal}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.01]"
                        >
                            <Plus size={16} /> Input Data Klien Baru
                        </button>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-xs transition-colors"
                            title="Keluar"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                {/* Toast Notification */}
                {toastMsg && (
                    <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
                        toastMsg.type === 'error'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            {toastMsg.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />}
                            <span>{toastMsg.text}</span>
                        </div>
                        <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            <User size={22} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Klien Terdaftar</span>
                            <span className="text-2xl font-black text-slate-900">{stats.total}</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                            <CheckCircle size={22} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Akses Klien Aktif</span>
                            <span className="text-2xl font-black text-emerald-600">{stats.active}</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                            <Clock size={22} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Akses Kadaluarsa</span>
                            <span className="text-2xl font-black text-rose-600">{stats.expired}</span>
                        </div>
                    </div>
                </div>

                {/* Database Client Section */}
                <div className="space-y-4">
                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari nama klien, nomor WhatsApp, email, tipe STIFIn..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value as any)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                            >
                                <option value="all">Semua Status Klien</option>
                                <option value="aktif">🟢 Akses Aktif</option>
                                <option value="expired">⏳ Kadaluarsa (Expired)</option>
                            </select>
                        </div>
                    </div>

                    {/* Table of Clients */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                                    Database Klien Promotor ({filteredClients.length} subjek)
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Hanya menampilkan data klien dari promotor <strong>{promotorUser.nama}</strong>. Data tersimpan real di database.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/60 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                        <th className="py-3 px-4">Nama Subjek &amp; Kontak</th>
                                        <th className="py-3 px-4">Gol. Darah</th>
                                        <th className="py-3 px-4">Hasil STIFIn</th>
                                        <th className="py-3 px-4">Password Akses</th>
                                        <th className="py-3 px-4">Masa Berlaku</th>
                                        <th className="py-3 px-4 text-center">Status</th>
                                        <th className="py-3 px-4 text-right">Aksi &amp; Report</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredClients.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-400">
                                                <UserCheck size={36} className="mx-auto mb-2 opacity-30" />
                                                <p className="font-bold">Belum ada data klien yang diinput</p>
                                                <p className="text-[11px] text-slate-400 mt-1">
                                                    Klik tombol "+ Input Data Klien Baru" di atas untuk menambahkan klien.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredClients.map(c => {
                                            const pData = STIFIN_DATA.personalities[c.stifinType] || STIFIN_DATA.personalities['Si'];
                                            const dateCheck = AccessStorageService.checkDateValidity(c.tanggalAwal, c.tanggalBerakhir);
                                            const isExpired = dateCheck.status === 'expired';
                                            const isPasswordRevealed = !!revealedPasswords[c.id];

                                            return (
                                                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                                                    {/* Nama Subjek & Kontak */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-bold text-slate-900 text-sm">{c.nama}</div>
                                                        <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[11px]">
                                                            {c.whatsapp && (
                                                                <span className="flex items-center gap-1 font-mono">
                                                                    <Phone size={10} /> {c.whatsapp}
                                                                </span>
                                                            )}
                                                            {c.email && (
                                                                <span className="flex items-center gap-1">
                                                                    <Mail size={10} /> {c.email}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {c.catatan && (
                                                            <div className="text-[10px] text-slate-400 italic mt-0.5 max-w-xs truncate">
                                                                {c.catatan}
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Golongan Darah */}
                                                    <td className="py-3.5 px-4">
                                                        <span className="font-black text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">
                                                            {c.bloodType || 'O'}
                                                        </span>
                                                    </td>

                                                    {/* Hasil STIFIn */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="px-2.5 py-1 rounded-lg font-black text-xs text-white shadow-xs"
                                                                style={{ backgroundColor: pData.hex }}
                                                            >
                                                                {c.stifinType}
                                                            </span>
                                                            <div>
                                                                <div className="font-bold text-slate-900 text-xs">{pData.name}</div>
                                                                <div className="text-[10px] font-semibold text-slate-500">{pData.quotient}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Password Akses */}
                                                    <td className="py-3.5 px-4 font-mono">
                                                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                                                            <span className="font-bold text-slate-800 text-xs px-1">
                                                                {isPasswordRevealed ? c.passcode : '••••••••'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setRevealedPasswords(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                                                                className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                                                title={isPasswordRevealed ? 'Sembunyikan' : 'Lihat'}
                                                            >
                                                                {isPasswordRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(c.passcode, 'Password')}
                                                                className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                                                title="Salin Password"
                                                            >
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                    </td>

                                                    {/* Masa Berlaku Akses */}
                                                    <td className="py-3.5 px-4">
                                                        <div className="text-[11px] font-medium text-slate-700">
                                                            s/d <strong className="text-slate-900">{c.tanggalBerakhir}</strong>
                                                        </div>
                                                        <div className="mt-0.5">
                                                            {isExpired ? (
                                                                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                                                                    Expired ({Math.abs(dateCheck.remainingDays)} hari lalu)
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                                                    Sisa {dateCheck.remainingDays} hari
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                            c.status === 'aktif' && !isExpired
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'aktif' && !isExpired ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                            {c.status === 'aktif' && !isExpired ? 'Aktif' : 'Expired'}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {/* Buka Hasil Analisis STIFIn */}
                                                            <button
                                                                type="button"
                                                                onClick={() => onViewClientReport(c)}
                                                                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                                                                title="Buka Report STIFIn Klien"
                                                            >
                                                                <ExternalLink size={13} /> Buka Report
                                                            </button>

                                                            {/* Kirim via WhatsApp */}
                                                            {c.whatsapp && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleShareWhatsapp(c)}
                                                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                                                                    title="Kirim Kredensial via WhatsApp"
                                                                >
                                                                    <Share2 size={14} />
                                                                </button>
                                                            )}

                                                            {/* Edit */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditClientModal(c)}
                                                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                                                                title="Edit Data Klien"
                                                            >
                                                                <Edit size={14} />
                                                            </button>

                                                            {/* Hapus */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteClient(c.id, c.nama)}
                                                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                                                                title="Hapus Klien"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* ==================================================== */}
            {/* MODAL: INPUT / EDIT DATA CLIENT OLEH PROMOTOR */}
            {/* ==================================================== */}
            {isClientModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">
                                    {editingClientId ? 'Edit Data Klien' : 'Input Data Klien STIFIn Baru'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Input data subjek, golongan darah &amp; hasil tes genetik STIFIn untuk disimpan ke database
                                </p>
                            </div>
                            <button onClick={() => setIsClientModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveClient} className="space-y-5">
                            {/* 1. NAMA LENGKAP SUBJEK */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                                <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
                                    Nama Lengkap Subjek (Klien) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={clientForm.nama}
                                    onChange={e => setClientForm({ ...clientForm, nama: e.target.value })}
                                    placeholder="Contoh: Muhammad Rian Hidayat"
                                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* 2. GOLONGAN DARAH */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">2</span>
                                    Golongan Darah *
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['O', 'A', 'B', 'AB'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setClientForm({ ...clientForm, bloodType: type as any })}
                                            className={`py-2.5 rounded-xl text-sm font-black transition-all ${
                                                clientForm.bloodType === type
                                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            Gol. {type}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    Tabiat respons awal: {STIFIN_DATA.bloodTypes[clientForm.bloodType]?.desc}
                                </p>
                            </div>

                            {/* 3. HASIL TES GENETIK STIFIN */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                                    Hasil Tes Genetik STIFIn *
                                </label>
                                <select
                                    value={clientForm.stifinType}
                                    onChange={e => setClientForm({ ...clientForm, stifinType: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-black focus:outline-none focus:border-emerald-500"
                                >
                                    {Object.keys(STIFIN_DATA.personalities).map(code => {
                                        const p = STIFIN_DATA.personalities[code];
                                        return (
                                            <option key={code} value={code}>
                                                {code} - {p.name} ({p.quotient})
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                    <span
                                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                                        style={{ backgroundColor: STIFIN_DATA.personalities[clientForm.stifinType]?.hex || '#10b981' }}
                                    >
                                        {clientForm.stifinType}
                                    </span>
                                    <div className="text-xs">
                                        <div className="font-extrabold text-slate-900">
                                            {STIFIN_DATA.personalities[clientForm.stifinType]?.name}
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {STIFIN_DATA.personalities[clientForm.stifinType]?.quotient} • {STIFIN_DATA.personalities[clientForm.stifinType]?.os}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kontak Klien */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">No. WhatsApp / HP</label>
                                    <input
                                        type="tel"
                                        value={clientForm.whatsapp}
                                        onChange={e => setClientForm({ ...clientForm, whatsapp: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={clientForm.email}
                                        onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                                        placeholder="klien@example.com"
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Kredensial Password Akses Klien */}
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                        Password Akses Klien
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setClientForm(prev => ({ ...prev, passcode: generateRandomPassword('readable') }))}
                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                                    >
                                        <RefreshCw size={12} /> Auto-Generate
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={clientForm.passcode}
                                    onChange={e => setClientForm({ ...clientForm, passcode: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Masa Berlaku Akses */}
                            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                                        <Calendar size={13} className="text-emerald-600" /> Masa Berlaku Akses
                                    </label>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(30)}
                                            className="px-2 py-0.5 bg-white text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold hover:bg-emerald-100"
                                        >
                                            +30 Hari
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(90)}
                                            className="px-2 py-0.5 bg-white text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold hover:bg-emerald-100"
                                        >
                                            +90 Hari
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(365)}
                                            className="px-2 py-0.5 bg-white text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold hover:bg-emerald-100"
                                        >
                                            +1 Tahun
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-600 block mb-0.5">Tanggal Mulai:</span>
                                        <input
                                            type="date"
                                            required
                                            value={clientForm.tanggalAwal}
                                            onChange={e => setClientForm({ ...clientForm, tanggalAwal: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-600 block mb-0.5">Tanggal Berakhir:</span>
                                        <input
                                            type="date"
                                            required
                                            value={clientForm.tanggalBerakhir}
                                            onChange={e => setClientForm({ ...clientForm, tanggalBerakhir: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Catatan Sesi */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Tambahan / Sesi Konsultasi</label>
                                <textarea
                                    rows={2}
                                    value={clientForm.catatan}
                                    onChange={e => setClientForm({ ...clientForm, catatan: e.target.value })}
                                    placeholder="Contoh: Sesi Tes &amp; Konseling Bakat Anak..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsClientModalOpen(false)}
                                    className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-600/20"
                                >
                                    {editingClientId ? 'Simpan Perubahan Klien' : 'Simpan Data Klien ke Database'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};
