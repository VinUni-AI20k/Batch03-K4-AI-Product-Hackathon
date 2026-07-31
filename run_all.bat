@echo off
setlocal
cd /d "%~dp0"

start "AI Agent Backend" "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "AI Agent Frontend" "%~dp0run_frontend.bat"

echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
pause
