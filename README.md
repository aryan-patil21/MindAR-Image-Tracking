# 🌟 Image-Based Augmented Reality Using MindAR (WebAR)

A production-grade, open-source **Web-based Augmented Reality (WebAR)** project built with **MindAR**, **A-Frame**, **Three.js**, and **TensorFlow.js**. 

This project demonstrates real-time natural feature image tracking directly inside standard web browsers without requiring users to download or install any external native apps (iOS/Android). Point your camera at any of the predefined target cards to see interactive, animated 3D models rendered flush over the physical images with 6-Degrees-of-Freedom (6-DoF) spatial tracking.

---

## 📸 Project Showcase

| 🎯 Target 1: Business Card | 🎯 Target 2: Band Raccoon | 🎯 Target 3: Band Bear |
| :---: | :---: | :---: |
| ![Target 1](target_image/target_1_card.png) | ![Target 2](target_image/target_2_raccoon.png) | ![Target 3](target_image/target_3_bear.png) |
| **✨ Softmind Robot Avatar** (Floating & Bouncing) | **✨ 3D Raccoon Character** (Upright & Animated) | **✨ 3D Bear with Guitar** (Upright & Animated) |

---

## 🚀 Key Features

- **Zero-Installation WebAR:** Operates directly inside Safari, Chrome, and Opera GX using WebRTC and WebGL 2.0.
- **Multi-Target Tracking (`maxTrack: 3`):** Supports three distinct physical targets simultaneously or individually with custom-compiled feature descriptors (`multi_targets.mind`).
- **Client-Side Computer Vision:** All Fast Retina Keypoint (FREAK) matching, Difference of Gaussians (DoG) filtering, and homography decomposition run locally via WebAssembly (WASM) and multi-threaded Web Workers.
- **Jitter-Free Motion Smoothing:** Integrated **OneEuroFilter** prevents spatial jitter and stabilizes 3D objects across handheld camera motion.
- **Local & Mobile Support:** Includes one-click scripts for local MacBook testing and zero-warning Cloudflare HTTPS tunnels for iPhone/Android testing.
- **Academic Project Reports Included:** Comprehensive 15-page academic submission reports available in both **DOCX** and **PDF** formats.

---

## 🏗️ System Architecture

```text
+-------------------------------------------------------------+
|                        INPUT LAYER                          |
|    Hardware Webcam / Mobile Camera -> WebRTC getUserMedia()  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     MINDAR VISION CORE                      |
|  - Web Worker: controller.worker.js (Multithreaded CV)      |
|  - Descriptor Matching: multi_targets.mind (FREAK Features) |
|  - RANSAC Homography -> 6-DoF 3D Pose Decomposition         |
|  - Temporal Filter: OneEuroFilter                           |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      3D & AR BRIDGE                         |
|  - A-Frame System: mindar-image-system                      |
|  - Target Anchor: mindar-image-target (Index 0, 1, 2)       |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                    PRESENTATION LAYER                       |
|  - Three.js WebGL Engine (PBR Shaders & Lights)             |
|  - 3D GLTF Assets (Softmind, Raccoon, Bear Models)          |
|  - HUD: Loading Reticle & Scanning UI Overlay               |
+-------------------------------------------------------------+
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/aryan-patil21/MindAR-Image-Tracking.git
cd MindAR-Image-Tracking
```

### 2. Run the Interactive Launcher
```bash
./start.sh
```
The launcher will inspect your environment, verify Node.js, and provide easy run options:
- **Option 1 (Default):** Standard local HTTP dev server (Best for MacBook & IDE built-in browser with zero SSL warnings).
- **Option 2:** Cloudflare HTTPS Tunnel (Generates an instant trusted HTTPS URL for iPhone/Android camera testing).
- **Option 3:** Local SSL Server.
- **Option 4:** Run automated headless verification tests.

### 3. Open in Browser
- **Mac Browser:** `http://localhost:5173/examples/image-tracking/example1.html`
- **Mobile Browser (Same Wi-Fi):** `http://<YOUR_LOCAL_IP>:5173/examples/image-tracking/example1.html`

---

## 🎯 How to Test the Targets

1. Open **`target_image/view_targets.html`** in any browser to see the interactive target gallery.
2. Display any of the images (`target_1_card.png`, `target_2_raccoon.png`, `target_3_bear.png`) on your phone or print them on paper.
3. Point your camera at the image:
   - Target 1 displays the animated **Softmind Robot Avatar**.
   - Target 2 displays the upright **Animated Raccoon**.
   - Target 3 displays the upright **Animated Bear with Guitar**.

---

## 📁 Repository Structure

```text
MindAR-Image-Tracking/
├── README.md                     # Project overview and instructions
├── RUN_GUIDE.md                  # Comprehensive beginner demonstration guide
├── start.sh                      # One-click executable launcher script
├── MindAR_Project_Report.docx    # Academic project report (DOCX format)
├── MindAR_Project_Report.pdf     # Academic project report (PDF format, 15 pages)
├── target_image/                 # Target graphics and web viewer
│   ├── view_targets.html         # Interactive web gallery for all 3 targets
│   ├── target_1_card.png         # Target 1: Business Card
│   ├── target_2_raccoon.png      # Target 2: Band Raccoon
│   └── target_3_bear.png         # Target 3: Band Bear
├── report_assets/                # Real captured screenshots and diagrams
│   ├── 01_page_loaded.png
│   ├── 02_camera_scanning.png
│   ├── 03_target_detected_ar_rendering.png
│   ├── 04_continuous_tracking_motion.png
│   ├── system_architecture.png
│   └── workflow_diagram.png
└── mind-ar-js/                   # Core WebAR engine, models & build config
    ├── dist/                     # Production compiled bundles
    ├── examples/image-tracking/  # Image tracking HTML examples and assets
    └── package.json              # Project dependencies
```

---

## 🧪 Verification Matrix

| Test ID | Test Description | Expected Behavior | Status |
| :---: | :--- | :--- | :---: |
| **TC-01** | Dev Server Startup | Fast HTTP server initialization on port 5173 | **PASSED** |
| **TC-02** | Asset Loading | `multi_targets.mind` and GLTF models load without 404 | **PASSED** |
| **TC-03** | Camera Acquisition | WebRTC `getUserMedia()` connects video feed | **PASSED** |
| **TC-04** | Feature Detection | FREAK descriptor matching within < 3 seconds | **PASSED** |
| **TC-05** | 3D Model Rendering | Softmind, Raccoon, Bear models render upright | **PASSED** |
| **TC-06** | Spatial Motion | Continuous matrix transformation across 6-DoF poses | **PASSED** |
| **TC-07** | Multi-Tracking | Concurrently tracks up to 3 physical cards | **PASSED** |

---

## 📄 Academic Project Reports

For college/university submission, the full academic project report covering Problem Statement, System Architecture, Mathematics, Implementation, and Evaluation is included:
- 📘 **Microsoft Word Format:** [`MindAR_Project_Report.docx`](MindAR_Project_Report.docx)
- 📕 **Adobe PDF Format:** [`MindAR_Project_Report.pdf`](MindAR_Project_Report.pdf)

---

## 📜 License & Credits

- **MindAR:** MIT License (Created by [Hiukim Yau](https://github.com/hiukim/mind-ar-js))
- **A-Frame:** MIT License
- **Three.js:** MIT License
- Project integration, multi-target compilation, launcher, automated test suites, and documentation maintained by **Aryan Patil**.
