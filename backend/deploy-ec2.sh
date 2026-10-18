#!/usr/bin/env bash
# ==============================================================================
# LearnNova AI Backend - AWS EC2 Automated Setup Script (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================
set -e

echo ">>> Updating Ubuntu packages..."
sudo apt update && sudo apt upgrade -y

echo ">>> Installing Python 3, pip, git, curl, and Nginx..."
sudo apt install -y python3 python3-pip python3-venv git curl nginx ufw

echo ">>> Installing uv (lightning-fast Python package manager)..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Navigate to backend directory
cd "$(dirname "$0")"

echo ">>> Setting up Python virtual environment with uv..."
uv sync --frozen --no-dev

echo ">>> Creating Systemd service for LearnNova backend..."
SERVICE_FILE="/etc/systemd/system/learnnova-backend.service"
CURRENT_USER=$(whoami)
BACKEND_DIR=$(pwd)
VENV_PYTHON="$BACKEND_DIR/.venv/bin/uvicorn"

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=LearnNova AI FastAPI Backend
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$BACKEND_DIR
ExecStart=$VENV_PYTHON app.main:app --host 0.0.0.0 --port 8000 --workers 2
Restart=always
RestartSec=5
EnvironmentFile=$BACKEND_DIR/.env
Environment=ENVIRONMENT=production

[Install]
WantedBy=multi-user.target
EOF

echo ">>> Reloading systemd and starting learnnova-backend service..."
sudo systemctl daemon-reload
sudo systemctl enable learnnova-backend
sudo systemctl restart learnnova-backend

echo ">>> Checking backend status..."
sudo systemctl status learnnova-backend --no-pager

echo ""
echo "================================================================================"
echo " LearnNova Backend is now active as a systemd service!"
echo " Test with: curl http://localhost:8000/api/health"
echo " View logs with: sudo journalctl -u learnnova-backend -f"
echo "================================================================================"
