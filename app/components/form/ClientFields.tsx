import { useAddressLookup } from '../../hooks/useAddressLookup';
import type { Client, DocumentType } from '../../lib/types';
import { HONORIFIC_OPTIONS } from '../../lib/types';

interface Props {
  docType: DocumentType;
  client: Client;
  onChange: (client: Partial<Client>) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function ClientFields({ docType, client, onChange }: Props) {
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
      estimate: '見積先',
      invoice: '請求先',
      purchaseOrder: '発注先',
      receipt: '支払者',
      outsourcingContract: '委託先'
    };
    return titleMap[docType] || '取引先';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">{getTitle()}</h3>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            事業者名 *
          </label>
          <input
            type="text"
            className={inputCls}
            value={client.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="株式会社クライアント"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            敬称
          </label>
          <select
            className={inputCls}
            value={client.honorific || '御中'}
            onChange={(e) => onChange({ honorific: e.target.value })}
          >
            {HONORIFIC_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option || '（なし）'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600">
            郵便番号
          </label>
          <input
            type="text"
            className={inputCls}
            value={client.zip || ''}
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
            value={client.addr || ''}
            onChange={(e) => onChange({ addr: e.target.value })}
            placeholder="東京都渋谷区..."
          />
        </div>
      </div>
    </div>
  );
}