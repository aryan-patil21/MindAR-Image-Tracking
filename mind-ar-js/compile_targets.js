import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function compileThreeTargets() {
  console.log('--- Compiling 3 Different Target Images into multi_targets.mind ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Navigate to compile.html
  await page.goto('http://localhost:5173/examples/image-tracking/compile.html', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Page loaded. Starting compilation of card.png, raccoon.png, and bear.png...');

  const mindBufferBase64 = await page.evaluate(async () => {
    const { Compiler } = await import('/src/image-target/compiler.js');
    const compiler = new Compiler();

    const imageUrls = [
      '/examples/image-tracking/assets/card-example/card.png',
      '/examples/image-tracking/assets/band-example/raccoon.png',
      '/examples/image-tracking/assets/band-example/bear.png'
    ];

    const loadImg = (url) => new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const images = await Promise.all(imageUrls.map(loadImg));
    console.log('Loaded images for compilation:', images.length);

    await compiler.compileImageTargets(images, (progress) => {
      console.log('Compilation progress:', progress.toFixed(1) + '%');
    });

    const buffer = compiler.exportData();
    // Convert Uint8Array to base64
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  });

  const buffer = Buffer.from(mindBufferBase64, 'base64');
  const outPath = path.resolve('examples/image-tracking/assets/multi_targets.mind');
  fs.writeFileSync(outPath, buffer);
  console.log(`Successfully compiled and saved multi_targets.mind (${buffer.length} bytes) to ${outPath}!`);

  await browser.close();
}

compileThreeTargets().catch(err => {
  console.error('Compilation failed:', err);
  process.exit(1);
});
