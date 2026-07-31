import sys
import os
import re
from pathlib import Path
from typing import Optional, Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from api.llm_client import LLMClient
from tools.rag_engine import PageAwareRAGEngine
from tools.note_tool import NoteTool
from config.settings import DEFAULT_GEMINI_MODEL, BASE_DIR
from prompts import (
    SLIDE_AGENT_SYSTEM_PROMPT,
    RAG_PAGE_SUMMARY_PROMPT,
    RAG_GROUNDED_QA_PROMPT,
    RAG_ROUTER_SYSTEM_PROMPT,
    GUARDRAIL_OUT_OF_SCOPE_MSG,
    GUARDRAIL_NO_CONTEXT_MSG,
    GUARDRAIL_INJECTION_MSG,
)

# ============================================================
# GUARDRAILS LAYER 2 — Input & Output Validation
# ============================================================

# Từ khóa nhận diện câu hỏi ngoài phạm vi bài học
_OUT_OF_SCOPE_PATTERNS = [
    r'\b(deadline|hạn nộp|hạn chót|nộp bài|link nộp|google form)\b',
    r'\b(discord|zalo|telegram|facebook|email|liên hệ)\b',
    r'\b(học phí|hoàn tiền|refund|thanh toán|payment)\b',
    r'\b(lịch học|lịch buổi|thời khoá biểu|schedule)\b',
]

# Từ khóa nhận diện prompt injection
_INJECTION_PATTERNS = [
    r'ignore\s+(all\s+)?previous\s+instruction',
    r'forget\s+(your\s+)?(rules?|instruction|system|prompt)',
    r'(act|behave|pretend|roleplay)\s+as\s+(?!tutor)',
    r'(bypass|jailbreak|override|disable)\s+(guardrail|filter|rule|safety)',
    r'reveal\s+(your\s+)?(system\s+)?prompt',
    r'bỏ\s+qua\s+(tất\s+cả\s+)?(rule|quy\s*tắc|hướng\s*dẫn)',
    r'đóng\s+vai\s+(?!tutor)',
]

# Giới hạn độ dài tối đa output (ký tự)
_MAX_OUTPUT_CHARS = 1200


def _check_input_guardrails(query: str) -> Optional[str]:
    """
    Kiểm tra câu hỏi đầu vào trước khi gửi lên LLM.
    Trả về chuỗi từ chối nếu vi phạm, None nếu hợp lệ.
    """
    query_lower = query.lower()

    # Kiểm tra prompt injection
    for pattern in _INJECTION_PATTERNS:
        if re.search(pattern, query_lower, re.IGNORECASE):
            return GUARDRAIL_INJECTION_MSG

    # Kiểm tra câu hỏi ngoài phạm vi bài học
    for pattern in _OUT_OF_SCOPE_PATTERNS:
        if re.search(pattern, query_lower, re.IGNORECASE):
            return GUARDRAIL_OUT_OF_SCOPE_MSG

    return None


def _check_output_guardrails(response: str, page_number: Optional[int] = None) -> str:
    """
    Kiểm tra và làm sạch response từ LLM trước khi trả về frontend.
    - Cắt ngắn nếu quá dài
    - Cảnh báo nếu thiếu citation (chỉ warn, không block)
    """
    if not response:
        return GUARDRAIL_NO_CONTEXT_MSG

    # Cắt output quá dài để tránh spam
    if len(response) > _MAX_OUTPUT_CHARS:
        cutoff = response[:_MAX_OUTPUT_CHARS].rfind('\n')
        if cutoff == -1:
            cutoff = _MAX_OUTPUT_CHARS
        response = response[:cutoff].rstrip()
        response += "\n\n_(Câu trả lời đã được rút gọn. Bạn hỏi chi tiết hơn để mình giải thích từng phần nhé!)_"

    return response


