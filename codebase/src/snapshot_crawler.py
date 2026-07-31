"""Chuyển template điền tay (xem codebase/data/snapshot_input/template.txt)
thành discord_snapshot JSON đúng schema trong codebase/src/ARCHITECTURE.md.

Không gọi Discord API / không dùng token nào — chỉ parse text do người dùng
tự tay copy từ Discord. Xem hướng dẫn điền tay trong file template.

Usage:
    python codebase/src/snapshot_crawler.py \
        --input codebase/data/snapshot_input/template.txt \
        --output codebase/data/discord_snapshot.json

    # Thêm entry mới vào file JSON đã có, không đánh số lại các entry cũ:
    python codebase/src/snapshot_crawler.py --input new_batch.txt \
        --output codebase/data/discord_snapshot.json --append

    # Chỉ kiểm tra lỗi, không ghi file:
    python codebase/src/snapshot_crawler.py --input template.txt --validate-only
"""

import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Kênh được whitelist -> source_type mặc định. Đây là nơi duy nhất cần sửa
# nếu nhóm thêm/bớt kênh được phép crawl (theo non-goal "không crawl toàn bộ
# Discord" trong PHAN_CONG.md).
CHANNEL_SOURCE_TYPE = {
    "thong-bao": "official",
    "chia-se": "community",
}

ID_PREFIX = "D"
DEFAULT_TZ_OFFSET = "+07:00"
DEFAULT_TZ = timezone(timedelta(hours=7))
URL_PATTERN = re.compile(r"^https://discord\.com/channels/(\d+)/(\d+)/(\d+)$")

# Discord snowflake: 22 bit thấp là mã nội bộ, phần còn lại là số mili-giây kể
# từ Discord Epoch. Nhờ đó lấy được created_at chính xác tới giây trực tiếp
# từ message ID trong url, không cần đọc tooltip hover (chỉ hiện tới phút).
DISCORD_EPOCH_MS = 1420070400000  # 2015-01-01T00:00:00.000Z
CREATED_AT_MISMATCH_TOLERANCE_SEC = 60


def decode_snowflake_created_at(url: str) -> str | None:
    m = URL_PATTERN.match(url.strip())
    if not m:
        return None
    message_id = int(m.group(3))
    timestamp_ms = (message_id >> 22) + DISCORD_EPOCH_MS
    dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc).astimezone(DEFAULT_TZ)
    return dt.isoformat(timespec="seconds")

ENTRY_START = "=== ENTRY ==="
ENTRY_END = "=== END ==="
CONTENT_MARK = "--- CONTENT ---"
COMMENTS_MARK = "--- COMMENTS ---"


class ParseError(Exception):
    pass


def parse_template(text: str) -> list[dict]:
    """Đọc template dạng ENTRY/CONTENT/COMMENTS thành list dict thô (chưa validate)."""
    raw_entries = []
    state = "OUTSIDE"
    header: dict = {}
    content_lines: list[str] = []
    comments: list[str] = []

    def finalize_content():
        header["content"] = "\n".join(content_lines).strip()

    for lineno, raw_line in enumerate(text.splitlines(), start=1):
        stripped = raw_line.strip()

        if stripped == ENTRY_START:
            if state != "OUTSIDE":
                raise ParseError(f"Dòng {lineno}: gặp '{ENTRY_START}' khi entry trước chưa đóng bằng '{ENTRY_END}'.")
            state = "HEADER"
            header = {}
            content_lines = []
            comments = []
            continue

        if state == "OUTSIDE":
            continue  # bỏ qua ghi chú/dòng trống ngoài khối ENTRY

        if stripped == ENTRY_END:
            if state == "HEADER":
                raise ParseError(f"Dòng {lineno}: entry kết thúc trước khi có '{CONTENT_MARK}'.")
            if state == "CONTENT":
                finalize_content()
            header["comments"] = comments
            header["_line"] = lineno
            raw_entries.append(header)
            state = "OUTSIDE"
            continue

        if state == "HEADER":
            if stripped == CONTENT_MARK:
                state = "CONTENT"
                continue
            if ":" not in raw_line:
                raise ParseError(f"Dòng {lineno}: field header phải có dạng 'key: value', nhận '{raw_line}'.")
            key, _, value = raw_line.partition(":")
            header[key.strip()] = value.strip()
            continue

        if state == "CONTENT":
            if stripped == COMMENTS_MARK:
                finalize_content()
                state = "COMMENTS"
                continue
            content_lines.append(raw_line.rstrip())
            continue

        if state == "COMMENTS":
            if stripped.startswith("- "):
                comments.append(stripped[2:].strip())
            elif stripped == "":
                continue
            elif comments:
                comments[-1] = (comments[-1] + " " + stripped).strip()
            else:
                raise ParseError(f"Dòng {lineno}: dòng comment tiếp nối nhưng chưa có comment nào bắt đầu bằng '- '.")
            continue

    if state != "OUTSIDE":
        raise ParseError(f"File kết thúc nhưng entry cuối chưa đóng bằng '{ENTRY_END}'.")

    return raw_entries


