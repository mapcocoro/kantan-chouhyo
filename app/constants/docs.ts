// 実務の流れに合わせた帳票タイプの順序定義
export const DOC_ORDER = ['estimate', 'purchaseOrder', 'invoice', 'receipt'] as const;

export const DOC_LABELS: Record<typeof DOC_ORDER[number], string> = {
  estimate: '見積書',
  purchaseOrder: '発注書',
  invoice: '請求書',
  receipt: '領収書',
};

// 型定義
export type DocumentType = typeof DOC_ORDER[number];