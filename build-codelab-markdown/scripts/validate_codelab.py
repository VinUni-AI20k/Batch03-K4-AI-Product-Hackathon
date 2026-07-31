#!/usr/bin/env python3
"""Kiểm docs/CODELAB.md có khớp hợp đồng render của web codelabs không.

Chạy:
    python3 scripts/validate_codelab.py docs/CODELAB.md [--repo-root .]

Exit code 0 = sạch, 1 = có ERROR. WARN không chặn nhưng phải đọc.

Script này thay cho một loạt lệnh grep, vì ba lý do: kết quả không phụ thuộc
người chạy, thông báo lỗi kèm số dòng nên sửa được ngay, và những check cần
đếm hoặc đối chiếu chéo (tổng thời lượng, id trùng, path không tồn tại) thì
grep không làm được.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Hợp đồng với web. Đổi ở đây khi web đổi, đừng sửa lẻ trong từng bài.
# ---------------------------------------------------------------------------

# 19 field, đúng thứ tự này. Thứ tự cố định để diff giữa hai bài đọc được.
FRONTMATTER_FIELDS = [
    "id", "title", "duration", "author", "updated", "category", "description",
    "published", "collection", "format", "day", "preparationTipIds", "level",
    "prerequisites", "outcomes", "supportedOs", "requiredTools", "commonErrors",
    "requiresSubmission",
]
LIST_FIELDS = {
    "preparationTipIds", "prerequisites", "outcomes",
    "supportedOs", "requiredTools", "commonErrors",
}
BOOL_FIELDS = {"published", "requiresSubmission"}
INT_FIELDS = {"duration"}

# Registry component của renderer là đóng: tên nào không có ở đây thì learner
# thấy chữ ":::" trần trên trang.
DIRECTIVES = {"goal", "checkpoint", "caution", "input", "export", "os", "quiz"}

CATEGORIES = {"LLM API", "AI Product", "AI Agent", "Prompt Engineering", "Evaluation"}
LEVELS = {"beginner", "intermediate", "advanced"}

# Động từ chỉ trạng thái trong đầu: không ai kiểm được nên chúng biến outcome
# thành câu trang trí.
UNVERIFIABLE_VERBS = ["hiểu", "nắm được", "nắm vững", "làm quen", "biết về", "tìm hiểu"]

# Từ định tính rỗng khi đứng một mình. Chỉ WARN: "hiệu quả" kèm con số thì giữ.
FILLER_WORDS = [
    "mạnh mẽ", "hiệu quả", "tối ưu", "linh hoạt", "toàn diện",
    "dễ dàng", "chuyên nghiệp", "sâu sắc", "đột phá",
]
FILLER_OPENERS = [
    "hãy cùng", "trong thế giới", "ngày nay", "điều quan trọng cần",
    "chúc bạn", "như bạn có thể thấy", "trước khi bắt đầu, chúng ta cần",
]

SECRET_PATTERNS = [
    (r"sk-[A-Za-z0-9]{20,}", "OpenAI-style API key"),
    (r"AKIA[0-9A-Z]{16}", "AWS access key id"),
    (r"gh[pousr]_[A-Za-z0-9]{30,}", "GitHub token"),
    (r"AIza[0-9A-Za-z_-]{30,}", "Google API key"),
]
LOCAL_PATH_PATTERNS = [
    (r"file:///", "đường dẫn file:// của máy cá nhân"),
    (r"[A-Z]:\\Users", "đường dẫn Windows của máy cá nhân"),
    (r"/home/[a-z][a-z0-9_-]*/", "đường dẫn /home/<user>/ của máy cá nhân"),
    (r"/Users/[A-Za-z][A-Za-z0-9_-]*/", "đường dẫn /Users/<user>/ của máy cá nhân"),
]
PLACEHOLDERS = [r"\bTODO\b", r"\bTBD\b", r"\bFIXME\b", r"\bXXX\b",
                r"\[Name\]", r"\[Member", r"__[A-Z0-9][A-Z0-9_]*__"]

# Emoji: máy thiếu font emoji render nó thành ô vuông rỗng, nên tiêu đề thành
# "□ 4 Cấp Độ...". Khoảng này phủ pictographs + dingbats + variation selector.
EMOJI = re.compile(
    "[\U0001F300-\U0001FAFF☀-➿⬀-⯿️\U0001F000-\U0001F2FF]"
)

# Số dòng tối đa giữa một lệnh và output kỳ vọng của nó. Xa hơn thì learner
# phải ghép hai nguồn thông tin cách nhau trên trang (split-attention).
OUTPUT_LOOKAHEAD = 14

SHELL_LANGS = {"bash", "sh", "shell", "zsh", "powershell", "console", "cmd"}


class Report:
    """Gom lỗi theo mức. ERROR chặn publish, WARN thì phải đọc rồi tự quyết."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warns: list[str] = []

    def error(self, line: int | None, msg: str) -> None:
        self.errors.append(f"{_at(line)}{msg}")

    def warn(self, line: int | None, msg: str) -> None:
        self.warns.append(f"{_at(line)}{msg}")


