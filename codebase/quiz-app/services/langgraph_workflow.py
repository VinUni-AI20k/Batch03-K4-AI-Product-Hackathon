import sys
import os
import asyncio
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
from services.rag_engine import get_rag_instance
from lightrag import QueryParam

# ==============================================================================
# 1. ĐỊNH NGHĨA TRẠNG THÁI STATE CHO LANGGRAPH
# ==============================================================================
class QuizState(TypedDict):
    selected_model: str            # Mô hình LLM được chọn (vd: deepseek-v4-flash, gpt-4o, gpt-4o-mini)
    temperature: float             # Độ sáng tạo
    slide_content: str             # Nội dung slide bài giảng
    num_questions: int             # Số lượng câu hỏi cần tạo
    mode: str                      # Mode "standard" hoặc "stress"
    difficulty_level: str          # Độ khó "easy", "medium", "hard", "mixed"
    use_rag: bool                  # Bật/tắt LightRAG (tắt để tăng tốc với tài liệu ngắn)
    rag_context: str               # Bối cảnh đồ thị tri thức trích từ LightRAG
    quiz_result: str               # Kết quả bài Quiz trả về
    status: str                    # Trạng thái tiến trình

# ==============================================================================
# 2. KHỞI TẠO CÁC NÚT XỬ LÝ (LANGGRAPH NODES)
# ==============================================================================

async def retrieve_rag_context_node(state: QuizState) -> Dict[str, Any]:
    """Node 1: Khởi tạo LightRAG, Nạp tài liệu & Truy vấn Graph Context"""
    content = state.get("slide_content", "")
    use_rag = state.get("use_rag", True)  # Mặc định bật RAG, có thể tắt để tăng tốc
    
    print(f"\n[LANGGRAPH NODE 1] Executing LightRAG Graph Retrieval (Content len: {len(content)} chars, use_rag={use_rag})...")
    
    if not use_rag:
        print("[LANGGRAPH NODE 1] RAG disabled, skipping...")
        return {"rag_context": "", "status": "RAG_DISABLED"}
    
    if not content or len(content.strip()) < 10:
        return {"rag_context": "", "status": "RAG_SKIPPED"}
        
    try:
        # Lấy LightRAG instance
        rag = await get_rag_instance()
        
        # LightRAG ainsert tự động hash & kiểm tra trùng lặp tài liệu trong Storage
        await rag.ainsert(content)
        
        # Truy vấn Hybrid Mode (Local + Global Graph Context)
        query = "Trích xuất các thực thể, khái niệm chính và mối quan hệ để soạn câu hỏi Quiz ứng dụng."
        rag_res = await rag.aquery(
            query, 
            param=QueryParam(
                mode="hybrid",
                enable_rerank=False,  # Tắt rerank để tăng tốc (chưa config rerank model)
                top_k=5  # Giới hạn 5 chunks thay vì mặc định (thường là 20+)
            )
        )
        print(f"[LANGGRAPH NODE 1] LightRAG Context Retrieved ({len(str(rag_res))} chars) successfully!")
        return {"rag_context": str(rag_res), "status": "RAG_RETRIEVED"}
    except Exception as e:
        print(f"[LANGGRAPH NODE 1 WARNING] LightRAG retrieval warning: {e}. Fallback to direct content.")
        return {"rag_context": content, "status": "RAG_FALLBACK"}


