import type { Item, DocumentType } from '../../lib/types';
import { formatCurrency } from '../../lib/calc';
import { UNIT_OPTIONS } from '../../lib/types';

interface Props {
  docType: DocumentType;
  items: Item[];
  onItemChange: (index: number, item: Partial<Item>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const inputCls = "h-6 w-full text-xs px-1 py-0 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function ItemsTable({ docType, items, onItemChange, onAddItem, onRemoveItem }: Props) {
  const showDateColumn = docType === 'purchaseOrder';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">明細</h3>
      
      <div className="overflow-x-auto">
        <div className="space-y-1 min-w-[800px]">
        {/* Header */}
        <div className={`grid ${showDateColumn 
          ? 'grid-cols-[minmax(5rem,auto)_minmax(10rem,1fr)_minmax(8rem,auto)_minmax(4rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(3rem,auto)]' 
          : 'grid-cols-[minmax(10rem,1fr)_minmax(8rem,auto)_minmax(4rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(3rem,auto)]'
        } gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-t border-b border-slate-300`}>
          {showDateColumn && (
            <div className="text-center">
              納期
            </div>
          )}
          <div>品名・作業内容</div>
          <div>摘要</div>
          <div className="text-center">数量</div>
          <div className="text-center">単位</div>
          <div className="text-right">単価</div>
          <div className="text-center">税率</div>
          <div className="text-right">金額</div>
          <div></div>
        </div>

        {/* Items */}
        {items.map((item, index) => (
          <div key={index} className={`grid ${showDateColumn 
            ? 'grid-cols-[minmax(5rem,auto)_minmax(10rem,1fr)_minmax(8rem,auto)_minmax(4rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(3rem,auto)]' 
            : 'grid-cols-[minmax(10rem,1fr)_minmax(8rem,auto)_minmax(4rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(5rem,auto)_minmax(6rem,auto)_minmax(3rem,auto)]'
          } gap-2 items-start py-2 px-2 border-b border-slate-200 hover:bg-slate-50`}>
            {showDateColumn && (
              <div>
                <input
                  type="date"
                  className={inputCls}
                  value={item.date || ''}
                  onChange={(e) => onItemChange(index, { date: e.target.value })}
                />
              </div>
            )}
            <div>
              <textarea
                className="w-full text-xs px-1 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300 resize-none min-h-[24px]"
                value={item.name || ''}
                onChange={(e) => onItemChange(index, { name: e.target.value })}
                placeholder="品名を入力"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
            <div>
              <textarea
                className="w-full text-xs px-1 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300 resize-none min-h-[24px]"
                value={item.desc || ''}
                onChange={(e) => onItemChange(index, { desc: e.target.value })}
                placeholder="摘要"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
            <div>
              <input
                type="number"
                className={inputCls + " text-center"}
                value={item.qty || 1}
                onChange={(e) => onItemChange(index, { qty: Number(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div>
              <select
                className="w-full h-6 text-xs px-1 py-0 text-center border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300"
                value={item.unit || '式'}
                onChange={(e) => onItemChange(index, { unit: e.target.value })}
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                className={inputCls + " text-right"}
                value={item.unitPrice || 0}
                onChange={(e) => onItemChange(index, { unitPrice: Number(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div>
              <select
                className="w-full text-xs px-1 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300 text-center"
                value={item.taxRate ?? 10}
                onChange={(e) => onItemChange(index, { taxRate: Number(e.target.value) })}
              >
                <option value="0">0%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
              </select>
            </div>
            <div className="text-right text-slate-700 font-medium text-xs pt-1">
              ¥{formatCurrency((item.qty || 1) * (item.unitPrice || 0))}
            </div>
            <div className="text-center">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm w-6 h-6 rounded hover:bg-red-50"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
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