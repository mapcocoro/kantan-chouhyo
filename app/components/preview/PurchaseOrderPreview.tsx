import type { FormData, OrderTerms } from '../../lib/types';
import { formatZip } from '../../lib/format';
import { formatCurrency } from '../../lib/calc';

interface Props {
  data: FormData;
  subTotal: number;
  taxTotal: number;
  grandTotal: number;
}

const formatYMD = (dateStr?: string): string => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const getDeliveryText = (delivery?: OrderTerms['delivery']) => {
  if (!delivery) return '各明細記載の通り';
  switch (delivery.type) {
    case 'perLine':
      return '各明細記載の通り';
    case 'date':
      return delivery.date ? formatYMD(delivery.date) : '—';
    case 'period':
      return delivery.period || '—';
    case 'other':
      return delivery.free || '—';
    default:
      return '各明細記載の通り';
  }
};

const getAcceptanceText = (acceptance?: OrderTerms['acceptance']) => {
  if (!acceptance) return '納品後 7営業日以内 に検収';
  const dayKind = acceptance.dayKind === 'calendar' ? '日' : '営業日';
  switch (acceptance.type) {
    case 'after_7':
      return `納品後 7${dayKind}以内 に検収`;
    case 'after_10':
      return `納品後 10${dayKind}以内 に検収`;
    case 'after_30':
      return `納品後 30日以内 に検収`;
    case 'none':
      return '検収なし';
    case 'milestone':
      return '段階検収（中間・最終）';
    case 'custom':
      return acceptance.note || '—';
    default:
      return '納品後 7営業日以内 に検収';
  }
};

const getPaymentText = (payment?: OrderTerms['payment']) => {
  if (!payment) return '検収後 月末締め・翌月末払い';
  const dayKind = payment.dayKind === 'calendar' ? '日' : '営業日';
  switch (payment.type) {
    case 'site_30':
      return '検収後 月末締め・翌月末払い';
    case 'site_60':
      return '検収後 月末締め・翌々月末払い';
    case 'days_after':
      return `検収後 ${payment.days || 30}${dayKind}以内 に振込`;
    case 'on_delivery':
      return '納品時支払';
    case 'per_delivery':
      return '都度払い';
    default:
      return '検収後 月末締め・翌月末払い';
  }
};

