'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import FormPanel from '../components/FormPanel';
import PreviewPanel, { PreviewData } from '../components/PreviewPanel';
import type { FormData, Item, DocumentType } from '../lib/types';
import { DEFAULT_TERMS_TEXT } from '../lib/types';
import { calculateTotals } from '../lib/calc';
import { saveDraftData, loadDraftData, saveIssuerSettings, loadIssuerSettings } from '../lib/storage';

// 帳票種別ごとのデフォルト備考テンプレート
const DEFAULT_MEMOS: Record<DocumentType, string> = {
  invoice: `お支払期限：YYYY年MM月DD日
お振込先名義（カナ）：

・お支払期日までのお振込をお願いいたします。
・恐れ入りますが、振込手数料は貴社にてご負担をお願いいたします。
・本請求書は電子発行のみとなります。原本の郵送はございません。`,

  estimate: `有効期限：発行日より1ヶ月

・本見積の内容は諸条件により変更となる場合がございます。
・ご不明な点がございましたらお気軽にお問い合わせください。`,

  purchaseOrder: `納期：YYYY年MM月DD日

・本発注書受領後、請書の送付をお願いいたします。
・支払条件：貴社規定（または別途相談）に従います。`,

  receipt: '',

  outsourcingContract: '' // 業務委託契約書用（空欄）
};

export default function Page() {
  // ---- 初期値（サーバーとクライアントで常に同じ値） ----
  const getDefaultState = (): FormData => ({
    docType: 'estimate',
    docNo: 'EST-YYYYMM-001',
    subject: '',
    issueDate: new Date().toISOString().slice(0, 10),
    issuer: { name: '', zip: '', addr: '', tel: '', regNo: '' },
    client: { name: '', zip: '', addr: '' },
    paymentSite: '',
    dueDate: '',
    bank: { name: '', type: '普通', number: '', holder: '' },
    memo: DEFAULT_MEMOS.estimate, // 初期値は見積書のデフォルト
    items: [
      { name: '', desc: '', qty: 1, unit: '式', unitPrice: 0, taxRate: 10 },
    ],
    terms: {
      enabled: false,
      text: DEFAULT_TERMS_TEXT
    },
  });

  const [state, setState] = useState<FormData>(getDefaultState);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevDocTypeRef = useRef<DocumentType>(state.docType);

  // コンポーネントマウント時にlocalStorageからデータを復元
  useEffect(() => {
    // 保存された下書きデータを復元
    const savedDraft = loadDraftData();
    if (savedDraft) {
      setState(savedDraft);
      prevDocTypeRef.current = savedDraft.docType;
    } else {
      // 下書きがない場合は発行元情報だけ復元
      const savedIssuer = loadIssuerSettings();
      if (savedIssuer) {
        setState(prev => ({
          ...prev,
          issuer: savedIssuer
        }));
      }
    }

    setIsInitialized(true);
  }, []);

  // 帳票種別が変更されたときに備考欄を更新（ユーザー編集がない場合のみ）
  useEffect(() => {
    if (!isInitialized) return;

    const prevDocType = prevDocTypeRef.current;
    const currentDocType = state.docType;

    // 帳票種別が変更された場合
    if (prevDocType !== currentDocType) {
      const prevDefaultMemo = DEFAULT_MEMOS[prevDocType];
      const currentMemo = state.memo || '';

      // 現在のメモが前回のデフォルト値と一致する場合のみ、新しいデフォルト値に更新
      if (currentMemo === prevDefaultMemo) {
        setState(prev => ({
          ...prev,
          memo: DEFAULT_MEMOS[currentDocType]
        }));
      }

      prevDocTypeRef.current = currentDocType;
    }
  }, [state.docType, isInitialized]);

  // 状態変更時に自動保存（初回マウント時は除く）
  useEffect(() => {
    if (!isInitialized) return;
    saveDraftData(state);

    // 発行元情報も自動保存
    if (state.issuer) {
      saveIssuerSettings(state.issuer);
    }
  }, [state, isInitialized]);

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

  // 新規作成（発行元情報は保持）
  const handleNewDocument = () => {
    if (!confirm('現在の入力内容をクリアして新規作成しますか？\n※発行元情報は保持されます')) {
      return;
    }

    const savedIssuer = loadIssuerSettings() || state.issuer;

    setState({
      docType: 'estimate',
      docNo: 'EST-YYYYMM-001',
      subject: '',
      issueDate: new Date().toISOString().slice(0, 10),
      issuer: savedIssuer,
      client: { name: '', zip: '', addr: '' },
      paymentSite: '',
      dueDate: '',
      bank: { name: '', type: '普通', number: '', holder: '' },
      memo: DEFAULT_MEMOS.estimate,
      items: [
        { name: '', desc: '', qty: 1, unit: '式', unitPrice: 0, taxRate: 10 },
      ],
      terms: {
        enabled: false,
        text: DEFAULT_TERMS_TEXT
      },
    });

    // 新規作成時はprevDocTypeRefもリセット
    prevDocTypeRef.current = 'estimate';
  };

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
        <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex gap-3 text-sm items-center">
            <a href="/app" className="font-medium text-slate-700 hover:text-slate-900 cursor-pointer">かんたん帳票</a>
            <span className="text-slate-500 hidden sm:inline">ブラウザだけで、見積→請求→PDF</span>
          </div>
          <button
            onClick={handleNewDocument}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            新規作成
          </button>
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