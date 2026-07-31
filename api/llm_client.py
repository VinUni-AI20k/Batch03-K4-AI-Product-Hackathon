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
    def __init__(
        self,
        provider: Optional[str] = None,
        model_name: Optional[str] = None,
        temperature: float = DEFAULT_TEMPERATURE,
    ):
        self.provider = (provider or DEFAULT_PROVIDER).lower()
        self.temperature = temperature
        
        if self.provider == "gemini":
            self.model_name = model_name or DEFAULT_GEMINI_MODEL
            self._init_gemini()
        elif self.provider == "openai":
            self.model_name = model_name or DEFAULT_OPENAI_MODEL
            self._init_openai()
        else:
            raise ValueError(f"Provider '{self.provider}' không được hỗ trợ.")

    def _init_gemini(self):
        api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
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
        if getattr(self, "sdk_type", None) == "mock" or not getattr(self, "client", None):
            return f"[MOCK LLM RESPONSE]\nVui lòng điền OPENAI_API_KEY trong file .env."

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
                    if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                        return "⚠️ **Thông báo hệ thống:** API Key Gemini hiện chạm giới hạn Quota (HTTP 429)."
                    raise e

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
                    return f"⚠️ **Lỗi xác thực API Key (401):** API Key chưa đúng với endpoint `{OPENAI_BASE_URL}`."
                raise e

        return ""
