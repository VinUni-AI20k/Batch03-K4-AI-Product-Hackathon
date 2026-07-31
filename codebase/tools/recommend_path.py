"""
Tool 9: recommend_path
Gợi ý lộ trình học tập AI/ML phù hợp theo mức độ kinh nghiệm.
"""
import json

SCHEMA = {
    "type": "function",
    "function": {
        "name": "recommend_path",
        "description": (
            "Gợi ý lộ trình học tập AI/ML/LLM phù hợp theo trình độ và mục tiêu. "
            "Dùng khi người dùng hỏi 'nên học gì', 'bắt đầu từ đâu', 'lộ trình AI', 'career path'."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "level": {
                    "type": "string",
                    "description": "Trình độ hiện tại: 'beginner', 'intermediate', 'advanced'. Mặc định 'beginner'.",
                    "default": "beginner"
                },
                "goal": {
                    "type": "string",
                    "description": "Mục tiêu: 'llm_engineer', 'ml_engineer', 'data_scientist', 'ai_product'. Mặc định 'llm_engineer'.",
                    "default": "llm_engineer"
                }
            },
            "required": []
        }
    }
}

PATHS = {
    ("beginner", "llm_engineer"): {
        "title": "Lộ trình LLM Engineer – Người mới bắt đầu",
        "duration": "3–4 tháng",
        "steps": [
            "1. Python cơ bản: list, dict, function, OOP, file I/O (2 tuần)",
            "2. Git & GitHub: commit, branch, PR (3 ngày)",
            "3. Prompt Engineering: zero-shot, few-shot, CoT, system prompt (1 tuần)",
            "4. OpenAI API / Anthropic API: gọi API, streaming, function calling (1 tuần)",
            "5. RAG cơ bản: chunking, embedding, vector search, context injection (2 tuần)",
            "6. LangChain / LlamaIndex: chains, agents, tools (2 tuần)",
            "7. Dự án thực tế: xây chatbot RAG cho domain cụ thể (1 tháng)",
        ],
        "resources": ["Fast.ai", "Deeplearning.ai Short Courses", "LangChain docs", "Khóa AI Thực Chiến Vingroup"]
    },
    ("beginner", "ml_engineer"): {
        "title": "Lộ trình ML Engineer – Người mới bắt đầu",
        "duration": "6–9 tháng",
        "steps": [
            "1. Python + NumPy + Pandas (1 tháng)",
            "2. Toán ML: Linear Algebra, Calculus, Statistics cơ bản (1 tháng)",
            "3. Scikit-learn: regression, classification, clustering (1 tháng)",
            "4. Deep Learning: PyTorch cơ bản, MLP, CNN (1–2 tháng)",
            "5. NLP cơ bản: tokenization, TF-IDF, Transformer (1 tháng)",
            "6. MLOps cơ bản: experiment tracking, model serving (1 tháng)",
        ],
        "resources": ["CS229 Stanford", "fast.ai", "Kaggle Learn", "Hugging Face Course"]
    },
    ("intermediate", "llm_engineer"): {
        "title": "Lộ trình LLM Engineer – Trung cấp",
        "duration": "2–3 tháng",
        "steps": [
            "1. Advanced RAG: re-ranking, HyDE, multi-query, parent-child chunks",
            "2. Agent frameworks: ReAct, Tool Use, Multi-agent (AutoGen, CrewAI)",
            "3. Fine-tuning: LoRA, QLoRA với Hugging Face PEFT",
            "4. Evaluation: RAGAS, LLM-as-judge, golden set",
            "5. Production: caching, rate limiting, cost optimization, monitoring",
        ],
        "resources": ["LlamaIndex Advanced", "RAGAS docs", "Hugging Face PEFT", "Langfuse"]
    },
    ("advanced", "llm_engineer"): {
        "title": "Lộ trình LLM Engineer – Nâng cao",
        "duration": "Liên tục",
        "steps": [
            "1. Pre-training & RLHF: hiểu sâu quá trình huấn luyện LLM",
            "2. Mixture of Experts (MoE), speculative decoding, quantization",
            "3. Multi-modal: vision-language models (LLaVA, GPT-4V)",
            "4. Research papers: đọc và implement arxiv mới",
            "5. Open-source contribution: LangChain, LlamaIndex, vLLM",
        ],
        "resources": ["arxiv.org", "Andrej Karpathy's YouTube", "HuggingFace blog", "Sebastian Raschka's newsletter"]
    },
}


def run(level: str = "beginner", goal: str = "llm_engineer", **_) -> str:
    level = level.lower().strip()
    goal = goal.lower().strip()

    # Normalize
    if level not in ("beginner", "intermediate", "advanced"):
        level = "beginner"
    if goal not in ("llm_engineer", "ml_engineer", "data_scientist", "ai_product"):
        goal = "llm_engineer"

    key = (level, goal)
    path = PATHS.get(key) or PATHS.get((level, "llm_engineer")) or list(PATHS.values())[0]

    return json.dumps({
        "level": level,
        "goal": goal,
        **path
    }, ensure_ascii=False, indent=2)
