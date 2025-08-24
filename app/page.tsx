export const dynamic = 'force-static';

function AdBanner() {
  // 審査不要な自社/提携バナー想定（静的画像リンク）。AdSense等を使う場合は差し替え。
  return (
    <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
      <div className="text-xs text-slate-600">※このページには広告が含まれます</div>
      <a href="#" aria-label="スポンサーリンク" className="inline-flex items-center gap-3">
        <img src="/banner-sample.svg" alt="スポンサー" className="h-8 w-auto" />
        <span className="text-sm text-slate-700 hover:underline">スポンサー募集 / 掲載について</span>
      </a>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-sky-50 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">見積・発注・契約・請求・領収を、<br/>ブラウザだけでサッと作成</h1>
            <p className="mt-4 text-slate-700">保存なし・その場で印刷/PDF。URL共有にも対応。個人事業主や小規模事業向けの超シンプル帳票ツールです。</p>
            <div className="mt-6 flex gap-3">
              <a className="inline-flex items-center justify-center rounded-xl border border-transparent bg-sky-600 px-4 py-2 text-white hover:bg-sky-700" href="/app">アプリを開く（無料）</a>
              <a className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50" href="/how-to">使い方を見る</a>
            </div>
            <p className="mt-3 text-xs text-slate-500">※ 現在β版：入力内容はサーバに保存されません。共有リンクに入力情報が含まれます。</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <img src="/og-preview.svg" alt="画面イメージ" className="rounded-lg w-full h-auto"/>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold">保存なしで安心スタート</h3>
          <p className="mt-2 text-sm text-slate-700">まずはPDF出力だけ。面倒なアカウント作成や審査なしで使い始められます。</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold">URL共有OK</h3>
          <p className="mt-2 text-sm text-slate-700">入力内容はURLハッシュにエンコード。保存しない運用でも、相手と素早く共有できます。</p>
        </div>
        <div className="bg-white border rounded-2xl p-5">
          <h3 className="font-semibold">インボイス対応レイアウト</h3>
          <p className="mt-2 text-sm text-slate-700">登録番号や税率別集計など、基本項目を網羅。※最終確認は各自でお願いします。</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <AdBanner />
      </section>
    </div>
  );
}