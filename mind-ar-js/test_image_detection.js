import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('test_screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runDetectionTest() {
  console.log('--- Starting MindAR End-to-End Image Detection Test ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--ignore-certificate-errors',
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

  // Inject target image into getUserMedia before page scripts execute
  await page.evaluateOnNewDocument(() => {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = async function(constraints) {
      console.log('[MockMedia] Intercepted getUserMedia constraints:', JSON.stringify(constraints));
      
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = '/examples/image-tracking/assets/card-example/card.png';
      
      await new Promise(resolve => {
        img.onload = resolve;
      });

      // Animate subtle movement to simulate realistic handheld camera
      let angle = 0;
      function drawFrame() {
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw card in center of frame with slight perspective/motion
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        const scale = 0.7 + 0.02 * Math.sin(angle);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        angle += 0.05;
        requestAnimationFrame(drawFrame);
      }
      drawFrame();

      const stream = canvas.captureStream(30);
      return stream;
    };
  });

  console.log('Navigating to https://localhost:5173/examples/image-tracking/example1.html...');
  await page.goto('https://localhost:5173/examples/image-tracking/example1.html', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Listening for targetFound event on target entity...');
  
  // Set up listener for targetFound / targetLost
  await page.evaluate(() => {
    window.arEvents = [];
    const targetEntity = document.querySelector('[mindar-image-target]');
    if (targetEntity) {
      targetEntity.addEventListener('targetFound', () => {
        console.log('[AREvent] >>> TARGET FOUND! <<<');
        window.arEvents.push('targetFound');
      });
      targetEntity.addEventListener('targetLost', () => {
        console.log('[AREvent] >>> TARGET LOST! <<<');
        window.arEvents.push('targetLost');
      });
    }
  });

  // Wait up to 15 seconds for target to be recognized
  let detected = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await page.evaluate(() => {
      const targetEntity = document.querySelector('[mindar-image-target]');
      const events = window.arEvents || [];
      const visible = targetEntity ? targetEntity.getAttribute('visible') : false;
      const model = document.querySelector('a-gltf-model');
      return {
        events,
        visible,
        hasModel: !!model
      };
    });

    if (status.events.includes('targetFound')) {
      detected = true;
      console.log(`Target recognized successfully at interval ${i} (${(i * 0.5).toFixed(1)}s)!`);
      console.log('Target status:', JSON.stringify(status));
      break;
    }
  }

  // Wait 1 second for 3D model to settle
  await new Promise(r => setTimeout(r, 1000));
  
  // Capture AR tracking screenshot with 3D object rendered
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_target_detected_ar_rendering.png') });
  console.log('Captured 03_target_detected_ar_rendering.png');

  // Also capture close up of AR entity
  const finalCheck = await page.evaluate(() => {
    const targetEntity = document.querySelector('[mindar-image-target]');
    const model = document.querySelector('a-gltf-model');
    const plane = document.querySelector('a-plane');
    return {
      targetVisible: targetEntity ? targetEntity.getAttribute('visible') : null,
      targetMatrix: targetEntity ? targetEntity.object3D.matrix.elements.slice(0, 8) : null,
      modelLoaded: model ? !!model.getObject3D('mesh') : false,
      planeLoaded: !!plane,
      allEvents: window.arEvents
    };
  });

  console.log('Final Verification Results:', JSON.stringify(finalCheck, null, 2));

  await browser.close();
  console.log('--- End-to-End Image Detection Test Finished ---');
}

runDetectionTest().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
