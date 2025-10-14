# Humaein Frontend Run Script
# Usage: powershell -ExecutionPolicy Bypass -File run-frontend.ps1

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[Frontend] Working in: $PWD" -ForegroundColor Green

# Install dependencies
Write-Host "[Frontend] Installing dependencies..." -ForegroundColor Cyan
npm install

# Start dev server
Write-Host "[Frontend] Starting dev server on http://localhost:5173" -ForegroundColor Green
Write-Host "[Frontend] Press CTRL+C to stop" -ForegroundColor Yellow
npm run dev