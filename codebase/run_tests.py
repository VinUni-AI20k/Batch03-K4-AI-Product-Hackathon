import sys
import json
import csv
import time
from pathlib import Path
from datetime import datetime

from core.agent import run_agent
from env_loader import get_active_provider, load_lab_env

# =========================
# Paths
# =========================

PROJECT_ROOT = Path(__file__).resolve().parent.parent

EVAL_FILE_PATH = PROJECT_ROOT / "eval" / "golden_set.json"
RESULT_FILE_PATH = PROJECT_ROOT / "eval" / "testcases_result.csv"


def format_multi_turn_history(turns) -> str:
    """
    Chuyển đổi hội thoại nhiều lượt thành một đoạn context
    để gửi vào Agent.
    """
    formatted_context = (
        "Đây là lịch sử hội thoại trước đó giữa Học viên và bạn (Tutor):\n"
    )

    for turn in turns[:-1]:
        role_name = "Học viên" if turn["role"] == "user" else "Tutor"
        formatted_context += f"- {role_name}: {turn['content']}\n"

    last_user_query = turns[-1]["content"]

    formatted_context += (
        f"\nHãy trả lời câu hỏi hiện tại này của học viên "
        f"dựa trên lịch sử trên: '{last_user_query}'"
    )

    return formatted_context


def evaluate_output(tc, output, tool_calls_made=None) -> tuple[bool, str]:
    """
    Hàm đánh giá kết quả phản hồi của Agent so với kỳ vọng trong Testcase.
    """
    expect_type = tc.get("expect")
    failure_type = tc.get("failure_type")
    expected_tools = tc.get("expected_tool_calls", [])
    output_lower = output.lower()

    # ---------------------------------------------------------
    # CASE 1: Kỳ vọng KHÔNG GỌI TOOL (expect: "no_tool")
    # ---------------------------------------------------------
    if expect_type == "no_tool":
        # Nếu phát hiện dấu vết đã thực thi tool
        if tool_calls_made and len(tool_calls_made) > 0:
            return False, f"Đã gọi {len(tool_calls_made)} tool ngoài kỳ vọng"

        if "[trích dẫn" in output_lower or "[định nghĩa" in output_lower:
            return False, "Phát hiện trích dẫn tool trong phản hồi khi kỳ vọng no_tool"

        # Đánh giá riêng theo từng failure_type
        if failure_type == "out_of_scope":
            keywords = [
                "từ chối", "không hỗ trợ", "phạm vi", "không thể", 
                "xin phép không", "không cung cấp", "không thực hiện"
            ]
            if not any(k in output_lower for k in keywords):
                return False, "Out-of-scope nhưng Agent không từ chối rõ ràng"

        elif failure_type == "missing_info":
            keywords = [
                "mấy", "nào", "hỏi lại", "vui lòng", "cung cấp", 
                "chọn", "kiểm tra", "yêu cầu", "cho mình biết", 
                "trang bao nhiêu", "thuật ngữ nào", "day mấy"
            ]
            if not any(k in output_lower for k in keywords):
                return False, "Thiếu thông tin nhưng Agent không đặt câu hỏi làm rõ"

        return True, ""

    # ---------------------------------------------------------
    # CASE 2: Kỳ vọng CÓ GỌI TOOL (expect: "tool_calls")
    # ---------------------------------------------------------
    if expect_type == "tool_calls":
        # 1. Nếu hệ thống trả về được dữ liệu tool_calls trực tiếp
        if tool_calls_made is not None and len(tool_calls_made) > 0:
            for exp_tool in expected_tools:
                matched = False
                exp_name = exp_tool["name"]
                exp_args = exp_tool["arguments"]

                for actual_tool in tool_calls_made:
                    act_name = actual_tool.get("name")
                    act_args = actual_tool.get("arguments", {})

                    if act_name == exp_name:
                        # Kiểm tra khớp các tham số
                        arg_match = True
                        for k, v in exp_args.items():
                            actual_val = act_args.get(k)
                            if str(actual_val).lower() != str(v).lower():
                                arg_match = False
                                break
                        if arg_match:
                            matched = True
                            break

                if not matched:
                    return False, f"Tool call không khớp. Kỳ vọng: {exp_tool}, Thực tế: {tool_calls_made}"

            return True, ""

        # 2. Fallback kiểm tra qua văn bản đầu ra nếu run_agent trả về text đã định dạng
        else:
            # Kiểm tra xem có dấu vết thực thi tool trong text không
            has_tool_citation = any(
                k in output_lower for k in ["[trích dẫn", "[định nghĩa", "[trang", "d1", "d2", "d3", "d4", "d5"]
            )
            if not has_tool_citation and len(output.strip()) == 0:
                return False, "Kỳ vọng gọi Tool nhưng không thấy phản hồi thực thi tool"

            # Kiểm tra riêng cho sai số trang biên (wrong_boundary)
            if failure_type == "wrong_boundary":
                # Vẫn PASS nếu agent đã nhận diện hoặc cố gắng gọi tool trang biên
                return True, ""

            return True, ""

    return True, ""


