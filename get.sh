#!/usr/bin/env bash
# Vlearn Agent — cài đặt 1 dòng (macOS / Linux / WSL).
#   curl -fsSL https://raw.githubusercontent.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304/main/get.sh | bash
# Thêm bộ xử lý PDF/PPTX/video (nặng):
#   curl -fsSL .../get.sh | bash -s -- --ingest
set -euo pipefail

REPO="https://github.com/hoangaiecos-boop/K4-hackathon-VLAgent-D304.git"
DIR="${VLEARN_DIR:-$HOME/vlearn-agent}"

say() { printf "\033[1;36m▶ %s\033[0m\n" "$1"; }
err() { printf "\033[1;31m✗ %s\033[0m\n" "$1" >&2; exit 1; }

printf "\033[1;35m🎓 Vlearn Agent — trình cài đặt\033[0m\n"
command -v git >/dev/null || err "Chưa có git. Cài git rồi chạy lại (macOS: xcode-select --install)."
PY=""
for c in python3.12 python3.11 python3; do command -v "$c" >/dev/null && { PY="$c"; break; }; done
[[ -n "$PY" ]] || err "Cần Python >= 3.11 (macOS: brew install python; Ubuntu: apt install python3)."

if [[ -d "$DIR/.git" ]]; then
  say "Đã có ở $DIR — cập nhật bản mới nhất (git pull)"
  git -C "$DIR" pull --ff-only || say "Bỏ qua pull (có thay đổi cục bộ) — dùng bản hiện có."
else
  say "Tải Vlearn Agent về $DIR"
  git clone --depth 1 "$REPO" "$DIR"
fi

cd "$DIR/learning-agent"
say "Chạy trình cài đặt (venv + thư viện + kho kiến thức)"
bash install.sh "$@"

printf "\n\033[1;32m✅ Đã cài xong ở %s/learning-agent\033[0m\n" "$DIR"
printf "Chạy tiếp (copy 3 dòng):\n"
printf "  \033[36mcd %s/learning-agent && source .venv/bin/activate\033[0m\n" "$DIR"
printf "  \033[36mlearning-agent config\033[0m     # chọn provider + dán API key (giao diện mũi tên)\n"
printf "  \033[36mlearning-agent ui\033[0m         # dashboard chat — tự mở trình duyệt (http://127.0.0.1:8321)\n"
printf "                                (hoặc: learning-agent bot — Telegram/Discord)\n"
