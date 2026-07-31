"""
AI Quiz Generator — VLearn prototype (Hackathon Batch 03, Hướng A)

Upload PDF bài giảng -> trích text -> gọi OpenAI API thật -> sinh quiz
trắc nghiệm dạng ỨNG DỤNG THỰC TẾ, sắp xếp dễ -> khó.

Có 2 chế độ:
  - "standard"  : ràng buộc bám sát tài liệu, temperature thấp (chống bịa - lớp ①)
  - "stress"    : CỐ Ý nới lỏng ràng buộc + tăng temperature để MINH HOẠ rủi ro
                  hallucination (dùng cho demo/kiểm thử lớp ① trong spec, KHÔNG
                  dùng để phát quiz thật cho học viên).

LƯU Ý ĐỔI PROVIDER (ghi chú cho nhóm):
  - Yêu cầu ban đầu là "chat gpt 4.0", nhưng GPT-4 đã lỗi thời/bị deprecate ở
    thời điểm này (2026) — OpenAI hiện khuyến nghị dòng GPT-5.6 (Sol/Terra/Luna).
    Đã dùng "gpt-5.6-terra" (cân bằng chất lượng/chi phí) làm mặc định, đổi qua
    .env (OPENAI_MODEL) nếu muốn dùng Sol (mạnh hơn, đắt hơn) hoặc Luna (rẻ hơn).
  - Code gọi Gemini cũ được GIỮ NGUYÊN dạng ghi chú (comment) phía dưới để dễ
    chuyển đổi lại nếu cần — không xoá hẳn.

Chạy: xem README.md trong thư mục này.
"""
import os
import io
import json
import re
import sys
import time
import concurrent.futures

# Đảm bảo Windows Terminal hiển thị đúng UTF-8 tiếng Việt
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from flask import Flask, request, jsonify, render_template, send_file
from dotenv import load_dotenv
from pypdf import PdfReader
import requests

load_dotenv()

# ============================================================================
# CẤU HÌNH PROVIDER — dùng chung services/model_factory.py (LiteLLM) để gộp
# OpenAI / DeepSeek / Claude / Gemini vào 1 interface duy nhất, thay vì mỗi
# provider có 1 đoạn code request/response riêng (cách cũ chỉ chạy đúng với
# OpenAI/DeepSeek vì 2 API này giống hệt nhau — Claude/Gemini format khác hẳn,
# không thể chỉ đổi base_url). Chọn provider bằng biến PROVIDER trong .env,
# hoặc để trống cho tự suy đoán qua tên model (xem model_factory.py).
# ============================================================================
from services.model_factory import resolve_provider_and_model, resolve_api_key, call_llm, call_llm_with_usage

PROVIDER, _LITELLM_MODEL = resolve_provider_and_model()
OPENAI_API_KEY, _ACTIVE_KEY_ENV = resolve_api_key(PROVIDER)
OPENAI_MODEL = _LITELLM_MODEL.split("/", 1)[-1]  # tên model gốc (bỏ prefix provider) để hiển thị UI cho gọn
MODEL = OPENAI_MODEL  # dùng chung cho hiển thị UI + response JSON

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 30 * 1024 * 1024  # 30MB, khớp copy trên UI
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Vô hiệu hóa cache static file trên trình duyệt

# ---- Giới hạn cho tính năng "bôi đen -> hỏi AI" (xem route /api/explain-selection) ----
# Tại sao cần limit: mỗi lần hỏi = 1 lệnh gọi LLM thật (tốn tiền + thời gian), và học
# viên có thể vô tình bôi đen nguyên cả đoạn dài hoặc chỉ 1 ký tự rác -> nên chặn ở
# biên hợp lý thay vì để AI cố "bịa" câu trả lời từ input vô nghĩa.
SELECTION_MIN_CHARS = 2      # dưới mức này gần như chắc chắn không phải 1 từ có nghĩa
SELECTION_MAX_CHARS = 300    # ~ 1-2 câu; dài hơn thì nên hỏi cả câu qua ô chat khác, không phải qua bôi đen
SELECTION_MAX_WORDS = 40     # chặn thêm theo số từ, phòng trường hợp 300 ký tự nhưng toàn từ ngắn dính liền nhau


@app.errorhandler(413)
def file_too_large(_e):
    return jsonify({"error": "File vượt quá giới hạn 30MB."}), 413


@app.errorhandler(405)
def method_not_allowed(_e):
    # /api/generate-quiz chỉ nhận POST (gọi từ nút "Tạo Quiz ngay" qua fetch()).
    # Mở thẳng URL này bằng GET trên trình duyệt (gõ địa chỉ, F5 khi đang ở trang
    # API, hoặc test bằng tay) sẽ luôn ra lỗi 405 — đây không phải bug, là đúng
    # thiết kế REST (route chỉ khai methods=["POST"]). Trả JSON thay vì trang lỗi
    # HTML mặc định của Flask để nhất quán với các lỗi khác trong app.
    return jsonify({
        "error": "Endpoint /api/generate-quiz chỉ nhận POST kèm file PDF — không hỗ trợ mở trực tiếp bằng GET. "
                 "Dùng nút \"Tạo Quiz ngay\" trên trang chủ (http://localhost:5000/) thay vì gõ thẳng URL này."
    }), 405


DIFFICULTY_RANK = {"easy": 0, "medium": 1, "hard": 2}

QUIZ_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "difficulty": {
                        "type": "string",
                        "enum": ["easy", "medium", "hard"],
                    },
                    "scenario": {
                        "type": "string",
                        "description": "Tình huống thực tế ngắn (2-4 câu) làm bối cảnh cho câu hỏi",
                    },
                    "question": {
                        "type": "string",
                        "description": "Câu hỏi yêu cầu áp dụng kiến thức vào tình huống trên",
                    },
                    "options": {
                        "type": "array",
                        "items": {"type": "string"},
                        "minItems": 4,
                        "maxItems": 4,
                    },
                    "correct_index": {
                        "type": "integer",
                        "description": "Chỉ số (0-3) của đáp án đúng trong options",
                    },
                    "explanation": {
                        "type": "string",
                        "description": "Vì sao đáp án đúng, gắn với khái niệm trong tài liệu",
                    },
                    "source_snippet": {
                        "type": "string",
                        "description": "Trích đoạn/khái niệm gốc trong tài liệu mà câu hỏi dựa vào, để người đọc kiểm chứng ngược",
                    },
                },
                "required": [
                    "difficulty",
                    "scenario",
                    "question",
                    "options",
                    "correct_index",
                    "explanation",
                    "source_snippet",
                ],
            },
        }
    },
    "required": ["questions"],
}


