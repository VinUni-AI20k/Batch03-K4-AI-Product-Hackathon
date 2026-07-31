"""Render sơ đồ/mindmap từ code mermaid trong câu trả lời của agent thành FILE để đính kèm.

Web tự render bằng JS; nhưng Discord/Telegram chỉ hiện text -> phải tạo sẵn:
- mindmap  -> HTML tĩnh (tự vẽ cây bằng HTML/CSS, KHÔNG cần JS/CDN) + ảnh PNG (headless Chrome).
- graph TD -> HTML dùng mermaid CDN (mở bằng trình duyệt có mạng sẽ vẽ).

Hàm chính: diagram_attachments(answer, tmpdir) -> (list[path], cleaned_text)
"""
from __future__ import annotations

import html as _html
import os
import re
import shutil
import subprocess
import tempfile

_PAL = ["#F6B33F", "#57C7B8", "#B98CFF", "#FF8A6B", "#5AA9FF", "#5FCF8F", "#F49AC2", "#7FD4E8"]
_MERMAID_RE = re.compile(r"```mermaid\s*\n?([\s\S]*?)```", re.MULTILINE)


def extract_mermaid(text: str) -> str | None:
    m = _MERMAID_RE.search(text or "")
    return m.group(1).strip() if m else None


def strip_mermaid(text: str, note: str) -> str:
    return _MERMAID_RE.sub(note, text or "", count=1).strip()


# ---------- mindmap -> HTML tĩnh ----------
def _parse_mindmap(code: str):
    lines = [l for l in code.split("\n") if l.strip()]
    if lines and lines[0].strip().lower().startswith("mindmap"):
        lines = lines[1:]

    def clean(t: str) -> str:
        t = t.strip()
        t = re.sub(r"^root\s*", "", t)
        t = re.sub(r"\*\*|__", "", t)
        m = re.match(r"^[\(\[\{]+(.+?)[\)\]\}]+$", t)
        if m:
            t = m.group(1)
        return t.strip()

    root = None
    stack: list = []
    for l in lines:
        ind = len(l) - len(l.lstrip())
        node = {"t": clean(l), "k": [], "i": ind}
        while stack and stack[-1]["i"] >= ind:
            stack.pop()
        if stack:
            stack[-1]["k"].append(node)
        else:
            root = node
        stack.append(node)
    return root


def _node_html(n: dict, depth: int, cidx: int) -> str:
    color = "#F6B33F" if depth == 0 else _PAL[cidx % len(_PAL)]
    cls = "pill d0" if depth == 0 else "pill d1" if depth == 1 else "pill d2" if depth == 2 else "pill d3"
    label = f'<span class="{cls}" style="--c:{color}">{_html.escape(n["t"])}</span>'
    kids = "".join(_node_html(c, depth + 1, cidx if depth > 0 else i) for i, c in enumerate(n["k"]))
    return f'<li><div class="item">{label}{("<ul>" + kids + "</ul>") if kids else ""}</div></li>'


_MM_CSS = """
:root{--ink:#0B0C0E;--card:#0E0F13;--line:#2E323A;--paper:#EDEBE6;--muted:#9A9CA3}
html,body{background:var(--ink);margin:0;padding:26px;font-family:-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
.mm2{display:inline-block;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:26px 30px}
.mm2 ul{list-style:none;margin:0;padding:0}
.mm2 .item{display:flex;align-items:center}
.mm2 .item>ul{position:relative;padding-left:32px;display:flex;flex-direction:column;gap:9px}
.mm2 .item>ul::before{content:"";position:absolute;left:15px;top:14px;bottom:14px;width:2px;background:var(--line)}
.mm2 .item>ul>li{position:relative}
.mm2 .item>ul>li::before{content:"";position:absolute;left:15px;top:50%;width:17px;height:2px;background:var(--line)}
.pill{display:inline-block;padding:8px 15px;border-radius:22px;font-size:13px;font-weight:600;white-space:nowrap;line-height:1.2;color:#0B0C0E;background:var(--c);box-shadow:0 3px 12px -5px var(--c)}
.d0{font-size:15px;padding:12px 20px;border-radius:26px}
.d2{color:var(--paper);background:transparent !important;border:1px solid var(--c);box-shadow:none;font-weight:500;font-size:12.5px}
.d3{color:var(--muted);background:transparent !important;border:1px dashed var(--line);box-shadow:none;font-weight:400;font-size:12px}
"""


_PRACTICE_UI = """
<div class="bar">
  <button id="pr">🙈 Luyện nhớ</button>
  <button id="sa" hidden>👁 Hiện hết</button>
  <span id="hint" hidden>chạm từng ô để lộ đáp án</span>
</div>
<style>
.bar{margin:0 0 14px;display:flex;gap:10px;align-items:center}
.bar button{background:#1A1D23;color:#EDEBE6;border:1px solid #2E323A;border-radius:10px;
  padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.bar button:hover{border-color:#F6B33F}
.bar #hint{color:#9A9CA3;font-size:12px}
.practice .pill:not(.d0):not(.shown){filter:blur(7px);cursor:pointer;user-select:none}
.practice .pill:not(.d0):not(.shown):hover{filter:blur(5px)}
</style>
<script>
(function(){
  var mm=document.querySelector('.mm2'),pr=document.getElementById('pr'),
      sa=document.getElementById('sa'),hint=document.getElementById('hint');
  pr.onclick=function(){
    var on=mm.classList.toggle('practice');
    if(!on){mm.querySelectorAll('.pill.shown').forEach(function(p){p.classList.remove('shown')});}
    pr.textContent=on?'✅ Thoát luyện nhớ':'🙈 Luyện nhớ';
    sa.hidden=!on; hint.hidden=!on;
  };
  sa.onclick=function(){mm.querySelectorAll('.pill:not(.d0)').forEach(function(p){p.classList.add('shown')});};
  mm.addEventListener('click',function(e){
    if(!mm.classList.contains('practice'))return;
    var p=e.target.closest('.pill'); if(p&&!p.classList.contains('d0'))p.classList.add('shown');
  });
})();
</script>"""


