import type { DocumentType } from '../../lib/types';
import { DOC_ORDER, DOC_LABELS } from '../../constants/docs';

interface Props {
  value: DocumentType;
  onChange: (docType: DocumentType) => void;
}

export default function DocumentTypeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-600">
        帳票タイプ *
      </label>
      <select
        className="h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300"
        value={value}
        onChange={(e) => onChange(e.target.value as DocumentType)}
      >
        {DOC_ORDER.map(docType => (
          <option key={docType} value={docType}>
            {DOC_LABELS[docType]}
          </option>
        ))}
      </select>
    </div>
  );
}