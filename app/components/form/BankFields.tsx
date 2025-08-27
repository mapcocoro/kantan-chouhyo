import type { Bank, DocumentType } from '../../lib/types';

interface Props {
  docType: DocumentType;
  bank?: Bank;
  onChange: (bank: Partial<Bank>) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function BankFields({ docType, bank, onChange }: Props) {
  // 銀行情報は請求書と見積書のみ表示
  if (docType !== 'invoice' && docType !== 'estimate') {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">振込先情報</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            銀行名
          </label>
          <input
            type="text"
            className={inputCls}
            value={bank?.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="みずほ銀行"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            口座種別
          </label>
          <select
            className={inputCls}
            value={bank?.type || '普通'}
            onChange={(e) => onChange({ type: e.target.value })}
          >
            <option value="普通">普通</option>
            <option value="当座">当座</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            口座番号
          </label>
          <input
            type="text"
            className={inputCls}
            value={bank?.number || ''}
            onChange={(e) => onChange({ number: e.target.value })}
            placeholder="1234567"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            口座名義
          </label>
          <input
            type="text"
            className={inputCls}
            value={bank?.holder || ''}
            onChange={(e) => onChange({ holder: e.target.value })}
            placeholder="カ）サンプル"
          />
        </div>
      </div>
    </div>
  );
}