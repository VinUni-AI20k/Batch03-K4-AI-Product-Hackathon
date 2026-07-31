@echo off
setlocal
cd /d "%~dp0codebase"

set "PY_EXE=python"
where python >nul 2>nul
if errorlevel 1 (
  set "PY_EXE=%LocalAppData%\Programs\Python\Python312\python.exe"
)

if not exist "%PY_EXE%" if "%PY_EXE%" neq "python" (
  echo Python was not found.
  echo Install Python 3.10-3.12 and tick "Add python.exe to PATH".
  pause
  exit /b 1
)

echo Installing backend dependencies...
"%PY_EXE%" -m pip install -r requirements.txt
if errorlevel 1 (
  pause
  exit /b 1
)

echo Starting backend at http://localhost:8000
"%PY_EXE%" main.py
pause
