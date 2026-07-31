"""
Model Factory — 1 interface duy nhất để gọi bất kỳ LLM nào (OpenAI / DeepSeek /
Claude / Gemini) qua thư viện LiteLLM, thay vì mỗi provider phải tự viết
request/response riêng (Claude, Gemini có format request/response khác hẳn
kiểu OpenAI, không thể chỉ đổi base_url như đã làm với DeepSeek trước đây).

Cách chọn provider (không cần sửa code, chỉ sửa .env):
  1. Đặt PROVIDER=openai|deepseek|claude|gemini trong .env (ưu tiên cao nhất).
  2. Nếu không đặt PROVIDER, tự suy đoán từ tên model trong LLM_MODEL/OPENAI_MODEL
     (vd tên có chữ "deepseek" -> provider deepseek). Mặc định openai nếu không
     đoán được gì.

Mỗi provider cần đúng 1 biến API key tương ứng trong .env:
  - openai   -> OPENAI_API_KEY
  - deepseek -> DEEPSEEK_API_KEY (hoặc LLM_BINDING_API_KEY)
  - claude   -> ANTHROPIC_API_KEY
  - gemini   -> GEMINI_API_KEY (hoặc GOOGLE_API_KEY)
"""
import os
from typing import Optional, Tuple

import litellm

# Tự động bỏ qua tham số mà model/provider đích không hỗ trợ (vd Claude không có
# response_format kiểu OpenAI) thay vì ném lỗi — LiteLLM sẽ tự dịch những gì dịch
# được (vd response_format -> output_format cho Anthropic) và bỏ phần còn lại.
litellm.drop_params = True

PROVIDER_PREFIX = {
    "openai": "openai/",
    "deepseek": "deepseek/",
    "claude": "anthropic/",
    "anthropic": "anthropic/",
    "gemini": "gemini/",
    "google": "gemini/",
}

DEFAULT_MODEL_BY_PROVIDER = {
    "openai": "gpt-5.6-terra",
    "deepseek": "deepseek-v4-flash",
    # Claude/Gemini: không đoán bừa tên model — bắt buộc khai rõ LLM_MODEL trong
    # .env để tránh gọi nhầm 1 model không tồn tại/đã deprecate.
}

API_KEY_ENV_BY_PROVIDER = {
    "openai": ["OPENAI_API_KEY"],
    "deepseek": ["DEEPSEEK_API_KEY", "LLM_BINDING_API_KEY"],
    "claude": ["ANTHROPIC_API_KEY"],
    "anthropic": ["ANTHROPIC_API_KEY"],
    "gemini": ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    "google": ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
}


def resolve_provider_and_model(model_name: Optional[str] = None) -> Tuple[str, str]:
    """Trả về (provider, model_string_cho_litellm)."""
    provider = os.getenv("PROVIDER", "").strip().lower()
    name = (model_name or os.getenv("LLM_MODEL") or os.getenv("OPENAI_MODEL") or "").strip()

    if not provider:
        low = name.lower()
        if "deepseek" in low:
            provider = "deepseek"
        elif "claude" in low:
            provider = "claude"
        elif "gemini" in low:
            provider = "gemini"
        else:
            provider = "openai"

    if not name:
        name = DEFAULT_MODEL_BY_PROVIDER.get(provider, "")
    if not name:
        raise RuntimeError(
            f"Chưa cấu hình model cho provider '{provider}'. Đặt LLM_MODEL=... trong file .env."
        )

    prefix = PROVIDER_PREFIX.get(provider, "openai/")
    litellm_model = name if name.startswith(prefix) else f"{prefix}{name}"
    return provider, litellm_model


def resolve_api_key(provider: str) -> Tuple[str, Optional[str]]:
    for env_name in API_KEY_ENV_BY_PROVIDER.get(provider, []):
        val = os.getenv(env_name, "").strip()
        if val:
            return val, env_name
    return "", None


