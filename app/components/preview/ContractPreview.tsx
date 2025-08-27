import type { FormData } from '../../lib/types';
import { formatDate, formatZip } from '../../lib/format';
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
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export default function ContractPreview({ data, subTotal, taxTotal, grandTotal }: Props) {
  // デフォルトの契約条件
  const defaultPeriod = `本契約の有効期間は、${formatYMD(data?.issueDate)}から1年間とする。`;
  const defaultReward = `甲は乙に対し、本業務の対価として月額金${formatCurrency(grandTotal)}円（税込）を支払う。`;
  const defaultPayment = data?.paymentSite || '業務完了後、月末締め翌月末払いとする。';
  const defaultAcceptance = '甲は乙から業務の完了報告を受けた日から7日以内に検収を行い、承認または修正指示を行う。';
  const defaultConfidentiality = '両当事者は、本契約に関して知り得た相手方の秘密情報を第三者に開示してはならない。';

  return (
    <div className="doc print-compact preview-root max-w-none bg-white text-black text-sm leading-7">
      {/* ヘッダー */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold tracking-wide mb-4">業務委託契約書</h1>
        <div className="text-xs text-right text-slate-500">
          <div>契約番号：{data?.docNo || 'CON-YYYYMM-001'}</div>
          <div>契約日：{formatYMD(data?.issueDate)}</div>
        </div>
      </div>

      {/* 当事者 */}
      <div className="mb-6 text-sm">
        <div className="mb-4">
          <div className="mb-2">委託者（以下「甲」という）</div>
          <div className="border-b border-slate-300 pb-1">
            {data?.client?.name || '＿＿＿＿＿＿＿＿＿＿'}
            {data?.client?.zip && data?.client?.addr && (
              <span className="text-xs ml-3">
                〒{formatZip(data.client.zip)} {data.client.addr}
              </span>
            )}
          </div>
        </div>
        
        <div>
          <div className="mb-2">受託者（以下「乙」という）</div>
          <div className="border-b border-slate-300 pb-1">
            {data?.issuer?.name || '＿＿＿＿＿＿＿＿＿＿'}
            {data?.issuer?.zip && data?.issuer?.addr && (
              <span className="text-xs ml-3">
                〒{formatZip(data.issuer.zip)} {data.issuer.addr}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 前文 */}
      <div className="mb-6 text-sm">
        甲と乙は、以下の条件にて業務委託契約を締結する。
      </div>

      {/* 契約条項 */}
      <div className="space-y-4 text-sm">
        <div>
          <div className="font-semibold">第1条（業務内容）</div>
          <p className="prose-jp ml-4">
            甲は乙に対し、下記業務を委託し、乙はこれを受託する。
            {(data?.items || []).length > 0 && (
              <>
                {'\n'}
                {(data?.items || []).map((item, index) => (
                  `${index + 1}. ${item?.name || '—'}${item?.desc ? `（${item.desc}）` : ''}`
                )).join('\n')}
              </>
            )}
          </p>
        </div>

        <div>
          <div className="font-semibold">第2条（契約期間）</div>
          <p className="prose-jp ml-4">
            {data?.contract?.period || defaultPeriod}
          </p>
        </div>

        <div>
          <div className="font-semibold">第3条（報酬）</div>
          <p className="prose-jp ml-4">
            {data?.contract?.reward || defaultReward}
          </p>
        </div>

        <div>
          <div className="font-semibold">第4条（支払条件）</div>
          <p className="prose-jp ml-4">
            {data?.contract?.paymentTerms || defaultPayment}
          </p>
        </div>

        <div>
          <div className="font-semibold">第5条（検収）</div>
          <p className="prose-jp ml-4">
            {data?.contract?.acceptance || defaultAcceptance}
          </p>
        </div>

        <div>
          <div className="font-semibold">第6条（秘密保持）</div>
          <p className="prose-jp ml-4">
            {data?.contract?.confidentiality || defaultConfidentiality}
          </p>
        </div>

        <div>
          <div className="font-semibold">第7条（その他）</div>
          <p className="prose-jp ml-4">
            1. 本契約に定めのない事項については、両当事者が誠意をもって協議の上決定する。{'\n'}
            2. 本契約に関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とする。
          </p>
        </div>
      </div>

      {/* 特記事項 */}
      {data?.memo && (
        <div className="mt-6 mb-6">
          <div className="font-semibold mb-2">特記事項</div>
          <p className="prose-jp text-sm ml-4">
            {data.memo}
          </p>
        </div>
      )}

      {/* 締結文 */}
      <div className="mt-8 mb-8 text-sm">
        本契約成立の証として本書を2通作成し、甲乙各1通を保有する。
      </div>

      {/* 署名欄 */}
      <div className="grid grid-cols-2 gap-16 mt-10 signature-section">
        <div>
          <div className="mb-4 text-sm">甲（委託者）</div>
          <div className="border-b border-slate-300 h-8 mb-6"></div>
          <div className="w-12 h-12 rounded-full border border-slate-300 grid place-items-center text-[10px] text-slate-500">印</div>
        </div>
        
        <div>
          <div className="mb-4 text-sm">乙（受託者）</div>
          <div className="border-b border-slate-300 h-8 mb-6"></div>
          <div className="w-12 h-12 rounded-full border border-slate-300 grid place-items-center text-[10px] text-slate-500">印</div>
        </div>
      </div>
    </div>
  );
}