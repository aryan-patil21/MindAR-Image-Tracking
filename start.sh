#!/usr/bin/env bash
# ==============================================================================
# MindAR Image-Tracking AR Launcher Script
# Safe, repeatable launcher for local MacBook and mobile phone AR testing.
# ==============================================================================

set -e

# Include standard Homebrew and system PATHs
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MINDAR_DIR="${PROJECT_ROOT}/mind-ar-js"
TARGET_IMAGE="${PROJECT_ROOT}/target_image/target_card.png"

echo "=================================================================="
echo "    🚀 MindAR Image-Tracking Augmented Reality Project Launcher    "
echo "=================================================================="
echo "Project Path: ${PROJECT_ROOT}"
echo "Current Time: $(date)"
echo ""

# 1. Check Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is not found in PATH."
    echo "Please ensure Node.js is installed (e.g. brew install node)."
    exit 1
fi

NODE_VER=$(node -v)
NPM_VER=$(npm -v)
echo "✅ Node.js runtime: ${NODE_VER} | npm: ${NPM_VER}"

# 2. Check Repository
if [ ! -d "${MINDAR_DIR}" ]; then
    echo "❌ Error: mind-ar-js repository directory not found at ${MINDAR_DIR}"
    exit 1
fi

# Detect Local IP
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n 1 | awk '{print $2}')
if [ -z "${LAN_IP}" ]; then
    LAN_IP="127.0.0.1"
fi

echo "=================================================================="
echo "                       RUN OPTIONS                                "
echo "=================================================================="
echo "  1) Start Standard HTTP Server (Recommended for Mac & IDE webview - Zero SSL errors)"
echo "  2) Start Server with Cloudflare HTTPS Tunnel (Recommended for iPhone / Android)"
echo "  3) Start Local HTTPS Server (Self-signed certificate)"
echo "  4) Run Automated Verification Tests"
echo "=================================================================="
read -p "Select an option [1-4, default: 1]: " OPTION
OPTION=${OPTION:-1}

cleanup() {
    echo ""
    echo "🛑 Shutting down server and background processes..."
    kill $(jobs -p) 2>/dev/null || true
    echo "Done. Have a great day!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

if [ "${OPTION}" = "4" ]; then
    echo "🧪 Running automated verification tests..."
    cd "${MINDAR_DIR}"
    node test_image_detection.js
    exit 0
fi

if [ "${OPTION}" = "2" ]; then
    if ! command -v cloudflared >/dev/null 2>&1; then
        echo "⚠️ cloudflared is not installed. Starting standard server."
        OPTION=1
    else
        echo "🌐 Starting Vite development server on HTTP..."
        cd "${MINDAR_DIR}"
        npx vite --host > /dev/null 2>&1 &
        VITE_PID=$!
        sleep 2

        echo "🔒 Starting secure Cloudflare HTTPS Tunnel for iPhone/Android..."
        echo "------------------------------------------------------------------"
        echo "Open this tunnel URL on your phone browser:"
        cloudflared tunnel --url http://localhost:5173 2>&1 | while IFS= read -r line; do
            if echo "$line" | grep -q "trycloudflare.com"; then
                URL=$(echo "$line" | grep -o 'https://[^ ]*trycloudflare.com')
                echo "✨ TUNNEL READY!"
                echo "👉 iPhone / Phone URL: ${URL}/examples/image-tracking/example1.html"
                echo "👉 Target Card Image: ${TARGET_IMAGE}"
                echo "------------------------------------------------------------------"
            fi
        done
        wait $VITE_PID
        exit 0
    fi
fi

if [ "${OPTION}" = "3" ]; then
    echo "🔒 Starting Vite development server with local SSL..."
    echo "👉 Mac Browser: https://localhost:5173/examples/image-tracking/example1.html"
    echo "👉 Mobile Phone: https://${LAN_IP}:5173/examples/image-tracking/example1.html"
    cd "${MINDAR_DIR}"
    VITE_SSL=true exec npx vite --host
fi

# Option 1 (Default): Standard HTTP
echo ""
echo "=================================================================="
echo "                     SERVER READY & RUNNING                       "
echo "=================================================================="
echo "💻 Mac & Antigravity IDE Browser (ZERO SSL Warnings):"
echo "   👉 http://localhost:5173/examples/image-tracking/example1.html"
echo ""
echo "📱 Phone Browser (Same Wi-Fi network):"
echo "   👉 http://${LAN_IP}:5173/examples/image-tracking/example1.html"
echo ""
echo "🎯 Target Image to Point Camera At:"
echo "   👉 ${TARGET_IMAGE}"
echo "=================================================================="
echo "Press Ctrl + C in this terminal window to stop the server."
echo ""

cd "${MINDAR_DIR}"
exec npx vite --host
