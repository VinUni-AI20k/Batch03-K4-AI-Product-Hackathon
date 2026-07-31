import sys
import os
import json
import re
from pathlib import Path
from typing import Optional, Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from api.llm_client import LLMClient
from tools.slide_parser import SlideParser
from config.settings import DEFAULT_GEMINI_MODEL, DEFAULT_OPENAI_MODEL

SLIDESHOW_SYSTEM_PROMPT = """Bạn là VLearn AI Slide Presenter — chuyên gia tổng hợp bài giảng và biên soạn kịch bản thuyết trình.
Nhiệm vụ của bạn là nhận nội dung slide bài học và tổng hợp lại thành một slide show tóm tắt (5 đến 8 slide) chứa tất cả những kiến thức cốt lõi quan trọng nhất sinh viên cần nhớ.
Với mỗi slide tóm tắt, hãy biên soạn kịch bản nói (narration) bằng tiếng Việt thật tự nhiên, lưu loát, lôi cuốn và dễ nghe khi đọc bằng Text-to-Speech (khoảng 60-100 từ mỗi slide)."""

SLIDESHOW_GENERATOR_PROMPT = """Dưới đây là toàn bộ nội dung trích xuất từ bộ slide bài giảng (gồm {total_slides} trang):

--- NỘI DUNG SLIDE ---
{full_text}
----------------------

Dựa trên nội dung trên, hãy tổng hợp thành một slideshow tóm tắt gồm từ 5 đến 8 trang slide để trình chiếu lại các điểm cốt lõi nhất cần nhớ.
Với mỗi trang slide tóm tắt này, hãy biên soạn:
1. "slide_number": Số thứ tự slide tóm tắt (bắt đầu từ 1)
2. "title": Tiêu đề của slide tóm tắt
3. "bullets": Mảng chứa từ 3 đến 4 ý chính tóm tắt kiến thức (mỗi ý viết ngắn gọn, rõ ràng)
4. "narration": Đoạn văn kịch bản thuyết trình bằng tiếng Việt tự nhiên để AI đọc khi trình chiếu slide này (dài khoảng 60-100 từ). Hãy viết trôi chảy, có mở đầu và kết nối giữa các slide.

Đầu ra BẮT BUỘC phải là một mảng JSON hợp lệ chứa các đối tượng slide này. Không chèn thêm các giải thích khác ngoài JSON, không bọc trong markdown codeblock (như ```json).

Ví dụ định dạng đầu ra:
[
  {{
    "slide_number": 1,
    "title": "Tổng quan bài học",
    "bullets": [
      "Mục tiêu bài học: nắm được khái niệm RAG và Fine-tuning",
      "Các bài toán ứng dụng thực tế trong doanh nghiệp",
      "Lộ trình triển khai hệ thống AI thông minh"
    ],
    "narration": "Chào mừng các bạn sinh viên đến với buổi trình chiếu tóm tắt nội dung bài giảng. Hôm nay, chúng ta sẽ cùng nhau ôn tập lại các kiến thức trọng tâm của buổi học trước..."
  }}
]
"""

class SlideshowAgent:
    """
    AI Agent chịu trách nhiệm tổng hợp toàn bộ slide thành slideshow tóm tắt kèm kịch bản nói giọng nói.
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: float = 0.3
    ):
        self.llm_client = LLMClient(provider=provider, model_name=model_name, temperature=temperature)
        self.system_prompt = SLIDESHOW_SYSTEM_PROMPT

    def generate_slideshow_data(self, file_path: str) -> List[Dict[str, Any]]:
        file_name = Path(file_path).name
        print(f"🔄 [Slideshow Agent] Đang phân tích file slide: {file_name}...")

        slides = SlideParser.extract_slides(file_path)
        total_slides = len(slides)
        print(f"✅ [Slideshow Agent] Đã trích xuất {total_slides} trang slide.")

        if total_slides == 0:
            return []

        full_text = SlideParser.get_full_text(slides)
        prompt = SLIDESHOW_GENERATOR_PROMPT.format(
            total_slides=total_slides,
            full_text=full_text
        )

        response_text = ""
        
        # Gọi trực tiếp model để thiết lập max_tokens lớn và cấu hình JSON
        if self.llm_client.provider == "gemini" and self.llm_client.sdk_type == "genai" and self.llm_client.client:
            from google.genai import types
            config = types.GenerateContentConfig(
                temperature=self.llm_client.temperature,
                max_output_tokens=2500,
                system_instruction=self.system_prompt,
                response_mime_type="application/json"
            )
            try:
                response = self.llm_client.client.models.generate_content(
                    model=self.llm_client.model_name,
                    contents=prompt,
                    config=config
                )
                response_text = response.text or ""
            except Exception as e:
                print(f"[Slideshow Agent] Lỗi khi gọi Gemini trực tiếp: {e}")
                response_text = self.llm_client.generate(prompt=prompt, system_instruction=self.system_prompt)
        elif self.llm_client.provider == "openai" and self.llm_client.client:
            try:
                messages = [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ]
                response = self.llm_client.client.chat.completions.create(
                    model=self.llm_client.model_name,
                    messages=messages,
                    temperature=self.llm_client.temperature,
                    max_tokens=2500,
                    response_format={"type": "json_object"}
                )
                response_text = response.choices[0].message.content or ""
            except Exception as e:
                print(f"[Slideshow Agent] Lỗi khi gọi OpenAI trực tiếp: {e}")
                response_text = self.llm_client.generate(prompt=prompt, system_instruction=self.system_prompt)
        else:
            response_text = self.llm_client.generate(prompt=prompt, system_instruction=self.system_prompt)

        # Làm sạch và parse JSON
        slideshow_list = []
        try:
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```"):
                cleaned_text = re.sub(r"^```(?:json)?\n", "", cleaned_text)
                cleaned_text = re.sub(r"\n```$", "", cleaned_text)
            
            parsed_json = json.loads(cleaned_text)
            if isinstance(parsed_json, dict):
                for key in ["slides", "slideshow", "data", "list"]:
                    if key in parsed_json and isinstance(parsed_json[key], list):
                        slideshow_list = parsed_json[key]
                        break
                if not slideshow_list:
                    slideshow_list = [parsed_json]
            elif isinstance(parsed_json, list):
                slideshow_list = parsed_json
                
        except Exception as e:
            print(f"❌ [Slideshow Agent] Lỗi phân tích cú pháp JSON: {e}")
            print(f"Đầu ra thô của LLM:\n{response_text}")
            slideshow_list = self._generate_fallback_data(slides[:8])

        print(f"🎉 [Slideshow Agent] Đã tạo thành công {len(slideshow_list)} slide tóm tắt.")
        return slideshow_list

    def _generate_fallback_data(self, slides: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        fallback = []
        for i, s in enumerate(slides):
            num = s["slide_number"]
            content = s["content"][:100] + "..." if len(s["content"]) > 100 else s["content"]
            fallback.append({
                "slide_number": i + 1,
                "title": f"Tóm tắt Slide Trang {num}",
                "bullets": [
                    f"Nội dung slide gốc tại trang {num}",
                    "Tự động trích xuất do quá trình xử lý AI bị quá tải",
                    f"Nội dung thô: {content}"
                ],
                "narration": f"Chào bạn. Đây là nội dung tóm tắt của slide số {num}. Do xảy ra lỗi kỹ thuật hoặc quá tải khi kết nối API, chúng tôi hiển thị bản tóm tắt thô từ nội dung slide. Bạn có thể nhấn tiếp tục để xem các slide sau."
            })
        return fallback
