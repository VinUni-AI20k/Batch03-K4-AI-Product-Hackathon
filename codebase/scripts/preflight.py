# scripts/preflight.py
import sys
from pathlib import Path

# Thêm thư mục cha vào system path để import
sys.path.append(str(Path(__file__).resolve().parent.parent))

from env_loader import get_active_provider, load_lab_env
from core.agent import run_agent

def run_preflight_check():
    load_lab_env()
    provider = get_active_provider()
    
    print("=" * 50)
    print("🕵️ CHƯƠNG TRÌNH KIỂM TRA PREFLIGHT KẾT NỐI...")
    print("=" * 50)
    
    if not provider:
        print("❌ LỖI: Không tìm thấy API Key nào trong file .env.")
        print("Vui lòng thiết lập GEMINI_API_KEY, OPENAI_API_KEY hoặc DEEPSEEK_API_KEY.")
        sys.exit(1)
        
    print(f"✅ Phát hiện cấu hình Provider đang hoạt động: [{provider.upper()}]")
    print("🚀 Thử thực hiện kết nối cơ bản với mô hình...")
    
    try:
        # Gửi một câu lệnh kiểm tra cơ bản không gọi tool
        test_response = run_agent("Chào bạn, phản hồi ngắn gọn 3 từ.")
        print(f"🤖 Phản hồi của mô hình: {test_response.strip()}")
        print("🎉 PREFLIGHT CHẠY THÀNH CÔNG! Kết nối hoạt động tốt.")
        sys.exit(0)
    except Exception as e:
        print(f"❌ KẾT NỐI THẤT BẠI: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_preflight_check()