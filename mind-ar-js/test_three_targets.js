import puppeteer from 'puppeteer';

async function testThreeTargets() {
  console.log('--- Testing 3-Target Image AR Pipeline ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:5173', ['camera']);

  page.on('console', msg => console.log(`[Browser ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.error(`[Browser PageError] ${err}`));

  // Mock getUserMedia with target 1 (raccoon.png)
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
        ctx.fillStyle = '#222';
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
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Track targetFound for all 3 entities
  await page.evaluate(() => {
    window.foundTargets = [];
    document.querySelectorAll('[mindar-image-target]').forEach((el) => {
      const idx = el.getAttribute('mindar-image-target');
      el.addEventListener('targetFound', () => {
        console.log(`>>> TARGET FOUND for ${idx} <<<`);
        window.foundTargets.push(idx);
      });
    });
  });

  console.log('Waiting for target recognition...');
  let detected = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    const found = await page.evaluate(() => window.foundTargets || []);
    if (found.length > 0) {
      detected = true;
      console.log('Detected targets:', found);
      break;
    }
  }

  const finalCheck = await page.evaluate(() => {
    const targets = Array.from(document.querySelectorAll('[mindar-image-target]')).map(el => ({
      targetAttr: el.getAttribute('mindar-image-target'),
      visible: el.getAttribute('visible'),
      hasChildMesh: !!el.querySelector('a-gltf-model')
    }));
    return {
      targets,
      foundTargets: window.foundTargets
    };
  });

  console.log('Verification Results:', JSON.stringify(finalCheck, null, 2));
  await browser.close();
}

testThreeTargets().catch(console.error);
