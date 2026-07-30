def ask_lab_coach(question, current_code=None, error_log=None):
    """
    Tool: Gửi thắc mắc hoặc báo lỗi tới Lab Coach khi AI/Học viên gặp khúc mắc,
    cần sự can thiệp hoặc giải thích thêm từ phía Lab Coach.
    """
    response = {
        "status": "pending_coach_review",
        "question": question,
        "code_snippet": current_code or "Không có code đi kèm",
        "error_details": error_log or "Không có lỗi runtime",
        "message": "Thắc mắc đã được gửi tới Lab Coach Studio để hỗ trợ và duyệt."
    }
    return response
