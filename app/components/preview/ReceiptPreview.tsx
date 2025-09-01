import type { FormData } from '../../lib/types';
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

export default function ReceiptPreview({ data, grandTotal }: Props) {
  return (
    <div className="doc print-compact preview-root max-w-none bg-white text-black text-sm leading-7">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-extrabold tracking-wide mb-3">領収書</h1>
        <div className="text-xs text-right text-slate-500 mb-2">
          <div>領収書番号：{data?.docNo || 'REC-YYYYMM-001'}</div>
          <div>領収日：{formatYMD(data?.issueDate)}</div>
        </div>
        <div className="border-b border-slate-300 mb-4"></div>
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

      {/* 領収金額 - 中央に大きく表示（ボックス無し） */}
      <div className="text-center mb-6">
        <div className="text-sm mb-2">下記の通り領収いたしました</div>
        <div className="text-xl font-bold">
          金　¥{formatCurrency(grandTotal)}　也
        </div>
      </div>

      {/* 件名・但し書き */}
      <div className="mb-6">
        <div className="mb-2">
          <strong>但し：</strong>
          {(() => {
            // 手動編集の場合
            if (data?.manualPurpose && data?.receiptPurpose) {
              return data.receiptPurpose;
            }
            
            // 自動生成
            if (data?.items && data.items.length > 1) {
              return '下記の通り（別紙明細のとおり）';
            } else if (data?.items && data.items.length === 1) {
              const itemName = data.items[0]?.name || data?.subject;
              return itemName ? `${itemName}代として` : '上記の通り';
            }
            
            return data?.subject ? `${data.subject}の件` : '上記の通り';
          })()}
        </div>
      </div>

      {/* 明細（簡略版） */}
      {(data?.items || []).length > 0 && (
        <div className="mb-8">
          {/* ヘッダー */}
          <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(7rem,auto)] text-[12px] font-semibold text-slate-700 tracking-wide">
            <div className="px-3 py-2 border-b border-slate-300">内容</div>
            <div className="px-3 py-2 border-b border-slate-300 text-center">数量</div>
            <div className="px-3 py-2 border-b border-slate-300 text-right">金額</div>
          </div>
          
          {/* 明細行 */}
          {(data?.items || []).map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(7rem,auto)] text-[14px] text-slate-800 row">
              <div className="px-3 py-2 whitespace-pre-wrap break-words">{item?.name || '—'}</div>
              <div className="px-3 py-2 text-center">{item?.qty || 1}</div>
              <div className="px-3 py-2 text-right tnum">¥{formatCurrency((item?.qty || 1) * (item?.unitPrice || 0))}</div>
            </div>
          ))}
          
          {/* 合計行 */}
          <div className="grid grid-cols-[1fr_minmax(5rem,auto)_minmax(7rem,auto)] border-t border-slate-300 text-[15px] font-bold">
            <div className="px-3 py-2"></div>
            <div className="px-3 py-2 text-center">合計</div>
            <div className="px-3 py-2 text-right tnum">¥{formatCurrency(grandTotal)}</div>
          </div>
        </div>
      )}

      {/* 印紙税注意書き */}
      {grandTotal >= 50000 && (
        <div className="mb-6">
          <div className="text-sm text-red-600">
            ※ 領収金額が5万円以上のため、印紙税（200円）の対象となります。
          </div>
        </div>
      )}

      {/* 発行者情報と印鑑欄 */}
      <div className="mt-6 signature-section">
        <div className="font-medium mb-1">発行元</div>
        <div className="flex items-start justify-between">
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
          
          {/* 印鑑欄 */}
          <div className="ml-8 text-center">
            <div className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center">
              <span className="text-[9px] text-slate-500">印</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">領収者印</div>
          </div>
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