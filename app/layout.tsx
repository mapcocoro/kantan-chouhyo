import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "軽量請求（β） - 見積・発注・契約・請求・領収をブラウザで作成",
  description: "保存なし・その場で印刷/PDF。URL共有対応。個人事業主や小規模事業向けの超シンプル帳票ツール。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <a href="/" className="font-semibold">軽量請求（β）</a>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <a href="/how-to" className="hover:underline">使い方</a>
              <a href="/app" className="px-3 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700">アプリを開く</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 grid md:grid-cols-2 gap-4">
            <div>© {new Date().getFullYear()} 〇〇株式会社</div>
            <div className="md:text-right space-x-4">
              <a href="/legal/terms" className="hover:underline">利用規約</a>
              <a href="/legal/privacy" className="hover:underline">プライバシーポリシー</a>
              <a href="/legal/disclaimer" className="hover:underline">免責事項</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