def derive_title_from_content(content: str) -> str:
    """Lấy dòng đầu tiên có chữ trong content làm title, bỏ markdown nhấn mạnh (*_# ) hai đầu."""
    for line in content.splitlines():
        cleaned = line.strip().strip("*_# ").strip()
        if cleaned:
            return cleaned if len(cleaned) <= 120 else cleaned[:117] + "..."
    return ""


def next_id_number(existing_ids: set[str]) -> int:
    max_n = 0
    for sid in existing_ids:
        m = re.fullmatch(rf"{re.escape(ID_PREFIX)}(\d+)", sid)
        if m:
            max_n = max(max_n, int(m.group(1)))
    return max_n


def normalize_created_at(value: str) -> str | None:
    v = value.strip()
    try:
        dt = datetime.fromisoformat(v)
    except ValueError:
        return None
    if dt.tzinfo is None:
        v = v + DEFAULT_TZ_OFFSET
        try:
            datetime.fromisoformat(v)
        except ValueError:
            return None
    return v


def build_entries(raw_entries: list[dict], existing_ids: set[str], existing_urls: set[str], redact_map: dict[str, str]):
    entries = []
    errors = []
    warnings = []
    skipped = []
    next_n = next_id_number(existing_ids)
    used_ids = set(existing_ids)

    for raw in raw_entries:
        line = raw.get("_line", "?")
        label = raw.get("title") or f"(dòng {line})"

        channel = raw.get("channel", "").strip()
        title = raw.get("title", "").strip()
        url = raw.get("url", "").strip()
        created_at_raw = raw.get("created_at", "").strip()
        content = raw.get("content", "")

        if not url:
            skipped.append(f"[{label}] bỏ qua vì thiếu url (để trống có chủ đích).")
            continue

        if not channel:
            errors.append(f"[{label}] thiếu field bắt buộc: channel.")
            continue

        if not title:
            title = derive_title_from_content(content)
            if not title:
                errors.append(f"[{label}] thiếu title và content rỗng nên không tự suy ra được title.")
                continue

        source_type = raw.get("source_type", "").strip()
        if not source_type:
            source_type = CHANNEL_SOURCE_TYPE.get(channel)
            if source_type is None:
                errors.append(
                    f"[{label}] channel '{channel}' không nằm trong whitelist "
                    f"({', '.join(CHANNEL_SOURCE_TYPE)}) và không có source_type tường minh. "
                    "Sửa CHANNEL_SOURCE_TYPE trong snapshot_crawler.py nếu đây là kênh hợp lệ mới."
                )
                continue
        elif channel not in CHANNEL_SOURCE_TYPE:
            warnings.append(f"[{label}] channel '{channel}' không nằm trong whitelist đã cấu hình, vẫn dùng source_type tường minh '{source_type}'.")

        if not URL_PATTERN.match(url):
            warnings.append(f"[{label}] url không đúng dạng 'https://discord.com/channels/<guild>/<channel>/<message>': {url}")

        if url in existing_urls:
            warnings.append(f"[{label}] url đã tồn tại trong output, bỏ qua entry trùng.")
            continue

        derived_created_at = decode_snowflake_created_at(url)

        if created_at_raw:
            created_at = normalize_created_at(created_at_raw)
            if created_at is None:
                errors.append(f"[{label}] created_at không parse được: '{created_at_raw}' (dạng đúng: 2026-07-30T09:00:00+07:00).")
                continue
            if derived_created_at is not None:
                diff = abs((datetime.fromisoformat(created_at) - datetime.fromisoformat(derived_created_at)).total_seconds())
                if diff > CREATED_AT_MISMATCH_TOLERANCE_SEC:
                    warnings.append(
                        f"[{label}] created_at gõ tay '{created_at}' lệch {diff:.0f}s so với giờ giải mã thật từ "
                        f"message ID trong url ('{derived_created_at}'). Kiểm tra lại xem có đúng url/thời gian không."
                    )
        elif derived_created_at is not None:
            created_at = derived_created_at
        else:
            errors.append(
                f"[{label}] thiếu created_at và không giải mã được từ url (url không đúng dạng snowflake message link). "
                "Điền tay created_at hoặc kiểm tra lại url."
            )
            continue

        source_id = raw.get("source_id", "").strip()
        if source_id:
            if source_id in used_ids:
                errors.append(f"[{label}] source_id '{source_id}' bị trùng.")
                continue
        else:
            next_n += 1
            source_id = f"{ID_PREFIX}{next_n:03d}"
        used_ids.add(source_id)

        tags = [t.strip() for t in raw.get("tags", "").split(",") if t.strip()]

        comments = [
            {"comment_id": f"{source_id}-C{i:02d}", "content": redact(c, redact_map)}
            for i, c in enumerate(raw.get("comments", []), start=1)
        ]

        entries.append({
            "source_id": source_id,
            "channel": channel,
            "source_type": source_type,
            "title": redact(title, redact_map),
            "content": redact(content, redact_map),
            "comments": comments,
            "url": url,
            "created_at": created_at,
            "tags": tags,
        })
        existing_urls.add(url)

    return entries, errors, warnings, skipped


