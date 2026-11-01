import puppeteer from 'puppeteer';

async function testHTTP() {
  console.log('Testing HTTP on localhost:5173...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });

  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:5173', ['camera']);

  const logs = [];
  page.on('console', msg => console.log(`[Browser ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[Browser PageError] ${err}`));

  await page.goto('http://localhost:5173/examples/image-tracking/example1.html', {
    waitUntil: 'networkidle2',
    timeout: 15000
  });

  await new Promise(r => setTimeout(r, 4000));

  const status = await page.evaluate(() => {
    const isSec = window.isSecureContext;
    const video = document.querySelector('video');
    const scene = document.querySelector('a-scene');
    return {
      isSecureContext: isSec,
      sceneLoaded: scene ? scene.hasLoaded : false,
      videoStreaming: video ? (!video.paused && video.readyState > 2) : false,
      videoDims: video ? `${video.videoWidth}x${video.videoHeight}` : null
    };
  });

  console.log('Verification Status on HTTP:', JSON.stringify(status, null, 2));
  await browser.close();
}

testHTTP().catch(console.error);
