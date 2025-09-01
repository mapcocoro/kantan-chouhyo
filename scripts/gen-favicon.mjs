#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateFavicon() {
  try {
    const sourcePath = path.join(projectRoot, 'public', 'icon.png');
    const outputPath = path.join(projectRoot, 'public', 'favicon.ico');
    
    // Generate 32x32 optimized ICO
    const iconBuffer = await sharp(sourcePath)
      .resize(32, 32, { 
        kernel: sharp.kernel.lanczos3,
        fit: 'cover'
      })
      .png({ 
        compressionLevel: 9,
        quality: 95,
        palette: true,
        colors: 256
      })
      .toBuffer();
    
    fs.writeFileSync(outputPath, iconBuffer);
    
    const stats = fs.statSync(outputPath);
    console.log(`✅ favicon.ico generated (${stats.size} bytes)`);
    
    // Auto-increment version in layout.tsx
    await updateIconVersion();
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

async function updateIconVersion() {
  try {
    const layoutPath = path.join(projectRoot, 'app', 'layout.tsx');
    let content = fs.readFileSync(layoutPath, 'utf-8');
    
    // Find current version number
    const versionMatch = content.match(/favicon\.ico\?v=(\d+)/);
    if (versionMatch) {
      const currentVersion = parseInt(versionMatch[1]);
      const newVersion = currentVersion + 1;
      
      // Replace all icon versions
      content = content.replace(/\/favicon\.ico\?v=\d+/g, `/favicon.ico?v=${newVersion}`);
      content = content.replace(/\/icon\.png\?v=\d+/g, `/icon.png?v=${newVersion}`);
      content = content.replace(/\/apple-icon\.png\?v=\d+/g, `/apple-icon.png?v=${newVersion}`);
      
      fs.writeFileSync(layoutPath, content);
      console.log(`✅ Icon versions updated to v=${newVersion}`);
    } else {
      console.warn('⚠️  Could not find version number in layout.tsx');
    }
  } catch (error) {
    console.error('❌ Error updating icon version:', error);
  }
}

generateFavicon();