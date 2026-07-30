import os
import sys
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

# ==============================================================================
# HẰNG SỐ MÔ HÌNH NÒNG CỐT (DEFAULT CORE LLM MODEL)
# ==============================================================================
DEFAULT_CORE_MODEL = "deepseek-v4-flash"

# ==============================================================================
# REGISTRY QUẢN LÝ TẤT CẢ MÔ HÌNH LLM (CORE: DEEPSEEK V4 FLASH)
# ==============================================================================
MODEL_REGISTRY: Dict[str, Dict[str, Any]] = {
    # ---------------- CORE MODEL ----------------
    "deepseek-v4-flash": {
        "name": "DeepSeek V4 Flash (Core LLM Model - Tốc độ siêu nhanh & Giá rẻ)",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.3,
        "is_core": True
    },
    
    # ---------------- Các mô hình DeepSeek khác ----------------
    "deepseek-chat": {
        "name": "DeepSeek V3 / Chat",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.3,
        "is_core": False
    },
    "deepseek-reasoner": {
        "name": "DeepSeek R1 / Reasoner (Suy luận chuỗi toán/logic)",
        "provider": "deepseek",
        "base_url": "https://api.deepseek.com",
        "env_key": "DEEPSEEK_API_KEY",
        "default_temp": 0.0,
        "is_core": False
    },
    
    # ---------------- Các mô hình OpenAI tùy chọn ----------------
    "gpt-4o": {
        "name": "OpenAI GPT-4o (Thông minh & Toàn diện nhất)",
        "provider": "openai",
        "base_url": None,
        "env_key": "OPENAI_API_KEY",
        "default_temp": 0.3,
        "is_core": False
    },
    "gpt-4o-mini": {
        "name": "OpenAI GPT-4o Mini (Nhanh & Tối ưu chi phí)",
        "provider": "openai",
        "base_url": None,
        "env_key": "OPENAI_API_KEY",
        "default_temp": 0.3,
        "is_core": False
    }
}

def get_llm_model(
    model_name: Optional[str] = None,
    temperature: Optional[float] = None,
    **kwargs
) -> BaseChatModel:
    """
    Hàm Factory khởi tạo mô hình LangChain ChatModel dựa trên model_name.
    Mặc định sử dụng DeepSeek V4 Flash làm Core LLM Model.
    """
    if not model_name:
        model_name = os.getenv("LLM_MODEL", DEFAULT_CORE_MODEL)

    config = MODEL_REGISTRY.get(model_name)
    
    if not config:
        # Tự động fallback nếu truyền tên model tùy chỉnh
        base_url = os.getenv("LLM_BINDING_HOST", "https://api.deepseek.com")
        api_key = os.getenv("DEEPSEEK_API_KEY") or os.getenv("LLM_BINDING_API_KEY") or os.getenv("OPENAI_API_KEY")
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
        or os.getenv("DEEPSEEK_API_KEY")
        or os.getenv("LLM_BINDING_API_KEY")
        or os.getenv("OPENAI_API_KEY")
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
    print(f"[MODEL FACTORY] CORE MODEL: {DEFAULT_CORE_MODEL}")
    print("[MODEL FACTORY] Registered Models:")
    for model_id, info in list_available_models().items():
        tag = "[CORE LLM]" if info.get("is_core") else ""
        print(f"  - {model_id}: {info['name']} {tag}")