def redact(text: str, redact_map: dict[str, str]) -> str:
    for name, placeholder in redact_map.items():
        text = re.sub(re.escape(name), placeholder, text, flags=re.IGNORECASE)
    return text


def load_redact_map(path: str | None) -> dict[str, str]:
    if not path:
        return {}
    names = [line.strip() for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip() and not line.strip().startswith("#")]
    return {name: "[ẩn danh]" for name in names}


def main():
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", nargs="+", required=True, help="Một hoặc nhiều file template đã điền tay.")
    parser.add_argument("--output", help="File JSON để ghi kết quả (bỏ qua nếu chỉ --validate-only).")
    parser.add_argument("--append", action="store_true", help="Nếu output đã tồn tại, cộng thêm entry mới thay vì báo lỗi/ghi đè.")
    parser.add_argument("--redact-names", help="File text, mỗi dòng 1 tên cần thay bằng '[ẩn danh]' trong title/content/comments.")
    parser.add_argument("--validate-only", action="store_true", help="Chỉ in báo cáo lỗi/cảnh báo, không ghi file JSON.")
    args = parser.parse_args()

    if not args.validate_only and not args.output:
        parser.error("cần --output, trừ khi chạy --validate-only")

    existing_entries = []
    existing_ids: set[str] = set()
    existing_urls: set[str] = set()
    if args.output and Path(args.output).exists():
        if not args.append and not args.validate_only:
            parser.error(f"{args.output} đã tồn tại. Dùng --append để cộng thêm entry, hoặc đổi --output.")
        if args.append:
            existing_entries = json.loads(Path(args.output).read_text(encoding="utf-8"))
            existing_ids = {e["source_id"] for e in existing_entries}
            existing_urls = {e["url"] for e in existing_entries}

    redact_map = load_redact_map(args.redact_names)

    all_raw = []
    for input_path in args.input:
        text = Path(input_path).read_text(encoding="utf-8")
        try:
            all_raw.extend(parse_template(text))
        except ParseError as e:
            print(f"Lỗi parse cú pháp trong {input_path}: {e}", file=sys.stderr)
            sys.exit(1)

    new_entries, errors, warnings, skipped = build_entries(all_raw, existing_ids, existing_urls, redact_map)

    for s in skipped:
        print(f"BỎ QUA: {s}")
    for w in warnings:
        print(f"CẢNH BÁO: {w}")
    for e in errors:
        print(f"LỖI: {e}", file=sys.stderr)

    print(f"\nĐã parse {len(all_raw)} entry, hợp lệ {len(new_entries)}, bỏ qua {len(skipped)}, lỗi {len(errors)}, cảnh báo {len(warnings)}.")

    if errors:
        print("Sửa các LỖI ở trên trong file template rồi chạy lại. Không ghi file khi còn lỗi.", file=sys.stderr)
        sys.exit(1)

    if args.validate_only:
        return

    final_entries = existing_entries + new_entries
    final_entries.sort(key=lambda e: e["source_id"])

    by_type = {}
    for e in final_entries:
        by_type[e["source_type"]] = by_type.get(e["source_type"], 0) + 1

    Path(args.output).write_text(json.dumps(final_entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = ", ".join(f"{k}: {v}" for k, v in by_type.items())
    print(f"Đã ghi {len(final_entries)} entry ({summary}) -> {args.output}")


if __name__ == "__main__":
    main()
