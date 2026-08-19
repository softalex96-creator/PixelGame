param(
  [string]$RepositoryPath = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
)

$ErrorActionPreference = "Stop"
$ExpectedOriginPattern = "github\.com[:/]softalex96-creator/PixelGame(?:\.git)?$"
$LogDirectory = Join-Path $env:LOCALAPPDATA "PixelGame\sync"
$LogPath = Join-Path $LogDirectory "pixelgame-sync.log"

function Write-SyncLog([string]$Message) {
  New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
  $line = "{0} {1}" -f (Get-Date -Format o), $Message
  Add-Content -Path $LogPath -Value $line
  Write-Host $line
}

try {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not available in PATH. Install Git and run the installer again."
  }
  if (-not (Test-Path (Join-Path $RepositoryPath ".git"))) {
    throw "Repository metadata is missing at '$RepositoryPath'."
  }

  $origin = (& git -C $RepositoryPath remote get-url origin).Trim()
  if ($origin -notmatch $ExpectedOriginPattern) {
    Write-SyncLog "STOPPED: unexpected origin '$origin'. No files were changed."
    exit 4
  }

  $dirty = & git -C $RepositoryPath status --porcelain
  if ($dirty) {
    Write-SyncLog "SKIPPED: uncommitted local changes detected. No files were changed."
    exit 2
  }

  & git -C $RepositoryPath fetch origin main --prune
  $counts = (& git -C $RepositoryPath rev-list --left-right --count HEAD...origin/main).Trim() -split "\s+"
  $ahead = [int]$counts[0]
  $behind = [int]$counts[1]

  if ($ahead -gt 0) {
    Write-SyncLog "SKIPPED: local history is $ahead commit(s) ahead of origin/main. No files were changed."
    exit 3
  }
  if ($behind -eq 0) {
    Write-SyncLog "OK: already synchronized with origin/main."
    exit 0
  }

  & git -C $RepositoryPath merge --ff-only origin/main
  Write-SyncLog "OK: applied $behind fast-forward commit(s) from origin/main."
  exit 0
} catch {
  Write-SyncLog "ERROR: $($_.Exception.Message)"
  exit 1
}
