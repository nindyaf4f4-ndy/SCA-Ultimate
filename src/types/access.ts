/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AccessStatus = 'aktif' | 'nonaktif';

export type UserRole = 'master_admin' | 'promotor' | 'client';

export interface AccessUser {
    id: string;
    nama: string;
    whatsapp: string;
    email: string;
    stifinType: string; // e.g. 'Si', 'Se', 'Ti', 'Te', 'Ii', 'Ie', 'Fi', 'Fe', 'In'
    bloodType?: 'O' | 'A' | 'B' | 'AB';
    role: UserRole;
    passcode: string;
    token: string;
    accessLink: string;
    tanggalAwal: string; // YYYY-MM-DD
    tanggalBerakhir: string; // YYYY-MM-DD
    status: AccessStatus; // aktif / nonaktif
    catatan?: string;
    createdByPromotorId?: string;
    createdByPromotorName?: string;
    testDate?: string;
    createdAt: string;
    lastAccessed?: string;
    loginCount: number;
}

export interface PasscodeItem {
    id: string;
    code: string;
    label: string;
    assignedUser?: string;
    status: AccessStatus; // aktif / nonaktif
    tanggalAwal: string; // YYYY-MM-DD
    tanggalBerakhir: string; // YYYY-MM-DD
    maxUses?: number;
    usedCount: number;
    createdAt: string;
}

export interface AppLinkItem {
    id: string;
    title: string;
    slugOrToken: string;
    fullUrl: string;
    assignedUser?: string;
    status: AccessStatus; // aktif / nonaktif
    tanggalAwal: string; // YYYY-MM-DD
    tanggalBerakhir: string; // YYYY-MM-DD
    clicks: number;
    createdAt: string;
}

export interface GlobalAppConfig {
    appStatus: AccessStatus; // fitur aktif dan nonaktif aplikasi secara menyeluruh
    maintenanceMessage: string;
    adminPin: string; // default "3308"
    scriptUrl: string; // Google Apps Script Web App
}

export interface AccessValidationResult {
    isValid: boolean;
    reason?: 'valid' | 'not_found' | 'app_inactive' | 'user_inactive' | 'passcode_inactive' | 'not_started' | 'expired';
    message: string;
    user?: AccessUser;
    matchedPasscode?: PasscodeItem;
    startDate?: string;
    endDate?: string;
    remainingDays?: number;
}
