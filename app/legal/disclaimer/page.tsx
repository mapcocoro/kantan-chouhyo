export default function Disclaimer(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-pretty ja-body measure">
      <h1 className="text-2xl font-bold text-balance mb-8">免責事項</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">法的アドバイスの非提供</h2>
        <p className="text-slate-700">
          本サービスは法的・税務的アドバイスを提供するものではありません。最終的な適法性（インボイス制度への適合性等）および記載内容の確認はご利用者様の責任でお願いします。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">データの消失について（重要）</h2>
        <p className="text-slate-700">
          本サービスは、入力データをサーバーに保存せず、ご利用のブラウザ内（ローカルストレージ）に一時保存します。ブラウザのキャッシュ削除、端末の故障、または不慮の不具合等によりデータが消失した場合、当社は復元を含め一切の責任を負いません。<strong>重要なデータは必ずPDFとして保存してください。</strong>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">サービスの変更・中断</h2>
        <p className="text-slate-700">
          ベータ版のため、事前の予告なく機能の中断・変更・終了があり得ます。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">損害の免責</h2>
        <p className="text-slate-700">
          当社は、本サービスの利用により生じたいかなる損害についても責任を負いません。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">広告の掲載</h2>
        <p className="text-slate-700">
          広告を掲載する場合があります。広告内容の真偽・品質について当社は保証しません。
        </p>
      </section>

      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-slate-600">制定日：2025年9月28日</p>
        <p className="text-sm text-slate-600">改定日：2025年11月20日</p>
      </div>
    </div>
  );
}