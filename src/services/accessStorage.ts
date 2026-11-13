/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessStatus, AccessUser, AppLinkItem, GlobalAppConfig, PasscodeItem, AccessValidationResult } from '../types/access';

const STORAGE_USERS_KEY = 'stifin_db_users';
const STORAGE_PASSCODES_KEY = 'stifin_db_passcodes';
const STORAGE_LINKS_KEY = 'stifin_db_links';
const STORAGE_CONFIG_KEY = 'stifin_db_global_config';

// Helper to format Date to YYYY-MM-DD
export function formatDateYMD(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Add days to date
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Default initial config
const DEFAULT_CONFIG: GlobalAppConfig = {
    appStatus: 'aktif',
    maintenanceMessage: 'Aplikasi STIFIn Ultimate sedang dalam pemeliharaan berkala atau nonaktif sementara oleh administrator. Silakan hubungi manajemen untuk informasi lebih lanjut.',
    adminPin: '3308',
    scriptUrl: ''
};

// Seed initial users for immediate out-of-the-box experience
function getInitialUsers(): AccessUser[] {
    const today = new Date();
    const startDate = formatDateYMD(addDays(today, -5));
    const activeEnd = formatDateYMD(addDays(today, 365));
    const expiredEnd = formatDateYMD(addDays(today, -1));

    return [
        {
            id: 'usr-admin-1',
            nama: 'Master Administrator STIFIn',
            whatsapp: '081199887766',
            email: 'admin@stifin.com',
            stifinType: 'Te',
            bloodType: 'A',
            role: 'master_admin',
            passcode: 'admin123',
            token: 'master-admin-token',
            accessLink: '',
            tanggalAwal: startDate,
            tanggalBerakhir: activeEnd,
            status: 'aktif',
            catatan: 'Superuser - Memiliki akses penuh mengontrol seluruh fitur aplikasi',
            createdAt: new Date().toISOString(),
            loginCount: 15
        },
        {
            id: 'usr-promotor-1',
            nama: 'Dr. Hendra Wijaya, M.Pd (Promotor STIFIn)',
            whatsapp: '081234567890',
            email: 'hendra.promotor@stifin.id',
            stifinType: 'Fe',
            bloodType: 'O',
            role: 'promotor',
            passcode: 'promotor123',
            token: 'promotor-hendra-token',
            accessLink: '',
            tanggalAwal: startDate,
            tanggalBerakhir: activeEnd,
            status: 'aktif',
            catatan: 'Promotor Resmi STIFIn - Menginput dan mengelola data tes klien',
            createdAt: new Date().toISOString(),
            loginCount: 9
        },
        {
            id: 'usr-client-1',
            nama: 'Ahmad Fauzi, M.Psi',
            whatsapp: '085711223344',
            email: 'ahmad.fauzi@example.com',
            stifinType: 'Si',
            bloodType: 'O',
            role: 'client',
            passcode: 'client123',
            token: 'stifin-si-fauzi',
            accessLink: '',
            tanggalAwal: startDate,
            tanggalBerakhir: formatDateYMD(addDays(today, 60)),
            status: 'aktif',
            catatan: 'Klien Tes Biometrik STIFIn',
            createdByPromotorId: 'usr-promotor-1',
            createdByPromotorName: 'Dr. Hendra Wijaya, M.Pd (Promotor STIFIn)',
            testDate: formatDateYMD(addDays(today, -2)),
            createdAt: new Date().toISOString(),
            loginCount: 6
        },
        {
            id: 'usr-client-2',
            nama: 'dr. Siti Rahmawati',
            whatsapp: '081399887766',
            email: 'siti.rahma@hospital.id',
            stifinType: 'Ti',
            bloodType: 'A',
            role: 'client',
            passcode: 'STIFIN-TI-9901',
            token: 'stifin-ti-siti',
            accessLink: '',
            tanggalAwal: startDate,
            tanggalBerakhir: formatDateYMD(addDays(today, 30)),
            status: 'aktif',
            catatan: 'Klien Konsultasi Kepakaran & Karir',
            createdByPromotorId: 'usr-promotor-1',
            createdByPromotorName: 'Dr. Hendra Wijaya, M.Pd (Promotor STIFIn)',
            testDate: formatDateYMD(addDays(today, -1)),
            createdAt: new Date().toISOString(),
            loginCount: 3
        },
        {
            id: 'usr-client-3',
            nama: 'Budi Santoso (Kadaluarsa)',
            whatsapp: '081398765432',
            email: 'budi.santoso@business.com',
            stifinType: 'Ie',
            bloodType: 'B',
            role: 'client',
            passcode: 'BUDI-EXPIRED-2026',
            token: 'budi-trial-token',
            accessLink: '',
            tanggalAwal: formatDateYMD(addDays(today, -60)),
            tanggalBerakhir: expiredEnd,
            status: 'aktif',
            catatan: 'Contoh klien yang telah melewati masa aktif (Expired)',
            createdByPromotorId: 'usr-promotor-1',
            createdByPromotorName: 'Dr. Hendra Wijaya, M.Pd (Promotor STIFIn)',
            testDate: formatDateYMD(addDays(today, -60)),
            createdAt: new Date().toISOString(),
            loginCount: 1
        }
    ];
}

function getInitialPasscodes(): PasscodeItem[] {
    const today = new Date();
    return [
        {
            id: 'pwd-1',
            code: 'admin123',
            label: 'Master Admin Access Key',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -30)),
            tanggalBerakhir: formatDateYMD(addDays(today, 365)),
            usedCount: 15,
            createdAt: new Date().toISOString()
        },
        {
            id: 'pwd-2',
            code: 'promotor123',
            label: 'Promotor Access Key (Dr. Hendra)',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -30)),
            tanggalBerakhir: formatDateYMD(addDays(today, 365)),
            usedCount: 9,
            createdAt: new Date().toISOString()
        },
        {
            id: 'pwd-3',
            code: 'client123',
            label: 'Client Access Key (Ahmad Fauzi)',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -5)),
            tanggalBerakhir: formatDateYMD(addDays(today, 60)),
            usedCount: 6,
            createdAt: new Date().toISOString()
        },
        {
            id: 'pwd-4',
            code: 'sahabatsca',
            label: 'Master Access Passcode (Bawaan)',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -30)),
            tanggalBerakhir: formatDateYMD(addDays(today, 365)),
            usedCount: 42,
            createdAt: new Date().toISOString()
        }
    ];
}

