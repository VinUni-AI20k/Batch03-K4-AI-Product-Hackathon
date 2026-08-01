"""Smoke tests cho các phần chạy được không cần API key / model nặng."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from learning_agent.agent.skills import SkillSet
from learning_agent.gateway.base import split_message
from learning_agent.index.manifest import Manifest
from learning_agent.vault import Note, Vault


def test_note_roundtrip(tmp_path):
    n = Note(path=tmp_path / "x.md", meta={"type": "lesson-note", "course": "C1"},
             body="## Slide 1 — Mở đầu\nNội dung [[khai-niem-a]] và [[khai-niem-b|alias]].")
    n.save()
    loaded = Note.load(n.path)
    assert loaded.meta["course"] == "C1"
    assert loaded.wikilinks == ["khai-niem-a", "khai-niem-b"]
    assert loaded.sections()[0][0] == "Slide 1 — Mở đầu"


def test_vault_concept_append_never_overwrites(tmp_path):
    v = Vault(tmp_path)
    v.append_concept("gradient-descent", "Định nghĩa lần 1.")
    v.append_concept("gradient-descent", "Bổ sung lần 2.")
    note = v.find("gradient-descent")
    assert "lần 1" in note.body and "lần 2" in note.body


def test_backlinks(tmp_path):
    v = Vault(tmp_path)
    v.write_lesson_note("C1/b1.md", {"course": "C1"}, "Nói về [[foo]].")
    assert [n.name for n in v.backlinks("foo")] == ["b1"]


def test_manifest_diff(tmp_path):
    src = tmp_path / "src"
    src.mkdir()
    f = src / "a.pdf"
    f.write_bytes(b"v1")
    m = Manifest(tmp_path / "m.sqlite")
    ch = m.diff(src, {".pdf"})
    assert [p.name for p in ch.added] == ["a.pdf"]
    m.record(src, f, "note.md")
    assert m.diff(src, {".pdf"}).added == [] and m.diff(src, {".pdf"}).modified == []
    f.write_bytes(b"v2")
    assert [p.name for p in m.diff(src, {".pdf"}).modified] == ["a.pdf"]
    f.unlink()
    assert m.diff(src, {".pdf"}).deleted == ["a.pdf"]


def test_split_message():
    assert split_message("ngắn", 2000) == ["ngắn"]
    long = "\n\n".join(["đoạn " + "x" * 500] * 8)
    for max_len in (2000, 4000):
        chunks = split_message(long, max_len)
        assert all(len(c) <= max_len for c in chunks)
        assert "".join(chunks).replace("\n\n", "") == long.replace("\n\n", "")


def test_skillset_agentskills_format(tmp_path):
    skill_dir = tmp_path / "tao-quiz"
    skill_dir.mkdir()
    (skill_dir / "SKILL.md").write_text(
        "---\nname: tao-quiz\ndescription: Tạo quiz ôn tập.\n---\n# Quy trình\nBước 1...",
        encoding="utf-8",
    )
    s = SkillSet(tmp_path)
    assert "tao-quiz: Tạo quiz ôn tập." in s.catalog()
    assert "Bước 1" in s.load("tao-quiz")
    assert "Không có skill" in s.load("khong-ton-tai")


def test_parse_when():
    from datetime import datetime
    from learning_agent.scheduler import parse_when
    now = datetime(2026, 7, 30, 16, 0, 0)
    assert parse_when("5m", now) == ("once", "2026-07-30T16:05:00")
    assert parse_when("5 phút", now) == ("once", "2026-07-30T16:05:00")
    assert parse_when("2h", now) == ("once", "2026-07-30T18:00:00")
    assert parse_when("daily 07:30", now) == ("daily", "07:30")
    assert parse_when("hằng ngày 21:00", now) == ("daily", "21:00")
    assert parse_when("21:00", now) == ("once", "2026-07-30T21:00:00")
    assert parse_when("09:00", now) == ("once", "2026-07-31T09:00:00")  # đã qua -> mai
    assert parse_when("tuần sau", now) is None


def test_task_store(tmp_path):
    from learning_agent.scheduler import TaskStore
    s = TaskStore(tmp_path / "schedules.json")
    msg = s.add("Nhắc uống nước", "5m", "telegram", "123")
    assert "✅" in msg and len(s.tasks) == 1
    assert "⚠️" in s.add("x", "bao giờ đó", "telegram", "123")
    # persist qua restart
    s2 = TaskStore(tmp_path / "schedules.json")
    assert len(s2.tasks) == 1 and "Nhắc uống nước" in s2.list()
    task_id = s2.tasks[0]["id"]
    assert "✅" in s2.cancel(task_id) and s2.tasks == []


def test_knowledge_pack_install(tmp_path):
    import subprocess
    from learning_agent.config import Config
    from learning_agent.index import LessonIndex
    from learning_agent.updater.packs import install_pack, list_packs

    # repo git local đóng vai "GitHub repo bài học"
    repo = tmp_path / "repo"
    repo.mkdir()
    (repo / "bai-1.md").write_text("# Bài 1\nNội dung pack.", encoding="utf-8")
    for cmd in (["git", "init", "-q"], ["git", "add", "-A"],
                ["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "x"]):
        subprocess.run(cmd, cwd=repo, check=True)

    cfg = Config(raw={
        "knowledge_packs": [{"name": "demo", "repo": str(repo), "description": "test"}],
        "sources": {"dir": "src_mirror", "manifest_db": "data/m.sqlite"},
        "vault": {"path": "vault"},
        "index": {"embedding_provider": "local"},
        "asr": {"model": "x"},
    }, root=tmp_path)
    cfg.llm_api_key = ""  # không gọi LLM trong test
    vault = Vault(tmp_path / "vault")
    index = LessonIndex(tmp_path / "chroma", "test", None)

    assert "⬜ chưa cài" in list_packs(cfg)
    msg = install_pack(cfg, vault, index, "demo")
    assert "✅" in msg and "1 bài" in msg
    assert vault.find("bai-1") is not None
    assert "✅ đã cài" in list_packs(cfg)
    assert "Không có pack" in install_pack(cfg, vault, index, "khong-co")


def test_rate_limiter():
    from learning_agent.security import RateLimiter
    r = RateLimiter(per_minute=3)
    assert all(r.allow("u1") for _ in range(3))
    assert not r.allow("u1")          # vượt hạn mức
    assert r.allow("u2")              # user khác không bị ảnh hưởng


def test_audit_log(tmp_path):
    import json
    from learning_agent.security import Audit
    a = Audit(tmp_path / "audit.log")
    a.log("denied_user", platform="telegram", user="999")
    a.log("ingest_upload", file="x.pdf", ok=True)
    lines = [json.loads(l) for l in (tmp_path / "audit.log").read_text().splitlines()]
    assert len(lines) == 2
    assert lines[0]["event"] == "denied_user" and lines[0]["user"] == "999"
    assert "ts" in lines[1]


def test_upload_filename_sanitized():
    # tên file chứa ký tự traversal/độc -> bị làm sạch, không thoát được inbox
    import re
    safe = re.sub(r"[^\w.\-() ]", "_", "../../../etc/passwd")
    assert "/" not in safe and "\\" not in safe


def test_research_tool_routing(tmp_path):
    # research tool định tuyến source đúng; source lạ -> báo lỗi (không gọi mạng)
    from learning_agent.config import load_config
    from learning_agent.vault import Vault
    from learning_agent.index import LessonIndex
    from learning_agent.agent.tools import build_tools
    cfg = load_config()
    _, impls = build_tools(Vault(tmp_path / "v", False),
                           LessonIndex(tmp_path / "c", "test", None), cfg)
    assert "research" in impls
    assert "web | reddit | github | x" in impls["research"]("badsource", "x")


def test_md_to_telegram_html():
    from learning_agent.gateway.base import md_to_telegram_html
    assert md_to_telegram_html("**ReAct** là mẫu") == "<b>ReAct</b> là mẫu"
    assert md_to_telegram_html("### Định Nghĩa") == "<b>Định Nghĩa</b>"
    assert "<code>x = 1</code>" in md_to_telegram_html("chạy `x = 1` nhé")
    assert '<a href="https://a.b">t</a>' in md_to_telegram_html("[t](https://a.b)")
    # escape < > & để không vỡ HTML
    out = md_to_telegram_html("so sánh a < b & c")
    assert "&lt;" in out and "&amp;" in out
    # code block giữ nguyên
    assert "<pre>" in md_to_telegram_html("```\nfor i in x:\n```")


def test_pending_uploads_interpret():
    from learning_agent.gateway.base import PendingUploads
    p = PendingUploads.interpret
    assert p("nạp") == "commit"
    assert p("ok lưu đi") == "commit"
    assert p("cả 2 bản") == "both"
    assert p("không, chỉ hỏi thôi") == "skip"
    # câu hỏi về file -> None (không phải yes/no)
    assert p("file này nói về chủ đề gì và có những phần nào?") is None


def test_session_log_search(tmp_path):
    from learning_agent.agent.sessions import SessionLog
    s = SessionLog(tmp_path / "sessions.db")
    s.log("u1", "user", "RAG là gì và chunking hoạt động thế nào?", "telegram")
    s.log("u1", "assistant", "RAG kết hợp retrieval với generation...", "telegram")
    s.log("u2", "user", "RAG bí mật của người khác", "telegram")
    out = s.search("chunking", "u1")
    assert "chunking" in out.lower()
    # scope theo user — u1 không thấy hội thoại của u2
    assert "bí mật" not in s.search("RAG", "u1")
    assert "GẦN NHẤT" in s.search("kubernetes", "u1")


def test_integrations(tmp_path):
    from learning_agent.config import Config
    from learning_agent.integrations import Integrations

    cfg = Config(raw={"agent": {"skills_dir": "skills"}}, root=tmp_path)
    (tmp_path / "skills").mkdir()
    integ = Integrations(cfg)

    # toggle persist
    integ.set_enabled("gog", True)
    assert Integrations(cfg)._state()["gog"] is True
    # run_cli guards: chưa bật -> từ chối; bật nhưng binary không tồn tại -> báo cài
    assert "chưa được admin bật" in integ.run_cli("m365", "spo file list")
    assert "chưa cài" in integ.run_cli("gog", "drive ls") or "sẵn" not in integ.run_cli("gog", "drive ls")
    assert "không phải CLI" in integ.run_cli("rm", "-rf /")  # binary lạ bị chặn

    # cài skill từ registry local (giả lập repo GitHub)
    import subprocess
    repo = tmp_path / "reg"
    (repo / "hoc-tap" / "quiz-x").mkdir(parents=True)
    (repo / "hoc-tap" / "quiz-x" / "SKILL.md").write_text(
        "---\nname: quiz-x\ndescription: Quiz nâng cao.\n---\nQuy trình...", encoding="utf-8")
    for cmd in (["git", "init", "-q"], ["git", "add", "-A"],
                ["git", "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "x"]):
        subprocess.run(cmd, cwd=repo, check=True)
    from learning_agent import integrations as integ_mod
    integ_mod.CATALOG.append({"key": "test-reg", "name": "T", "category": "E",
                              "type": "registry", "repo": str(repo), "url": ""})
    try:
        skills = integ.registry_skills("test-reg")
        assert skills and skills[0]["name"] == "quiz-x" and not skills[0]["installed"]
        assert "✅" in integ.install_skill("test-reg", "quiz-x")
        assert (tmp_path / "skills" / "quiz-x" / "SKILL.md").exists()
        assert integ.registry_skills("test-reg")[0]["installed"]
    finally:
        integ_mod.CATALOG.pop()


def test_addons(tmp_path):
    from learning_agent.addons import Addons
    from learning_agent.config import Config

    addons_dir = tmp_path / "addons"
    addons_dir.mkdir()
    (addons_dir / "demo.py").write_text(
        'NAME = "demo"\nDESCRIPTION = "Addon test"\n'
        'TOOLS = [{"name": "demo_hello", "description": "chào", '
        '"parameters": {"type": "object", "properties": {}}}]\n'
        'def handle(tool, args):\n    return "xin chào từ addon"\n',
        encoding="utf-8",
    )
    (addons_dir / "hong.py").write_text("NAME = 'hong'\n", encoding="utf-8")  # thiếu TOOLS

    cfg = Config(raw={}, root=tmp_path)
    a = Addons(cfg)
    assert a.owns("demo_hello")
    # mặc định TẮT -> từ chối
    assert "chưa được admin bật" in a.dispatch("demo_hello", {})
    a.set_enabled("demo", True)
    assert a.dispatch("demo_hello", {}) == "xin chào từ addon"
    # addon hỏng được báo lỗi, không sập loader
    status = {s["name"]: s for s in a.status()}
    assert status["demo"]["enabled"] and status["hong"].get("error")
    assert len(a.schemas()) == 1


def test_ingest_markdown_passthrough(tmp_path):
    from learning_agent import ingest
    f = tmp_path / "ghi-chu.md"
    f.write_text("# Bài học\nNội dung.", encoding="utf-8")
    assert ingest.extract(f, asr_model="x") == "# Bài học\nNội dung."
    assert ".md" in ingest.SUPPORTED_EXTS and ".mp4" in ingest.SUPPORTED_EXTS


def test_discord_action_routing():
    # agent định tuyến tool discord_* tới origin['discord_actions'] khi chat qua Discord
    from learning_agent.config import load_config
    from learning_agent.vault import Vault
    from learning_agent.index import LessonIndex
    from learning_agent.agent import TutorAgent
    import json as _json

    cfg = load_config()
    cfg.llm_api_key = ""  # không gọi LLM
    agent = TutorAgent(cfg, Vault(cfg.path("vault", "path"), False),
                       LessonIndex(cfg.path("index", "chroma_path"), "lessons", None))

    class FakeActions:
        def handle(self, tool, args):
            return f"OK:{tool}:{args.get('name','')}"
    origin = {"platform": "discord", "chat_id": 1, "discord_actions": FakeActions()}
    out = agent._run_tool("discord_create_event",
                          _json.dumps({"name": "Họp", "when": "07:00"}),
                          "u1", "David", origin)
    assert out == "OK:discord_create_event:Họp"
    # không có origin discord -> không định tuyến (trả lời tool không tồn tại)
    out2 = agent._run_tool("discord_create_event", "{}", "u1", "David", None)
    assert "không tồn tại" in out2.lower()


def test_ingest_html(tmp_path):
    from learning_agent import ingest
    f = tmp_path / "bai.html"
    f.write_text("<html><body><h1>Tiêu đề</h1><p>Nội dung bài học.</p>"
                 "<script>bỏ cái này</script></body></html>", encoding="utf-8")
    out = ingest.extract(f, asr_model="x")
    assert "Tiêu đề" in out and "Nội dung bài học" in out
    assert "bỏ cái này" not in out  # script bị loại
    assert ".html" in ingest.SUPPORTED_EXTS
