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


def test_ingest_markdown_passthrough(tmp_path):
    from learning_agent import ingest
    f = tmp_path / "ghi-chu.md"
    f.write_text("# Bài học\nNội dung.", encoding="utf-8")
    assert ingest.extract(f, asr_model="x") == "# Bài học\nNội dung."
    assert ".md" in ingest.SUPPORTED_EXTS and ".mp4" in ingest.SUPPORTED_EXTS
