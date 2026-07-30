# run_tests.py
import os
import sys
import json
from pathlib import Path
from core.agent import run_agent
from env_loader import get_active_provider, load_lab_env
import time

# Đường dẫn tới file JSON testcase của nhóm
EVAL_FILE_PATH = Path(__file__).resolve().parent / "data" / "eval_group.json"

def format_multi_turn_history(turns) -> str:
    """
    Chuyển đổi lịch sử hội thoại nhiều lượt từ file JSON 
    thành một đoạn văn bản có ngữ cảnh để gửi cho Agent test cục bộ.
    """
    formatted_context = "Đây là lịch sử hội thoại trước đó giữa Học viên và bạn (Tutor):\n"
    for turn in turns[:-1]:  # Lấy tất cả các lượt trước lượt cuối
        role_name = "Học viên" if turn["role"] == "user" else "Tutor"
        formatted_context += f"- {role_name}: {turn['content']}\n"
    
    # Lượt cuối cùng là câu hỏi hiện tại cần kiểm tra
    last_user_query = turns[-1]["content"]
    formatted_context += f"\nHãy trả lời câu hỏi hiện tại này của học viên dựa trên lịch sử trên: '{last_user_query}'"
    return formatted_context

def run_tests():
    load_lab_env()
    provider = get_active_provider()
    if not provider:
        print("❌ LỖI: Chưa có API Key nào được cài đặt trong .env")
        sys.exit(1)
        
    # Kiểm tra xem file JSON có tồn tại không
    if not EVAL_FILE_PATH.exists():
        print(f"❌ LỖI: Không tìm thấy file testcase tại {EVAL_FILE_PATH}")
        print("Vui lòng tạo file data/eval_group.json trước.")
        sys.exit(1)

    # Đọc testcases từ file JSON
    with open(EVAL_FILE_PATH, "r", encoding="utf-8") as f:
        test_cases = json.load(f)

    print("=" * 70)
    print(f"📊 KHỞI CHẠY KIỂM THỬ TỰ ĐỘNG [{len(test_cases)} CASES] - PROVIDER: [{provider.upper()}]")
    print("=" * 70)
    
    passed = 0
    for tc in test_cases:
        tc_id = tc["id"]
        failure_type = tc["failure_type"]
        
        print(f"\n[Test] {tc_id} ({failure_type})")

        # Nghỉ giữa các lần gọi để tránh vượt rate limit free tier (5 req/phút)
        time.sleep(14)
        
        # Xử lý Single-Turn (query) hoặc Multi-Turn (turns)
        if "query" in tc:
            user_input = tc["query"]
            print(f"👉 Input: '{user_input}'")
        elif "turns" in tc:
            # Reconstruct lại lịch sử hội thoại để gửi cho Agent
            user_input = format_multi_turn_history(tc["turns"])
            print(f"👉 Input (Multi-turn): Lượt cuối - '{tc['turns'][-1]['content']}'")
        else:
            print("   ⚠️ Bỏ qua: Case không có trường 'query' hoặc 'turns' hợp lệ.")
            continue

        try:
            # Gọi Agent thực tế
            output = run_agent(user_input)
            print(f"🤖 Output: {output.strip()}")
            
            # Kiểm tra tự động kết quả routing mong đợi
            expect_type = tc.get("expect")
            
            # Đối với test cục bộ không có bộ chấm tool, chúng ta sẽ kiểm tra xem:
            # - Nếu expect là "no_tool" -> Output không nên chứa trích dẫn trang [Trang ...] hoặc định nghĩa
            # - Nếu expect là "tool_calls" -> Output nên có trích dẫn hoặc từ khóa chính xác
            is_pass = True
            
            if expect_type == "no_tool":
                # Thường no_tool là từ chối hoặc hỏi lại, không được trích dẫn bừa
                if "[Trích dẫn" in output or "[Định nghĩa" in output:
                    is_pass = False
                    print("   ❌ KHÔNG ĐẠT: Lẽ ra không được gọi tool nhưng phát hiện có trích dẫn/định nghĩa.")
            
            # Kiểm tra từ khóa bổ sung dựa trên loại lỗi để tăng độ chính xác của assert
            if failure_type == "out_of_scope" and not any(k in output.lower() for k in ["từ chối", "không hỗ trợ", "phạm vi"]):
                is_pass = False
                print("   ❌ KHÔNG ĐẠT: AI chưa từ chối lịch sự yêu cầu ngoài phạm vi.")
                
            if failure_type == "missing_info" and not any(k in output.lower() for k in ["mấy", "nào", "hỏi lại", "yêu cầu", "kiểm tra", "cung cấp", "vui lòng", "chọn"]):
                is_pass = False
                print("   ❌ KHÔNG ĐẠT: AI chưa chủ động hỏi lại khi thiếu thông tin.")

            if is_pass:
                print("   ✅ ĐẠT (PASS)")
                passed += 1
            else:
                print("   ❌ KHÔNG ĐẠT (FAIL)")
                
        except Exception as e:
            print(f"   💥 LỖI HỆ THỐNG: {str(e)}")
            
    print("\n" + "=" * 70)
    print(f"🏆 KẾT QUẢ CHUNG: ĐẠT {passed}/{len(test_cases)} cases từ file JSON.")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()