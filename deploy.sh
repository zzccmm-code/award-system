#!/bin/bash
# One-click deploy script for cloud server (Ubuntu/CentOS)
# Usage: bash deploy.sh

set -e

echo "=== Award System Deployment ==="

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Python dependencies
echo "Installing Python packages..."
cd backend
pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
cd ..

# Build frontend
echo "Building frontend..."
npm install --registry=https://registry.npmmirror.com
npx vite build --outDir backend/static --emptyOutDir

# Start server (port 80)
echo "Starting server on port 80..."
cd backend
sudo nohup python3 -m uvicorn app.main:app --host 0.0.0.0 --port 80 > server.log 2>&1 &
echo "Server started! Access: http://YOUR_SERVER_IP"
echo "Check logs: tail -f backend/server.log"
