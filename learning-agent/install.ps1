# Vlearn Agent — cài đặt trên Windows (PowerShell).
# Dùng:  .\install.ps1            (cài lõi + voyage)
#        .\install.ps1 -Ingest    (thêm Docling/Whisper xử lý PDF/PPTX/video — nặng)
param([switch]$Ingest)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Say($m){ Write-Host "▶ $m" -ForegroundColor Cyan }
function Fail($m){ Write-Host "✗ $m" -ForegroundColor Red; exit 1 }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail "Chưa có git. Cài git rồi chạy lại." }
$py = $null
foreach ($c in @("python","py")) { if (Get-Command $c -ErrorAction SilentlyContinue) { $py = $c; break } }
if (-not $py) { Fail "Cần Python >= 3.11 (không tìm thấy python)." }
$ver = & $py -c "import sys;print(f'{sys.version_info[0]}.{sys.version_info[1]}')"
Say "Python: $py ($ver)"
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Host "⚠ Chưa có ffmpeg — cần cho video/ghi âm (winget install ffmpeg / choco install ffmpeg)" -ForegroundColor Yellow
}

Say "Tạo virtualenv .venv"
& $py -m venv .venv
& .\.venv\Scripts\python.exe -m pip install -q --upgrade pip
Say "Cài lõi + Voyage embeddings"
& .\.venv\Scripts\pip.exe install -q -e ".[voyage]"
if ($Ingest) {
  Say "Cài bộ xử lý tài liệu (Docling/Whisper) — có thể mất vài phút"
  & .\.venv\Scripts\pip.exe install -q -e ".[ingest]"
}

if (-not (Test-Path .env)) { Copy-Item .env.example .env; Say "Đã tạo .env" }

# Wizard tương tác: chọn provider bằng mũi tên + dán key (mask ***)
Say "Cấu hình nhanh (chọn provider LLM + dán API key)"
& .\.venv\Scripts\learning-agent.exe config

& .\.venv\Scripts\learning-agent.exe onboard

Write-Host ""
Write-Host "────────────────────────────────────────────────"
Write-Host "✅ Cài xong. Repo đã kèm sẵn KHO KIẾN THỨC (vault/) — lần đầu chạy tự index, dùng ngay." -ForegroundColor Green
Write-Host "Tiếp theo:"
Write-Host "  1. (Nếu chưa điền key) mở .env: LLM key, tuỳ chọn VOYAGE_API_KEY / token bot"
Write-Host "  2. Kích hoạt:     .\.venv\Scripts\Activate.ps1"
Write-Host "  3. Dashboard chat: learning-agent ui   → http://127.0.0.1:8321"
Write-Host "     (hoặc Telegram/Discord: learning-agent bot — lần đầu tự index, chờ chút)"
Write-Host "────────────────────────────────────────────────"
