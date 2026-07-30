import sys
import os
from typing import TypedDict, List, Dict, Any, Optional

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure codebase/quiz-app in sys.path
APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage
from services.model_factory import get_llm_model, list_available_models

# ==============================================================================
# 1. ĐỊNH NGHĨA TRẠNG THÁI STATE CHO LANGGRAPH
# ==============================================================================
class QuizState(TypedDict):
    selected_model: str            # Mô hình LLM được chọn (vd: deepseek-v4-flash, gpt-4o, gpt-4o-mini)
    temperature: float             # Độ sáng tạo
    slide_content: str             # Nội dung slide bài giảng
    num_questions: int             # Số lượng câu hỏi cần tạo
    quiz_result: str               # Kết quả bài Quiz trả về
    status: str                    # Trạng thái tiến trình (STARTING / COMPLETED)

# ==============================================================================
# 2. KHỞI TẠO NÚT XỬ LÝ (LANGGRAPH NODE)
# ==============================================================================
def generate_quiz_node(state: QuizState) -> Dict[str, Any]:
    """Node xử lý sinh Quiz, dễ dàng chuyển đổi LLM từ Model Factory"""
    model_name = state.get("selected_model", "deepseek-v4-flash")
    temp = state.get("temperature", 0.3)
    content = state.get("slide_content", "")
    num_questions = state.get("num_questions", 3)

    print(f"\n[LANGGRAPH] Switching & Executing Model: '{model_name}' (Temperature: {temp})...")

    # Lấy mô hình từ Factory (LangChain ChatModel)
    llm = get_llm_model(model_name=model_name, temperature=temp)

    system_prompt = f"""
    Bạn là chuyên gia soạn đề thi trắc nghiệm ứng dụng tình huống thực tế cho khóa học AI.
    Dựa trên nội dung bài giảng được cung cấp, hãy soạn đúng {num_questions} câu hỏi trắc nghiệm.
    Mỗi câu gồm: Câu hỏi, 4 Lựa chọn (A, B, C, D), Đáp án đúng và Giải thích chi tiết.
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Nội dung bài giảng:\n{content}")
    ]

    response = llm.invoke(messages)

    return {
        "quiz_result": response.content,
        "status": "COMPLETED"
    }

# ==============================================================================
# 3. DỰNG LUỒNG ĐỒ THỊ TRẠNG THÁI (LANGGRAPH STATE GRAPH)
# ==============================================================================
workflow = StateGraph(QuizState)

# Thêm Node sinh Quiz vào Đồ thị LangGraph
workflow.add_node("generate_quiz", generate_quiz_node)

# Thiết lập luồng thực thi: START -> generate_quiz -> END
workflow.add_edge(START, "generate_quiz")
workflow.add_edge("generate_quiz", END)

# Biên dịch thành ứng dụng LangGraph Runnable
quiz_graph = workflow.compile()

# ==============================================================================
# 4. HÀM INTERFACE ĐIỀU HÀNH CHUYỂN ĐỔI MODEL (DYNAMIC SWITCHING)
# ==============================================================================
def run_quiz_workflow(
    slide_content: str,
    model_name: str = "deepseek-v4-flash",
    num_questions: int = 2,
    temperature: float = 0.3
) -> str:
    """
    Hàm gọi LangGraph Workflow với khả năng Switch giữa OpenAI và DeepSeek nhanh chóng.
    """
    initial_state: QuizState = {
        "selected_model": model_name,
        "temperature": temperature,
        "slide_content": slide_content,
        "num_questions": num_questions,
        "quiz_result": "",
        "status": "STARTING"
    }

    final_state = quiz_graph.invoke(initial_state)
    return final_state["quiz_result"]

if __name__ == "__main__":
    test_content = """
    BÀI GIẢNG: ỨNG DỤNG AI TRONG ĐÀO TẠO
    1. VLearn Tutor: Trợ lý AI học tập phục vụ học viên 24/7.
    2. AI Quiz Generator: Tự động trích xuất nội dung slide để tạo đề bài kiểm tra tức thì.
    """

    print("==================================================")
    print("DEMO SWITCH MODEL TRÊN LANGGRAPH WORKFLOW")
    print("==================================================")

    res_deepseek = run_quiz_workflow(test_content, model_name="deepseek-v4-flash")
    print("\n--- KẾT QUẢ TỪ DEEPSEEK V4 FLASH ---")
    print(res_deepseek)
