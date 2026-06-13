param(
  [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

function Fail($Message) {
  throw "EF verification failed: $Message"
}

$indexPath = Join-Path $ProjectRoot "index.html"
$appPath = Join-Path $ProjectRoot "app.js"
$manifestPath = Join-Path $ProjectRoot "public\manifest.json"
$nativeRoot = Join-Path $ProjectRoot "public\native"

foreach ($path in @($indexPath, $appPath, $manifestPath, $nativeRoot)) {
  if (-not (Test-Path -LiteralPath $path)) { Fail "missing $path" }
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.pageCount -ne 137) { Fail "expected 137 pages, found $($manifest.pageCount)" }

$pages = @($manifest.pages)
if ($pages.Count -ne 137) { Fail "manifest pages count is $($pages.Count)" }

$badPageDimensions = @($pages | Where-Object {
  $_.width -lt 3840 -or $_.height -lt 3840
})
if ($badPageDimensions.Count) {
  Fail "page assets below 4K-equivalent dimensions: $($badPageDimensions.number -join ', ')"
}

$missingAssets = @()
foreach ($page in $pages) {
  $file = [string]$page.file
  $file = $file.Split("?")[0] -replace "/", "\"
  $assetPath = Join-Path (Join-Path $ProjectRoot "public") $file
  if (-not (Test-Path -LiteralPath $assetPath)) { $missingAssets += $page.number }
}
if ($missingAssets.Count) { Fail "missing page assets: $($missingAssets -join ', ')" }

$app = Get-Content -LiteralPath $appPath -Raw
$nativeMatches = [regex]::Matches($app, 'startPage:\s*(\d+),\s*\r?\n\s*endPage:\s*(\d+),[\s\S]*?title:\s*"([^"]+)"')
if ($nativeMatches.Count -lt 60) { Fail "too few native lesson ranges: $($nativeMatches.Count)" }

$covered = New-Object "System.Collections.Generic.HashSet[int]"
foreach ($match in $nativeMatches) {
  [int]$start = $match.Groups[1].Value
  [int]$end = $match.Groups[2].Value
  for ($page = $start; $page -le $end; $page += 1) { [void]$covered.Add($page) }
}

$missingCoverage = @(1..137 | Where-Object { -not $covered.Contains($_) })
if ($missingCoverage.Count) { Fail "pages without native coverage: $($missingCoverage -join ', ')" }

$lessonFiles = @(Get-ChildItem -Path $nativeRoot -Recurse -Filter index.html)
$totalFields = 0
$fixedFields = 0
$freeFields = 0
$noAnswerFields = 0
$modules = 0

foreach ($file in $lessonFiles) {
  $html = Get-Content -LiteralPath $file.FullName -Raw
  $jsonMatch = [regex]::Match($html, '<script id="lesson-json" type="application/json">([\s\S]*?)</script>')
  if (-not $jsonMatch.Success) { continue }
  $modules += 1
  $lesson = $jsonMatch.Groups[1].Value | ConvertFrom-Json
  $fields = @($lesson.fields)
  $totalFields += $fields.Count
  $fixedFields += @($fields | Where-Object { -not $_.free -and -not $_.readonly -and @($_.answers).Count -gt 0 }).Count
  $freeFields += @($fields | Where-Object { $_.free -eq $true }).Count
  $noAnswerFields += @($fields | Where-Object { -not $_.free -and -not $_.readonly -and @($_.answers).Count -eq 0 }).Count
}

if ($modules -lt 60) { Fail "too few native modules with lesson-json: $modules" }
if ($totalFields -lt 2800) { Fail "too few interactive fields: $totalFields" }
if ($fixedFields -lt 2200) { Fail "too few checked answer fields: $fixedFields" }
if ($noAnswerFields -ne 0) { Fail "checked fields without answer keys: $noAnswerFields" }

$index = Get-Content -LiteralPath $indexPath -Raw
if ($index -notmatch "revise78photo1c") { Fail "index does not reference revise78photo1c build" }
if ($app -notmatch "native-answer-reveal") { Fail "single-field reveal controls are missing" }
if ($app -notmatch "native-answer-hint") { Fail "inline correction hints are missing" }

[pscustomobject]@{
  Status = "ok"
  Pages = $pages.Count
  NativeRanges = $nativeMatches.Count
  NativeCoveredPages = $covered.Count
  NativeModules = $modules
  InteractiveFields = $totalFields
  CheckedFields = $fixedFields
  FreeFields = $freeFields
  CheckedFieldsWithoutAnswers = $noAnswerFields
  MinPageWidth = (@($pages | Measure-Object width -Minimum).Minimum)
  MinPageHeight = (@($pages | Measure-Object height -Minimum).Minimum)
}
