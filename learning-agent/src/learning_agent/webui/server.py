"""Web UI quản trị agent — dashboard local kiểu Vlearn Agent.

Chỉ bind 127.0.0.1 (máy của admin). Chạy: learning-agent ui
"""
from __future__ import annotations

import json
import time
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
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


class ToggleBody(BaseModel):
    enabled: bool


class InstallBody(BaseModel):
    skill: str


class TaskBody(BaseModel):
    prompt: str
    when: str
    platform: str = "telegram"


def create_app(cfg) -> FastAPI:
    app = FastAPI(title="learning-agent admin")

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

    @app.post("/api/ask")
    def ask(body: AskBody):
        history = [m for m in body.history if m.get("role") in ("user", "assistant")][-12:]
        history.append({"role": "user", "content": body.question})
        trace: list = []
        answer = agent.reply("admin-ui", "Admin", history, trace=trace)
        return {"answer": answer, "trace": trace}

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
    uvicorn.run(create_app(cfg), host=host, port=port, log_level="warning")
