"use client";

import React, { useEffect, useMemo, useState } from "react";

// ------------------------------------------------------------
// 超シンプル帳票ジェネレーター（保存なし・URL共有・印刷）
// - 目的: フォーム入力→その場で「請求書 / 見積書 / 発注書 / 領収書 / 契約書」
// - 特徴: サーバ不要 / データ保存なし / URLに埋め込んで共有可 / 印刷→PDF保存
// - 使い方: このコンポーネントを Next.js の app/page.tsx に貼るだけで動作
// ------------------------------------------------------------

// ### 便利関数
const jpy = new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 });
const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString("ja-JP") : "";
const todayISO = () => new Date().toISOString().slice(0,10);

function base64Encode(obj: unknown){
  const json = JSON.stringify(obj);
  return typeof window === 'undefined' ? '' : btoa(unescape(encodeURIComponent(json)));
}
function base64Decode<T=unknown>(b64: string): T | null{
  try{ return JSON.parse(decodeURIComponent(escape(atob(b64)))); }catch{ return null; }
}

// ### 型
type DocType = 'invoice' | 'quote' | 'po' | 'receipt' | 'contract';

type Line = { date?: string; name: string; desc?: string; qty: number; unit: string; unitPrice: number; taxRate: number }; // 税抜

type Party = { name: string; address?: string; zipCode?: string; tel?: string; regNo?: string; person?: string };

type Bank = { bank?: string; branch?: string; type?: string; number?: string; holder?: string };

type State = {
  docType: DocType;
  number: string;
  subject?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate?: string;  // invoiceのみ任意
  payerTerms?: string; // 支払条件テキスト
  orderDate?: string; orderNo?: string; deliveryDate?: string; // 発注/契約用
  parties: { issuer: Party; customer: Party };
  bank: Bank;
  lines: Line[];
  notes?: string;
};

const EMPTY: State = {
  docType:'quote',
  number:'QTE-YYYYMM-001',
  issueDate: todayISO(),
  parties:{ issuer:{ name:"あなたの事業者名", address:"住所", tel:"", regNo:"T" }, customer:{ name:"取引先名 御中", address:"" } },
  bank:{ bank:"銀行名", branch:"支店", type:"普通", number:"1234567", holder:"名義" },
  lines: [ { date: todayISO(), name: "作業内容", desc:"", qty:1, unit:"式", unitPrice:0, taxRate:10 } ],
  notes: "お支払期日までのお振込をお願いいたします（振込手数料はご負担下さい）。",
};

// 自動合計
function useTotals(lines: Line[]){
  return useMemo(()=>{
    const byRate = new Map<number, {net:number, tax:number, gross:number}>();
    let netAll = 0, taxAll = 0, grossAll = 0;
    for(const l of lines){
      const net = Math.round(l.unitPrice * l.qty);
      const tax = Math.floor(net * (l.taxRate/100));
      const gross = net + tax;
      netAll += net; taxAll += tax; grossAll += gross;
      const rec = byRate.get(l.taxRate) || {net:0,tax:0,gross:0};
      rec.net += net; rec.tax += tax; rec.gross += gross; byRate.set(l.taxRate, rec);
    }
    return { netAll, taxAll, grossAll, byRate };
  }, [lines]);
}