def build_html(code: str, interactive: bool = True) -> str:
    """Trả về HTML tự chứa. mindmap -> vẽ tĩnh; khác -> nhúng mermaid CDN.
    interactive=True thêm nút '🙈 Luyện nhớ' (che node, chạm để lộ — active recall);
    interactive=False = bản tĩnh sạch cho screenshot PNG (Discord/Telegram, không đổi)."""
    is_mm = code.lstrip().lower().startswith("mindmap")
    if is_mm:
        root = _parse_mindmap(code)
        tree = _node_html(root, 0, 0) if root else "<li>(rỗng)</li>"
        ui = _PRACTICE_UI if interactive else ""
        return (f"<!doctype html><html lang='vi'><head><meta charset='utf-8'>"
                f"<meta name='viewport' content='width=device-width,initial-scale=1'>"
                f"<title>Mindmap — Vlearn Agent</title><style>{_MM_CSS}</style></head>"
                f"<body>{ui}<div class='mm2'><ul>{tree}</ul></div></body></html>")
    # graph TD / khác -> mermaid CDN
    safe = _html.escape(code)
    return ("<!doctype html><html lang='vi'><head><meta charset='utf-8'>"
            "<meta name='viewport' content='width=device-width,initial-scale=1'>"
            "<title>Sơ đồ — Vlearn Agent</title>"
            "<style>body{background:#0B0C0E;margin:0;padding:24px;display:flex;justify-content:center}"
            ".w{background:#0E0F13;border:1px solid #2E323A;border-radius:14px;padding:20px}"
            ".w svg{max-width:100%}</style></head><body><div class='w'><pre class='mermaid'>"
            + safe + "</pre></div>"
            "<script type='module'>import m from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';"
            "m.initialize({startOnLoad:false,theme:'dark',securityLevel:'loose',"
            "themeVariables:{primaryColor:'#1A1D23',primaryTextColor:'#EDEBE6',primaryBorderColor:'#F6B33F',lineColor:'#57C7B8'}});"
            "m.run({querySelector:'.mermaid'});</script></body></html>")


def _find_chrome() -> str | None:
    for p in ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              "/Applications/Chromium.app/Contents/MacOS/Chromium"):
        if os.path.exists(p):
            return p
    return shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chrome")


def render_png(html_str: str, is_mindmap: bool) -> bytes | None:
    """Render HTML tĩnh -> PNG (chỉ chắc ăn cho mindmap thuần HTML). Trả None nếu không được."""
    if not is_mindmap:
        return None  # graph TD cần mermaid async -> screenshot không ổn định, bỏ qua
    chrome = _find_chrome()
    if not chrome:
        return None
    tmp = tempfile.mkdtemp()
    try:
        hp = os.path.join(tmp, "m.html")
        with open(hp, "w", encoding="utf-8") as f:
            f.write(html_str)
        out = os.path.join(tmp, "m.png")
        # Chrome headless GHI ảnh trong ~1-2s rồi có thể TREO lúc thoát -> đặt timeout ngắn,
        # nuốt TimeoutExpired, dọn tiến trình treo, RỒI kiểm tra file đã ghi chưa.
        try:
            subprocess.run(
                [chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                 "--force-device-scale-factor=2", "--window-size=1600,1400",
                 f"--user-data-dir={os.path.join(tmp, 'prof')}", f"--screenshot={out}", "file://" + hp],
                timeout=15, capture_output=True,
            )
        except subprocess.TimeoutExpired:
            pass
        try:
            subprocess.run(["pkill", "-9", "-f", "Chrome.*headless"], capture_output=True, timeout=5)
        except Exception:
            pass
        if not os.path.exists(out):
            return None
        data = open(out, "rb").read()
        try:  # cắt viền đen thừa cho gọn
            import io
            from PIL import Image, ImageChops
            im = Image.open(out).convert("RGB")
            bg = Image.new("RGB", im.size, (11, 12, 14))
            bbox = ImageChops.difference(im, bg).getbbox()
            if bbox:
                pad = 22
                bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                        min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
                buf = io.BytesIO()
                im.crop(bbox).save(buf, "PNG")
                data = buf.getvalue()
        except Exception:
            pass
        return data
    except Exception:
        return None
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def diagram_attachments(answer: str, tmpdir: str) -> tuple[list[str], str]:
    """Nếu answer có ```mermaid -> tạo file (png nếu được + html) trong tmpdir, trả (paths, text_đã_dọn).
    Không có sơ đồ -> ([], answer)."""
    code = extract_mermaid(answer)
    if not code:
        return [], answer
    is_mm = code.lstrip().lower().startswith("mindmap")
    paths: list[str] = []
    # PNG: bản tĩnh sạch (không toolbar) — ảnh gửi Discord/Telegram giữ nguyên như cũ
    png = render_png(build_html(code, interactive=False), is_mm)
    if png:
        pp = os.path.join(tmpdir, "mindmap.png")
        with open(pp, "wb") as f:
            f.write(png)
        paths.append(pp)
    # HTML đính kèm: bản tương tác (có nút 🙈 Luyện nhớ — che node, chạm để lộ)
    hp = os.path.join(tmpdir, "so-do.html")
    with open(hp, "w", encoding="utf-8") as f:
        f.write(build_html(code, interactive=True))
    paths.append(hp)
    note = "📊 *Sơ đồ ở file đính kèm bên dưới* 👇"
    return paths, strip_mermaid(answer, note)