function getInitialLinks(): AppLinkItem[] {
    const today = new Date();
    return [
        {
            id: 'lnk-1',
            title: 'Link Akses Direct Fauzi (Aktif)',
            slugOrToken: 'stifin-si-fauzi',
            fullUrl: '',
            assignedUser: 'Ahmad Fauzi, M.Psi',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -5)),
            tanggalBerakhir: formatDateYMD(addDays(today, 30)),
            clicks: 18,
            createdAt: new Date().toISOString()
        },
        {
            id: 'lnk-2',
            title: 'Link Akses Trial Budi (Expired)',
            slugOrToken: 'budi-trial-token',
            fullUrl: '',
            assignedUser: 'Budi Santoso',
            status: 'aktif',
            tanggalAwal: formatDateYMD(addDays(today, -30)),
            tanggalBerakhir: formatDateYMD(addDays(today, -1)),
            clicks: 4,
            createdAt: new Date().toISOString()
        }
    ];
}

// Passcode Generator Function
export function generateRandomPassword(format: 'readable' | 'alphanumeric' | 'numeric' = 'readable', length = 8): string {
    if (format === 'numeric') {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
    }
    if (format === 'readable') {
        const words = ['STIFIN', 'ULTIMATE', 'PRO', 'ELITE', 'LEADER', 'GENIUS', 'TALENT', 'SMART'];
        const word = words[Math.floor(Math.random() * words.length)];
        const num = Math.floor(1000 + Math.random() * 9000);
        return `${word}-${num}`;
    }
    // Alphanumeric
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < length; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
}

// Link Generator Function
export function generateRandomLinkToken(prefix = 'stifin'): string {
    const randomHex = Math.random().toString(36).substring(2, 8);
    const dateStamp = Date.now().toString(36).substring(4);
    return `${prefix}-${randomHex}${dateStamp}`.toLowerCase();
}

export function buildFullAppLink(token: string): string {
    if (typeof window === 'undefined') return `?token=${token}`;
    const base = window.location.origin + window.location.pathname;
    return `${base}?token=${encodeURIComponent(token)}`;
}

