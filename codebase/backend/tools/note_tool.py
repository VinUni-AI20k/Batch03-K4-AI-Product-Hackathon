import re
from typing import Dict, Any, Optional

class NoteTool:
    """
    Tool phụ trách xử lý và định dạng ghi chú bằng AI cho sinh viên (Note Writing Tool).
    """

    @staticmethod
    def format_note_content(page_number: int, content: str) -> str:
        """
        Định dạng nội dung ghi chú trang slide theo chuẩn Markdown đẹp mắt.
        """
        content_clean = content.strip()
        if not content_clean.startswith("📝") and not content_clean.startswith("📌"):
            return f"📝 **Ghi chú Trang {page_number}**\n- {content_clean}"
        return content_clean

    @staticmethod
    def parse_note_command(llm_response: str) -> Dict[str, Any]:
        """
        Phân tích câu trả lời của LLM để phát hiện thẻ lệnh [WRITE_NOTE: ...] hoặc [NOTE_ACTION: ...].
        Trả về dict chứa thông tin có thực hiện ghi chú hay không và nội dung đã được làm sạch.
        """
        if not llm_response:
            return {"has_note": False, "note_text": "", "clean_response": ""}

        match = re.search(r"\[WRITE_NOTE:\s*([\s\S]*?)\]", llm_response, re.IGNORECASE)
        if match:
            note_text = match.group(1).strip()
            clean_response = re.sub(r"\[WRITE_NOTE:\s*[\s\S]*?\]", "", llm_response, flags=re.IGNORECASE).strip()
            return {
                "has_note": True,
                "note_text": note_text,
                "clean_response": clean_response
            }

        return {
            "has_note": False,
            "note_text": "",
            "clean_response": llm_response.strip()
        }
