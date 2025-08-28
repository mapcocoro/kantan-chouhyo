// 基本の帳票データ型定義

export type DocumentType = 'estimate' | 'invoice' | 'purchaseOrder' | 'receipt' | 'outsourcingContract';

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

// 契約書専用フィールド
export interface Contract {
  period: string;          // 契約期間
  reward: string;          // 報酬
  paymentTerms: string;    // 支払条件
  acceptance: string;      // 検収
  confidentiality: string; // 秘密保持
}

// 基本帳票データ
export interface FormData {
  docType: DocumentType;
  docNo: string;           // 書類番号
  subject: string;         // 件名
  issueDate: string;       // 発行日
  dueDate?: string;        // 支払期日
  paymentSite?: string;    // 支払条件
  customPaymentSite?: string; // カスタム支払条件
  receiptPurpose?: string;    // 領収書但し書き
  manualPurpose?: boolean;    // 手動編集フラグ
  issuer: Issuer;
  client: Client;
  bank?: Bank;
  items: Item[];
  memo?: string;
  
  // 契約書専用
  contract?: Contract;
}

// 帳票タイプのラベルマッピング
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  estimate: '見積書',
  invoice: '請求書',
  purchaseOrder: '発注書',
  receipt: '領収書',
  outsourcingContract: '業務委託契約書'
};