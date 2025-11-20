import Tooltip from '../ui/Tooltip';
import type { DocumentType } from '../../lib/types';
import { PAYMENT_TERMS_PRESETS } from '../../lib/types';
import { calculateDueDate } from '../../lib/calculateDueDate';

interface Props {
  docType: DocumentType;
  docNo: string;
  subject: string;
  issueDate: string;
  dueDate?: string;
  paymentSite?: string;
  receiptPurpose?: string;
  manualPurpose?: boolean;
  onDocNoChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onIssueDateChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPaymentSiteChange: (value: string) => void;
  onReceiptPurposeChange?: (value: string) => void;
  onManualPurposeChange?: (value: boolean) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function BasicFields({
  docType,
  docNo,
  subject,
  issueDate,
  dueDate,
  paymentSite,
  receiptPurpose,
  manualPurpose,
  onDocNoChange,
  onSubjectChange,
  onIssueDateChange,
  onDueDateChange,
  onPaymentSiteChange,
  onReceiptPurposeChange,
  onManualPurposeChange
}: Props) {
  const getDocNoLabel = () => {
    const labelMap: Record<DocumentType, string> = {
      estimate: '見積番号',
      invoice: '請求書番号',
      purchaseOrder: '発注番号',
      receipt: '領収書番号',
      outsourcingContract: '契約書番号'
    };
    return labelMap[docType] || '書類番号';
  };

  const getIssueDateLabel = () => {
    const labelMap: Record<DocumentType, string> = {
      estimate: '見積日',
      invoice: '請求日',
      purchaseOrder: '発注日',
      receipt: '領収日',
      outsourcingContract: '契約日'
    };
    return labelMap[docType] || '発行日';
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
            placeholder="INV-YYYYMM-001"
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
            onChange={(e) => {
              const newIssueDate = e.target.value;
              onIssueDateChange(newIssueDate);
              // 発行日を変更したときも、支払条件が設定されていれば支払期日を再計算
              if (paymentSite) {
                const calculatedDueDate = calculateDueDate(newIssueDate, paymentSite);
                if (calculatedDueDate) {
                  onDueDateChange(calculatedDueDate);
                }
              }
            }}
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
              支払期日{docType === 'invoice' ? ' *' : ''}
            </label>
            <input
              type="date"
              className={inputCls}
              value={dueDate || ''}
              onChange={(e) => onDueDateChange(e.target.value)}
              required={docType === 'invoice'}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              支払条件
            </label>
            <select
              className={inputCls}
              value={paymentSite || PAYMENT_TERMS_PRESETS[0]}
              onChange={(e) => {
                const newPaymentSite = e.target.value;
                onPaymentSiteChange(newPaymentSite);
                // 支払条件を選択したら自動で支払期日を計算
                const calculatedDueDate = calculateDueDate(issueDate, newPaymentSite);
                if (calculatedDueDate) {
                  onDueDateChange(calculatedDueDate);
                }
              }}
            >
              {PAYMENT_TERMS_PRESETS.map((preset) => (
                <option key={preset} value={preset}>{preset}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {docType === 'receipt' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={manualPurpose || false}
              onChange={(e) => onManualPurposeChange?.(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-300"
            />
            手動で但し書きを編集する
          </label>
          {manualPurpose && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                但し書き
              </label>
              <input
                type="text"
                className={inputCls}
                value={receiptPurpose || ''}
                onChange={(e) => onReceiptPurposeChange?.(e.target.value)}
                placeholder="◯◯代として"
              />
              <p className="text-xs text-slate-500">
                ※チェックを外すと、明細から自動生成されます
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}