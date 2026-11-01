import puppeteer from 'puppeteer';

async function testOrientation() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:5173', ['camera']);

  await page.evaluateOnNewDocument(() => {
    navigator.mediaDevices.getUserMedia = async function() {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = '/examples/image-tracking/assets/band-example/raccoon.png';
      await new Promise(r => { img.onload = r; });

      function draw() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = 0.28;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        requestAnimationFrame(draw);
      }
      draw();
      return canvas.captureStream(30);
    };
  });

  await page.goto('http://localhost:5173/examples/image-tracking/example1.html', {
    waitUntil: 'networkidle2'
  });

  console.log('Waiting for targetFound...');
  await page.waitForFunction(() => {
    const el = document.querySelectorAll('[mindar-image-target]')[1];
    return el && el.getAttribute('visible') === true;
  }, { timeout: 15000 });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'test_screenshots/orientation_check.png' });
  console.log('Captured verified orientation_check.png');

  await browser.close();
}

testOrientation().catch(console.error);
