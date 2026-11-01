# Complete Run & Demonstration Guide: MindAR Image-Tracking WebAR

Welcome to the **MindAR Image-Tracking Augmented Reality Project**. This guide is prepared specifically for beginners and college demonstrations. It contains everything you need to start, run, test, and demonstrate image-based WebAR on your MacBook Air or mobile phone to your professor.

---

## 1. What MindAR Is and What This Project Demonstrates

- **MindAR** is an open-source, lightweight Web Augmented Reality (WebAR) framework built using **TensorFlow.js** and **WebAssembly (WASM)**.
- **The Demonstration**: It implements **natural feature image tracking**. When your device camera points at a pre-registered target image (the business card target `card.png`), MindAR detects its multi-scale keypoints in real time, computes the 6-Degrees-of-Freedom (6-DoF) homography pose matrix, and renders an animated 3D avatar (`softmind` GLTF model) anchored precisely over the card.
- **Web-Based**: Unlike traditional mobile AR apps that require downloading an app from the App Store, this runs directly in standard web browsers (Safari, Chrome, Opera GX) using HTML5, WebGL, and WebRTC.

---

## 2. Project Folder Location

The project is located at:
- **Primary Workspace Path**: `/Users/apple/Desktop/ARVR_Project/MindAR-Image-Tracking`
- **Desktop Symlink Path**: `/Users/apple/Desktop/MindAR-Image-Tracking`

Both paths point to the exact same directory.

### Directory Structure Overview
```text
MindAR-Image-Tracking/
├── RUN_GUIDE.md                  # This complete run and demonstration guide
├── start.sh                      # One-click executable launcher script
├── MindAR_Project_Report.docx    # Academic project report (DOCX format)
├── MindAR_Project_Report.pdf     # Academic project report (PDF format)
├── target_image/
│   └── target_card.png           # Target image to display or print
├── report_assets/                # Screenshots and architecture diagrams
│   ├── 01_page_loaded.png
│   ├── 02_camera_scanning.png
│   ├── 03_target_detected_ar_rendering.png
│   ├── 04_continuous_tracking_motion.png
│   ├── system_architecture.png
│   └── workflow_diagram.png
└── mind-ar-js/                   # Official MindAR repository (tag: v1.2.5)
    ├── dist/                     # Compiled production bundles
    ├── examples/
    │   └── image-tracking/
    │       ├── example1.html     # Core Basic Image-Tracking Example
    │       └── assets/card-example/
    │           ├── card.mind     # Pre-compiled feature descriptors
    │           ├── card.png      # Reference target graphic
    │           └── softmind/     # 3D GLTF avatar model and textures
    ├── src/                      # Library source code
    └── package.json              # Project dependencies and Vite build scripts
```

---

## 3. Software Environment & Installed Versions

| Component | Verified Version | Role |
| :--- | :--- | :--- |
| **Operating System** | macOS 27.0.1 (Darwin 27.0.0) | Host Operating System |
| **Hardware Architecture** | Apple Silicon ARM64 (M4 Chip) | Host Hardware |
| **Node.js** | v26.13.0 | JavaScript runtime for Vite dev server |
| **npm** | 11.20.0 | Package manager |
| **Git** | 2.54.0 (Apple Git-157) | Version control |
| **Vite** | 5.0.11 | Dev server with `@vitejs/plugin-basic-ssl` |
| **A-Frame** | 1.4.1 | WebVR/WebGL 3D entity-component framework |
| **Three.js** | ^0.147.1 (via A-Frame) | 3D rendering engine |
| **Cloudflared** | 2026.8.3 | Optional zero-configuration HTTPS tunnel for mobile testing |
| **Browsers** | Safari, Opera GX, Google Chrome for Testing | Web clients |

---

## 4. Quick Start: How to Run the Application

### Option A: Using the One-Click Launcher Script (Recommended)

1. Open **Terminal** on your Mac.
2. Navigate to the project directory:
   ```bash
   cd ~/Desktop/MindAR-Image-Tracking
   ```
3. Run the launcher:
   ```bash
   ./start.sh
   ```
4. Choose option `1` (or press Enter). The server starts instantly over HTTPS!

### Option B: Starting Manually via Terminal

If you prefer to run the commands manually:
```bash
cd ~/Desktop/MindAR-Image-Tracking/mind-ar-js
export PATH="/opt/homebrew/bin:$PATH"
npx vite --config vite.config.dev.js --host
```

---

## 5. Exact URLs to Open

### On Your MacBook & Antigravity IDE Browser (Recommended):
Use standard HTTP. In all modern browsers (Chrome, Safari, Edge, and embedded IDE browsers), **`localhost` is officially recognized as a Secure Context by W3C standards**, so camera access (`getUserMedia`) works with **ZERO SSL warnings**:
```text
http://localhost:5173/examples/image-tracking/example1.html
```
*(Important: If you previously had `https://` in the browser address bar, change `https://` to `http://` and hit Enter).*

### If you choose to open over HTTPS on Mac:
If accessing `https://localhost:5173`:
- In the Antigravity preview pane: Click the **"Open in External Browser"** button.
- In Safari / Chrome: Click **"Show Details"** -> **"visit this website"** to accept the local self-signed dev certificate.

### On Your Mobile Phone (iPhone / Android) via Wi-Fi:
Ensure your phone is connected to the same Wi-Fi network as your MacBook:
```text
http://192.168.88.3:5173/examples/image-tracking/example1.html
```

