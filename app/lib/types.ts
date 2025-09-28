// 基本の帳票データ型定義
import { DocumentType } from '../constants/docs';

export type { DocumentType };

// 事業者情報
export interface Issuer {
  name: string;
  zip: string;
  addr: string;
  tel: string;
  regNo: string; // 適格請求書発行事業者登録番号
}

// 取引先情報
export interface Client {
  name: string;
  zip: string;
  addr: string;
  honorific?: string;
}

// 銀行口座情報
export interface Bank {
  name: string;
  type: string;
  number: string;
  holder: string;
}

// 明細項目
export interface Item {
  date?: string;
  name: string;
  desc?: string;
  qty: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}

// 簡易特約フッター
export interface Terms {
  enabled: boolean;
  text: string;
}

// 発注条件の型定義
export interface OrderTerms {
  delivery: {
    type: 'perLine' | 'date' | 'period' | 'other';
    date?: string;
    periodStart?: string;
    periodEnd?: string;
    period?: string;
    free?: string;
  };
  acceptance: {
    type: 'after_7' | 'after_10' | 'after_30' | 'none' | 'milestone' | 'custom';
    days?: number;
    dayKind?: 'business' | 'calendar';
    note?: string;
  };
  payment: {
    type: 'site_30' | 'site_60' | 'days_after' | 'on_delivery' | 'per_delivery';
    days?: number;
    dayKind?: 'business' | 'calendar';
  };
}

// 基本帳票データ
export interface FormData {
  docType: DocumentType;
  docNo: string;           // 書類番号
  subject: string;         // 件名
  issueDate: string;       // 発行日
  dueDate?: string;        // 支払期日
  paymentSite?: string;    // 支払条件
  receiptPurpose?: string;    // 領収書但し書き
  manualPurpose?: boolean;    // 手動編集フラグ
  issuer: Issuer;
  client: Client;
  bank?: Bank;
  items: Item[];
  memo?: string;

  // 発注条件
  orderTerms?: OrderTerms;

  // 簡易特約フッター
  terms?: Terms;
}

// 帳票タイプのラベルマッピング（新しい定数ファイルからインポート）
export { DOC_LABELS as DOCUMENT_TYPE_LABELS, DOC_ORDER } from '../constants/docs';

// 支払条件プリセット
export const PAYMENT_TERMS_PRESETS = [
  '月末締め、翌月末払い',
  '月末締め、翌月10日払い',
  '月末締め、翌々月末払い',
  '検収完了後 7 日以内支払い',
  '検収完了後 30 日以内支払い',
  '納品後 7 日以内支払い',
  '納品後 30 日以内支払い'
];

// 単位候補配列
export const UNIT_OPTIONS = [
  '式', '個', '件', '時間', '日', '月', '人時', 
  'セット', '本', '台', '箇所', '枚', 
  'ライセンス', '㎡', 'm', 'kg', 'GB'
];

// 敬称候補配列
export const HONORIFIC_OPTIONS = [
  '御中',
  '様',
  '先生',
  ''
];

// デフォルト特約文
export const DEFAULT_TERMS_TEXT = `取引特約：支払は月末締め翌月末払い（必要に応じ源泉徴収可）。成果物の知的財産権は発注者に帰属（著作者人格権不行使）。秘密保持を遵守。30日前通知で中途解約可（着手済み分は精算）。賠償は直接損害に限り、上限は直近6か月の支払総額。準拠法は日本法、管轄は〔任意の地名〕地方裁判所。`;