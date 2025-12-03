// LocalStorage ユーティリティ

import type { FormData, Issuer, Client, Bank } from './types';

// LocalStorageのキー名
const STORAGE_KEYS = {
  DRAFT_DATA: 'chouhyo_current_draft_data',
  ISSUER_SETTINGS: 'chouhyo_user_profile_settings',
  CLIENT_SETTINGS: 'chouhyo_client_settings',
  BANK_SETTINGS: 'chouhyo_bank_settings',
  SAVE_CLIENT_DISABLED: 'chouhyo_save_client_disabled',
} as const;

/**
 * 現在の下書きデータを保存
 */
export function saveDraftData(data: FormData): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.DRAFT_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft data:', error);
  }
}

/**
 * 保存された下書きデータを読み込み
 */
export function loadDraftData(): FormData | null {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.DRAFT_DATA);
    if (!stored) return null;
    return JSON.parse(stored) as FormData;
  } catch (error) {
    console.error('Failed to load draft data:', error);
    return null;
  }
}

/**
 * 下書きデータを削除
 */
export function clearDraftData(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DATA);
  } catch (error) {
    console.error('Failed to clear draft data:', error);
  }
}

/**
 * 発行元（自社）情報のデフォルト設定を保存
 */
export function saveIssuerSettings(issuer: Issuer): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ISSUER_SETTINGS, JSON.stringify(issuer));
  } catch (error) {
    console.error('Failed to save issuer settings:', error);
  }
}

/**
 * 保存された発行元情報を読み込み
 */
export function loadIssuerSettings(): Issuer | null {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.ISSUER_SETTINGS);
    if (!stored) return null;
    return JSON.parse(stored) as Issuer;
  } catch (error) {
    console.error('Failed to load issuer settings:', error);
    return null;
  }
}

/**
 * 発行元情報設定を削除
 */
export function clearIssuerSettings(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ISSUER_SETTINGS);
  } catch (error) {
    console.error('Failed to clear issuer settings:', error);
  }
}

/**
 * 取引先（クライアント）情報を保存
 */
export function saveClientSettings(client: Client): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CLIENT_SETTINGS, JSON.stringify(client));
  } catch (error) {
    console.error('Failed to save client settings:', error);
  }
}

/**
 * 保存された取引先情報を読み込み
 */
export function loadClientSettings(): Client | null {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.CLIENT_SETTINGS);
    if (!stored) return null;
    return JSON.parse(stored) as Client;
  } catch (error) {
    console.error('Failed to load client settings:', error);
    return null;
  }
}

/**
 * 取引先情報を削除
 */
export function clearClientSettings(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CLIENT_SETTINGS);
  } catch (error) {
    console.error('Failed to clear client settings:', error);
  }
}

/**
 * クライアント情報保存の無効化フラグを設定
 */
export function setSaveClientDisabled(disabled: boolean): void {
  try {
    if (typeof window === 'undefined') return;
    if (disabled) {
      localStorage.setItem(STORAGE_KEYS.SAVE_CLIENT_DISABLED, 'true');
      // 無効にした時点で保存済みクライアント情報も削除
      clearClientSettings();
    } else {
      localStorage.removeItem(STORAGE_KEYS.SAVE_CLIENT_DISABLED);
    }
  } catch (error) {
    console.error('Failed to set save client disabled:', error);
  }
}

/**
 * クライアント情報保存が無効かどうかを取得
 */
export function isSaveClientDisabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.SAVE_CLIENT_DISABLED) === 'true';
  } catch (error) {
    console.error('Failed to get save client disabled:', error);
    return false;
  }
}

/**
 * 振込先情報を保存
 */
export function saveBankSettings(bank: Bank): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BANK_SETTINGS, JSON.stringify(bank));
  } catch (error) {
    console.error('Failed to save bank settings:', error);
  }
}

/**
 * 保存された振込先情報を読み込み
 */
export function loadBankSettings(): Bank | null {
  try {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEYS.BANK_SETTINGS);
    if (!stored) return null;
    return JSON.parse(stored) as Bank;
  } catch (error) {
    console.error('Failed to load bank settings:', error);
    return null;
  }
}