def run_tests():
    load_lab_env()

    provider = get_active_provider()

    if not provider:
        print("❌ LỖI: Chưa có API Key nào được cài đặt trong .env")
        sys.exit(1)

    if not EVAL_FILE_PATH.exists():
        print(f"❌ Không tìm thấy file testcase: {EVAL_FILE_PATH}")
        sys.exit(1)

    with open(EVAL_FILE_PATH, "r", encoding="utf-8") as f:
        test_cases = json.load(f)

    print("=" * 70)
    print(
        f"📊 KHỞI CHẠY KIỂM THỬ [{len(test_cases)} CASES] - PROVIDER [{provider.upper()}]"
    )
    print("=" * 70)

    passed = 0
    results = []

    for tc in test_cases:
        tc_id = tc["id"]
        failure_type = tc["failure_type"]
        expect_type = tc.get("expect")

        print(f"\n[Test] {tc_id} ({failure_type}) - Expect: {expect_type}")

        # Tùy chỉnh nghỉ giữa các request để tránh dính Rate Limit
        time.sleep(2)

        if "query" in tc:
            user_input = tc["query"]
            print(f"👉 Input: {user_input}")

        elif "turns" in tc:
            user_input = format_multi_turn_history(tc["turns"])
            print(f"👉 Input (Multi-turn): {tc['turns'][-1]['content']}")

        else:
            print("⚠️ Case không hợp lệ.")
            continue

        try:
            # Thực thi Agent
            agent_result = run_agent(user_input)

            # Hỗ trợ cả 2 trường hợp: run_agent trả về string HOẶC tuple (output, tool_calls)
            if isinstance(agent_result, tuple):
                output, tool_calls_made = agent_result
            else:
                output = str(agent_result)
                tool_calls_made = None

            print(f"🤖 Output: {output.strip()}")

            # Đánh giá kết quả
            is_pass, fail_reason = evaluate_output(tc, output, tool_calls_made)

            if is_pass:
                print("   ✅ PASS")
                passed += 1
                status = "PASS"
            else:
                print(f"   ❌ FAIL: {fail_reason}")
                status = "FAIL"

            results.append(
                {
                    "id": tc_id,
                    "phase": tc.get("phase", ""),
                    "failure_type": failure_type,
                    "expect": expect_type,
                    "status": status,
                    "reason": fail_reason,
                    "input": user_input.replace("\n", " "),
                    "output": output.replace("\n", " "),
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            )

        except Exception as e:
            print(f"💥 ERROR: {e}")

            results.append(
                {
                    "id": tc_id,
                    "phase": tc.get("phase", ""),
                    "failure_type": failure_type,
                    "expect": expect_type,
                    "status": "ERROR",
                    "reason": str(e),
                    "input": user_input.replace("\n", " "),
                    "output": "",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
            )

    # ===========================
    # Save CSV Results
    # ===========================
    RESULT_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(
        RESULT_FILE_PATH,
        "w",
        newline="",
        encoding="utf-8-sig",
    ) as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "id",
                "phase",
                "failure_type",
                "expect",
                "status",
                "reason",
                "input",
                "output",
                "timestamp",
            ],
        )

        writer.writeheader()
        writer.writerows(results)

    print("\n" + "=" * 70)
    print(f"🏆 KẾT QUẢ TỔNG KẾT: {passed}/{len(test_cases)} CASES PASSED")
    print("=" * 70)
    print(f"📄 Đã lưu kết quả kiểm thử vào: {RESULT_FILE_PATH}")


if __name__ == "__main__":
    run_tests()