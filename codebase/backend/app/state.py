"""
state.py
--------
Định nghĩa State dùng trong LangGraph cho từng loại agent.
Team chỉ cần thêm field nếu cần lưu thêm dữ liệu trung gian giữa các node
(ví dụ: kết quả retrieval, kết quả validate, số lần retry...).
"""

from typing import TypedDict, Optional, Any


class BaseAgentState(TypedDict, total=False):
    # ---- input ----
    index: int
    raw_content: str          # content thô lấy từ outline block

    # ---- xử lý trung gian (team tự bổ sung khi cần) ----
    parsed_context: Optional[str]   # vd: sau khi làm sạch / trích ý chính từ raw_content
    draft_output: Optional[Any]     # kết quả model sinh ra trước khi validate
    retry_count: int                # đếm số lần agent tự retry nếu output không đạt chuẩn
    is_valid: bool                  # cờ đánh dấu output đã qua validate chưa

    # ---- output cuối cùng ----
    final_output: Optional[Any]     # sẽ map sang QuizOutput / SlideOutput / ... trước khi trả API