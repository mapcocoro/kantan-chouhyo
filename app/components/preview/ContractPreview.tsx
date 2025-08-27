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

export default function ContractPreview({ data, subTotal, taxTotal, grandTotal }: Props) {
  return (
    <div className="preview-root max-w-none bg-white text-black text-sm leading-7">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-wide mb-6">業務委託契約書</h1>
        <div className="text-xs text-right text-slate-500 mb-2">
          <div>契約番号：{data?.docNo || 'CON-YYYYMM-001'}</div>
          <div>契約日：{formatYMD(data?.issueDate)}</div>
        </div>
        <div className="border-b border-slate-300 mb-6"></div>
      </div>

      {/* 当事者 */}
      <div className="mb-8 text-sm">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border-b border-slate-400 h-6 w-full">
            <span className="text-slate-600">委託者（以下「甲」という）</span>
          </div>
          <div className="border-b border-slate-400 h-6 w-full">
            <span className="text-slate-600">受託者（以下「乙」という）</span>
          </div>
        </div>
      </div>

      {/* 前文 */}
      <div className="mb-6 text-sm">
        甲と乙は、以下の条件にて業務委託契約を締結する。
      </div>

      {/* 契約条項 */}
      <div className="space-y-6 text-sm">
        <div>
          <div className="font-medium mb-2">第1条（業務内容）</div>
          <div className="ml-4">
            甲は乙に対し、下記業務を委託し、乙はこれを受託する。
            {(data?.items || []).length > 0 && (
              <div className="mt-3">
                {(data?.items || []).map((item, index) => (
                  <div key={index} className="mb-2">
                    {index + 1}. {item?.name || '—'}
                    {item?.desc && <div className="text-slate-600 ml-4 mt-1">{item.desc}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第2条（契約期間）</div>
          <div className="ml-4">
            {data?.contract?.period || `本契約の有効期間は、${formatYMD(data?.issueDate)}から1年間とする。`}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第3条（報酬）</div>
          <div className="ml-4">
            {data?.contract?.reward || `甲は乙に対し、本業務の対価として月額金${formatCurrency(grandTotal)}円（税込）を支払う。`}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第4条（支払条件）</div>
          <div className="ml-4">
            {data?.contract?.paymentTerms || data?.paymentSite || '業務完了後、月末締め翌月末払いとする。'}
            {data?.dueDate && <div className="mt-1">支払期日：{formatYMD(data.dueDate)}</div>}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第5条（検収）</div>
          <div className="ml-4">
            {data?.contract?.acceptance || '甲は乙から業務の完了報告を受けた日から7日以内に検収を行い、承認または修正指示を行う。'}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第6条（秘密保持）</div>
          <div className="ml-4">
            {data?.contract?.confidentiality || '両当事者は、本契約に関して知り得た相手方の秘密情報を第三者に開示してはならない。'}
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">第7条（その他）</div>
          <div className="ml-4">
            1. 本契約に定めのない事項については、両当事者が誠意をもって協議の上決定する。<br />
            2. 本契約に関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とする。
          </div>
        </div>
      </div>

      {/* 特記事項 */}
      {data?.memo && (
        <div className="mt-8 mb-6">
          <div className="font-medium mb-2">特記事項</div>
          <div className="whitespace-pre-wrap text-sm">
            {data.memo}
          </div>
        </div>
      )}

      {/* 締結文 */}
      <div className="mt-8 mb-8 text-sm">
        本契約成立の証として本書を2通作成し、甲乙各1通を保有する。
      </div>

      {/* 署名欄 */}
      <div className="grid grid-cols-2 gap-16 mt-10 signature-section">
        <div>
          <div className="mb-6 font-medium">甲（委託者）</div>
          <div className="border-b border-slate-400 h-6 w-3/4 mb-6"></div>
          <div className="w-14 h-14 rounded-full border border-slate-300 grid place-items-center text-[10px] text-slate-500 p-2">印</div>
        </div>
        
        <div>
          <div className="mb-6 font-medium">乙（受託者）</div>
          <div className="border-b border-slate-400 h-6 w-3/4 mb-6"></div>
          <div className="w-14 h-14 rounded-full border border-slate-300 grid place-items-center text-[10px] text-slate-500 p-2">印</div>
        </div>
      </div>
    </div>
  );
}