# 引き継ぎ事項（Claude向け）

最終更新: 2025-09-01

## 🎯 プロジェクト概要
- **プロジェクト名**: かんたん帳票
- **本番URL**: https://chouhyo.cocoroai.co.jp/
- **目的**: ブラウザだけで帳票（見積書/発注書/請求書/領収書）を作成・PDF出力

## 📌 現在の状態

### ✅ 完了済みタスク
1. **基本機能実装済み**
   - 4種類の帳票作成機能（見積書→発注書→請求書→領収書）
   - URLハッシュによるデータ保存（サーバー保存なし）
   - 印刷/PDF出力（A4最適化）
   - インボイス対応（適格請求書発行事業者登録番号、税率別集計）

2. **UI/UX改善済み**
   - 入力しながらリアルタイムプレビュー
   - 明細行の自動伸縮（長いテキスト対応）
   - 単位選択ドロップダウン（14種類）
   - 支払条件プリセット
   - 領収書の但し書き自動生成

3. **発注書特殊機能**
   - 納期条件（明細ごと/日付指定/期間指定）
   - 検収条件（7日/10日/30日/検収なし/マイルストーン）
   - 支払条件（サイト30/60、前払い、納品後等）

4. **技術的改善**
   - ESLint/TypeScript厳格モード有効
   - ビルドエラー解消済み
   - favicon自動生成スクリプト（`npm run gen:favicon`）
   - 現在のアイコンバージョン: v=9

### 🌿 現在のブランチ状況
- **main**: 本番環境（安定版）
- **chore/re-enable-lint-and-types**: Lint/型チェック再有効化（PR作成済み）
- **fix/real-favicon-ico-v7**: favicon修正（マージ待ち）

## 🚧 今後の予定タスク

### 1. 広告実装（予定）
- **想定位置候補**:
  - ヘッダー右側（ナビゲーション横）
  - フッター上部
  - プレビューパネル下部
  - 印刷時は`no-print`クラスで非表示化

- **実装時の注意点**:
  ```tsx
  // 広告コンポーネント例
  <div className="ad-container no-print">
    {/* Google AdSense or other ad code */}
  </div>
  ```

- **globals.cssに既存の印刷対応**:
  ```css
  @media print {
    .no-print {
      display: none !important;
    }
  }
  ```

### 2. 機能追加候補
- [ ] データのローカルストレージ保存オプション
- [ ] テンプレート機能
- [ ] 複数言語対応（英語版）
- [ ] 見積書→請求書の自動変換
- [ ] CSVエクスポート/インポート

## 🔧 開発環境セットアップ

```bash
# リポジトリクローン
git clone https://github.com/mapcocoro/kantan-chouhyo.git
cd kantan-chouhyo

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルドテスト
npm run build
```

## 📝 重要ファイル解説

### コア機能
- `/app/app/page.tsx`: メイン画面（フォーム＋プレビュー）
- `/app/lib/types.ts`: 全体の型定義
- `/app/lib/calc.ts`: 税計算ロジック

### フォームコンポーネント
- `/app/components/form/ItemsTable.tsx`: 明細入力テーブル（CSS Grid実装）
- `/app/components/form/PurchaseOrderTermsFields.tsx`: 発注書専用条件

### プレビューコンポーネント
- `/app/components/preview/*Preview.tsx`: 各帳票のプレビュー画面

### スタイル
- `/app/globals.css`: 印刷用CSS含む全体スタイル
- Tailwind設定: `tailwind.config.ts`

## ⚠️ 既知の問題と対処法

### 1. favicon問題
- 複数のPR/ブランチで対応中
- 最終的に`public/favicon.ico`（32×32、本物のICO形式）で解決
- キャッシュバスター（?v=9）でブラウザキャッシュ対策

### 2. 印刷レイアウト
- Chrome/Edge推奨
- 背景グラフィック有効化必要
- A4サイズ、余白デフォルト推奨

### 3. URL長制限
- 明細100行超えると問題発生可能性
- 将来的にはlz-string等で圧縮検討

## 🔑 アクセス情報
- **GitHub**: https://github.com/mapcocoro/kantan-chouhyo
- **Vercel Dashboard**: Vercelプロジェクト設定から確認
- **ドメイン**: chouhyo.cocoroai.co.jp（ココロAI合同会社管理）

## 📞 連絡先
- **開発元**: ココロAI合同会社
- **メール**: hello@cocoroai.co.jp

## 💡 Claude向けアドバイス

### 作業再開時のチェックリスト
1. `git status`で現在のブランチ確認
2. `npm run dev`で開発サーバー起動
3. `npm run build`でビルドエラーないか確認
4. 未マージのPR確認

### コード変更時の注意
- 必ず`npm run lint`実行
- TypeScriptの`any`型使用禁止
- 印刷時のレイアウト崩れに注意（`no-print`クラス活用）
- URLハッシュエンコード部分は慎重に扱う

### よく使うコマンド
```bash
# favicon更新（自動でバージョンも更新）
npm run gen:favicon

# 新しいブランチ作成
git checkout -b feature/新機能名

# PR作成前の確認
npm run build && npm run lint
```

---

**このファイルは今後のClaude作業再開時の参考資料です。**
**プロジェクトの全体像を素早く把握し、スムーズに作業を継続できるよう作成しました。**