def generate_quiz_node(state: QuizState) -> Dict[str, Any]:
    """Node 2: Sinh Quiz bằng LLM được chọn từ Model Factory"""
    model_name = state.get("selected_model", "deepseek-v4-flash")
    temp = state.get("temperature", 0.3)
    content = state.get("slide_content", "")
    rag_context = state.get("rag_context", "")
    num_questions = state.get("num_questions", 5)

    print(f"\n[LANGGRAPH NODE 2] Generating Quiz via Model '{model_name}' (Temp: {temp})...")

    llm = get_llm_model(model_name=model_name, temperature=temp)

    combined_context = f"--- NỘI DUNG TÀI LIỆU PDF GỐC ---\n{content}"
    if rag_context:
        combined_context += f"\n\n--- ĐỒ THỊ TRI THỨC VÀ THỰC THỂ (LIGHTRAG GRAPH CONTEXT) ---\n{rag_context}"

    system_prompt = f"""
    Bạn là chuyên gia soạn đề thi trắc nghiệm ứng dụng tình huống thực tế cho khóa học AI.
    Dựa trên nội dung tài liệu bài giảng và Đồ thị Tri thức được cung cấp bên dưới, hãy soạn đúng {num_questions} câu hỏi trắc nghiệm.
    
    QUY TẮC PHẠM VI NỘI DUNG (BẮT BUỘC):
    1. CHỈ SOẠN CÂU HỎI NẰM TRONG NỘI DUNG BÀI GIẢNG PDF (các mốc lịch sử, khái niệm, thuật toán, ứng dụng đề cập trong slide).
    2. TUYỆT ĐỐ KHÔNG ĐẶT CÂU HỎI VỀ CÁC NỀN TẢNG KĨ THUẬT AI HỆ THỐNG NỘI BỘ (như SiliconFlow, Qwen3 Embedding, DeepSeek V4 Flash...).
    3. Trích dẫn nguyên văn raw_quote phải rút từ câu/cụm từ trong slide bài giảng PDF.
    
    YÊU CẦU ĐỊNH DẠNG JSON CHUẨN:
    Trả về duy nhất 1 JSON Object:
    {{
      "questions": [
        {{
          "question": "Nội dung tình huống...",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
          "answer": "B",
          "explanation": "Giải thích chi tiết...",
          "raw_quote": "Trích dẫn nguyên văn câu/cụm từ từ tài liệu slide (kèm số trang)...",
          "difficulty": "medium"
        }}
      ]
    }}
    CHỈ TRẢ VỀ DỮ LIỆU JSON HỢP LỆ, KHÔNG CHỨA BẤT KỲ VĂN BẢN NÀO KHÁC BÊN NGOÀI.
    """

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=combined_context)
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

workflow.add_node("retrieve_rag_context", retrieve_rag_context_node)
workflow.add_node("generate_quiz", generate_quiz_node)

workflow.add_edge(START, "retrieve_rag_context")
workflow.add_edge("retrieve_rag_context", "generate_quiz")
workflow.add_edge("generate_quiz", END)

quiz_graph = workflow.compile()

# ==============================================================================
# 4. INTERFACE INTERFACE GỌI ASYNC/SYNC LUỒNG LANGGRAPH
# ==============================================================================
async def run_quiz_workflow_async(
    slide_content: str,
    model_name: str = "deepseek-v4-flash",
    num_questions: int = 5,
    mode: str = "standard",
    difficulty_level: str = "mixed",
    temperature: float = 0.3,
    use_rag: bool = False  # MẶC ĐỊNH TẮT RAG để tăng tốc (chỉ bật khi có nhiều tài liệu)
) -> str:
    initial_state: QuizState = {
        "selected_model": model_name,
        "temperature": temperature,
        "slide_content": slide_content,
        "num_questions": num_questions,
        "mode": mode,
        "difficulty_level": difficulty_level,
        "use_rag": use_rag,
        "rag_context": "",
        "quiz_result": "",
        "status": "STARTING"
    }

    final_state = await quiz_graph.ainvoke(initial_state)
    return final_state["quiz_result"]


def run_quiz_workflow(
    slide_content: str,
    model_name: str = "deepseek-v4-flash",
    num_questions: int = 5,
    mode: str = "standard",
    difficulty_level: str = "mixed",
    temperature: float = 0.3,
    use_rag: bool = False  # MẶC ĐỊNH TẮT RAG
) -> str:
    """Interface đồng bộ gọi luồng LangGraph"""
    return asyncio.run(
        run_quiz_workflow_async(
            slide_content=slide_content,
            model_name=model_name,
            num_questions=num_questions,
            mode=mode,
            difficulty_level=difficulty_level,
            temperature=temperature,
            use_rag=use_rag
        )
    )

if __name__ == "__main__":
    test_content = """
    BÀI GIẢNG: ỨNG DỤNG AI TRONG ĐÀO TẠO
    1. VLearn Tutor: Trợ lý AI học tập phục vụ học viên 24/7.
    2. AI Quiz Generator: Tự động trích xuất nội dung slide để tạo đề bài kiểm tra tức thì.
    """

    print("==================================================")
    print("DEMO LIGHTRAG + LANGGRAPH WORKFLOW EXECUTION")
    print("==================================================")

    res = run_quiz_workflow(test_content, model_name="deepseek-v4-flash", num_questions=2)
    print("\n--- KẾT QUẢ SẢN XUẤT QUIZ TỪ DEEPSEEK V4 FLASH ---")
    print(res)