def _at(line: int | None) -> str:
    return f"dòng {line}: " if line else ""


# ---------------------------------------------------------------------------
# Parse
# ---------------------------------------------------------------------------

def split_frontmatter(text: str) -> tuple[list[str], list[str], int]:
    """Trả (dòng frontmatter, dòng body, offset dòng của body trong file gốc).

    Không dùng PyYAML vì nó không có sẵn ở mọi máy coach, và frontmatter này
    do skill sinh ra nên chỉ có scalar + list, parse tay được an toàn.
    """
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return [], lines, 1
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return lines[1:i], lines[i + 1:], i + 2
    return [], lines, 1


def parse_frontmatter(fm_lines: list[str], rep: Report) -> dict[str, object]:
    """Parse scalar, flow list `[a, b]`, và block list `- item`."""
    data: dict[str, object] = {}
    order: list[str] = []
    current_list: str | None = None

    for idx, raw in enumerate(fm_lines, start=2):
        line = raw.rstrip()
        if not line.strip() or line.strip().startswith("#"):
            continue

        if line.startswith(("  - ", "- ")) and current_list:
            item = line.split("- ", 1)[1].strip()
            values = data[current_list]
            assert isinstance(values, list)
            values.append(_unquote(_strip_comment(item)))
            continue

        m = re.match(r"^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$", line)
        if not m:
            rep.error(idx, f"frontmatter có dòng không parse được: {line!r}")
            continue

        key, rest = m.group(1), _strip_comment(m.group(2).strip())
        order.append(key)
        current_list = None

        if rest == "":
            data[key] = []
            current_list = key
        elif rest.startswith("["):
            data[key] = _parse_flow_list(rest)
        elif rest[0] in "\"'":
            # Có nháy nghĩa là tác giả cố ý muốn chuỗi. `day: "4"` phải ra "4",
            # không phải 4 — nếu không check kiểu sẽ báo sai chỗ đã viết đúng.
            data[key] = _unquote(rest)
        else:
            data[key] = _coerce(rest)

    data["__order__"] = order
    return data


def _strip_comment(value: str) -> str:
    """Bỏ comment `# ...` nhưng giữ `#` nằm trong chuỗi có nháy."""
    out, quote = [], None
    for ch in value:
        if quote:
            if ch == quote:
                quote = None
            out.append(ch)
        elif ch in "\"'":
            quote = ch
            out.append(ch)
        elif ch == "#":
            break
        else:
            out.append(ch)
    return "".join(out).strip()


