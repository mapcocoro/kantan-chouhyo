import AdSlot from "@/app/components/AdSlot";
import { RAKU_380x60 } from "@/app/constants/ads";
import { ADS_ENABLED } from "@/lib/flags";

export default function HowTo(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-pretty ja-body">
      <h1 className="text-2xl font-bold text-balance mb-6">使い方</h1>
      {ADS_ENABLED && (
        <p className="text-xs text-slate-500 mb-4">※ 当サイトはアフィリエイト広告を利用しています。</p>
      )}
      <ol className="list-decimal pl-5 space-y-2 leading-7">
        <li><a href="/app" className="text-sky-600 hover:underline">アプリ</a>を開く</li>
        <li>帳票タイプ（見積、発注、契約、請求、領収）を選ぶ</li>
        <li>発行者・取引先・明細を入力する</li>
        <li>「印刷 / PDF保存」を押してPDFにする</li>
        <li>「共有リンクをコピー」でURLを相手へ共有（保存はされません）</li>
      </ol>
      <h2 className="text-xl font-semibold text-balance mt-8 mb-4">注意事項</h2>
      <ul className="list-disc pl-5 space-y-1 leading-7">
        <li>URL共有は入力内容がURLに含まれます。機微情報の入力は控えてください。</li>
        <li>制度要件（適格請求書等）の最終確認はご自身でお願いします。</li>
      </ul>
      
      {ADS_ENABLED && (
        <div className="mt-10 no-print">
          <AdSlot html={RAKU_380x60} width={380} height={60} className="mx-auto" />
        </div>
      )}
    </div>
  );
}