def _do_completion(prompt: str, temperature: float, model_name: Optional[str],
                    response_json: bool, max_tokens: int):
    """Gọi litellm.completion(), trả về response object đầy đủ (có .usage)."""
    provider, litellm_model = resolve_provider_and_model(model_name)
    api_key, _ = resolve_api_key(provider)

    if not api_key:
        expected = " hoặc ".join(API_KEY_ENV_BY_PROVIDER.get(provider, ["<PROVIDER>_API_KEY"]))
        raise RuntimeError(
            f"Chưa cấu hình API key cho provider '{provider}'. Đặt {expected} trong file .env."
        )

    kwargs = dict(
        model=litellm_model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature,
        max_tokens=max_tokens,
        api_key=api_key,
    )
    if response_json:
        kwargs["response_format"] = {"type": "json_object"}

    if provider == "deepseek":
        # DeepSeek V4 bật "thinking mode" MẶC ĐỊNH — model suy luận ẩn (reasoning_content)
        # trước khi trả lời, phần suy luận này cũng tính vào max_tokens. Khi kết hợp với
        # response_format=json_object, model đôi khi tiêu hết ngân sách token cho suy luận
        # và trả về "content" RỖNG (không phải lỗi mạng/auth — request vẫn "thành công",
        # chỉ là không còn chỗ cho câu trả lời cuối). Đây chính là nguyên nhân gốc của lỗi
        # "LLM trả về kết quả không parse được JSON hay Markdown" gặp phải. Tắt hẳn thinking
        # mode: (1) hết lỗi content rỗng, (2) temperature mình đặt mới thực sự có tác dụng —
        # theo tài liệu DeepSeek, thinking mode bỏ qua temperature/top_p một cách âm thầm.
        kwargs["extra_body"] = {"thinking": {"type": "disabled"}}

    try:
        resp = litellm.completion(**kwargs)
    except Exception as e:
        raise RuntimeError(f"Lỗi gọi provider '{provider}' (model {litellm_model}): {e}")

    return provider, litellm_model, resp


def call_llm(
    prompt: str,
    temperature: float = 0.3,
    model_name: Optional[str] = None,
    response_json: bool = True,
    max_tokens: int = 8192,
) -> str:
    """Gọi LLM qua LiteLLM — dùng chung cho OpenAI/DeepSeek/Claude/Gemini.
    Trả về text thô (nội dung message) để nơi gọi tự parse JSON như trước."""
    _, _, resp = _do_completion(prompt, temperature, model_name, response_json, max_tokens)
    return resp["choices"][0]["message"]["content"]


def call_llm_with_usage(
    prompt: str,
    temperature: float = 0.3,
    model_name: Optional[str] = None,
    response_json: bool = True,
    max_tokens: int = 8192,
) -> Tuple[str, dict]:
    """Giống call_llm() nhưng trả kèm (text, usage) — usage gồm prompt_tokens/
    completion_tokens/total_tokens, LiteLLM tự chuẩn hoá format này cho MỌI
    provider (kể cả Claude/Gemini vốn có format usage gốc khác OpenAI)."""
    provider, litellm_model, resp = _do_completion(prompt, temperature, model_name, response_json, max_tokens)
    text = resp["choices"][0]["message"]["content"]
    usage_obj = getattr(resp, "usage", None) or resp.get("usage") or {}
    usage = {
        "prompt_tokens": getattr(usage_obj, "prompt_tokens", None) or usage_obj.get("prompt_tokens", 0),
        "completion_tokens": getattr(usage_obj, "completion_tokens", None) or usage_obj.get("completion_tokens", 0),
        "total_tokens": getattr(usage_obj, "total_tokens", None) or usage_obj.get("total_tokens", 0),
        "provider": provider,
        "model": litellm_model,
    }
    return text, usage


def list_supported_providers():
    return sorted(PROVIDER_PREFIX.keys())


if __name__ == "__main__":
    p, m = resolve_provider_and_model()
    print(f"[MODEL FACTORY] Provider: {p} | Model (litellm): {m}")
    key, key_env = resolve_api_key(p)
    print(f"[MODEL FACTORY] API key: {'đã cấu hình (' + key_env + ')' if key else 'CHƯA cấu hình'}")