def _unquote(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def _parse_flow_list(value: str) -> list[str]:
    inner = value.strip()[1:]
    inner = inner[:-1] if inner.endswith("]") else inner
    if not inner.strip():
        return []
    parts, buf, quote = [], [], None
    for ch in inner:
        if quote:
            if ch == quote:
                quote = None
            else:
                buf.append(ch)
        elif ch in "\"'":
            quote = ch
        elif ch == ",":
            parts.append("".join(buf).strip())
            buf = []
        else:
            buf.append(ch)
    parts.append("".join(buf).strip())
    return [p for p in parts if p]


def _coerce(value: str) -> object:
    if value in ("true", "false"):
        return value == "true"
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def mask_code_blocks(body: list[str]) -> list[bool]:
    """True = dòng này nằm trong fenced code block.

    Check prose (mũi tên, từ rỗng, dấu chấm than) phải bỏ qua code, vì `->`
    trong code Python là hợp lệ.
    """
    inside, fence = [], None
    for line in body:
        m = re.match(r"^\s*(`{3,}|~{3,})", line)
        if m and fence is None:
            fence = m.group(1)[0] * 3
            inside.append(True)
            continue
        if m and fence is not None and line.strip().startswith(fence):
            fence = None
            inside.append(True)
            continue
        inside.append(fence is not None)
    return inside


# ---------------------------------------------------------------------------
# Check frontmatter
# ---------------------------------------------------------------------------

def check_frontmatter(fm: dict[str, object], rep: Report) -> None:
    order = fm.get("__order__")
    if not isinstance(order, list) or not order:
        rep.error(1, "không tìm thấy frontmatter. File phải mở bằng `---`.")
        return

    missing = [f for f in FRONTMATTER_FIELDS if f not in order]
    extra = [f for f in order if f not in FRONTMATTER_FIELDS]
    if missing:
        rep.error(None, f"frontmatter thiếu field: {', '.join(missing)}")
    if extra:
        rep.error(None, f"frontmatter có field lạ (web không đọc): {', '.join(extra)}")

    known = [f for f in order if f in FRONTMATTER_FIELDS]
    if known != [f for f in FRONTMATTER_FIELDS if f in known]:
        rep.error(None,
                  "frontmatter sai thứ tự field. Thứ tự đúng: "
                  + " → ".join(FRONTMATTER_FIELDS))

    for field in LIST_FIELDS:
        if field in fm and not isinstance(fm[field], list):
            rep.error(None, f"`{field}` phải là list, đang là {type(fm[field]).__name__}")
    for field in BOOL_FIELDS:
        if field in fm and not isinstance(fm[field], bool):
            rep.error(None, f"`{field}` phải là true/false, không phải chuỗi")
    for field in INT_FIELDS:
        if field in fm and not isinstance(fm[field], int):
            rep.error(None, f"`{field}` phải là số nguyên phút (240), không phải \"4h\"")

    lab_id = fm.get("id")
    if isinstance(lab_id, str) and not re.fullmatch(r"[a-z0-9-]+", lab_id):
        rep.error(None, f"`id` phải là ASCII kebab-case không dấu, đang là {lab_id!r}. "
                        "Web dùng nó làm URL và tên file trong content/.")

    if not isinstance(fm.get("day"), str):
        rep.error(None, "`day` phải là chuỗi (\"3\"), không phải số")

    updated = fm.get("updated")
    if isinstance(updated, str) and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated):
        rep.error(None, f"`updated` phải là YYYY-MM-DD, đang là {updated!r}")

    if fm.get("category") not in CATEGORIES:
        rep.warn(None, f"`category` = {fm.get('category')!r} không thuộc bộ đã chốt "
                       f"({', '.join(sorted(CATEGORIES))}). Trang listing lọc theo nó.")
    if fm.get("level") not in LEVELS:
        rep.warn(None, f"`level` = {fm.get('level')!r} không thuộc {sorted(LEVELS)}")
    if fm.get("format") not in ("steps", "prose"):
        rep.warn(None, "`format` nên là \"steps\" cho lab, \"prose\" cho bài chỉ để đọc")

    desc = fm.get("description")
    if isinstance(desc, str):
        if not 100 <= len(desc) <= 220:
            rep.warn(None, f"`description` dài {len(desc)} ký tự; nhắm 120–200 để card "
                           "listing không bị cắt giữa câu")
        if desc and desc[0].islower():
            rep.warn(None, "`description` nên mở đầu bằng động từ hoa: \"Xây...\", \"Đánh giá...\"")

    for field in ("prerequisites", "outcomes", "commonErrors"):
        values = fm.get(field)
        if isinstance(values, list) and not 3 <= len(values) <= 6:
            rep.warn(None, f"`{field}` có {len(values)} mục; nhắm 3–6")

    outcomes = fm.get("outcomes")
    if isinstance(outcomes, list):
        for item in outcomes:
            low = str(item).lower()
            for verb in UNVERIFIABLE_VERBS:
                if low.startswith(verb) or f" {verb} " in low:
                    rep.error(None, f"outcome không kiểm được: {item!r}. Động từ {verb!r} "
                                    "chỉ trạng thái trong đầu — không ai xác nhận được "
                                    "trong 2 phút. Dùng: Giải thích / Thiết kế / So sánh / "
                                    "Phân tích / Sửa.")
                    break


