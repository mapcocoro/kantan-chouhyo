import type { Metadata } from "next";
import "./globals.css";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "./config/contact";
import { IS_BETA } from "./config/site";

export const metadata: Metadata = {
  metadataBase: new URL('https://chouhyo.cocoroai.co.jp'),
  title: "かんたん帳票 — ブラウザだけで、見積→請求→PDF。",
  description: "保存なし・その場で印刷/PDF。URL共有対応。個人事業主や小規模事業向けの超シンプル帳票ツール。",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: '/favicon.ico?v=9' },
      { url: '/icon.png?v=9', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png?v=9', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico?v=9'],
  },
  openGraph: {
    title: "かんたん帳票 — ブラウザだけで、見積→請求→PDF。",
    description: "保存なし・その場で印刷/PDF。URL共有対応。個人事業主や小規模事業向けの超シンプル帳票ツール。",
    url: "https://kantanchouhyou.example.com",
    siteName: "かんたん帳票",
    images: [
      {
        url: "/og.png?v=" + Date.now(),
        width: 1200,
        height: 630,
        alt: "かんたん帳票 - ブラウザだけで、見積→請求→PDF。",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "かんたん帳票 — ブラウザだけで、見積→請求→PDF。",
    description: "保存なし・その場で印刷/PDF。URL共有対応。個人事業主や小規模事業向けの超シンプル帳票ツール。",
    images: ["/og.png?v=" + Date.now()],
  },
  keywords: [
    "請求書作成", "見積書作成", "発注書", "領収書", "帳票", 
    "PDF", "印刷", "個人事業主", "フリーランス", "小規模事業者",
    "インボイス", "適格請求書", "無料", "ブラウザ", "オンライン"
  ],
  authors: [{ name: "ココロＡＩ合同会社" }],
  creator: "ココロＡＩ合同会社",
  publisher: "ココロＡＩ合同会社",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console の場合、適宜追加
    // google: 'verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b bg-white no-print">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <a href="/" className="font-semibold inline-flex items-center gap-2">
              <img 
                src="/logo-mark.png?v=1" 
                alt="かんたん帳票" 
                className="h-6 w-6"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span className="flex items-center gap-2">
                <span>かんたん帳票</span>
                {IS_BETA && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                        aria-label="ベータ運用中">β</span>
                )}
              </span>
            </a>
            <nav className="ml-auto flex items-center gap-4 text-sm">
              <a href="/how-to" className="hover:underline">使い方</a>
              <a href="/app" className="px-3 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700">アプリを開く</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t bg-white no-print">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 grid md:grid-cols-2 gap-4">
            <div>© {new Date().getFullYear()} ココロＡＩ合同会社</div>
            <div className="md:text-right space-x-4">
              <a href="/legal/terms" className="hover:underline">利用規約</a>
              <a href="/legal/privacy" className="hover:underline">プライバシーポリシー</a>
              <a href="/legal/disclaimer" className="hover:underline">免責事項</a>
              <a href={CONTACT_MAILTO} className="hover:underline">お問い合わせ：{CONTACT_EMAIL}</a>
            </div>
            {IS_BETA && (
              <div className="md:col-span-2 text-xs text-slate-500">
                現在はベータ運用中です。仕様は予告なく変更となる場合があります。
              </div>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
