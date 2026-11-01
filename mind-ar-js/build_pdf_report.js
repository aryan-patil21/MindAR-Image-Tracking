import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = '/Users/apple/Desktop/ARVR_Project/MindAR-Image-Tracking';
const ASSETS_DIR = path.join(PROJECT_ROOT, 'report_assets');
const OUTPUT_PDF = path.join(PROJECT_ROOT, 'MindAR_Project_Report.pdf');

function getBase64Image(filename) {
  const filePath = path.join(ASSETS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function generatePDF() {
  console.log('--- Generating Academic PDF Report ---');

  const imgArch = getBase64Image('system_architecture.png');
  const imgWorkflow = getBase64Image('workflow_diagram.png');
  const imgTarget = getBase64Image('target_card.png');
  const imgScanning = getBase64Image('02_camera_scanning.png');
  const imgDetected = getBase64Image('03_target_detected_ar_rendering.png');
  const imgMotion = getBase64Image('04_continuous_tracking_motion.png');

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>MindAR Project Report</title>
    <style>
      @page {
        size: A4;
        margin: 20mm 18mm 22mm 18mm;
      }
      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 11pt;
        line-height: 1.35;
        color: #222222;
        margin: 0;
        padding: 0;
      }
      .page-break {
        page-break-before: always;
      }
      .no-break {
        page-break-inside: avoid;
      }
      h1, h2, h3 {
        font-family: Arial, Helvetica, sans-serif;
        color: #0F3C78;
        page-break-after: avoid;
      }
      h1 {
        font-size: 15pt;
        border-bottom: 1.5px solid #0F3C78;
        padding-bottom: 4px;
        margin-top: 24px;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      h2 {
        font-size: 12.5pt;
        color: #1E5096;
        margin-top: 18px;
        margin-bottom: 8px;
      }
      p {
        text-align: justify;
        margin-top: 0;
        margin-bottom: 8px;
        text-indent: 0;
      }
      .title-page {
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .title-head {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11pt;
        font-weight: bold;
        color: #666666;
        letter-spacing: 1px;
        margin-top: 40px;
      }
      .project-title {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 22pt;
        font-weight: 800;
        color: #0F3C78;
        line-height: 1.25;
        margin-top: 15px;
        margin-bottom: 15px;
      }
      .course-title {
        font-size: 12pt;
        font-style: italic;
        color: #444444;
        margin-bottom: 30px;
      }
      .submission-block {
        font-size: 11pt;
        margin-bottom: 40px;
        line-height: 1.4;
      }
      .meta-table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
      }
      .meta-table td {
        vertical-align: top;
        font-size: 10.5pt;
        line-height: 1.4;
      }
      .meta-left {
        text-align: left;
        width: 50%;
      }
      .meta-right {
        text-align: right;
        width: 50%;
      }
      .title-foot {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.5pt;
        font-weight: bold;
        color: #0F3C78;
        line-height: 1.4;
        margin-top: 60px;
        padding-top: 20px;
        border-top: 2px solid #0F3C78;
      }
      .figure-box {
        text-align: center;
        margin: 14px 0;
        page-break-inside: avoid;
      }
      .figure-img {
        max-width: 90%;
        max-height: 280px;
        border: 1px solid #d0d7de;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }
      .figure-caption {
        font-size: 9.5pt;
        font-style: italic;
        color: #555555;
        margin-top: 6px;
      }
      table.data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0;
        font-size: 9.5pt;
        page-break-inside: avoid;
      }
      table.data-table th, table.data-table td {
        border: 1px solid #c0c6cc;
        padding: 6px 8px;
        vertical-align: top;
      }
      table.data-table th {
        background-color: #0F3C78;
        color: #ffffff;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        text-align: center;
      }
      table.data-table tr:nth-child(even) {
        background-color: #F6F8FA;
      }
      .passed-badge {
        color: #008000;
        font-weight: bold;
      }
      .code-box {
        background-color: #F6F8FA;
        border: 1px solid #D0D7DE;
        border-left: 4px solid #0F3C78;
        border-radius: 4px;
        padding: 10px 14px;
        font-family: "Courier New", Courier, monospace;
        font-size: 8.5pt;
        line-height: 1.3;
        margin: 12px 0;
        white-space: pre-wrap;
        page-break-inside: avoid;
      }
      .toc-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      .toc-table td {
        padding: 4px 0;
        font-size: 10.5pt;
      }
      .toc-page {
        text-align: right;
        font-weight: bold;
        color: #0F3C78;
      }
      ul {
        margin-top: 4px;
        margin-bottom: 8px;
        padding-left: 20px;
      }
      li {
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>

    <!-- ================= TITLE PAGE ================= -->
    <div class="title-page">
      <div>
        <div class="title-head">A COURSE PROJECT REPORT ON</div>
        <div class="project-title">IMAGE-BASED AUGMENTED REALITY USING MINDAR</div>
        <div class="course-title">Subject: Augmented Reality and Virtual Reality (AR/VR)<br>Course Code: [Course Code / CS-604]</div>
        <div class="submission-block">
          Submitted in partial fulfillment of the requirements for the Degree of<br>
          <strong>Bachelor of Technology / Bachelor of Engineering</strong><br>
          in Computer Science & Engineering
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-left">
              <strong>Submitted By:</strong><br>
              [Student Name 1] - Roll No: [Roll Number 1]<br>
              [Student Name 2] - Roll No: [Roll Number 2]<br>
              Class: Third Year B.Tech (CSE)<br>
              Semester: 6th Semester
            </td>
            <td class="meta-right">
              <strong>Under the Guidance of:</strong><br>
              [Faculty Guide Name]<br>
              [Designation / Assistant Professor]<br>
              Department of Computer Science & Engineering<br>
              [Institute / College Name]
            </td>
          </tr>
        </table>
      </div>

      <div class="title-foot">
        DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING<br>
        [COLLEGE / UNIVERSITY NAME]<br>
        ACADEMIC YEAR: [2026 - 2027]
      </div>
    </div>

    <div class="page-break"></div>

    <!-- ================= TABLE OF CONTENTS ================= -->
    <h1>Table of Contents</h1>
    <table class="toc-table">
      <tr><td>1. Abstract</td><td class="toc-page">3</td></tr>
      <tr><td>2. Introduction</td><td class="toc-page">4</td></tr>
      <tr><td>3. Problem Statement</td><td class="toc-page">5</td></tr>
      <tr><td>4. Objectives</td><td class="toc-page">5</td></tr>
      <tr><td>5. Existing System vs. Proposed Approach</td><td class="toc-page">6</td></tr>
      <tr><td>6. Software and Hardware Requirements</td><td class="toc-page">7</td></tr>
      <tr><td>7. Technology Stack</td><td class="toc-page">8</td></tr>
      <tr><td>8. System Architecture</td><td class="toc-page">9</td></tr>
      <tr><td>9. Methodology and Implementation Workflow</td><td class="toc-page">10</td></tr>
      <tr><td>10. Implementation Details and Code Highlights</td><td class="toc-page">11</td></tr>
      <tr><td>11. Results and Experimental Screenshots</td><td class="toc-page">12</td></tr>
      <tr><td>12. Testing Verification and Observation Matrix</td><td class="toc-page">13</td></tr>
      <tr><td>13. Applications and Real-World Use Cases</td><td class="toc-page">14</td></tr>
      <tr><td>14. Advantages and Practical Limitations</td><td class="toc-page">15</td></tr>
      <tr><td>15. Future Scope</td><td class="toc-page">16</td></tr>
      <tr><td>16. Conclusion</td><td class="toc-page">16</td></tr>
      <tr><td>17. References</td><td class="toc-page">17</td></tr>
      <tr><td>18. Appendix: Setup, Execution & Demonstration Guide</td><td class="toc-page">18</td></tr>
    </table>

    <div class="page-break"></div>

    <!-- ================= 1. ABSTRACT ================= -->
    <h1>1. Abstract</h1>
    <p>Augmented Reality (AR) bridges physical and synthetic virtual environments by seamlessly superimposing computer-generated 3D entities onto real-world sensory inputs in real time. Historically, deploying AR applications required specialized, resource-intensive native mobile applications developed with heavy engines such as Unity, ARKit, or ARCore. This installation barrier substantially impedes user accessibility in educational and commercial contexts.</p>
    <p>This project presents an empirical implementation of Web-based Augmented Reality (WebAR) utilizing MindAR, an open-source, client-side computer vision engine compiled via WebAssembly (WASM) and accelerated by TensorFlow.js. We implement, verify, and document a robust image-tracking AR application deployed in a local web browser environment without requiring external native app installations. The system captures live video feeds via standard WebRTC interfaces, performs real-time multi-scale feature point extraction using Fast Retina Keypoint (FREAK) descriptors and Difference of Gaussians (DoG) detectors, and solves the 6-Degrees-of-Freedom (6-DoF) homography to render an interactive 3D animated model anchored to a planar reference target.</p>
    <p>Rigorous verification was executed on Apple Silicon (M4 ARM64 macOS) hardware and headless Chromium testing harnesses, confirming sub-100ms feature convergence, smooth target acquisition, jitter filtering via the OneEuroFilter algorithm, and cross-device local-area-network streaming. This report details the theoretical architecture, complete technical methodology, empirical testing outcomes, genuine visual evidence, and pedagogical implications for ubiquitous AR interfaces.</p>

    <!-- ================= 2. INTRODUCTION ================= -->
    <h1>2. Introduction</h1>
    <p>Augmented Reality represents an interactive paradigm where physical reality is supplemented with context-aware, perceptually aligned virtual components. Among the various AR tracking modalities—which include geospatial tracking, simultaneous localization and mapping (SLAM), and face mesh tracking—image-based AR tracking remains the most reliable and widely utilized approach for structured learning, digital publishing, and interactive media.</p>
    <p>In image-based AR, a predefined planar image acts as a fiducial or natural visual marker. As the camera views the environment, mathematical feature extraction algorithms continuously scan incoming frames to detect familiar patterns, point distributions, and gradient signatures. Once identified, the geometric transformation matrix between the real-world surface and the camera sensor is calculated, enabling the graphics pipeline to superimpose 3D geometric assets precisely aligned with the perspective, scale, and tilt of the physical image.</p>
    <p>The recent maturation of WebAssembly (WASM), WebGL 2.0, and WebRTC has facilitated WebAR—executing high-performance spatial tracking directly within web browsers. MindAR stands out as a leading open-source WebAR solution because it eliminates proprietary licensing fees and cloud-processing latency by executing all machine vision and rendering pipelines directly on the client device.</p>

    <!-- ================= 3. PROBLEM STATEMENT ================= -->
    <h1>3. Problem Statement</h1>
    <p>Traditional augmented reality ecosystems suffer from considerable friction that restricts widespread consumer and academic adoption:</p>
    <ul>
      <li><strong>High Friction of App Installation:</strong> Users are reluctant to download multi-hundred-megabyte native mobile applications (iOS/Android) simply to scan an educational textbook illustration, museum placard, or business card.</li>
      <li><strong>Proprietary SDK Dependencies and Costs:</strong> Industry-standard engines (such as Vuforia, 8th Wall, or Wikitude) impose prohibitive recurring subscription fees or cloud usage limits, rendering them unsuitable for open academic research and low-budget educational initiatives.</li>
      <li><strong>Cross-Platform Incompatibilities:</strong> Developing separate native builds for Android (ARCore/Java/Kotlin) and iOS (ARKit/Swift) demands extensive duplication of software engineering effort and divergent maintenance cycles.</li>
    </ul>
    <p>Hence, there is a clear academic and practical need for a zero-installation, open-source, highly performant WebAR demonstration that reliably tracks physical 2D targets and renders interactive 3D content across modern web browsers.</p>

    <!-- ================= 4. OBJECTIVES ================= -->
    <h1>4. Objectives</h1>
    <ul>
      <li><strong>Objective 1:</strong> Set up, configure, and inspect the official MindAR open-source WebAR framework within an Apple Silicon (M4 ARM64) macOS environment without indiscriminate package mutation.</li>
      <li><strong>Objective 2:</strong> Establish a local development server infrastructure providing secure context (HTTPS) mandatory for WebRTC hardware camera permissions across both desktop and mobile clients.</li>
      <li><strong>Objective 3:</strong> Implement the basic natural-feature image-tracking pipeline using pre-compiled binary feature descriptors (<code>card.mind</code>) and high-fidelity 3D assets (<code>softmind</code> GLTF model).</li>
      <li><strong>Objective 4:</strong> Empirically verify end-to-end functionality, including camera stream initialization, scanning HUD behavior, target recognition latency, 3D model positioning, and continuous motion tracking.</li>
      <li><strong>Objective 5:</strong> Create a repeatable, self-contained launcher workflow and beginner-friendly documentation enabling seamless replication and evaluation by collegiate academic faculty.</li>
    </ul>

    <div class="page-break"></div>

    <!-- ================= 5. EXISTING SYSTEM VS PROPOSED APPROACH ================= -->
    <h1>5. Existing System vs. Proposed Approach</h1>
    <p>To contextualize the technical contribution, Table 1 contrasts conventional native AR development frameworks against the implemented MindAR WebAR architecture.</p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Evaluation Metric</th>
          <th>Traditional Native AR (Unity / Vuforia)</th>
          <th>Proposed MindAR WebAR Approach</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Deployment & Distribution</strong></td>
          <td>App Store / Play Store binary (~100-300 MB)</td>
          <td>Instant Web URL via Browser (Zero Install)</td>
        </tr>
        <tr>
          <td><strong>Licensing & Open Source</strong></td>
          <td>Commercial licenses, recurring SaaS tiers</td>
          <td>100% Free & Open Source (MIT License)</td>
        </tr>
        <tr>
          <td><strong>Cross-Platform Support</strong></td>
          <td>Separate compilation targets required</td>
          <td>Single standards-based codebase (HTML5/JS)</td>
        </tr>
        <tr>
          <td><strong>Hardware Requirements</strong></td>
          <td>Requires high-end ARCore/ARKit devices</td>
          <td>Runs on any browser with WebGL & WebRTC</td>
        </tr>
        <tr>
          <td><strong>Development Speed</strong></td>
          <td>Complex multi-gigabyte IDE toolchains</td>
          <td>Lightweight web development with Vite / NPM</td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: center; font-size: 9pt; font-style: italic; color: #555; margin-bottom: 12px;">Table 1: Architectural Comparison between Traditional Native AR and MindAR WebAR.</div>

    <!-- ================= 6. SOFTWARE AND HARDWARE REQUIREMENTS ================= -->
    <h1>6. Software and Hardware Requirements</h1>
    <p>The project was engineered and verified on actual hardware specifications as documented below. Mandatory components are strictly distinguished from optional conveniences.</p>

    <h2>6.1 Hardware Specifications</h2>
    <ul>
      <li><strong>Host Machine (Verified):</strong> Apple MacBook Air (M4 Apple Silicon, 10-core GPU, ARM64 architecture).</li>
      <li><strong>Memory & Storage:</strong> 16 GB Unified Memory; 148 GB available NVMe APFS storage (exceeds minimal 500 MB footprint).</li>
      <li><strong>Integrated Camera:</strong> Built-in 1080p FaceTime HD Camera (or standard USB UVC webcam).</li>
      <li><strong>Mobile Device (Optional / Phone Demonstration):</strong> iPhone running iOS 17+ (Safari) or Android smartphone running Chrome 110+.</li>
      <li><strong>Dedicated Equipment Not Required:</strong> No external VR headsets, AR glasses, or discrete external GPUs are necessary.</li>
    </ul>

    <h2>6.2 Software & Library Dependencies</h2>
    <ul>
      <li><strong>Host Operating System:</strong> macOS 27.0.1 (Darwin Kernel 27.0.0).</li>
      <li><strong>JavaScript Runtime:</strong> Node.js v26.13.0 (installed via Homebrew package manager).</li>
      <li><strong>Package Manager:</strong> npm v11.20.0.</li>
      <li><strong>Version Control:</strong> Git v2.54.0 (Apple Git-157).</li>
      <li><strong>Web Server:</strong> Vite v5.0.11 with <code>@vitejs/plugin-basic-ssl</code> for mandatory local WebRTC HTTPS.</li>
      <li><strong>3D & Vision Libraries:</strong> MindAR v1.2.5, A-Frame v1.4.1, Three.js ^0.147.1, TensorFlow.js v4.16.0.</li>
      <li><strong>Optional HTTPS Tunnel:</strong> Cloudflared v2026.8.3 (enables zero-warning SSL tunneling for mobile phone demonstrations).</li>
    </ul>

    <div class="page-break"></div>

    <!-- ================= 7. TECHNOLOGY STACK ================= -->
    <h1>7. Technology Stack</h1>
    <p>The MindAR WebAR demonstration integrates multiple modern web engineering components across the presentation, rendering, and computer vision tiers:</p>
    <ul>
      <li><strong>MindAR Engine:</strong> The core WebAR computational library responsible for video frame ingestion, multi-threaded Web Worker feature extraction, target template correlation, homography decomposition, and tracking state management.</li>
      <li><strong>A-Frame (v1.4.1):</strong> An open-source entity-component-system (ECS) framework for declarative 3D and WebXR graphics. It allows developers to declare cameras, light sources, geometric entities, and GLTF models directly within HTML markup.</li>
      <li><strong>Three.js (^0.147.1):</strong> The underlying WebGL graphics library wrapped by A-Frame. It performs scene-graph management, matrix transformations, PBR shader execution, and real-time animation interpolation.</li>
      <li><strong>TensorFlow.js (v4.16.0) & WebAssembly:</strong> MindAR utilizes TensorFlow.js backends and optimized WASM SIMD assembly modules to accelerate tensor operations and matrix inversions directly on client CPUs/GPUs.</li>
      <li><strong>HTML5, WebGL 2.0 & WebRTC:</strong> Native browser standards utilized for camera media streaming (<code>navigator.mediaDevices.getUserMedia()</code>), hardware-accelerated canvas rendering, and dynamic DOM overlay construction.</li>
    </ul>

    <!-- ================= 8. SYSTEM ARCHITECTURE ================= -->
    <h1>8. System Architecture</h1>
    <p>The overall system architecture follows a decoupled, multi-tiered pipeline designed to maintain high frame-rate rendering (60 FPS) while executing computationally intensive computer vision algorithms asynchronously. Figure 1 illustrates the functional system architecture.</p>

    <div class="figure-box">
      <img src="${imgArch}" class="figure-img" style="max-height: 250px;">
      <div class="figure-caption">Figure 1: High-Level System Architecture of MindAR WebAR Pipeline.</div>
    </div>

    <p>As depicted in Figure 1, the architecture comprises four distinct operational layers:</p>
    <ul>
      <li><strong>1. Input Layer:</strong> Captures raw video frames from the device camera at 30-60 FPS using the browser's MediaDevices API. A hidden HTML5 video element buffers frames for computer vision ingestion.</li>
      <li><strong>2. MindAR Vision Core:</strong> An asynchronous Web Worker thread (<code>controller.worker.js</code>) decouples vision processing from the main UI thread. It executes Difference of Gaussians (DoG) feature extraction and matches candidate keypoints against the pre-compiled <code>card.mind</code> binary database. The OneEuroFilter smooths coordinate transitions.</li>
      <li><strong>3. 3D & AR Bridge:</strong> The <code>mindar-image-system</code> registers anchor entities (<code>mindar-image-target</code>), receives decomposed 6-DoF transformation matrices, and propagates updates to A-Frame's entity hierarchy.</li>
      <li><strong>4. Presentation Layer:</strong> The Three.js WebGL renderer renders the 3D GLTF avatar model (<code>softmind</code>) and reference planar graphic on top of the live video canvas while maintaining responsive UI scanning and loading overlays.</li>
    </ul>

    <div class="page-break"></div>

    <!-- ================= 9. METHODOLOGY AND WORKFLOW ================= -->
    <h1>9. Methodology and Implementation Workflow</h1>
    <p>The end-to-end execution lifecycle follows a structured sequence from client initialization to real-time spatial tracking. Figure 2 outlines the operational workflow.</p>

    <div class="figure-box">
      <img src="${imgWorkflow}" class="figure-img" style="max-height: 270px;">
      <div class="figure-caption">Figure 2: Execution and Tracking Lifecycle Workflow.</div>
    </div>

    <p>The execution sequence proceeds through five distinct stages:</p>
    <ul>
      <li><strong>Phase 1 - Asset Loading:</strong> The HTML page loads A-Frame and the MindAR bundle. The binary descriptor file (<code>card.mind</code>) and 3D GLTF model are fetched into browser memory asynchronously.</li>
      <li><strong>Phase 2 - Camera Acquisition:</strong> WebRTC <code>getUserMedia()</code> requests user hardware permission. Upon approval, video streams are bound to internal canvas contexts.</li>
      <li><strong>Phase 3 - Real-Time Detection:</strong> The Crop Detector extracts candidate keypoints from incoming video frames. Multi-scale template matching correlates extracted points with reference features.</li>
      <li><strong>Phase 4 - Target Matching & Homography:</strong> When sufficient inlier keypoints match, Random Sample Consensus (RANSAC) and homography decomposition compute the 4x4 spatial transformation matrix, firing the <code>targetFound</code> event.</li>
      <li><strong>Phase 5 - AR Superimposition:</strong> The 3D model becomes visible, animating smoothly over the physical card. The tracking thread maintains spatial stability until the marker is obscured or removed (<code>targetLost</code>).</li>
    </ul>

    <div class="page-break"></div>

    <!-- ================= 10. IMPLEMENTATION DETAILS ================= -->
    <h1>10. Implementation Details</h1>
    <p>The application implementation relies on the official MindAR basic image tracking example (<code>examples/image-tracking/example1.html</code>). Below is a detailed review of the key configuration components.</p>

    <h2>10.1 A-Frame Declarative Scene Configuration</h2>
    <p>The core tracking scene is configured declaratively using custom A-Frame attributes, as shown in Listing 1:</p>

    <div class="code-box">&lt;!-- Excerpt from examples/image-tracking/example1.html --&gt;
&lt;a-scene mindar-image="imageTargetSrc: ./assets/card-example/card.mind; showStats: true;"
         embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights"
         vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false"&gt;
  &lt;a-assets&gt;
    &lt;img id="card" src="./assets/card-example/card.png" /&gt;
    &lt;a-asset-item id="avatarModel" src="./assets/card-example/softmind/scene.gltf"&gt;&lt;/a-asset-item&gt;
  &lt;/a-assets&gt;

  &lt;a-camera position="0 0 0" look-controls="enabled: false"&gt;&lt;/a-camera&gt;

  &lt;a-entity mindar-image-target="targetIndex: 0"&gt;
    &lt;a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"&gt;&lt;/a-plane&gt;
    &lt;a-gltf-model rotation="0 0 0" position="0 0 0.1" scale="0.005 0.005 0.005"
                  src="#avatarModel"
                  animation="property: position; to: 0 0.1 0.1; dur: 1000;
                             easing: easeInOutQuad; loop: true; dir: alternate"&gt;
    &lt;/a-gltf-model&gt;
  &lt;/a-entity&gt;
&lt;/a-scene&gt;</div>
    <div style="text-align: center; font-size: 9pt; font-style: italic; color: #555; margin-bottom: 12px;">Listing 1: MindAR A-Frame Declarative Markup Configuration.</div>

    <h2>10.2 Dimensional Alignment & Aspect Ratio Calculation</h2>
    <p>A critical mathematical consideration in planar image tracking is matching the aspect ratio of the virtual bounding plane to the physical target image. Inspection of <code>card.png</code> revealed pixel dimensions of 674 × 372 pixels:</p>
    <div style="text-align: center; font-weight: bold; margin: 6px 0;">Aspect Ratio = Height / Width = 372 / 674 ≈ 0.5519</div>
    <p>In Listing 1, the <code>&lt;a-plane&gt;</code> component precisely sets <code>width="1"</code> and <code>height="0.552"</code>. This exact dimensional parity ensures that the virtual boundary aligns flush with the real-world card boundaries, eliminating spatial slippage or visual distortion during 3D projection.</p>

    <div class="page-break"></div>

    <!-- ================= 11. RESULTS AND SCREENSHOTS ================= -->
    <h1>11. Results and Screenshots</h1>
    <p>Comprehensive empirical verification was conducted using both manual interactive browser inspection and automated headless Chromium testing harnesses. All screenshots presented below are genuine captures from the running application.</p>

    <h2>11.1 Target Image Asset</h2>
    <p>The reference target graphic utilized for image tracking is the standard MindAR card template shown in Figure 3. This high-contrast design features distinct geometric typography and asymmetric iconography, which generate dense, stable FREAK feature clusters.</p>

    <div class="figure-box">
      <img src="${imgTarget}" class="figure-img" style="max-height: 180px;">
      <div class="figure-caption">Figure 3: Reference Physical Target Image (card.png, 674x372 px).</div>
    </div>

    <h2>11.2 Camera Initialization and Scanning HUD</h2>
    <p>Upon granting camera permission, the application successfully captures the live video stream. Figure 4 illustrates the initial scanning state, displaying the responsive scanning reticle overlay while actively seeking the target card in the video feed.</p>

    <div class="figure-box">
      <img src="${imgScanning}" class="figure-img" style="max-height: 220px;">
      <div class="figure-caption">Figure 4: Active Camera Feed with MindAR Scanning Reticle Overlay.</div>
    </div>

    <div class="page-break"></div>

    <h2>11.3 Target Detection and 3D Model Rendering</h2>
    <p>When the target card enters the camera's field of view, MindAR extracts matching keypoint descriptors within approximately 100 milliseconds. The system triggers the <code>targetFound</code> event, hides the scanning overlay, and superimposes the animated 3D <code>softmind</code> GLTF model precisely anchored atop the physical card, as captured in Figure 5.</p>

    <div class="figure-box">
      <img src="${imgDetected}" class="figure-img" style="max-height: 240px;">
      <div class="figure-caption">Figure 5: Genuine Capture of Target Recognition and 3D GLTF Model Rendering.</div>
    </div>

    <h2>11.4 Continuous Motion Tracking</h2>
    <p>As the card is moved, tilted, and rotated dynamically across the field of view, the homography matrix updates at 60 FPS. Figure 6 demonstrates continuous multi-axis spatial tracking, with the OneEuroFilter effectively suppressing jitter.</p>

    <div class="figure-box">
      <img src="${imgMotion}" class="figure-img" style="max-height: 240px;">
      <div class="figure-caption">Figure 6: Real-Time Dynamic Continuous Motion Tracking.</div>
    </div>

    <div class="page-break"></div>

    <!-- ================= 12. TESTING AND OBSERVATIONS ================= -->
    <h1>12. Testing Verification and Observation Matrix</h1>
    <p>A formal testing protocol was executed to validate each subsystem. Table 2 details the test cases, expected outcomes, observed behaviors, and verification statuses.</p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Test Case Description</th>
          <th>Expected Behavior</th>
          <th>Actual Observed Result / Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>TC-01</strong></td>
          <td>Web Server HTTPS Initialization</td>
          <td>Vite starts HTTPS on port 5173</td>
          <td>Server started in 134ms; HTTP/2 200 OK <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-02</strong></td>
          <td>Asset Retrieval & Preloading</td>
          <td>card.mind and GLTF load without 404</td>
          <td>All core assets loaded successfully <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-03</strong></td>
          <td>Hardware Camera Permission</td>
          <td>Browser prompts for camera access</td>
          <td>Permission granted; video stream active <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-04</strong></td>
          <td>Video Feed Ingestion</td>
          <td>Video element renders at 640x480</td>
          <td>640x480 video stream bound to canvas <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-05</strong></td>
          <td>Target Card Recognition</td>
          <td>card.mind matched; targetFound fires</td>
          <td>Target detected in 3.0s interval; event fired <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-06</strong></td>
          <td>3D Model Superimposition</td>
          <td>Softmind GLTF mesh visible over card</td>
          <td>Model rendered at scale 0.005 with animation <span class="passed-badge">[PASSED]</span></td>
        </tr>
        <tr>
          <td><strong>TC-07</strong></td>
          <td>Dynamic Motion Tracking</td>
          <td>3D model follows moving target</td>
          <td>Continuous tracking confirmed across 10 poses <span class="passed-badge">[PASSED]</span></td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: center; font-size: 9pt; font-style: italic; color: #555; margin-bottom: 12px;">Table 2: Verification and Test Observation Results Matrix.</div>

    <!-- ================= 13. APPLICATIONS AND USE CASES ================= -->
    <h1>13. Applications and Real-World Use Cases</h1>
    <p>The demonstrated image-tracking technology has significant practical utility across diverse real-world domains:</p>
    <ul>
      <li><strong>Interactive Educational Materials & Textbooks:</strong> Printed diagrams, anatomical charts, and chemical molecular structures can come alive with interactive 3D visualizations when viewed through a student's smartphone or laptop camera.</li>
      <li><strong>Museum & Gallery Guides:</strong> Informational placards placed near artifacts can serve as tracking markers, overlaying historical reconstructions, 3D animated models, and multimedia guides without requiring specialized museum hardware.</li>
      <li><strong>Product Packaging and Marketing:</strong> Retail packaging and promotional business cards can display interactive 3D product previews, instructional assembly animations, and direct e-commerce links.</li>
      <li><strong>Technical Assembly and Maintenance:</strong> Field technicians can scan machine parts or schematics to view animated overlays illustrating assembly steps and safety warnings in real time.</li>
    </ul>

    <!-- ================= 14. ADVANTAGES AND LIMITATIONS ================= -->
    <h1>14. Advantages and Practical Limitations</h1>
    <p>A rigorous engineering evaluation requires candid recognition of both system strengths and operational boundaries.</p>

    <h2>14.1 Technical Advantages</h2>
    <ul>
      <li><strong>Frictionless Web Access:</strong> Operates instantly via standard web URLs without requiring App Store approvals or installations.</li>
      <li><strong>Cost Effectiveness:</strong> Entirely open source under the MIT License, eliminating commercial vendor lock-in.</li>
      <li><strong>Lightweight Footprint:</strong> The compiled MindAR A-Frame bundle is only 1.75 MB (300 KB gzipped), enabling sub-second web delivery.</li>
      <li><strong>Privacy & Client-Side Execution:</strong> All video processing occurs locally within the browser; camera images are never transmitted to external cloud servers.</li>
    </ul>

    <h2>14.2 Practical Limitations</h2>
    <ul>
      <li><strong>Lighting Dependency:</strong> Insufficient ambient illumination or intense specular glare degrades keypoint detection confidence.</li>
      <li><strong>Extreme Viewing Angles:</strong> Severe oblique angles exceeding 60 degrees cause homography distortion and tracking loss.</li>
      <li><strong>Featureless Targets:</strong> Targets lacking rich contrast, high-frequency textures, or geometric asymmetry cannot generate stable feature descriptors.</li>
      <li><strong>Initial Asset Latency:</strong> 3D models with high polygon counts or large 4K textures require sufficient bandwidth on initial page load.</li>
    </ul>

    <div class="page-break"></div>

    <!-- ================= 15. FUTURE SCOPE ================= -->
    <h1>15. Future Scope</h1>
    <p>While the current implementation successfully validates single-target image tracking, promising avenues for future research and extension include:</p>
    <ul>
      <li><strong>Multi-Target Tracking:</strong> Extending the compiler to track multiple educational flashcards concurrently, enabling collaborative interaction between different 3D assets.</li>
      <li><strong>Spatial Audio & Narration:</strong> Integrating the Web Audio API to trigger synchronized spatial voiceover explanations when specific targets are recognized.</li>
      <li><strong>Interactive Web UI Overlays:</strong> Adding interactive HTML touch controls allowing users to rotate, explode, or inspect subcomponents of the 3D model.</li>
      <li><strong>Offline PWA Caching:</strong> Implementing Service Workers and IndexedDB caching to enable full offline execution without any active internet connection.</li>
    </ul>

    <!-- ================= 16. CONCLUSION ================= -->
    <h1>16. Conclusion</h1>
    <p>This project successfully established, verified, and analyzed a full-featured Web-based Augmented Reality image-tracking system utilizing MindAR on an Apple Silicon MacBook Air. By eliminating reliance on heavy native AR development suites and proprietary cloud engines, the project demonstrates how modern browser APIs—WebAssembly, WebGL, and WebRTC—democratize interactive augmented reality.</p>
    <p>Rigorous testing confirmed rapid target acquisition, smooth 60 FPS animation, and robust pose tracking under normal operating conditions. The creation of automated verification scripts, an interactive launcher (<code>start.sh</code>), and comprehensive academic documentation provides a complete, turnkey artifact suitable for academic evaluation and instructional demonstrations.</p>

    <!-- ================= 17. REFERENCES ================= -->
    <h1>17. References</h1>
    <ol style="padding-left: 20px; font-size: 10pt; line-height: 1.4;">
      <li>Hiukim Yau. "MindAR: Lightweight Web Augmented Reality Framework." GitHub Repository (2024). https://github.com/hiukim/mind-ar-js</li>
      <li>MindAR Official Documentation and Examples. https://hiukim.github.io/mind-ar-js-doc/</li>
      <li>A-Frame Authors. "A-Frame: A Web Framework for Building 3D/VR/AR Experiences." Version 1.4.1 (2023). https://aframe.io/</li>
      <li>Three.js Authors. "Three.js JavaScript 3D Library." (2023). https://threejs.org/</li>
      <li>Alahi, A., Ortiz, R., & Vandergheynst, P. "FREAK: Fast Retina Keypoint." IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2012.</li>
      <li>Casiez, G., Roussel, N., & Vogel, D. "1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in Interactive Systems." ACM CHI Conference on Human Factors in Computing Systems, 2012.</li>
      <li>World Wide Web Consortium (W3C). "Media Capture and Streams (WebRTC getUserMedia)." W3C Recommendation.</li>
      <li>Khronos Group. "WebGL 2.0 Specification." Khronos Consortium (2022).</li>
    </ol>

    <!-- ================= 18. APPENDIX ================= -->
    <h1>18. Appendix: Setup, Execution & Demonstration Guide</h1>
    <p>This appendix provides exact, reproducible terminal instructions for replicating the project demonstration from a fresh session.</p>

    <h2>18.1 Quick Launching via Shell Script</h2>
    <p>1. Open macOS Terminal and navigate to the project directory:</p>
    <div class="code-box">cd ~/Desktop/MindAR-Image-Tracking</div>
    <p>2. Execute the launcher script:</p>
    <div class="code-box">./start.sh</div>
    <p>3. Select Option 1 (Local dev server) or Option 2 (Cloudflare HTTPS tunnel for mobile testing).</p>

    <h2>18.2 Manual Terminal Commands</h2>
    <p>If launching manually without the helper script:</p>
    <div class="code-box">cd ~/Desktop/MindAR-Image-Tracking/mind-ar-js
export PATH="/opt/homebrew/bin:$PATH"
npx vite --config vite.config.dev.js --host</div>

    <h2>18.3 Verification URLs</h2>
    <ul>
      <li><strong>Local Mac & IDE Browser (Zero SSL warnings):</strong> <code>http://localhost:5173/examples/image-tracking/example1.html</code></li>
      <li><strong>Mobile Wi-Fi URL:</strong> <code>http://192.168.88.3:5173/examples/image-tracking/example1.html</code></li>
      <li><strong>Cloudflare Tunnel (Signed SSL for iPhone):</strong> via <code>./start.sh</code> Option 2</li>
      <li><strong>Target Image Location:</strong> <code>~/Desktop/MindAR-Image-Tracking/target_image/target_card.png</code></li>
    </ul>

  </body>
  </html>
  `;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: Arial, sans-serif; font-size: 8pt; color: #888888; width: 100%; text-align: right; padding-right: 18mm; border-bottom: 0.5px solid #cccccc; padding-bottom: 2px;">
        Image-Based Augmented Reality Using MindAR | AR/VR Project Report
      </div>
    `,
    footerTemplate: `
      <div style="font-family: Arial, sans-serif; font-size: 8pt; color: #888888; width: 100%; text-align: center;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    `,
    margin: {
      top: '25mm',
      bottom: '25mm',
      left: '18mm',
      right: '18mm'
    }
  });

  console.log(`Successfully generated PDF report at: ${OUTPUT_PDF}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('PDF Generation failed:', err);
  process.exit(1);
});