// Local Database Service
export const AccessStorageService = {
    // Global Config
    getGlobalConfig(): GlobalAppConfig {
        try {
            const raw = localStorage.getItem(STORAGE_CONFIG_KEY);
            if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
        } catch (e) {
            console.error('Error loading global config', e);
        }
        return DEFAULT_CONFIG;
    },

    updateGlobalConfig(partial: Partial<GlobalAppConfig>): GlobalAppConfig {
        const current = this.getGlobalConfig();
        const updated = { ...current, ...partial };
        localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(updated));
        return updated;
    },

    // Users Database CRUD
    getUsers(): AccessUser[] {
        try {
            const raw = localStorage.getItem(STORAGE_USERS_KEY);
            if (raw) {
                const users: AccessUser[] = JSON.parse(raw);
                return users.map(u => ({
                    ...u,
                    accessLink: u.accessLink || buildFullAppLink(u.token)
                }));
            }
        } catch (e) {
            console.error('Error loading users', e);
        }
        // Initialize with default seeds
        const initials = getInitialUsers().map(u => ({
            ...u,
            accessLink: buildFullAppLink(u.token)
        }));
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initials));
        return initials;
    },

    saveUser(user: Omit<AccessUser, 'id' | 'createdAt' | 'loginCount'> & { id?: string }): AccessUser {
        const users = this.getUsers();
        let savedUser: AccessUser;

        if (user.id) {
            // Update
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                savedUser = {
                    ...users[index],
                    ...user,
                    accessLink: user.accessLink || buildFullAppLink(user.token || users[index].token)
                };
                users[index] = savedUser;
            } else {
                savedUser = {
                    ...user,
                    id: user.id,
                    accessLink: user.accessLink || buildFullAppLink(user.token),
                    createdAt: new Date().toISOString(),
                    loginCount: 0
                } as AccessUser;
                users.unshift(savedUser);
            }
        } else {
            // Create New
            const token = user.token || generateRandomLinkToken(user.stifinType.toLowerCase());
            savedUser = {
                ...user,
                id: `usr-${Date.now().toString().slice(-6)}`,
                token,
                accessLink: buildFullAppLink(token),
                createdAt: new Date().toISOString(),
                loginCount: 0
            };
            users.unshift(savedUser);
        }

        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

        // Sync corresponding AppLink
        this.syncUserToAppLink(savedUser);

        // Sync with Google Apps Script if enabled
        this.triggerAppsScriptSync(savedUser);

        return savedUser;
    },

    deleteUser(id: string): boolean {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== id);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(filtered));
        return filtered.length !== users.length;
    },

    toggleUserStatus(id: string): AccessUser | null {
        const users = this.getUsers();
        const target = users.find(u => u.id === id);
        if (!target) return null;
        target.status = target.status === 'aktif' ? 'nonaktif' : 'aktif';
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
        return target;
    },

    // Get clients (optionally filtered by promotor ID)
    getClients(promotorId?: string): AccessUser[] {
        const users = this.getUsers();
        const clients = users.filter(u => u.role === 'client');
        if (promotorId) {
            return clients.filter(c => c.createdByPromotorId === promotorId);
        }
        return clients;
    },

    // Get all promotors
    getPromotors(): AccessUser[] {
        return this.getUsers().filter(u => u.role === 'promotor');
    },

    // Passcodes CRUD
    getPasscodes(): PasscodeItem[] {
        try {
            const raw = localStorage.getItem(STORAGE_PASSCODES_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('Error loading passcodes', e);
        }
        const initials = getInitialPasscodes();
        localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(initials));
        return initials;
    },

    savePasscode(item: Omit<PasscodeItem, 'id' | 'createdAt' | 'usedCount'> & { id?: string }): PasscodeItem {
        const items = this.getPasscodes();
        let saved: PasscodeItem;
        if (item.id) {
            const idx = items.findIndex(p => p.id === item.id);
            if (idx !== -1) {
                saved = { ...items[idx], ...item };
                items[idx] = saved;
            } else {
                saved = {
                    ...item,
                    id: item.id,
                    usedCount: 0,
                    createdAt: new Date().toISOString()
                };
                items.unshift(saved);
            }
        } else {
            saved = {
                ...item,
                id: `pwd-${Date.now().toString().slice(-6)}`,
                usedCount: 0,
                createdAt: new Date().toISOString()
            };
            items.unshift(saved);
        }
        localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(items));
        return saved;
    },

    deletePasscode(id: string): boolean {
        const items = this.getPasscodes();
        if (items.length <= 1) return false;
        const filtered = items.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(filtered));
        return true;
    },

    togglePasscodeStatus(id: string): PasscodeItem | null {
        const items = this.getPasscodes();
        const target = items.find(p => p.id === id);
        if (!target) return null;
        target.status = target.status === 'aktif' ? 'nonaktif' : 'aktif';
        localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(items));
        return target;
    },

    // App Links CRUD
    getAppLinks(): AppLinkItem[] {
        try {
            const raw = localStorage.getItem(STORAGE_LINKS_KEY);
            if (raw) {
                const links: AppLinkItem[] = JSON.parse(raw);
                return links.map(l => ({
                    ...l,
                    fullUrl: l.fullUrl || buildFullAppLink(l.slugOrToken)
                }));
            }
        } catch (e) {
            console.error('Error loading app links', e);
        }
        const initials = getInitialLinks().map(l => ({
            ...l,
            fullUrl: buildFullAppLink(l.slugOrToken)
        }));
        localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(initials));
        return initials;
    },

    saveAppLink(link: Omit<AppLinkItem, 'id' | 'createdAt' | 'clicks'> & { id?: string }): AppLinkItem {
        const links = this.getAppLinks();
        let saved: AppLinkItem;
        const fullUrl = buildFullAppLink(link.slugOrToken);

        if (link.id) {
            const idx = links.findIndex(l => l.id === link.id);
            if (idx !== -1) {
                saved = { ...links[idx], ...link, fullUrl };
                links[idx] = saved;
            } else {
                saved = {
                    ...link,
                    id: link.id,
                    fullUrl,
                    clicks: 0,
                    createdAt: new Date().toISOString()
                };
                links.unshift(saved);
            }
        } else {
            saved = {
                ...link,
                id: `lnk-${Date.now().toString().slice(-6)}`,
                fullUrl,
                clicks: 0,
                createdAt: new Date().toISOString()
            };
            links.unshift(saved);
        }
        localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
        return saved;
    },

    deleteAppLink(id: string): boolean {
        const links = this.getAppLinks();
        const filtered = links.filter(l => l.id !== id);
        localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(filtered));
        return true;
    },

    toggleLinkStatus(id: string): AppLinkItem | null {
        const links = this.getAppLinks();
        const target = links.find(l => l.id === id);
        if (!target) return null;
        target.status = target.status === 'aktif' ? 'nonaktif' : 'aktif';
        localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
        return target;
    },

    syncUserToAppLink(user: AccessUser) {
        const links = this.getAppLinks();
        const existing = links.find(l => l.slugOrToken === user.token);
        if (existing) {
            existing.title = `Link Akses: ${user.nama}`;
            existing.assignedUser = user.nama;
            existing.status = user.status;
            existing.tanggalAwal = user.tanggalAwal;
            existing.tanggalBerakhir = user.tanggalBerakhir;
            existing.fullUrl = buildFullAppLink(user.token);
        } else {
            links.unshift({
                id: `lnk-${Date.now().toString().slice(-6)}`,
                title: `Link Akses: ${user.nama}`,
                slugOrToken: user.token,
                fullUrl: buildFullAppLink(user.token),
                assignedUser: user.nama,
                status: user.status,
                tanggalAwal: user.tanggalAwal,
                tanggalBerakhir: user.tanggalBerakhir,
                clicks: 0,
                createdAt: new Date().toISOString()
            });
        }
        localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
    },

    // Date validity checker
    checkDateValidity(startDateStr: string, endDateStr: string): { status: 'active' | 'not_started' | 'expired'; remainingDays: number } {
        const todayStr = formatDateYMD(new Date());
        
        // Start date check
        if (startDateStr && todayStr < startDateStr) {
            const startD = new Date(startDateStr).getTime();
            const nowD = new Date(todayStr).getTime();
            const diffDays = Math.ceil((startD - nowD) / (1000 * 60 * 60 * 24));
            return { status: 'not_started', remainingDays: diffDays };
        }

        // End date check
        if (endDateStr && todayStr > endDateStr) {
            const endD = new Date(endDateStr).getTime();
            const nowD = new Date(todayStr).getTime();
            const diffDays = Math.floor((nowD - endD) / (1000 * 60 * 60 * 24));
            return { status: 'expired', remainingDays: -diffDays };
        }

        // Calculate remaining active days
        if (endDateStr) {
            const endD = new Date(endDateStr).getTime();
            const nowD = new Date(todayStr).getTime();
            const remaining = Math.ceil((endD - nowD) / (1000 * 60 * 60 * 24));
            return { status: 'active', remainingDays: remaining };
        }

        return { status: 'active', remainingDays: 999 };
    },

    // Comprehensive Access Validator: checks Global App Status, User Status, Passcode, and Date Validity
    validateAccess(query: { passcode?: string; token?: string }): AccessValidationResult {
        const config = this.getGlobalConfig();

        // 1. Check Global App Status
        if (config.appStatus === 'nonaktif') {
            return {
                isValid: false,
                reason: 'app_inactive',
                message: config.maintenanceMessage || 'Aplikasi STIFIn Ultimate sedang nonaktif oleh administrator.'
            };
        }

        const todayStr = formatDateYMD(new Date());
        const users = this.getUsers();

        // 2. Validate by Link Token if provided
        if (query.token) {
            const trimmedToken = query.token.trim();
            const user = users.find(u => u.token.toLowerCase() === trimmedToken.toLowerCase());
            
            if (user) {
                // Check User Status
                if (user.status === 'nonaktif') {
                    return {
                        isValid: false,
                        reason: 'user_inactive',
                        message: `Akses pengguna untuk '${user.nama}' sedang dinonaktifkan oleh administrator.`,
                        user
                    };
                }

                // Check Validity Period
                const dateCheck = this.checkDateValidity(user.tanggalAwal, user.tanggalBerakhir);
                if (dateCheck.status === 'not_started') {
                    return {
                        isValid: false,
                        reason: 'not_started',
                        message: `Masa aktif akses aplikasi belum dimulai. Akses akan mulai aktif pada tanggal ${user.tanggalAwal}.`,
                        user,
                        startDate: user.tanggalAwal,
                        endDate: user.tanggalBerakhir,
                        remainingDays: dateCheck.remainingDays
                    };
                }
                if (dateCheck.status === 'expired') {
                    return {
                        isValid: false,
                        reason: 'expired',
                        message: `Masa aktif akses aplikasi telah berakhir pada ${user.tanggalBerakhir}. Silakan hubungi administrator untuk memperpanjang akses.`,
                        user,
                        startDate: user.tanggalAwal,
                        endDate: user.tanggalBerakhir,
                        remainingDays: dateCheck.remainingDays
                    };
                }

                // Valid! Update login count & link click count
                user.loginCount = (user.loginCount || 0) + 1;
                user.lastAccessed = new Date().toISOString();
                localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

                const links = this.getAppLinks();
                const lnk = links.find(l => l.slugOrToken === user.token);
                if (lnk) {
                    lnk.clicks = (lnk.clicks || 0) + 1;
                    localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
                }

                return {
                    isValid: true,
                    reason: 'valid',
                    message: 'Akses link valid.',
                    user,
                    startDate: user.tanggalAwal,
                    endDate: user.tanggalBerakhir,
                    remainingDays: dateCheck.remainingDays
                };
            }

            // Check standalone AppLink
            const links = this.getAppLinks();
            const linkItem = links.find(l => l.slugOrToken.toLowerCase() === trimmedToken.toLowerCase());
            if (linkItem) {
                if (linkItem.status === 'nonaktif') {
                    return {
                        isValid: false,
                        reason: 'passcode_inactive',
                        message: `Link akses '${linkItem.title}' sedang dinonaktifkan.`
                    };
                }
                const dateCheck = this.checkDateValidity(linkItem.tanggalAwal, linkItem.tanggalBerakhir);
                if (dateCheck.status === 'not_started') {
                    return {
                        isValid: false,
                        reason: 'not_started',
                        message: `Link akses belum aktif. Mulai aktif pada ${linkItem.tanggalAwal}.`,
                        startDate: linkItem.tanggalAwal,
                        endDate: linkItem.tanggalBerakhir
                    };
                }
                if (dateCheck.status === 'expired') {
                    return {
                        isValid: false,
                        reason: 'expired',
                        message: `Masa aktif link ini telah berakhir pada ${linkItem.tanggalBerakhir}.`,
                        startDate: linkItem.tanggalAwal,
                        endDate: linkItem.tanggalBerakhir
                    };
                }
                linkItem.clicks = (linkItem.clicks || 0) + 1;
                localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(links));
                return {
                    isValid: true,
                    reason: 'valid',
                    message: 'Link akses valid.',
                    startDate: linkItem.tanggalAwal,
                    endDate: linkItem.tanggalBerakhir,
                    remainingDays: dateCheck.remainingDays
                };
            }
        }

        // 3. Validate by Passcode
        if (query.passcode) {
            const trimmedPass = query.passcode.trim();

            // Check against Users database first
            const user = users.find(u => u.passcode === trimmedPass);
            if (user) {
                if (user.status === 'nonaktif') {
                    return {
                        isValid: false,
                        reason: 'user_inactive',
                        message: `Akses pengguna '${user.nama}' dinonaktifkan oleh administrator.`,
                        user
                    };
                }
                const dateCheck = this.checkDateValidity(user.tanggalAwal, user.tanggalBerakhir);
                if (dateCheck.status === 'not_started') {
                    return {
                        isValid: false,
                        reason: 'not_started',
                        message: `Masa aktif akses aplikasi belum dimulai (mulai ${user.tanggalAwal}).`,
                        user,
                        startDate: user.tanggalAwal,
                        endDate: user.tanggalBerakhir
                    };
                }
                if (dateCheck.status === 'expired') {
                    return {
                        isValid: false,
                        reason: 'expired',
                        message: `Masa aktif akses aplikasi telah berakhir pada ${user.tanggalBerakhir}. Akses tidak dapat dilanjutkan.`,
                        user,
                        startDate: user.tanggalAwal,
                        endDate: user.tanggalBerakhir
                    };
                }

                user.loginCount = (user.loginCount || 0) + 1;
                user.lastAccessed = new Date().toISOString();
                localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

                return {
                    isValid: true,
                    reason: 'valid',
                    message: 'Autentikasi pengguna berhasil.',
                    user,
                    startDate: user.tanggalAwal,
                    endDate: user.tanggalBerakhir,
                    remainingDays: dateCheck.remainingDays
                };
            }

            // Check against Passcodes database
            const passcodes = this.getPasscodes();
            const matchedPasscode = passcodes.find(p => p.code === trimmedPass);
            if (matchedPasscode) {
                if (matchedPasscode.status === 'nonaktif') {
                    return {
                        isValid: false,
                        reason: 'passcode_inactive',
                        message: `Password akses '${matchedPasscode.label || matchedPasscode.code}' sedang dinonaktifkan.`
                    };
                }
                const dateCheck = this.checkDateValidity(matchedPasscode.tanggalAwal, matchedPasscode.tanggalBerakhir);
                if (dateCheck.status === 'not_started') {
                    return {
                        isValid: false,
                        reason: 'not_started',
                        message: `Password akses belum dapat digunakan (mulai aktif ${matchedPasscode.tanggalAwal}).`,
                        matchedPasscode,
                        startDate: matchedPasscode.tanggalAwal,
                        endDate: matchedPasscode.tanggalBerakhir
                    };
                }
                if (dateCheck.status === 'expired') {
                    return {
                        isValid: false,
                        reason: 'expired',
                        message: `Masa berlaku password ini telah berakhir pada ${matchedPasscode.tanggalBerakhir}. Akses ditolak.`,
                        matchedPasscode,
                        startDate: matchedPasscode.tanggalAwal,
                        endDate: matchedPasscode.tanggalBerakhir
                    };
                }

                matchedPasscode.usedCount = (matchedPasscode.usedCount || 0) + 1;
                localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(passcodes));

                // Find matching user for this passcode if exists or synthesize by code
                let resolvedUser = users.find(u => u.passcode === matchedPasscode.code);
                if (!resolvedUser) {
                    let role: 'master_admin' | 'promotor' | 'client' = 'client';
                    if (matchedPasscode.code === 'admin123' || matchedPasscode.code === 'sahabatsca') role = 'master_admin';
                    if (matchedPasscode.code === 'promotor123') role = 'promotor';

                    resolvedUser = {
                        id: `usr-temp-${matchedPasscode.id}`,
                        nama: matchedPasscode.label || (role === 'master_admin' ? 'Master Admin' : role === 'promotor' ? 'Promotor STIFIn' : 'Klien STIFIn'),
                        whatsapp: '',
                        email: '',
                        stifinType: 'Si',
                        bloodType: 'O',
                        role,
                        passcode: matchedPasscode.code,
                        token: '',
                        accessLink: '',
                        tanggalAwal: matchedPasscode.tanggalAwal,
                        tanggalBerakhir: matchedPasscode.tanggalBerakhir,
                        status: matchedPasscode.status,
                        createdAt: matchedPasscode.createdAt,
                        loginCount: matchedPasscode.usedCount
                    };
                }

                return {
                    isValid: true,
                    reason: 'valid',
                    message: 'Autentikasi passcode berhasil.',
                    matchedPasscode,
                    user: resolvedUser,
                    startDate: matchedPasscode.tanggalAwal,
                    endDate: matchedPasscode.tanggalBerakhir,
                    remainingDays: dateCheck.remainingDays
                };
            }

            // Check if entered passcode is admin PIN
            if (trimmedPass === config.adminPin) {
                const adminUser = users.find(u => u.role === 'master_admin') || {
                    id: 'usr-admin-pin',
                    nama: 'Master Administrator STIFIn',
                    whatsapp: '',
                    email: 'admin@stifin.com',
                    stifinType: 'Te',
                    bloodType: 'A' as const,
                    role: 'master_admin' as const,
                    passcode: config.adminPin,
                    token: 'master-admin-token',
                    accessLink: '',
                    tanggalAwal: formatDateYMD(new Date()),
                    tanggalBerakhir: formatDateYMD(addDays(new Date(), 365)),
                    status: 'aktif' as const,
                    createdAt: new Date().toISOString(),
                    loginCount: 1
                };
                return {
                    isValid: true,
                    reason: 'valid',
                    message: 'Autentikasi PIN Master Admin berhasil.',
                    user: adminUser,
                    startDate: adminUser.tanggalAwal,
                    endDate: adminUser.tanggalBerakhir,
                    remainingDays: 365
                };
            }
        }

        return {
            isValid: false,
            reason: 'not_found',
            message: 'Password akses atau token link tidak terdaftar dalam database sistem.'
        };
    },

    // Trigger post to Google Apps Script Web App
    async triggerAppsScriptSync(userData: AccessUser) {
        const config = this.getGlobalConfig();
        if (!config.scriptUrl || !config.scriptUrl.startsWith('http')) return;

        try {
            await fetch(config.scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    nama: userData.nama,
                    whatsapp: userData.whatsapp,
                    email: userData.email,
                    stifinType: userData.stifinType,
                    status: userData.status,
                    passcode: userData.passcode,
                    linkAkses: userData.accessLink,
                    tanggalAwal: userData.tanggalAwal,
                    tanggalBerakhir: userData.tanggalBerakhir,
                    catatan: userData.catatan || ''
                })
            });
        } catch (err) {
            console.warn('Apps Script sync notification failed:', err);
        }
    },

    // Export database as JSON
    exportDatabase(): string {
        const data = {
            config: this.getGlobalConfig(),
            users: this.getUsers(),
            passcodes: this.getPasscodes(),
            links: this.getAppLinks(),
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    },

    // Import database from JSON
    importDatabase(jsonStr: string): boolean {
        try {
            const data = JSON.parse(jsonStr);
            if (data.config) localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(data.config));
            if (data.users && Array.isArray(data.users)) localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(data.users));
            if (data.passcodes && Array.isArray(data.passcodes)) localStorage.setItem(STORAGE_PASSCODES_KEY, JSON.stringify(data.passcodes));
            if (data.links && Array.isArray(data.links)) localStorage.setItem(STORAGE_LINKS_KEY, JSON.stringify(data.links));
            return true;
        } catch (e) {
            console.error('Failed to import database', e);
            return false;
        }
    },

    // Reset database to initial seeds
    resetToDefaults() {
        localStorage.removeItem(STORAGE_USERS_KEY);
        localStorage.removeItem(STORAGE_PASSCODES_KEY);
        localStorage.removeItem(STORAGE_LINKS_KEY);
        localStorage.removeItem(STORAGE_CONFIG_KEY);
        this.getGlobalConfig();
        this.getUsers();
        this.getPasscodes();
        this.getAppLinks();
    }
};
