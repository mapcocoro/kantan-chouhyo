'use client';
import React from 'react';
import type { FormData } from '../lib/types';
import EstimatePreview from './preview/EstimatePreview';
import InvoicePreview from './preview/InvoicePreview';
import PurchaseOrderPreview from './preview/PurchaseOrderPreview';
import ReceiptPreview from './preview/ReceiptPreview';

export type PreviewData = {
  data: FormData;
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
};

export default function PreviewPanel({ data, subTotal, taxTotal, grandTotal }: PreviewData) {
  const handlePrint = () => {
    // 請求書の場合は支払期日が必須
    if (data.docType === 'invoice' && !data.dueDate) {
      alert('請求書では支払期日の入力が必要です。');
      return;
    }
    window.print();
  };

  const renderPreview = () => {
    switch (data.docType) {
      case 'estimate':
        return <EstimatePreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
      case 'invoice':
        return <InvoicePreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
      case 'purchaseOrder':
        return <PurchaseOrderPreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
      case 'receipt':
        return <ReceiptPreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
      default:
        return <EstimatePreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
    }
  };

  return (
    <div className="rounded border bg-white shadow-sm">
      {/* プレビューヘッダー */}
      <div className="p-3 border-b bg-slate-50 no-print">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">プレビュー</h3>
        <div className="flex justify-center">
          <button
            className="h-10 text-sm px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 font-medium w-full sm:w-auto"
            onClick={handlePrint}
          >
            印刷 / PDF保存
          </button>
        </div>
      </div>

      {/* 印刷エリア */}
      <div id="print-area" className="p-6">
        {renderPreview()}
      </div>
    </div>
  );
}