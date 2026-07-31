import os

import google.generativeai as genai

from app.core.config import GEMINI_MODEL


class LLMClient:
    def __init__(self, model_name=GEMINI_MODEL):
        self.model_name = model_name
        self._model = None

    def _get_model(self):
        if self._model is None:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
            genai.configure(api_key=api_key)
            self._model = genai.GenerativeModel(self.model_name)
        return self._model

    def generate_text(self, prompt: str, temperature=0.0, max_output_tokens: int | None = None):
        config_kwargs = {"temperature": temperature}
        if max_output_tokens is not None:
            config_kwargs["max_output_tokens"] = max_output_tokens
        response = self._get_model().generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(**config_kwargs),
        )
        if not response.candidates:
            raise ValueError(f"No response candidates (possibly blocked): {response.prompt_feedback}")
        return response.text

llm_client = LLMClient()
