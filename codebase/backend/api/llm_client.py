import sys
import os
from pathlib import Path
from typing import Optional, Dict, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from config.settings import (
    GEMINI_API_KEY,
    OPENAI_API_KEY,
    OPENAI_BASE_URL,
    DEFAULT_PROVIDER,
    DEFAULT_GEMINI_MODEL,
    DEFAULT_OPENAI_MODEL,
    DEFAULT_TEMPERATURE,
    MAX_OUTPUT_TOKENS,
)


class LLMClient:
    """
    Client wrapper cho việc gọi API LLM (Google Gemini hoặc OpenAI).
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ):
        target_provider = (provider or DEFAULT_PROVIDER).lower()

        # Tự động chọn Provider có API Key nếu provider chọn ban đầu không có Key
        gemini_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        openai_key = OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")

        if target_provider == "gemini" and not gemini_key and openai_key:
            target_provider = "openai"
            model_name = model_name or DEFAULT_OPENAI_MODEL
        elif target_provider == "openai" and not openai_key and gemini_key:
            target_provider = "gemini"
            model_name = model_name or DEFAULT_GEMINI_MODEL

        self.provider = target_provider
        self.temperature = temperature
        
        if self.provider == "gemini":
            self.model_name = model_name or DEFAULT_GEMINI_MODEL
            self._init_gemini()
        elif self.provider == "openai":
            self.model_name = model_name or DEFAULT_OPENAI_MODEL
            self._init_openai()
        else:
            raise ValueError(f"Provider '{self.provider}' không được hỗ trợ. Hãy dùng 'gemini' hoặc 'openai'.")

    def _init_gemini(self):
        api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            # Cho phép chạy offline mock nếu chưa nhập API key
            self.client = None
            self.sdk_type = "mock"
            return

        try:
            from google import genai
            self.client = genai.Client(api_key=api_key)
            self.sdk_type = "genai"
        except ImportError:
            try:
                import google.generativeai as genai_legacy
                genai_legacy.configure(api_key=api_key)
                self.client = genai_legacy
                self.sdk_type = "google_generativeai"
            except ImportError:
                self.client = None
                self.sdk_type = "mock"

    def _init_openai(self):
        if not OPENAI_API_KEY:
            self.client = None
            self.sdk_type = "mock"
            return
        try:
            from openai import OpenAI
            base_url = OPENAI_BASE_URL if OPENAI_BASE_URL else None
            self.client = OpenAI(api_key=OPENAI_API_KEY, base_url=base_url)
            self.sdk_type = "openai"
        except ImportError:
            self.client = None
            self.sdk_type = "mock"


    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Gửi yêu cầu sinh văn bản đến LLM Provider.
        """
        if getattr(self, "sdk_type", None) == "mock" or not getattr(self, "client", None):
            return f"[MOCK LLM RESPONSE - Gemini 2.5 Flash]\nNội dung trả lời mẫu dựa trên prompt được cung cấp. Vui lòng điền GEMINI_API_KEY trong file .env để gọi Gemini 2.5 API thực tế."

        if self.provider == "gemini":
            if self.sdk_type == "genai":
                from google.genai import types
                config = types.GenerateContentConfig(
                    temperature=self.temperature,
                    max_output_tokens=MAX_OUTPUT_TOKENS,
                    system_instruction=system_instruction if system_instruction else None
                )
                try:
                    response = self.client.models.generate_content(
                        model=self.model_name,
                        contents=prompt,
                        config=config
                    )
                    return response.text or ""
                except Exception as e:
                    err_str = str(e)
                    if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "Quota exceeded" in err_str:
                        return "⚠️ **Thông báo hệ thống:** API Key Gemini của bạn hiện đã đạt/vượt quá giới hạn (Rate Limit / Quota Exceeded - HTTP 429). Vui lòng thử lại sau khoảng 30-60 giây hoặc kiểm tra Quota/API Key trong file `.env`."
                    
                    # Fallback nếu tên model cũ/bị 404
                    fallback_models = ["gemini-2.0-flash", "gemini-1.5-flash"]
                    for fb_model in fallback_models:
                        if fb_model != self.model_name:
                            try:
                                print(f"⚠️ Model '{self.model_name}' lỗi 404, chuyển sang fallback model '{fb_model}'...")
                                response = self.client.models.generate_content(
                                    model=fb_model,
                                    contents=prompt,
                                    config=config
                                )
                                return response.text or ""
                            except Exception as fb_err:
                                fb_str = str(fb_err)
                                if "429" in fb_str or "RESOURCE_EXHAUSTED" in fb_str:
                                    return "⚠️ **Thông báo hệ thống:** API Key Gemini hiện đã chạm giới hạn Quota (HTTP 429). Vui lòng thử lại sau 30 giây."
                                continue
                    raise e


            elif self.sdk_type == "google_generativeai":
                model = self.client.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=system_instruction
                )
                response = model.generate_content(
                    prompt,
                    generation_config=self.client.types.GenerationConfig(
                        temperature=self.temperature,
                        max_output_tokens=MAX_OUTPUT_TOKENS
                    )
                )
                return response.text or ""

        elif self.provider == "openai":
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

            try:
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=messages,
                    temperature=self.temperature,
                    max_tokens=MAX_OUTPUT_TOKENS
                )
                return response.choices[0].message.content or ""
            except Exception as e:
                err_str = str(e)
                if "401" in err_str or "API key" in err_str or "authentication" in err_str:
                    return f"⚠️ **Lỗi xác thực API Key (401):** API Key hiện tại chưa đúng với endpoint `{OPENAI_BASE_URL}`. Vui lòng nhập API key chính xác vào file `.env` (dòng `OPENAI_API_KEY=...`)."
                raise e


        return ""
