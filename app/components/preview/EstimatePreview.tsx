import type { FormData } from '../../lib/types';
import { formatDate, formatZip, safeString, safeNumber } from '../../lib/format';
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

export default function EstimatePreview({ data, subTotal, taxTotal, grandTotal }: Props) {
  return (
    <div className="preview-root max-w-none bg-white text-black text-sm leading-7">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-wide mb-6">見積書</h1>
        <div className="text-xs text-right text-slate-500 mb-2">
          <div>書類番号：{data?.docNo || 'QTE-YYYYMM-001'}</div>
          <div>発行日：{formatYMD(data?.issueDate)}</div>
        </div>
        <div className="border-b border-slate-300 mb-6"></div>
      </div>

      {/* 宛先 */}
      <div className="mb-6">
        <div className="text-base font-semibold">
          {data?.client?.name || '—'} 御中
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
        <div className="mb-6">
          <strong>件名：</strong>{data.subject}
        </div>
      )}

      {/* 明細テーブル - CSS Grid */}
      <div className="mb-8">
        {/* ヘッダー */}
        <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)_minmax(7rem,auto)_minmax(7rem,auto)] text-slate-700 text-sm">
          <div className="py-2 border-y border-slate-400 font-medium">品名・作業内容</div>
          <div className="py-2 border-y border-slate-400 font-medium text-center">数量</div>
          <div className="py-2 border-y border-slate-400 font-medium text-center">単位</div>
          <div className="py-2 border-y border-slate-400 font-medium text-right">単価(税抜)</div>
          <div className="py-2 border-y border-slate-400 font-medium text-right">金額(税抜)</div>
        </div>
        
        {/* 明細行 */}
        {(data?.items || []).map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(5rem,auto)_minmax(7rem,auto)_minmax(7rem,auto)] border-b border-slate-300 text-sm row">
            <div className="py-2 whitespace-pre-wrap break-words">
              {item?.name || '—'}
              {item?.desc && <div className="text-slate-600 mt-1">{item.desc}</div>}
              {item?.date && <div className="text-slate-500 text-xs mt-1">作業日: {formatYMD(item.date)}</div>}
            </div>
            <div className="py-2 text-center">{item?.qty || 1}</div>
            <div className="py-2 text-center">{item?.unit || '式'}</div>
            <div className="py-2 text-right">¥{formatCurrency(item?.unitPrice || 0)}</div>
            <div className="py-2 text-right">¥{formatCurrency((item?.qty || 1) * (item?.unitPrice || 0))}</div>
          </div>
        ))}
      </div>

      {/* 合計（ボックス無し） */}
      <div className="mt-4 ml-auto w-64 text-sm space-y-1 mb-8">
        <div className="flex justify-between"><span>小計</span><span className="font-semibold">¥{formatCurrency(subTotal)}</span></div>
        <div className="flex justify-between"><span>消費税</span><span className="font-semibold">¥{formatCurrency(taxTotal)}</span></div>
        <div className="flex justify-between text-base font-bold"><span>合計（税込）</span><span>¥{formatCurrency(grandTotal)}</span></div>
      </div>

      {/* 備考 */}
      {data?.memo && (
        <div className="mb-6">
          <div className="font-medium mb-2">備考</div>
          <div className="whitespace-pre-wrap text-sm">{data.memo}</div>
        </div>
      )}

      {/* 発行元・振込先 */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <div className="font-medium mb-2">発行元</div>
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

        {data?.bank && (data?.bank?.name || data?.bank?.number || data?.bank?.holder) && (
          <div>
            <div className="font-medium mb-2">振込先</div>
            <div className="text-[10px] text-slate-500">
              {data?.bank?.name && <div>銀行名：{data.bank.name}</div>}
              {data?.bank?.type && <div>口座種別：{data.bank.type}</div>}
              {data?.bank?.number && <div>口座番号：{data.bank.number}</div>}
              {data?.bank?.holder && <div>口座名義：{data.bank.holder}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}