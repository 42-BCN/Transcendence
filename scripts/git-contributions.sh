#!/usr/bin/env bash

set -u

TARGET_DIR="${1:-.}"
GROUP_BY="${2:-name}" # name | email

TMP_OUTPUT="$(mktemp)"
TMP_FAILURES="$(mktemp)"

cleanup() {
  rm -f "$TMP_OUTPUT" "$TMP_FAILURES"
}
trap cleanup EXIT INT TERM

echo "Scanning: $TARGET_DIR" >&2
echo "Grouping by: $GROUP_BY" >&2

LC_ALL=C git ls-files -z --cached --exclude-standard -- "$TARGET_DIR" \
  ':(exclude)**/package-lock.json' \
  ':(exclude)**/node_modules/**' \
  ':(exclude)**/*.glb' \
  ':(exclude)**/*.png' \
  ':(exclude)**/*.jpg' \
  ':(exclude)**/*.ico' \
| while IFS= read -r -d '' file; do
    echo "Processing: $file" >&2

    if git blame -w --line-porcelain "$file" 2>/dev/null >> "$TMP_OUTPUT"; then
      :
    else
      echo "$file" >> "$TMP_FAILURES"
      echo "FAILED: $file" >&2
    fi
  done

echo "Results:" >&2
if [ "$GROUP_BY" = "email" ]; then
  awk '
    index($0, "author-mail ") == 1 {
      print substr($0, 13)
    }
  ' "$TMP_OUTPUT" \
  | sort \
  | uniq -c \
  | sort -nr
else
  awk '
    index($0, "author ") == 1 {
      print substr($0, 8)
    }
  ' "$TMP_OUTPUT" \
  | sort \
  | uniq -c \
  | sort -nr
fi

if [ -s "$TMP_FAILURES" ]; then
  echo >&2
  echo "Failed files:" >&2
  cat "$TMP_FAILURES" >&2
fi

#   ':(exclude)docs/**' \
#   ':(exclude)**/*.md' \
#   ':(exclude).*' \
#   ':(exclude)**/.*' \
#   ':(exclude)**/.*/**' \
