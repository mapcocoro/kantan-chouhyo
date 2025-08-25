#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'icon.png';
const OUTPUT_DIR = 'public';
const PADDING_RATIO = 0.13; // 13% padding for safe area

// 背景色設定
const BACKGROUND_WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const BACKGROUND_BRAND = { r: 14, g: 165, b: 233, alpha: 1 }; // #0ea5e9

console.log('🚀 かんたん帳票 アイコン生成スタート');

// 入力ファイルの確認
if (!fs.existsSync(INPUT_FILE)) {
  console.error(`❌ ${INPUT_FILE} が見つかりません`);
  process.exit(1);
}

// 出力ディレクトリの確認・作成
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * パディング付きアイコンを生成
 */
async function createPaddedIcon(size, background = BACKGROUND_WHITE) {
  const paddingSize = Math.floor(size * PADDING_RATIO);
  const iconSize = size - (paddingSize * 2);
  
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background
    }
  })
  .composite([
    {
      input: await sharp(INPUT_FILE)
        .resize(iconSize, iconSize, { fit: 'contain', background })
        .png()
        .toBuffer(),
      left: paddingSize,
      top: paddingSize,
    }
  ]);
}

/**
 * フィットアイコンを生成（パディングなし）
 */
async function createFitIcon(size, background = BACKGROUND_WHITE) {
  return sharp(INPUT_FILE)
    .resize(size, size, { fit: 'contain', background });
}

async function generateIcons() {
  try {
    console.log('📱 ファビコン生成中...');
    
    // PNGファビコン
    await (await createFitIcon(16, BACKGROUND_WHITE)).png().toFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'));
    await (await createFitIcon(32, BACKGROUND_WHITE)).png().toFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'));
    
    console.log('🍎 Apple Touch Icon 生成中...');
    // apple-touch-icon.png (180x180, パディング付き)
    await (await createPaddedIcon(180, BACKGROUND_WHITE))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
    
    console.log('🤖 Android Chrome Icons 生成中...');
    // android-chrome-192x192.png (パディング付き)
    await (await createPaddedIcon(192, BACKGROUND_WHITE))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'android-chrome-192x192.png'));
    
    // android-chrome-512x512.png (パディング付き、maskable対応)
    await (await createPaddedIcon(512, BACKGROUND_WHITE))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'android-chrome-512x512.png'));
    
    console.log('🔤 ロゴマーク生成中...');
    // logo-mark.png (128x128, ヘッダー用)
    await (await createPaddedIcon(128, BACKGROUND_WHITE))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'logo-mark.png'));
    
    // logo-mark@2x.png (256x256, Retina用)
    await (await createPaddedIcon(256, BACKGROUND_WHITE))
      .png()
      .toFile(path.join(OUTPUT_DIR, 'logo-mark@2x.png'));
    
    console.log('📊 OG画像生成中...');
    // og.png (1200x630, OpenGraph用) - カスタム画像を使用
    const customOgPath = 'og-sample.png';
    
    if (fs.existsSync(customOgPath)) {
      console.log('  カスタムOG画像を使用: og-sample.png');
      // カスタム画像をそのまま使用（1200x630pxでリサイズ）
      await sharp(customOgPath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .png()
        .toFile(path.join(OUTPUT_DIR, 'og.png'));
    } else {
      console.log('  デフォルトOG画像を生成中...');
      // カスタム画像がない場合は従来通り自動生成
      const ogImage = sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 4,
          background: { r: 248, g: 250, b: 252, alpha: 1 }
        }
      })
      .composite([
        {
          input: await sharp(INPUT_FILE)
            .resize(200, 200, { fit: 'contain' })
            .png()
            .toBuffer(),
          left: 100,
          top: 215,
        },
        {
          input: Buffer.from(`
            <svg width="800" height="630">
              <text x="50" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#1e293b">かんたん帳票</text>
              <text x="50" y="280" font-family="Arial, sans-serif" font-size="36" fill="#64748b">ブラウザだけで、見積→請求→PDF。</text>
              <text x="50" y="450" font-family="Arial, sans-serif" font-size="24" fill="#0ea5e9">ココロＡＩ合同会社</text>
            </svg>
          `),
          left: 350,
          top: 0,
        }
      ]);
      
      await ogImage.png().toFile(path.join(OUTPUT_DIR, 'og.png'));
    }
    
    // .ico ファイル生成 (Node.jsでは複雑なため、代替として32pxのPNGをico拡張子で保存)
    await (await createFitIcon(32, BACKGROUND_WHITE)).png().toFile(path.join(OUTPUT_DIR, 'favicon.ico'));
    
    console.log('✅ 全てのアイコンが生成されました！');
    console.log(`📁 生成先: ${OUTPUT_DIR}/`);
    
    // 生成されたファイル一覧
    const generatedFiles = [
      'favicon.ico',
      'favicon-16x16.png',
      'favicon-32x32.png', 
      'apple-touch-icon.png',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'logo-mark.png',
      'logo-mark@2x.png',
      'og.png'
    ];
    
    console.log('📋 生成ファイル一覧:');
    generatedFiles.forEach(file => {
      if (fs.existsSync(path.join(OUTPUT_DIR, file))) {
        const stats = fs.statSync(path.join(OUTPUT_DIR, file));
        console.log(`  ✓ ${file} (${(stats.size / 1024).toFixed(1)}KB)`);
      }
    });
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

generateIcons();