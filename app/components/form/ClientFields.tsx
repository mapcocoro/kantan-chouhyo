import { useAddressLookup } from '../../hooks/useAddressLookup';
import Tooltip from '../ui/Tooltip';
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
      estimate: '提出先',
      invoice: '請求先',
      purchaseOrder: '受注者',
      receipt: '宛名'
    };
    return titleMap[docType] || '取引先';
  };

  const getTooltipContent = () => {
    if (docType === 'purchaseOrder') {
      return '仕事を受け、代金を受け取る側です';
    }
    return null;
  };

  const tooltipContent = getTooltipContent();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1">
        {getTitle()}
        {tooltipContent && (
          <Tooltip content={tooltipContent}>
            <span className="inline-block w-3 h-3 rounded-full bg-slate-400 text-white text-[10px] leading-3 text-center cursor-help">?</span>
          </Tooltip>
        )}
      </h3>
      
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