/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Lock,
    Eye,
    EyeOff,
    User,
    LogOut,
    Brain,
    BarChart3,
    ChevronDown,
    Printer,
    Activity,
    Cpu,
    Compass,
    Globe,
    GraduationCap,
    PieChart,
    Coins,
    Briefcase,
    Users,
    HeartPulse,
    Sparkles,
    Shield,
    AlertTriangle,
    Clock,
    Power,
    CheckCircle,
    Calendar,
    ArrowLeft,
    Share2,
    Settings,
    UserCheck
} from 'lucide-react';
import { STIFIN_DATA } from './data/stifinData';
import { AccessManagementDashboard } from './components/AccessManagementDashboard';
import { PromotorDashboard } from './components/PromotorDashboard';
import { AccessStorageService, formatDateYMD } from './services/accessStorage';
import { AccessUser, AccessValidationResult, UserRole } from './types/access';

// Declare html2pdf for window
declare const html2pdf: any;

// Authentic STIFIn Logo Component
export const StifinLogo: React.FC<{ size?: number; showText?: boolean; className?: string }> = ({
    size = 40,
    showText = true,
    className = ''
}) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 filter drop-shadow"
            >
                <path d="M 50 40 A 82 82 0 0 1 110 20" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" />
                <path d="M 125 22 A 82 82 0 0 1 180 75" stroke="#eab308" strokeWidth="16" strokeLinecap="round" />
                <path d="M 180 120 A 82 82 0 0 1 110 180" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                <path d="M 92 182 A 82 82 0 0 1 35 150" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                <path d="M 25 135 A 82 82 0 0 1 38 55" stroke="#3b82f6" strokeWidth="16" strokeLinecap="round" />
                <circle cx="128" cy="52" r="15" fill="#14b8a6" />
                <path d="M 75 12 C 60 40, 70 80, 115 110 C 135 122, 125 155, 105 180 C 120 160, 140 125, 118 100 C 85 65, 80 30, 75 12 Z" fill="#06b6d4" />
                <path d="M 38 185 C 50 140, 90 90, 170 80 C 160 90, 100 100, 58 145 C 48 156, 42 172, 38 185 Z" fill="#22c55e" />
            </svg>
            {showText && (
                <div className="flex flex-col justify-center leading-tight">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">S T I F I n</span>
                    <span className="text-xs font-extrabold tracking-widest uppercase text-slate-900 print-text-dark">CHARACTER</span>
                    <span className="text-[11px] font-bold tracking-wider lowercase text-blue-600">academy</span>
                </div>
            )}
        </div>
    );
};

