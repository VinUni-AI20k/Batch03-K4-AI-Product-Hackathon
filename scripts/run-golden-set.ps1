param(
  [string]$WorkspaceRoot = (Split-Path -Parent $PSScriptRoot),
  [string]$Model = 'google/gemini-2.5-flash',
  [string]$Mode = 'real',
  [string]$OutFile,
  [switch]$DryRun,
  [int]$CaseLimit = 0
)

$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) {
  Write-Host "[eval] $Message"
}

function Load-DotEnv([string]$Path) {
  if (-not (Test-Path $Path)) { return }
  Get-Content $Path | Where-Object { $_ -match '^[A-Z0-9_]+=' } | ForEach-Object {
    $parts = $_ -split '=', 2
    if ($parts.Count -eq 2 -and -not [string]::IsNullOrWhiteSpace($parts[0])) {
      [System.Environment]::SetEnvironmentVariable($parts[0], $parts[1].Trim())
    }
  }
}

function Get-SystemPrompt([string]$AppJsPath) {
  $content = Get-Content $AppJsPath -Raw
  $match = [regex]::Match($content, 'const SYSTEM_PROMPT = `(?s)(.*?)`;')
  if (-not $match.Success) {
    throw 'Could not extract SYSTEM_PROMPT from codebase/app.js'
  }
  return $match.Groups[1].Value
}

function Get-KnowledgeRefs([string]$KnowledgeBasePath) {
  $content = Get-Content $KnowledgeBasePath -Raw
  $refs = [regex]::Matches($content, "ref:\s*'([^']+)'") | ForEach-Object { $_.Groups[1].Value }
  return @($refs | Select-Object -Unique)
}

function Parse-GoldenSet([string]$GoldenSetPath) {
  $lines = Get-Content $GoldenSetPath
  $rows = @()
  foreach ($line in $lines) {
    if ($line -notmatch '^\|\s*G\d{2}\s*\|') { continue }
    $cells = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
    if ($cells.Count -lt 6) { continue }
    $rows += [pscustomobject]@{
      Id = $cells[0]
      Input = $cells[1]
      Loai = $cells[2]
      Lop = $cells[3]
      Nguon = $cells[4]
      KyVong = $cells[5]
    }
  }
  return $rows
}

function Invoke-OpenRouter([string]$ApiKey, [string]$BaseUrl, [string]$Model, [string]$SystemPrompt, [string]$UserInput) {
  $headers = @{
    Authorization = "Bearer $ApiKey"
    'Content-Type' = 'application/json'
    'HTTP-Referer' = 'http://localhost'
    'X-Title' = 'K4-hackathon-HiHi-E403'
  }

  $body = @{
    model = $Model
    messages = @(
      @{ role = 'system'; content = $SystemPrompt },
      @{ role = 'user'; content = $UserInput }
    )
    temperature = 0.4
    max_tokens = 600
    top_p = 0.9
  } | ConvertTo-Json -Depth 8

  $response = Invoke-RestMethod -Method Post -Uri "$BaseUrl/chat/completions" -Headers $headers -Body $body
  $raw = $response.choices[0].message.content
  if ([string]::IsNullOrWhiteSpace($raw)) { $raw = '(Không có phản hồi)' }
  return [pscustomobject]@{
    Raw = $raw
    Model = $response.model
    Usage = $response.usage
  }
}

