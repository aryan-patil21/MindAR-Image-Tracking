import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test_screenshots');

async function testContinuousTracking() {
  console.log('--- Testing Continuous Tracking & Movement ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://localhost:5173', ['camera']);

  await page.evaluateOnNewDocument(() => {
    navigator.mediaDevices.getUserMedia = async function() {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = '/examples/image-tracking/assets/card-example/card.png';
      await new Promise(r => { img.onload = r; });

      let t = 0;
      function render() {
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move the card back and forth smoothly
        const offsetX = Math.sin(t * 0.05) * 60;
        const offsetY = Math.cos(t * 0.05) * 30;
        const scale = 0.65;

        ctx.save();
        ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        t++;
        requestAnimationFrame(render);
      }
      render();
      return canvas.captureStream(30);
    };
  });

  await page.goto('https://localhost:5173/examples/image-tracking/example1.html', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Track coordinates over 5 seconds
  const poses = [];
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    const pose = await page.evaluate(() => {
      const target = document.querySelector('[mindar-image-target]');
      if (!target) return null;
      const pos = target.object3D.position;
      const rot = target.object3D.rotation;
      const visible = target.getAttribute('visible');
      return {
        x: pos.x.toFixed(3),
        y: pos.y.toFixed(3),
        z: pos.z.toFixed(3),
        visible
      };
    });
    if (pose) poses.push(pose);
  }

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_continuous_tracking_motion.png') });
  console.log('Captured 04_continuous_tracking_motion.png');
  console.log('Recorded Poses during movement:', JSON.stringify(poses, null, 2));

  await browser.close();
}

testContinuousTracking().catch(console.error);