# ---------------------------------------------------------------------------
# Check body
# ---------------------------------------------------------------------------

def check_page_chrome(body: list[str], offset: int, rep: Report) -> None:
    """Web đã render title/day/duration từ frontmatter — viết lại là hiện hai lần."""
    for i, line in enumerate(body):
        if not line.strip():
            continue
        if line.startswith("# "):
            rep.error(offset + i, "thân bài mở bằng H1. Trang web đã render title từ "
                                  "frontmatter nên learner thấy tiêu đề hai lần. Bắt đầu "
                                  "thẳng bằng khối TL;DR.")
        if re.fullmatch(r"\*\*.+\*\*", line.strip()) and "·" in line and "phút" in line:
            break  # dòng TL;DR hợp lệ
        break

    for i, line in enumerate(body):
        if re.match(r"^#{4,} ", line):
            rep.error(offset + i, "heading H4+ — cấu trúc quá sâu, learner mất chỗ đang đọc")
        if line.startswith("#") and EMOJI.search(line):
            rep.error(offset + i, "emoji trong heading. Máy thiếu font emoji render nó "
                                  "thành ô vuông rỗng, nên tiêu đề thành \"□ ...\".")


def check_directives(body: list[str], offset: int, rep: Report) -> dict[str, int]:
    """Kiểm tên directive, cú pháp đóng mở, và attribute bắt buộc."""
    counts: dict[str, int] = {}
    stack: list[tuple[str, int]] = []
    input_ids: dict[str, int] = {}
    in_code = mask_code_blocks(body)

    for i, line in enumerate(body):
        if in_code[i]:
            continue
        stripped = line.strip()
        if not stripped.startswith(":::"):
            continue
        lineno = offset + i

        if stripped == ":::":
            if stack:
                stack.pop()
            else:
                rep.error(lineno, "`:::` đóng mà không có block nào đang mở")
            continue

        m = re.match(r"^:::([a-zA-Z][a-zA-Z0-9-]*)(\{.*\})?\s*$", stripped)
        if not m:
            rep.error(lineno, f"cú pháp directive sai: {stripped!r}. Đúng là "
                              ":::name{attr=\"value\"} trên một dòng riêng.")
            continue

        name, attrs = m.group(1), m.group(2) or ""
        if name not in DIRECTIVES:
            rep.error(lineno, f"directive `:::{name}` không có trong vocabulary. "
                              f"Renderer là registry đóng — learner sẽ thấy chữ ':::' "
                              f"trần trên trang. Hợp lệ: {', '.join(sorted(DIRECTIVES))}.")
            continue

        counts[name] = counts.get(name, 0) + 1
        stack.append((name, lineno))
        attr_map = dict(re.findall(r'([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"', attrs))

        if name == "input":
            if not attr_map.get("id"):
                rep.error(lineno, ":::input thiếu `id`. Đây là key lưu nội dung learner "
                                  "đã điền; thiếu nó thì reload là mất bài.")
            if not attr_map.get("target"):
                rep.error(lineno, ":::input thiếu `target`. Learner nộp bằng repo GitHub "
                                  "chứ không nộp bằng form, nên mọi ô điền phải khai file "
                                  "đích dạng <path> hoặc <path>#<anchor>.")
            dup_id = attr_map.get("id")
            if dup_id and dup_id in input_ids:
                rep.error(lineno, f"`id=\"{dup_id}\"` trùng với dòng {input_ids[dup_id]}. "
                                  "Hai ô cùng id thì ghi đè nội dung của nhau.")
            elif dup_id:
                input_ids[dup_id] = lineno

        if name == "quiz":
            for required in ("id", "answer"):
                if not attr_map.get(required):
                    rep.error(lineno, f":::quiz thiếu `{required}`")

        if name == "checkpoint":
            title = attr_map.get("title")
            if title and title != "Hoàn thành khi":
                rep.warn(lineno, f':::checkpoint title = {title!r}; cả bộ codelab dùng '
                                 '"Hoàn thành khi" để learner nhận ra khối này ngay')

        if name == "goal" and not attr_map.get("title"):
            rep.error(lineno, ":::goal thiếu `title`. Title là trạng thái đạt được "
                              "(\"Tool chạy đúng, test pass\"), không phải hoạt động.")

    for name, lineno in stack:
        rep.error(lineno, f":::{name} mở mà không có `:::` đóng. Directive thiếu dòng đóng "
                          "thì phần còn lại của bài bị hút vào trong block.")

    if counts.get("input") and not counts.get("export"):
        rep.error(None, f"có {counts['input']} ô `:::input` nhưng không có `:::export`. "
                        "Learner điền xong không có đường đưa nội dung vào repo để nộp.")
    return counts


