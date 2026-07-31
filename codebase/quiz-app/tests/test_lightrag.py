import asyncio
import os
import sys

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure codebase/quiz-app in sys.path
APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from services.rag_engine import get_rag_instance, QueryParam

async def test_run():
    print("==================================================")
    print("[TEST] Initializing LightRAG Minimal Core...")
    print("==================================================")
    storage_path = os.path.join(APP_DIR, "rag_storage_test")
    rag = await get_rag_instance(storage_dir=storage_path)
    
    sample_slide_text = """
    BÀI GIẢNG: TỐI ƯU HÓA QUY TRÌNH HỌC TẬP VỚI AI
    1. Định nghĩa RAG: Retrieval-Augmented Generation kết hợp tìm kiếm tri thức và mô hình ngôn ngữ lớn để trả lời câu hỏi chính xác.
    2. Knowledge Graph: Đồ thị tri thức lưu trữ dưới dạng Thực thể (Nodes) và Mối quan hệ (Edges).
    3. Quiz Generator: AI chủ động tạo bộ câu hỏi trắc nghiệm kèm giải thích giúp học viên tự đánh giá năng lực sau buổi học.
    """
    
    print("\n[TEST] 1. Ingesting Slide text into Knowledge Graph...")
    await rag.ainsert(sample_slide_text)
    print(" -> Ingestion completed successfully!")
    
    print("\n[TEST] 2. Querying LightRAG to generate Quiz question...")
    response = await rag.aquery(
        "Dựa vào nội dung bài giảng, hãy tạo 1 câu hỏi trắc nghiệm kiểm tra kiến thức về RAG.",
        param=QueryParam(mode="naive")
    )
    
    print("\n==================================================")
    print("[RESULT] RAG Generated Quiz Response:")
    print("==================================================")
    print(response)

if __name__ == "__main__":
    asyncio.run(test_run())
