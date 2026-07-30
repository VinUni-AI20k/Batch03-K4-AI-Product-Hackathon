"""Tools của agent — mỗi tool là 1 hàm + JSON schema cho tool-calling.

Provenance đi xuyên suốt: search trả về course/lesson/heading/video để agent
trích nguồn kiểu "Bài X, slide N, video mm:ss".
"""
from __future__ import annotations

import json
from typing import Any, Callable

from ..index.store import LessonIndex
from ..vault import Vault


def build_tools(vault: Vault, index: LessonIndex, cfg=None) -> tuple[list[dict], dict[str, Callable]]:
    def search_lessons(query: str, course: str = "") -> str:
        hits = index.search(query, top_k=6, course=course or None)
        if not hits:
            return "Không tìm thấy nội dung liên quan trong tài liệu khoá học."
        return json.dumps(
            [
                {
                    "text": h["text"][:1200],
                    "lesson": h["meta"]["lesson"],
                    "course": h["meta"]["course"],
                    "slide": h["meta"]["heading"],
                    "video": h["meta"]["video"],
                }
                for h in hits
            ],
            ensure_ascii=False,
        )

    def get_lesson(name: str) -> str:
        note = vault.find(name)
        if not note:
            names = [n.name for n in vault.notes("courses")]
            return f"Không có bài '{name}'. Các bài hiện có: {', '.join(names[:50])}"
        return f"---meta: {json.dumps(note.meta, ensure_ascii=False, default=str)}---\n{note.body[:20_000]}"

    def get_concept(name: str) -> str:
        note = vault.find(name)
        if not note:
            return f"Chưa có ghi chú khái niệm '{name}'."
        backlinks = [n.name for n in vault.backlinks(name)]
        return f"{note.body[:8_000]}\n\n(Xuất hiện trong: {', '.join(backlinks[:20])})"

    def save_concept(name: str, content: str) -> str:
        vault.append_concept(name, content)
        return f"Đã lưu vào concepts/{name}.md"

    def list_knowledge_packs() -> str:
        from ..updater.packs import list_packs
        return list_packs(cfg) if cfg else "Chưa cấu hình knowledge packs."

    def install_knowledge_pack(name: str) -> str:
        from ..updater.packs import install_pack
        return install_pack(cfg, vault, index, name) if cfg else "Chưa cấu hình knowledge packs."

    schemas = [
        {
            "type": "function",
            "function": {
                "name": "search_lessons",
                "description": "Tìm kiếm ngữ nghĩa trong toàn bộ bài giảng đã index. Luôn dùng tool này trước khi trả lời câu hỏi về nội dung học.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "Câu truy vấn (tiếng Việt)"},
                        "course": {"type": "string", "description": "Lọc theo mã khoá học, bỏ trống = tất cả"},
                    },
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_lesson",
                "description": "Đọc toàn văn một ghi chú bài học theo tên (khi cần tóm tắt/tạo quiz cả bài).",
                "parameters": {
                    "type": "object",
                    "properties": {"name": {"type": "string"}},
                    "required": ["name"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_concept",
                "description": "Đọc ghi chú khái niệm + các bài học nhắc tới nó (backlinks).",
                "parameters": {
                    "type": "object",
                    "properties": {"name": {"type": "string"}},
                    "required": ["name"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "save_concept",
                "description": "Lưu/bổ sung giải thích hay vào ghi chú khái niệm dùng lại cho học viên khác.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "kebab-case, vd 'gradient-descent'"},
                        "content": {"type": "string"},
                    },
                    "required": ["name", "content"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "list_knowledge_packs",
                "description": "Liệt kê các bộ kiến thức học tập (knowledge pack) có thể cài từ GitHub và trạng thái đã cài hay chưa.",
                "parameters": {"type": "object", "properties": {}},
            },
        },
        {
            "type": "function",
            "function": {
                "name": "install_knowledge_pack",
                "description": "Cài/cập nhật một knowledge pack từ GitHub vào tài liệu học tập. CHỈ gọi sau khi học viên xác nhận đồng ý cài.",
                "parameters": {
                    "type": "object",
                    "properties": {"name": {"type": "string", "description": "Tên pack trong danh sách list_knowledge_packs"}},
                    "required": ["name"],
                },
            },
        },
    ]
    impls: dict[str, Callable[..., Any]] = {
        "search_lessons": search_lessons,
        "get_lesson": get_lesson,
        "get_concept": get_concept,
        "save_concept": save_concept,
        "list_knowledge_packs": list_knowledge_packs,
        "install_knowledge_pack": install_knowledge_pack,
    }
    return schemas, impls
