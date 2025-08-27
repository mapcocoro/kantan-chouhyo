import Tooltip from '../ui/Tooltip';
import type { DocumentType } from '../../lib/types';

interface Props {
  docType: DocumentType;
  docNo: string;
  subject: string;
  issueDate: string;
  dueDate?: string;
  paymentSite?: string;
  onDocNoChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPaymentSiteChange: (value: string) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function BasicFields({
  docType,
  docNo,
  subject,
  issueDate,
  dueDate,
  paymentSite,
  onDocNoChange,
  onSubjectChange,
  onIssueDateChange,
  onDueDateChange,
  onPaymentSiteChange
}: Props) {
  const getDocNoLabel = () => {
    switch (docType) {
      case 'estimate': return '見積番号';
      case 'invoice': return '請求書番号';
      case 'purchaseOrder': return '発注番号';
      case 'receipt': return '領収書番号';
      case 'outsourcingContract': return '契約番号';
      default: return '書類番号';
    }
  };

  const getIssueDateLabel = () => {
    switch (docType) {
      case 'estimate': return '見積日';
      case 'invoice': return '請求日';
      case 'purchaseOrder': return '発注日';
      case 'receipt': return '領収日';
      case 'outsourcingContract': return '契約日';
      default: return '発行日';
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-xs font-medium text-slate-600">
            {getDocNoLabel()} *
            <Tooltip content="例：INV-YYYYMM-001 など。自社の採番ルールでOK。重複しないようにしてください。">
              <span className="inline-block w-3 h-3 rounded-full bg-slate-400 text-white text-[10px] leading-3 text-center cursor-help">?</span>
            </Tooltip>
          </label>
          <input
            type="text"
            className={inputCls}
            value={docNo}
            onChange={(e) => onDocNoChange(e.target.value)}
            placeholder={docType === 'outsourcingContract' ? 'CTR-YYYYMM-001' : 'INV-YYYYMM-001'}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            {getIssueDateLabel()} *
          </label>
          <input
            type="date"
            className={inputCls}
            value={issueDate}
            onChange={(e) => onIssueDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          件名 *
        </label>
        <input
          type="text"
          className={inputCls}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          placeholder="工事費用の件"
        />
      </div>

      {(docType === 'invoice' || docType === 'estimate') && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              支払期日
            </label>
            <input
              type="date"
              className={inputCls}
              value={dueDate || ''}
              onChange={(e) => onDueDateChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              支払条件
            </label>
            <select
              className={inputCls}
              value={paymentSite || '月末締め翌月末払い'}
              onChange={(e) => onPaymentSiteChange(e.target.value)}
            >
              <option value="月末締め翌月末払い">月末締め翌月末払い</option>
              <option value="納品後7日以内">納品後7日以内</option>
              <option value="納品後30日以内">納品後30日以内</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}