# env_loader.py
import os
from pathlib import Path
from dotenv import load_dotenv

def load_lab_env():
    """Nạp file .env từ thư mục gốc của codebase."""
    env_path = Path(__file__).resolve().parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        # Fallback tìm ở thư mục làm việc hiện tại
        load_dotenv()

def get_active_provider():
    """Kiểm tra và trả về provider đang có sẵn API Key."""
    load_lab_env()
    if os.getenv("GEMINI_API_KEY"):
        return "gemini"
    elif os.getenv("DEEPSEEK_API_KEY"):
        return "deepseek"
    elif os.getenv("OPENAI_API_KEY"):
        return "openai"
    elif os.getenv("ANTHROPIC_API_KEY"):
        return "claude"
    return None