export default function App() {
    const [currentView, setCurrentView] = useState<'login' | 'blocked' | 'onboarding' | 'dashboard' | 'promotor'>('login');
    const [authenticatedUser, setAuthenticatedUser] = useState<AccessUser | null>(null);
    const [validationError, setValidationError] = useState<AccessValidationResult | null>(null);
    const [userData, setUserData] = useState<{ name: string; bloodType: string; personality: string } | null>(null);

    // Admin Dashboard Modal state
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [accessPin, setAccessPin] = useState('');
    const [pinError, setPinError] = useState('');

    // Check link URL tokens on mount (e.g., ?token=... or ?link=...)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const linkToken = params.get('token') || params.get('link') || params.get('access_token');

        if (linkToken) {
            const validation = AccessStorageService.validateAccess({ token: linkToken });
            if (validation.isValid) {
                if (validation.user) {
                    setAuthenticatedUser(validation.user);
                    localStorage.setItem('stifin_auth', 'true');
                    localStorage.setItem('stifin_auth_user', JSON.stringify(validation.user));

                    if (validation.user.role === 'promotor') {
                        setCurrentView('promotor');
                        return;
                    }
                    if (validation.user.role === 'master_admin') {
                        setShowAdminDashboard(true);
                        return;
                    }

                    const stifinData = {
                        name: validation.user.nama,
                        bloodType: validation.user.bloodType || 'O',
                        personality: validation.user.stifinType
                    };
                    setUserData(stifinData);
                    localStorage.setItem('stifin_user_data', JSON.stringify(stifinData));
                    setCurrentView('dashboard');
                } else {
                    localStorage.setItem('stifin_auth', 'true');
                    setCurrentView('onboarding');
                }
                return;
            } else {
                setValidationError(validation);
                setCurrentView('blocked');
                return;
            }
        }

        // Check local storage session
        const storedAuth = localStorage.getItem('stifin_auth');
        const storedUser = localStorage.getItem('stifin_auth_user');
        const storedData = localStorage.getItem('stifin_user_data');

        if (storedAuth === 'true') {
            if (storedUser) {
                try {
                    const u: AccessUser = JSON.parse(storedUser);
                    setAuthenticatedUser(u);
                    if (u.role === 'promotor') {
                        setCurrentView('promotor');
                        return;
                    }
                } catch (e) {}
            }
            if (storedData) {
                try {
                    setUserData(JSON.parse(storedData));
                    setCurrentView('dashboard');
                    return;
                } catch (e) {}
            }
            setCurrentView('onboarding');
        }
    }, []);

    // Handle Login authentication for all 3 roles: Master Admin, Promotor, Client
    const handleLogin = (passcode: string, expectedRole?: UserRole) => {
        const result = AccessStorageService.validateAccess({ passcode });
        if (result.isValid) {
            if (expectedRole && result.user && result.user.role !== expectedRole) {
                const roleLabels: Record<UserRole, string> = {
                    master_admin: 'Master Admin',
                    promotor: 'Promotor',
                    client: 'Client'
                };
                return {
                    success: false,
                    reason: `Password yang dimasukkan adalah untuk hak akses '${roleLabels[result.user.role] || result.user.role}', bukan '${roleLabels[expectedRole]}'.`
                };
            }

            localStorage.setItem('stifin_auth', 'true');
            if (result.user) {
                setAuthenticatedUser(result.user);
                localStorage.setItem('stifin_auth_user', JSON.stringify(result.user));

                if (result.user.role === 'master_admin') {
                    // Master Admin: open Master Admin Dashboard
                    setShowAdminDashboard(true);
                    return { success: true };
                } else if (result.user.role === 'promotor') {
                    // Promotor: open Dashboard Promotor
                    setCurrentView('promotor');
                    return { success: true };
                } else {
                    // Client: open Client STIFIn Analytics
                    const prepData = {
                        name: result.user.nama,
                        bloodType: result.user.bloodType || 'O',
                        personality: result.user.stifinType
                    };
                    setUserData(prepData);
                    localStorage.setItem('stifin_user_data', JSON.stringify(prepData));
                    setCurrentView('dashboard');
                    return { success: true };
                }
            } else {
                setCurrentView('onboarding');
            }
            return { success: true };
        } else {
            // Blocked or invalid
            if (result.reason !== 'not_found') {
                setValidationError(result);
                setCurrentView('blocked');
            }
            return { success: false, reason: result.message };
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('stifin_auth');
        localStorage.removeItem('stifin_auth_user');
        localStorage.removeItem('stifin_user_data');
        setAuthenticatedUser(null);
        setUserData(null);
        setCurrentView('login');
    };

    const handleVerifyPin = (e: React.FormEvent) => {
        e.preventDefault();
        const globalConfig = AccessStorageService.getGlobalConfig();
        const targetPin = globalConfig.adminPin || '3308';

        if (accessPin === targetPin) {
            setPinError('');
            setShowPinModal(false);
            setAccessPin('');
            setShowAdminDashboard(true);
        } else {
            setPinError('PIN salah! Akses ditolak.');
        }
    };

    const handleAccessGrantedAsUser = (user: AccessUser) => {
        setShowAdminDashboard(false);
        setAuthenticatedUser(user);
        localStorage.setItem('stifin_auth_user', JSON.stringify(user));

        if (user.role === 'promotor') {
            setCurrentView('promotor');
            return;
        }

        const data = {
            name: user.nama,
            bloodType: user.bloodType || 'O',
            personality: user.stifinType
        };
        setUserData(data);
        localStorage.setItem('stifin_auth', 'true');
        localStorage.setItem('stifin_user_data', JSON.stringify(data));
        setCurrentView('dashboard');
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden bg-[#f8fafc] text-slate-800">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 bg-[#f8fafc] no-print pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-70"></div>
            </div>

            <div className="relative z-10">
                {currentView === 'login' && (
                    <LoginView
                        onLogin={handleLogin}
                        onOpenPinModal={() => {
                            setAccessPin('');
                            setPinError('');
                            setShowPinModal(true);
                        }}
                    />
                )}

                {currentView === 'blocked' && (
                    <BlockedView
                        validation={validationError}
                        onBackToLogin={() => {
                            setValidationError(null);
                            setCurrentView('login');
                        }}
                        onOpenAdmin={() => {
                            setAccessPin('');
                            setPinError('');
                            setShowPinModal(true);
                        }}
                    />
                )}

                {currentView === 'onboarding' && (
                    <OnboardingView
                        onGenerate={data => {
                            localStorage.setItem('stifin_user_data', JSON.stringify(data));
                            setUserData(data);
                            setCurrentView('dashboard');
                        }}
                        onLogout={handleLogout}
                        onOpenAdmin={() => {
                            setAccessPin('');
                            setPinError('');
                            setShowPinModal(true);
                        }}
                    />
                )}

                {currentView === 'promotor' && authenticatedUser && (
                    <PromotorDashboard
                        promotorUser={authenticatedUser}
                        onLogout={handleLogout}
                        onViewClientReport={client => {
                            const data = {
                                name: client.nama,
                                bloodType: client.bloodType || 'O',
                                personality: client.stifinType
                            };
                            setUserData(data);
                            localStorage.setItem('stifin_user_data', JSON.stringify(data));
                            setCurrentView('dashboard');
                        }}
                        onOpenMasterAdmin={() => setShowAdminDashboard(true)}
                    />
                )}

                {currentView === 'dashboard' && userData && (
                    <DashboardView
                        userData={userData}
                        authenticatedUser={authenticatedUser}
                        onLogout={handleLogout}
                        onReset={() => setCurrentView('onboarding')}
                        onOpenAdmin={() => {
                            setAccessPin('');
                            setPinError('');
                            setShowPinModal(true);
                        }}
                        onBackToPromotor={
                            (authenticatedUser?.role === 'promotor' || authenticatedUser?.role === 'master_admin')
                                ? () => setCurrentView('promotor')
                                : undefined
                        }
                    />
                )}
            </div>

            {/* Modal Input PIN Keamanan Admin */}
            {showPinModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-3xl w-full max-w-sm border border-slate-200 shadow-2xl animate-fade-in">
                        <div className="text-center mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2 shadow-inner border border-blue-100">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Verifikasi PIN Keamanan</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Masukkan PIN untuk membuka Dashboard Akses Management
                            </p>
                            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                                PIN Bawaan: 3308
                            </span>
                        </div>

                        <form onSubmit={handleVerifyPin} className="space-y-4">
                            <input
                                type="password"
                                maxLength={6}
                                value={accessPin}
                                onChange={e => setAccessPin(e.target.value)}
                                className="w-full text-center text-3xl font-black tracking-widest bg-slate-50 border border-slate-300 rounded-2xl py-3 focus:outline-none focus:border-blue-500"
                                placeholder="••••"
                                autoFocus
                            />
                            {pinError && <p className="text-rose-600 text-xs font-bold text-center">{pinError}</p>}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPinModal(false)}
                                    className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20"
                                >
                                    Verifikasi PIN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Dashboard Akses Management Modal (Master Admin) */}
            <AccessManagementDashboard
                isOpen={showAdminDashboard}
                onClose={() => setShowAdminDashboard(false)}
                onAccessGrantedAsUser={handleAccessGrantedAsUser}
                onOpenPromotorDashboard={() => {
                    setShowAdminDashboard(false);
                    // Make sure authenticated user exists as master_admin or prompt
                    if (!authenticatedUser) {
                        const adminUser = AccessStorageService.getUsers().find((u: AccessUser) => u.role === 'master_admin');
                        if (adminUser) setAuthenticatedUser(adminUser);
                    }
                    setCurrentView('promotor');
                }}
            />
        </div>
    );
}

