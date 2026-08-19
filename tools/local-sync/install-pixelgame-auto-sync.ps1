param(
  [string]$ProjectPath = (Join-Path $env:USERPROFILE "Documents\MANUS PROJECTS\Project LevelUp\PixelGame"),
  [ValidateRange(1, 24)]
  [int]$IntervalHours = 1
)

$ErrorActionPreference = "Stop"
$RepositoryUrl = "https://github.com/softalex96-creator/PixelGame.git"
$TaskName = "PixelGame GitHub Sync"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not available in PATH. Install Git from https://git-scm.com/downloads, restart PowerShell, then run this installer again."
}

if (Test-Path $ProjectPath) {
  if (-not (Test-Path (Join-Path $ProjectPath ".git"))) {
    throw "'$ProjectPath' already exists but is not a Git repository. Choose an empty folder or move its contents first."
  }
  $origin = (& git -C $ProjectPath remote get-url origin).Trim()
  if ($origin -notmatch "github\.com[:/]softalex96-creator/PixelGame(?:\.git)?$") {
    throw "'$ProjectPath' points to unexpected origin '$origin'. No changes were made."
  }
} else {
  New-Item -ItemType Directory -Path (Split-Path -Parent $ProjectPath) -Force | Out-Null
  & git clone --origin origin --branch main --single-branch $RepositoryUrl $ProjectPath
}

$SyncScript = Join-Path $ProjectPath "tools\local-sync\sync-pixelgame.ps1"
if (-not (Test-Path $SyncScript)) {
  throw "Sync script was not found in '$ProjectPath'. Ensure the clone uses the current PixelGame main branch."
}

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $SyncScript -RepositoryPath $ProjectPath
$TaskCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$SyncScript`" -RepositoryPath `"$ProjectPath`""
& schtasks.exe /Create /TN $TaskName /TR $TaskCommand /SC HOURLY /MO $IntervalHours /F | Out-Host
Write-Host "Installed '$TaskName'. Project path: $ProjectPath"