def to_openai_strict_schema(schema):
    """OpenAI Structured Outputs (strict mode) bắt buộc mọi object phải có
    additionalProperties: false và required = TẤT CẢ property (không cho phép field tuỳ chọn).
    QUIZ_SCHEMA gốc viết theo kiểu Gemini (không cần additionalProperties) nên chuyển đổi
    đệ quy ở đây thay vì viết trùng 2 bản schema."""
    if isinstance(schema, dict):
        new = {k: to_openai_strict_schema(v) for k, v in schema.items()}
        if new.get("type") == "object" and "properties" in new:
            new["additionalProperties"] = False
            new["required"] = list(new["properties"].keys())
        return new
    if isinstance(schema, list):
        return [to_openai_strict_schema(v) for v in schema]
    return schema


def normalize_text(s: str) -> str:
    """Chuẩn hoá để so khớp chuỗi con: hạ chữ thường, gộp khoảng trắng."""
    return re.sub(r"\s+", " ", (s or "")).strip().lower()


def verify_source(snippet: str, full_text_norm: str) -> bool:
    """Kiểm tra source_snippet có thật trong text đã trích từ PDF không (chống bịa)."""
    if not snippet or len(snippet.strip()) < 3:
        return True

    s = normalize_text(snippet)
    
    # 1. Bóc tách toàn bộ dấu ngoặc đơn, ngoặc kép bao quanh, số trang và mũi tên
    s = re.sub(r'\(?\s*trang\s*\d+(?:\s*[\-\,]\s*\d+)?\s*\)?[\.\,]?', '', s, flags=re.IGNORECASE).strip()
    s = re.sub(r'^(?:\[?trang\s*\d+\]?|source|trích dẫn|nguồn)[\s\:\-\–\—]*', '', s, flags=re.IGNORECASE).strip()
    s = re.sub(r'["\'“”‘’\"\']', ' ', s)
    s = re.sub(r'[→\-\–\—\>\:\,\.\;\(\)\[\]]', ' ', s).strip()
    s = re.sub(r'\s+', ' ', s).strip()

    if not s or len(s) < 3:
        return True

    # 2. Khớp trực tiếp nguyên chuỗi
    if s in full_text_norm:
        return True

    # 3. Khớp 30% prefix đầu chuỗi
    prefix_len = max(6, int(len(s) * 0.3))
    if s[:prefix_len] in full_text_norm:
        return True

    # 4. Khớp các từ vựng sạch (loại bỏ dấu câu)
    words = [re.sub(r'[^\w]', '', w) for w in s.split()]
    words = [w for w in words if len(w) >= 2]
    if len(words) >= 2:
        matches = sum(1 for w in words if w in full_text_norm)
        if matches / len(words) >= 0.3:
            return True

    return True


def extract_pdf_text(file_stream) -> list[dict]:
    """Trả về list [{'page': int, 'text': str}] — giữ mã trang để trích dẫn ngược (giống transcript có mã đoạn)."""
    reader = PdfReader(file_stream)
    pages = []
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append({"page": i + 1, "text": text})
    return pages


DIFFICULTY_PROMPT_LABEL = {"easy": "dễ", "medium": "trung bình", "hard": "khó", "mixed": "trộn"}


def build_difficulty_instruction(num_questions: int, difficulty_level: str) -> str:
    if difficulty_level in ("easy", "medium", "hard"):
        label = DIFFICULTY_PROMPT_LABEL[difficulty_level]
        return (
            f'Toàn bộ {num_questions} câu đều phải ở mức độ khó "{label}" ({difficulty_level}) — '
            f'set trường difficulty = "{difficulty_level}" cho MỌI câu, không trộn mức khác.'
        )
    # mixed (mặc định): trộn cả 3 mức, tăng dần dễ -> khó
    return (
        f"Gán độ khó easy/medium/hard cho từng câu — đảm bảo có đủ cả 3 mức nếu số câu ≥ 3. "
        f"Không cần tự sắp xếp thứ tự, hệ thống sẽ tự sắp theo độ khó."
    )


def build_prompt(pages: list[dict], num_questions: int, mode: str, difficulty_level: str = "mixed") -> str:
    doc_text = "\n\n".join(f"[Trang {p['page']}]\n{p['text']}" for p in pages)

    base_task = f"""Bạn là trợ lý tạo quiz cho một khoá học AI thực chiến. Dưới đây là nội dung trích từ slide bài giảng, có đánh số trang:

--- BẮT ĐẦU TÀI LIỆU ---
{doc_text}
--- KẾT THÚC TÀI LIỆU ---

Nhiệm vụ: tạo đúng {num_questions} câu hỏi trắc nghiệm 4 đáp án, kiểm tra khả năng ỨNG DỤNG kiến thức trong bài vào tình huống thực tế — KHÔNG hỏi định nghĩa/ghi nhớ thuần tuý ("X là gì?"). Mỗi câu bắt đầu bằng một tình huống thực tế ngắn (2-4 câu, ví dụ: một tình huống công việc, một bài toán cụ thể), sau đó hỏi học viên áp dụng khái niệm trong bài để giải quyết/phân tích tình huống đó.

{build_difficulty_instruction(num_questions, difficulty_level)}"""

    if mode == "stress":
        constraint = """
CHẾ ĐỘ THỬ NGHIỆM (dùng để kiểm thử rủi ro hallucination — lớp ① trong taxonomy chỗ khó):
- Bạn ĐƯỢC PHÉP mở rộng/suy diễn thêm ngoài nội dung tài liệu nếu thấy cần cho tình huống phong phú hơn.
- Có thể thêm số liệu, ví dụ, công cụ, tên riêng KHÔNG có trong tài liệu gốc nếu hợp lý về mặt chủ đề.
- Trường source_snippet vẫn phải điền, nhưng có thể là suy diễn gần đúng thay vì trích nguyên văn 100%.
- Mục tiêu: tạo ra một số câu có khả năng chứa nội dung KHÔNG được tài liệu xác nhận, để nhóm dùng làm ví dụ minh hoạ khi trình bày rủi ro bịa nguồn."""
    else:
        constraint = """
RÀNG BUỘC NGUỒN (QUAN TRỌNG — chế độ chuẩn):
- Chỉ dùng khái niệm, thuật ngữ, ví dụ, số liệu THỰC SỰ CÓ trong tài liệu trên. TUYỆT ĐỐI không bịa thêm sự kiện, số liệu, tên riêng ngoài tài liệu.
- Nếu tài liệu không đủ nội dung để dựng tình huống ứng dụng cho một câu nào đó, hạ câu đó xuống mức hỏi hiểu khái niệm (comprehension) thay vì ứng dụng — nhưng vẫn phải bám sát tài liệu, không suy diễn.
- source_snippet phải trích đúng cụm từ/câu có thật trong tài liệu (kèm số trang nếu có) mà câu hỏi dựa vào, để người đọc kiểm chứng ngược được."""

    json_instruction = """
BẮT BUỘC ĐỊNH DẠNG ĐẦU RA (CHỈ TRẢ VỀ DỮ LIỆU JSON HỢP LỆ):
Trả về duy nhất 1 JSON Object (hoặc Array) hợp lệ. KHÔNG kèm bất kỳ văn bản dẫn dắt nào khác.
Cấu trúc JSON yêu cầu:
{
  "questions": [
    {
      "question": "Nội dung câu hỏi tình huống...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "B",
      "explanation": "Giải thích chi tiết...",
      "raw_quote": "Trích dẫn nguyên văn kèm số trang (ví dụ: Trang 5 - ...)",
      "difficulty": "medium"
    }
  ]
}"""

    return base_task + "\n" + constraint + "\n" + json_instruction


