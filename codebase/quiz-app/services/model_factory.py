import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel

load_dotenv()

# ==============================================================================
# REGISTRY QUẢN LÝ TẤT CẢ MÔ HÌNH LLM (OPENAI & DEEPSEEK)
# ==============================================================================
MODEL_REGISTRY: Dict[str, Dict[str, Any]] = {
    # ---------------- DeepSeek Models ----------------
    "deepseek-v4-flash": {
        "name": "DeepSeek V4 Flash (Tốc độ siêu nhanh & Giá rẻ)",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.3
    },
    "deepseek-chat": {
        "name": "DeepSeek V3 / Chat",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.3
    },
    "deepseek-reasoner": {
        "name": "DeepSeek R1 / Reasoner (Suy luận chuỗi toán/logic)",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.0
    },
    
    # ---------------- OpenAI Models ----------------
    "gpt-4o": {
        "name": "OpenAI GPT-4o (Thông minh & Toàn diện nhất)",
        "provider": "openai",
        "base_url": None,
        "env_key": "OPENAI_API_KEY",
        "default_temp": 0.3
    },
    "gpt-4o-mini": {
        "name": "OpenAI GPT-4o Mini (Nhanh & Tối ưu chi phí)",
        "provider": "openai",
        "base_url": None,
        "env_key": "OPENAI_API_KEY",
        "default_temp": 0.3
    }
}

def get_llm_model(
    model_name: Optional[str] = None,
    temperature: Optional[float] = None,
    **kwargs
) -> BaseChatModel:
    """
    Hàm Factory khởi tạo mô hình LangChain ChatModel dựa trên model_name.
    Cho phép linh hoạt switch giữa OpenAI và DeepSeek chỉ bằng tên model.
    """
    if not model_name:
        model_name = os.getenv("LLM_MODEL", "deepseek-v4-flash")

    config = MODEL_REGISTRY.get(model_name)
    
    if not config:
        # Tự động fallback nếu truyền tên model tùy chỉnh không có trong registry
        base_url = os.getenv("LLM_BINDING_HOST")
        api_key = os.getenv("LLM_BINDING_API_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
        temp = temperature if temperature is not None else 0.3
        return ChatOpenAI(
            model=model_name,
            api_key=api_key,
            base_url=base_url if base_url else None,
            temperature=temp,
            **kwargs
        )

    # Lấy API key từ env tương ứng
    api_key = (
        os.getenv(config["env_key"])
        or os.getenv("LLM_BINDING_API_KEY")
        or os.getenv("OPENAI_API_KEY")
        or os.getenv("DEEPSEEK_API_KEY")
    )
    base_url = config["base_url"] or os.getenv("LLM_BINDING_HOST")
    temp = temperature if temperature is not None else config["default_temp"]

    return ChatOpenAI(
        model=model_name,
        api_key=api_key,
        base_url=base_url if base_url else None,
        temperature=temp,
        **kwargs
    )

def list_available_models() -> Dict[str, Dict[str, Any]]:
    """Trả về danh sách tất cả các mô hình có sẵn trong registry"""
    return MODEL_REGISTRY

if __name__ == "__main__":
    print("[MODEL FACTORY] Registered Models:")
    for model_id, info in list_available_models().items():
        print(f"  - {model_id}: {info['name']} (Provider: {info['provider']})")
