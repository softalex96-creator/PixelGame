#!/usr/bin/env bash
set -euo pipefail

project_path="${1:-$HOME/Documents/MANUS PROJECTS/Project LevelUp/PixelGame}"
repo_url="https://github.com/softalex96-creator/PixelGame.git"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
expected_origin='github\.com[:/]softalex96-creator/PixelGame(\.git)?$'

if ! command -v git >/dev/null 2>&1; then
  printf '%s\n' 'Git is not available in PATH. Install Git, then run this installer again.' >&2
  exit 1
fi

if [[ -e "$project_path" ]]; then
  if [[ ! -d "$project_path/.git" ]]; then
    printf "'%s' exists but is not a Git repository. Choose an empty folder or move its contents first.\n" "$project_path" >&2
    exit 1
  fi
  origin="$(git -C "$project_path" remote get-url origin)"
  if [[ ! "$origin" =~ $expected_origin ]]; then
    printf "Unexpected origin '%s'. No changes were made.\n" "$origin" >&2
    exit 1
  fi
else
  mkdir -p "$(dirname "$project_path")"
  git clone --origin origin --branch main --single-branch "$repo_url" "$project_path"
fi

sync_script="$project_path/tools/local-sync/sync-pixelgame.sh"
chmod +x "$sync_script"
"$sync_script" "$project_path"

if command -v crontab >/dev/null 2>&1; then
  cron_entry="0 * * * * \"$sync_script\" \"$project_path\" # PixelGame GitHub Sync"
  (crontab -l 2>/dev/null | grep -v 'PixelGame GitHub Sync'; printf '%s\n' "$cron_entry") | crontab -
  printf 'Installed hourly PixelGame GitHub Sync cron job. Project path: %s\n' "$project_path"
else
  printf 'Project clone is ready at %s. Install a local scheduler to run this command hourly:\n%s "%s"\n' "$project_path" "$sync_script" "$project_path"
fi
