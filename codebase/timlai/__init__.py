"""timlai — trợ lý tìm lại link tài liệu đã đăng trong Discord khoá.

Ba lớp rời nhau, mỗi lớp một module:

    ① bot.py       Discord API   — đọc/gửi tin nhắn, slash command
    ② index.py     Retrieval     — SQLite FTS5, lọc thô ứng viên
    ③ tra_cuu.py   LLM           — chọn tin nhắn đúng nhất, chống bịa

Lớp ③ KHÔNG import discord — nhờ vậy scripts/chay_eval.py gọi được nó
22 lần ngoài Discord để dựng bảng kết quả golden set (rubric R4).
"""

__all__ = ["config", "index", "tra_cuu", "render"]
