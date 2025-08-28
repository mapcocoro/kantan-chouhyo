import type { Terms } from '../../lib/types';
import { DEFAULT_TERMS_TEXT } from '../../lib/types';

interface Props {
  terms?: Terms;
  onChange: (terms: Terms) => void;
}

const inputCls = "w-full text-xs px-2 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300";

export default function TermsFields({ terms, onChange }: Props) {
  const currentTerms = terms || { enabled: false, text: DEFAULT_TERMS_TEXT };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">簡易特約フッター</h3>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input
            type="checkbox"
            checked={currentTerms.enabled}
            onChange={(e) => onChange({ ...currentTerms, enabled: e.target.checked })}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-300"
          />
          簡易特約をフッターに載せる
        </label>
        
        {currentTerms.enabled && (
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-600">
              特約内容
            </label>
            <textarea
              className={`${inputCls} min-h-[100px]`}
              value={currentTerms.text}
              onChange={(e) => onChange({ ...currentTerms, text: e.target.value })}
              placeholder="特約内容を入力してください"
            />
            <p className="text-xs text-slate-500">
              ※フッターに小さな文字で表示されます。印刷時も同じサイズで出力されます。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}