def check_steps(body: list[str], offset: int, fm: dict[str, object],
                counts: dict[str, int], rep: Report) -> None:
    """Step, mốc thời gian, và tổng thời lượng."""
    in_code = mask_code_blocks(body)
    steps: list[tuple[int, str]] = []
    for i, line in enumerate(body):
        if not in_code[i] and re.match(r"^## \d+\.?\s", line):
            steps.append((offset + i, line.strip()))

    if not steps:
        rep.error(None, "không có step nào. Step là `## <số>. <cụm động từ>`.")
        return

    for lineno, heading in steps:
        if not re.match(r"^## \d+\.?\s+\S", heading):
            rep.warn(lineno, f"heading step nên là `## <số>. <cụm động từ>`: {heading!r}")

    n_goal, n_cp = counts.get("goal", 0), counts.get("checkpoint", 0)
    if n_goal != len(steps):
        rep.error(None, f"{len(steps)} step nhưng {n_goal} `:::goal`. Mỗi step mở bằng "
                        "một goal, nếu không learner không biết đích trước khi làm.")
    if n_cp != len(steps):
        rep.error(None, f"{len(steps)} step nhưng {n_cp} `:::checkpoint`. Step không có "
                        "checkpoint thì learner không tự biết đã xong chưa.")

    # Mốc thời gian: mỗi step khai thời lượng, tổng phải khớp frontmatter.
    minutes: list[int] = []
    for idx, (lineno, _) in enumerate(steps):
        start = lineno - offset
        end = steps[idx + 1][0] - offset if idx + 1 < len(steps) else len(body)
        window = "\n".join(body[start:min(start + 6, end)])
        m = re.search(r"\*\*(\d+)\s*phút", window)
        if m:
            minutes.append(int(m.group(1)))
        else:
            rep.error(lineno, "step không khai thời lượng. Ngay dưới heading cần một dòng "
                              "`**<N> phút · mốc <a>–<b>.**` — learner cần biết mình đang "
                              "ở đâu trên đồng hồ để quyết định bám tiếp hay xin trợ giúp.")

    declared = fm.get("duration")
    if isinstance(declared, int) and len(minutes) == len(steps):
        total = sum(minutes)
        if abs(total - declared) > 15:
            rep.error(None, f"tổng thời lượng các step = {total} phút nhưng `duration` = "
                            f"{declared}. Lệch quá 15 phút thì coach xếp buổi sai và lớp "
                            "bị cắt giữa bài.")

    if isinstance(fm.get("requiresSubmission"), bool) and fm["requiresSubmission"]:
        text = "\n".join(body)
        if "Checklist artifacts" not in text:
            rep.error(None, "`requiresSubmission: true` nhưng thiếu mục "
                            "`### Checklist artifacts bắt buộc` ở step cuối.")
        if ".gitignore" not in text:
            rep.error(None, "`requiresSubmission: true` nhưng không nhắc `.gitignore`. "
                            "Learner cần một bước kiểm để không commit `.env` hoặc PII.")


