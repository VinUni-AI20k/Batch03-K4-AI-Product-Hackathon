"""Web UI quản trị agent — dashboard local kiểu Vlearn Agent.

Chỉ bind 127.0.0.1 (máy của admin). Chạy: learning-agent ui
"""
from __future__ import annotations

import json
import os
import time
from datetime import date
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from pydantic import BaseModel

from .. import __version__
from ..agent import TutorAgent
from ..agent.skills import SkillSet
from ..index import LessonIndex, make_embedder
from ..scheduler import TaskStore
from ..updater.packs import _packs
from ..vault import Vault

START_TIME = time.time()

STATIC = Path(__file__).parent / "index.html"


class AskBody(BaseModel):
    question: str
    history: list[dict] = []  # [{'role','content'}] các lượt trước — chat console giữ ngữ cảnh
    token: str = ""           # token truy cập cho chat public (khớp VLEARN_CHAT_TOKEN)


class ToggleBody(BaseModel):
    enabled: bool


class InstallBody(BaseModel):
    skill: str


class TaskBody(BaseModel):
    prompt: str
    when: str
    platform: str = "telegram"


def create_app(cfg, watch: bool = False) -> FastAPI:
    app = FastAPI(title="learning-agent admin")

    # CORS: cho trang chat public (vd vlearn-agent.vercel.app) gọi /api/ask khi agent
    # được tunnel ra HTTPS. Cấu hình qua VLEARN_CHAT_ORIGINS (phân cách dấu phẩy).
    chat_origins = [o.strip() for o in os.environ.get(
        "VLEARN_CHAT_ORIGINS",
        "https://vlearn-agent.vercel.app,http://localhost:8321,http://127.0.0.1:8321"
    ).split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware, allow_origins=chat_origins,
        allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["*"], allow_credentials=False,
    )

    # Bảo vệ chat PUBLIC (chỉ áp cho request đến QUA tunnel — dashboard localhost miễn nhiễm):
    #   token truy cập + rate-limit theo IP (phút/ngày) + trần tổng/ngày để chặn lạm dụng & đội chi phí LLM.
    CHAT_TOKEN = os.environ.get("VLEARN_CHAT_TOKEN", "").strip()
    RL_MIN = int(os.environ.get("VLEARN_CHAT_RATE_MIN", "6"))     # câu / phút / IP
    RL_DAY = int(os.environ.get("VLEARN_CHAT_RATE_DAY", "40"))    # câu / ngày / IP
    RL_CAP = int(os.environ.get("VLEARN_CHAT_DAILY_CAP", "400"))  # trần tổng câu / ngày (mọi IP)
    _hits: dict[str, list[float]] = {}
    _day = {"date": "", "n": 0}

    def _client_ip(request: Request) -> str:
        return (request.headers.get("cf-connecting-ip")
                or request.headers.get("x-forwarded-for", "").split(",")[0].strip() or "?")

    def chat_gate(request: Request, body_token: str):
        """None nếu qua; JSONResponse nếu bị chặn. Chỉ chặn request đến qua tunnel."""
        via_tunnel = bool(request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for"))
        if not via_tunnel:
            return None
        if CHAT_TOKEN and (request.headers.get("x-chat-token", "") or body_token) != CHAT_TOKEN:
            return JSONResponse({"answer": "🔒 Cần token truy cập để chat với agent. Mở bằng link có token, hoặc bấm ⚙︎ để nhập."}, status_code=401)
        today = str(date.today())
        if _day["date"] != today:
            _day.update(date=today, n=0)
        if _day["n"] >= RL_CAP:
            return JSONResponse({"answer": "⚠️ Bản demo công khai đã đạt giới hạn lượt hỏi hôm nay. Hẹn bạn ngày mai nhé!"}, status_code=429)
        ip = _client_ip(request)
        now = time.time()
        arr = [t for t in _hits.get(ip, []) if now - t < 86400]
        if sum(1 for t in arr if now - t < 60) >= RL_MIN:
            return JSONResponse({"answer": f"⏳ Bạn hỏi hơi nhanh — tối đa {RL_MIN} câu/phút. Chờ chút rồi hỏi lại nha."}, status_code=429)
        if len(arr) >= RL_DAY:
            return JSONResponse({"answer": f"⏳ Bạn đã dùng hết {RL_DAY} câu/ngày cho bản demo công khai. Hẹn mai nhé!"}, status_code=429)
        arr.append(now)
        _hits[ip] = arr
        _day["n"] += 1
        return None

    # KHOÁ TUNNEL (luôn bật, không phụ thuộc VLEARN_UI_TOKEN): request đến QUA tunnel/proxy
    # (có cf-connecting-ip / x-forwarded-for) chỉ được dùng /api/ask (đã có chat_gate).
    # Mọi route quản trị (dashboard, students, history, delete, CLI...) qua tunnel -> 401,
    # trừ khi kèm đúng VLEARN_UI_TOKEN. Localhost thuần không bị ảnh hưởng.
    PUBLIC_TUNNEL_PATHS = {"/api/ask"}

    @app.middleware("http")
    async def _tunnel_guard(request: Request, call_next):
        via_tunnel = bool(request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for"))
        if via_tunnel and request.method != "OPTIONS" and request.url.path not in PUBLIC_TUNNEL_PATHS:
            admin_token = getattr(cfg, "dashboard_token", "")
            supplied = (request.cookies.get("vl_token")
                        or request.headers.get("authorization", "").removeprefix("Bearer ").strip()
                        or request.query_params.get("token", ""))
            if not admin_token or supplied != admin_token:
                return PlainTextResponse(
                    "401 — khu vực quản trị chỉ dùng trên máy chạy agent (localhost). "
                    "Bản public chỉ có API chat.", status_code=401)
        return await call_next(request)

    # Nếu đặt VLEARN_UI_TOKEN: mọi request phải kèm token (cookie / ?token= / Bearer).
    # Dashboard có route xoá dữ liệu, bật CLI, chạy agent — bắt buộc khoá khi mở ngoài localhost.
    token = getattr(cfg, "dashboard_token", "")
    if token:
        @app.middleware("http")
        async def _auth(request: Request, call_next):
            supplied = (request.cookies.get("vl_token")
                        or request.headers.get("authorization", "").removeprefix("Bearer ").strip()
                        or request.query_params.get("token", ""))
            if supplied != token:
                return PlainTextResponse(
                    "401 — cần token. Mở dashboard: /?token=<VLEARN_UI_TOKEN>", status_code=401)
            resp = await call_next(request)
            if request.query_params.get("token") == token:   # ghi cookie để lần sau khỏi nhập lại
                resp.set_cookie("vl_token", token, httponly=True, samesite="strict")
            return resp

    vault = Vault(cfg.path("vault", "path"), False)
    index = LessonIndex(
        cfg.path("index", "chroma_path"),
        cfg.get("index", "collection", default="lessons"),
        make_embedder(cfg),
    )
    agent = TutorAgent(cfg, vault, index)
    store = TaskStore(cfg.root / "data" / "schedules.json")
    if watch:  # sửa vault bằng Obsidian -> RAG tự cập nhật (chỉ khi chạy server thật, không bật trong test)
        from ..updater.watch import start_vault_watcher
        start_vault_watcher(cfg, vault, index)

    @app.get("/", response_class=HTMLResponse)
    def home():
        return STATIC.read_text(encoding="utf-8")

    @app.get("/api/status")
    def status():
        lessons = list(vault.notes("courses"))
        students = list((vault.path / "students").glob("*.md"))
        store.reload()
        home_file = cfg.root / "data" / "home.json"
        home = json.loads(home_file.read_text()) if home_file.exists() else {}
        up = int(time.time() - START_TIME)
        return {
            "version": __version__,
            "model": cfg.get("llm", "model"),
            "provider": cfg.llm_provider,
            "embedding": cfg.get("index", "embedding_provider"),
            "uptime": f"{up // 3600}h {(up % 3600) // 60}m" if up >= 3600 else f"{up // 60}m {up % 60}s",
            "channels": {
                "telegram": bool(cfg.telegram_token),
                "discord": bool(cfg.discord_token),
            },
            "home": home,
            "lessons": len(lessons),
            "chunks": index.collection.count(),
            "students": len(students),
            "tasks": len(store.tasks),
            "static_jobs": cfg.get("schedules", default=None) or [],
        }

    @app.get("/api/skills")
    def skills():
        s = SkillSet(cfg.path("agent", "skills_dir"))
        out = []
        for name, path in s._skill_files().items():
            import frontmatter
            post = frontmatter.load(path)
            out.append({
                "name": name,
                "description": str(post.metadata.get("description", "")).strip(),
                "version": str((post.metadata.get("metadata") or {}).get("version", "")),
            })
        return out

    @app.get("/api/config")
    def config():
        # config.yaml không chứa secrets — secrets nằm trong .env, không trả ra
        return cfg.raw

    # ---------- Ecosystem & Integrations (kiểu Vlearn Agent) ----------
    from ..integrations import Integrations
    integ = Integrations(cfg)

    @app.get("/api/integrations")
    def integrations():
        return integ.status()

    @app.patch("/api/integrations/{key}")
    def toggle_integration(key: str, body: ToggleBody):
        integ.set_enabled(key, body.enabled)
        return {"message": f"{key}: {'bật' if body.enabled else 'tắt'}"}

    @app.get("/api/registry/{key}/skills")
    def registry_skills(key: str):
        result = integ.registry_skills(key)
        return {"error": result} if isinstance(result, str) else result

    @app.post("/api/registry/{key}/install")
    def registry_install(key: str, body: InstallBody):
        return {"message": integ.install_skill(key, body.skill)}

    # ---------- hoàn thiện các module ----------
    @app.get("/api/skill")
    def skill_content(name: str):
        s = SkillSet(cfg.path("agent", "skills_dir"))
        return {"body": s.load(name)}

    @app.delete("/api/skills/{name}")
    def skill_uninstall(name: str):
        import re, shutil
        safe = re.sub(r"[^\w\-]", "", name)
        target = cfg.path("agent", "skills_dir") / safe
        if not target.is_dir() or not (target / "SKILL.md").exists():
            return {"message": f"Không có skill '{safe}'."}
        shutil.rmtree(target)
        return {"message": f"✅ Đã gỡ skill '{safe}'."}

    @app.delete("/api/lesson")
    def lesson_delete(name: str):
        note = vault.find(name)
        courses = (vault.path / "courses").resolve()
        if note is None or courses not in note.path.resolve().parents:
            return {"message": "Chỉ xoá được ghi chú bài học trong courses/."}
        index.remove_note(str(note.path))
        note.path.unlink()
        return {"message": f"✅ Đã xoá bài '{note.name}' khỏi vault + index."}

    @app.delete("/api/students/{sid}")
    def student_delete(sid: str):
        import re
        safe = re.sub(r"[^\w\-]", "", sid)
        p = vault.path / "students" / f"{safe}.md"
        if not p.exists():
            return {"message": f"Không có hồ sơ '{safe}'."}
        p.unlink()
        return {"message": f"✅ Đã xoá hồ sơ học viên {safe}."}

    @app.post("/api/tasks")
    def task_create(body: TaskBody):
        home_file = cfg.root / "data" / "home.json"
        home = json.loads(home_file.read_text()) if home_file.exists() else {}
        chat_id = home.get(body.platform)
        if not chat_id:
            return {"message": f"⚠️ Chưa có home chat cho {body.platform} — nhắn /sethome trong chat trước."}
        store.reload()
        return {"message": store.add(body.prompt, body.when, body.platform, str(chat_id))}

    @app.post("/api/packs/{name}/install")
    def pack_install(name: str, background: BackgroundTasks):
        from ..updater.packs import install_pack
        background.add_task(install_pack, cfg, vault, index, name)
        return {"message": f"⏳ Đang cài/cập nhật pack '{name}' ở nền — theo dõi số bài ở tab Bài học."}

    @app.get("/api/addons")
    def addons_list():
        return agent.addons.status()

    @app.patch("/api/addons/{name}")
    def addon_toggle(name: str, body: ToggleBody):
        agent.addons.set_enabled(name, body.enabled)
        return {"message": f"addon {name}: {'bật' if body.enabled else 'tắt'}"}

    @app.get("/api/lessons")
    def lessons():
        return [
            {
                "name": n.name,
                "course": str(n.meta.get("course", "")),
                "path": str(n.path.relative_to(vault.path)),
                "generated": str(n.meta.get("generated", "")),
                "source": str(n.meta.get("source_file", "")),
            }
            for n in vault.notes("courses")
        ]

    @app.get("/api/lesson")
    def lesson(name: str):
        note = vault.find(name)
        return {"body": note.body if note else "(không tìm thấy)"}

    @app.get("/api/tasks")
    def tasks():
        store.reload()
        return store.tasks

    @app.delete("/api/tasks/{task_id}")
    def cancel_task(task_id: str):
        store.reload()
        return {"message": store.cancel(task_id)}

    @app.get("/api/packs")
    def packs():
        result = []
        for p in _packs(cfg):
            dest = cfg.path("sources", "dir") / "packs" / p["name"]
            result.append({**p, "installed": dest.exists()})
        return result

    @app.get("/api/students")
    def students():
        out = []
        for p in sorted((vault.path / "students").glob("*.md")):
            from ..vault import Note
            n = Note.load(p)
            out.append({"id": p.stem, "name": str(n.meta.get("name", "")), "body": n.body})
        return out

    @app.get("/api/audit")
    def audit(limit: int = 50):
        f = cfg.root / "data" / "audit.log"
        if not f.exists():
            return []
        lines = f.read_text(encoding="utf-8").splitlines()[-limit:]
        return [json.loads(l) for l in reversed(lines)]

    # ── Lịch sử chat (đọc sessions.db — log FTS5 mọi kênh: telegram/discord/web) ──
    def _sessions_ro():
        import sqlite3
        p = cfg.root / "data" / "sessions.db"
        if not p.exists():
            return None
        return sqlite3.connect(f"file:{p}?mode=ro", uri=True)

    @app.get("/api/history/users")
    def history_users():
        conn = _sessions_ro()
        if conn is None:
            return []
        try:
            rows = conn.execute(
                "SELECT user_id, COUNT(*), MAX(ts), "
                "  SUM(CASE WHEN role='user' THEN 1 ELSE 0 END) "
                "FROM turns GROUP BY user_id ORDER BY MAX(ts) DESC").fetchall()
            return [{"id": r[0], "turns": r[1], "last": r[2], "questions": r[3]} for r in rows]
        finally:
            conn.close()

    @app.get("/api/history")
    def history(user: str = "", q: str = "", limit: int = 300):
        conn = _sessions_ro()
        if conn is None:
            return []
        try:
            limit = max(1, min(int(limit), 1000))
            sql = "SELECT ts, user_id, role, content, platform FROM turns"
            cond, params = [], []
            if user:
                cond.append("user_id = ?"); params.append(user)
            if q.strip():
                import re as _re
                clean = _re.sub(r'["\'\^\*\(\)\-:]', " ", q).strip()
                if clean:
                    cond.append("turns MATCH ?"); params.append(f"content: {clean}")
            if cond:
                sql += " WHERE " + " AND ".join(cond)
            sql += " ORDER BY ts DESC LIMIT ?"; params.append(limit)
            rows = conn.execute(sql, params).fetchall()
            # trả tăng dần theo thời gian cho dễ đọc như hội thoại
            return [{"ts": r[0], "user": r[1], "role": r[2], "content": r[3], "platform": r[4]}
                    for r in reversed(rows)]
        except Exception:
            return []
        finally:
            conn.close()

    @app.post("/api/ask")
    def ask(body: AskBody, request: Request):
        blocked = chat_gate(request, body.token)
        if blocked is not None:
            return blocked
        via_tunnel = bool(request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for"))
        history = [m for m in body.history if m.get("role") in ("user", "assistant")][-12:]
        history.append({"role": "user", "content": body.question})
        trace: list = []
        attachments: list = []  # audio/ảnh vừa sinh (tao_am_thanh/tao_anh)
        uid = "chat-public" if via_tunnel else "admin-ui"
        answer = agent.reply(uid, "Khách" if via_tunnel else "Admin", history,
                             trace=trace, attachments=attachments, client_key=_client_ip(request))
        media = []
        for p in attachments:
            try:
                import base64
                from pathlib import Path
                data = Path(p).read_bytes()
                ext = Path(p).suffix.lower()
                mime = {".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg"}.get(ext, "application/octet-stream")
                kind = "audio" if mime.startswith("audio") else "image" if mime.startswith("image") else "file"
                media.append({"kind": kind, "mime": mime, "name": Path(p).name,
                              "data": base64.b64encode(data).decode("ascii")})
            except Exception:
                pass
        return {"answer": answer, "trace": [] if via_tunnel else trace, "media": media}

    return app


def run_ui(cfg, port: int = 8321, host: str = "127.0.0.1") -> None:
    import uvicorn

    if host not in ("127.0.0.1", "localhost") and not getattr(cfg, "dashboard_token", ""):
        raise SystemExit(
            f"❌ Bind ngoài localhost ({host}) mà chưa đặt VLEARN_UI_TOKEN — dashboard sẽ mở toang "
            "(có route xoá dữ liệu, bật CLI). Đặt VLEARN_UI_TOKEN trong .env rồi chạy lại.")
    where = "máy này" if host in ("127.0.0.1", "localhost") else f"{host} (đã khoá bằng token)"
    print(f"Web UI: http://{host}:{port}  (truy cập từ {where})")
    if getattr(cfg, "dashboard_token", ""):
        print("🔒 Dashboard yêu cầu token — mở bằng: http://%s:%s/?token=<VLEARN_UI_TOKEN>" % (host, port))
    # Tự mở trình duyệt để chat ngay (chỉ khi chạy local, không khoá token) — tắt bằng VLEARN_NO_BROWSER=1
    if host in ("127.0.0.1", "localhost") and not os.environ.get("VLEARN_NO_BROWSER"):
        import threading
        import webbrowser
        threading.Timer(1.5, lambda: webbrowser.open(f"http://{host}:{port}")).start()
    uvicorn.run(create_app(cfg, watch=True), host=host, port=port, log_level="warning")
