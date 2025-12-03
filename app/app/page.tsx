'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import FormPanel from '../components/FormPanel';
import PreviewPanel, { PreviewData } from '../components/PreviewPanel';
import type { FormData, Item, DocumentType } from '../lib/types';
import { DEFAULT_TERMS_TEXT } from '../lib/types';
import { calculateTotals } from '../lib/calc';
import {
  saveIssuerSettings,
  loadIssuerSettings,
  saveClientSettings,
  loadClientSettings,
  clearClientSettings,
  isSaveClientDisabled,
  setSaveClientDisabled,
  saveBankSettings,
  loadBankSettings
} from '../lib/storage';

// 帳票種別ごとのデフォルト備考テンプレート
const DEFAULT_MEMOS: Record<DocumentType, string> = {
  invoice: `お支払期限：YYYY年MM月DD日

・お支払期日までのお振込をお願いいたします。
・恐れ入りますが、振込手数料は貴社にてご負担をお願いいたします。
・本請求書は電子発行のみとなります。原本の郵送はございません。`,

  estimate: `有効期限：発行日より1ヶ月

・本見積の内容は諸条件により変更となる場合がございます。
・ご不明な点がございましたらお気軽にお問い合わせください。`,

  purchaseOrder: `納期：YYYY年MM月DD日

・本発注書受領後、注文請書の送付をお願いいたします。
・納期は発注者からの素材・情報支給状況により変動する場合があります。`,

  receipt: `・本領収書は銀行振込確認後に発行しております。
・再発行はいたしかねますので、大切に保管してください。`
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
  const [saveClientDisabled, setLocalSaveClientDisabled] = useState(false);
  const prevDocTypeRef = useRef<DocumentType>(state.docType);

  // コンポーネントマウント時にlocalStorageから保持すべき項目のみ復元
  // 保持: 自社情報、取引先情報、振込先情報
  // リセット: 件名、明細、備考、書類番号、発行日、支払期限
  useEffect(() => {
    // クライアント情報保存の無効化フラグを読み込み
    setLocalSaveClientDisabled(isSaveClientDisabled());

    // 保持すべき項目のみ復元（下書き全体ではなく個別に）
    const savedIssuer = loadIssuerSettings();
    const savedClient = loadClientSettings();
    const savedBank = loadBankSettings();

    setState(prev => ({
      ...prev,
      issuer: savedIssuer || prev.issuer,
      client: savedClient || prev.client,
      bank: savedBank || prev.bank
    }));

    setIsInitialized(true);
  }, []);

  // 帳票種別が変更されたときに備考欄を更新（ユーザー編集がない場合のみ）
  // また、発注書⇔他帳票の切り替え時に発行者/取引先を入れ替え
  useEffect(() => {
    if (!isInitialized) return;

    const prevDocType = prevDocTypeRef.current;
    const currentDocType = state.docType;

    // 帳票種別が変更された場合
    if (prevDocType !== currentDocType) {
      const prevDefaultMemo = DEFAULT_MEMOS[prevDocType];
      const currentMemo = state.memo || '';
      const savedIssuer = loadIssuerSettings();

      // 発注書から他の帳票に切り替えた場合
      // → 受注者欄（client）にあった自社情報を発行者欄（issuer）に戻す
      if (prevDocType === 'purchaseOrder' && currentDocType !== 'purchaseOrder') {
        setState(prev => ({
          ...prev,
          memo: currentMemo === prevDefaultMemo ? DEFAULT_MEMOS[currentDocType] : prev.memo,
          // 受注者欄（client）にあった自社情報を発行者欄に戻し、取引先は空に
          issuer: savedIssuer || prev.client as FormData['issuer'],
          client: { name: '', zip: '', addr: '' }
        }));
      }
      // 他の帳票から発注書に切り替えた場合
      // → 発行者欄（issuer）にあった自社情報を受注者欄（client）に移す
      else if (prevDocType !== 'purchaseOrder' && currentDocType === 'purchaseOrder') {
        setState(prev => ({
          ...prev,
          memo: currentMemo === prevDefaultMemo ? DEFAULT_MEMOS[currentDocType] : prev.memo,
          // 自社情報（保存済み or 現在のissuer）を受注者欄に移す
          client: {
            name: savedIssuer?.name || prev.issuer.name || '',
            zip: savedIssuer?.zip || prev.issuer.zip || '',
            addr: savedIssuer?.addr || prev.issuer.addr || ''
          },
          // 発注者欄（issuer）は空に
          issuer: { name: '', zip: '', addr: '', tel: '', regNo: '' }
        }));
      }
      // それ以外（発注書以外の帳票間の切り替え）
      else {
        // 現在のメモが前回のデフォルト値と一致する場合のみ、新しいデフォルト値に更新
        if (currentMemo === prevDefaultMemo) {
          setState(prev => ({
            ...prev,
            memo: DEFAULT_MEMOS[currentDocType]
          }));
        }
      }

      prevDocTypeRef.current = currentDocType;
    }
  }, [state.docType, isInitialized]);

  // 状態変更時に保持すべき項目のみ自動保存（初回マウント時は除く）
  // 保持: 自社情報、取引先情報、振込先情報
  useEffect(() => {
    if (!isInitialized) return;

    // 発行元（自社）情報の自動保存
    // 発注書の場合は受注者欄（client）に自社情報があるので、そちらを保存
    // それ以外の場合は発行者欄（issuer）を保存
    if (state.docType === 'purchaseOrder') {
      // 発注書の場合、受注者欄に自社情報がある
      // 名前が入力されている場合のみ保存（空で上書きしないため）
      if (state.client?.name) {
        saveIssuerSettings({
          name: state.client.name,
          zip: state.client.zip || '',
          addr: state.client.addr || '',
          tel: '', // clientにはtelがないので空
          regNo: '' // clientにはregNoがないので空
        });
      }
      // 発注書の場合、発注者欄（issuer）が取引先情報
      if (!saveClientDisabled && state.issuer?.name) {
        saveClientSettings({
          name: state.issuer.name,
          zip: state.issuer.zip || '',
          addr: state.issuer.addr || ''
        });
      }
    } else {
      // それ以外の帳票では発行者欄に自社情報がある
      if (state.issuer?.name) {
        saveIssuerSettings(state.issuer);
      }
      // 取引先情報の自動保存（無効でない場合のみ）
      if (!saveClientDisabled && state.client?.name) {
        saveClientSettings(state.client);
      }
    }

    // 振込先情報の自動保存（入力がある場合のみ）
    if (state.bank?.name || state.bank?.number || state.bank?.holder) {
      saveBankSettings(state.bank);
    }
  }, [state, isInitialized, saveClientDisabled]);

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

  // クライアント情報をクリア
  const handleClearClient = () => {
    clearClientSettings();
    // 発注書の場合はissuer、それ以外はclientをクリア
    if (state.docType === 'purchaseOrder') {
      setState(s => ({
        ...s,
        issuer: { name: '', zip: '', addr: '', tel: '', regNo: '' }
      }));
    } else {
      setState(s => ({
        ...s,
        client: { name: '', zip: '', addr: '' }
      }));
    }
  };

  // クライアント情報保存の有効/無効切り替え
  const handleToggleSaveClient = (disabled: boolean) => {
    setSaveClientDisabled(disabled);
    setLocalSaveClientDisabled(disabled);
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
                saveClientDisabled={saveClientDisabled}
                onToggleSaveClient={handleToggleSaveClient}
                onClearClient={handleClearClient}
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