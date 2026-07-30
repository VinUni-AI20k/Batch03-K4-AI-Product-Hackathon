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
import time

from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from pypdf import PdfReader
import requests

load_dotenv()

# ============================================================================
# GHI CHÚ — cấu hình Gemini cũ (KHÔNG còn dùng, giữ lại tham khảo):
#
# API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
# MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash").strip()
# GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
# ============================================================================

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-5.6-terra").strip()
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
MODEL = OPENAI_MODEL  # dùng chung cho hiển thị UI + response JSON

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 30 * 1024 * 1024  # 30MB, khớp copy trên UI


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
    """Kiểm tra source_snippet có thật trong text đã trích từ PDF không (chống bịa - lớp ①).
    Cho phép AI paraphrase nhẹ: nếu không khớp nguyên văn, thử khớp 70% đầu chuỗi."""
    s = normalize_text(snippet)
    if len(s) < 6:
        return False
    if s in full_text_norm:
        return True
    prefix_len = max(15, int(len(s) * 0.7))
    return s[:prefix_len] in full_text_norm


def extract_pdf_text(file_stream) -> list[dict]:
    """Trả về list [{'page': int, 'text': str}] — giữ mã trang để trích dẫn ngược (giống transcript có mã đoạn)."""
    reader = PdfReader(file_stream)
    pages = []
    for i, page in enumerate(reader.pages):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append({"page": i + 1, "text": text})
    return pages


DIFFICULTY_PROMPT_LABEL = {"easy": "dễ", "medium": "trung bình", "hard": "khó"}


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

    return base_task + "\n" + constraint


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


def call_openai(prompt: str, mode: str) -> dict:
    if not OPENAI_API_KEY:
        raise RuntimeError(
            "Chưa cấu hình OPENAI_API_KEY. Mở file .env trong thư mục quiz-app/ và dán API key vào "
            "(lấy tại platform.openai.com/api-keys)."
        )

    temperature = 1.4 if mode == "stress" else 0.25

    payload = {
        "model": OPENAI_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "quiz_schema",
                "schema": to_openai_strict_schema(QUIZ_SCHEMA),
                "strict": True,
            },
        },
    }

    def do_post(body: dict):
        try:
            return requests.post(
                OPENAI_URL,
                headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
                json=body,
                timeout=90,
            )
        except requests.exceptions.RequestException as e:
            raise RuntimeError(
                f"Không kết nối được tới OpenAI API (kiểm tra internet/firewall/proxy). Chi tiết: {e}"
            )

    resp = do_post(payload)

    # Một số model reasoning (dòng gpt-5.x) không nhận tham số temperature tuỳ chỉnh
    # -> nếu bị từ chối vì lý do này, bỏ temperature và gọi lại thay vì lỗi luôn.
    if resp.status_code == 400 and "temperature" in resp.text.lower():
        payload.pop("temperature", None)
        resp = do_post(payload)

    # 429 (rate limit) / 5xx (lỗi tạm thời phía OpenAI) -> tự thử lại thay vì bắt người
    # dùng tự bấm lại, giống cơ chế đã làm cho Gemini trước đây.
    RETRY_STATUSES = (429, 500, 502, 503, 504)
    max_retries = 3
    attempt = 0
    while resp.status_code in RETRY_STATUSES and attempt < max_retries:
        attempt += 1
        time.sleep(attempt * 2)  # 2s, 4s, 6s
        resp = do_post(payload)

    if resp.status_code != 200:
        try:
            err = resp.json().get("error", {}).get("message", resp.text)
        except Exception:
            err = resp.text
        if resp.status_code in RETRY_STATUSES:
            raise RuntimeError(
                f"OpenAI đang quá tải/giới hạn tần suất (lỗi {resp.status_code}) — đã tự thử lại {max_retries} lần "
                f"nhưng vẫn chưa được. Đây là lỗi tạm thời phía OpenAI, không phải lỗi cấu hình. "
                f"Đợi 1-2 phút rồi bấm Tạo Quiz lại. Chi tiết: {err}"
            )
        raise RuntimeError(f"OpenAI API lỗi ({resp.status_code}): {err}")

    data = resp.json()
    try:
        text = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise RuntimeError(f"Phản hồi OpenAI không đúng định dạng mong đợi: {data}")

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        raise RuntimeError("OpenAI trả về JSON không hợp lệ, thử lại (có thể do model bị cắt output).")

    return parsed


@app.route("/")
def index():
    return render_template("index.html", model=MODEL)


@app.route("/api/generate-quiz", methods=["POST"])
def generate_quiz():
    if "pdf" not in request.files:
        return jsonify({"error": "Thiếu file PDF."}), 400

    pdf_file = request.files["pdf"]
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

    try:
        pages = extract_pdf_text(io.BytesIO(pdf_file.read()))
    except Exception as e:
        return jsonify({"error": f"Không đọc được PDF: {e}"}), 400

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

    prompt = build_prompt(pages, num_questions, mode, difficulty_level)

    t0 = time.time()
    try:
        result = call_openai(prompt, mode)
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:  # lưới an toàn cuối - không để lộ traceback thô ra frontend
        return jsonify({"error": f"Lỗi không lường trước: {e}"}), 500
    elapsed = round(time.time() - t0, 2)

    questions = result.get("questions", [])

    # Kiểm tra chống bịa (spec §5 kịch bản #1, #8): source_snippet phải trace được
    # về text đã trích từ PDF. Chế độ chuẩn -> loại câu không verify được trước khi
    # hiển thị. Chế độ thử nghiệm -> vẫn giữ nhưng gắn cờ để minh hoạ rủi ro.
    full_text_norm = normalize_text(" ".join(p["text"] for p in pages))
    verified_questions = []
    dropped = 0
    for q in questions:
        q["source_verified"] = verify_source(q.get("source_snippet", ""), full_text_norm)
        if mode == "standard" and not q["source_verified"]:
            dropped += 1
            continue
        verified_questions.append(q)
    questions = verified_questions

    if dropped:
        drop_note = f"Đã tự động loại {dropped} câu vì source_snippet không trace được về nội dung PDF gốc (chống bịa, chế độ chuẩn)."
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


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"OPENAI_API_KEY {'đã cấu hình' if OPENAI_API_KEY else 'CHƯA cấu hình — sửa file .env trước khi tạo quiz'}")
    print(f"Model: {MODEL}")
    print(f"Mở trình duyệt: http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
