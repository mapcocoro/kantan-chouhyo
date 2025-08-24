export default function Disclaimer(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1>免責事項</h1>
      <ul>
        <li>本サービスは法的・税務的アドバイスを提供するものではありません。最終的な適法性および記載内容の確認はご利用者様の責任でお願いします。</li>
        <li>ベータ版のため、機能の中断・変更・終了があり得ます。</li>
        <li>当社は、本サービスの利用により生じたいかなる損害についても責任を負いません。</li>
        <li>広告を掲載する場合があります。広告内容の真偽・品質について当社は保証しません。</li>
      </ul>
      <p>改定日：{new Date().toLocaleDateString('ja-JP')}</p>
    </div>
  );
}