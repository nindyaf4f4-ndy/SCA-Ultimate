/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Users,
    Key,
    Link as LinkIcon,
    Settings,
    Plus,
    Search,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Copy,
    ExternalLink,
    RefreshCw,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Share2,
    Database,
    Download,
    Upload,
    Calendar,
    Eye,
    EyeOff,
    Check,
    Power,
    Phone,
    Mail,
    Sparkles,
    Lock
} from 'lucide-react';
import { AccessStatus, AccessUser, AppLinkItem, GlobalAppConfig, PasscodeItem, UserRole } from '../types/access';
import {
    AccessStorageService,
    addDays,
    formatDateYMD,
    generateRandomLinkToken,
    generateRandomPassword
} from '../services/accessStorage';
import { STIFIN_DATA } from '../data/stifinData';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAccessGrantedAsUser?: (user: AccessUser) => void;
    onOpenPromotorDashboard?: (promotorUser?: AccessUser) => void;
}

export const AccessManagementDashboard: React.FC<Props> = ({
    isOpen,
    onClose,
    onAccessGrantedAsUser,
    onOpenPromotorDashboard
}) => {
    // Current active tab
    const [activeTab, setActiveTab] = useState<'users' | 'passwords' | 'links' | 'settings'>('users');

    // Data state
    const [users, setUsers] = useState<AccessUser[]>([]);
    const [passcodes, setPasscodes] = useState<PasscodeItem[]>([]);
    const [links, setLinks] = useState<AppLinkItem[]>([]);
    const [config, setConfig] = useState<GlobalAppConfig>(AccessStorageService.getGlobalConfig());

    // Search & Filter
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'aktif' | 'nonaktif' | 'expired'>('all');
    const [roleFilter, setRoleFilter] = useState<'all' | 'master_admin' | 'promotor' | 'client'>('all');

    // Notification toast
    const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

    // Modal state for User CRUD
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [userForm, setUserForm] = useState({
        nama: '',
        whatsapp: '',
        email: '',
        stifinType: 'Si',
        bloodType: 'O' as 'O' | 'A' | 'B' | 'AB',
        role: 'user' as UserRole,
        passcode: '',
        token: '',
        tanggalAwal: formatDateYMD(new Date()),
        tanggalBerakhir: formatDateYMD(addDays(new Date(), 30)),
        status: 'aktif' as AccessStatus,
        catatan: ''
    });

    // Modal state for Passcode CRUD
    const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
    const [editingPasscodeId, setEditingPasscodeId] = useState<string | null>(null);
    const [passcodeForm, setPasscodeForm] = useState({
        code: '',
        label: '',
        status: 'aktif' as AccessStatus,
        tanggalAwal: formatDateYMD(new Date()),
        tanggalBerakhir: formatDateYMD(addDays(new Date(), 90))
    });

    // Modal state for Link CRUD
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
    const [linkForm, setLinkForm] = useState({
        title: '',
        slugOrToken: '',
        status: 'aktif' as AccessStatus,
        tanggalAwal: formatDateYMD(new Date()),
        tanggalBerakhir: formatDateYMD(addDays(new Date(), 30)),
        assignedUser: ''
    });

    // Password generator controls
    const [genFormat, setGenFormat] = useState<'readable' | 'alphanumeric' | 'numeric'>('readable');
    const [genLength, setGenLength] = useState(8);

    // Reveal passwords map
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

    // Load data
    const refreshData = () => {
        setUsers(AccessStorageService.getUsers());
        setPasscodes(AccessStorageService.getPasscodes());
        setLinks(AccessStorageService.getAppLinks());
        setConfig(AccessStorageService.getGlobalConfig());
    };

    useEffect(() => {
        if (isOpen) {
            refreshData();
        }
    }, [isOpen]);

    const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToastMsg({ text, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    const copyToClipboard = (text: string, label = 'Teks') => {
        navigator.clipboard.writeText(text);
        showToast(`${label} berhasil disalin ke clipboard!`, 'success');
    };

    // Toggle Global App Status (Fitur Aktif / Nonaktif Aplikasi)
    const handleToggleGlobalAppStatus = () => {
        const nextStatus: AccessStatus = config.appStatus === 'aktif' ? 'nonaktif' : 'aktif';
        const updated = AccessStorageService.updateGlobalConfig({ appStatus: nextStatus });
        setConfig(updated);
        showToast(
            nextStatus === 'aktif'
                ? 'Aplikasi diaktifkan kembali secara online!'
                : 'Aplikasi sekarang DINONAKTIFKAN (Mode Pemeliharaan)! Akses pengguna ditutup.',
            nextStatus === 'aktif' ? 'success' : 'info'
        );
    };

    // ----------------------------------------------------
    // USER CRUD HANDLERS
    // ----------------------------------------------------
    const openCreateUserModal = () => {
        const defaultCode = generateRandomPassword('readable');
        const defaultToken = generateRandomLinkToken('stifin');
        setEditingUserId(null);
        setUserForm({
            nama: '',
            whatsapp: '',
            email: '',
            stifinType: 'Si',
            bloodType: 'O',
            role: 'client' as UserRole,
            passcode: defaultCode,
            token: defaultToken,
            tanggalAwal: formatDateYMD(new Date()),
            tanggalBerakhir: formatDateYMD(addDays(new Date(), 30)),
            status: 'aktif',
            catatan: ''
        });
        setIsUserModalOpen(true);
    };

    const openEditUserModal = (u: AccessUser) => {
        setEditingUserId(u.id);
        setUserForm({
            nama: u.nama,
            whatsapp: u.whatsapp,
            email: u.email,
            stifinType: u.stifinType,
            bloodType: u.bloodType || 'O',
            role: u.role || 'client',
            passcode: u.passcode,
            token: u.token,
            tanggalAwal: u.tanggalAwal,
            tanggalBerakhir: u.tanggalBerakhir,
            status: u.status,
            catatan: u.catatan || ''
        });
        setIsUserModalOpen(true);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userForm.nama.trim() || !userForm.passcode.trim()) {
            showToast('Nama dan Password Akses wajib diisi!', 'error');
            return;
        }

        AccessStorageService.saveUser({
            id: editingUserId || undefined,
            nama: userForm.nama.trim(),
            whatsapp: userForm.whatsapp.trim(),
            email: userForm.email.trim(),
            stifinType: userForm.stifinType,
            bloodType: userForm.bloodType,
            role: userForm.role,
            passcode: userForm.passcode.trim(),
            token: userForm.token.trim() || generateRandomLinkToken(userForm.stifinType.toLowerCase()),
            accessLink: '',
            tanggalAwal: userForm.tanggalAwal,
            tanggalBerakhir: userForm.tanggalBerakhir,
            status: userForm.status,
            catatan: userForm.catatan.trim()
        });

        refreshData();
        setIsUserModalOpen(false);
        showToast(editingUserId ? 'Pengguna berhasil diperbarui!' : 'Pengguna baru berhasil ditambahkan ke database!', 'success');
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (confirm(`Yakin ingin menghapus pengguna '${name}' dari database?`)) {
            AccessStorageService.deleteUser(id);
            refreshData();
            showToast(`Pengguna '${name}' telah dihapus.`, 'info');
        }
    };

    const handleToggleUserStatus = (id: string) => {
        const u = AccessStorageService.toggleUserStatus(id);
        if (u) {
            refreshData();
            showToast(`Status pengguna '${u.nama}' diubah menjadi: ${u.status.toUpperCase()}`, 'info');
        }
    };

    // Duration preset setter
    const setDurationPreset = (days: number) => {
        const now = new Date();
        setUserForm(prev => ({
            ...prev,
            tanggalAwal: formatDateYMD(now),
            tanggalBerakhir: formatDateYMD(addDays(now, days))
        }));
    };

    // ----------------------------------------------------
    // PASSCODE CRUD HANDLERS
    // ----------------------------------------------------
    const openCreatePasscodeModal = () => {
        setEditingPasscodeId(null);
        setPasscodeForm({
            code: generateRandomPassword(genFormat, genLength),
            label: 'Passcode Akses Umum',
            status: 'aktif',
            tanggalAwal: formatDateYMD(new Date()),
            tanggalBerakhir: formatDateYMD(addDays(new Date(), 90))
        });
        setIsPasscodeModalOpen(true);
    };

    const openEditPasscodeModal = (p: PasscodeItem) => {
        setEditingPasscodeId(p.id);
        setPasscodeForm({
            code: p.code,
            label: p.label,
            status: p.status,
            tanggalAwal: p.tanggalAwal,
            tanggalBerakhir: p.tanggalBerakhir
        });
        setIsPasscodeModalOpen(true);
    };

    const handleSavePasscode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passcodeForm.code.trim()) {
            showToast('Kode password tidak boleh kosong!', 'error');
            return;
        }

        AccessStorageService.savePasscode({
            id: editingPasscodeId || undefined,
            code: passcodeForm.code.trim(),
            label: passcodeForm.label.trim() || 'Passcode Akses',
            status: passcodeForm.status,
            tanggalAwal: passcodeForm.tanggalAwal,
            tanggalBerakhir: passcodeForm.tanggalBerakhir
        });

        refreshData();
        setIsPasscodeModalOpen(false);
        showToast(editingPasscodeId ? 'Password berhasil diperbarui!' : 'Password baru berhasil dibuat!', 'success');
    };

    const handleDeletePasscode = (id: string) => {
        if (passcodes.length <= 1) {
            showToast('Minimal harus ada 1 passcode tersisa di sistem!', 'error');
            return;
        }
        if (confirm('Hapus password akses ini?')) {
            AccessStorageService.deletePasscode(id);
            refreshData();
            showToast('Password telah dihapus.', 'info');
        }
    };

    const handleTogglePasscodeStatus = (id: string) => {
        const p = AccessStorageService.togglePasscodeStatus(id);
        if (p) {
            refreshData();
            showToast(`Status password diubah menjadi: ${p.status.toUpperCase()}`, 'info');
        }
    };

    // ----------------------------------------------------
    // LINK CRUD HANDLERS
    // ----------------------------------------------------
    const openCreateLinkModal = () => {
        setEditingLinkId(null);
        setLinkForm({
            title: 'Link Akses Aplikasi',
            slugOrToken: generateRandomLinkToken('stifin'),
            status: 'aktif',
            tanggalAwal: formatDateYMD(new Date()),
            tanggalBerakhir: formatDateYMD(addDays(new Date(), 30)),
            assignedUser: ''
        });
        setIsLinkModalOpen(true);
    };

    const openEditLinkModal = (l: AppLinkItem) => {
        setEditingLinkId(l.id);
        setLinkForm({
            title: l.title,
            slugOrToken: l.slugOrToken,
            status: l.status,
            tanggalAwal: l.tanggalAwal,
            tanggalBerakhir: l.tanggalBerakhir,
            assignedUser: l.assignedUser || ''
        });
        setIsLinkModalOpen(true);
    };

    const handleSaveLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkForm.slugOrToken.trim()) {
            showToast('Token / Slug link tidak boleh kosong!', 'error');
            return;
        }

        AccessStorageService.saveAppLink({
            id: editingLinkId || undefined,
            title: linkForm.title.trim() || 'Link Akses Aplikasi',
            slugOrToken: linkForm.slugOrToken.trim(),
            fullUrl: '',
            status: linkForm.status,
            tanggalAwal: linkForm.tanggalAwal,
            tanggalBerakhir: linkForm.tanggalBerakhir,
            assignedUser: linkForm.assignedUser.trim() || undefined
        });

        refreshData();
        setIsLinkModalOpen(false);
        showToast(editingLinkId ? 'Link aplikasi berhasil diperbarui!' : 'Link aplikasi baru berhasil dibuat!', 'success');
    };

    const handleDeleteLink = (id: string) => {
        if (confirm('Hapus link akses aplikasi ini?')) {
            AccessStorageService.deleteAppLink(id);
            refreshData();
            showToast('Link aplikasi telah dihapus.', 'info');
        }
    };

    const handleToggleLinkStatus = (id: string) => {
        const l = AccessStorageService.toggleLinkStatus(id);
        if (l) {
            refreshData();
            showToast(`Status link diubah menjadi: ${l.status.toUpperCase()}`, 'info');
        }
    };

    // WhatsApp Message Share Template
    const handleShareWhatsapp = (u: AccessUser) => {
        const link = u.accessLink || `${window.location.origin}${window.location.pathname}?token=${u.token}`;
        const text = `Halo *${u.nama}*,\n\nBerikut adalah kredensial akses Aplikasi *STIFIn Ultimate Analytics Suite* Anda:\n\n🔑 *Password Akses:* ${u.passcode}\n🔗 *Link Akses Langsung:* ${link}\n📅 *Masa Aktif:* ${u.tanggalAwal} s/d ${u.tanggalBerakhir}\n\n*Catatan:* Jika melewati tanggal ${u.tanggalBerakhir}, akses aplikasi akan otomatis dinonaktifkan.\n\nSelamat mengeksplorasi kecerdasan STIFIn! ✨`;
        const url = `https://wa.me/${u.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    // Filtered Users
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesQuery =
                u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.whatsapp.includes(searchQuery) ||
                u.passcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.stifinType.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesQuery) return false;

            if (roleFilter !== 'all' && u.role !== roleFilter) return false;

            const dateCheck = AccessStorageService.checkDateValidity(u.tanggalAwal, u.tanggalBerakhir);
            if (statusFilter === 'all') return true;
            if (statusFilter === 'aktif') return u.status === 'aktif' && dateCheck.status === 'active';
            if (statusFilter === 'nonaktif') return u.status === 'nonaktif';
            if (statusFilter === 'expired') return dateCheck.status === 'expired';
            return true;
        });
    }, [users, searchQuery, statusFilter, roleFilter]);

    // Statistics Counts
    const stats = useMemo(() => {
        let activeCount = 0;
        let expiredCount = 0;
        let inactiveCount = 0;
        let masterAdminCount = 0;
        let promotorCount = 0;
        let clientCount = 0;

        users.forEach(u => {
            if (u.role === 'master_admin') masterAdminCount++;
            else if (u.role === 'promotor') promotorCount++;
            else clientCount++;

            if (u.status === 'nonaktif') {
                inactiveCount++;
            } else {
                const check = AccessStorageService.checkDateValidity(u.tanggalAwal, u.tanggalBerakhir);
                if (check.status === 'expired') {
                    expiredCount++;
                } else if (check.status === 'active') {
                    activeCount++;
                }
            }
        });

        return {
            totalUsers: users.length,
            activeCount,
            expiredCount,
            inactiveCount,
            masterAdminCount,
            promotorCount,
            clientCount,
            totalPasscodes: passcodes.length,
            totalLinks: links.length
        };
    }, [users, passcodes, links]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                
                {/* TOP HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
                            <Shield size={26} className="text-blue-300" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Dashboard Master Admin</h2>
                                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Full Control Center
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Kontrol penuh seluruh fitur aplikasi: pengguna, database klien, password, link &amp; status sistem
                            </p>
                        </div>
                    </div>

                    {/* Actions: Buka Dashboard Promotor & Global App Status Switch */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                        {onOpenPromotorDashboard && (
                            <button
                                type="button"
                                onClick={() => onOpenPromotorDashboard()}
                                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                                title="Buka Dashboard Promotor (Input & Kelola Klien)"
                            >
                                💼 Buka Dashboard Promotor
                            </button>
                        )}

                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                            config.appStatus === 'aktif'
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-red-500/20 border-red-500/40 text-red-300'
                        }`}>
                            <Power size={16} className={config.appStatus === 'aktif' ? 'text-emerald-400' : 'text-red-400'} />
                            <div className="text-left">
                                <span className="text-[10px] block font-bold uppercase tracking-wider text-slate-300">Status Aplikasi</span>
                                <span className="text-xs font-black uppercase">
                                    {config.appStatus === 'aktif' ? 'Aktif (Online)' : 'Nonaktif (Maintenance)'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleGlobalAppStatus}
                                className={`ml-2 px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase transition-colors ${
                                    config.appStatus === 'aktif'
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        : 'bg-red-600 hover:bg-red-500 text-white'
                                }`}
                                title="Klik untuk mengaktifkan / menonaktifkan seluruh akses aplikasi"
                            >
                                {config.appStatus === 'aktif' ? 'Matikan' : 'Aktifkan'}
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* STATS STRIP */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 bg-slate-50 border-b border-slate-200">
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Pengguna</span>
                            <span className="text-xl font-black text-slate-900">{stats.totalUsers}</span>
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Akses Aktif</span>
                            <span className="text-xl font-black text-emerald-600">{stats.activeCount}</span>
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Kadaluarsa (Expired)</span>
                            <span className="text-xl font-black text-rose-600">{stats.expiredCount}</span>
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <XCircle size={20} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Status Nonaktif</span>
                            <span className="text-xl font-black text-amber-600">{stats.inactiveCount}</span>
                        </div>
                    </div>
                </div>

                {/* TAB NAVIGATION */}
                <div className="flex border-b border-slate-200 px-4 sm:px-6 gap-2 bg-white overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'users'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                        }`}
                    >
                        <Users size={16} /> Database Pengguna ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('passwords')}
                        className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'passwords'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                        }`}
                    >
                        <Key size={16} /> Kelola Password ({passcodes.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('links')}
                        className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'links'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                        }`}
                    >
                        <LinkIcon size={16} /> Kelola Link Aplikasi ({links.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`py-3.5 px-4 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                            activeTab === 'settings'
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                        }`}
                    >
                        <Settings size={16} /> Pengaturan Sistem & Database
                    </button>
                </div>

                {/* TOAST MESSAGE */}
                {toastMsg && (
                    <div className={`mx-6 mt-4 p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
                        toastMsg.type === 'error'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : toastMsg.type === 'info'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                        <div className="flex items-center gap-2">
                            {toastMsg.type === 'error' ? <AlertTriangle size={16} /> : <Check size={16} />}
                            <span>{toastMsg.text}</span>
                        </div>
                        <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                    </div>
                )}

                {/* BODY CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">

                    {/* ==================================================== */}
                    {/* TAB 1: DATABASE PENGGUNA */}
                    {/* ==================================================== */}
                    {activeTab === 'users' && (
                        <div className="space-y-4">
                            {/* Controls: Search, Filter, + Tambah Pengguna */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                                <div className="flex flex-1 items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Cari nama, email, whatsapp, password..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={e => setStatusFilter(e.target.value as any)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="aktif">🟢 Aktif & Berjalan</option>
                                        <option value="expired">⏳ Kadaluarsa (Expired)</option>
                                        <option value="nonaktif">🔴 Nonaktif</option>
                                    </select>
                                    <select
                                        value={roleFilter}
                                        onChange={e => setRoleFilter(e.target.value as any)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 font-bold"
                                    >
                                        <option value="all">Semua Hak Akses</option>
                                        <option value="master_admin">👑 Master Admin ({stats.masterAdminCount})</option>
                                        <option value="promotor">💼 Promotor ({stats.promotorCount})</option>
                                        <option value="client">👤 Client ({stats.clientCount})</option>
                                    </select>
                                </div>

                                <button
                                    onClick={openCreateUserModal}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                                >
                                    <Plus size={16} /> Buat Pengguna Baru
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                                                <th className="py-3 px-4">Pengguna &amp; Kontak</th>
                                                <th className="py-3 px-4">Hak Akses (Role)</th>
                                                <th className="py-3 px-4">MK &amp; Biometrik</th>
                                                <th className="py-3 px-4">Password Akses</th>
                                                <th className="py-3 px-4">Link Aplikasi</th>
                                                <th className="py-3 px-4">Masa Aktif Akses</th>
                                                <th className="py-3 px-4 text-center">Status</th>
                                                <th className="py-3 px-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs">
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                                        <Database size={36} className="mx-auto mb-2 opacity-30" />
                                                        <p className="font-bold">Tidak ada data pengguna yang cocok</p>
                                                        <p className="text-[11px] text-slate-400">Klik "Buat Pengguna Baru" untuk menambahkan pengguna ke database.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredUsers.map(u => {
                                                    const dateCheck = AccessStorageService.checkDateValidity(u.tanggalAwal, u.tanggalBerakhir);
                                                    const isExpired = dateCheck.status === 'expired';
                                                    const isNotStarted = dateCheck.status === 'not_started';
                                                    const isPasswordRevealed = !!revealedPasswords[u.id];

                                                    return (
                                                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                                                            {/* User Info */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="font-bold text-slate-900 text-sm">{u.nama}</div>
                                                                <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[11px]">
                                                                    <span className="flex items-center gap-1"><Phone size={11} /> {u.whatsapp || '-'}</span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1"><Mail size={11} /> {u.email || '-'}</span>
                                                                </div>
                                                                {u.catatan && (
                                                                    <div className="text-[10px] text-slate-400 italic mt-0.5 max-w-xs truncate">
                                                                        {u.catatan}
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {/* Role / Hak Akses */}
                                                            <td className="py-3.5 px-4">
                                                                {u.role === 'master_admin' && (
                                                                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                                                                        👑 Master Admin
                                                                    </span>
                                                                )}
                                                                {u.role === 'promotor' && (
                                                                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                                                                        💼 Promotor
                                                                    </span>
                                                                )}
                                                                {u.role === 'client' && (
                                                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
                                                                        👤 Client
                                                                    </span>
                                                                )}
                                                                {u.createdByPromotorName && (
                                                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                                                        Oleh: {u.createdByPromotorName}
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {/* STIFIn Type */}
                                                            <td className="py-3.5 px-4">
                                                                <span
                                                                    className="inline-block px-2.5 py-1 rounded-lg font-black text-xs text-white"
                                                                    style={{ backgroundColor: STIFIN_DATA.personalities[u.stifinType]?.hex || '#3b82f6' }}
                                                                >
                                                                    {u.stifinType}
                                                                </span>
                                                                <div className="text-[10px] font-bold text-slate-500 mt-1">
                                                                    Gol. Darah: {u.bloodType || 'O'}
                                                                </div>
                                                            </td>

                                                            {/* Passcode with Generator/Revealer */}
                                                            <td className="py-3.5 px-4 font-mono">
                                                                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200 w-fit">
                                                                    <span className="font-bold text-slate-800">
                                                                        {isPasswordRevealed ? u.passcode : '••••••••'}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setRevealedPasswords(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                                                                        className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                                                        title={isPasswordRevealed ? 'Sembunyikan' : 'Lihat'}
                                                                    >
                                                                        {isPasswordRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => copyToClipboard(u.passcode, 'Password')}
                                                                        className="p-1 hover:bg-slate-200 rounded text-slate-500"
                                                                        title="Salin Password"
                                                                    >
                                                                        <Copy size={13} />
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            {/* Link Aplikasi */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => copyToClipboard(u.accessLink || `${window.location.origin}${window.location.pathname}?token=${u.token}`, 'Link Akses')}
                                                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                                                                        title="Salin Link Langsung"
                                                                    >
                                                                        <Copy size={12} /> Salin Link
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (onAccessGrantedAsUser) onAccessGrantedAsUser(u);
                                                                        }}
                                                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg"
                                                                        title="Buka Aplikasi sebagai Pengguna Ini (Simulasi)"
                                                                    >
                                                                        <ExternalLink size={13} />
                                                                    </button>
                                                                </div>
                                                                <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                                                                    token: {u.token}
                                                                </span>
                                                            </td>

                                                            {/* Masa Aktif Akses */}
                                                            <td className="py-3.5 px-4">
                                                                <div className="font-medium text-slate-700 text-[11px]">
                                                                    <div>Mulai: <strong className="text-slate-900">{u.tanggalAwal}</strong></div>
                                                                    <div>Berakhir: <strong className="text-slate-900">{u.tanggalBerakhir}</strong></div>
                                                                </div>
                                                                <div className="mt-1">
                                                                    {isExpired ? (
                                                                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                                                            <AlertTriangle size={11} /> Expired ({Math.abs(dateCheck.remainingDays)} hari lalu)
                                                                        </span>
                                                                    ) : isNotStarted ? (
                                                                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                                                            <Clock size={11} /> Belum Mulai ({dateCheck.remainingDays} hari lagi)
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                                                            <CheckCircle size={11} /> Aktif (Sisa {dateCheck.remainingDays} hari)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Status Aktif / Nonaktif */}
                                                            <td className="py-3.5 px-4 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleToggleUserStatus(u.id)}
                                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-colors ${
                                                                        u.status === 'aktif'
                                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                                            : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                                                                    }`}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                                    {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                                </button>
                                                            </td>

                                                            {/* Actions */}
                                                            <td className="py-3.5 px-4 text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleShareWhatsapp(u)}
                                                                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg"
                                                                        title="Kirim Kredensial via WhatsApp"
                                                                    >
                                                                        <Share2 size={13} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openEditUserModal(u)}
                                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg"
                                                                        title="Edit Data Pengguna"
                                                                    >
                                                                        <Edit size={13} />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDeleteUser(u.id, u.nama)}
                                                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg"
                                                                        title="Hapus Pengguna"
                                                                    >
                                                                        <Trash2 size={13} />
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
                    )}

                    {/* ==================================================== */}
                    {/* TAB 2: KELOLA PASSWORD (CRUD & GENERATOR) */}
                    {/* ==================================================== */}
                    {activeTab === 'passwords' && (
                        <div className="space-y-6">
                            {/* Generator Quick Tool */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 mb-4">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                            <Sparkles size={16} className="text-amber-500" /> Generator Password Akses Instan
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Buat password acak yang kuat atau terstruktur untuk dibagikan kepada calon pengguna aplikasi.
                                        </p>
                                    </div>

                                    <button
                                        onClick={openCreatePasscodeModal}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Buat Password Baru
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Format Password</label>
                                        <select
                                            value={genFormat}
                                            onChange={e => setGenFormat(e.target.value as any)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                                        >
                                            <option value="readable">Kata + Angka (STIFIN-8821)</option>
                                            <option value="alphanumeric">Alfanumerik Acak (A8K9P2X)</option>
                                            <option value="numeric">PIN Numerik (6 Digit)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Panjang Karakter</label>
                                        <input
                                            type="number"
                                            min={4}
                                            max={20}
                                            value={genLength}
                                            onChange={e => setGenLength(Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 flex items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const pwd = generateRandomPassword(genFormat, genLength);
                                                copyToClipboard(pwd, 'Password baru');
                                            }}
                                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <RefreshCw size={14} /> Generate & Salin Langsung
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Passwords List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                                <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
                                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">
                                        Daftar Password Akses Terdaftar ({passcodes.length})
                                    </h4>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {passcodes.map(p => {
                                        const dateCheck = AccessStorageService.checkDateValidity(p.tanggalAwal, p.tanggalBerakhir);
                                        const isExpired = dateCheck.status === 'expired';

                                        return (
                                            <div key={p.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                                            {p.code}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(p.code, 'Password')}
                                                            className="p-1 hover:bg-slate-200 text-slate-500 rounded"
                                                            title="Salin Password"
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                        <span className="font-semibold text-xs text-slate-700">{p.label}</span>
                                                    </div>

                                                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                                                        <span>Masa Berlaku: <strong>{p.tanggalAwal}</strong> s/d <strong>{p.tanggalBerakhir}</strong></span>
                                                        <span>•</span>
                                                        {isExpired ? (
                                                            <span className="text-red-600 font-bold">Kadaluarsa</span>
                                                        ) : (
                                                            <span className="text-emerald-600 font-bold">Aktif (Sisa {dateCheck.remainingDays} hari)</span>
                                                        )}
                                                        <span>•</span>
                                                        <span>Digunakan: {p.usedCount || 0}x</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleTogglePasscodeStatus(p.id)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                                                            p.status === 'aktif'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                                                        }`}
                                                    >
                                                        {p.status === 'aktif' ? '🟢 Aktif' : '🔴 Nonaktif'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditPasscodeModal(p)}
                                                        className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl"
                                                        title="Edit Password"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePasscode(p.id)}
                                                        className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl"
                                                        title="Hapus Password"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* TAB 3: KELOLA LINK APLIKASI (CRUD & GENERATOR) */}
                    {/* ==================================================== */}
                    {activeTab === 'links' && (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <LinkIcon size={16} className="text-blue-600" /> Link Akses Aplikasi Terintegrasi
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Generate link khusus dengan token otomatis agar pengguna bisa langsung masuk ke aplikasi STIFIn tanpa mengetik password manual.
                                    </p>
                                </div>

                                <button
                                    onClick={openCreateLinkModal}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0"
                                >
                                    <Plus size={16} /> Generate Link Baru
                                </button>
                            </div>

                            {/* Links List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                                <div className="divide-y divide-slate-100">
                                    {links.map(l => {
                                        const dateCheck = AccessStorageService.checkDateValidity(l.tanggalAwal, l.tanggalBerakhir);
                                        const isExpired = dateCheck.status === 'expired';
                                        const fullUrl = l.fullUrl || `${window.location.origin}${window.location.pathname}?token=${l.slugOrToken}`;

                                        return (
                                            <div key={l.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors space-y-2">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                                            {l.title}
                                                            {l.assignedUser && (
                                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                                                                    User: {l.assignedUser}
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                                                            <span>Masa Aktif: <strong>{l.tanggalAwal}</strong> s/d <strong>{l.tanggalBerakhir}</strong></span>
                                                            <span>•</span>
                                                            {isExpired ? (
                                                                <span className="text-red-600 font-bold">Kadaluarsa</span>
                                                            ) : (
                                                                <span className="text-emerald-600 font-bold">Aktif (Sisa {dateCheck.remainingDays} hari)</span>
                                                            )}
                                                            <span>•</span>
                                                            <span>Klik: {l.clicks || 0}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleLinkStatus(l.id)}
                                                            className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                                                l.status === 'aktif'
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                                                            }`}
                                                        >
                                                            {l.status === 'aktif' ? '🟢 Aktif' : '🔴 Nonaktif'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditLinkModal(l)}
                                                            className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl"
                                                            title="Edit Link"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteLink(l.id)}
                                                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl"
                                                            title="Hapus Link"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                                    <span className="font-mono text-xs text-blue-700 truncate flex-1 select-all">
                                                        {fullUrl}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(fullUrl, 'Link Akses')}
                                                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 shrink-0"
                                                    >
                                                        <Copy size={13} /> Salin Link
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* TAB 4: PENGATURAN SISTEM & DATABASE */}
                    {/* ==================================================== */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* App Switch & Maintenance Notice */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Power size={18} className="text-blue-600" /> Kontrol Status Aplikasi (Fitur Aktif / Nonaktif)
                                </h3>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div>
                                        <div className="font-extrabold text-slate-900 text-sm">Status Operasional Aplikasi STIFIn</div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Jika dimatikan, seluruh akses umum (password & link) akan dikunci dan menampilkan layar informasi maintenance.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleToggleGlobalAppStatus}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
                                            config.appStatus === 'aktif'
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                                                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                                        }`}
                                    >
                                        <Power size={14} />
                                        {config.appStatus === 'aktif' ? 'Status: AKTIF' : 'Status: NONAKTIF'}
                                    </button>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Pesan Pemeliharaan (Jika Aplikasi Nonaktif)</label>
                                    <textarea
                                        rows={3}
                                        value={config.maintenanceMessage}
                                        onChange={e => {
                                            const updated = AccessStorageService.updateGlobalConfig({ maintenanceMessage: e.target.value });
                                            setConfig(updated);
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 font-medium"
                                    />
                                </div>
                            </div>

                            {/* PIN Keamanan Admin */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Lock size={18} className="text-blue-600" /> PIN Akses Dashboard Manajemen
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">PIN Keamanan (Default: 3308)</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={config.adminPin}
                                            onChange={e => {
                                                const updated = AccessStorageService.updateGlobalConfig({ adminPin: e.target.value });
                                                setConfig(updated);
                                            }}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:border-blue-500"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">Gunakan PIN ini untuk membuka Dashboard Manajemen dari tombol login.</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">URL Integrasi Spreadsheet (Opsional)</label>
                                        <input
                                            type="url"
                                            value={config.scriptUrl}
                                            onChange={e => {
                                                const updated = AccessStorageService.updateGlobalConfig({ scriptUrl: e.target.value });
                                                setConfig(updated);
                                            }}
                                            placeholder="https://script.google.com/macros/s/.../exec"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Backup & Restore Database */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                    <Database size={18} className="text-blue-600" /> Cadangkan & Pulihkan Database
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const jsonStr = AccessStorageService.exportDatabase();
                                            const blob = new Blob([jsonStr], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `stifin_access_db_backup_${formatDateYMD(new Date())}.json`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                            showToast('Database berhasil diunduh sebagai JSON!', 'success');
                                        }}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
                                    >
                                        <Download size={14} /> Unduh Cadangan Database (.JSON)
                                    </button>

                                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors border border-slate-300">
                                        <Upload size={14} /> Pulihkan Database dari File
                                        <input
                                            type="file"
                                            accept=".json"
                                            className="hidden"
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = ev => {
                                                        const content = ev.target?.result as string;
                                                        if (AccessStorageService.importDatabase(content)) {
                                                            refreshData();
                                                            showToast('Database berhasil dipulihkan!', 'success');
                                                        } else {
                                                            showToast('Format file JSON tidak valid!', 'error');
                                                        }
                                                    };
                                                    reader.readAsText(file);
                                                }
                                            }}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Kembalikan database ke data bawaan awal? Semua data tambahan akan direset.')) {
                                                AccessStorageService.resetToDefaults();
                                                refreshData();
                                                showToast('Database telah direset ke data awal.', 'info');
                                            }
                                        }}
                                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-4 py-2.5 rounded-xl ml-auto"
                                    >
                                        Reset ke Data Awal
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ==================================================== */}
            {/* MODAL: FORM PENGGUNA (TAMBAH / EDIT) */}
            {/* ==================================================== */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">
                                    {editingUserId ? 'Edit Pengguna Aplikasi' : 'Buat Pengguna Aplikasi Baru'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Atur kredensial, masa aktif akses, password, dan link aplikasi
                                </p>
                            </div>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-4">
                            {/* Hak Akses / Role Pengguna */}
                            <div>
                                <label className="text-xs font-black text-slate-800 uppercase tracking-wide block mb-1.5">
                                    Hak Akses (Role Pengguna) *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setUserForm({ ...userForm, role: 'master_admin' })}
                                        className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                                            userForm.role === 'master_admin'
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        👑 Master Admin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserForm({ ...userForm, role: 'promotor' })}
                                        className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                                            userForm.role === 'promotor'
                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        💼 Promotor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserForm({ ...userForm, role: 'client' })}
                                        className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                                            userForm.role === 'client'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        👤 Client
                                    </button>
                                </div>
                            </div>

                            {/* Nama Lengkap */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                                    Nama Lengkap Subjek / Klien *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={userForm.nama}
                                    onChange={e => setUserForm({ ...userForm, nama: e.target.value })}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                                />
                            </div>

                            {/* WhatsApp & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                                        No. WhatsApp / HP
                                    </label>
                                    <input
                                        type="tel"
                                        value={userForm.whatsapp}
                                        onChange={e => setUserForm({ ...userForm, whatsapp: e.target.value })}
                                        placeholder="08123456789"
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={userForm.email}
                                        onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* STIFIn Type & Blood Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                                        Mesin Kecerdasan (MK)
                                    </label>
                                    <select
                                        value={userForm.stifinType}
                                        onChange={e => setUserForm({ ...userForm, stifinType: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                                    >
                                        {Object.keys(STIFIN_DATA.personalities).map(code => (
                                            <option key={code} value={code}>
                                                {code} - {STIFIN_DATA.personalities[code].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                                        Golongan Darah
                                    </label>
                                    <select
                                        value={userForm.bloodType}
                                        onChange={e => setUserForm({ ...userForm, bloodType: e.target.value as any })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="O">Golongan Darah O</option>
                                        <option value="A">Golongan Darah A</option>
                                        <option value="B">Golongan Darah B</option>
                                        <option value="AB">Golongan Darah AB</option>
                                    </select>
                                </div>
                            </div>

                            {/* Password Akses with Generator */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                        Password Akses Aplikasi *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setUserForm(prev => ({ ...prev, passcode: generateRandomPassword('readable') }))}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <RefreshCw size={12} /> Auto-Generate
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={userForm.passcode}
                                    onChange={e => setUserForm({ ...userForm, passcode: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="Ketik atau generate password..."
                                />
                            </div>

                            {/* Link Token with Generator */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                                        Token Link Akses Langsung
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setUserForm(prev => ({ ...prev, token: generateRandomLinkToken(prev.stifinType.toLowerCase()) }))}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <RefreshCw size={12} /> Auto-Generate
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={userForm.token}
                                    onChange={e => setUserForm({ ...userForm, token: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-500"
                                    placeholder="Token unik URL (contoh: stifin-si-budi)"
                                />
                            </div>

                            {/* Masa Aktif Akses (Tanggal Awal & Tanggal Berakhir) */}
                            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                                        <Calendar size={14} className="text-blue-600" /> Masa Aktif Akses Aplikasi
                                    </label>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(7)}
                                            className="px-2 py-0.5 bg-white text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100"
                                        >
                                            +7 Hari
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(30)}
                                            className="px-2 py-0.5 bg-white text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100"
                                        >
                                            +30 Hari
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(90)}
                                            className="px-2 py-0.5 bg-white text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100"
                                        >
                                            +90 Hari
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationPreset(365)}
                                            className="px-2 py-0.5 bg-white text-blue-700 border border-blue-200 rounded text-[10px] font-bold hover:bg-blue-100"
                                        >
                                            +1 Tahun
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal Mulai Aktif:</span>
                                        <input
                                            type="date"
                                            required
                                            value={userForm.tanggalAwal}
                                            onChange={e => setUserForm({ ...userForm, tanggalAwal: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Tanggal Berakhir (Expired):</span>
                                        <input
                                            type="date"
                                            required
                                            value={userForm.tanggalBerakhir}
                                            onChange={e => setUserForm({ ...userForm, tanggalBerakhir: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] text-blue-800 font-medium">
                                    💡 Jika melewati tanggal berakhir, aplikasi akan otomatis memblokir akses dan menampilkan peringatan expired.
                                </p>
                            </div>

                            {/* Status Pengguna (Aktif / Nonaktif) */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-xs font-bold text-slate-700">Status Akses Pengguna</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setUserForm({ ...userForm, status: 'aktif' })}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                                            userForm.status === 'aktif'
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-white text-slate-600 border border-slate-300'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUserForm({ ...userForm, status: 'nonaktif' })}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors ${
                                            userForm.status === 'nonaktif'
                                                ? 'bg-rose-600 text-white shadow-xs'
                                                : 'bg-white text-slate-600 border border-slate-300'
                                        }`}
                                    >
                                        Nonaktif
                                    </button>
                                </div>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">Catatan Lisensi / Kebutuhan</label>
                                <textarea
                                    rows={2}
                                    value={userForm.catatan}
                                    onChange={e => setUserForm({ ...userForm, catatan: e.target.value })}
                                    placeholder="Contoh: Paket Konsultasi 30 Hari, Klien Perusahaan..."
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Form Buttons */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsUserModalOpen(false)}
                                    className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
                                >
                                    {editingUserId ? 'Simpan Perubahan' : 'Simpan Pengguna ke Database'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================================================== */}
            {/* MODAL: FORM PASSCODE (TAMBAH / EDIT) */}
            {/* ==================================================== */}
            {isPasscodeModalOpen && (
                <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-base font-black text-slate-900">
                                {editingPasscodeId ? 'Edit Password Akses' : 'Buat Password Akses Baru'}
                            </h3>
                            <button onClick={() => setIsPasscodeModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSavePasscode} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Kode Password *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={passcodeForm.code}
                                        onChange={e => setPasscodeForm({ ...passcodeForm, code: e.target.value })}
                                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasscodeForm(prev => ({ ...prev, code: generateRandomPassword(genFormat, genLength) }))}
                                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                                        title="Generate baru"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Keterangan / Label</label>
                                <input
                                    type="text"
                                    value={passcodeForm.label}
                                    onChange={e => setPasscodeForm({ ...passcodeForm, label: e.target.value })}
                                    placeholder="Contoh: Lisensi Training Angkatan 5"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        required
                                        value={passcodeForm.tanggalAwal}
                                        onChange={e => setPasscodeForm({ ...passcodeForm, tanggalAwal: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Berakhir</label>
                                    <input
                                        type="date"
                                        required
                                        value={passcodeForm.tanggalBerakhir}
                                        onChange={e => setPasscodeForm({ ...passcodeForm, tanggalBerakhir: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-xs font-bold text-slate-700">Status Password</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPasscodeForm({ ...passcodeForm, status: 'aktif' })}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            passcodeForm.status === 'aktif' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPasscodeForm({ ...passcodeForm, status: 'nonaktif' })}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            passcodeForm.status === 'nonaktif' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600'
                                        }`}
                                    >
                                        Nonaktif
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPasscodeModalOpen(false)}
                                    className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                                >
                                    Simpan Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================================================== */}
            {/* MODAL: FORM LINK APLIKASI (TAMBAH / EDIT) */}
            {/* ==================================================== */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-base font-black text-slate-900">
                                {editingLinkId ? 'Edit Link Aplikasi' : 'Buat Link Aplikasi Baru'}
                            </h3>
                            <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveLink} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Judul / Keterangan Link *</label>
                                <input
                                    type="text"
                                    required
                                    value={linkForm.title}
                                    onChange={e => setLinkForm({ ...linkForm, title: e.target.value })}
                                    placeholder="Contoh: Link Akses Klien VIP"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Token / Slug Link *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={linkForm.slugOrToken}
                                        onChange={e => setLinkForm({ ...linkForm, slugOrToken: e.target.value })}
                                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setLinkForm(prev => ({ ...prev, slugOrToken: generateRandomLinkToken('stifin') }))}
                                        className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                                        title="Generate token acak"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        required
                                        value={linkForm.tanggalAwal}
                                        onChange={e => setLinkForm({ ...linkForm, tanggalAwal: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Berakhir</label>
                                    <input
                                        type="date"
                                        required
                                        value={linkForm.tanggalBerakhir}
                                        onChange={e => setLinkForm({ ...linkForm, tanggalBerakhir: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <span className="text-xs font-bold text-slate-700">Status Link</span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setLinkForm({ ...linkForm, status: 'aktif' })}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            linkForm.status === 'aktif' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLinkForm({ ...linkForm, status: 'nonaktif' })}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            linkForm.status === 'nonaktif' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600'
                                        }`}
                                    >
                                        Nonaktif
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                                >
                                    Simpan Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};
