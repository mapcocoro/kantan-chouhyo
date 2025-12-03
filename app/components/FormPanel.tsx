import type { FormData, OrderTerms } from '../lib/types';
import DocumentTypeSelector from './form/DocumentTypeSelector';
import BasicFields from './form/BasicFields';
import IssuerFields from './form/IssuerFields';
import ClientFields from './form/ClientFields';
import ItemsTable from './form/ItemsTable';
import BankFields from './form/BankFields';
import TermsFields from './form/TermsFields';
import PurchaseOrderTermsFields from './form/PurchaseOrderTermsFields';

interface Props {
  state: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onChangeIssuer: (patch: Partial<FormData['issuer']>) => void;
  onChangeClient: (patch: Partial<FormData['client']>) => void;
  onChangeItem: (index: number, patch: Partial<FormData['items'][0]>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  saveClientDisabled: boolean;
  onToggleSaveClient: (disabled: boolean) => void;
  onClearClient: () => void;
}

export default function FormPanel({
  state,
  onChange,
  onChangeIssuer,
  onChangeClient,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  saveClientDisabled,
  onToggleSaveClient,
  onClearClient,
}: Props) {
  const onChangeBank = (patch: Partial<FormData['bank']>) => {
    onChange({ bank: { ...state.bank, ...patch } as FormData['bank'] });
  };

  const onChangeTerms = (terms: NonNullable<FormData['terms']>) => {
    onChange({ terms });
  };

  const onChangeOrderTerms = (orderTerms: OrderTerms) => {
    onChange({ orderTerms });
  };

  return (
    <div className="rounded border bg-white shadow-sm">
      <div className="p-4 border-b bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">帳票作成</h2>
      </div>

      <div className="p-4 space-y-6">
        <DocumentTypeSelector
          value={state.docType}
          onChange={(docType) => onChange({ docType })}
        />

        {state.docType === 'purchaseOrder' && (
          <div className="flex items-start gap-2 p-3 bg-sky-50 border border-sky-200 rounded-md text-xs text-sky-800">
            <span className="text-base">💡</span>
            <span>発注書は「発注者（依頼する側）」が「受注者（仕事を受ける側）」に発行する書類です。</span>
          </div>
        )}

        <BasicFields
          docType={state.docType}
          docNo={state.docNo}
          subject={state.subject}
          issueDate={state.issueDate}
          dueDate={state.dueDate}
          paymentSite={state.paymentSite}
          receiptPurpose={state.receiptPurpose}
          manualPurpose={state.manualPurpose}
          onDocNoChange={(docNo) => onChange({ docNo })}
          onSubjectChange={(subject) => onChange({ subject })}
          onIssueDateChange={(issueDate) => onChange({ issueDate })}
          onDueDateChange={(dueDate) => onChange({ dueDate })}
          onPaymentSiteChange={(paymentSite) => onChange({ paymentSite })}
          onReceiptPurposeChange={(receiptPurpose) => onChange({ receiptPurpose })}
          onManualPurposeChange={(manualPurpose) => onChange({ manualPurpose })}
        />

        <IssuerFields
          docType={state.docType}
          issuer={state.issuer}
          onChange={onChangeIssuer}
        />

        <ClientFields
          docType={state.docType}
          client={state.client}
          onChange={onChangeClient}
        />

        {/* 取引先情報の管理オプション */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveClientDisabled}
              onChange={(e) => onToggleSaveClient(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-300 w-3.5 h-3.5"
            />
            取引先情報を保存しない
          </label>
          <button
            type="button"
            onClick={onClearClient}
            className="text-slate-500 hover:text-red-600 underline transition-colors"
          >
            取引先をクリア
          </button>
          <span className="text-slate-400 text-[10px]">
            ※共有PCでは情報を削除してください
          </span>
        </div>

        <ItemsTable
          docType={state.docType}
          items={state.items}
          onItemChange={onChangeItem}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />

        {state.docType === 'purchaseOrder' && (
          <PurchaseOrderTermsFields
            terms={state.orderTerms}
            onChange={onChangeOrderTerms}
            issueDate={state.issueDate}
            dueDate={state.dueDate}
            onDueDateChange={(dueDate) => onChange({ dueDate })}
          />
        )}

        <BankFields
          docType={state.docType}
          bank={state.bank}
          onChange={onChangeBank}
        />

        {/* メモ欄 */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            備考・メモ
          </label>
          <textarea
            className="min-h-[80px] w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300"
            value={state.memo || ''}
            onChange={(e) => onChange({ memo: e.target.value })}
            placeholder="その他特記事項があればご記入ください"
          />
        </div>

        <TermsFields
          terms={state.terms}
          onChange={onChangeTerms}
        />
      </div>
    </div>
  );
}