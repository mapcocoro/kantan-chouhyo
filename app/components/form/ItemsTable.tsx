import type { Item, DocumentType } from '../../lib/types';
import { formatCurrency, formatPercent } from '../../lib/calc';

interface Props {
  docType: DocumentType;
  items: Item[];
  onItemChange: (index: number, item: Partial<Item>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const inputCls = "h-6 w-full text-xs px-1 py-0 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function ItemsTable({ docType, items, onItemChange, onAddItem, onRemoveItem }: Props) {
  const showDateColumn = docType === 'purchaseOrder' || docType === 'outsourcingContract';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">明細</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border border-slate-300">
          <thead className="bg-slate-50">
            <tr>
              {showDateColumn && (
                <th className="px-2 py-1 text-left border-b border-slate-300 w-20">
                  {docType === 'outsourcingContract' ? '作業日' : '納期'}
                </th>
              )}
              <th className="px-2 py-1 text-left border-b border-slate-300">品名・作業内容</th>
              <th className="px-2 py-1 text-left border-b border-slate-300">摘要</th>
              <th className="px-2 py-1 text-center border-b border-slate-300 w-16">数量</th>
              <th className="px-2 py-1 text-center border-b border-slate-300 w-12">単位</th>
              <th className="px-2 py-1 text-right border-b border-slate-300 w-20">単価</th>
              <th className="px-2 py-1 text-center border-b border-slate-300 w-16">税率</th>
              <th className="px-2 py-1 text-right border-b border-slate-300 w-20">金額</th>
              <th className="px-2 py-1 text-center border-b border-slate-300 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-slate-200">
                {showDateColumn && (
                  <td className="px-2 py-1">
                    <input
                      type="date"
                      className={inputCls}
                      value={item.date || ''}
                      onChange={(e) => onItemChange(index, { date: e.target.value })}
                    />
                  </td>
                )}
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className={inputCls}
                    value={item.name || ''}
                    onChange={(e) => onItemChange(index, { name: e.target.value })}
                    placeholder="品名を入力"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className={inputCls}
                    value={item.desc || ''}
                    onChange={(e) => onItemChange(index, { desc: e.target.value })}
                    placeholder="摘要"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    className={inputCls + " text-center"}
                    value={item.qty || 1}
                    onChange={(e) => onItemChange(index, { qty: Number(e.target.value) || 1 })}
                    min="1"
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    className="min-w-24 w-28 text-sm leading-6 px-2 py-1 h-9 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300 text-center"
                    value={item.unit || '式'}
                    onChange={(e) => onItemChange(index, { unit: e.target.value })}
                  >
                    <option value="式">式</option>
                    <option value="個">個</option>
                    <option value="件">件</option>
                    <option value="時間">時間</option>
                    <option value="日">日</option>
                    <option value="月">月</option>
                    <option value="人時">人時</option>
                    <option value="セット">セット</option>
                    <option value="本">本</option>
                    <option value="台">台</option>
                    <option value="箇所">箇所</option>
                    <option value="枚">枚</option>
                    <option value="ライセンス">ライセンス</option>
                    <option value="㎡">㎡</option>
                    <option value="m">m</option>
                    <option value="kg">kg</option>
                    <option value="GB">GB</option>
                  </select>
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    className={inputCls + " text-right"}
                    value={item.unitPrice || 0}
                    onChange={(e) => onItemChange(index, { unitPrice: Number(e.target.value) || 0 })}
                    min="0"
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    className={inputCls + " text-center"}
                    value={item.taxRate || 10}
                    onChange={(e) => onItemChange(index, { taxRate: Number(e.target.value) })}
                  >
                    <option value={0}>0%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </td>
                <td className="px-2 py-1 text-right text-slate-700 font-medium">
                  ¥{formatCurrency((item.qty || 1) * (item.unitPrice || 0))}
                </td>
                <td className="px-2 py-1 text-center">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onAddItem}
        className="px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200 border border-slate-300"
      >
        + 行を追加
      </button>
    </div>
  );
}