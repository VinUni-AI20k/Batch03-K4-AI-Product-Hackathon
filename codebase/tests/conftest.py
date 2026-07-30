"""Fixture dùng chung. Test chạy trên index in-memory — không đụng index.db thật."""

import datetime as dt
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from timlai import index  # noqa: E402


def _ngay(truoc: int) -> str:
    return (dt.datetime.now() - dt.timedelta(days=truoc)).isoformat()


@pytest.fixture
def tin_mau() -> list[index.TinNhan]:
    return [
        index.TinNhan(
            id="1001", kenh="ly-thuyet-k3", tac_gia="LabCoach Minh", thoi_diem=_ngay(6),
            url="https://discord.com/channels/1/2/1001",
            noi_dung="Slide buổi 5 — AI Agent: https://drive.google.com/file/d/b5 day05.pdf",
        ),
        index.TinNhan(
            id="1002", kenh="ly-thuyet-k3", tac_gia="LabCoach Minh", thoi_diem=_ngay(20),
            url="https://discord.com/channels/1/2/1002",
            noi_dung="Slide buổi 1 — Giới thiệu LLM: https://drive.google.com/file/d/b1",
        ),
        index.TinNhan(
            id="1003", kenh="lab-k3", tac_gia="LabCoach Hà", thoi_diem=_ngay(12),
            url="https://discord.com/channels/1/2/1003",
            noi_dung="Bài lab 2 — dựng RAG mini: https://codelabs.aithucchien.vn/lab2",
        ),
    ]


@pytest.fixture
def db(tin_mau):
    """Index in-memory đã nạp tin mẫu."""
    conn = index.mo_db(":memory:")
    index.them_nhieu(conn, tin_mau)
    yield conn
    conn.close()
