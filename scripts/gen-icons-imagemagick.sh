#!/bin/bash

# ImageMagick を使ったアイコン生成スクリプト（macOS 想定）
# 使用方法: chmod +x scripts/gen-icons-imagemagick.sh && ./scripts/gen-icons-imagemagick.sh

INPUT="icon.png"
OUTPUT_DIR="public"

echo "🚀 かんたん帳票 アイコン生成スタート (ImageMagick版)"

# 入力ファイルのチェック
if [ ! -f "$INPUT" ]; then
    echo "❌ $INPUT が見つかりません"
    exit 1
fi

# 出力ディレクトリの作成
mkdir -p "$OUTPUT_DIR"

# 背景色付きで余白を追加する関数
add_padding() {
    local size=$1
    local output=$2
    local padding=$((size * 13 / 100))  # 13% padding
    local icon_size=$((size - padding * 2))
    
    magick "$INPUT" \
        -resize "${icon_size}x${icon_size}" \
        -background white \
        -gravity center \
        -extent "${size}x${size}" \
        "$output"
}

# 単純リサイズ（パディングなし）
simple_resize() {
    local size=$1
    local output=$2
    
    magick "$INPUT" \
        -resize "${size}x${size}" \
        -background white \
        -gravity center \
        -extent "${size}x${size}" \
        "$output"
}

echo "📱 ファビコン生成中..."
# ファビコン
simple_resize 16 "$OUTPUT_DIR/favicon-16x16.png"
simple_resize 32 "$OUTPUT_DIR/favicon-32x32.png"
simple_resize 32 "$OUTPUT_DIR/favicon.ico"

echo "🍎 Apple Touch Icon 生成中..."
# Apple Touch Icon (パディング付き)
add_padding 180 "$OUTPUT_DIR/apple-touch-icon.png"

echo "🤖 Android Chrome Icons 生成中..."
# Android Chrome Icons (パディング付き)
add_padding 192 "$OUTPUT_DIR/android-chrome-192x192.png"
add_padding 512 "$OUTPUT_DIR/android-chrome-512x512.png"

echo "🔤 ロゴマーク生成中..."
# ロゴマーク (パディング付き)
add_padding 128 "$OUTPUT_DIR/logo-mark.png"
add_padding 256 "$OUTPUT_DIR/logo-mark@2x.png"

echo "📊 OG画像生成中..."
# OG画像 (1200x630)
magick -size 1200x630 xc:"#f8fafc" \
    \( "$INPUT" -resize 200x200 \) -geometry +100+215 -composite \
    -font Arial -pointsize 72 -fill "#1e293b" -weight bold \
        -annotate +350+200 "かんたん帳票" \
    -font Arial -pointsize 36 -fill "#64748b" -weight normal \
        -annotate +350+280 "ブラウザだけで、見積→請求→PDF。" \
    -font Arial -pointsize 24 -fill "#0ea5e9" \
        -annotate +350+450 "ココロＡＩ合同会社" \
    "$OUTPUT_DIR/og.png"

echo "✅ 全てのアイコンが生成されました！"
echo "📁 生成先: $OUTPUT_DIR/"

# ファイルサイズ表示
echo "📋 生成ファイル一覧:"
for file in favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png android-chrome-192x192.png android-chrome-512x512.png logo-mark.png logo-mark@2x.png og.png; do
    if [ -f "$OUTPUT_DIR/$file" ]; then
        size=$(ls -lh "$OUTPUT_DIR/$file" | awk '{print $5}')
        echo "  ✓ $file ($size)"
    fi
done