// ----------------------------------------------------
// 1. LOGIN VIEW
// ----------------------------------------------------
const LoginView: React.FC<{
    onLogin: (passcode: string, expectedRole?: UserRole) => { success: boolean; reason?: string };
    onOpenPinModal: () => void;
}> = ({ onLogin, onOpenPinModal }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const globalConfig = AccessStorageService.getGlobalConfig();

    // Popup modal state for "Pilih Hak Akses (1-Click Login)"
    const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole | null>(null);
    const [rolePassword, setRolePassword] = useState('');
    const [showRolePassword, setShowRolePassword] = useState(false);
    const [roleErrorMsg, setRoleErrorMsg] = useState('');
    const [isRoleShaking, setIsRoleShaking] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            setErrorMsg('Harap masukkan password akses.');
            return;
        }

        const res = onLogin(password.trim());
        if (!res.success) {
            setErrorMsg(res.reason || 'Akses Ditolak. Password salah atau tidak terdaftar.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    const openRoleLoginModal = (role: UserRole) => {
        setSelectedRoleForLogin(role);
        setRolePassword('');
        setRoleErrorMsg('');
        setShowRolePassword(false);
    };

    const handleRoleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rolePassword.trim()) {
            setRoleErrorMsg('Harap masukkan password akses.');
            return;
        }

        const res = onLogin(rolePassword.trim(), selectedRoleForLogin || undefined);
        if (!res.success) {
            setRoleErrorMsg(res.reason || 'Password salah atau tidak terdaftar.');
            setIsRoleShaking(true);
            setTimeout(() => setIsRoleShaking(false), 500);
        } else {
            setSelectedRoleForLogin(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className={`glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl transition-all ${
                isShaking ? 'animate-shake border-rose-500' : ''
            }`}>
                <div className="flex justify-center mb-6">
                    <StifinLogo size={70} showText={false} />
                </div>
                <h1 className="text-2xl font-black text-center text-slate-900 mb-1 tracking-tight">STIFIn Ultimate</h1>
                <p className="text-blue-600 font-bold tracking-wider text-center text-xs uppercase mb-6">Character Academy Suite</p>

                {/* Banner status aplikasi jika nonaktif */}
                {globalConfig.appStatus === 'nonaktif' && (
                    <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
                        <Power size={18} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                            <strong className="block font-black uppercase text-[11px]">Sistem Aplikasi Sedang Nonaktif</strong>
                            <span>Akses aplikasi saat ini dimatikan oleh administrator untuk pemeliharaan.</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Access Passcode
                        </label>
                        <div className="relative glow-border rounded-xl transition-all">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value);
                                    if (errorMsg) setErrorMsg('');
                                }}
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono text-sm transition-colors"
                                placeholder="Masukkan password akses..."
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errorMsg && (
                            <p className="text-rose-600 text-xs mt-2 font-bold flex items-center gap-1.5">
                                <AlertTriangle size={14} /> {errorMsg}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-95 text-sm"
                    >
                        Masuk ke Aplikasi
                    </button>
                </form>

                {/* Quick Role Access Buttons - Tanpa Menampilkan Password */}
                <div className="mt-6 pt-5 border-t border-slate-200">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 text-center mb-3">
                        Pilih Hak Akses (1-Click Login):
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                        <button
                            type="button"
                            onClick={() => openRoleLoginModal('master_admin')}
                            className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-2xl text-center transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-200 transition-colors shadow-xs">
                                <Shield size={18} />
                            </div>
                            <span className="text-xs font-black text-purple-950">Master Admin</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => openRoleLoginModal('promotor')}
                            className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-2xl text-center transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-200 transition-colors shadow-xs">
                                <UserCheck size={18} />
                            </div>
                            <span className="text-xs font-black text-blue-950">Promotor</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => openRoleLoginModal('client')}
                            className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl text-center transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-200 transition-colors shadow-xs">
                                <User size={18} />
                            </div>
                            <span className="text-xs font-black text-emerald-950">Client</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Popup Modal Input Password Hak Akses yang Dipilih */}
            {selectedRoleForLogin && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className={`bg-white p-6 sm:p-7 rounded-3xl w-full max-w-sm border border-slate-200 shadow-2xl transition-all animate-fade-in ${
                        isRoleShaking ? 'animate-shake border-rose-500' : ''
                    }`}>
                        <div className="text-center mb-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-inner border ${
                                selectedRoleForLogin === 'master_admin'
                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                    : selectedRoleForLogin === 'promotor'
                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                                {selectedRoleForLogin === 'master_admin' && <Shield size={28} />}
                                {selectedRoleForLogin === 'promotor' && <UserCheck size={28} />}
                                {selectedRoleForLogin === 'client' && <User size={28} />}
                            </div>
                            <h3 className="text-lg font-black text-slate-900">
                                Login {selectedRoleForLogin === 'master_admin' ? 'Master Admin' : selectedRoleForLogin === 'promotor' ? 'Promotor STIFIn' : 'Client STIFIn'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Silakan masukkan password akses untuk hak akses{' '}
                                <strong className="text-slate-800 font-bold">
                                    {selectedRoleForLogin === 'master_admin' ? 'Master Admin' : selectedRoleForLogin === 'promotor' ? 'Promotor' : 'Client'}
                                </strong>
                            </p>
                        </div>

                        <form onSubmit={handleRoleModalSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                    Password Akses
                                </label>
                                <div className="relative glow-border rounded-xl transition-all">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showRolePassword ? 'text' : 'password'}
                                        value={rolePassword}
                                        onChange={e => {
                                            setRolePassword(e.target.value);
                                            if (roleErrorMsg) setRoleErrorMsg('');
                                        }}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono text-sm transition-colors"
                                        placeholder="Masukkan password akses..."
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRolePassword(!showRolePassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showRolePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {roleErrorMsg && (
                                    <p className="text-rose-600 text-xs mt-2 font-bold flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> {roleErrorMsg}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoleForLogin(null)}
                                    className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className={`w-1/2 py-3 text-white font-extrabold rounded-xl text-xs transition-all shadow-md ${
                                        selectedRoleForLogin === 'master_admin'
                                            ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                                            : selectedRoleForLogin === 'promotor'
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                    }`}
                                >
                                    Masuk
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ----------------------------------------------------
// 2. BLOCKED VIEW (Masa Aktif Berakhir / Nonaktif)
// ----------------------------------------------------
const BlockedView: React.FC<{
    validation: AccessValidationResult | null;
    onBackToLogin: () => void;
    onOpenAdmin: () => void;
}> = ({ validation, onBackToLogin, onOpenAdmin }) => {
    const isExpired = validation?.reason === 'expired';
    const isInactive = validation?.reason === 'user_inactive' || validation?.reason === 'passcode_inactive';
    const isAppInactive = validation?.reason === 'app_inactive';
    const isNotStarted = validation?.reason === 'not_started';

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl text-center space-y-6 animate-fade-in">
                <div className="flex justify-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
                        isExpired
                            ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-500/10'
                            : isNotStarted
                            ? 'bg-amber-50 text-amber-600 border border-amber-200 shadow-amber-500/10'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 shadow-slate-500/10'
                    }`}>
                        {isExpired && <Clock size={40} className="animate-pulse" />}
                        {isNotStarted && <Calendar size={40} />}
                        {(isInactive || isAppInactive) && <Power size={40} />}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isExpired && 'Masa Aktif Akses Telah Berakhir'}
                        {isNotStarted && 'Akses Aplikasi Belum Dimulai'}
                        {isInactive && 'Akses Dinonaktifkan'}
                        {isAppInactive && 'Aplikasi Sedang Nonaktif / Pemeliharaan'}
                        {!isExpired && !isNotStarted && !isInactive && !isAppInactive && 'Akses Tidak Diizinkan'}
                    </h2>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                        {validation?.message || 'Akses ke aplikasi ditolak sesuai kebijakan keamanan sistem.'}
                    </p>
                </div>

                {/* Date Validity Details Card */}
                {(validation?.startDate || validation?.endDate) && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-left">
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500 font-semibold">Tanggal Mulai Aktif:</span>
                            <span className="font-bold text-slate-900">{validation.startDate || '-'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500 font-semibold">Tanggal Berakhir:</span>
                            <span className="font-bold text-slate-900">{validation.endDate || '-'}</span>
                        </div>
                        {validation.user && (
                            <div className="flex justify-between py-1">
                                <span className="text-slate-500 font-semibold">Nama Pengguna:</span>
                                <span className="font-bold text-slate-900">{validation.user.nama} ({validation.user.stifinType})</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        className="w-full sm:w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                        <ArrowLeft size={14} /> Kembali ke Login
                    </button>
                    <button
                        type="button"
                        onClick={onOpenAdmin}
                        className="w-full sm:w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
                    >
                        <Shield size={14} /> Kelola Akses (Admin)
                    </button>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------
// 3. ONBOARDING VIEW
// ----------------------------------------------------
const OnboardingView: React.FC<{
    onGenerate: (data: { name: string; bloodType: string; personality: string }) => void;
    onLogout: () => void;
    onOpenAdmin: () => void;
}> = ({ onGenerate, onLogout, onOpenAdmin }) => {
    const [name, setName] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [personality, setPersonality] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !bloodType || !personality) {
            setError('Harap lengkapi semua data biometrik untuk melanjutkan.');
            return;
        }
        onGenerate({ name, bloodType, personality });
    };

    const personalitiesGroups = {
        'Sensing (Merah)': { items: ['Si', 'Se'] },
        'Thinking (Abu)': { items: ['Ti', 'Te'] },
        'Intuiting (Biru)': { items: ['Ii', 'Ie'] },
        'Feeling (Hijau)': { items: ['Fi', 'Fe'] },
        'Insting (Kuning)': { items: ['In'] }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 animate-fade-in">
            <header className="flex justify-between items-center py-4 px-6 mb-8 max-w-4xl mx-auto w-full glass-panel rounded-2xl mt-4 border border-slate-200">
                <StifinLogo size={36} />
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onOpenAdmin}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
                    >
                        <Shield size={14} /> Akses Management
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors text-xs font-bold"
                    >
                        <LogOut size={14} /> Keluar
                    </button>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center">
                <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-2xl border-slate-200 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mb-4 shadow-sm text-blue-600">
                            <Brain size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Gerbang Jati Diri</h2>
                        <p className="text-slate-600">Inisialisasi data biometrik Anda untuk menyusun dashboard analitik STIFIn.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                                1. Nama Lengkap Subjek
                            </label>
                            <div className="relative glow-border rounded-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-lg"
                                    placeholder="Ketik nama Anda..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                                2. Golongan Darah
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {['O', 'A', 'B', 'AB'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setBloodType(type)}
                                        className={`py-3 rounded-xl border text-lg font-bold transition-all ${
                                            bloodType === type
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                                3. Hasil Tes Genetik STIFIn
                            </label>
                            <div className="relative glow-border rounded-xl">
                                <select
                                    value={personality}
                                    onChange={e => setPersonality(e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-300 rounded-xl py-4 pl-4 pr-12 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors text-lg cursor-pointer"
                                >
                                    <option value="" disabled>Pilih Mesin Kecerdasan...</option>
                                    {Object.entries(personalitiesGroups).map(([groupName, groupData]) => (
                                        <optgroup key={groupName} label={groupName}>
                                            {groupData.items.map(code => (
                                                <option key={code} value={code}>
                                                    {code} - {STIFIN_DATA.personalities[code].name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            <BarChart3 size={24} />
                            GENERATE DASHBOARD
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------
// 4. EXECUTIVE ANALYTICS DASHBOARD VIEW
// ----------------------------------------------------
const DashboardView: React.FC<{
    userData: { name: string; bloodType: string; personality: string };
    authenticatedUser: AccessUser | null;
    onLogout: () => void;
    onReset: () => void;
    onOpenAdmin: () => void;
    onBackToPromotor?: () => void;
}> = ({ userData, authenticatedUser, onLogout, onReset, onOpenAdmin, onBackToPromotor }) => {
    const pData = STIFIN_DATA.personalities[userData.personality] || STIFIN_DATA.personalities['Si'];
    const bData = STIFIN_DATA.bloodTypes[userData.bloodType] || STIFIN_DATA.bloodTypes['O'];
    const mkInfo = STIFIN_DATA.kecerdasan5W[pData.mkGroup];
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        setIsGeneratingPdf(true);
        const element = dashboardRef.current;
        if (!element) return;

        if (typeof html2pdf !== 'undefined') {
            const opt = {
                margin: [8, 8, 8, 8],
                filename: `STIFIn_Report_${userData.name.replace(/\s+/g, '_')}_${pData.code}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            html2pdf().from(element).set(opt).save().then(() => {
                setIsGeneratingPdf(false);
            }).catch((err: any) => {
                console.error(err);
                setIsGeneratingPdf(false);
                window.print();
            });
        } else {
            window.print();
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div ref={dashboardRef} className="min-h-screen p-4 md:p-8 text-slate-800 relative bg-slate-50 pdf-container">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Control Navigation Header (No Print) */}
                <div className="flex flex-wrap justify-between items-center bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 no-print sticky top-4 z-40 shadow-md gap-3">
                    <div className="flex items-center gap-4">
                        <StifinLogo size={32} />
                        <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>

                        {onBackToPromotor && (
                            <button
                                onClick={onBackToPromotor}
                                className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors border border-blue-200 shadow-sm"
                            >
                                <ArrowLeft size={15} />
                                <span>Dashboard Promotor</span>
                            </button>
                        )}

                        <button onClick={onReset} className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                            Edit Data
                        </button>

                        {/* License validity badge if logged in via user database */}
                        {authenticatedUser && (
                            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                                <CheckCircle size={13} className="text-emerald-500" />
                                <span>Masa Aktif: s/d {authenticatedUser.tanggalBerakhir}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onOpenAdmin}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors border border-slate-200"
                        >
                            <Shield size={14} className="text-blue-600" />
                            <span className="hidden sm:inline">Master Admin</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            disabled={isGeneratingPdf}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-blue-500/20"
                        >
                            <Printer size={16} /> {isGeneratingPdf ? 'MEMPROSES...' : 'CETAK LANDSCAPE PDF'}
                        </button>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
                        >
                            <LogOut size={16} /> Keluar
                        </button>
                    </div>
                </div>

                {/* Executive Banner */}
                <div className="p-6 md:p-8 rounded-3xl border-l-8 shadow-sm border border-slate-200 relative overflow-hidden bg-white pdf-card" style={{ borderLeftColor: pData.hex }}>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="bg-slate-900 text-white border border-slate-800 text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-sm">
                                    EXECUTIVE ANALYTICS REPORT
                                </span>
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> VERIFIED
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                                {userData.name}
                            </h1>
                            <p className="text-2xl font-extrabold tracking-wide" style={{ color: pData.hex }}>
                                {pData.code} - {pData.name}
                            </p>
                            <p className="text-slate-600 text-sm mt-2 max-w-3xl leading-relaxed font-medium">
                                Berdasarkan pemetaan genetik STIFIn, {pData.os}. Kecerdasan inti Anda adalah <strong className="text-slate-900 font-bold">{pData.quotient}</strong>.
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 shrink-0">
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-black">Kecerdasan Dominan</span>
                            <span className="text-3xl md:text-4xl font-black" style={{ color: pData.hex }}>
                                {pData.quotient}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Response & Chemistry Cards */}
                <div className="pdf-grid-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <Activity size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Tabiat Respons Awal (Gol. Darah {userData.bloodType})</h4>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            {bData.desc}
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Cpu size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Sistem Kemudi Drive ({pData.driveDetails.drive})</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold uppercase text-[10px] block">Sumber Stimuli</span> <strong className="text-slate-900 text-xs block">{pData.driveDetails.stimuli}</strong></div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold uppercase text-[10px] block">Falsafah Hidup</span> <strong className="text-slate-900 text-xs block">{pData.driveDetails.falsafah}</strong></div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold uppercase text-[10px] block">Motivasi</span> <strong className="text-slate-900 text-xs block">{pData.driveDetails.motivasi}</strong></div>
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span className="text-slate-400 font-semibold uppercase text-[10px] block">Pemicu Belajar</span> <strong className="text-slate-900 text-xs block">{pData.belajarDeep.pemicu}</strong></div>
                        </div>
                    </div>
                </div>

                {/* Hakikat Kecerdasan & 5W Concept */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 pdf-card">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
                            <Compass size={22} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">
                            Hakikat Penciptaan & Misi Kehidupan (Konsep 5W + 1H) - {pData.mkGroup}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200 shadow-sm">
                            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-1">5W Framework & Belahan Otak</span>
                            <h5 className="font-extrabold text-slate-900 text-base">{pData.mkGroup} ({mkInfo?.w})</h5>
                            <p className="text-xs font-bold text-blue-700 mt-1">Dominansi Otak: {mkInfo?.otak}</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Karakter Utama</span>
                            <p className="text-xs font-bold text-slate-900 leading-relaxed">{mkInfo?.karakterUtama}</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Ciri Khas Genetik</span>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed">{mkInfo?.ciriKhas}</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-100 px-2.5 py-0.5 rounded-md">WHAT, WHERE, WHO</span>
                                <h5 className="text-xs font-black text-blue-800 uppercase tracking-widest">THE ESSENCE & ORIGIN</h5>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{pData.essence}</p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 rounded-md">WHY, WHEN</span>
                                <h5 className="text-xs font-black text-emerald-800 uppercase tracking-widest">THE DRIVE & MOMENTUM</h5>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{pData.drive}</p>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded-md">HOW</span>
                                <h5 className="text-xs font-black text-amber-800 uppercase tracking-widest">THE PATH TO SUCCESS</h5>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{pData.path}</p>
                        </div>
                    </div>
                </div>

                {/* Visual 8 Dimensi Perilaku Kunci (Memo Sticky Notes Board) */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 pdf-card">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
                            <Sparkles size={22} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">
                            Struktur Perilaku Kunci (8 Dimensi Perilaku)
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="sticky-note bg-amber-50 border border-amber-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-red-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">1. Sistem Operasi</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.os}</p>
                        </div>

                        <div className="sticky-note bg-blue-50 border border-blue-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-blue-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1">2. Jenis Kecerdasan</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.kecerdasan}</p>
                        </div>

                        <div className="sticky-note bg-emerald-50 border border-emerald-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-emerald-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block mb-1">3. Peranan Utama</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.peranan}</p>
                        </div>

                        <div className="sticky-note bg-purple-50 border border-purple-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-purple-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider block mb-1">4. Kelebihan Inti</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.kelebihan}</p>
                        </div>

                        <div className="sticky-note bg-rose-50 border border-rose-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-rose-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block mb-1">5. Target Utama</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.target}</p>
                        </div>

                        <div className="sticky-note bg-indigo-50 border border-indigo-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-indigo-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider block mb-1">6. Harapan Diri</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.harapan}</p>
                        </div>

                        <div className="sticky-note bg-teal-50 border border-teal-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-teal-400 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider block mb-1">7. Arah Merek / Brand</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.brand}</p>
                        </div>

                        <div className="sticky-note bg-yellow-50 border border-yellow-200 p-4 rounded-2xl relative overflow-hidden">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 absolute top-3 right-3 shadow-sm"></div>
                            <span className="text-[10px] font-black uppercase text-yellow-800 tracking-wider block mb-1">8. Tabiat thd. Uang</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{pData.perilaku8.tabiatUang}</p>
                        </div>
                    </div>
                </div>

                {/* Report Cards Grid (2 Columns in Landscape PDF) */}
                <div className="pdf-grid-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Card 1: Topografi Otak */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Globe size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Topografi Otak &amp; Sains</h3>
                        </div>
                        <DataRow label="Belahan Otak" value={pData.topo.os} />
                        <DataRow label="Lapisan Otak" value={pData.topo.lapisan} />
                        <DataRow label="Cuaca Tubuh" value={pData.topo.cuaca} />
                        <DataRow label="Arah Angin" value={pData.topo.angin} />
                    </div>

                    {/* Card 2: Metode Belajar */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><GraduationCap size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Metode &amp; Cara Belajar Efektif</h3>
                        </div>
                        <DataRow label="Metode Optimal" value={pData.belajar.metode} />
                        <DataRow label="Cara Belajar Deep" value={pData.belajarDeep.cara} />
                        <DataRow label="Kebiasaan Utama" value={pData.belajar.kebiasaan} />
                        <DataRow label="Media Belajar Ideal" value={pData.belajar.media} />
                        <DataRow label="Peranan Diri" value={pData.belajar.peran} />
                        <DataRow label="Panggung Utama" value={pData.belajar.panggung} />
                    </div>

                    {/* Card 3: Psikometrik */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><PieChart size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Karakteristik Psikometrik</h3>
                        </div>
                        <div className="space-y-4 pt-2">
                            {pData.psiko.traits.map(trait => (
                                <div key={trait.name}>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-slate-700">{trait.name}</span>
                                        <span className="text-blue-600 font-extrabold">{trait.val}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${trait.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 4: Motivasi & Finansial */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Coins size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Motivasi, Finansial &amp; Brand</h3>
                        </div>
                        <DataRow label="Kemistri Alamiah" value={pData.motivasi.kemistri} />
                        <DataRow label="Tabiat Finansial" value={pData.finansial.tabiat} />
                        <DataRow label="Arah Merek / Branding" value={pData.finansial.brand} />
                        <DataRow label="Kata Kunci Utama" value={pData.motivasi.keywords.join(' • ')} />
                    </div>

                    {/* Card 5: Pemetaan Karir */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Briefcase size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Pemetaan Karir &amp; Karpet Merah</h3>
                        </div>
                        <DataRow label="Industri Utama" value={pData.karir.utama} />
                        <DataRow label="Profesi Spesifik" value={pData.karir.lainnya} />
                        <DataRow label="Klu Keberhasilan" value={pData.peran.klu} />
                        <DataRow label="Contoh Tokoh/Profesi" value={pData.motivasi.profesiContoh} />
                    </div>

                    {/* Card 6: Dinamika Sosial */}
                    <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm pdf-card">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Users size={22} /></div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Dinamika Sosial (Teori Sirkulasi)</h3>
                        </div>
                        <DataRow label="MENDUKUNG (Support)" value={pData.sosial.support} />
                        <DataRow label="DIDUKUNG OLEH" value={pData.sosial.didukung} />
                        <DataRow label="MENAKLUKKAN (Conquer)" value={pData.sosial.conquer} />
                        <DataRow label="DITAKLUKKAN OLEH" value={pData.sosial.ditaklukkan} />
                    </div>
                </div>

                {/* Card 7: Fisik, Jasmani & Organ Penyakit */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 pdf-card">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><HeartPulse size={22} /></div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">Fisik, Jasmani &amp; Organ Penyakit (Gambar Dasar Karakter)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Konstitusi Fisik</span>
                            <p className="text-sm font-bold text-slate-900">{pData.fisik.konstitusi}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">Tipologi Fisik</span>
                            <p className="text-sm font-bold text-slate-900">{pData.gambaranDasar.tipologiFisik}</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">Kalibrasi Belajar / Bekerja</span>
                            <p className="text-sm font-bold text-amber-900">{pData.gambaranDasar.kalibrasi}</p>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
                            <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block mb-1">Organ Kerentanan &amp; Penyakit</span>
                            <p className="text-sm font-bold text-rose-900">{pData.gambaranDasar.organPenyakit}</p>
                        </div>
                    </div>
                </div>

                {/* Card 8: 5 Trait Utama */}
                <div className="p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 pdf-card">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm"><Sparkles size={22} /></div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-wide">5 Trait Utama ({pData.name})</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {pData.traitsList.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <span className="text-xs font-black text-blue-600">0{idx + 1}</span>
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">Trait</span>
                                </div>
                                <h5 className="font-extrabold text-slate-900 text-sm leading-tight">{item.label}</h5>
                                <p className="text-[11px] font-bold text-slate-500 lowercase italic">{item.subtitle}</p>
                                <p className="text-xs text-slate-700 leading-relaxed pt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm text-center text-xs text-slate-500 space-y-2 no-print">
                    <div className="flex justify-center mb-2">
                        <StifinLogo size={28} />
                    </div>
                    <p className="font-bold tracking-wider text-slate-700 uppercase">DATA DIOLAH VIA STIFIN ULTIMATE ENGINE • CONFIDENTIAL EXECUTIVE REPORT</p>
                    <p>© STIFIn Character Academy Suite. All Rights Reserved.</p>
                </div>

            </div>
        </div>
    );
};

const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0">
        <span className="text-slate-500 text-xs font-semibold w-1/3 uppercase tracking-wider">{label}</span>
        <span className="text-slate-900 text-sm font-bold w-2/3 text-right print-text-dark leading-snug">{value}</span>
    </div>
);
