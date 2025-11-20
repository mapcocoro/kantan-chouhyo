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

      <ol className="list-decimal pl-5 space-y-3 leading-7 mb-10">
        <li>
          <strong>アプリを開く</strong><br />
          <span className="text-sm text-slate-600">（前回入力した内容がある場合は、自動で続きから始まります）</span>
        </li>
        <li>
          <strong>帳票タイプを選ぶ</strong><br />
          <span className="text-sm text-slate-600">見積・発注・請求・領収の中から作成したい書類を選びます。</span>
        </li>
        <li>
          <strong>内容を入力する</strong><br />
          <span className="text-sm text-slate-600">
            <strong>発行元情報（自社）：</strong>初回に入力すると、次回以降は自動で表示されます。<br />
            <strong>取引先・明細：</strong>入力内容はリアルタイムでブラウザに保存されます。
          </span>
        </li>
        <li>
          <strong>PDFをダウンロード</strong><br />
          <span className="text-sm text-slate-600">「印刷 / PDF保存」ボタンを押し、PDFとして保存・送付してください。</span>
        </li>
      </ol>

      <h2 className="text-xl font-semibold text-balance mb-4">便利な機能</h2>
      <ul className="list-disc pl-5 space-y-3 leading-7 mb-10">
        <li>
          <strong>安心の自動保存</strong><br />
          <span className="text-sm text-slate-600">
            入力内容は作業中に随時、お使いのブラウザに保存されます。誤ってタブを閉じても、再度アクセスすれば続きから再開できます。
          </span>
        </li>
        <li>
          <strong>基本情報の記憶</strong><br />
          <span className="text-sm text-slate-600">
            あなたの会社名や住所、インボイス登録番号などは、一度入力すればブラウザが記憶します。毎回入力する手間はありません。
          </span>
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-balance mb-4">注意事項</h2>
      <ul className="list-disc pl-5 space-y-2 leading-7">
        <li>データはお使いのブラウザ（ローカルストレージ）内にのみ保存されます。履歴やキャッシュを削除すると、保存された設定や下書きも消去されますのでご注意ください。</li>
        <li>本アプリはPDF作成専用です。作成したデータは必ずPDFとしてお手元に保存してください。</li>
        <li>制度要件（適格請求書等）の最終確認はご自身でお願いいたします。</li>
      </ul>

      {ADS_ENABLED && (
        <div className="mt-10 no-print">
          <AdSlot html={RAKU_380x60} width={380} height={60} className="mx-auto" />
        </div>
      )}
    </div>
  );
}