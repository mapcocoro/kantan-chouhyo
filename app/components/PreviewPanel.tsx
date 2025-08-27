'use client';
import React from 'react';
import type { FormData } from '../lib/types';
import EstimatePreview from './preview/EstimatePreview';
import InvoicePreview from './preview/InvoicePreview';
import PurchaseOrderPreview from './preview/PurchaseOrderPreview';
import ReceiptPreview from './preview/ReceiptPreview';
import ContractPreview from './preview/ContractPreview';

export type PreviewData = {
  data: FormData;
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
};

export default function PreviewPanel({ data, subTotal, taxTotal, grandTotal }: PreviewData) {
  const handlePrint = () => {
    window.print();
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('共有リンクをコピーしました');
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
      case 'outsourcingContract':
        return <ContractPreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
      default:
        return <EstimatePreview data={data} subTotal={subTotal} taxTotal={taxTotal} grandTotal={grandTotal} />;
    }
  };

  return (
    <div className="rounded border bg-white shadow-sm">
      {/* プレビューヘッダー */}
      <div className="p-3 border-b bg-slate-50 no-print">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">プレビュー</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            className="h-10 text-sm px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 font-medium"
            onClick={handlePrint}
          >
            印刷 / PDF保存
          </button>
          <button
            className="h-10 text-sm px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium"
            onClick={copyShareLink}
          >
            共有リンクをコピー
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