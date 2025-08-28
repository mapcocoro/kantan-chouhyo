'use client';
import React, { useMemo, useState } from 'react';
import FormPanel from '../components/FormPanel';
import PreviewPanel, { PreviewData } from '../components/PreviewPanel';
import type { FormData, Item } from '../lib/types';
import { DEFAULT_TERMS_TEXT } from '../lib/types';
import { calculateTotals } from '../lib/calc';

export default function Page() {
  // ---- 初期値（必要に応じて調整） ----
  const [state, setState] = useState<FormData>({
    docType: 'estimate',
    docNo: 'EST-YYYYMM-001',
    subject: '',
    issueDate: new Date().toISOString().slice(0, 10),
    issuer: { name: '', zip: '', addr: '', tel: '', regNo: '' },
    client: { name: '', zip: '', addr: '' },
    paymentSite: '',
    dueDate: '',
    bank: { name: '', type: '普通', number: '', holder: '' },
    memo: 'お支払期日までのお振込をお願いいたします（振込手数料はご負担下さい）。',
    items: [
      { name: '', desc: '', qty: 1, unit: '式', unitPrice: 0, taxRate: 10 },
    ],
    terms: {
      enabled: false,
      text: DEFAULT_TERMS_TEXT
    },
  });

  // ---- ハンドラ（差分更新のユーティリティ） ----
  const onChange = (patch: Partial<FormData>) => setState(s => ({ ...s, ...patch }));
  const onChangeIssuer = (patch: Partial<FormData['issuer']>) =>
    setState(s => ({ ...s, issuer: { ...s.issuer, ...patch } }));
  const onChangeClient = (patch: Partial<FormData['client']>) =>
    setState(s => ({ ...s, client: { ...s.client, ...patch } }));
  const onChangeItem = (index: number, patch: Partial<Item>) =>
    setState(s => {
      const items = [...s.items];
      items[index] = { ...items[index], ...patch };
      return { ...s, items };
    });
  const onAddItem = () =>
    setState(s => ({ ...s, items: [...s.items, { name: '', desc: '', qty: 1, unit: '式', unitPrice: 0, taxRate: 10 }] }));
  const onRemoveItem = (index: number) =>
    setState(s => ({ ...s, items: s.items.filter((_, i) => i !== index) }));

  // ---- 集計（税率混在も考慮するなら reduce で合算） ----
  const { subTotal, taxTotal, grandTotal } = useMemo(() => {
    return calculateTotals(state.items);
  }, [state.items]);

  const previewData: PreviewData = {
    data: state,
    subTotal,
    taxTotal,
    grandTotal,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <nav className="sticky top-0 z-30 bg-white/75 backdrop-blur border-b">
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-2 flex gap-3 text-sm">
          <a href="/app" className="font-medium text-slate-700 hover:text-slate-900 cursor-pointer">かんたん帳票</a>
          <span className="text-slate-500">ブラウザだけで、見積→請求→PDF</span>
        </div>
      </nav>

      {/* 本体（12カラム） */}
      <main className="mx-auto max-w-[1400px] px-3 lg:px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* フォーム側だけ compact 適用 */}
          <section className="ui-compact">
            <div className="section space-y-2">
              <FormPanel
                state={state}
                onChange={onChange}
                onChangeIssuer={onChangeIssuer}
                onChangeClient={onChangeClient}
                onChangeItem={onChangeItem}
                onAddItem={onAddItem}
                onRemoveItem={onRemoveItem}
              />
            </div>
          </section>

          {/* プレビュー側は等倍のまま */}
          <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <PreviewPanel {...previewData} />
          </aside>
        </div>
      </main>

      {/* モバイル用プレビューへのジャンプボタン（必要に応じて） */}
      <button
        onClick={() => document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' })}
        className="fixed bottom-5 right-5 lg:hidden flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-white shadow-lg z-20 transition-all"
      >
        ↓ プレビューへ
      </button>
    </div>
  );
}