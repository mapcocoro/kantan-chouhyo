export default function HowTo(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1>使い方</h1>
      <ol>
        <li><a href="/app">アプリ</a>を開く</li>
        <li>帳票タイプ（見積→発注→契約→請求→領収）を選ぶ</li>
        <li>発行者・取引先・明細を入力する</li>
        <li>「印刷 / PDF保存」を押してPDFにする</li>
        <li>「共有リンクをコピー」でURLを相手へ共有（保存はされません）</li>
      </ol>
      <h2>注意事項</h2>
      <ul>
        <li>URL共有は入力内容がURLに含まれます。機微情報の入力は控えてください。</li>
        <li>制度要件（適格請求書等）の最終確認はご自身でお願いします。</li>
        <li>不具合・ご要望はお問い合わせからどうぞ（info@example.com など）</li>
      </ul>
    </div>
  );
}