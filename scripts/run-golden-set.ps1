# Wrapper giữ lại lệnh quen thuộc — logic thật nằm ở scripts/run-golden-set.js.
#
# Runner được viết lại bằng Node để dùng chung buildSystemPrompt() với codebase/prompt.js.
# Bản PowerShell trước đây tự dựng prompt riêng và không nạp knowledge base, nên prompt
# gửi lên model khác hẳn prompt của app — số đo thu được không nói gì về sản phẩm.
#
#   .\scripts\run-golden-set.ps1                  # chạy trọn bộ
#   .\scripts\run-golden-set.ps1 -DryRun          # xem ngữ cảnh nạp cho từng case, không gọi API
#   .\scripts\run-golden-set.ps1 -CaseLimit 3     # chạy thử 3 case đầu

param(
  [string]$Model = 'google/gemini-2.5-flash',
  [string]$OutFile,
  [switch]$DryRun,
  [int]$CaseLimit = 0
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw 'Cần Node.js để chạy eval. Cài tại https://nodejs.org rồi chạy lại.'
}

$nodeArgs = @((Join-Path $PSScriptRoot 'run-golden-set.js'), '--model', $Model)
if ($DryRun) { $nodeArgs += '--dry-run' }
if ($CaseLimit -gt 0) { $nodeArgs += @('--limit', "$CaseLimit") }
if (-not [string]::IsNullOrWhiteSpace($OutFile)) { $nodeArgs += @('--out', $OutFile) }

Push-Location $root
try { & node @nodeArgs; if ($LASTEXITCODE -ne 0) { throw "Eval thất bại (exit $LASTEXITCODE)" } }
finally { Pop-Location }
