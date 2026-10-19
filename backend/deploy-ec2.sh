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
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:/root/.local/bin:/usr/local/bin:$PATH"

# Navigate to backend directory
cd "$(dirname "$0")"
BACKEND_DIR=$(pwd)
CURRENT_USER=$(whoami)

# Ensure .env exists so service boots cleanly
if [ ! -f "$BACKEND_DIR/.env" ] && [ -f "$BACKEND_DIR/.env.example" ]; then
    echo ">>> Initializing backend .env from .env.example..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

echo ">>> Setting up Python virtual environment with uv..."
uv sync --frozen --no-dev

echo ">>> Creating Systemd service for LearnNova backend..."
SERVICE_FILE="/etc/systemd/system/learnnova-backend.service"
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
EnvironmentFile=-$BACKEND_DIR/.env
Environment=ENVIRONMENT=production
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

echo ">>> Configuring Nginx reverse proxy..."
if [ -f "$BACKEND_DIR/nginx-learnnova.conf" ]; then
    sudo cp "$BACKEND_DIR/nginx-learnnova.conf" /etc/nginx/sites-available/learnnova
    sudo ln -sf /etc/nginx/sites-available/learnnova /etc/nginx/sites-enabled/learnnova
    sudo rm -f /etc/nginx/sites-enabled/default
    if sudo nginx -t; then
        sudo systemctl restart nginx
        echo ">>> Nginx reverse proxy configured and restarted successfully."
    else
        echo ">>> Warning: Nginx syntax check failed. Please check /etc/nginx/sites-available/learnnova."
    fi
fi

echo ">>> Reloading systemd and starting learnnova-backend service..."
sudo systemctl daemon-reload
sudo systemctl enable learnnova-backend
sudo systemctl restart learnnova-backend

echo ">>> Checking backend service status..."
sudo systemctl status learnnova-backend --no-pager || true

echo ""
echo "================================================================================"
echo " LearnNova Backend is now active as a systemd service!"
echo " Local Health Test: curl http://localhost:8000/api/health"
echo " Nginx Public Test: curl http://localhost/api/health"
echo " View Service Logs: sudo journalctl -u learnnova-backend -f"
echo "================================================================================"
