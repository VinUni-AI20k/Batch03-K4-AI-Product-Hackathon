#!/usr/bin/env bash
# Copy each lab repo's docs/CODELAB.md into content/, named after its frontmatter id.
#
# Coaches author the file in their own lab repo; this makes the site self-contained
# so it can be cloned and deployed without the sibling `repos/` tree. Re-run after
# a coach updates their guide.
set -euo pipefail

REPOS="${1:-../../repos}"
DEST="content"
mkdir -p "$DEST"

shopt -s nullglob
found=0
for md in "$REPOS"/*/docs/CODELAB.md; do
  id=$(grep -m1 '^id:' "$md" | sed 's/^id:[[:space:]]*//; s/"//g' | tr -d "'")
  if [ -z "$id" ]; then
    echo "BỎ QUA (không có frontmatter id): $md" >&2
    continue
  fi
  cp "$md" "$DEST/$id.md"
  echo "  $id.md  ←  $md"
  found=$((found + 1))
done

[ "$found" -gt 0 ] || { echo "Không tìm thấy docs/CODELAB.md nào trong $REPOS" >&2; exit 1; }
echo "Đã sync $found codelab."