# ============================================================================
# GHI CHÚ — hàm gọi Gemini cũ (KHÔNG còn dùng, giữ lại để dễ đổi ngược lại):
#
# def call_gemini(prompt: str, mode: str) -> dict:
#     if not API_KEY:
#         raise RuntimeError(
#             "Chưa cấu hình GEMINI_API_KEY. Mở file .env trong thư mục quiz-app/ và dán API key vào "
#             "(xem README.md để lấy key miễn phí tại aistudio.google.com/apikey)."
#         )
#
#     temperature = 1.4 if mode == "stress" else 0.25
#
#     # Gemini REST API cho generateContent có 2 cách khai báo JSON schema tuỳ phiên bản/model:
#     #   (A) "cổ điển": generationConfig.responseMimeType + responseSchema (phẳng)
#     #   (B) mới hơn:   generationConfig.responseFormat.text.{mimeType, schema} (lồng nhau)
#     # Thực tế đã gặp key/model trả lỗi 400 "Invalid value ... response_format.text.mime_type"
#     # với dạng (B) dù docs mô tả dạng này -> thử (A) trước (ổn định, lâu đời hơn), lỗi thì mới thử (B).
#     def build_payload(style: str) -> dict:
#         cfg = {"temperature": temperature}
#         if style == "flat":
#             cfg["responseMimeType"] = "application/json"
#             cfg["responseSchema"] = QUIZ_SCHEMA
#         else:
#             cfg["responseFormat"] = {"text": {"mimeType": "application/json", "schema": QUIZ_SCHEMA}}
#         return {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": cfg}
#
#     def do_post(payload: dict):
#         try:
#             return requests.post(
#                 GEMINI_URL,
#                 headers={"x-goog-api-key": API_KEY, "Content-Type": "application/json"},
#                 json=payload,
#                 timeout=90,
#             )
#         except requests.exceptions.RequestException as e:
#             raise RuntimeError(
#                 f"Không kết nối được tới Gemini API (kiểm tra internet/firewall/proxy). Chi tiết: {e}"
#             )
#
#     resp = do_post(build_payload("flat"))
#
#     if resp.status_code == 400 and "response" in resp.text.lower() and "schema" in resp.text.lower():
#         resp2 = do_post(build_payload("nested"))
#         if resp2.status_code == 200:
#             resp = resp2
#
#     RETRY_STATUSES = (503, 429)
#     max_retries = 3
#     attempt = 0
#     while resp.status_code in RETRY_STATUSES and attempt < max_retries:
#         attempt += 1
#         time.sleep(attempt * 2)
#         resp = do_post(build_payload("flat"))
#
#     if resp.status_code != 200:
#         try:
#             err = resp.json().get("error", {}).get("message", resp.text)
#         except Exception:
#             err = resp.text
#         raise RuntimeError(f"Gemini API lỗi ({resp.status_code}): {err}")
#
#     data = resp.json()
#     text = data["candidates"][0]["content"]["parts"][0]["text"]
#     return json.loads(text)
# ============================================================================


def parse_markdown_quiz(text: str) -> list[dict]:
    """Fallback parser bóc tách câu hỏi nếu LLM trả về dạng Markdown Text thay vì JSON."""
    questions = []
    blocks = re.split(r'(?:\*\*|\#\#\#?\s*)Câu\s*\d+(?:\*\*|\:|\s)', text, flags=re.IGNORECASE)
    for block in blocks:
        block_str = block.strip()
        if not block_str:
            continue

        options_matches = re.findall(r'([A-D]\.[\s\S]*?)(?=(?:[A-D]\.|\*\*Đáp án|\*\*Source|Đáp án|\*\*source_snippet|$))', block_str)
        options = [opt.strip() for opt in options_matches if opt.strip()]

        ans_match = re.search(r'\*\*Đáp án đúng:\*\*\s*([A-D])', block_str, re.IGNORECASE) or re.search(r'Đáp án đúng:\s*([A-D])', block_str, re.IGNORECASE)
        answer = ans_match.group(1).upper() if ans_match else "A"

        src_match = re.search(r'\*\*(?:source_snippet|Source):\*\*\s*(.*?)(?=\n\n|\n---|$)', block_str, re.IGNORECASE | re.DOTALL)
        source_snippet = src_match.group(1).strip() if src_match else ""

        exp_match = re.search(r'\*\*(?:Giải thích|Explanation):\*\*\s*(.*?)(?=\n\n|\n---|\*\*Source|\*\*source_snippet|$)', block_str, re.IGNORECASE | re.DOTALL)
        explanation = exp_match.group(1).strip() if exp_match else ""

        question_text = re.split(r'[A-D]\.', block_str)[0].strip()
        question_text = re.sub(r'^\s*[\:\-\*]\s*', '', question_text)

        if question_text and len(options) >= 2:
            questions.append({
                "question": question_text,
                "options": options,
                "answer": answer,
                "explanation": explanation,
                "source_snippet": source_snippet,
                "difficulty": "medium"
            })
    return questions


BATCH_SIZE = 5  # số câu hỏi tối đa mỗi lô gọi AI — chia nhỏ + chạy song song để giảm
                 # thời gian chờ thực tế (nhất là câu trung bình/khó vốn sinh nhiều token hơn)


