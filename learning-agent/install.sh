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

# Ghi/ghi đè KEY=value trong .env (awk: an toàn với ký tự đặc biệt trong value)
_set_env() {
  local k="$1" v="$2"
  if grep -qE "^${k}=" .env; then
    awk -v k="$k" -v v="$v" 'BEGIN{FS="="} $1==k{print k"="v; next} {print}' .env > .env.tmp && mv .env.tmp .env
  else
    printf '%s=%s\n' "$k" "$v" >> .env
  fi
}
# Hỏi bí mật (ẩn khi gõ), đọc từ /dev/tty để chạy được cả khi cài qua `curl | bash`
_ask() { local v=""; printf "%s" "$1" >/dev/tty; read -rs v </dev/tty; printf "\n" >/dev/tty; printf "%s" "$v"; }

# Điền key ngay trong lúc cài — xong là chat được, không phải mở .env sửa tay
if [[ -r /dev/tty ]] && ! grep -qE '^OPENAI_API_KEY=.+' .env; then
  printf "\n\033[1;35m── Điền API key (dán vào rồi Enter; để trống + Enter = bỏ qua, sửa sau trong .env) ──\033[0m\n" >/dev/tty
  k="$(_ask '1) OpenAI API key (bắt buộc để chat, dạng sk-...): ')"; [[ -n "$k" ]] && { _set_env OPENAI_API_KEY "$k"; say "✓ Đã lưu OPENAI_API_KEY (${#k} ký tự)"; }
  k="$(_ask '2) VOYAGE_API_KEY (Enter = bỏ, dùng embedding local miễn phí): ')"; [[ -n "$k" ]] && { _set_env VOYAGE_API_KEY "$k"; say "✓ Đã lưu VOYAGE_API_KEY"; }
  k="$(_ask '3) TELEGRAM_BOT_TOKEN (Enter nếu không dùng Telegram): ')"; [[ -n "$k" ]] && { _set_env TELEGRAM_BOT_TOKEN "$k"; say "✓ Đã lưu TELEGRAM_BOT_TOKEN"; }
  k="$(_ask '4) DISCORD_BOT_TOKEN (Enter nếu không dùng Discord): ')"; [[ -n "$k" ]] && { _set_env DISCORD_BOT_TOKEN "$k"; say "✓ Đã lưu DISCORD_BOT_TOKEN"; }
  chmod 600 .env
else
  say "Bỏ qua hỏi key (đã có OPENAI_API_KEY hoặc không có bàn phím) — chỉnh trong .env nếu cần."
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
