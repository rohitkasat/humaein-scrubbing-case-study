# Windows Setup Guide — Humaein Mini RCM

## Option A — Docker Desktop (Recommended)

1) Install Docker Desktop: https://www.docker.com/products/docker-desktop/
2) Extract the ZIP to C:\projects\humaein-mini-rcm
3) Copy backend\.env.example to backend\.env
4) Copy frontend\.env.example to frontend\.env
5) Open PowerShell in project root and run:
   ```
   docker-compose up --build
   ```
6) Access http://localhost:5173
7) Login: admin@humaein.local / Admin@123

## Option B — Native (Python + Node + PostgreSQL)

1) Install Python 3.11+, Node 20+, PostgreSQL 15
2) Create database `rcm` in PostgreSQL
3) Backend setup:
   ```
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   copy .env.example .env
   # Edit .env with your DB credentials
   uvicorn app.main:app --reload
   ```
4) Frontend setup (new terminal):
   ```
   cd frontend
   npm install
   copy .env.example .env
   npm run dev
   ```

See full details in this file for troubleshooting.

   ## Troubleshooting (Windows PowerShell)

   ### Virtual environment / module not found
   If you see `ModuleNotFoundError: No module named 'app'`, you are not in the `backend` folder when starting uvicorn. Always:
   ```
   cd backend
   .\n+\venv\Scripts\Activate.ps1
   uvicorn app.main:app --reload
   ```

   ### Execution policy prevents activation
   If `Activate.ps1` is blocked:
   ```
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
   This only affects the current PowerShell session.

   ### Server exits immediately
   Confirm dependencies installed:
   ```
   pip install -r requirements.txt
   ```
   Ensure `python-multipart` and `email-validator` exist (now in requirements).

   ### One-command startup
   Use helper script:
   ```
   powershell -ExecutionPolicy Bypass -File .\backend\run-backend.ps1
   ```

   ### Frontend cannot reach API
   Check backend is listening:
   ```
   curl http://localhost:8000/healthz
   ```
   If failing, restart backend using the helper script.

   ### Path confusion in VS Code integrated terminal
   Open a fresh terminal; verify with `Get-Location`. If it is project root, `cd backend` before running anything.