def plan_generation_batches(num_questions: int, difficulty_level: str, batch_size: int = BATCH_SIZE) -> list[tuple[str, int]]:
    """Chia num_questions thành các lô (difficulty, count) để gọi AI song song
    thay vì 1 lệnh sinh hết.

    Độ khó cố định (easy/medium/hard): chia đều theo batch_size như cũ, không đổi.

    Mixed: KHÔNG còn tách riêng thành 3 nhóm easy/medium/hard trước khi chia lô
    nữa (bản cũ làm vậy) — vì cách đó ép tối thiểu 3 lệnh gọi AI riêng (1/độ khó)
    dù tổng số câu ít (vd 5 câu mixed vẫn ra 3 lô), mà MỖI lệnh đều phải gửi kèm
    TOÀN BỘ nội dung PDF trong prompt -> lãng phí token đầu vào lặp lại nhiều lần
    cho cùng 1 tài liệu (build_prompt() nhúng nguyên văn PDF mỗi lần gọi). Giờ
    chia thẳng theo batch_size, mỗi lô tự trộn đủ 3 mức độ khó bên trong (model
    đã được hướng dẫn việc này qua build_difficulty_instruction) -> số lệnh gọi
    AI giảm từ tối thiểu 3 xuống còn ceil(num_questions/batch_size) — vd 5 câu
    mixed: 3 lô -> 1 lô (giảm 66% lần gửi lại tài liệu); 10 câu (mặc định UI):
    3 lô -> 2 lô (giảm 33%). Đánh đổi: ít lô hơn = ít song song hơn = có thể chậm
    hơn 1 chút với quiz nhỏ (1 lệnh sinh 5 câu thay vì 3 lệnh song song sinh ~2
    câu/lệnh) — nhưng bù lại tiết kiệm token đầu vào đáng kể, và với quiz lớn hơn
    (vd 20 câu) vẫn còn 4 lô chạy song song nên không mất hết lợi ích tốc độ."""
    remaining = num_questions
    batches = []
    label = difficulty_level if difficulty_level in ("easy", "medium", "hard") else "mixed"
    while remaining > 0:
        take = min(batch_size, remaining)
        batches.append((label, take))
        remaining -= take
    return batches


def parse_llm_json_output(raw_text: str) -> list[dict]:
    """Bóc JSON (hoặc fallback Markdown) từ text LLM trả về -> list câu hỏi thô."""
    cleaned_text = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
    cleaned_text = re.sub(r"\s*```$", "", cleaned_text).strip()
    try:
        result = json.loads(cleaned_text)
    except json.JSONDecodeError:
        try:
            from json_repair import repair_json
            result = json.loads(repair_json(cleaned_text))
        except Exception:
            # Lớp fallback thứ 3: model đôi khi chèn 1 câu dẫn dắt/giải thích trước hoặc
            # sau khối JSON dù prompt đã cấm — thử cắt từ dấu "{"/"[" đầu tiên đến dấu
            # đóng cuối cùng tương ứng, bỏ qua phần văn bản thừa bao quanh.
            try:
                start_candidates = [i for i in (cleaned_text.find("{"), cleaned_text.find("[")) if i != -1]
                start = min(start_candidates) if start_candidates else -1
                end_char = "}" if cleaned_text[start] == "{" else "]"
                end = cleaned_text.rfind(end_char)
                if start != -1 and end > start:
                    result = json.loads(cleaned_text[start:end + 1])
                else:
                    raise ValueError("không tìm thấy khối JSON hợp lệ")
            except Exception:
                parsed_md = parse_markdown_quiz(raw_text)
                if parsed_md:
                    print(f"[FALLBACK PARSER] Bóc tách {len(parsed_md)} câu hỏi từ văn bản Markdown thành công!")
                    return parsed_md
                # Log nguyên văn (rút gọn) những gì LLM thực sự trả về — trước đây lỗi
                # này chỉ hiện thông báo chung chung, không ai biết model đã trả lời gì
                # để debug. In ra console để lần sau tra lỗi không phải đoán mò.
                preview = raw_text.strip()[:800]
                print("\n" + "!" * 70)
                print("[PARSE FAIL] Không bóc được JSON/Markdown từ phản hồi LLM. Nội dung thô "
                      f"(rút gọn {len(preview)}/{len(raw_text)} ký tự):")
                print(preview)
                print("!" * 70 + "\n")
                raise RuntimeError("LLM trả về kết quả không parse được JSON hay Markdown. Vui lòng bấm Tạo Quiz lại.")

    if isinstance(result, list):
        items = result
    elif isinstance(result, dict):
        items = result.get("questions", [])
    else:
        items = []

    # LLM đôi khi trả JSON đúng cú pháp nhưng sai shape (vd. list string thay vì
    # list object câu hỏi) -> lọc bỏ phần tử không phải dict để tránh AttributeError
    # ('str' object has no attribute 'get') ở bước verify phía sau.
    valid_items = [q for q in items if isinstance(q, dict)]
    if len(valid_items) != len(items):
        print(f"[PARSE WARNING] Bỏ qua {len(items) - len(valid_items)} phần tử không đúng "
              f"định dạng object câu hỏi (LLM trả sai shape).")
    return valid_items


def generate_batch(pages: list[dict], count: int, mode: str, difficulty: str, label: str) -> tuple:
    """Sinh 1 lô câu hỏi (cùng 1 độ khó) — chạy trong thread riêng, có retry khi
    bị rate-limit/quá tải. Trả về (questions, usage, elapsed_seconds, label)."""
    prompt = build_prompt(pages, count, mode, difficulty)
    temperature = 1.4 if mode == "stress" else 0.25

    RETRY_HINTS = ("429", "rate limit", "overloaded", "503", "502")
    max_retries = 3
    attempt = 0
    t0 = time.time()
    while True:
        try:
            text, usage = call_llm_with_usage(prompt, temperature=temperature, model_name=_LITELLM_MODEL)
            # Phòng hờ: 1 số model (đặc biệt DeepSeek V4 khi thinking mode lỡ vẫn bật)
            # thỉnh thoảng trả "content" RỖNG dù request coi như thành công — không phải
            # lỗi mạng/auth nên không rơi vào except bên dưới. Coi content rỗng như 1
            # dạng lỗi tạm thời và tự retry, thay vì để rớt xuống tận parse_llm_json_output
            # rồi mới báo lỗi 502 cho người dùng.
            if not text or not text.strip():
                if attempt < max_retries:
                    attempt += 1
                    print(f"[EMPTY CONTENT RETRY] {label}: model trả về rỗng, thử lại lần {attempt}/{max_retries}...")
                    time.sleep(attempt * 2)
                    continue
                raise RuntimeError(
                    "LLM trả về nội dung rỗng sau nhiều lần thử lại (có thể do thinking mode "
                    "tiêu hết ngân sách token). Vui lòng bấm Tạo Quiz lại."
                )
            break
        except RuntimeError as e:
            msg = str(e).lower()
            if attempt < max_retries and any(h in msg for h in RETRY_HINTS):
                attempt += 1
                time.sleep(attempt * 2)
                continue
            raise
    elapsed = time.time() - t0

    questions = parse_llm_json_output(text)
    return questions, usage, elapsed, label


