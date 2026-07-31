import os
import sys
import json
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent
CODEBASE_DIR = ROOT_DIR / "codebase"

for p in [str(ROOT_DIR), str(CODEBASE_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

os.chdir(str(ROOT_DIR))

from agents.page_rag_agent import PageAwareRAGAgent
from config.settings import SLIDES_DIR, DEFAULT_PROVIDER, DEFAULT_OPENAI_MODEL, DEFAULT_GEMINI_MODEL

def run_evaluation():
    eval_dir = ROOT_DIR / "eval"
    runs_dir = eval_dir / "runs"
    runs_dir.mkdir(parents=True, exist_ok=True)
    
    golden_path = eval_dir / "golden_set.json"
    if not golden_path.exists():
        print(f"❌ Không tìm thấy file golden set tại: {golden_path}")
        return

    with open(golden_path, "r", encoding="utf-8") as f:
        cases = json.load(f)

    slide_file = str(SLIDES_DIR / "d1-slide-hackathon.pdf")
    model_name = DEFAULT_GEMINI_MODEL if DEFAULT_PROVIDER == "gemini" else DEFAULT_OPENAI_MODEL
    print(f"🚀 Bắt đầu chạy Đánh giá (Evaluation) {len(cases)} cases...")
    print(f"📄 Slide File: {slide_file}")
    print(f"⚡ LLM Provider & Model: {DEFAULT_PROVIDER} ({model_name})\n")

    agent = PageAwareRAGAgent(provider=DEFAULT_PROVIDER, model_name=model_name)
    
    results = []
    pass_count = 0

    for idx, tc in enumerate(cases):
        c_id = tc["case_id"]
        p_num = tc.get("page_number")
        query = tc["user_query"]
        expected_kw = tc.get("expected_keywords", [])
        
        print(f"[{idx+1}/{len(cases)}] Running {c_id}: {query[:50]}...")
        
        try:
            if p_num is not None and "tóm tắt" in query.lower():
                response_text = agent.summarize_page(slide_path=slide_file, page_number=p_num)
            else:
                response_text = agent.ask_question(slide_path=slide_file, query=query, page_number=p_num)

            resp_lower = response_text.lower()
            matched_kw = [kw for kw in expected_kw if kw.lower() in resp_lower]
            
            # 1. Bất kỳ lỗi API thực sự nào (HTTP 429, 401, Quota, Error) -> FAIL
            is_system_error = any(err in resp_lower for err in [
                "429", "401", "quota", "resource_exhausted", "error", 
                "mock llm response", "thông báo hệ thống"
            ])
            
            if is_system_error:
                is_pass = False
            else:
                # 2. Xử lý case từ chối phạm vi (HAX G10 refusal / Slide trống / Out of scope)
                is_refusal_case = (
                    "không" in query.lower() or "viết hộ" in query.lower() or 
                    "giải hộ" in query.lower() or "quiz" in query.lower() or 
                    "mấy giờ" in query.lower() or "hãng nào" in query.lower() or 
                    "điêu toa" in query.lower() or p_num == 33
                )
                
                refusal_phrases = [
                    "không thể", "chưa chứa", "từ chối", "chưa có nội dung", 
                    "không chứa thông tin", "không hỗ trợ", "không đúng", "không chỉ",
                    "rất tiếc", "slide trống"
                ]
                
                has_refusal = any(ref in resp_lower for ref in refusal_phrases)
                
                if is_refusal_case:
                    # Case từ chối chỉ cần có thái độ từ chối đúng rào chắn HAX G10
                    is_pass = has_refusal
                else:
                    # Case hỏi đáp thường phải khớp ít nhất 1 từ khóa kỳ vọng
                    required_count = max(1, len(expected_kw) // 2) if expected_kw else 1
                    is_pass = len(matched_kw) >= required_count


            if is_pass:
                pass_count += 1
                status = "PASS"
            else:
                status = "FAIL"

            results.append({
                "case_id": c_id,
                "category": tc["category"],
                "query": query,
                "response": response_text.replace("\n", " "),
                "status": status,
                "matched_keywords": matched_kw
            })

        except Exception as e:
            results.append({
                "case_id": c_id,
                "category": tc["category"],
                "query": query,
                "response": f"ERROR: {str(e)}",
                "status": "FAIL",
                "matched_keywords": []
            })

    pass_rate = (pass_count / len(cases)) * 100
    print(f"\n==================================================")
    print(f"🎯 KẾT QUẢ ĐÁNH GIÁ: {pass_count}/{len(cases)} PASS ({pass_rate:.1f}%)")
    print(f"==================================================")

    now_dt = datetime.now()
    timestamp_str = now_dt.strftime("%Y%m%d_%H%M%S")
    timestamp_iso = now_dt.isoformat()

    log_payload = {
        "timestamp": timestamp_iso,
        "provider": DEFAULT_PROVIDER,
        "model": model_name,
        "pass_rate": f"{pass_rate:.1f}%",
        "total_cases": len(cases),
        "passed_count": pass_count,
        "failed_count": len(cases) - pass_count,
        "detailed_results": results
    }

    safe_model = model_name.replace("/", "_").replace(":", "_")
    history_file = runs_dir / f"eval_log_{timestamp_str}_{safe_model}.json"
    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(log_payload, f, ensure_ascii=False, indent=2)

    latest_file = eval_dir / "eval_results_log.json"
    with open(latest_file, "w", encoding="utf-8") as f:
        json.dump(log_payload, f, ensure_ascii=False, indent=2)

    report_md = f"""# 📈 BẢNG KẾT QUẢ ĐÁNH GIÁ (EVALUATION REPORT)

- **Thời gian đo:** {timestamp_iso}
- **Provider:** `{DEFAULT_PROVIDER}`
- **Model sử dụng:** `{model_name}`
- **Quality Bar chốt tại spec.md:** >= 85%
- **Kết quả thực tế:** **{pass_count}/{len(cases)} cases PASS ({pass_rate:.1f}%)** $\rightarrow$ **{"ĐẠT QUALITY BAR" if pass_rate >= 85 else "CHƯA ĐẠT QUALITY BAR"}**

---

## 📊 Bảng Đánh Giá Chi Tiết {len(cases)} Test Cases

| Case ID | Thể loại / Lớp chỗ khó | Câu hỏi / Input | Kết quả AI Tutor phản hồi | Đánh giá |
|---|---|---|---|:---:|
"""
    for r in results:
        clean_resp = r['response'][:120] + "..." if len(r['response']) > 120 else r['response']
        badge = "🟢 **PASS**" if r['status'] == "PASS" else "🔴 **FAIL**"
        report_md += f"| **{r['case_id']}** | {r['category']} | {r['query']} | {clean_resp} | {badge} |\n"

    out_file = eval_dir / "run_2_final.md"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(report_md)

    print(f"📄 Đã lưu báo cáo Markdown tại: {out_file}")
    print(f"📁 Đã lưu log LỊCH SỬ tại: {history_file}")
    print(f"⭐ Đã cập nhật log MỚI NHẤT tại: {latest_file}")

if __name__ == "__main__":
    run_evaluation()