### On Your Phone via Cloudflare HTTPS Tunnel (Best for iPhone):
Run `./start.sh` and select option `2`. The script generates an instant public tunnel URL (e.g. `https://<unique-subdomain>.trycloudflare.com/examples/image-tracking/example1.html`) which iPhone Safari opens seamlessly with a fully verified SSL certificate.

---

## 6. How to Grant Camera Permissions

1. When the page loads, your browser will display a prompt asking:  
   *`"https://localhost:5173" Would Like to Access the Camera`*.
2. Click **Allow** (or **OK**).
3. On macOS Safari, if prompted in system settings:
   - Go to **System Settings** > **Privacy & Security** > **Camera**.
   - Ensure the toggle next to **Safari** (or your active browser) is turned **ON**.
4. Once allowed, the webcam feed will appear fullscreen behind the scanning UI overlay.

---

## 7. How to Test the 3 Different Target Images

The application now supports **three distinct target image designs**, each mapped to its own unique 3D model!

All target images are saved in:
👉 **`~/Desktop/MindAR-Image-Tracking/target_image/`**

| Target # | Target File | Design Description | Associated 3D AR Model |
| :--- | :--- | :--- | :--- |
| **Target 1** (Index 0) | `target_1_card.png` | Geometric Business Card | Animated Floating Softmind Robot Avatar |
| **Target 2** (Index 1) | `target_2_raccoon.png` | Colorful Raccoon Artwork | Animated 3D Raccoon Character (Rotating) |
| **Target 3** (Index 2) | `target_3_bear.png` | Bear with Acoustic Guitar | Animated 3D Bear Character (Rotating) |

### Convenient Target Viewer:
You can open **`target_image/view_targets.html`** in any web browser to see all three targets neatly arranged with download links, or open them individually to show to your camera.

### How to Trigger the AR Models:
1. Open any of the 3 images on your smartphone, tablet, or monitor (or print them).
2. Point your camera at that image.
3. The scanning reticle will recognize the specific target and display its matching 3D character!
4. *(Bonus: Because `maxTrack: 3` is enabled, you can even point your camera at two or three cards at the same time and all of their 3D models will render simultaneously!).*

---

## 8. How to Stop the Development Server

- In the Terminal window where the server is running, press:
  ```bash
  Ctrl + C
  ```
- The server will cleanly terminate and free port `5173`.

---

## 9. Troubleshooting & Common Errors

### Q1: The browser shows "This Connection Is Not Private" or SSL Certificate Warning.
- **Cause**: Development servers on localhost use a self-signed SSL certificate so that WebRTC camera APIs (`getUserMedia`) function properly.
- **Fix**:
  - In Safari: Click **Show Details** -> Click **visit this website** -> Confirm **Visit Website**.
  - In Chrome: Click **Advanced** -> Click **Proceed to localhost (unsafe)**.
  - Or use launcher Option 2 (`cloudflared`), which provides an officially signed certificate.

### Q2: Camera feed is black or says "Permission Denied".
- **Fix**:
  - Check browser permissions: click the camera icon in the address bar and select "Always Allow".
  - Check macOS System Settings: **System Settings** > **Privacy & Security** > **Camera** > Enable your browser.
  - Close other applications that may have an exclusive lock on the camera (e.g., FaceTime, Zoom, Photo Booth).

### Q3: Camera feed appears and scanning box is visible, but the 3D model doesn't appear.
- **Check 1: Lighting & Glare**: If displaying on a phone screen, screen reflections can obscure feature points. Lower screen brightness slightly and avoid glare.
- **Check 2: Orientation**: Ensure the target image is facing the camera right-side up without major occlusion.
- **Check 3: Distance**: Hold the camera approximately 20–50 cm away so the card fills 30–70% of the camera view.
- **Check 4: Model loading**: When opening for the first time, allow 2–3 seconds for the 3D GLTF avatar to download and parse.

### Q4: Phone cannot load `https://192.168.88.3:5173`.
- **Cause**: Mac and phone are on different Wi-Fi networks (e.g. one on cellular data, one on Wi-Fi), or router has client isolation enabled.
- **Fix**: Ensure both are connected to the same Wi-Fi router, or use launcher Option `2` (`cloudflared` tunnel) which works across any internet connection.

---

## 10. Summary of Changes and Added Files

The original `mind-ar-js` repository source code and Git history have been preserved intact. The following helper tools, tests, and documentation files were added:

1. `RUN_GUIDE.md` (this file): Complete beginner and demonstration documentation.
2. `start.sh`: Interactive, safe one-click launcher script.
3. `target_image/target_card.png`: Extracted high-resolution reference target image.
4. `test_image_detection.js`: Automated end-to-end headless browser test verifying camera stream, feature matching, and 3D pose matrix rendering.
5. `test_motion_tracking.js`: Verification test measuring continuous dynamic pose tracking.
6. `generate_diagrams.js`: Generates high-resolution architecture and workflow diagrams.
7. `report_assets/`: Genuine captured screenshots and diagrams.
8. `MindAR_Project_Report.docx`: Complete academic project report in Microsoft Word format.
9. `MindAR_Project_Report.pdf`: Complete academic project report in PDF format.

---

## 11. Academic Project Reports

As required for submission to your college faculty:
- **Microsoft Word Format**: `~/Desktop/MindAR-Image-Tracking/MindAR_Project_Report.docx`
- **PDF Format**: `~/Desktop/MindAR-Image-Tracking/MindAR_Project_Report.pdf`

Both reports are comprehensive (~12–15 pages), professionally styled, and contain all 19 required academic sections, including actual screenshots from the verified implementation, system architecture, workflow diagrams, and testing matrices.