def check_commands_have_output(body: list[str], offset: int, rep: Report) -> None:
    """Mỗi lệnh phải có output kỳ vọng ngay dưới, hoặc nhãn Coach inference.

    Không có nó thì learner chạy lệnh xong không biết mình đúng hay sai — đây là
    lỗi làm người mới bỏ cuộc nhiều nhất.
    """
    blocks: list[tuple[int, str, int]] = []  # (dòng mở, lang, dòng đóng)
    fence, start, lang = None, 0, ""
    for i, line in enumerate(body):
        m = re.match(r"^\s*(`{3,}|~{3,})\s*([a-zA-Z0-9_+-]*)", line)
        if not m:
            continue
        if fence is None:
            fence, start, lang = m.group(1)[0] * 3, i, m.group(2).lower()
        elif line.strip().startswith(fence):
            blocks.append((start, lang, i))
            fence = None

    for start, lang, end in blocks:
        if lang not in SHELL_LANGS:
            continue
        body_text = "\n".join(body[start + 1:end])
        # Block chỉ có comment hoặc export biến thì không sinh output để đối chiếu.
        if not [l for l in body_text.split("\n")
                if l.strip() and not l.strip().startswith("#")]:
            continue

        window = "\n".join(body[end + 1:min(end + 1 + OUTPUT_LOOKAHEAD, len(body))])
        has_output_block = re.search(r"^\s*(`{3,}|~{3,})", window, re.M) is not None
        has_label = re.search(r"(Kết quả|Output|Coach inference|Terminal hiện)",
                              window, re.I) is not None
        if not (has_output_block and has_label) and not has_label:
            rep.warn(offset + start,
                     "lệnh không có output kỳ vọng ngay dưới. Thêm khối "
                     "`Kết quả đúng:` + fenced block, hoặc nhãn "
                     "`(Coach inference — chưa chạy được vì ...)` nếu chưa chạy được.")


def check_publish_gate(body: list[str], offset: int, fm: dict[str, object],
                       rep: Report) -> None:
    """`published: true` không được đi kèm output kỳ vọng do suy đoán.

    Output là thứ learner dán mắt vào để so xem mình làm đúng chưa; một con số
    suy đoán ở đó làm họ tưởng mình sai. Nhãn giải thích được vì sao chưa chạy,
    nhưng không làm con số đúng lên.
    """
    hits = [(offset + i, line.strip()) for i, line in enumerate(body)
            if "Coach inference" in line]
    if not hits:
        return

    in_code = mask_code_blocks(body)
    on_output = []
    for lineno, text in hits:
        i = lineno - offset
        after = "\n".join(body[i + 1:min(i + 4, len(body))])
        near_block = re.search(r"^\s*(`{3,}|~{3,})", after, re.M) is not None
        if near_block or in_code[i] or re.search(r"Kết quả|Output", text, re.I):
            on_output.append(lineno)

    if fm.get("published") is True and on_output:
        rep.error(None, f"`published: true` nhưng còn {len(on_output)} nhãn `Coach "
                        f"inference` đặt trên output của lệnh (dòng "
                        f"{', '.join(map(str, on_output))}). Giữ `published: false`, giao "
                        "kèm danh sách dòng này để coach chạy một lần rồi dán output thật.")
    elif on_output:
        rep.warn(None, f"{len(on_output)} output kỳ vọng đang là suy đoán (dòng "
                       f"{', '.join(map(str, on_output))}). Coach cần chạy một lần "
                       "rồi dán kết quả thật vào trước khi publish.")


