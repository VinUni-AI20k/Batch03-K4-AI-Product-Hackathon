# Vlearn Agent — cài đặt 1 dòng (Windows PowerShell).
#   irm https://raw.githubusercontent.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304/main/get.ps1 | iex
$ErrorActionPreference = "Stop"
$Repo = "https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git"
$Dir  = if ($env:VLEARN_DIR) { $env:VLEARN_DIR } else { Join-Path $HOME "vlearn-agent" }

function Say($m){ Write-Host "▶ $m" -ForegroundColor Cyan }
function Fail($m){ Write-Host "✗ $m" -ForegroundColor Red; exit 1 }

Write-Host "🎓 Vlearn Agent — trình cài đặt" -ForegroundColor Magenta
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail "Chưa có git. Cài git (winget install Git.Git) rồi chạy lại." }
if (-not (Get-Command python -ErrorAction SilentlyContinue) -and -not (Get-Command py -ErrorAction SilentlyContinue)) {
  Fail "Cần Python >= 3.11 (winget install Python.Python.3.12)."
}

if (Test-Path (Join-Path $Dir ".git")) {
  Say "Đã có ở $Dir — cập nhật bản mới nhất (git pull)"
  git -C $Dir pull --ff-only
} else {
  Say "Tải Vlearn Agent về $Dir"
  git clone --depth 1 $Repo $Dir
}

Set-Location (Join-Path $Dir "learning-agent")
Say "Chạy trình cài đặt (venv + thư viện + kho kiến thức)"
.\install.ps1

Write-Host ""
Write-Host "✅ Đã cài xong ở $Dir\learning-agent" -ForegroundColor Green
Write-Host "Chạy tiếp:"
Write-Host "  cd $Dir\learning-agent"
Write-Host "  notepad .env                  # điền LLM key (+ token bot)"
Write-Host "  .\.venv\Scripts\Activate.ps1"
Write-Host "  learning-agent ui             # dashboard: http://127.0.0.1:8321"
