@echo off
REM Chay app.py tren Windows, tu dong né lỗi "python not found" do
REM Windows App Execution Alias (Microsoft Store) chan lenh "python".
setlocal

where py >nul 2>nul
if %errorlevel%==0 (
    echo Dung "py" launcher...
    py app.py
    goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
    echo Dung "python"...
    python app.py
    goto :eof
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Dung "python3"...
    python3 app.py
    goto :eof
)

echo.
echo KHONG TIM THAY PYTHON CHAY DUOC.
echo Cach sua:
echo   1. Mo Settings ^> Apps ^> Advanced app settings ^> App execution aliases
echo      Tat 2 dong "App Installer python.exe" va "App Installer python3.exe"
echo   2. Hoac cai lai Python tu https://www.python.org/downloads/ va tick
echo      "Add python.exe to PATH" luc cai dat
echo.
pause