def check_hygiene(body: list[str], offset: int, rep: Report) -> None:
    in_code = mask_code_blocks(body)
    for i, line in enumerate(body):
        lineno = offset + i

        for pattern, label in SECRET_PATTERNS:
            if re.search(pattern, line):
                rep.error(lineno, f"có thể là secret thật ({label}). Xoá và thay bằng "
                                  "placeholder trong `.env.example`.")
        for pattern, label in LOCAL_PATH_PATTERNS:
            if re.search(pattern, line):
                rep.error(lineno, f"{label} — learner copy vào là chạy sai. Dùng path "
                                  "relative từ repo root.")
        for pattern in PLACEHOLDERS:
            if re.search(pattern, line):
                rep.error(lineno, f"còn placeholder chưa điền: {line.strip()[:60]!r}")

        if re.match(r"^\s*-?\s*\[[xX]\]", line):
            rep.error(lineno, "checkbox tick sẵn `[x]`. Learner phải tự tick, đó là hành "
                              "động cam kết — và tick sẵn thì checkpoint mất tác dụng.")

        if in_code[i]:
            continue

        if re.search(r"!\s*$", line) and not line.strip().startswith(("|", ">")):
            rep.warn(lineno, "câu kết bằng dấu chấm than; đổi thành dấu chấm")
        if re.search(r"(->|=>|➔)", line) and "|" not in line:
            rep.warn(lineno, "mũi tên trong prose dùng `→`, không dùng `->` `=>` `➔`")

        low = line.lower()
        for word in FILLER_WORDS:
            if word in low and not re.search(r"\d", line):
                rep.warn(lineno, f"từ định tính rỗng {word!r} không kèm con số. Thay bằng "
                                 "số đo được, hoặc cắt.")
                break
        for opener in FILLER_OPENERS:
            if opener in low:
                rep.warn(lineno, f"mở đầu sáo rỗng {opener!r} — cắt, vào thẳng nội dung")
                break

        for term, definition in re.findall(r'\[([^\]]+)\]\(#glossary\s+"([^"]*)"\)', line):
            if len(definition) > 200:
                rep.warn(lineno, f"định nghĩa glossary cho {term!r} dài {len(definition)} "
                                 "ký tự; tooltip nhỏ nên nó bị cắt giữa câu. Nhắm ~160.")
            if not definition.strip():
                rep.error(lineno, f"glossary tooltip cho {term!r} rỗng")


SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", ".next", "dist"}