export default function PurchaseOrderPreview({ data, subTotal, taxTotal, grandTotal }: Props) {
  return (
    <div className="doc print-compact preview-root max-w-none bg-white text-black text-sm leading-7">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-light tracking-wider mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>発注書</h1>
        <div className="text-xs text-right text-slate-500 mb-2">
          <div>発注番号：{data?.docNo || 'PO-YYYYMM-001'}</div>
          <div>発注日：{formatYMD(data?.issueDate)}</div>
          {data?.dueDate && <div>支払期限：{formatYMD(data.dueDate)}</div>}
        </div>
        <div className="border-b border-slate-300 mb-4"></div>
      </div>

      {/* 宛先 */}
      <div className="mb-4">
        <div className="text-base font-semibold">
          {data?.client?.name || '—'}{data?.client?.honorific ? ` ${data.client.honorific}` : ' 御中'}
        </div>
        {data?.client?.zip && data?.client?.addr && (
          <div className="text-sm mt-2 text-slate-600">
            {formatZip(data.client.zip)}<br />
            {data.client.addr}
          </div>
        )}
      </div>

      {/* 件名 */}
      {data?.subject && (
        <div className="mb-4">
          <strong>件名：</strong>{data.subject}
        </div>
      )}

      {/* 発注金額 - 右上に太字表示 */}
      <div className="text-right mb-4">
        <div className="text-base font-bold">
          発注金額　¥{formatCurrency(grandTotal)}（税込）
        </div>
      </div>

      {/* 明細テーブル - CSS Grid */}
      <div className="mb-6">
        {/* ヘッダー */}
        <div className="grid grid-cols-[1fr_minmax(4rem,auto)_minmax(72px,auto)_minmax(7rem,auto)_minmax(7rem,auto)] text-[12px] font-semibold text-slate-700 tracking-wide">
          <div className="px-3 py-2 border-b border-slate-300">品名・作業内容</div>
          <div className="px-3 py-2 border-b border-slate-300 text-center">数量</div>
          <div className="px-3 py-2 border-b border-slate-300 text-center">単位</div>
          <div className="px-3 py-2 border-b border-slate-300 text-right">単価</div>
          <div className="px-3 py-2 border-b border-slate-300 text-right">金額</div>
        </div>
        
        {/* 明細行 */}
        {(data?.items || []).map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_minmax(4rem,auto)_minmax(72px,auto)_minmax(7rem,auto)_minmax(7rem,auto)] text-[14px] text-slate-800 row">
            <div className="px-3 py-2 whitespace-pre-wrap break-words">
              {item?.name || '—'}
              {item?.desc && <div className="text-slate-600 text-[13px] mt-1">{item.desc}</div>}
              {item?.date && <div className="text-slate-500 text-[11px] mt-1">納期: {formatYMD(item.date)}</div>}
            </div>
            <div className="px-3 py-2 text-center">{item?.qty || 1}</div>
            <div className="px-3 py-2 text-center text-[13px]">{item?.unit || '式'}</div>
            <div className="px-3 py-2 text-right tnum">¥{formatCurrency(item?.unitPrice || 0)}</div>
            <div className="px-3 py-2 text-right tnum">¥{formatCurrency((item?.qty || 1) * (item?.unitPrice || 0))}</div>
          </div>
        ))}
      </div>

      {/* 合計（ボックス無し） */}
      <div className="mt-4 ml-auto w-64 text-sm space-y-1 mb-6">
        <div className="flex justify-between border-t border-slate-300 pt-2"><span>小計</span><span className="tnum">¥{formatCurrency(subTotal)}</span></div>
        <div className="flex justify-between"><span>消費税</span><span className="tnum">¥{formatCurrency(taxTotal)}</span></div>
        <div className="flex justify-between text-[15px] font-bold"><span>合計（税込）</span><span className="tnum">¥{formatCurrency(grandTotal)}</span></div>
      </div>

      {/* 発注条件 */}
      <div className="mb-6">
        <div className="font-medium mb-2">発注条件</div>
        <div className="text-sm">
          <div>納期：{getDeliveryText(data?.orderTerms?.delivery)}</div>
          <div>検収：{getAcceptanceText(data?.orderTerms?.acceptance)}</div>
          <div>支払条件：{getPaymentText(data?.orderTerms?.payment)}</div>
        </div>
      </div>

      {/* 発注者情報 */}
      <div className="text-right mt-6">
        <div className="font-medium mb-2">発注者</div>
        <div className="text-[10px] text-slate-500">
          <div className="font-medium text-sm text-black">{data?.issuer?.name || '—'}</div>
          {data?.issuer?.zip && data?.issuer?.addr && (
            <div className="mt-1">
              {formatZip(data.issuer.zip)}<br />
              {data.issuer.addr}
            </div>
          )}
          {data?.issuer?.tel && <div className="mt-1">TEL: {data.issuer.tel}</div>}
          {data?.issuer?.regNo && <div className="mt-1">登録番号: {data.issuer.regNo}</div>}
        </div>
      </div>

      {/* 備考 */}
      {data?.memo?.trim() && (
        <div className="mt-6 mb-4">
          <div className="font-medium mb-2">備考</div>
          <p className="prose-jp text-sm">{data.memo.trim()}</p>
        </div>
      )}

      {/* 特約フッター */}
      {data?.terms?.enabled && data?.terms?.text?.trim() && (
        <div className="mt-8">
          <p className="text-[11px] text-slate-500 leading-relaxed prose-jp" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {data.terms.text.trim()}
          </p>
        </div>
      )}
    </div>
  );
}