export default function DocumentMaker(){
  const [st, setSt] = useState<State>(EMPTY);

  // ローカルストレージから保存データを読み込み
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    
    // URLからのデータ読込を優先
    const h = new URL(window.location.href).hash;
    if (h.startsWith('#data=')){
      const obj = base64Decode<State>(h.slice(6));
      if (obj) {
        setSt({ ...EMPTY, ...obj });
        return;
      }
    }
    
    // ローカルストレージから前回の入力内容を復元
    const saved = localStorage.getItem('document-maker-data');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setSt({ ...EMPTY, ...savedData });
      } catch (e) {
        console.warn('Failed to parse saved data:', e);
      }
    }
  },[]);

  // 入力内容をローカルストレージに保存
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    localStorage.setItem('document-maker-data', JSON.stringify(st));
  }, [st]);

  // 期日プリセット
  function applyTerms(term: 'NET14'|'NET30'|'EOM30'|'EOM60'){
    const issue = new Date(st.issueDate);
    const endOfMonth = (d:Date)=>{ const x=new Date(d); x.setMonth(x.getMonth()+1,0); return x; };
    const addDays = (d:Date, n:number)=>{ const x=new Date(d); x.setDate(x.getDate()+n); return x; };
    let due: Date;
    switch(term){
      case 'NET14': due = addDays(issue,14); setSt(s=>({...s, dueDate: due.toISOString().slice(0,10), payerTerms:'請求日から14日（Net 14）'})); break;
      case 'NET30': due = addDays(issue,30); setSt(s=>({...s, dueDate: due.toISOString().slice(0,10), payerTerms:'請求日から30日（Net 30）'})); break;
      case 'EOM30': due = addDays(endOfMonth(issue),30); setSt(s=>({...s, dueDate: due.toISOString().slice(0,10), payerTerms:'当月末締・翌月末払い（EOM+30）'})); break;
      case 'EOM60': due = addDays(endOfMonth(issue),60); setSt(s=>({...s, dueDate: due.toISOString().slice(0,10), payerTerms:'当月末締・翌々月末払い（EOM+60）'})); break;
    }
  }

  const totals = useTotals(st.lines);

  // 共有リンク生成
  function makeShareLink(){
    if (typeof window === 'undefined') return '';
    const data = base64Encode(st);
    return `${location.origin}${location.pathname}#data=${data}`;
  }

  function copyShare(){
    const link = makeShareLink();
    navigator.clipboard.writeText(link);
    alert('共有リンクをコピーしました');
  }

  // テンプレ: 各帳票に合わせてフィールドの見え方だけ切替
  return (
    <div className="min-h-screen bg-slate-50"> 
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 no-print text-center sm:text-left">超シンプル帳票ジェネレーター（保存なし）</h1>

        {/* コントロール群 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">📄 帳票タイプ</label>
            <select className="input" value={st.docType} onChange={e=>{
              const newType = e.target.value as DocType;
              const prefixMap = {
                quote: 'QTE-YYYYMM-001',
                po: 'PO-YYYYMM-001', 
                contract: 'CTR-YYYYMM-001',
                invoice: 'INV-YYYYMM-001',
                receipt: 'RCP-YYYYMM-001'
              };
              setSt({...st, docType: newType, number: prefixMap[newType]});
            }}>
              <option value="quote">見積書</option>
              <option value="po">発注書</option>
              <option value="contract">業務委託契約書</option>
              <option value="invoice">請求書</option>
              <option value="receipt">領収書</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">🔢 書類番号</label>
            <input className="input" value={st.number} onChange={e=>setSt({...st, number:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">📅 発行日</label>
            <input type="date" className="input" value={st.issueDate} onChange={e=>setSt({...st, issueDate: e.target.value})} />
          </div>
        </div>

        {/* 取引先/発行者 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <fieldset className="card">
            <legend className="legend text-base font-semibold">🏢 発行者（自社）</legend>
            <input className={`input ${st.parties.issuer.name === 'あなたの事業者名' ? 'border-red-400 bg-red-50' : ''}`} placeholder="会社名を入力" value={st.parties.issuer.name} onChange={e=>setSt({...st, parties:{...st.parties, issuer:{...st.parties.issuer, name:e.target.value}}})} />
            {st.parties.issuer.name === 'あなたの事業者名' && <div className="text-xs text-red-500 mt-1">⚠️ 会社名を入力してください</div>}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input className="input sm:col-span-1" placeholder="〒000-0000" value={st.parties.issuer.zipCode||''} onChange={e=>setSt({...st, parties:{...st.parties, issuer:{...st.parties.issuer, zipCode:e.target.value}}})} />
              <input className="input sm:col-span-3" placeholder="都道府県市区町村番地マンション名・部屋番号" value={st.parties.issuer.address||''} onChange={e=>setSt({...st, parties:{...st.parties, issuer:{...st.parties.issuer, address:e.target.value}}})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input className="input sm:col-span-1" placeholder="電話番号" value={st.parties.issuer.tel||''} onChange={e=>setSt({...st, parties:{...st.parties, issuer:{...st.parties.issuer, tel:e.target.value}}})} />
              <input className="input sm:col-span-2" placeholder="登録番号（Tから始まるインボイス番号）" value={st.parties.issuer.regNo||''} onChange={e=>setSt({...st, parties:{...st.parties, issuer:{...st.parties.issuer, regNo:e.target.value}}})} />
            </div>
          </fieldset>
          <fieldset className="card">
            <legend className="legend text-base font-semibold">🏢 取引先</legend>
            <div className="flex gap-2">
              <input 
                className={`input flex-1 ${st.parties.customer.name === '取引先名 御中' ? 'border-red-400 bg-red-50' : ''}`} 
                placeholder="取引先名を入力" 
                value={st.parties.customer.name.replace(/ (御中|様|殿)$/, '')} 
                onChange={e=>{
                  const suffix = st.parties.customer.name.match(/ (御中|様|殿)$/)?.[1] || '御中';
                  setSt({...st, parties:{...st.parties, customer:{...st.parties.customer, name: e.target.value ? `${e.target.value} ${suffix}` : '取引先名 御中'}}});
                }} 
              />
              <select 
                className="input w-20 text-sm" 
                value={st.parties.customer.name.match(/ (御中|様|殿)$/)?.[1] || '御中'}
                onChange={e=>{
                  const baseName = st.parties.customer.name.replace(/ (御中|様|殿)$/, '') || '取引先名';
                  setSt({...st, parties:{...st.parties, customer:{...st.parties.customer, name: `${baseName} ${e.target.value}`}}});
                }}
              >
                <option value="御中">御中</option>
                <option value="様">様</option>
                <option value="殿">殿</option>
              </select>
            </div>
            {st.parties.customer.name === '取引先名 御中' && <div className="text-xs text-red-500 mt-1">⚠️ 取引先名を入力してください</div>}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input className="input sm:col-span-1" placeholder="〒000-0000" value={st.parties.customer.zipCode||''} onChange={e=>setSt({...st, parties:{...st.parties, customer:{...st.parties.customer, zipCode:e.target.value}}})} />
              <input className="input sm:col-span-3" placeholder="都道府県市区町村番地マンション名・部屋番号" value={st.parties.customer.address||''} onChange={e=>setSt({...st, parties:{...st.parties, customer:{...st.parties.customer, address:e.target.value}}})} />
            </div>
          </fieldset>
        </div>

        {/* 件名・支払条件/期日（invoice/quote/po） */}
        {(st.docType==='quote' || st.docType==='po' || st.docType==='invoice') && (
          <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
            <div className="w-full">
              <label className="block text-sm font-semibold text-blue-700 mb-1">📝 件名</label>
              <input className="input w-full" placeholder="案件名や業務内容を入力" value={st.subject||''} onChange={e=>setSt({...st, subject:e.target.value})} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
{st.docType==='invoice' && (
              <>
                <div className={`${!st.payerTerms ? 'animate-pulse' : ''}`}>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    💳 支払条件 {!st.payerTerms && <span className="text-red-500 text-xs">（要入力）</span>}
                  </label>
                  <div className="flex gap-2">
                    <select className={`input ${!st.payerTerms ? 'border-red-400 bg-red-50' : ''}`} onChange={e=>applyTerms(e.target.value as 'NET14'|'NET30'|'EOM30'|'EOM60')} defaultValue="">
                      <option value="">⚠️ 支払条件を選択してください</option>
                      <option value="NET14">Net 14</option>
                      <option value="NET30">Net 30</option>
                      <option value="EOM30">当月末締/翌月末</option>
                      <option value="EOM60">当月末締/翌々月末</option>
                    </select>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">{st.payerTerms||''}</div>
                </div>
                <div className={`${!st.dueDate ? 'animate-pulse' : ''}`}>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">
                    📅 支払期日 {!st.dueDate && <span className="text-red-500 text-xs">（要入力）</span>}
                  </label>
                  <input type="date" className={`input ${!st.dueDate ? 'border-red-400 bg-red-50' : ''}`} value={st.dueDate||''} onChange={e=>setSt({...st, dueDate:e.target.value})} />
                  {!st.dueDate && <div className="text-xs text-red-500 mt-1">⚠️ 支払期日を入力してください</div>}
                </div>
              </>
            )}
            {st.docType==='po' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">📅 発注日</label>
                  <input type="date" className="input" value={st.orderDate||st.issueDate} onChange={e=>setSt({...st, orderDate:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-blue-700 mb-1">📅 納期</label>
                  <input type="date" className="input" value={st.deliveryDate||''} onChange={e=>setSt({...st, deliveryDate:e.target.value})} />
                </div>
              </>
            )}
            </div>
          </div>
        )}

        {/* 明細（領収書/契約書は非表示） */}
        {(st.docType==='quote' || st.docType==='po' || st.docType==='invoice') && (
          <div className="mb-6 no-print">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">明細</h2>
              <button className="btn" onClick={()=>setSt({...st, lines:[...st.lines,{date:todayISO(), name:'項目', desc:'', qty:1, unit:'式', unitPrice:0, taxRate:10}]})}>行を追加</button>
            </div>
            {/* スマホ対応：カード形式の明細入力 */}
            <div className="block sm:hidden space-y-4">
              {st.lines.map((l, i)=> (
                <div key={i} className="border rounded-xl p-4 bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">明細 {i + 1}</span>
                    <button className="btn-secondary text-xs px-2 py-1" onClick={()=>delLine(i)}>削除</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">日付</label>
                      <input type="date" className="input text-sm" value={l.date||''} onChange={e=>updLine(i,{date:e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">税率</label>
                      <select className="input text-sm" value={l.taxRate} onChange={e=>updLine(i,{taxRate:Number(e.target.value)})}>
                        <option value={10}>10%</option>
                        <option value={8}>8%</option>
                        <option value={0}>0%</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">内容</label>
                    <input className="input text-sm" value={l.name} onChange={e=>updLine(i,{name:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">説明</label>
                    <input className="input text-sm" value={l.desc||''} onChange={e=>updLine(i,{desc:e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">数量</label>
                      <input type="number" className="input text-right text-sm" value={l.qty} onChange={e=>updLine(i,{qty:Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">単位</label>
                      <input className="input text-sm" value={l.unit} onChange={e=>updLine(i,{unit:e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">単価(税抜)</label>
                      <input type="number" className="input text-right text-sm" value={l.unitPrice} onChange={e=>updLine(i,{unitPrice:Number(e.target.value)})} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* デスクトップ対応：テーブル形式 */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-y bg-slate-100">
                    <th className="p-2 text-left">日付</th>
                    <th className="p-2 text-left">内容</th>
                    <th className="p-2 text-left">説明</th>
                    <th className="p-2 text-right">数量</th>
                    <th className="p-2 text-left">単位</th>
                    <th className="p-2 text-right">単価(税抜)</th>
                    <th className="p-2 text-right">税率</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {st.lines.map((l, i)=> (
                    <tr key={i} className="border-b">
                      <td className="p-2"><input type="date" className="input" value={l.date||''} onChange={e=>updLine(i,{date:e.target.value})} /></td>
                      <td className="p-2"><input className="input" value={l.name} onChange={e=>updLine(i,{name:e.target.value})} /></td>
                      <td className="p-2"><input className="input" value={l.desc||''} onChange={e=>updLine(i,{desc:e.target.value})} /></td>
                      <td className="p-2 text-right"><input type="number" className="input text-right" value={l.qty} onChange={e=>updLine(i,{qty:Number(e.target.value)})} /></td>
                      <td className="p-2"><input className="input" value={l.unit} onChange={e=>updLine(i,{unit:e.target.value})} /></td>
                      <td className="p-2 text-right"><input type="number" className="input text-right" value={l.unitPrice} onChange={e=>updLine(i,{unitPrice:Number(e.target.value)})} /></td>
                      <td className="p-2 text-right">
                        <select className="input" value={l.taxRate} onChange={e=>updLine(i,{taxRate:Number(e.target.value)})}>
                          <option value={10}>10%</option>
                          <option value={8}>8%</option>
                          <option value={0}>0%</option>
                        </select>
                      </td>
                      <td className="p-2 text-right"><button className="btn-secondary" onClick={()=>delLine(i)}>削除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 備考/振込先（見積書/請求書のみ表示） */}
        {(st.docType==='quote' || st.docType==='invoice') && (
          <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
            <fieldset className="card w-full">
              <legend className="legend">📝 備考</legend>
              <textarea className="input w-full min-h-[80px] resize-none" placeholder="支払条件や注意事項など" value={st.notes||''} onChange={e=>setSt({...st, notes:e.target.value})} rows={3} />
            </fieldset>
            <fieldset className="card">
              <legend className="legend">🏦 振込先</legend>
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                <input className="input" placeholder="銀行名" value={st.bank.bank||''} onChange={e=>setSt({...st, bank:{...st.bank, bank:e.target.value}})} />
                <input className="input" placeholder="支店" value={st.bank.branch||''} onChange={e=>setSt({...st, bank:{...st.bank, branch:e.target.value}})} />
                <input className="input" placeholder="種別（普通など）" value={st.bank.type||''} onChange={e=>setSt({...st, bank:{...st.bank, type:e.target.value}})} />
                <input className="input" placeholder="口座番号" value={st.bank.number||''} onChange={e=>setSt({...st, bank:{...st.bank, number:e.target.value}})} />
                <input className="input sm:col-span-full" placeholder="口座名義" value={st.bank.holder||''} onChange={e=>setSt({...st, bank:{...st.bank, holder:e.target.value}})} />
              </div>
            </fieldset>
          </div>
        )}

        {/* ボタン */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          <button className="btn" onClick={()=>window.print()}>
            <span className="hidden sm:inline">印刷 / PDF保存</span>
            <span className="sm:hidden">印刷・PDF</span>
          </button>
          <button className="btn-secondary" onClick={copyShare}>
            <span className="hidden sm:inline">共有リンクをコピー</span>
            <span className="sm:hidden">リンク共有</span>
          </button>
          <button className="btn-secondary" onClick={()=>{setSt(EMPTY); localStorage.removeItem('document-maker-data');}}>リセット</button>
          <button className="btn-secondary" onClick={()=>localStorage.removeItem('document-maker-data')}>
            <span className="hidden sm:inline">保存データを削除</span>
            <span className="sm:hidden">データ削除</span>
          </button>
        </div>

        {/* プレビュー */}
        <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-8 print:p-0 print:shadow-none">
          <div className="text-center mb-4 sm:hidden">
            <h3 className="text-lg font-semibold text-slate-700">プレビュー</h3>
            <p className="text-xs text-slate-500 mt-1">実際の印刷イメージです</p>
          </div>
          <div className="a4 text-xs sm:text-sm">
            <DocPreview st={st} totals={totals} />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .input{ 
          @apply w-full rounded-2xl border-2 border-blue-300 px-3 py-3 sm:py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base; 
          min-height: 44px;
          transition: all 0.2s ease-in-out;
        }
        .input:focus {
          background-color: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .btn{ 
          @apply inline-flex items-center justify-center rounded-xl border border-transparent bg-sky-600 px-4 py-3 sm:py-2 text-white hover:bg-sky-700 active:bg-sky-800 text-base font-medium; 
          min-height: 44px;
          touch-action: manipulation;
        }
        .btn-secondary{ 
          @apply inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 sm:py-2 text-slate-700 hover:bg-slate-50 text-base font-medium; 
          min-height: 44px;
          touch-action: manipulation;
        }
        .card{ @apply border-2 border-blue-200 rounded-2xl p-3 sm:p-4 bg-blue-50 space-y-3 sm:space-y-2; }
        .legend{ @apply text-sm font-semibold mb-2 sm:mb-1 text-blue-800; }
        .a4{ width:100%; max-width:794px; min-height:1123px; margin:0 auto; }
        
        /* スマホでのタッチ操作改善 */
        select.input, textarea.input {
          -webkit-appearance: none;
          appearance: none;
        }
        
        /* スマホでのズーム無効化（入力フィールドのフォーカス時） */
        @media screen and (max-width: 768px) {
          .input {
            font-size: 16px !important;
          }
        }
        
        @page{ size: A4; margin: 14mm; }
        @media print{ 
          .btn,.btn-secondary,.card,.input, select, textarea, legend, label { display:none !important } 
          .no-print { display:none !important }
          body{ background:#fff } 
          .a4{ width:auto; min-height:auto; } 
        }
      `}</style>
    </div>
  );

  function updLine(i:number, p:Partial<Line>){ setSt(s=>({ ...s, lines: s.lines.map((x,idx)=> idx===i?{...x,...p}:x ) })); }
  function delLine(i:number){ setSt(s=>({ ...s, lines: s.lines.filter((_,idx)=> idx!==i ) })); }
}

// =================== プレビュー（各帳票の紙面） ===================
function DocPreview({ st, totals }:{ st:State; totals: ReturnType<typeof useTotals> }){
  switch(st.docType){
    case 'invoice': return <InvoiceDoc st={st} totals={totals} />;
    case 'quote': return <QuoteDoc st={st} totals={totals} />;
    case 'po': return <PODoc st={st} />;
    case 'receipt': return <ReceiptDoc st={st} totals={totals} />;
    case 'contract': return <ContractDoc st={st} />;
  }
}

// Headerコンポーネントは不要になったので削除

function StampIssuer({ st }:{ st:State }){
  const i = st.parties.issuer;
  return (
    <div className="text-sm">
      <div className="font-semibold">{i.name}</div>
      {i.address && <div>{i.address}</div>}
      {i.regNo && <div>登録番号：{i.regNo}</div>}
      {(i.tel) && <div>電話：{i.tel}</div>}
    </div>
  );
}

function BlockTitle({children}:{children: React.ReactNode}){ return <div className="text-base font-semibold mt-8 mb-2">{children}</div>; }

// ---------- 請求書 ----------
function InvoiceDoc({ st, totals }:{ st:State; totals: ReturnType<typeof useTotals> }){
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest">請 求 書</h1>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-lg font-semibold">{st.parties.customer.name}</div>
          {st.parties.customer.address && <div className="text-sm text-slate-700 mt-1">{st.parties.customer.address}</div>}
        </div>
        <div className="text-sm text-right">
          <div>書類番号：{st.number}</div>
          <div>請求日：{fmtDate(st.issueDate)}</div>
          {st.dueDate && <div>お支払期日：{fmtDate(st.dueDate)}</div>}
        </div>
      </div>

      {st.subject && <div className="mb-4">件名：{st.subject}</div>}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-y bg-slate-50">
            <th className="text-left p-2">作業日</th>
            <th className="text-left p-2">内容</th>
            <th className="text-left p-2">説明</th>
            <th className="text-right p-2">数量</th>
            <th className="text-left p-2">単位</th>
            <th className="text-right p-2">単価(税抜)</th>
            <th className="text-right p-2">金額(税抜)</th>
            <th className="text-right p-2">税率</th>
          </tr>
        </thead>
        <tbody>
          {st.lines.map((l, i)=> (
            <tr className="border-b" key={i}>
              <td className="p-2">{l.date ? fmtDate(l.date) : ''}</td>
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.desc}</td>
              <td className="p-2 text-right">{l.qty}</td>
              <td className="p-2">{l.unit}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice)}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice * l.qty)}</td>
              <td className="p-2 text-right">{l.taxRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <table className="text-sm">
          <tbody>
            <tr><td className="px-4 py-1">小計（税抜）</td><td className="px-4 py-1 text-right">{jpy.format(totals.netAll)}</td></tr>
            {[...totals.byRate.entries()].map(([rate, v])=> (
              <tr key={rate}><td className="px-4 py-1">消費税（{rate}%）</td><td className="px-4 py-1 text-right">{jpy.format(v.tax)}</td></tr>
            ))}
            <tr className="border-t"><td className="px-4 py-1 font-semibold">合計（税込）</td><td className="px-4 py-1 text-right font-semibold">{jpy.format(totals.grossAll)}</td></tr>
          </tbody>
        </table>
      </div>

      {st.notes && (<div className="mt-6 text-xs text-slate-700 whitespace-pre-wrap">{st.notes}</div>)}

      <BlockTitle>振込先</BlockTitle>
      <div className="text-sm">
        {st.bank.bank && (<div>銀行名：{st.bank.bank} {st.bank.branch||''}</div>)}
        {(st.bank.type||st.bank.number) && (<div>口座：{st.bank.type||''} {st.bank.number||''}</div>)}
        {st.bank.holder && (<div>口座名義：{st.bank.holder}</div>)}
      </div>

      <BlockTitle>発行元</BlockTitle>
      <StampIssuer st={st} />
    </div>
  );
}

// ---------- 見積書 ----------
function QuoteDoc({ st, totals }:{ st:State; totals: ReturnType<typeof useTotals> }){
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest">見 積 書</h1>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-lg font-semibold">{st.parties.customer.name}</div>
          {st.parties.customer.address && <div className="text-sm text-slate-700 mt-1">{st.parties.customer.address}</div>}
        </div>
        <div className="text-sm text-right">
          <div>書類番号：{st.number}</div>
          <div>発行日：{fmtDate(st.issueDate)}</div>
        </div>
      </div>
      
      {st.subject && <div className="mb-4">件名：{st.subject}</div>}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-y bg-slate-50">
            <th className="text-left p-2">内容</th>
            <th className="text-left p-2">説明</th>
            <th className="text-right p-2">数量</th>
            <th className="text-left p-2">単位</th>
            <th className="text-right p-2">単価(税抜)</th>
            <th className="text-right p-2">金額(税抜)</th>
            <th className="text-right p-2">税率</th>
          </tr>
        </thead>
        <tbody>
          {st.lines.map((l, i)=> (
            <tr className="border-b" key={i}>
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.desc}</td>
              <td className="p-2 text-right">{l.qty}</td>
              <td className="p-2">{l.unit}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice)}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice * l.qty)}</td>
              <td className="p-2 text-right">{l.taxRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <table className="text-sm">
          <tbody>
            <tr><td className="px-4 py-1">小計（税抜）</td><td className="px-4 py-1 text-right">{jpy.format(totals.netAll)}</td></tr>
            {[...totals.byRate.entries()].map(([rate, v])=> (
              <tr key={rate}><td className="px-4 py-1">消費税（{rate}%）</td><td className="px-4 py-1 text-right">{jpy.format(v.tax)}</td></tr>
            ))}
            <tr className="border-t"><td className="px-4 py-1 font-semibold">合計（税込）</td><td className="px-4 py-1 text-right font-semibold">{jpy.format(totals.grossAll)}</td></tr>
          </tbody>
        </table>
      </div>

      {st.notes && (<div className="mt-6 text-xs text-slate-700 whitespace-pre-wrap">{st.notes}</div>)}
      <BlockTitle>発行元</BlockTitle>
      <StampIssuer st={st} />
    </div>
  );
}

// ---------- 発注書 ----------
function PODoc({ st }:{ st:State }){
  const totals = useTotals(st.lines);
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest">発 注 書</h1>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-lg font-semibold">{st.parties.customer.name}</div>
          {st.parties.customer.address && <div className="text-sm text-slate-700 mt-1">{st.parties.customer.address}</div>}
        </div>
        <div className="text-sm text-right">
          <div>発注日：{fmtDate(st.orderDate||st.issueDate)}</div>
          <div>発注番号：{st.number}</div>
          {st.deliveryDate && <div>納期：{fmtDate(st.deliveryDate)}</div>}
        </div>
      </div>

      {st.subject && <div className="mb-4">件名：{st.subject}</div>}

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-y bg-slate-50">
            <th className="text-left p-2">作業日</th>
            <th className="text-left p-2">内容</th>
            <th className="text-left p-2">説明</th>
            <th className="text-right p-2">数量</th>
            <th className="text-left p-2">単位</th>
            <th className="text-right p-2">単価(税抜)</th>
            <th className="text-right p-2">金額(税抜)</th>
            <th className="text-right p-2">税率</th>
          </tr>
        </thead>
        <tbody>
          {st.lines.map((l, i)=> (
            <tr className="border-b" key={i}>
              <td className="p-2">{l.date ? fmtDate(l.date) : ''}</td>
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.desc}</td>
              <td className="p-2 text-right">{l.qty}</td>
              <td className="p-2">{l.unit}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice)}</td>
              <td className="p-2 text-right">{jpy.format(l.unitPrice * l.qty)}</td>
              <td className="p-2 text-right">{l.taxRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <table className="text-sm">
          <tbody>
            <tr><td className="px-4 py-1">小計（税抜）</td><td className="px-4 py-1 text-right">{jpy.format(totals.netAll)}</td></tr>
            {[...totals.byRate.entries()].map(([rate, v])=> (
              <tr key={rate}><td className="px-4 py-1">消費税（{rate}%）</td><td className="px-4 py-1 text-right">{jpy.format(v.tax)}</td></tr>
            ))}
            <tr className="border-t"><td className="px-4 py-1 font-semibold">合計（税込）</td><td className="px-4 py-1 text-right font-semibold">{jpy.format(totals.grossAll)}</td></tr>
          </tbody>
        </table>
      </div>

      {st.notes && (<div className="mt-6 text-xs text-slate-700 whitespace-pre-wrap">{st.notes}</div>)}

      <BlockTitle>発注元</BlockTitle>
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <div className="font-semibold">発注者</div>
          <div>{st.parties.customer.name}</div>
          {st.parties.customer.address && <div>{st.parties.customer.address}</div>}
        </div>
        <div>
          <div className="font-semibold">受注者</div>
          <StampIssuer st={st} />
        </div>
      </div>

      <div className="mt-10 text-sm">発注者署名：＿＿＿＿＿＿＿＿＿＿＿＿＿㊞</div>
    </div>
  );
}

// ---------- 領収書 ----------
function ReceiptDoc({ st, totals }:{ st:State; totals: ReturnType<typeof useTotals> }){
  const gross = totals.grossAll;
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest">領 収 書</h1>
      </div>

      <div className="text-sm text-right mb-6">
        <div>領収日：{fmtDate(st.issueDate)}</div>
        <div>領収No：{st.number}</div>
      </div>
      
      <div className="text-lg">領収金額：<span className="font-semibold">{jpy.format(gross)}</span>（税込）</div>
      <div className="mt-2">但し：{st.subject || '（但し書き）'}</div>

      <BlockTitle>内訳</BlockTitle>
      <div className="text-sm">
        <div>税抜金額：{jpy.format(totals.netAll)}</div>
        {[...totals.byRate.entries()].map(([rate, v])=> (
          <div key={rate}>消費税（{rate}%）：{jpy.format(v.tax)}</div>
        ))}
      </div>

      <BlockTitle>発行元</BlockTitle>
      <StampIssuer st={st} />

      <div className="mt-10 text-xs text-slate-500">（収入印紙は必要に応じて貼付）</div>
    </div>
  );
}

// ---------- 業務委託契約書（簡易） ----------
function ContractDoc({ st }:{ st:State }){
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-widest">業務委託契約書</h1>
      </div>

      <div className="text-sm text-right mb-6">
        <div>発注日：{fmtDate(st.issueDate)}</div>
        <div>発注番号：{st.number}</div>
        {st.deliveryDate && <div>納期：{fmtDate(st.deliveryDate)}</div>}
      </div>

      <div className="space-y-6 mt-6 text-sm">
        <div>
          <div className="font-semibold">委託者</div>
          <div>{st.parties.customer.name}</div>
          {st.parties.customer.address && <div>{st.parties.customer.address}</div>}
        </div>
        <div>
          <div className="font-semibold">受託者</div>
          <StampIssuer st={st} />
        </div>
      </div>

      <BlockTitle>第1条（業務内容）</BlockTitle>
      <div className="text-sm whitespace-pre-wrap">{st.subject || '受託者は、委託者から依頼された業務を遂行する。'}</div>

      <BlockTitle>第2条（報酬）</BlockTitle>
      <div className="text-sm">本業務の報酬額は、{jpy.format(calcGross(st.lines))}（税込）とする。</div>

      <BlockTitle>第3条（契約期間）</BlockTitle>
      <div className="text-sm">本契約は、{fmtDate(st.issueDate)}から業務完了まで有効とする。</div>

      <BlockTitle>第4条（その他）</BlockTitle>
      <div className="text-sm whitespace-pre-wrap">{`支払条件：${st.payerTerms || '請求書受領後14日以内に下記口座へ振込。振込手数料は委託者負担。'}
振込先：${[st.bank.bank, st.bank.branch].filter(Boolean).join(' ')} / ${st.bank.type||''} ${st.bank.number||''} / ${st.bank.holder||''}
成果物の権利：支払完了時に委託者へ移転。受託者は制作実績として名称・成果物を掲載できる。
秘密保持：双方、業務上知り得た相手方の非公開情報を第三者に漏らさない。`}</div>

      <div className="mt-10 text-sm">本契約の成立を証するため、本書2通を作成し、双方記名押印のうえ各1通を保有する。</div>
      <div className="mt-6">{fmtDate(st.issueDate)}</div>
      <div className="mt-8 space-y-4">
        <div>委託者（署名・押印）：＿＿＿＿＿＿＿＿＿＿＿＿＿㊞</div>
        <div>受託者（署名・押印）：＿＿＿＿＿＿＿＿＿＿＿＿＿㊞</div>
      </div>
    </div>
  );
}

function calcGross(lines: Line[]){
  return lines.reduce((s, l)=> s + Math.round(l.unitPrice*l.qty)*(1 + l.taxRate/100), 0);
}