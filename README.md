# かんたん帳票

ブラウザだけで見積書・発注書・請求書・領収書を作成できるWebアプリケーション。  
データ保存なし、URL共有対応、PDF出力可能。

🔗 **本番環境**: https://chouhyo.cocoroai.co.jp/

## 🎯 特徴

- **保存不要**: データはURLハッシュにエンコード、サーバー保存なし
- **4種類の帳票**: 見積書 → 発注書 → 請求書 → 領収書の業務フローに対応
- **インボイス対応**: 適格請求書発行事業者登録番号、税率別集計に対応
- **URL共有**: 入力内容をURLで共有可能
- **印刷/PDF**: ブラウザの印刷機能でPDF保存
- **広告表示**: 楽天アフィリエイト広告対応（環境変数で制御）

## 🛠 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# http://localhost:3000 でアクセス
```

## 📝 npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 (localhost:3000) |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintチェック |
| `npm run gen:favicon` | favicon.ico生成 & バージョン自動更新 |

## 📁 プロジェクト構成

```
kantan-chouhyo/
├── app/                    # Next.js App Router
│   ├── app/               # メインアプリケーション画面
│   │   └── page.tsx       # 帳票作成メイン画面
│   ├── components/        # 再利用可能なコンポーネント
│   │   ├── form/         # 入力フォーム関連
│   │   │   ├── BasicFields.tsx          # 基本情報入力
│   │   │   ├── IssuerFields.tsx         # 発行者情報
│   │   │   ├── ClientFields.tsx         # 取引先情報
│   │   │   ├── ItemsTable.tsx           # 明細テーブル
│   │   │   ├── BankFields.tsx           # 振込先情報
│   │   │   ├── TermsFields.tsx          # 取引条件
│   │   │   └── PurchaseOrderTermsFields.tsx # 発注書専用条件
│   │   ├── preview/      # プレビュー画面
│   │   │   ├── EstimatePreview.tsx      # 見積書
│   │   │   ├── InvoicePreview.tsx       # 請求書
│   │   │   ├── PurchaseOrderPreview.tsx # 発注書
│   │   │   └── ReceiptPreview.tsx       # 領収書
│   │   ├── ui/           # UIコンポーネント
│   │   └── AdSlot.tsx    # 広告表示コンポーネント
│   ├── lib/              # ユーティリティ関数
│   │   ├── types.ts      # TypeScript型定義
│   │   ├── calc.ts       # 計算ロジック
│   │   └── format.ts     # フォーマット関数
│   ├── constants/        # 定数定義
│   │   └── ads.ts        # 広告HTML定義
│   ├── layout.tsx        # ルートレイアウト
│   └── globals.css       # グローバルCSS（印刷用含む）
├── lib/                  # アプリケーション共通ライブラリ
│   └── flags.ts          # 機能フラグ管理
├── public/               # 静的ファイル
│   ├── favicon.ico       # ファビコン（32×32）
│   ├── icon.png          # アイコン元画像（512×512）
│   └── apple-icon.png    # Apple Touch Icon
└── scripts/              # ビルドスクリプト
    └── gen-favicon.mjs   # favicon生成スクリプト
```

## 🚀 デプロイ

### Vercel自動デプロイ

- `main`ブランチへのpush/mergeで自動デプロイ
- PRごとにプレビュー環境が作成される

### 手動デプロイ

```bash
# ビルド
npm run build

# 静的エクスポート（必要な場合）
npm run build && npm run export
```

### 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `NEXT_PUBLIC_ENABLE_ADS` | 広告表示フラグ（1で表示、0または未設定で非表示） | - |

## 🔧 開発ガイド

### ブランチ戦略

- `main`: 本番環境
- `release/*`: リリース準備
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `chore/*`: その他メンテナンス

### コーディング規約

- ESLint/TypeScriptの厳格モード有効
- 未使用変数・import禁止
- `any`型の使用禁止
- コンポーネントは関数コンポーネントで統一

### favicon更新

アイコンを更新する場合：

1. `public/icon.png`を新しい画像に置き換え（512×512推奨）
2. `npm run gen:favicon`を実行
3. 自動的に`favicon.ico`生成＆バージョン更新

## ⚠️ 注意事項

### データ保存について
- **サーバー保存なし**: 全データはURLハッシュにエンコード
- **機密情報注意**: URLに全情報が含まれるため、共有時は注意
- **URL長制限**: 大量の明細行がある場合、URL長制限に注意

### 印刷/PDF出力
- A4サイズ最適化済み
- Chrome/Edge推奨（印刷プレビューが正確）
- 印刷時は自動的にナビゲーション等が非表示

### ブラウザ対応
- モダンブラウザ推奨（Chrome, Edge, Firefox, Safari最新版）
- IE11非対応

### 発注書の特殊機能
- 納期条件（明細ごと/日付指定/期間指定）
- 検収条件（7日/10日/30日/検収なし/マイルストーン）
- 支払条件（月末締め翌月末/納品後○日/前払い等）

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# 依存関係をクリーンインストール
rm -rf node_modules package-lock.json
npm install
```

### favicon表示されない

```bash
# faviconを再生成
npm run gen:favicon

# ブラウザキャッシュクリア
# Chrome: Cmd+Shift+R (Mac) / Ctrl+F5 (Windows)
```

### 印刷レイアウト崩れ

- ブラウザの印刷設定で「背景のグラフィック」を有効化
- 余白設定を「デフォルト」または「なし」に
- 用紙サイズをA4に設定

## 📄 ライセンス

© 2024 ココロAI合同会社

## 👥 コントリビューター

- 開発・運営: ココロAI合同会社
- お問い合わせ: hello@cocoroai.co.jp

---

**開発時の参考リンク**
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Dashboard](https://vercel.com/dashboard)