export default function Privacy(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-pretty ja-body measure">
      <h1 className="text-2xl font-bold text-balance mb-4">プライバシーポリシー（ベータ版）</h1>
      <p className="text-slate-700 mb-8">
        ココロＡＩ合同会社（以下「当社」）は、本サービスの提供にあたり、以下の方針に基づいて個人情報を取り扱います。
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">1. 事業者情報</h2>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>事業者名：ココロＡＩ合同会社</li>
          <li>個人情報管理責任者：代表社員</li>
          <li>お問い合わせ：info@cocoroai.co.jp</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">2. 取得する情報と保存場所</h2>

        <div className="mb-4">
          <h3 className="font-semibold text-slate-800 mb-2">【帳票入力データについて】</h3>
          <p className="text-slate-700">
            ユーザーが帳票作成のために入力した情報（個人名、取引内容等）は、<strong>当社サーバーには送信・保存されず、お客様のブラウザ内（ローカルストレージ）にのみ保存されます。</strong>当社がこれらのデータを閲覧・収集することはありません。
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-2">【アクセス解析・広告について】</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>アクセス解析を行う場合、Cookie等により匿名の利用情報を取得することがあります。</li>
            <li>アフィリエイト広告を利用する場合、計測のためCookie等が第三者（広告事業者）により設定されることがあります。</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">3. 利用目的</h2>
        <p className="text-slate-700">
          サービス改善、問合せ対応、法令遵守のため。（※当社が保有する問い合わせ情報等に限る）
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">4. 共有・第三者提供</h2>
        <p className="text-slate-700">
          法令に基づく場合を除き、本人の同意なく第三者提供は行いません。なお、帳票入力データ自体は当社が保有しないため、これを第三者へ提供することは技術的に不可能です。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">5. 安全管理</h2>
        <p className="text-slate-700">
          当社が保有する情報（お問い合わせ内容等）については、適切な管理措置を講じます。
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">6. 開示・訂正・利用停止等の請求</h2>
        <p className="text-slate-700 mb-3">
          当社が保有する個人データ（お問い合わせ履歴等）の開示・訂正等については、上記お問い合わせ先までご連絡ください。
        </p>
        <p className="text-slate-700">
          ※なお、帳票作成時に入力されたデータは当社サーバーに存在しないため、当社側での開示・復元・削除等の操作は行えません。お客様ご自身のブラウザ操作にて管理をお願いいたします。
        </p>
      </section>

      <div className="mt-8 pt-4 border-t">
        <p className="text-sm text-slate-600">制定日：2025年9月28日</p>
        <p className="text-sm text-slate-600">改定日：2025年11月20日</p>
      </div>
    </div>
  );
}