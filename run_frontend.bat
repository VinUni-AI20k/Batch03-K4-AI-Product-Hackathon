@echo off
setlocal
cd /d "%~dp0codebase\frontend"

echo Installing frontend dependencies...
call npm.cmd install
if errorlevel 1 (
  pause
  exit /b 1
)

echo Starting frontend at http://localhost:5173
call npm.cmd run dev -- --host 127.0.0.1 --port 5173
pause
