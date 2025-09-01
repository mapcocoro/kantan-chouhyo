import React from 'react';

// ローカル型定義
export type DayKind = 'business' | 'calendar';

export type AcceptanceType =
  | 'after_7'
  | 'after_10'
  | 'after_30'
  | 'none'
  | 'milestone'
  | 'custom';

export interface Acceptance {
  type: AcceptanceType;
  days?: number;
  dayKind?: DayKind;
  note?: string;
}

export type PaymentTermType =
  | 'site_30'
  | 'site_60'
  | 'days_after'
  | 'on_delivery'
  | 'prepaid'
  | 'per_delivery'
  | 'custom';

export interface PaymentTerm {
  type: PaymentTermType;
  days?: number;
  dayKind?: DayKind;
  depositPct?: number;
  note?: string;
}

export interface OrderTerms {
  delivery: { 
    type: 'perLine' | 'date' | 'period' | 'other'; 
    date?: string; 
    periodStart?: string;
    periodEnd?: string;
    period?: string; 
    free?: string;
  };
  acceptance: Acceptance;
  payment: PaymentTerm;
}

interface Props {
  terms: OrderTerms | undefined;
  onChange: (terms: OrderTerms) => void;
}

// デフォルト値
const DEFAULT_ORDER_TERMS: OrderTerms = {
  delivery: { type: 'perLine' },
  acceptance: { type: 'after_7', dayKind: 'business' },
  payment: { type: 'site_30' }
};