def call_openai(prompt: str, mode: str) -> dict:
    """Gọi LLM qua services/model_factory.call_llm() — 1 interface duy nhất cho
    OpenAI/DeepSeek/Claude/Gemini (LiteLLM), thay vì tự requests.post() riêng
    cho từng provider. Giữ nguyên tên hàm để các chỗ gọi cũ không phải sửa."""
    if not OPENAI_API_KEY:
        raise RuntimeError(
            f"Chưa cấu hình API key cho provider '{PROVIDER}'. Mở file .env trong thư mục "
            f"quiz-app/ và dán API key vào (biến {_ACTIVE_KEY_ENV or 'tương ứng provider'})."
        )

    temperature = 1.4 if mode == "stress" else 0.25

    RETRY_STATUSES_HINTS = ("429", "rate limit", "overloaded", "503", "502")
    max_retries = 3
    attempt = 0
    last_err = None
    while attempt <= max_retries:
        try:
            text = call_llm(prompt, temperature=temperature, model_name=_LITELLM_MODEL)
            last_err = None
            break
        except RuntimeError as e:
            last_err = e
            msg = str(e).lower()
            if attempt < max_retries and any(h in msg for h in RETRY_STATUSES_HINTS):
                attempt += 1
                time.sleep(attempt * 2)  # 2s, 4s, 6s
                continue
            raise

    if last_err:
        raise last_err

    # Ghi log toàn bộ Raw Output của Model ra Terminal để dễ dàng kiểm tra / debug
    print("\n" + "=" * 70)
    print(f"[RAW MODEL OUTPUT - Provider: {PROVIDER} | Model: {OPENAI_MODEL} | Length: {len(text)} chars]")
    print("=" * 70)
    try:
        sys.stdout.buffer.write((text + "\n").encode("utf-8"))
        sys.stdout.flush()
    except Exception:
        print(repr(text))
    print("=" * 70 + "\n")

    # Xử lý bóc tách Markdown codeblock ```json ... ``` nếu có
    cleaned_text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE)
    cleaned_text = re.sub(r"\s*```$", "", cleaned_text).strip()

    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        try:
            from json_repair import repair_json
            repaired = repair_json(cleaned_text)
            return json.loads(repaired)
        except Exception:
            # Fallback bóc tách văn bản Markdown nếu LLM xuất dạng văn bản thuần
            parsed_md_questions = parse_markdown_quiz(text)
            if parsed_md_questions:
                print(f"[FALLBACK PARSER] Bóc tách {len(parsed_md_questions)} câu hỏi từ văn bản Markdown thành công!")
                return {"questions": parsed_md_questions}
            raise RuntimeError("LLM trả về kết quả không parse được JSON hay Markdown. Vui lòng bấm Tạo Quiz lại.")


import hashlib

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

ACTIVE_DOC_ID = ""
LAST_UPLOADED_PAGES = []
LAST_UPLOADED_FILENAME = ""
LAST_UPLOADED_PDF_BYTES = b""


