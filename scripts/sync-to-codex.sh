#!/usr/bin/env bash
set -euo pipefail

MODE="link"
FORCE="false"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="${CODEX_HOME:-$HOME/.codex}/skills"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="$2"
      shift 2
      ;;
    --dest)
      DEST_DIR="$2"
      shift 2
      ;;
    --force)
      FORCE="true"
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "link" && "$MODE" != "copy" ]]; then
  echo "--mode must be link or copy" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

for skill_dir in "$ROOT_DIR"/skills/*; do
  [[ -d "$skill_dir" ]] || continue
  [[ -f "$skill_dir/SKILL.md" ]] || continue

  skill_name="$(basename "$skill_dir")"
  target="$DEST_DIR/$skill_name"

  if [[ -e "$target" || -L "$target" ]]; then
    if [[ -L "$target" ]]; then
      current_target="$(readlink "$target")"
      if [[ "$current_target" == "$skill_dir" ]]; then
        echo "already synced: $skill_name"
        continue
      fi
    fi

    if [[ "$FORCE" != "true" ]]; then
      echo "skip existing target: $target" >&2
      continue
    fi

    rm -rf "$target"
  fi

  if [[ "$MODE" == "link" ]]; then
    ln -s "$skill_dir" "$target"
    echo "linked: $skill_name -> $target"
  else
    cp -R "$skill_dir" "$target"
    echo "copied: $skill_name -> $target"
  fi
done
