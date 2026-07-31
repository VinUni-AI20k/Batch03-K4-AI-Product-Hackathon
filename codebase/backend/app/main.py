import os
import shutil
import logging
import json
import base64
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

# ----------------------------------------------------------------------
# Cấu hình logging
# ----------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("upload-slide")

app = FastAPI(
    title="AI in Action Hackathon API",
    description="Backend API for AI in Action Hackathon projects using Next.js & FastAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Các type hợp lệ cho từng phần trong outline
VALID_TYPES = {"quiz", "slide", "animation", "mindmap"}
MIN_DISTINCT_TYPES = 3   # bắt buộc tối thiểu 3 loại type khác nhau
MAX_RETRY = 3            # số lần gọi lại AI nếu chưa đủ đa dạng


@app.get("/")
def read_root():
    return {"message": "Welcome to AI in Action Hackathon API"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "backend"}


def ensure_type_diversity(outline_data: list, min_types: int = 3) -> list:
    """
    Lưới an toàn cuối cùng: nếu model vẫn không tạo đủ số loại type sau nhiều lần retry,
    tự động chèn thêm mindmap/quiz/animation dựa theo nội dung slide sẵn có,
    đảm bảo output cuối cùng luôn đạt tối thiểu `min_types` loại khác nhau.
    """
    distinct_types = set(item["type"] for item in outline_data)
    if len(distinct_types) >= min_types:
        return outline_data

    logger.warning(f"Áp dụng bổ sung tự động: hiện có {distinct_types}, cần thêm cho đủ {min_types} loại")

    slide_items = [item for item in outline_data if item["type"] == "slide"]

    # Bổ sung mindmap tổng kết nếu chưa có
    if "mindmap" not in distinct_types and slide_items:
        summary_points = "; ".join(
            (item["content"][:80] + "...") for item in slide_items[:5]
        )
        outline_data.append({
            "index": len(outline_data) + 1,
            "type": "mindmap",
            "content": f"Tổng kết các ý chính đã học: {summary_points}"
        })
        distinct_types.add("mindmap")

    # Bổ sung quiz đơn giản dựa trên slide đầu tiên nếu chưa có
    if "quiz" not in distinct_types and slide_items:
        first_slide = slide_items[0]
        outline_data.append({
            "index": len(outline_data) + 1,
            "type": "quiz",
            "content": (
                f"Câu hỏi ôn tập: Hãy tóm tắt lại nội dung chính sau đây bằng lời của bạn: "
                f"\"{first_slide['content'][:150]}...\". "
                f"Gợi ý: xem lại phần slide tương ứng nếu chưa chắc chắn."
            )
        })
        distinct_types.add("quiz")

    # Bổ sung animation gợi ý tổng quát nếu vẫn chưa đủ loại
    if "animation" not in distinct_types and len(distinct_types) < min_types and slide_items:
        outline_data.append({
            "index": len(outline_data) + 1,
            "type": "animation",
            "content": (
                "Minh hoạ trực quan: dựng sơ đồ các bước/mốc chính đã đề cập trong tài liệu "
                "theo trình tự thời gian hoặc trình tự logic, giúp hình dung tổng thể quy trình."
            )
        })
        distinct_types.add("animation")

    # Đánh số lại index cho đúng thứ tự
    for idx, item in enumerate(outline_data, start=1):
        item["index"] = idx

    logger.info(f"Sau bổ sung tự động: {set(item['type'] for item in outline_data)}")
    return outline_data


def build_prompt(markdown_text: str) -> str:
    return f"""
Bạn là một GIÁO VIÊN AI thiết kế lại tài liệu học tập thành một buổi ôn tập đa dạng hình thức, giúp học viên không bị nhàm chán và hiểu bài sâu hơn.

QUY TẮC BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
- Output PHẢI có ít nhất {MIN_DISTINCT_TYPES} LOẠI TYPE KHÁC NHAU trong số 4 loại: slide, quiz, animation, mindmap.
- TUYỆT ĐỐI KHÔNG được để toàn bộ output chỉ có 1 hoặc 2 loại type. Đây là lỗi nghiêm trọng, output sẽ bị từ chối.
- Bắt buộc phải có ít nhất 1 "mindmap" (đặt ở đầu để tổng quan, hoặc cuối để tổng kết — bạn tự quyết định vị trí phù hợp hơn).
- Bắt buộc phải có ít nhất 2 "quiz" nếu tài liệu có từ 3 block "slide" trở lên — số liệu, mốc thời gian, điều kiện, quy định, định nghĩa nào cũng có thể ra quiz được, không có lý do gì để bỏ qua.
- Bắt buộc phải có ít nhất 1 "animation" nếu tài liệu có: quy trình nhiều bước, timeline/lịch trình, mối quan hệ giữa nhiều đối tượng, hoặc khái niệm trừu tượng. Nếu tài liệu có bảng các bước/mốc thời gian (như lịch trình, quy trình, checklist), đây LUÔN LÀ ứng viên tốt để dựng animation dạng timeline — không được bỏ qua.
- Chỉ trong trường hợp tài liệu cực ngắn (dưới 150 từ, không có gì để hỏi hay minh hoạ) mới được phép ít loại type hơn — nhưng với hầu hết tài liệu thực tế, quy tắc trên là BẮT BUỘC.

CÁCH DÙNG TỪNG TYPE:
- "slide": kiến thức nền tảng, định nghĩa, số liệu, quy định — viết lại mạch lạc, không copy nguyên văn.
- "quiz": câu hỏi cụ thể kiểm tra 1 chi tiết vừa học (số liệu, điều kiện, mốc thời gian, định nghĩa...), kèm đáp án đúng + giải thích ngắn. Ưu tiên trắc nghiệm 4 đáp án hoặc đúng/sai.
- "animation": mô tả hoạt cảnh minh hoạ theo từng bước — đặc biệt hợp với timeline, quy trình, luồng xử lý, so sánh trực quan.
- "mindmap": sơ đồ phân nhánh các ý chính và mối liên hệ giữa chúng — dùng gạch đầu dòng/mũi tên thể hiện quan hệ cha-con.

QUY TRÌNH BẠN PHẢI LÀM:
1. Đọc toàn bộ nội dung, xác định các ý chính -> tạo 1 "mindmap" tổng quan ở đầu.
2. Với mỗi cụm kiến thức: viết "slide" giải thích, sau đó BẮT BUỘC cân nhắc thêm "quiz" ngay sau nếu có chi tiết cụ thể để hỏi.
3. Nếu phát hiện quy trình/timeline/mốc thời gian nối tiếp nhau -> chèn 1 "animation" mô tả timeline đó.
4. Kết thúc bằng 1 "mindmap" tổng kết liên kết lại toàn bộ nội dung và các đối tượng liên quan.
5. TRƯỚC KHI TRẢ KẾT QUẢ: tự đếm lại xem output có bao nhiêu loại type khác nhau. Nếu chưa đủ {MIN_DISTINCT_TYPES} loại, bắt buộc phải bổ sung thêm cho đủ trước khi trả lời.

VÍ DỤ MINH HOẠ (chỉ để tham khảo mức độ đa dạng, không phải nội dung thật):
[
  {{"index": 1, "type": "mindmap", "content": "Tổng quan các mốc chính: (1) Đăng ký đề tài, (2) Xét duyệt, (3) Thực hiện, (4) Bảo vệ, (5) Nộp báo cáo."}},
  {{"index": 2, "type": "slide", "content": "Điều kiện đăng ký: sinh viên khóa D22 cần tích lũy tối thiểu 75% tổng số tín chỉ chương trình đào tạo."}},
  {{"index": 3, "type": "quiz", "content": "Câu hỏi: Sinh viên khóa D22 cần tích lũy tối thiểu bao nhiêu % tín chỉ để đủ điều kiện đăng ký báo cáo tốt nghiệp? A. 50% B. 65% C. 75% D. 90%. Đáp án đúng: C."}},
  {{"index": 4, "type": "animation", "content": "Timeline animation: 01/7 xây dựng kế hoạch -> 02/7 gửi thông báo GV -> 15/7 SV đăng ký đề tài -> 03-07/8 xét duyệt đề cương -> 18/8-13/12 thực hiện đề tài -> 21-30/12 bảo vệ. Mỗi mốc hiện lần lượt trên trục thời gian."}},
  {{"index": 5, "type": "slide", "content": "Trách nhiệm các bên: Tổ thư ký theo dõi tiến độ, Lãnh đạo CTĐT phân công GVHD, Sinh viên chủ động đăng ký và thực hiện đúng hạn."}},
  {{"index": 6, "type": "quiz", "content": "Câu hỏi Đúng/Sai: Sinh viên có thể tự chọn giảng viên hướng dẫn mà không cần thông qua phân công của Lãnh đạo CTĐT? Đáp án: Sai — nếu SV chưa có GVHD, Lãnh đạo CTĐT sẽ phân công."}},
  {{"index": 7, "type": "mindmap", "content": "Tổng kết: Timeline từ đăng ký đến bảo vệ, vai trò 3 bên (Tổ thư ký - Lãnh đạo CTĐT - Sinh viên), các mốc deadline quan trọng nhất cần nhớ."}}
]
(Ví dụ trên có đủ 4 loại type — đây là mức đa dạng bạn cần hướng tới.)

YÊU CẦU OUTPUT: CHỈ trả về DUY NHẤT một mảng JSON hợp lệ (không markdown formatting ```, không giải thích thêm), đúng cấu trúc:

[
  {{
    "index": 1,
    "type": "slide",
    "content": "..."
  }}
]

"content" viết bằng tiếng Việt, đủ chi tiết để học viên tự ôn tập không cần mở lại tài liệu gốc.

Nội dung Markdown gốc của tài liệu cần phân tích:
{markdown_text[:8000]}
"""


@app.post("/api/upload-slide")
async def upload_slide(file: UploadFile = File(...)):
    logger.info(f"===> Nhận file upload: {file.filename}")

    base_dir = Path(__file__).resolve().parent.parent.parent
    temp_dir = base_dir / "temp_uploads"
    temp_dir.mkdir(parents=True, exist_ok=True)
    file_path = str(temp_dir / file.filename)

    logger.debug(f"base_dir = {base_dir}")
    logger.debug(f"temp_dir = {temp_dir.resolve()}")
    logger.debug(f"file_path = {file_path}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    logger.info(f"Đã lưu file tạm tại: {file_path} (size={os.path.getsize(file_path)} bytes)")

    try:
        import fitz

        all_items = []
        pdf_doc = fitz.open(file_path)
        logger.info(f"Mở PDF thành công, số trang = {len(pdf_doc)}")

        markdown_text = ""
        pages_dict = {}

        for page_no_0 in range(len(pdf_doc)):
            page = pdf_doc.load_page(page_no_0)
            page_no = page_no_0 + 1

            rect = page.rect
            pages_dict[page_no] = {"width": rect.width, "height": rect.height}

            markdown_text += f"\n\n---\n## Slide {page_no}\n\n"

            page_dict = page.get_text("dict")
            blocks = page_dict.get("blocks", [])

            for block in blocks:
                if block.get("type") == 0:
                    bbox = block.get("bbox")
                    text = ""
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            text += span.get("text", "") + " "
                        text += "\n"

                    text = text.strip()
                    if text:
                        all_items.append({
                            "page_no": page_no,
                            "bbox": bbox,
                            "text": text,
                            "label": "text"
                        })
                        markdown_text += f"{text}\n\n"

        logger.info(f"Đã trích xuất text, tổng số items = {len(all_items)}, độ dài markdown = {len(markdown_text)} ký tự")

        from dotenv import load_dotenv
        load_dotenv()

        from openai import OpenAI

        outline_data = []
        model_name = os.getenv("MODEL_NAME", "")
        base_url = os.getenv("BASE_URL", "")
        api_key = os.getenv("API_KEY", "")

        logger.debug(
            f"ENV -> MODEL_NAME={model_name!r}, BASE_URL={base_url!r}, "
            f"API_KEY={'***' + api_key[-4:] if api_key else '(empty)'}"
        )

        if api_key:
            try:
                client_kwargs = {"api_key": api_key}
                if base_url:
                    client_kwargs["base_url"] = base_url
                client = OpenAI(**client_kwargs)

                prompt = build_prompt(markdown_text)

                for attempt in range(1, MAX_RETRY + 1):
                    logger.info(f"Gọi OpenAI API (lần {attempt}/{MAX_RETRY}) với model={model_name or 'gpt-4o-mini'} ...")

                    completion = client.chat.completions.create(
                        model=model_name or "gpt-4o-mini",
                        messages=[
                            {"role": "user", "content": prompt}
                        ],
                        temperature=0.4,
                    )

                    raw_text = completion.choices[0].message.content.strip()
                    logger.debug(f"Raw response (lần {attempt}, 500 ký tự đầu): {raw_text[:500]}")

                    json_str = raw_text
                    if json_str.startswith("```json"):
                        json_str = json_str[7:]
                    if json_str.startswith("```"):
                        json_str = json_str[3:]
                    if json_str.endswith("```"):
                        json_str = json_str[:-3]
                    json_str = json_str.strip()

                    try:
                        parsed = json.loads(json_str)
                    except Exception as e:
                        logger.warning(f"Lần {attempt}: JSON không hợp lệ ({e}), thử lại...")
                        continue

                    cleaned = []
                    for idx, item in enumerate(parsed, start=1):
                        item_type = item.get("type", "slide")
                        if item_type not in VALID_TYPES:
                            logger.warning(f"Type không hợp lệ '{item_type}' ở index {idx}, fallback về 'slide'")
                            item_type = "slide"
                        cleaned.append({
                            "index": item.get("index", idx),
                            "type": item_type,
                            "content": item.get("content", "")
                        })

                    distinct_types = set(item["type"] for item in cleaned)
                    logger.info(f"Lần {attempt}: số loại type khác nhau = {len(distinct_types)} ({distinct_types})")

                    outline_data = cleaned  # giữ lại dù đạt hay chưa, phòng khi hết retry

                    if len(distinct_types) >= MIN_DISTINCT_TYPES:
                        logger.info(f"Đạt yêu cầu đa dạng ({len(distinct_types)} loại) ở lần thử {attempt}")
                        break
                    else:
                        logger.warning(
                            f"Lần {attempt}: chỉ có {len(distinct_types)} loại type "
                            f"(yêu cầu tối thiểu {MIN_DISTINCT_TYPES}) -> thử lại"
                        )

                # Lưới an toàn cuối cùng: nếu sau MAX_RETRY vẫn chưa đủ đa dạng, bổ sung bằng code
                if outline_data:
                    final_distinct = set(item["type"] for item in outline_data)
                    if len(final_distinct) < MIN_DISTINCT_TYPES:
                        logger.error(
                            f"Sau {MAX_RETRY} lần thử vẫn không đạt đủ {MIN_DISTINCT_TYPES} loại type "
                            f"(chỉ có {len(final_distinct)}: {final_distinct}). Áp dụng bổ sung tự động."
                        )
                        outline_data = ensure_type_diversity(outline_data, min_types=MIN_DISTINCT_TYPES)

            except Exception as e:
                logger.error(f"Lỗi khi gọi OpenAI: {e}", exc_info=True)
        else:
            logger.warning("Không có API_KEY trong biến môi trường -> bỏ qua bước gọi AI, dùng fallback")

        # Fallback nếu không gọi được AI (thiếu API key hoặc lỗi hoàn toàn):
        # tách theo từng slide gốc, gán type mặc định "slide", sau đó ép đa dạng bằng code
        if not outline_data:
            import re
            slide_sections = re.split(r'\n?---\n## Slide \d+\n\n?', markdown_text)
            slide_sections = [s.strip() for s in slide_sections if s.strip()]
            for idx, content in enumerate(slide_sections, start=1):
                outline_data.append({
                    "index": idx,
                    "type": "slide",
                    "content": content
                })
            logger.info(f"Dùng fallback theo slide gốc, số block = {len(outline_data)}")
            outline_data = ensure_type_diversity(outline_data, min_types=MIN_DISTINCT_TYPES)

        # Log thống kê cuối cùng
        final_type_counts = {}
        for item in outline_data:
            t = item.get("type", "slide")
            final_type_counts[t] = final_type_counts.get(t, 0) + 1
        logger.info(f"Phân bố type CUỐI CÙNG trong outline: {final_type_counts}")

        # ------------------------------------------------------------------
        # Render sidebar HTML theo type
        # ------------------------------------------------------------------
        type_labels = {
            "slide": "📄 Slide",
            "quiz": "❓ Quiz",
            "animation": "🎬 Animation",
            "mindmap": "🧠 Mindmap",
        }
        type_colors = {
            "slide": "#2563eb",
            "quiz": "#f59e0b",
            "animation": "#8b5cf6",
            "mindmap": "#10b981",
        }

        outline_html = "<h2>Outline (AI Generated)</h2><ul>"
        for item in outline_data:
            idx = item.get("index")
            item_type = item.get("type", "slide")
            content_preview = (item.get("content", "") or "")[:100]
            color = type_colors.get(item_type, "#2563eb")
            label = type_labels.get(item_type, item_type)

            outline_html += f"<li style='margin-bottom: 14px;'>"
            outline_html += f"<a href='#block-{idx}' style='text-decoration: none; color: {color}; font-weight: bold;'>{idx}. {label}</a>"
            outline_html += f"<br><span style='font-size: 12px; color: #64748b;'>{content_preview}...</span>"
            outline_html += "</li>"
        outline_html += "</ul>"

        # Lưu markdown gốc
        md_file_path = file_path.replace(".pdf", ".md")
        with open(md_file_path, "w", encoding="utf-8") as f:
            f.write(markdown_text)
        logger.info(f"Đã ghi file markdown gốc: {md_file_path} (tồn tại: {os.path.exists(md_file_path)})")

        # Lưu outline dạng JSON
        outline_json_path = file_path.replace(".pdf", ".outline.json")
        with open(outline_json_path, "w", encoding="utf-8") as f:
            json.dump(outline_data, f, ensure_ascii=False, indent=2)
        logger.info(f"Đã ghi file outline JSON: {outline_json_path} (tồn tại: {os.path.exists(outline_json_path)})")

        # ------------------------------------------------------------------
        # Dựng lại slides_html kèm ảnh nền từ PDF
        # ------------------------------------------------------------------
        slides_html = ""

        try:
            pdf_doc = fitz.open(file_path)
        except Exception as e:
            logger.error(f"Không mở lại được PDF để lấy ảnh nền: {e}")
            pdf_doc = None

        for page_no, page_info in pages_dict.items():
            p_width = page_info.get("width", 1024)
            p_height = page_info.get("height", 768)

            bg_image_b64 = ""
            if pdf_doc:
                try:
                    page = pdf_doc.load_page(page_no - 1)
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    bg_image_b64 = base64.b64encode(pix.tobytes("png")).decode("utf-8")
                except Exception as e:
                    logger.error(f"Lỗi lấy ảnh nền trang {page_no}: {e}")

            page_items_html = ""
            for item in all_items:
                if item.get("page_no") == page_no:
                    bbox = item.get("bbox", [])
                    if len(bbox) != 4:
                        continue

                    l, t, r, b = bbox
                    item_w = r - l
                    item_h = b - t
                    css_left = l
                    css_top = t

                    label = item.get("label", "text")

                    if label == "picture":
                        content_html_item = ""
                        bg_css = "background: rgba(239,68,68,0.1); border: 2px dashed #ef4444;"
                    else:
                        content_html_item = item.get("text", "")
                        bg_css = "background: rgba(255,255,255,0.7); border: 1px dashed rgba(59,130,246,0.5); border-radius: 4px; padding: 2px;"

                    page_items_html += f"""
                    <div class="element" data-label="{label}" data-bbox="[{l},{t},{r},{b}]" style="position: absolute; left: {css_left}px; top: {css_top}px; width: {item_w}px; min-height: {item_h}px; box-sizing: border-box; font-size: 14px; display: flex; align-items: flex-start; {bg_css}">
                        {content_html_item}
                    </div>
                    """

            bg_style = (
                f"background-image: url('data:image/png;base64,{bg_image_b64}'); "
                f"background-size: 100% 100%; background-repeat: no-repeat;"
                if bg_image_b64 else "background: white;"
            )

            slides_html += f"""
            <div class="slide-container" id="slide-{page_no}" data-page="{page_no}" style="position: relative; width: {p_width}px; height: {p_height}px; margin-bottom: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; flex-shrink: 0; transform-origin: top center; transform: scale(0.9); {bg_style}">
                <div style="position: absolute; top: -30px; left: 0; font-weight: bold; color: #64748b; font-size: 18px;">Slide {page_no}</div>
                {page_items_html}
            </div>
            """

        if pdf_doc:
            pdf_doc.close()

        full_html = f"""
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Tài liệu & Outline AI</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; background-color: #f1f5f9; overflow: hidden; }}
                .sidebar {{ width: 350px; background-color: #ffffff; border-right: 1px solid #e2e8f0; padding: 20px; overflow-y: auto; box-shadow: 2px 0 5px rgba(0,0,0,0.05); }}
                .content {{ flex: 1; padding: 40px; overflow-y: auto; background-color: #f1f5f9; display: flex; flex-direction: column; align-items: center; }}
                h2 {{ color: #0f172a; }}
                ul {{ list-style-type: none; padding-left: 0; }}
                li a:hover {{ text-decoration: underline !important; }}
                .element:hover {{ background: rgba(59,130,246,0.1) !important; cursor: pointer; border: 2px solid #2563eb !important; }}
            </style>
        </head>
        <body>
            <div class="sidebar">
                {outline_html}
            </div>
            <div class="content">
                {slides_html}
            </div>
        </body>
        </html>
        """

        html_file_path = os.path.splitext(file_path)[0] + ".html"
        with open(html_file_path, "w", encoding="utf-8") as f:
            f.write(full_html)
        logger.info(f"Đã ghi file HTML: {html_file_path} (tồn tại: {os.path.exists(html_file_path)})")

        logger.info("===> Xử lý thành công, trả kết quả về client")

        return {
            "status": "success",
            "markdown": markdown_text,
            "outline": outline_data,
            "html": full_html,
            "html_file_path": html_file_path
        }
    except Exception as e:
        logger.error(f"LỖI khi xử lý file: {e}", exc_info=True)
        return {"status": "error", "message": str(e)}
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.debug(f"Đã xoá file PDF tạm: {file_path}")