export default function PurchaseOrderTermsFields({ terms = DEFAULT_ORDER_TERMS, onChange }: Props) {
  // 納期の更新
  const handleDeliveryChange = (type: string) => {
    const newTerms = { ...terms };
    newTerms.delivery = { type: type as 'perLine' | 'date' | 'period' | 'other' };
    
    if (type === 'date') {
      newTerms.delivery.date = new Date().toISOString().split('T')[0];
    } else if (type === 'period') {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      newTerms.delivery.periodStart = today.toISOString().split('T')[0];
      newTerms.delivery.periodEnd = nextMonth.toISOString().split('T')[0];
      // period文字列も生成
      newTerms.delivery.period = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}〜${nextMonth.getFullYear()}/${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}/${nextMonth.getDate().toString().padStart(2, '0')}`;
    }
    onChange(newTerms);
  };

  // 検収の更新
  const handleAcceptanceChange = (type: AcceptanceType) => {
    const newTerms = { ...terms };
    newTerms.acceptance = { type };
    
    // デフォルト値を設定
    if (type === 'after_7') {
      newTerms.acceptance.dayKind = 'business';
    } else if (type === 'after_10') {
      newTerms.acceptance.dayKind = 'business';
    } else if (type === 'after_30') {
      newTerms.acceptance.dayKind = 'calendar';
    }
    onChange(newTerms);
  };

  // 支払条件の更新
  const handlePaymentChange = (type: PaymentTermType) => {
    const newTerms = { ...terms };
    newTerms.payment = { type };
    
    // デフォルト値を設定
    if (type === 'days_after') {
      newTerms.payment.days = 30;
      newTerms.payment.dayKind = 'business';
    } else if (type === 'prepaid') {
      newTerms.payment.depositPct = 50;
      newTerms.payment.days = 30;
      newTerms.payment.dayKind = 'business';
    }
    onChange(newTerms);
  };

  return (
    <fieldset className="border border-slate-300 rounded-lg p-4">
      <legend className="text-sm font-semibold px-2">発注条件</legend>
      
      {/* 納期 */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          納期
        </label>
        <div className="flex items-center gap-2">
          <select
            value={terms.delivery.type}
            onChange={(e) => handleDeliveryChange(e.target.value)}
            className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="納期選択"
          >
            <option value="perLine">各明細記載の通り</option>
            <option value="date">指定日</option>
            <option value="period">期間指定</option>
            <option value="other">その他</option>
          </select>
          
          {terms.delivery.type === 'date' && (
            <input
              type="date"
              value={terms.delivery.date || ''}
              onChange={(e) => onChange({
                ...terms,
                delivery: { ...terms.delivery, date: e.target.value }
              })}
              className="text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}
          
          {terms.delivery.type === 'period' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={terms.delivery.periodStart || ''}
                onChange={(e) => {
                  const newTerms = { ...terms };
                  newTerms.delivery.periodStart = e.target.value;
                  // period文字列も更新
                  if (newTerms.delivery.periodStart && newTerms.delivery.periodEnd) {
                    const start = new Date(newTerms.delivery.periodStart);
                    const end = new Date(newTerms.delivery.periodEnd);
                    newTerms.delivery.period = `${start.getFullYear()}/${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getDate().toString().padStart(2, '0')}〜${end.getFullYear()}/${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}`;
                  }
                  onChange(newTerms);
                }}
                className="text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-label="開始日"
              />
              <span className="text-sm text-slate-600">〜</span>
              <input
                type="date"
                value={terms.delivery.periodEnd || ''}
                onChange={(e) => {
                  const newTerms = { ...terms };
                  newTerms.delivery.periodEnd = e.target.value;
                  // period文字列も更新
                  if (newTerms.delivery.periodStart && newTerms.delivery.periodEnd) {
                    const start = new Date(newTerms.delivery.periodStart);
                    const end = new Date(newTerms.delivery.periodEnd);
                    newTerms.delivery.period = `${start.getFullYear()}/${(start.getMonth() + 1).toString().padStart(2, '0')}/${start.getDate().toString().padStart(2, '0')}〜${end.getFullYear()}/${(end.getMonth() + 1).toString().padStart(2, '0')}/${end.getDate().toString().padStart(2, '0')}`;
                  }
                  onChange(newTerms);
                }}
                className="text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                aria-label="終了日"
              />
            </div>
          )}
          
          {terms.delivery.type === 'other' && (
            <input
              type="text"
              value={terms.delivery.free || ''}
              onChange={(e) => onChange({
                ...terms,
                delivery: { ...terms.delivery, free: e.target.value }
              })}
              placeholder="自由入力"
              className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}
        </div>
      </div>

      {/* 検収 */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          検収
        </label>
        <div className="flex items-center gap-2">
          <select
            value={terms.acceptance.type}
            onChange={(e) => handleAcceptanceChange(e.target.value as AcceptanceType)}
            className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="検収選択"
          >
            <option value="after_7">納品後 7営業日以内 に検収</option>
            <option value="after_10">納品後 10営業日以内 に検収</option>
            <option value="after_30">納品後 30日以内 に検収</option>
            <option value="none">検収なし（省略）</option>
            <option value="milestone">段階検収（中間・最終）</option>
            <option value="custom">その他（自由入力）</option>
          </select>
          
          {/* 営業日/暦日トグル */}
          {(terms.acceptance.type === 'after_7' || terms.acceptance.type === 'after_10' || terms.acceptance.type === 'after_30') && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  acceptance: { ...terms.acceptance, dayKind: 'business' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.acceptance.dayKind === 'business' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                営業日
              </button>
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  acceptance: { ...terms.acceptance, dayKind: 'calendar' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.acceptance.dayKind === 'calendar' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                暦日
              </button>
            </div>
          )}
          
          {/* カスタム入力 */}
          {terms.acceptance.type === 'custom' && (
            <input
              type="text"
              value={terms.acceptance.note || ''}
              onChange={(e) => onChange({
                ...terms,
                acceptance: { ...terms.acceptance, note: e.target.value }
              })}
              placeholder="自由入力"
              className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}
        </div>
      </div>

      {/* 支払条件 */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          支払条件
        </label>
        <div className="flex items-center gap-2">
          <select
            value={terms.payment.type}
            onChange={(e) => handlePaymentChange(e.target.value as PaymentTermType)}
            className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="支払条件選択"
          >
            <option value="site_30">検収後 月末締め・翌月末払い</option>
            <option value="site_60">検収後 月末締め・翌々月末払い</option>
            <option value="days_after">検収後 ◯日以内 に振込</option>
            <option value="on_delivery">納品時支払</option>
            <option value="prepaid">前払（着手金◯％／残金は検収後◯日以内）</option>
            <option value="per_delivery">都度払い</option>
            <option value="custom">その他（自由入力）</option>
          </select>
          
          {/* days_after: 日数入力 + 営業日/暦日 */}
          {terms.payment.type === 'days_after' && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={terms.payment.days || 30}
                onChange={(e) => onChange({
                  ...terms,
                  payment: { ...terms.payment, days: parseInt(e.target.value) || 30 }
                })}
                className="w-16 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                min="1"
                max="365"
              />
              <span className="text-sm text-slate-600">日</span>
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  payment: { ...terms.payment, dayKind: 'business' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.payment.dayKind === 'business' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                営業日
              </button>
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  payment: { ...terms.payment, dayKind: 'calendar' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.payment.dayKind === 'calendar' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                暦日
              </button>
            </div>
          )}
          
          {/* prepaid: 着手金% + 残金日数 */}
          {terms.payment.type === 'prepaid' && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-600">着手金</span>
              <input
                type="number"
                value={terms.payment.depositPct || 50}
                onChange={(e) => onChange({
                  ...terms,
                  payment: { ...terms.payment, depositPct: parseInt(e.target.value) || 50 }
                })}
                className="w-12 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                min="1"
                max="100"
              />
              <span className="text-sm text-slate-600">% 残金</span>
              <input
                type="number"
                value={terms.payment.days || 30}
                onChange={(e) => onChange({
                  ...terms,
                  payment: { ...terms.payment, days: parseInt(e.target.value) || 30 }
                })}
                className="w-16 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                min="1"
                max="365"
              />
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  payment: { ...terms.payment, dayKind: 'business' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.payment.dayKind === 'business' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                営業日
              </button>
              <button
                type="button"
                onClick={() => onChange({
                  ...terms,
                  payment: { ...terms.payment, dayKind: 'calendar' }
                })}
                className={`px-2 py-1 text-xs rounded ${
                  terms.payment.dayKind === 'calendar' 
                    ? 'bg-sky-100 text-sky-700 border border-sky-300' 
                    : 'bg-white text-slate-600 border border-slate-300'
                }`}
              >
                暦日
              </button>
              <span className="text-sm text-slate-600">以内</span>
            </div>
          )}
          
          {/* カスタム入力 */}
          {terms.payment.type === 'custom' && (
            <input
              type="text"
              value={terms.payment.note || ''}
              onChange={(e) => onChange({
                ...terms,
                payment: { ...terms.payment, note: e.target.value }
              })}
              placeholder="自由入力"
              className="flex-1 text-sm px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}
        </div>
      </div>
    </fieldset>
  );
}