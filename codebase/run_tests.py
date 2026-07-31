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

        print(f"\n[Test] {tc_id} ({failure_type})")

        time.sleep(14)

        if "query" in tc:
            user_input = tc["query"]
            print(f"👉 Input: {user_input}")

        elif "turns" in tc:
            user_input = format_multi_turn_history(tc["turns"])
            print(
                f"👉 Input (Multi-turn): {tc['turns'][-1]['content']}"
            )

        else:
            print("⚠️ Case không hợp lệ.")
            continue

        try:

            output = run_agent(user_input)

            print(f"🤖 Output: {output.strip()}")

            is_pass = True
            fail_reason = ""

            # ------------------------
            # no_tool
            # ------------------------

            if expect_type == "no_tool":

                if (
                    "[Trích dẫn" in output
                    or "[Định nghĩa" in output
                ):
                    is_pass = False
                    fail_reason = "Unexpected tool output"

            # ------------------------
            # out_of_scope
            # ------------------------

            if failure_type == "out_of_scope":

                if not any(
                    k in output.lower()
                    for k in [
                        "từ chối",
                        "không hỗ trợ",
                        "phạm vi",
                    ]
                ):
                    is_pass = False
                    fail_reason = "Out-of-scope not rejected"

            # ------------------------
            # missing_info
            # ------------------------

            if failure_type == "missing_info":

                if not any(
                    k in output.lower()
                    for k in [
                        "mấy",
                        "nào",
                        "hỏi lại",
                        "vui lòng",
                        "cung cấp",
                        "chọn",
                        "kiểm tra",
                        "yêu cầu",
                    ]
                ):
                    is_pass = False
                    fail_reason = (
                        "Agent did not ask for missing information"
                    )

            if is_pass:
                print("   ✅ PASS")
                passed += 1
                status = "PASS"

            else:
                print("   ❌ FAIL")
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
                    "timestamp": datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
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
                    "timestamp": datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    ),
                }
            )

    # ===========================
    # Save CSV
    # ===========================

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
    print(f"🏆 KẾT QUẢ: {passed}/{len(test_cases)} PASS")
    print("=" * 70)
    print(f"📄 Đã lưu kết quả vào: {RESULT_FILE_PATH}")


if __name__ == "__main__":
    run_tests()