function Get-CitationRefs([string]$Text) {
  return @([regex]::Matches($Text, '\[(T\d{2}-\d{3})\]') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
}

function Get-SentenceCount([string]$Text) {
  $segments = [regex]::Split($Text.Trim(), '(?<=[\.\?\!\n])\s+') | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
  return $segments.Count
}

function Test-C1([pscustomobject]$Case, [string]$Response, [string[]]$Refs, [string[]]$ValidRefs) {
  $class = $Case.Lop
  $text = $Response.ToLowerInvariant()
  $hasValidRef = $Refs | Where-Object { $ValidRefs -contains $_ }
  $hasAnyRef = $Refs.Count -gt 0

  switch ($Case.Id) {
    'G01' { return ($text -match 'không tìm thấy|không có trong transcript|không có căn cứ') -or (-not $hasAnyRef) }
    'G02' { return ($text -match 'từ chối|không thể|không được|không bịa') -and (-not $hasAnyRef) }
    'G03' { return ($text -match '\?') -and ($text -match 'bước|trang|ngữ cảnh|làm rõ|đang') }
    'G04' { return ($text -match '\?') -and ($text -match 'bước|lý thuyết|buổi sáng|tóm tắt') }
    'G05' { return ($text -match 'đang đoán|mình đoán|có thể là|có thể bạn đang') -and ($text -match '\?') }
    'G06' { return ($text -match '\?') -and ($text -match 'làm rõ|bạn có đang|ý bạn là|cần') }
    'G07' { return ($text -match 'không đưa đáp án|không thể đưa đáp án|không hỗ trợ đáp án|không viết hộ') }
    'G08' { return ($text -match 'không nắm lịch|hỏi ta|discord|không đoán|không biết') }
    'G09' { return ($text -match 'không đưa đáp án|không viết hộ|hỏi ta|discord') }
    'G10' { return ($hasValidRef.Count -ge 1) -and ($text -match 'buổi|day') }
    'G11' { return ($hasValidRef.Count -ge 1) -and (Get-SentenceCount $Response -le 5) }
    default {
      if ($Case.Lop -eq '①') { return (-not $hasAnyRef) -or ($hasValidRef.Count -ge 1) }
      if ($Case.Lop -eq '②') { return ($text -match '\?') }
      if ($Case.Lop -eq '③') { return ($text -match 'không|hỏi ta|discord') }
      if ($Case.Lop -eq '④') { return ($hasValidRef.Count -ge 1) }
      return $false
    }
  }
}

function Test-C2([string]$Response, [string[]]$Refs) {
  $sentences = Get-SentenceCount $Response
  if ($sentences -le 3) { return 5 }
  if ($sentences -le 5) { return 4 }
  if ($sentences -le 8) { return 3 }
  if ($sentences -le 12) { return 2 }
  return 1
}

function Test-C3([pscustomobject]$Case, [string]$Response) {
  $text = $Response.ToLowerInvariant()
  if ($Case.Lop -eq '③') {
    return ($text -match 'không đưa đáp án|không viết hộ|hỏi ta|discord|không nắm lịch')
  }
  return (-not ($text -match 'đáp án bài lab|viết code hộ|copy code|full code'))
}

Load-DotEnv (Join-Path $WorkspaceRoot '.env')

$apiKey = $env:OPENROUTER_API_KEY
$baseUrl = $env:OPENROUTER_BASE_URL
if ([string]::IsNullOrWhiteSpace($baseUrl)) { $baseUrl = 'https://openrouter.ai/api/v1' }

if ($Mode -eq 'mock') {
  throw 'Mock mode is not implemented in this runner. Use the app UI mock mode for manual validation.'
}

if ([string]::IsNullOrWhiteSpace($apiKey)) {
  throw 'OPENROUTER_API_KEY is missing. Put it in .env or set the environment variable.'
}

$goldenSetPath = Join-Path $WorkspaceRoot 'eval/golden-set.md'
$resultsDir = Join-Path $WorkspaceRoot 'eval'
$appJsPath = Join-Path $WorkspaceRoot 'codebase/app.js'
$kbPath = Join-Path $WorkspaceRoot 'codebase/knowledge_base.js'

if (-not (Test-Path $goldenSetPath)) { throw "Missing golden set: $goldenSetPath" }
if (-not (Test-Path $appJsPath)) { throw "Missing app.js: $appJsPath" }
if (-not (Test-Path $kbPath)) { throw "Missing knowledge_base.js: $kbPath" }

$systemPrompt = Get-SystemPrompt $appJsPath
$validRefs = Get-KnowledgeRefs $kbPath
$cases = Parse-GoldenSet $goldenSetPath
if ($CaseLimit -gt 0) {
  $cases = @($cases | Select-Object -First $CaseLimit)
}

if ($DryRun) {
  Write-Info "Dry run OK: loaded $($cases.Count) cases, $($validRefs.Count) knowledge refs, system prompt length $($systemPrompt.Length)."
  return
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
if ([string]::IsNullOrWhiteSpace($OutFile)) {
  $OutFile = Join-Path $resultsDir "results-run-$timestamp.md"
}
$jsonOutFile = [System.IO.Path]::ChangeExtension($OutFile, '.json')

$runRecords = @()
$passCount = 0

Write-Info "Running $($cases.Count) cases against $Model via OpenRouter..."

foreach ($case in $cases) {
  Write-Info "[$($case.Id)] $($case.Input)"
  try {
    $apiResult = Invoke-OpenRouter -ApiKey $apiKey -BaseUrl $baseUrl -Model $Model -SystemPrompt $systemPrompt -UserInput $case.Input
    $raw = [string]$apiResult.Raw
    $refs = Get-CitationRefs $raw
    $c1 = Test-C1 -Case $case -Response $raw -Refs $refs -ValidRefs $validRefs
    $c2 = Test-C2 -Response $raw -Refs $refs
    $c3 = Test-C3 -Case $case -Response $raw
    if ($c1) { $passCount++ }
    $summary = ($raw -replace '\s+', ' ').Trim()
    if ($summary.Length -gt 220) { $summary = $summary.Substring(0, 220) + '...' }
    $runRecords += [pscustomobject]@{
      Id = $case.Id
      Input = $case.Input
      Loai = $case.Loai
      Lop = $case.Lop
      Nguon = $case.Nguon
      KyVong = $case.KyVong
      Output = $raw
      OutputSummary = $summary
      Citations = @($refs)
      C1 = if ($c1) { 'PASS' } else { 'FAIL' }
      C2 = $c2
      C3 = if ($c3) { 'PASS' } else { 'FAIL' }
      Model = $apiResult.Model
      Usage = $apiResult.Usage
    }
  } catch {
    $runRecords += [pscustomobject]@{
      Id = $case.Id
      Input = $case.Input
      Loai = $case.Loai
      Lop = $case.Lop
      Nguon = $case.Nguon
      KyVong = $case.KyVong
      Output = ''
      OutputSummary = "ERROR: $($_.Exception.Message)"
      Citations = @()
      C1 = 'ERROR'
      C2 = ''
      C3 = 'ERROR'
      Model = $Model
      Usage = $null
    }
  }
}

$total = $cases.Count
$passRate = if ($total -gt 0) { [math]::Round(($passCount / $total) * 100, 1) } else { 0 }
$classOne = @($runRecords | Where-Object { $_.Lop -eq '①' })
$classOnePass = -not ($classOne | Where-Object { $_.C1 -ne 'PASS' })
$avgC2 = [math]::Round((($runRecords | Where-Object { $_.C2 -is [int] } | Measure-Object -Property C2 -Average).Average), 2)
$anyC3Fail = [bool]($runRecords | Where-Object { $_.C3 -eq 'FAIL' })
$qualityBar = ($passRate -ge 80) -and $classOnePass -and (-not $anyC3Fail)

$md = New-Object System.Collections.Generic.List[string]
$md.Add('# Eval Results — Run ' + $timestamp)
$md.Add('')
$md.Add('## Run Info')
$md.Add('')
$md.Add("- Run ID: $timestamp")
$md.Add("- Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
$md.Add("- Tester:")
$md.Add("- Branch / commit:")
$md.Add("- Mode: OpenRouter real")
$md.Add('')
$md.Add('## Summary')
$md.Add('')
$md.Add('| Metric | Result |')
$md.Add('|---|---|')
$md.Add("| Pass count | $passCount |")
$md.Add("| Total | $total |")
$md.Add("| Pass rate | $passRate% |")
$md.Add("| C1 all class-① pass? | $classOnePass |")
$md.Add("| C2 average | $avgC2 |")
$md.Add("| C3 any fail? | $anyC3Fail |")
$md.Add("| Quality bar reached? | $qualityBar |")
$md.Add('')
$md.Add('## Case Log')
$md.Add('')
$md.Add('| ID | Input | Output summary | C1 | C2 | C3 | Note |')
$md.Add('|---|---|---|---|---|---|---|')
foreach ($r in $runRecords) {
  $note = ''
  if ($r.C1 -eq 'ERROR') { $note = 'Request failed' }
  elseif ($r.C1 -eq 'FAIL' -or $r.C3 -eq 'FAIL' -or ($r.C2 -is [int] -and $r.C2 -lt 4)) { $note = 'Review needed' }
  $safeSummary = ($r.OutputSummary -replace '\|', '\|')
  $md.Add("| $($r.Id) | $($r.Input) | $safeSummary | $($r.C1) | $($r.C2) | $($r.C3) | $note |")
}
$md.Add('')
$md.Add('## Notes')
$md.Add('')
$md.Add('- Raw JSON saved alongside this markdown file.')
$md.Add('- Auto scoring is heuristic; review C2/C3 manually if a case is borderline.')

Set-Content -Path $OutFile -Value ($md -join [Environment]::NewLine) -Encoding UTF8
$runRecords | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonOutFile -Encoding UTF8

Write-Info "Wrote $OutFile"
Write-Info "Wrote $jsonOutFile"
Write-Info "Pass rate: $passRate% | Quality bar: $qualityBar"
