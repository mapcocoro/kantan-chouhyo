export default function Privacy(){
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-pretty ja-body measure">
      <h1 className="text-2xl font-bold text-balance">プライバシーポリシー（ベータ版）</h1>
      <p className="mt-3">当社は、本サービスの提供にあたり、以下の方針に基づいて個人情報を取り扱います。</p>
      <h2 className="text-xl font-semibold text-balance mt-6 mb-2">1. 取得する情報</h2>
      <ul className="list-disc pl-5 space-y-1 mt-3">
        <li>本サービスは原則として入力データをサーバに保存しません。</li>
        <li>アクセス解析を行う場合、Cookie等により匿名の利用情報を取得することがあります（導入時に本ページを更新します）。</li>
      </ul>
      <h2 className="text-xl font-semibold text-balance mt-6 mb-2">2. 利用目的</h2>
      <p className="mt-3">サービス改善、問合せ対応、法令遵守のため。</p>
      <h2 className="text-xl font-semibold text-balance mt-6 mb-2">3. 共有・第三者提供</h2>
      <p className="mt-3">法令に基づく場合を除き、本人の同意なく第三者提供は行いません。</p>
      <h2 className="text-xl font-semibold text-balance mt-6 mb-2">4. 安全管理</h2>
      <p className="mt-3">取得した情報は適切に管理します。なお、URL共有機能では入力内容がURLに含まれるため、機微情報の入力はお控えください。</p>
    </div>
  );
}