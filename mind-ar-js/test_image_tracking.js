import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTest() {
  console.log('--- Starting MindAR Image Tracking Automated Test ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--ignore-certificate-errors',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Grant camera permission
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://localhost:5173', ['camera']);

  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[Browser PageError] ${err.toString()}`);
  });

  page.on('requestfailed', req => {
    console.error(`[Browser ReqFailed] ${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
  });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.error(`[Browser HTTP ${res.status()}] ${res.url()}`);
    }
  });

  console.log('Navigating to https://localhost:5173/examples/image-tracking/example1.html...');
  await page.goto('https://localhost:5173/examples/image-tracking/example1.html', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_page_loaded.png') });
  console.log('Captured 01_page_loaded.png');

  // Wait 5 seconds to observe
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_camera_scanning.png') });
  console.log('Captured 02_camera_scanning.png');

  const domStatus = await page.evaluate(() => {
    const scene = document.querySelector('a-scene');
    const video = document.querySelector('video');
    const scanningUI = document.querySelector('.mindar-ui-scanning');
    const loadingUI = document.querySelector('.mindar-ui-loading');
    const arSystem = scene ? scene.systems['mindar-image-system'] : null;

    return {
      sceneExists: !!scene,
      sceneLoaded: scene ? scene.hasLoaded : false,
      arSystemExists: !!arSystem,
      videoExists: !!video,
      videoSrc: video ? (video.src || video.srcObject ? 'stream-active' : 'no-source') : null,
      videoPlaying: video ? (!video.paused && !video.ended && video.readyState > 2) : false,
      videoDims: video ? `${video.videoWidth}x${video.videoHeight}` : null,
      scanningVisible: scanningUI ? !scanningUI.classList.contains('hidden') : false,
      loadingVisible: loadingUI ? !loadingUI.classList.contains('hidden') : false
    };
  });

  console.log('DOM & AR Status:', JSON.stringify(domStatus, null, 2));

  await browser.close();
  console.log('--- Test Run Complete ---');
}

runTest().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
