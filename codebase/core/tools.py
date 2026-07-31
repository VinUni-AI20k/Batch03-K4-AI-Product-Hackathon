# core/tools.py
from core.pdf_processor import read_slide_page_real

def load_slide_content(day_code: str, page_num: int) -> str:
    """
    Đọc nội dung của một trang slide từ tài liệu Day 1 hoặc Day 2.
    - day_code: Chỉ nhận giá trị 'd1' (Day 1) hoặc 'd2' (Day 2).
    - page_num: Số trang cần đọc (bắt đầu từ 1).
    """
    # Chuẩn hóa day_code tường minh, tránh âm thầm gán nhầm khi giá trị lạ
    normalized = str(day_code).strip().lower()
    if normalized in ("d1", "1", "day1", "day 1"):
        code = "d1"
    elif normalized in ("d2", "2", "day2", "day 2"):
        code = "d2"
    else:
        return f"LỖI: day_code '{day_code}' không hợp lệ. Chỉ hỗ trợ Day 1 ('d1') hoặc Day 2 ('d2')."

    return read_slide_page_real(code, page_num)


def summarize_day(day_code: str) -> str:
    """
    Tóm tắt toàn bộ nội dung của một Day (tất cả các trang).
    - day_code: Chỉ nhận giá trị 'd1' (Day 1) hoặc 'd2' (Day 2).
    """
    normalized = str(day_code).strip().lower()
    if normalized in ("d1", "1", "day1", "day 1"):
        code = "d1"
    elif normalized in ("d2", "2", "day2", "day 2"):
        code = "d2"
    else:
        return f"LỖI: day_code '{day_code}' không hợp lệ. Chỉ hỗ trợ Day 1 ('d1') hoặc Day 2 ('d2')."

    # Lấy tất cả các trang từ 1 cho đến khi gặp lỗi (trang không tồn tại)
    pages = []
    page_num = 1
    while page_num <= 200:  # safety cap để tránh lặp vô tận
        content = read_slide_page_real(code, page_num)
        # Nếu trang không tồn tại, dừng lại
        if content.startswith("LỖI") or "không tồn tại" in content.lower() or "không hợp lệ" in content.lower():
            break
        pages.append(f"[Trang {page_num}]\n{content}")
        page_num += 1

    if not pages:
        return f"Không tìm thấy nội dung cho Day {code}."

    return "\n\n---\n\n".join(pages)


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
AVAILABLE_TOOLS = [load_slide_content, summarize_day, get_glossary_term]

# Ánh xạ tên hàm để thực thi động khi model yêu cầu gọi tool
TOOL_REGISTRY = {
    "load_slide_content": load_slide_content,
    "summarize_day": summarize_day,
    "get_glossary_term": get_glossary_term
}
