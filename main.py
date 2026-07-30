import sys
import argparse
from pathlib import Path

# Đảm bảo Python nhận diện được thư mục gốc của dự án
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from agents import SlideSummaryAgent, PageAwareRAGAgent
from config.settings import SLIDES_DIR, OUTPUT_DIR, DEFAULT_PROVIDER, DEFAULT_OPENAI_MODEL

def main():
    parser = argparse.ArgumentParser(description="VLearn Page-Aware AI Tutor Agent (OpenAI RAG)")
    parser.add_argument(
        "--file", 
        type=str, 
        default=str(SLIDES_DIR / "d1-slide-hackathon.pdf"),
        help="Đường dẫn đến file slide PDF hoặc PPTX"
    )
    parser.add_argument(
        "--page", 
        type=int, 
        default=None,
        help="Số trang slide cụ thể cần tóm tắt RAG (ví dụ: --page 7)"
    )
    parser.add_argument(
        "--query", 
        type=str, 
        default=None,
        help="Câu hỏi học viên muốn hỏi về tài liệu (ví dụ: --query 'PM và Project Manager khác nhau thế nào?')"
    )
    parser.add_argument(
        "--provider", 
        type=str, 
        default=DEFAULT_PROVIDER, 
        choices=["gemini", "openai"],
        help="LLM Provider (openai hoặc gemini)"
    )
    parser.add_argument(
        "--model", 
        type=str, 
        default=DEFAULT_OPENAI_MODEL,
        help="Tên mô hình AI (mặc định: gpt-4o-mini)"
    )


    args = parser.parse_args()

    print("==================================================")
    print("🤖 VLEARN PAGE-AWARE AI TUTOR (GEMINI 2.5 FLASH)")
    print("==================================================")
    print(f"📄 Slide File: {args.file}")
    print(f"⚡ AI Model : {args.provider} ({args.model})")
    if args.page:
        print(f"🎯 Target Page: Trang {args.page}")
    print("--------------------------------------------------")

    # Nếu có chỉ định --page hoặc --query, sử dụng PageAwareRAGAgent
    if args.page is not None or args.query is not None:
        agent = PageAwareRAGAgent(provider=args.provider, model_name=args.model)
        
        if args.page is not None and args.query is None:
            print(f"🔍 [RAG Agent] Đang thực hiện Metadata-Filtered RAG cho Trang {args.page}...")
            res = agent.summarize_page(slide_path=args.file, page_number=args.page)
            print("\n📝 KẾT QUẢ TÓM TẮT TRANG:")
            print(res)
        elif args.query is not None:
            print(f"❓ [RAG Agent] Đang trả lời câu hỏi: '{args.query}'...")
            res = agent.ask_question(slide_path=args.file, query=args.query, page_number=args.page)
            print("\n💡 CÂU TRẢ LỜI CỦA TUTOR:")
            print(res)
    else:
        # Tóm tắt toàn bộ slide bằng SlideSummaryAgent
        agent = SlideSummaryAgent(provider=args.provider, model_name=args.model)
        res = agent.summarize_slide_file(file_path=args.file, output_dir=str(OUTPUT_DIR))
        print("\n🎉 Tóm tắt toàn bộ slide hoàn tất!")
        if res.get("saved_file_path"):
            print(f"📄 File lưu tại: {res['saved_file_path']}")

if __name__ == "__main__":
    main()
