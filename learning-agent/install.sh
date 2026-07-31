#!/usr/bin/env bash
# Vlearn Agent — cài đặt trên Linux / macOS / WSL.
# Dùng:  bash install.sh            (cài lõi + voyage)
#        bash install.sh --ingest   (thêm Docling/Whisper để xử lý PDF/PPTX/video — nặng, cần vài GB)
set -euo pipefail

INGEST=0
[[ "${1:-}" == "--ingest" ]] && INGEST=1
cd "$(dirname "$0")"

say() { printf "\033[1;36m▶ %s\033[0m\n" "$1"; }
err() { printf "\033[1;31m✗ %s\033[0m\n" "$1" >&2; exit 1; }

# ── kiểm tra công cụ ──
command -v git >/dev/null || err "Chưa có git. Cài git rồi chạy lại."
PY=""
for c in python3.12 python3.11 python3; do command -v "$c" >/dev/null && { PY="$c"; break; }; done
[[ -n "$PY" ]] || err "Cần Python >= 3.11 (không tìm thấy python3)."
VER=$("$PY" -c 'import sys;print(f"{sys.version_info[0]}.{sys.version_info[1]}")')
say "Python: $PY ($VER)"
command -v ffmpeg >/dev/null || printf "\033[1;33m⚠ Chưa có ffmpeg — cần cho video/ghi âm (brew install ffmpeg / apt install ffmpeg)\033[0m\n"

# ── venv + cài package ──
say "Tạo virtualenv .venv"
"$PY" -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install -q --upgrade pip
say "Cài lõi + Voyage embeddings"
pip install -q -e '.[voyage]'
if [[ "$INGEST" == "1" ]]; then
  say "Cài bộ xử lý tài liệu (Docling/Whisper) — có thể mất vài phút"
  pip install -q -e '.[ingest]'
fi

# ── cấu hình ──
[[ -f .env ]] || { cp .env.example .env && chmod 600 .env; say "Đã tạo .env"; }

# Wizard tương tác: chọn provider bằng mũi tên + dán key (mask ***). Cần bàn phím (/dev/tty)
# vì khi cài qua `curl | bash` thì stdin đang là script, phải trỏ input về terminal thật.
if [ -e /dev/tty ]; then
  say "Cấu hình nhanh (chọn provider LLM + dán API key)"
  learning-agent config </dev/tty || say "Bỏ qua wizard — chạy lại sau: learning-agent config"
else
  say "Không có bàn phím tương tác — cấu hình sau bằng: learning-agent config"
fi

learning-agent onboard || true

cat <<'EOF'

────────────────────────────────────────────────
✅ Cài xong. Kho kiến thức (vault/) có sẵn — lần đầu chạy tự index, dùng được ngay.
   (Đã điền key ở bước trên thì bỏ qua mục 1, chạy thẳng mục 2–3.)

Tiếp theo:
  1. (Nếu chưa điền key) mở .env: LLM key, tuỳ chọn VOYAGE_API_KEY / token bot
  2. Kích hoạt môi trường:   source .venv/bin/activate
  3. Dashboard chat:         learning-agent ui   → http://127.0.0.1:8321
     (hoặc Telegram/Discord: learning-agent bot — lần đầu tự index, chờ chút)
────────────────────────────────────────────────
EOF