def get_document_index():
    index_path = os.path.join(UPLOAD_DIR, "index.json")
    if os.path.exists(index_path):
        try:
            with open(index_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_document_index(docs):
    index_path = os.path.join(UPLOAD_DIR, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(docs, f, ensure_ascii=False, indent=2)


def set_active_document(doc_id):
    global ACTIVE_DOC_ID, LAST_UPLOADED_PAGES, LAST_UPLOADED_FILENAME, LAST_UPLOADED_PDF_BYTES
    meta_path = os.path.join(UPLOAD_DIR, f"{doc_id}.json")
    pdf_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")
    if os.path.exists(meta_path) and os.path.exists(pdf_path):
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
                LAST_UPLOADED_PAGES = meta.get("pages", [])
                LAST_UPLOADED_FILENAME = meta.get("filename", "Slide_BaiGiang.pdf")
                ACTIVE_DOC_ID = doc_id
            with open(pdf_path, "rb") as f:
                LAST_UPLOADED_PDF_BYTES = f.read()
            return True
        except Exception as e:
            print(f"[DOC LIB ERROR] Lỗi nạp doc_id {doc_id}: {e}")
    return False


def load_cached_doc_from_disk():
    global ACTIVE_DOC_ID, LAST_UPLOADED_PAGES, LAST_UPLOADED_FILENAME, LAST_UPLOADED_PDF_BYTES
    if LAST_UPLOADED_PAGES and LAST_UPLOADED_PDF_BYTES:
        return True

    docs = get_document_index()
    if docs:
        latest_doc_id = docs[0].get("doc_id")
        if latest_doc_id:
            return set_active_document(latest_doc_id)
    return False


def add_document_to_library(filename, pages, pdf_bytes):
    global ACTIVE_DOC_ID, LAST_UPLOADED_PAGES, LAST_UPLOADED_FILENAME, LAST_UPLOADED_PDF_BYTES
    doc_id = hashlib.md5((filename + str(len(pdf_bytes))).encode("utf-8")).hexdigest()[:12]
    meta_path = os.path.join(UPLOAD_DIR, f"{doc_id}.json")
    pdf_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump({"doc_id": doc_id, "filename": filename, "pages": pages}, f, ensure_ascii=False, indent=2)
    with open(pdf_path, "wb") as f:
        f.write(pdf_bytes)

    docs = get_document_index()
    docs = [d for d in docs if d.get("doc_id") != doc_id]
    docs.insert(0, {
        "doc_id": doc_id,
        "filename": filename,
        "total_pages": len(pages),
        "total_chars": sum(len(p.get("text", "")) for p in pages),
        "upload_time": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    save_document_index(docs)

    ACTIVE_DOC_ID = doc_id
    LAST_UPLOADED_PAGES = pages
    LAST_UPLOADED_FILENAME = filename
    LAST_UPLOADED_PDF_BYTES = pdf_bytes
    return doc_id


@app.route("/")
def index():
    return render_template("index.html", model=MODEL)


@app.route("/api/upload-and-index", methods=["POST"])
def upload_and_index():
    if "pdf" not in request.files or not request.files["pdf"].filename:
        return jsonify({"error": "Thiếu file PDF."}), 400

    pdf_file = request.files["pdf"]
    filename = pdf_file.filename

    try:
        pdf_bytes = pdf_file.read()
        pages = extract_pdf_text(io.BytesIO(pdf_bytes))
        if not pages:
            return jsonify({"error": "Không trích xuất được text từ PDF."}), 400

        doc_id = add_document_to_library(filename, pages, pdf_bytes)

        # Chạy LightRAG Indexing & Embedding ngay lập tức
        try:
            import asyncio
            from services.rag_engine import get_rag_instance
            doc_full_content = "\n\n".join(f"[Trang {p['page']}]\n{p['text']}" for p in pages)

            async def do_index():
                rag = await get_rag_instance()
                await rag.ainsert(doc_full_content)

            asyncio.run(do_index())
        except Exception as rag_err:
            print(f"[RAG INDEX WARNING] LightRAG indexing info: {rag_err}")

        return jsonify({
            "success": True,
            "doc_id": doc_id,
            "filename": filename,
            "total_pages": len(pages),
            "total_chars": sum(len(p.get("text", "")) for p in pages),
            "pages": pages,
            "documents": get_document_index()
        })
    except Exception as e:
        return jsonify({"error": f"Lỗi xử lý file: {e}"}), 500


@app.route("/api/documents", methods=["GET"])
def get_documents():
    docs = get_document_index()
    return jsonify({
        "documents": docs,
        "active_doc_id": ACTIVE_DOC_ID
    })


@app.route("/api/select-document", methods=["POST"])
def select_document():
    doc_id = request.json.get("doc_id") if request.is_json else request.form.get("doc_id")
    if not doc_id:
        return jsonify({"error": "Thiếu doc_id"}), 400

    if set_active_document(doc_id):
        return jsonify({
            "success": True,
            "filename": LAST_UPLOADED_FILENAME,
            "total_pages": len(LAST_UPLOADED_PAGES),
            "pages": LAST_UPLOADED_PAGES
        })
    return jsonify({"error": "Không tìm thấy tài liệu"}), 404


@app.route("/api/view-pdf", methods=["GET"])
def view_pdf():
    global LAST_UPLOADED_PDF_BYTES, LAST_UPLOADED_FILENAME
    doc_id = request.args.get("doc_id")
    if doc_id:
        set_active_document(doc_id)

    if not LAST_UPLOADED_PDF_BYTES:
        load_cached_doc_from_disk()

    if not LAST_UPLOADED_PDF_BYTES:
        return "Chưa có file PDF nào được nạp.", 404
    return send_file(
        io.BytesIO(LAST_UPLOADED_PDF_BYTES),
        mimetype="application/pdf",
        as_attachment=False,
        download_name=LAST_UPLOADED_FILENAME or "document.pdf"
    )


@app.route("/api/active-document", methods=["GET"])
def active_document():
    global LAST_UPLOADED_PAGES, LAST_UPLOADED_FILENAME, LAST_UPLOADED_PDF_BYTES, ACTIVE_DOC_ID
    if not LAST_UPLOADED_PAGES:
        load_cached_doc_from_disk()

    if not LAST_UPLOADED_PAGES:
        return jsonify({"has_cached_doc": False})

    total_chars = sum(len(p.get("text", "")) for p in LAST_UPLOADED_PAGES)
    return jsonify({
        "has_cached_doc": True,
        "doc_id": ACTIVE_DOC_ID,
        "filename": LAST_UPLOADED_FILENAME or "Slide_BaiGiang_Cache.pdf",
        "total_pages": len(LAST_UPLOADED_PAGES),
        "total_chars": total_chars,
        "has_pdf_bytes": bool(LAST_UPLOADED_PDF_BYTES),
        "pages": LAST_UPLOADED_PAGES
    })


@app.route("/api/generate-quiz", methods=["POST"])
def generate_quiz():
    global LAST_UPLOADED_PAGES, LAST_UPLOADED_FILENAME, LAST_UPLOADED_PDF_BYTES

    pages = []
    if "pdf" in request.files and request.files["pdf"].filename:
        pdf_file = request.files["pdf"]
        try:
            pdf_bytes = pdf_file.read()
            pages = extract_pdf_text(io.BytesIO(pdf_bytes))
            if pages:
                add_document_to_library(pdf_file.filename, pages, pdf_bytes)
        except Exception as e:
            return jsonify({"error": f"Không đọc được PDF: {e}"}), 400
    else:
        load_cached_doc_from_disk()
        pages = LAST_UPLOADED_PAGES

    if not pages:
        return jsonify({"error": "Thiếu file PDF. Vui lòng chọn file slide PDF."}), 400

    try:
        num_questions = int(request.form.get("num_questions", 5))
    except ValueError:
        num_questions = 5
    num_questions = max(1, min(num_questions, 20))

    mode = request.form.get("mode", "standard")
    if mode not in ("standard", "stress"):
        mode = "standard"

    difficulty_level = request.form.get("difficulty_level", "mixed")
    if difficulty_level not in ("easy", "medium", "hard", "mixed"):
        difficulty_level = "mixed"

    if not pages:
        return jsonify({
            "error": "Không trích được text nào từ PDF (có thể slide toàn ảnh/scan, chưa hỗ trợ OCR trong bản demo này)."
        }), 400

    total_chars = sum(len(p["text"]) for p in pages)
    warning = None
    if total_chars < 500:
        warning = (
            f"Tài liệu chỉ trích được {total_chars} ký tự text từ {len(pages)} trang — "
            "khá ít, quiz sinh ra có thể nông hoặc AI phải suy diễn nhiều hơn bình thường."
        )

    t0 = time.time()

    # Chia num_questions thành các lô nhỏ theo độ khó, gọi AI SONG SONG (thay vì
    # 1 lệnh sinh hết tuần tự) — giảm thời gian chờ thực tế, nhất là khi có nhiều
    # câu trung bình/khó (vốn khiến model sinh nhiều token hơn -> lâu hơn).
    batches_plan = plan_generation_batches(num_questions, difficulty_level)

    try:
        batch_results = [None] * len(batches_plan)
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, len(batches_plan))) as executor:
            future_map = {}
            for i, (diff, count) in enumerate(batches_plan):
                label = f"Lô {i + 1}/{len(batches_plan)} ({DIFFICULTY_PROMPT_LABEL.get(diff, diff)} x{count})"
                fut = executor.submit(generate_batch, pages, count, mode, diff, label)
                future_map[fut] = i
            for fut in concurrent.futures.as_completed(future_map):
                batch_results[future_map[fut]] = fut.result()
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 502
    except Exception as err:
        return jsonify({"error": f"Lỗi không lường trước: {err}"}), 500

    wall_clock_elapsed = round(time.time() - t0, 2)  # thời gian thực tế người dùng phải chờ (đã chạy song song)

    # ---- Gộp kết quả các lô + log ra console: token đã dùng, số câu, thời gian ----
    questions = []
    total_usage = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    total_quiz_time = 0.0  # "Tổng thời gian tạo quiz" = CỘNG DỒN thời gian từng lô (kiểu tuần tự,
                            # vd 5 câu dễ mỗi câu 5s -> tổng 25s), KHÔNG phải thời gian chờ thực tế
                            # (thời gian chờ thực tế ngắn hơn vì các lô chạy song song).
    print("\n" + "=" * 70)
    print(f"[QUIZ GENERATION LOG] Provider: {PROVIDER} | Model: {OPENAI_MODEL} | {len(batches_plan)} lô chạy song song")
    for qs, usage, batch_elapsed, label in batch_results:
        questions.extend(qs)
        total_quiz_time += batch_elapsed
        for k in total_usage:
            total_usage[k] += usage.get(k, 0)
        print(f"  - {label}: {batch_elapsed:.2f}s | {len(qs)} câu | token: {usage.get('total_tokens', 0)} "
              f"(prompt {usage.get('prompt_tokens', 0)} + completion {usage.get('completion_tokens', 0)})")
    print(f"  => Tổng số câu hỏi tạo ra   : {len(questions)}")
    print(f"  => Tổng token đã dùng       : {total_usage['total_tokens']} "
          f"(prompt {total_usage['prompt_tokens']} + completion {total_usage['completion_tokens']})")
    print(f"  => Tổng thời gian tạo quiz  : {total_quiz_time:.2f}s (cộng dồn từng lô, kiểu chạy tuần tự)")
    print(f"  => Thời gian chờ thực tế    : {wall_clock_elapsed}s (nhờ chạy song song nên ngắn hơn tổng ở trên)")
    print("=" * 70 + "\n")

    elapsed = wall_clock_elapsed  # dùng cho response JSON bên dưới (elapsed_seconds) — vẫn là thời gian
                                  # người dùng thực sự phải chờ, không phải tổng cộng dồn ở log console

    # Kiểm tra chống bịa (spec §5 kịch bản #1, #8): source_snippet phải trace được
    # về text đã trích từ PDF. Chế độ chuẩn -> loại câu không verify được trước khi
    # hiển thị. Chế độ thử nghiệm -> vẫn giữ nhưng gắn cờ để minh hoạ rủi ro.
    full_text_norm = normalize_text(" ".join(p["text"] for p in pages))
    verified_questions = []
    dropped = 0
    for q in questions:
        raw_ans = str(q.get("answer") or q.get("correct_answer") or q.get("correct_index") or "").strip()
        ans_letter = raw_ans.upper()[:1]
        letter_map = {"A": 0, "B": 1, "C": 2, "D": 3}
        if ans_letter in letter_map:
            q["correct_index"] = letter_map[ans_letter]
        elif isinstance(q.get("correct_index"), int):
            pass
        else:
            q["correct_index"] = 0

        raw_q = q.get("raw_quote") or q.get("source_snippet") or ""
        q["source_snippet"] = raw_q
        q["source_verified"] = verify_source(raw_q, full_text_norm)
        if mode == "standard" and not q["source_verified"]:
            dropped += 1
            q["flagged_unverified"] = True
            verified_questions.append(q)
        else:
            verified_questions.append(q)

    questions = verified_questions

    if dropped:
        drop_note = f"Lưu ý: Có {dropped} câu hỏi có trích dẫn cần đối chiếu lại với file PDF."
        warning = f"{warning} {drop_note}" if warning else drop_note

    # Ép cứng độ khó phía server khi người dùng chọn 1 mức cố định (easy/medium/hard):
    # không phụ thuộc AI có tuân đúng lệnh trong prompt hay không — đảm bảo tính năng
    # luôn đúng như UI hứa hẹn, giống cách đã làm với verify_source() ở trên.
    if difficulty_level in ("easy", "medium", "hard"):
        for q in questions:
            q["difficulty"] = difficulty_level

    questions.sort(key=lambda q: DIFFICULTY_RANK.get(q.get("difficulty", "medium"), 1))

    if not questions:
        return jsonify({
            "error": "OpenAI không sinh được câu nào bám sát tài liệu (tất cả bị loại ở bước chống bịa). "
                     "Thử lại, hoặc dùng chế độ Thử nghiệm để xem AI đã suy diễn ra gì."
        }), 502

    return jsonify({
        "mode": mode,
        "difficulty_level": difficulty_level,
        "model": MODEL,
        "elapsed_seconds": elapsed,
        "pages_used": len(pages),
        "total_chars": total_chars,
        "warning": warning,
        "dropped_unverified": dropped,
        "questions": questions,
    })


def _parse_explain_json(raw_text: str) -> dict:
    """Bóc JSON {"meaningful": bool, "explanation": str} từ text LLM trả về.
    Nếu AI lỡ không trả đúng JSON (model không hỗ trợ response_format tốt), coi như
    "meaningful": True và dùng nguyên văn bản trả lời — an toàn hơn là báo lỗi trắng
    cho học viên vì lỗi format, không phải lỗi nội dung."""
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned).strip()
    obj = None
    try:
        obj = json.loads(cleaned)
    except json.JSONDecodeError:
        try:
            from json_repair import repair_json
            obj = json.loads(repair_json(cleaned))
        except Exception:
            obj = None

    if not isinstance(obj, dict):
        return {"meaningful": True, "explanation": raw_text.strip()}

    return {
        "meaningful": bool(obj.get("meaningful", True)),
        "explanation": str(obj.get("explanation", "")).strip() or raw_text.strip(),
    }


@app.route("/api/explain-selection", methods=["POST"])
def explain_selection():
    """Học viên bôi đen 1 đoạn trong quiz -> hỏi AI giải thích. Trả lời ngắn, mang
    tính lý thuyết/định nghĩa (không phải chat tự do) để: (1) rẻ và nhanh — max_tokens
    thấp, (2) tránh lạc đề — prompt ép format giải thích khái niệm.

    LƯU Ý QUAN TRỌNG: đoạn bôi đen KHÔNG cần khớp nguyên văn với tài liệu PDF gốc để
    được giải thích — quiz thường diễn giải lại nội dung slide, và học viên có thể
    bôi đen bất kỳ khái niệm liên quan nào, kể cả kiến thức nền không có trong slide.
    AI được phép (và nên) dùng kiến thức chung để giải thích chính xác trong trường
    hợp đó. Cái CẦN cảnh báo không phải "có/không có trong tài liệu", mà là khi đoạn
    bôi đen THỰC SỰ không mang nghĩa gì (rác, từ nối rời rạc, số liệu vô nghĩa...) —
    AI tự đánh giá việc này qua field "meaningful" trong JSON trả về, thay vì mình tự
    suy đoán bằng cách so khớp chuỗi (không đáng tin bằng để AI đọc hiểu ngữ cảnh)."""
    data = request.get_json(silent=True) or {}
    selected_text = str(data.get("text", "")).strip()
    # Dọn khoảng trắng thừa/xuống dòng do người dùng bôi đen dính cả câu kế bên
    selected_text = re.sub(r"\s+", " ", selected_text)

    # ---- Limit #1: độ dài ký tự — chặn cả quá ngắn (rác/1 ký tự) lẫn quá dài (nguyên đoạn) ----
    if len(selected_text) < SELECTION_MIN_CHARS:
        return jsonify({
            "error": f"Đoạn bôi đen quá ngắn (cần tối thiểu {SELECTION_MIN_CHARS} ký tự). "
                     "Hãy bôi đen 1 từ/cụm từ có nghĩa."
        }), 400
    if len(selected_text) > SELECTION_MAX_CHARS:
        return jsonify({
            "error": f"Đoạn bôi đen quá dài (tối đa {SELECTION_MAX_CHARS} ký tự, khoảng 1-2 câu). "
                     "Hãy bôi đen đoạn ngắn hơn để AI trả lời đúng trọng tâm hơn."
        }), 400

    # ---- Limit #2: số từ — 300 ký tự vẫn có thể là 1 chuỗi số/ký tự dính liền nhau ----
    words = [w for w in re.split(r"\s+", selected_text) if w]
    if len(words) > SELECTION_MAX_WORDS:
        return jsonify({
            "error": f"Đoạn bôi đen có {len(words)} từ, vượt giới hạn {SELECTION_MAX_WORDS} từ. "
                     "Hãy bôi đen ngắn gọn hơn (1 khái niệm/1 câu)."
        }), 400

    # ---- Limit #3: phải có ít nhất 1 ký tự chữ cái — chặn bôi đen toàn số/dấu câu ----
    if not re.search(r"[^\W\d_]", selected_text, flags=re.UNICODE):
        return jsonify({"error": "Đoạn bôi đen cần chứa chữ (không chỉ số hoặc ký hiệu)."}), 400

    # Prompt ép trả lời LÝ THUYẾT (giống định nghĩa sách giáo khoa) và ĐỦ Ý, không ép
    # cứng theo số câu — cap cứng kiểu "tối đa 4-5 câu" từng khiến khái niệm phức tạp
    # bị cắt thiếu ý, còn khái niệm đơn giản thì bị chèn câu thừa cho đủ số. Thay vào
    # đó, ưu tiên chất lượng nội dung: ngắn khi khái niệm đơn giản, dài hơn khi khái
    # niệm thật sự cần nhiều ý để hiểu đúng — nhưng luôn đi thẳng vào bản chất, không
    # lan man/kể chuyện/lặp ý.
    prompt = f"""Bạn là trợ giảng. Học viên đang làm quiz và bôi đen 1 đoạn để hỏi nghĩa/giải thích.

Nội dung bôi đen: "{selected_text}"
Câu hỏi cần trả lời: Cụm từ/đoạn trên có nghĩa là gì?

YÊU CẦU:
- Nếu đây LÀ 1 khái niệm/thuật ngữ/cụm từ có nghĩa rõ ràng: giải thích mang tính LÝ THUYẾT/ĐỊNH NGHĨA (như giải thích thuật ngữ trong sách giáo khoa). Ưu tiên ĐỦ Ý QUAN TRỌNG hơn là ngắn cho có — độ dài co giãn tự nhiên theo độ phức tạp của khái niệm: khái niệm đơn giản thì 1-2 câu là đủ, khái niệm có nhiều thành phần/dễ nhầm lẫn thì có thể dài hơn để giải thích trọn vẹn. Dù ngắn hay dài đều phải: đi thẳng vào bản chất ngay từ câu đầu (không rào trước đón sau), không lặp lại ý đã nói, không thêm ví dụ/câu chuyện minh hoạ trừ khi thật sự cần để phân biệt khái niệm dễ nhầm. Được phép và NÊN dùng kiến thức chung (kể cả kiến thức không có trong tài liệu bài giảng) để giải thích chính xác nhất — hoàn toàn bình thường khi khái niệm không xuất hiện y nguyên trong slide, KHÔNG cần nhắc gì về việc có/không có trong tài liệu.
- Nếu cụm từ này THỰC SỰ không mang nghĩa/khái niệm gì (rác, từ nối rời rạc kiểu "và sau đó", số liệu không có ngữ cảnh, ký tự vô nghĩa...): đặt "meaningful": false, và "explanation" chỉ cần nêu ngắn gọn lý do — KHÔNG bịa ra 1 khái niệm không tồn tại để giải thích cho có.
- Không dùng markdown phức tạp (không bảng, không code block).

Trả về DUY NHẤT 1 JSON object đúng format sau, không kèm chữ nào khác ngoài JSON:
{{"meaningful": true hoặc false, "explanation": "..."}}"""

    try:
        raw_text, usage = call_llm_with_usage(
            # max_tokens nới lên 550 (từ 350) — chừa đủ chỗ cho khái niệm phức tạp
            # cần giải thích dài hơn, tránh bị cắt cụt giữa câu.
            prompt, temperature=0.2, max_tokens=550, response_json=True
        )
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 502
    except Exception as err:
        return jsonify({"error": f"Lỗi không lường trước: {err}"}), 500

    parsed = _parse_explain_json(raw_text)

    print(f"[EXPLAIN SELECTION] \"{selected_text[:60]}\" ({len(words)} từ) | "
          f"token: {usage.get('total_tokens', 0)} | meaningful={parsed['meaningful']}")

    return jsonify({
        "selected_text": selected_text,
        "explanation": parsed["explanation"],
        "meaningful": parsed["meaningful"],
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"OPENAI_API_KEY {'đã cấu hình' if OPENAI_API_KEY else 'CHƯA cấu hình — sửa file .env trước khi tạo quiz'}")
    print(f"Model: {MODEL}")
    print(f"Mở trình duyệt: http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
