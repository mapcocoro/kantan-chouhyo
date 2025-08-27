// 帳票タイプの型定義
export type DocumentType = 'estimate' | 'purchaseOrder' | 'invoice' | 'receipt' | 'outsourcingContract';

// 帳票タイプの日本語名マッピング
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  estimate: '見積書',
  purchaseOrder: '発注書', 
  invoice: '請求書',
  receipt: '領収書',
  outsourcingContract: '業務委託契約書'
};

// 逆マッピング（日本語から英語へ）
export const DOCUMENT_TYPE_FROM_LABEL: Record<string, DocumentType> = {
  '見積書': 'estimate',
  '発注書': 'purchaseOrder',
  '請求書': 'invoice', 
  '領収書': 'receipt',
  '業務委託契約書': 'outsourcingContract'
};