def check_paths_exist(body: list[str], offset: int, repo_root: Path, rep: Report) -> None:
    """Path trong backtick phải tồn tại, hoặc được khai là FILE MỚI.

    Nhiều lab đặt code trong một subdir (`starter_v0/`) và guide bảo learner
    `cd` vào đó trước, nên path trong guide đúng theo CWD nhưng không đúng theo
    repo root. Trường hợp đó nói rõ file thật nằm đâu — hữu ích hơn nhiều so với
    báo "không tồn tại" rồi để người đọc tự đi tìm.
    """
    text = "\n".join(body)
    declared_new = set(re.findall(r"FILE MỚI[^\n`]*`([^`]+)`", text))
    declared_new |= set(re.findall(r"`([^`]+)`[^\n]*FILE MỚI", text))

    actual: dict[str, list[str]] = {}
    if repo_root.is_dir():
        for entry in repo_root.rglob("*"):
            if entry.is_file() and not any(p in SKIP_DIRS for p in entry.parts):
                actual.setdefault(entry.name, []).append(
                    str(entry.relative_to(repo_root)))

    seen: dict[str, int] = {}
    for i, line in enumerate(body):
        for path in re.findall(
            r"`([a-zA-Z0-9_][a-zA-Z0-9_./-]*\.(?:py|json|md|csv|ya?ml|txt|toml|env|"
            r"example|mermaid|ipynb|sh|ps1))`", line
        ):
            seen.setdefault(path, offset + i)

    shifted: dict[str, list[str]] = {}  # prefix chung → path trong guide
    missing: list[tuple[int, str]] = []

    for path, lineno in sorted(seen.items()):
        if path in declared_new or (repo_root / path).exists():
            continue
        if path.endswith((".env", ".env.example")) and (repo_root / ".env.example").exists():
            continue

        elsewhere = actual.get(Path(path).name, [])
        prefix = next((p[: -len(path)] for p in elsewhere if p.endswith("/" + path)
                       or p.endswith(path) and p != path), None)
        if prefix:
            shifted.setdefault(prefix.rstrip("/"), []).append(path)
        elif elsewhere:
            rep.warn(lineno, f"`{path}` không khớp path nào trong repo; file cùng tên nằm ở "
                             f"{', '.join(f'`{p}`' for p in elsewhere[:3])}")
        else:
            missing.append((lineno, path))

    # Gộp: cả lab đặt code trong một subdir là một quyết định, không phải 20 lỗi.
    for prefix, paths in sorted(shifted.items()):
        rep.warn(None, f"{len(paths)} path trong guide thiếu tiền tố `{prefix}/` so với gốc "
                       f"repo ({', '.join(f'`{p}`' for p in sorted(paths)[:4])}"
                       f"{', …' if len(paths) > 4 else ''}). Nếu guide đã bảo learner `cd "
                       f"{prefix}` ở step 1 thì đúng rồi — chỉ cần nói rõ một lần. Nếu "
                       "không, learner copy lệnh vào là sai đường dẫn.")

    for lineno, path in missing:
        rep.warn(lineno, f"`{path}` không tồn tại ở đâu trong repo và không được khai "
                         "`FILE MỚI`. Kiểm lại tên, hoặc thêm nhãn FILE MỚI kèm cách tạo.")


# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("codelab", help="đường dẫn tới docs/CODELAB.md")
    parser.add_argument("--repo-root", default=".",
                        help="gốc repo lab, để kiểm path có tồn tại (mặc định: .)")
    parser.add_argument("--quiet-warnings", action="store_true",
                        help="chỉ in ERROR")
    args = parser.parse_args()

    path = Path(args.codelab)
    if not path.is_file():
        print(f"KHÔNG TÌM THẤY: {path}", file=sys.stderr)
        return 1

    text = path.read_text(encoding="utf-8")
    rep = Report()

    fm_lines, body, offset = split_frontmatter(text)
    fm = parse_frontmatter(fm_lines, rep) if fm_lines else {"__order__": []}

    check_frontmatter(fm, rep)
    check_page_chrome(body, offset, rep)
    counts = check_directives(body, offset, rep)
    check_steps(body, offset, fm, counts, rep)
    check_commands_have_output(body, offset, rep)
    check_publish_gate(body, offset, fm, rep)
    check_hygiene(body, offset, rep)
    check_paths_exist(body, offset, Path(args.repo_root), rep)

    if rep.errors:
        print(f"ERROR ({len(rep.errors)}) — phải sửa hết trước khi giao:")
        for err in rep.errors:
            print(f"  - {err}")
    if rep.warns and not args.quiet_warnings:
        print(f"\nWARN ({len(rep.warns)}) — đọc rồi tự quyết giữ hay sửa:")
        for warn in rep.warns:
            print(f"  - {warn}")

    if rep.errors:
        print(f"\nFAIL: {len(rep.errors)} error, {len(rep.warns)} warn.")
        return 1
    print(f"\nPASS: 0 error, {len(rep.warns)} warn.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
