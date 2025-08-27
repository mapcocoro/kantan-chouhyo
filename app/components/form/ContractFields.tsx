import type { Contract, DocumentType } from '../../lib/types';

interface Props {
  docType: DocumentType;
  contract?: Contract;
  onChange: (contract: Partial<Contract>) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";
const areaCls = "min-h-[50px] w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function ContractFields({ docType, contract, onChange }: Props) {
  // 契約書のみ表示
  if (docType !== 'outsourcingContract') {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">契約条項</h3>
      
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          契約期間
        </label>
        <input
          type="text"
          className={inputCls}
          value={contract?.period || ''}
          onChange={(e) => onChange({ period: e.target.value })}
          placeholder="2024年4月1日から2025年3月31日まで"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          報酬
        </label>
        <textarea
          className={areaCls}
          value={contract?.reward || ''}
          onChange={(e) => onChange({ reward: e.target.value })}
          placeholder="月額金○○円（税込）を翌月末日までに指定口座に振り込む"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          支払条件
        </label>
        <textarea
          className={areaCls}
          value={contract?.paymentTerms || ''}
          onChange={(e) => onChange({ paymentTerms: e.target.value })}
          placeholder="業務完了後、月末締め翌月末払いとする"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          検収
        </label>
        <textarea
          className={areaCls}
          value={contract?.acceptance || ''}
          onChange={(e) => onChange({ acceptance: e.target.value })}
          placeholder="委託者は成果物の検収を業務完了から7日以内に行う"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          秘密保持
        </label>
        <textarea
          className={areaCls}
          value={contract?.confidentiality || ''}
          onChange={(e) => onChange({ confidentiality: e.target.value })}
          placeholder="両当事者は業務上知り得た秘密情報を第三者に開示してはならない"
        />
      </div>
    </div>
  );
}