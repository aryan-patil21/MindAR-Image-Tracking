import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const DIAGRAM_DIR = path.resolve('report_assets');
if (!fs.existsSync(DIAGRAM_DIR)) {
  fs.mkdirSync(DIAGRAM_DIR, { recursive: true });
}

async function renderDiagrams() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });

  // 1. Architecture Diagram HTML
  const archHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; }
      .container { width: 1000px; margin: 0 auto; border: 1px solid #d0d7de; border-radius: 12px; padding: 30px; box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1); }
      h2 { text-align: center; color: #1f2328; margin-top: 0; font-size: 24px; }
      .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 30px; position: relative; }
      .layer { border: 2px solid #0969da; border-radius: 10px; padding: 18px; background: #f6f8fa; text-align: center; }
      .layer-title { font-weight: 700; color: #0969da; font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #d0d7de; padding-bottom: 6px; }
      .item { background: #ffffff; border: 1px solid #d0d7de; border-radius: 6px; padding: 10px 8px; margin: 8px 0; font-size: 13px; color: #24292f; font-weight: 500; }
      .flow-arrow { display: flex; align-items: center; justify-content: center; font-size: 28px; color: #57609a; font-weight: bold; }
      .subtext { font-size: 11px; color: #57606a; margin-top: 4px; font-weight: normal; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>MindAR WebAR System Architecture</h2>
      <div class="grid">
        <div class="layer">
          <div class="layer-title">1. Input Layer</div>
          <div class="item"><strong>Hardware Camera</strong><div class="subtext">MacBook / iPhone WebCam</div></div>
          <div class="item"><strong>MediaDevices API</strong><div class="subtext">getUserMedia() stream</div></div>
          <div class="item"><strong>Video Element</strong><div class="subtext">HTML5 &lt;video&gt; capture</div></div>
        </div>

        <div class="layer">
          <div class="layer-title">2. MindAR Vision Core</div>
          <div class="item"><strong>Pre-compiled Target</strong><div class="subtext">card.mind (FREAK features)</div></div>
          <div class="item"><strong>Web Worker</strong><div class="subtext">controller.worker.js (Multithreaded)</div></div>
          <div class="item"><strong>Detector & Tracker</strong><div class="subtext">DoG + Homography Estimation</div></div>
          <div class="item"><strong>OneEuroFilter</strong><div class="subtext">Temporal Jitter Smoothing</div></div>
        </div>

        <div class="layer">
          <div class="layer-title">3. 3D & AR Bridge</div>
          <div class="item"><strong>A-Frame System</strong><div class="subtext">mindar-image-system</div></div>
          <div class="item"><strong>Target Entity</strong><div class="subtext">mindar-image-target (Index 0)</div></div>
          <div class="item"><strong>Pose Matrix</strong><div class="subtext">4x4 Matrix Transformation</div></div>
        </div>

        <div class="layer">
          <div class="layer-title">4. Presentation Layer</div>
          <div class="item"><strong>3D GLTF Model</strong><div class="subtext">Softmind Animated Avatar</div></div>
          <div class="item"><strong>2D Target Plane</strong><div class="subtext">Bounding Alignment plane</div></div>
          <div class="item"><strong>WebGL Canvas</strong><div class="subtext">Three.js / A-Frame Renderer</div></div>
          <div class="item"><strong>UI Overlay</strong><div class="subtext">Scanning / Loading HUD</div></div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(archHtml);
  const container1 = await page.$('.container');
  await container1.screenshot({ path: path.join(DIAGRAM_DIR, 'system_architecture.png') });
  console.log('Generated system_architecture.png');

  // 2. Methodology & Workflow Diagram
  const workflowHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; }
      .container { width: 1000px; margin: 0 auto; border: 1px solid #d0d7de; border-radius: 12px; padding: 30px; box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1); }
      h2 { text-align: center; color: #1f2328; margin-top: 0; font-size: 24px; }
      .steps { display: flex; flex-direction: column; gap: 14px; margin-top: 25px; }
      .step-row { display: flex; align-items: center; gap: 20px; }
      .step-badge { width: 44px; height: 44px; border-radius: 50%; background: #0969da; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; flex-shrink: 0; }
      .step-content { flex: 1; border: 1px solid #d0d7de; background: #f6f8fa; border-radius: 8px; padding: 14px 20px; }
      .step-title { font-weight: 700; color: #1f2328; font-size: 15px; margin-bottom: 4px; }
      .step-desc { font-size: 13px; color: #57606a; margin: 0; }
      .arrow-down { text-align: center; color: #0969da; font-size: 20px; line-height: 10px; margin-left: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>MindAR Execution & Tracking Lifecycle Workflow</h2>
      <div class="steps">
        <div class="step-row">
          <div class="step-badge">1</div>
          <div class="step-content">
            <div class="step-title">Initialization & Asset Preloading</div>
            <div class="step-desc">A-Frame scene mounts, loads pre-compiled <code>card.mind</code> feature descriptors, card texture, and <code>softmind/scene.gltf</code> 3D mesh into memory.</div>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge">2</div>
          <div class="step-content">
            <div class="step-title">Hardware Camera Acquisition</div>
            <div class="step-desc">Browser requests camera permission via <code>navigator.mediaDevices.getUserMedia()</code>. Video stream streams to background canvas at 30-60 FPS.</div>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge">3</div>
          <div class="step-content">
            <div class="step-title">Real-Time Feature Detection (Crop Detector)</div>
            <div class="step-desc">Web Worker extracts feature keypoints and generates Fast Retina Keypoint (FREAK) descriptors from camera frames, running multi-scale matching.</div>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge">4</div>
          <div class="step-content">
            <div class="step-title">Target Match & Homography Estimation</div>
            <div class="step-desc">Upon matching feature points with <code>card.mind</code>, homography decomposition calculates the 6-DoF 3D spatial pose matrix and triggers <code>targetFound</code>.</div>
          </div>
        </div>

        <div class="step-row">
          <div class="step-badge">5</div>
          <div class="step-content">
            <div class="step-title">3D Overlay Rendering & Motion Smoothing</div>
            <div class="step-desc">OneEuroFilter filters jitter. Three.js/A-Frame transforms the animated 3D softmind avatar over the card in real-time until target is out of view.</div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(workflowHtml);
  const container2 = await page.$('.container');
  await container2.screenshot({ path: path.join(DIAGRAM_DIR, 'workflow_diagram.png') });
  console.log('Generated workflow_diagram.png');

  await browser.close();
}

renderDiagrams().catch(console.error);