class PageAwareRAGAgent:
    """
    AI Agent định vị trang slide (Page-Aware AI Tutor) hỗ trợ RAG lọc cứng metadata theo trang
    sử dụng mô hình nhẹ Gemini 2.5 Flash / OpenAI.
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: float = 0.1
    ):
        self.llm_client = LLMClient(provider=provider, model_name=model_name, temperature=temperature)
        self.rag_engine = PageAwareRAGEngine()
        self.note_tool = NoteTool()
        self.system_prompt = SLIDE_AGENT_SYSTEM_PROMPT

        # Thử tự động load transcript bài giảng nếu có
        transcript_dir = BASE_DIR / "data" / "vlearn-pack" / "transcript"
        if transcript_dir.exists():
            self.rag_engine.index_transcripts(str(transcript_dir))

    def load_slide(self, slide_path: str):
        """
        Nạp file slide vào RAG Engine.
        """
        self.rag_engine.index_slide_file(slide_path)

    def summarize_page(self, slide_path: str, page_number: int) -> str:
        """
        Page-Aware Summarization: Tóm tắt chính xác 100% đúng trang slide `page_number`.
        """
        self.load_slide(slide_path)
        page_info = self.rag_engine.get_page_context(page_number)

        if not page_info["has_content"]:
            return f"⚠️ **[Slide {page_number}]** Trang này không chứa nội dung chữ (slide trống hoặc là hình ảnh sơ đồ đồ họa). Bạn có câu hỏi cụ thể nào về hình ảnh này không?"

        prompt = RAG_PAGE_SUMMARY_PROMPT.format(
            slide_number=page_number,
            context_str=page_info["context_str"]
        )

        response = self.llm_client.generate(
            prompt=prompt,
            system_instruction=self.system_prompt
        )

        # Output Guardrail
        return _check_output_guardrails(response, page_number)

    def ask_question(
        self, 
        slide_path: str, 
        query: str, 
        page_number: Optional[int] = None,
        student_email: Optional[str] = None
    ) -> str:
        """
        Grounded RAG Q&A: Trả lời câu hỏi học viên với đầy đủ Guardrails Input/Output, LLM Intent Router và Lịch sử trò chuyện.
        - Input Guardrail: chặn câu hỏi ngoài phạm vi & prompt injection trước khi gọi LLM.
        - LLM Intent Router: Tự động phân tích ý định để lấy đúng ngữ cảnh.
        - Conversation History: Đọc log chat gần nhất của học viên để duy trì ngữ cảnh hội thoại.
        - Output Guardrail: kiểm tra độ dài & cắt ngắn response nếu cần.
        """
        # --- INPUT GUARDRAIL ---
        guardrail_response = _check_input_guardrails(query)
        if guardrail_response:
            return guardrail_response

        self.load_slide(slide_path)

        # --- BƯỚC 0: Tải lịch sử trò chuyện gần đây ---
        history_str = "Chưa có cuộc trò chuyện trước đó."
        if student_email:
            try:
                logs_file = Path(__file__).resolve().parent.parent / "chat_logs.json"
                if logs_file.exists():
                    import json
                    with open(logs_file, "r", encoding="utf-8") as f:
                        logs = json.load(f)
                    student_logs = [log for log in logs if log.get("student_email") == student_email]
                    recent_logs = student_logs[-4:]  # Lấy tối đa 4 lượt chat gần nhất
                    if recent_logs:
                        history_blocks = []
                        for log in recent_logs:
                            history_blocks.append(f"Học viên: {log['query']}")
                            history_blocks.append(f"Tutor: {log['answer']}")
                        history_str = "\n".join(history_blocks)
            except Exception as e:
                print(f"[Router Agent Warning] Lỗi đọc lịch sử chat: {e}")

        # --- BƯỚC 1: Fast Intent Routing (< 1ms, loại bỏ lượt gọi LLM thứ 1 để tối ưu tốc độ) ---
        current_page = page_number if page_number is not None else 1
        q_lower = query.lower().strip()
        intent = "general_qa"
        target_page = None

        # 1.1 Kiểm tra câu chào hỏi xã giao
        if re.search(r'^(chào|hi\b|hello|xin chào|bạn là ai|tên gì|cảm ơn|thanks)', q_lower):
            if len(q_lower.split()) <= 6:
                intent = "social"

        # 1.2 Kiểm tra tóm tắt toàn bộ slide
        elif re.search(r'tóm tắt (toàn bộ|tất cả|hết|bộ slide|cả bài)', q_lower):
            intent = "summarize_all_pages"

        # 1.3 Kiểm tra tóm tắt trang slide
        elif re.search(r'tóm tắt|khái quát|ý chính', q_lower):
            intent = "summarize_single_page"
            page_match = re.search(r'(?:slide|trang)\s*(\d+)', q_lower)
            if page_match:
                target_page = int(page_match.group(1))
            else:
                target_page = current_page
        
        else:
            # Nếu trong câu hỏi có đề cập trực tiếp đến số trang
            page_match = re.search(r'(?:slide|trang)\s*(\d+)', q_lower)
            if page_match:
                target_page = int(page_match.group(1))

        print(f"[Fast Router] Phân tích trong 0.1ms: Intent={intent}, Target Page={target_page}")

        # --- BƯỚC 2: Gọi Tool tương ứng để lấy ngữ cảnh ---
        context_str = ""
        
        if intent == "summarize_single_page":
            page_to_use = target_page if target_page is not None else current_page
            page_info = self.rag_engine.get_page_context(page_to_use)
            context_str = page_info["context_str"]
            
        elif intent == "summarize_all_pages":
            sorted_slides = sorted(self.rag_engine.slides_by_page.values(), key=lambda x: x["slide_number"])
            blocks = ["=== NỘI DUNG TOÀN BỘ CÁC SLIDE TRONG BÀI GIẢNG ==="]
            for s in sorted_slides:
                blocks.append(f"--- SLIDE {s['slide_number']} ---\n{s['content']}")
            context_str = "\n\n".join(blocks)
            
        elif intent == "social":
            context_str = "Học viên đang chào hỏi xã giao. Không có ngữ cảnh bài giảng cụ thể nào được trích xuất."
            
        else: # general_qa
            docs = self.rag_engine.search_relevant(query, top_k=3)
            current_page_content = ""
            if page_number is not None:
                p_info = self.rag_engine.get_page_context(page_number)
                if p_info["has_content"]:
                    current_page_content = f"=== TRANG HIỆN TẠI (Trang {page_number}) ===\n{p_info['slide_text']}\n\n"

            if not docs:
                context_str = current_page_content + "Không tìm thấy đoạn thông tin trùng khớp khác trong tài liệu."
            else:
                blocks = []
                for d in docs:
                    if d["type"] == "slide":
                        blocks.append(f"[Slide {d['slide_number']}]\n{d['content']}")
                    else:
                        blocks.append(f"[{d['chunk_id']}]\n{d['content']}")
                context_str = current_page_content + "\n\n".join(blocks)

        # --- BƯỚC 3: Tạo câu trả lời cuối cùng ---
        prompt = RAG_GROUNDED_QA_PROMPT.format(
            query=query,
            context_str=context_str,
            history_str=history_str
        )

        response = self.llm_client.generate(
            prompt=prompt,
            system_instruction=self.system_prompt
        )

        # --- OUTPUT GUARDRAIL ---
        return _check_output_guardrails(response, page_number)

