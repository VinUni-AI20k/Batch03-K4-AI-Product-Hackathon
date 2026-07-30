# core/tools.py
from core.pdf_processor import read_slide_page_real

def load_slide_content(day_code: str, page_num: int) -> str:
    """
    Đọc nội dung của một trang slide từ tài liệu Day 1 hoặc Day 2.
    - day_code: Chỉ nhận giá trị 'd1' (Day 1) hoặc 'd2' (Day 2).
    - page_num: Số trang cần đọc (bắt đầu từ 1).
    """
    # Chuẩn hóa day_code để khớp với tên file
    code = "d1" if "1" in str(day_code) else "d2"
    return read_slide_page_real(code, page_num)


def get_glossary_term(term: str) -> str:
    """
    Tra cứu định nghĩa chuẩn mực của các thuật ngữ chuyên môn trong khóa học.
    - term: Tên thuật ngữ cần tra cứu (ví dụ: 'agent', 'context rot').
    """
    glossary = {
        "agent": "AI Agent là hệ thống có khả năng tự lên kế hoạch, gọi công cụ (tools) và thực hiện tác vụ lặp để đạt mục tiêu.",
        "context rot": "Tình trạng tích lũy rác (thử sai, quay lui) trong ngữ cảnh làm suy giảm hiệu suất của agent chính."
    }
    definition = glossary.get(term.lower().strip(), "")
    if not definition:
        return f"Không tìm thấy thuật ngữ '{term}' trong từ điển chuyên môn của khóa học."
    return f"[Định nghĩa chuẩn]: {definition}"


# Đăng ký danh sách Tool
AVAILABLE_TOOLS = [load_slide_content, get_glossary_term]

# Ánh xạ tên hàm để thực thi động khi model yêu cầu gọi tool
TOOL_REGISTRY = {
    "load_slide_content": load_slide_content,
    "get_glossary_term": get_glossary_term
}