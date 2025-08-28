import Tooltip from '../ui/Tooltip';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import type { Issuer, DocumentType } from '../../lib/types';

interface Props {
  docType: DocumentType;
  issuer: Issuer;
  onChange: (issuer: Partial<Issuer>) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function IssuerFields({ docType, issuer, onChange }: Props) {
  const { lookupAddress } = useAddressLookup();

  const handleZipChange = async (zip: string) => {
    onChange({ zip });
    if (zip.length === 7) {
      const address = await lookupAddress(zip);
      if (address) {
        onChange({ addr: address.fullAddress });
      }
    }
  };

  const getTitle = () => {
    const titleMap: Record<DocumentType, string> = {
      estimate: '発行者（自社）',
      invoice: '請求者（自社）',
      purchaseOrder: '発注者（自社）',
      receipt: '領収者（自社）'
    };
    return titleMap[docType] || '発行者（自社）';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{getTitle()}</h3>
      
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          事業者名 *
        </label>
        <input
          type="text"
          className={inputCls}
          value={issuer.name || ''}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="株式会社サンプル"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            郵便番号
          </label>
          <input
            type="text"
            className={inputCls}
            value={issuer.zip || ''}
            onChange={(e) => handleZipChange(e.target.value)}
            placeholder="1234567"
            maxLength={7}
          />
        </div>
        
        <div className="col-span-2 space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            住所
          </label>
          <input
            type="text"
            className={inputCls}
            value={issuer.addr || ''}
            onChange={(e) => onChange({ addr: e.target.value })}
            placeholder="東京都渋谷区..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          電話番号
        </label>
        <input
          type="tel"
          className={inputCls}
          value={issuer.tel || ''}
          onChange={(e) => onChange({ tel: e.target.value })}
          placeholder="03-1234-5678"
        />
      </div>

      {(docType === 'invoice' || docType === 'estimate') && (
        <div className="space-y-1">
          <label className="flex items-center gap-1 text-xs font-medium text-slate-600">
            登録番号
            <Tooltip content="適格請求書発行事業者の登録番号（T+13桁）／例：T1234567890123／未登録の場合は空欄でOKです。">
              <span className="inline-block w-3 h-3 rounded-full bg-slate-400 text-white text-[10px] leading-3 text-center cursor-help">?</span>
            </Tooltip>
          </label>
          <input
            type="text"
            className={inputCls}
            value={issuer.regNo || ''}
            onChange={(e) => onChange({ regNo: e.target.value })}
            placeholder="T1234567890123"
            maxLength={14}
          />
        </div>
      )}
    </div>
  );
}