import type { FormData } from '../lib/types';
import DocumentTypeSelector from './form/DocumentTypeSelector';
import BasicFields from './form/BasicFields';
import IssuerFields from './form/IssuerFields';
import ClientFields from './form/ClientFields';
import ItemsTable from './form/ItemsTable';
import BankFields from './form/BankFields';
import ContractFields from './form/ContractFields';

interface Props {
  state: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onChangeIssuer: (patch: Partial<FormData['issuer']>) => void;
  onChangeClient: (patch: Partial<FormData['client']>) => void;
  onChangeItem: (index: number, patch: Partial<FormData['items'][0]>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export default function FormPanel({
  state,
  onChange,
  onChangeIssuer,
  onChangeClient,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: Props) {
  const onChangeBank = (patch: Partial<FormData['bank']>) => {
    onChange({ bank: { ...state.bank, ...patch } });
  };

  const onChangeContract = (patch: Partial<FormData['contract']>) => {
    onChange({ contract: { ...state.contract, ...patch } });
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

        <BasicFields
          docType={state.docType}
          docNo={state.docNo}
          subject={state.subject}
          issueDate={state.issueDate}
          dueDate={state.dueDate}
          paymentSite={state.paymentSite}
          onDocNoChange={(docNo) => onChange({ docNo })}
          onSubjectChange={(subject) => onChange({ subject })}
          onIssueDateChange={(issueDate) => onChange({ issueDate })}
          onDueDateChange={(dueDate) => onChange({ dueDate })}
          onPaymentSiteChange={(paymentSite) => onChange({ paymentSite })}
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

        <ItemsTable
          docType={state.docType}
          items={state.items}
          onItemChange={onChangeItem}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />

        <BankFields
          docType={state.docType}
          bank={state.bank}
          onChange={onChangeBank}
        />

        <ContractFields
          docType={state.docType}
          contract={state.contract}
          onChange={onChangeContract}
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
      </div>
    </div>
  );
}