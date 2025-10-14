# Humaein Backend Run Script
# Usage: powershell -ExecutionPolicy Bypass -File run-backend.ps1

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[Backend] Working in: $PWD" -ForegroundColor Green

# Ensure venv exists
if (!(Test-Path "venv")) {
    Write-Host "[Backend] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate venv
Write-Host "[Backend] Activating virtual environment" -ForegroundColor Cyan
. ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "[Backend] Installing dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Check for app module
if (!(Test-Path "app\main.py")) {
    Write-Host "[Backend] ERROR: app\main.py not found!" -ForegroundColor Red
    exit 1
}

# Set PYTHONPATH and start server
$env:PYTHONPATH = $PWD
Write-Host "[Backend] Starting server on http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "[Backend] Press CTRL+C to stop" -ForegroundColor Yellow
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload