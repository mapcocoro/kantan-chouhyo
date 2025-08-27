import { useState } from 'react';
import type { Contract, DocumentType } from '../../lib/types';

interface Props {
  docType: DocumentType;
  contract?: Contract;
  onChange: (contract: Partial<Contract>) => void;
}

const inputCls = "h-7 w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";
const areaCls = "min-h-[50px] w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300 mt-2";

export default function ContractFields({ docType, contract, onChange }: Props) {
  const [periodType, setPeriodType] = useState('1year');
  const [rewardType, setRewardType] = useState('monthly');
  const [paymentType, setPaymentType] = useState('month-end');
  const [acceptanceType, setAcceptanceType] = useState('7days');

  // 契約書のみ表示
  if (docType !== 'outsourcingContract') {
    return null;
  }

  const getCurrentYear = () => new Date().getFullYear();
  const getNextYear = () => getCurrentYear() + 1;

  const handlePeriodChange = (type: string) => {
    setPeriodType(type);
    switch(type) {
      case '1year':
        onChange({ period: `${getCurrentYear()}年4月1日から${getNextYear()}年3月31日まで` });
        break;
      case 'month':
        onChange({ period: `${getCurrentYear()}年${new Date().getMonth() + 1}月1日から翌月末日まで` });
        break;
      case 'custom':
        onChange({ period: '' });
        break;
    }
  };

  const handleRewardChange = (type: string) => {
    setRewardType(type);
    switch(type) {
      case 'monthly':
        onChange({ reward: '月額金○○円（税込）' });
        break;
      case 'fixed':
        onChange({ reward: '固定金額○○円（税込）' });
        break;
      case 'output':
        onChange({ reward: '成果物に応じた出来高払い' });
        break;
      case 'custom':
        onChange({ reward: '' });
        break;
    }
  };

  const handlePaymentChange = (type: string) => {
    setPaymentType(type);
    switch(type) {
      case 'month-end':
        onChange({ paymentTerms: '月末締め翌月末払い' });
        break;
      case '30days':
        onChange({ paymentTerms: '検収後30日以内' });
        break;
      case 'custom':
        onChange({ paymentTerms: '' });
        break;
    }
  };

  const handleAcceptanceChange = (type: string) => {
    setAcceptanceType(type);
    switch(type) {
      case '7days':
        onChange({ acceptance: '成果物受領後7日以内' });
        break;
      case 'none':
        onChange({ acceptance: '検収不要' });
        break;
      case 'custom':
        onChange({ acceptance: '' });
        break;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">契約条項</h3>
      
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          契約期間
        </label>
        <select
          className={inputCls}
          value={periodType}
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <option value="1year">{getCurrentYear()}年4月1日〜{getNextYear()}年3月31日</option>
          <option value="month">当月1日〜翌月末日</option>
          <option value="custom">カスタム</option>
        </select>
        {periodType === 'custom' && (
          <input
            type="text"
            className={areaCls}
            value={contract?.period || ''}
            onChange={(e) => onChange({ period: e.target.value })}
            placeholder="契約期間を入力"
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          報酬
        </label>
        <select
          className={inputCls}
          value={rewardType}
          onChange={(e) => handleRewardChange(e.target.value)}
        >
          <option value="monthly">月額◯円(税込)</option>
          <option value="fixed">固定◯円(税込)</option>
          <option value="output">出来高</option>
          <option value="custom">カスタム</option>
        </select>
        {rewardType === 'custom' && (
          <textarea
            className={areaCls}
            value={contract?.reward || ''}
            onChange={(e) => onChange({ reward: e.target.value })}
            placeholder="報酬条件を入力"
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          支払条件
        </label>
        <select
          className={inputCls}
          value={paymentType}
          onChange={(e) => handlePaymentChange(e.target.value)}
        >
          <option value="month-end">月末締翌月末払</option>
          <option value="30days">検収後30日以内</option>
          <option value="custom">カスタム</option>
        </select>
        {paymentType === 'custom' && (
          <textarea
            className={areaCls}
            value={contract?.paymentTerms || ''}
            onChange={(e) => onChange({ paymentTerms: e.target.value })}
            placeholder="支払条件を入力"
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          検収
        </label>
        <select
          className={inputCls}
          value={acceptanceType}
          onChange={(e) => handleAcceptanceChange(e.target.value)}
        >
          <option value="7days">成果物受領後7日以内</option>
          <option value="none">不要</option>
          <option value="custom">カスタム</option>
        </select>
        {acceptanceType === 'custom' && (
          <textarea
            className={areaCls}
            value={contract?.acceptance || ''}
            onChange={(e) => onChange({ acceptance: e.target.value })}
            placeholder="検収条件を入力"
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-600">
          秘密保持 (固定文)
        </label>
        <div className="text-xs text-slate-600 p-2 bg-slate-50 rounded">
          両当事者は、本契約に関して知り得た相手方の秘密情報を第三者に開示してはならない。
        </div>
      </div>
    </div>
  );
}