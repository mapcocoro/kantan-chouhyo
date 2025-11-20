// LocalStorage ユーティリティ

import type { FormData, Issuer } from './types';

// LocalStorageのキー名
const STORAGE_KEYS = {
  DRAFT_DATA: 'chouhyo_current_draft_data',
  ISSUER_SETTINGS: 'chouhyo_user_profile_settings',
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
