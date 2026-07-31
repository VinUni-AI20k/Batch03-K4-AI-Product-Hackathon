"""
Tool 7: explain_concept
Giải thích các khái niệm AI/ML/LLM phổ biến từ từ điển nội bộ.
Không cần gọi LLM — trả về định nghĩa chuẩn tích hợp sẵn.
"""
import json
import re

SCHEMA = {
    "type": "function",
    "function": {
        "name": "explain_concept",
        "description": (
            "Giải thích khái niệm AI/ML/LLM/RAG/Agent từ từ điển chuyên ngành. "
            "Dùng khi người dùng hỏi 'X là gì?', 'giải thích X', 'X nghĩa là gì'."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "concept": {
                    "type": "string",
                    "description": "Tên khái niệm cần giải thích (ví dụ: RAG, LLM, embedding, fine-tuning)."
                }
            },
            "required": ["concept"]
        }
    }
}

CONCEPT_DB = {
    "rag": {
        "full_name": "Retrieval-Augmented Generation",
        "vi": "RAG là kỹ thuật kết hợp tìm kiếm tài liệu liên quan (retrieval) với mô hình sinh văn bản (generation). Thay vì chỉ dựa vào kiến thức đã học, LLM được cung cấp thêm context từ KB → câu trả lời chính xác hơn, cập nhật hơn.",
        "example": "Hỏi: 'Deadline CP4 là khi nào?' → RAG tìm trong FB Group KB → LLM tổng hợp trả lời.",
        "tags": ["rag", "retrieval", "augmented", "generation"]
    },
    "llm": {
        "full_name": "Large Language Model",
        "vi": "LLM là mô hình ngôn ngữ lớn được huấn luyện trên lượng văn bản khổng lồ. Có khả năng hiểu và sinh văn bản tự nhiên. Ví dụ: GPT-4, Claude, Gemini.",
        "example": "GPT-4o-mini là LLM được dùng trong hệ thống này.",
        "tags": ["llm", "large language model", "gpt", "claude", "gemini"]
    },
    "embedding": {
        "full_name": "Vector Embedding",
        "vi": "Embedding là quá trình chuyển văn bản thành vector số thực trong không gian đa chiều. Các văn bản có nghĩa tương tự sẽ có vector gần nhau (cosine similarity cao).",
        "example": "MiniLM-L12-v2 tạo embedding 384 chiều, dùng để so sánh câu hỏi với KB.",
        "tags": ["embedding", "vector", "semantic", "minilm"]
    },
    "agent": {
        "full_name": "AI Agent",
        "vi": "AI Agent là hệ thống AI có khả năng lập kế hoạch và tự động gọi các tool để hoàn thành nhiệm vụ phức tạp. Khác với chatbot đơn thuần, agent có thể search KB, search internet, tính toán... trong một vòng lặp.",
        "example": "AIQAAgent trong dự án này: nhận câu hỏi → chọn tool → gọi tool → tổng hợp → trả lời.",
        "tags": ["agent", "agentic", "tool calling", "function calling"]
    },
    "bm25": {
        "full_name": "Best Matching 25",
        "vi": "BM25 là thuật toán tìm kiếm dựa trên tần suất từ khóa (TF-IDF cải tiến). Hoạt động tốt với exact keyword match. Trong hệ thống này, BM25 kết hợp với Semantic Search (40% BM25 + 60% semantic).",
        "example": "Query 'deadline CP4' → BM25 tìm docs chứa đúng từ 'deadline' và 'CP4'.",
        "tags": ["bm25", "tfidf", "keyword search", "retrieval"]
    },
    "fine-tuning": {
        "full_name": "Fine-tuning",
        "vi": "Fine-tuning là quá trình huấn luyện thêm một mô hình pretrained trên dữ liệu chuyên biệt. Giúp mô hình học cách trả lời đặc thù cho domain cụ thể.",
        "example": "Fine-tune GPT trên dữ liệu Q&A của khóa học → mô hình hiểu sâu hơn về chương trình.",
        "tags": ["fine-tuning", "finetune", "training", "lora", "qlora"]
    },
    "prompt engineering": {
        "full_name": "Prompt Engineering",
        "vi": "Kỹ thuật thiết kế câu lệnh (prompt) để hướng dẫn LLM tạo ra output mong muốn. Bao gồm: zero-shot, few-shot, chain-of-thought, system prompt...",
        "example": "System prompt trong agent.py hướng dẫn AI ưu tiên gọi search_knowledge_base trước.",
        "tags": ["prompt", "prompt engineering", "few-shot", "cot", "chain of thought"]
    },
    "vector database": {
        "full_name": "Vector Database",
        "vi": "Cơ sở dữ liệu tối ưu cho việc lưu trữ và tìm kiếm vector embedding. Hỗ trợ ANN (Approximate Nearest Neighbor) search rất nhanh. Ví dụ: Pinecone, Weaviate, Qdrant, ChromaDB.",
        "example": "Thay MongoDB bằng Qdrant để tăng tốc semantic search với hàng triệu docs.",
        "tags": ["vector database", "vectordb", "pinecone", "qdrant", "chroma", "weaviate"]
    },
    "guardrail": {
        "full_name": "AI Guardrail",
        "vi": "Guardrail là các lớp bảo vệ ngăn AI trả lời sai, ngoài phạm vi, hoặc vi phạm quy tắc. Hệ thống này có 4 lớp: Layer1 (ground truth), Layer2 (ambiguity), Layer3 (authority/OOD), Layer4 (domain tagging).",
        "example": "Hỏi 'giá VinFast?' → Layer3 chặn vì ngoài phạm vi khóa học.",
        "tags": ["guardrail", "safety", "moderation", "layer"]
    },
    "transformer": {
        "full_name": "Transformer Architecture",
        "vi": "Kiến trúc mạng neural dựa trên cơ chế attention, nền tảng của hầu hết LLM hiện đại. Giới thiệu trong paper 'Attention is All You Need' (2017). Encoder-only (BERT), Decoder-only (GPT), Encoder-Decoder (T5).",
        "example": "MiniLM dùng transformer encoder để tạo embedding câu.",
        "tags": ["transformer", "attention", "bert", "gpt", "encoder", "decoder"]
    },
    "hallucination": {
        "full_name": "AI Hallucination",
        "vi": "Hiện tượng LLM tạo ra thông tin sai lệch, bịa đặt nhưng trình bày tự tin. RAG giúp giảm hallucination bằng cách cung cấp context thực từ KB.",
        "example": "Không dùng RAG → LLM có thể bịa deadline. Dùng RAG → lấy deadline đúng từ FB Group KB.",
        "tags": ["hallucination", "factual error", "grounding"]
    },
    "checkpoint": {
        "full_name": "Checkpoint (Hackathon)",
        "vi": "Checkpoint (CP) là các mốc kiểm tra tiến độ trong Mini Hackathon AI. CP1-CP3 là check-in nhóm, CP4 chốt spec.md lúc 17:30 Ngày 1, CP5 demo prototype, CP6 demo & chấm điểm lúc 10:00-15:00 Ngày 2.",
        "example": "CP4: nộp spec.md hoàn chỉnh trước 23:59 Ngày 1.",
        "tags": ["checkpoint", "cp4", "cp5", "cp6", "hackathon", "deadline"]
    },
}


def run(concept: str, **_) -> str:
    if not concept.strip():
        return json.dumps({"error": "Vui lòng cung cấp tên khái niệm."}, ensure_ascii=False)

    key = concept.lower().strip()
    # Direct match
    entry = CONCEPT_DB.get(key)
    if not entry:
        # Fuzzy match qua tags
        for k, v in CONCEPT_DB.items():
            if any(tag in key or key in tag for tag in v.get("tags", [])):
                entry = v
                key = k
                break

    if not entry:
        available = ", ".join(CONCEPT_DB.keys())
        return json.dumps({
            "found": False,
            "concept": concept,
            "message": f"Chưa có trong từ điển nội bộ. Các khái niệm hiện có: {available}",
        }, ensure_ascii=False)

    return json.dumps({
        "found": True,
        "concept": key,
        "full_name": entry["full_name"],
        "explanation": entry["vi"],
        "example": entry.get("example", ""),
    }, ensure_ascii=False, indent=2)
