#!/usr/bin/env bash
set -euo pipefail

repo_path="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
expected_origin='github\.com[:/]softalex96-creator/PixelGame(\.git)?$'
log_dir="${XDG_STATE_HOME:-$HOME/.local/state}/pixelgame"
log_path="$log_dir/pixelgame-sync.log"

write_log() {
  mkdir -p "$log_dir"
  printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" | tee -a "$log_path"
}

if ! command -v git >/dev/null 2>&1; then
  write_log "ERROR: Git is not available in PATH."
  exit 1
fi
if [[ ! -d "$repo_path/.git" ]]; then
  write_log "ERROR: repository metadata is missing at '$repo_path'."
  exit 1
fi

origin="$(git -C "$repo_path" remote get-url origin)"
if [[ ! "$origin" =~ $expected_origin ]]; then
  write_log "STOPPED: unexpected origin '$origin'. No files were changed."
  exit 4
fi
if [[ -n "$(git -C "$repo_path" status --porcelain)" ]]; then
  write_log "SKIPPED: uncommitted local changes detected. No files were changed."
  exit 2
fi

git -C "$repo_path" fetch origin main --prune
read -r ahead behind <<< "$(git -C "$repo_path" rev-list --left-right --count HEAD...origin/main)"
if (( ahead > 0 )); then
  write_log "SKIPPED: local history is $ahead commit(s) ahead of origin/main. No files were changed."
  exit 3
fi
if (( behind == 0 )); then
  write_log "OK: already synchronized with origin/main."
  exit 0
fi

git -C "$repo_path" merge --ff-only origin/main
write_log "OK: applied $behind fast-forward commit(s) from origin/main."
