"""
llm.py — Module tạo lời giải thích ngắn gọn bằng Groq API
Tối ưu hóa phản hồi tức thì (low latency) + trích dẫn chính xác từ Transcript.
"""

from groq import Groq
from typing import List, Tuple, Dict, Any, Optional

# Khởi tạo system prompt chuẩn hóa cho bài toán RAG Tutor
SYSTEM_PROMPT = """Bạn là VLearn AI Tutor — trợ lý học tập thông minh.
Nhiệm vụ của bạn là giải thích đoạn thuật ngữ/khái niệm mà sinh viên đang bôi đen trên slide, dựa HOÀN TOÀN vào thông tin từ các đoạn transcript bài giảng được cung cấp (Context).

QUY TẮC BẮT BUỘC:
1. Giải thích ngắn gọn, súc tích trong tối đa 3 CÂU.
2. Câu trả lời phải đi thẳng vào bản chất khái niệm.
3. BẮT BUỘC chèn trích dẫn mã đoạn transcript (ví dụ: [TS01_C03]) ngay sau thông tin được dùng để giải thích.
4. Nếu Context không có đủ thông tin (confidence = 'not_found' hoặc 'low'), hãy thành thật báo rằng bài giảng chưa nêu rõ, nhưng vẫn đưa ra một câu giải thích ngắn gọn dựa trên tri thức chung và ghi chú rõ đó là thông tin bổ trợ ngoài bài giảng.
5. Luôn phản hồi bằng tiếng Việt thân thiện, rõ ràng, chuẩn sư phạm.
"""

def build_user_prompt(
    selected_text: str,
    retrieved_results: List[Tuple[Dict[str, Any], float]],
    confidence: str,
    slide_page: Optional[str] = None
) -> str:
    """Tạo prompt chi tiết chứa context transcript cho Groq."""
    
    context_str = ""
    if retrieved_results and confidence != "not_found":
        for chunk, score in retrieved_results:
            context_str += f"- ID: [{chunk['id']}] (Nguồn: {chunk['source_label']})\n  Nội dung: {chunk['text']}\n\n"
    else:
        context_str = "Không tìm thấy nội dung phù hợp trong transcript bài giảng.\n"

    page_info = f"(Tại slide trang: {slide_page})" if slide_page else ""

    user_prompt = f"""Đoạn text sinh viên bôi đen {page_info}:
"{selected_text}"

Trạng thái dữ liệu (Confidence): {confidence}

Context từ Transcript bài giảng:
{context_str}
Yêu cầu: Hãy giải thích khái niệm/câu trên một cách dễ hiểu nhất trong tối đa 3 câu và chèn citation [ID].
"""
    return user_prompt


def generate_explanation(
    selected_text: str,
    retrieved_results: List[Tuple[Dict[str, Any], float]],
    confidence: str,
    api_key: str,
    slide_page: Optional[str] = None,
    model_name: str = "llama-3.3-70b-versatile"
) -> str:
    """
    Gọi Groq API để tạo lời giải thích.
    
    Default Model: 'llama-3.3-70b-versatile' (Hoặc 'llama-3.1-8b-instant' nếu muốn siêu nhanh)
    """
    if not api_key:
        return "⚠️ Lỗi: Chưa cung cấp Groq API Key."

    try:
        # Khởi tạo client Groq với API Key người dùng truyền vào từ UI Streamlit
        client = Groq(api_key=api_key)
        
        user_prompt = build_user_prompt(
            selected_text=selected_text,
            retrieved_results=retrieved_results,
            confidence=confidence,
            slide_page=slide_page
        )

        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2, # Để nhiệt độ thấp giúp câu trả lời chính xác, bám sát transcript
            max_tokens=400,  # Giới hạn token để ép AI trả lời ngắn gọn
        )

        answer = response.choices[0].message.content.strip()
        return answer

    except Exception as e:
        return f"❌ Lỗi khi kết nối với Groq API: {str(e)}"