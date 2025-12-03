import { useState } from 'react';
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
  const [regNoError, setRegNoError] = useState<string>('');

  const handleZipChange = async (zip: string) => {
    onChange({ zip });
    if (zip.length === 7) {
      const address = await lookupAddress(zip);
      if (address) {
        onChange({ addr: address.fullAddress });
      }
    }
  };

  // 登録番号の処理（T + 13桁の数字）
  const handleRegNoChange = (value: string) => {
    // 数字のみを許可
    const numbersOnly = value.replace(/[^0-9]/g, '');

    // 13桁を超える入力は無視
    if (numbersOnly.length > 13) {
      return;
    }

    // Tプレフィックス付きで保存
    const regNo = numbersOnly ? `T${numbersOnly}` : '';
    onChange({ regNo });

    // バリデーション
    if (numbersOnly.length > 0 && numbersOnly.length !== 13) {
      setRegNoError('登録番号は13桁の数字で入力してください');
    } else {
      setRegNoError('');
    }
  };

  // 表示用：Tを除いた数字部分を取得
  const getRegNoDisplayValue = () => {
    if (!issuer.regNo) return '';
    return issuer.regNo.replace(/^T/, '');
  };

  const getTitle = () => {
    const titleMap: Record<DocumentType, string> = {
      estimate: '発行者',
      invoice: '発行者',
      purchaseOrder: '発注者',
      receipt: '発行者'
    };
    return titleMap[docType] || '発行者';
  };

  const getTooltipContent = () => {
    if (docType === 'purchaseOrder') {
      return '仕事を依頼し、代金を支払う側です';
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
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-700 pointer-events-none">
              T
            </div>
            <input
              type="text"
              className={`${inputCls} pl-5 ${regNoError ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : ''}`}
              value={getRegNoDisplayValue()}
              onChange={(e) => handleRegNoChange(e.target.value)}
              placeholder="1234567890123"
              maxLength={13}
              inputMode="numeric"
            />
          </div>
          {regNoError && (
            <p className="text-xs text-red-600 mt-0.5">{regNoError}</p>
          )}
        </div>
      )}
    </div>
  );
}