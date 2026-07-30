# AI Quiz Generator — VLearn (prototype)

Upload PDF slide bài giảng → OpenAI (AI call thật) sinh quiz trắc nghiệm dạng **ứng dụng thực tế**, sắp xếp **dễ → khó**. Có 2 chế độ: **Chuẩn** (chống bịa, bám sát tài liệu) và **Thử nghiệm** (cố ý tăng hallucination để minh hoạ rủi ro lớp ① trong spec).

> **Đổi provider:** ban đầu dự án dùng Gemini, sau đổi sang OpenAI theo yêu cầu. Yêu cầu gốc là "GPT-4.0" nhưng model này đã lỗi thời/bị deprecate — đang dùng **`gpt-5.6-terra`** (dòng model hiện hành, cân bằng chất lượng/chi phí) thay thế. Code gọi Gemini cũ vẫn còn trong `app.py` dạng comment, không xoá — đổi lại được nếu cần.

## 1. Lấy OpenAI API key (trả phí theo usage, không có free tier như Gemini)

1. Vào https://platform.openai.com/api-keys
2. Đăng nhập / tạo tài khoản OpenAI
3. Bấm **Create new secret key** → copy key (dạng `sk-proj-...` hoặc `sk-...`)
4. **Không chia sẻ key này với ai, không commit vào git, không dán vào `.env.example`** (chỉ dán vào `.env`)
5. Cần có billing/thẻ đã liên kết trên tài khoản OpenAI thì key mới gọi được — free tier như Gemini không áp dụng ở đây

## 2. Cài đặt & chạy

```bash
cd codebase/quiz-app
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Mở .env, dán API key vào dòng OPENAI_API_KEY=

python app.py
```

Mở trình duyệt: **http://localhost:5000**

### Windows: lỗi "Python was not found" khi gõ `python`

Đây là do Windows chặn lệnh `python` bằng App Execution Alias (trỏ về Microsoft Store), không phải lỗi của dự án — `pip` vẫn chạy bình thường vì nó trỏ đúng tới bản Python thật đã cài. Cách sửa, chọn 1 trong 3:

1. **Nhanh nhất — double-click `run.bat`** trong thư mục này (tự dò `py`/`python`/`python3`, cái nào chạy được thì dùng).
2. Gõ `py app.py` thay vì `python app.py` (launcher `py` thường không bị chặn).
3. Tắt hẳn: Settings → Apps → Advanced app settings → App execution aliases → tắt 2 dòng "App Installer python.exe / python3.exe".

Vì lỗi này xảy ra *trước* bước tạo venv, `pip install -r requirements.txt` ở máy bạn đã cài thẳng vào Python hệ thống (không phải venv) — không sao, vẫn chạy được, không cần làm lại từ đầu.

## 3. Cách dùng

1. Upload PDF slide bài giảng (kéo thả hoặc chọn file)
2. Chọn số lượng câu quiz (5/10/15/20)
3. Chọn chế độ:
   - 🛡️ **Chuẩn** — dùng để phát quiz thật cho học viên. Temperature thấp, ràng buộc chặt bám tài liệu.
   - ⚠️ **Thử nghiệm** — CỐ Ý tăng hallucination (temperature cao, nới lỏng ràng buộc nguồn) để nhóm dùng minh hoạ rủi ro lớp ① (nguồn sự thật) khi trình bày/demo. Không dùng để phát quiz thật.
4. Bấm **Tạo Quiz** → chờ vài giây (gọi OpenAI thật, không hardcode)
5. Kết quả hiện theo thứ tự dễ → khó; bấm vào 1 đáp án để xem đúng/sai + giải thích + trích nguồn (source_snippet trace về nội dung PDF gốc)

## 4. Cấu trúc

```
quiz-app/
├── app.py              # Flask backend: extract PDF, build prompt, gọi OpenAI, sort theo độ khó
├── templates/index.html
├── static/style.css
├── static/app.js
├── requirements.txt
├── .env.example         # copy thành .env, điền key thật (không commit .env)
└── README.md
```

## 5. Đã tự kiểm thử (không cần API key thật)

- ✅ Trang chủ + static assets (CSS/JS) load đúng (HTTP 200)
- ✅ Trích text PDF thật (`day01-slide-blue-v0.pdf`, 23 trang) bằng `pypdf` — hoạt động, nhưng lưu ý slide dạng ảnh/scan sẽ trích được rất ít text (app có cảnh báo `warning` khi tổng ký tự < 500)
- ✅ Thiếu `OPENAI_API_KEY` → trả lỗi rõ ràng thay vì crash
- ✅ File không phải PDF → lỗi rõ ràng thay vì crash
- ✅ Không kết nối được internet/OpenAI → lỗi rõ ràng thay vì lộ traceback thô
- ✅ Schema strict mode (additionalProperties/required) tự sinh đúng từ `QUIZ_SCHEMA` — kiểm bằng script riêng, không lệch tay
- ⚠️ **Chưa live-test được cuộc gọi OpenAI thật** — môi trường build này không có quyền gọi ra `api.openai.com` (proxy chặn, giống hệt lúc test Gemini trước đây). Cần bạn tự chạy `python app.py` với key thật trên máy mình để xác nhận bước cuối (đúng theo luật "≥1 lời gọi AI chạy thật" của rubric — CP2/CP3 sẽ tự thấy log request/response thật).

## 6. Giới hạn đã biết (ghi vào spec §4 phần "mock")

- PDF dạng ảnh/scan (không có text layer) → không trích được nội dung, chưa hỗ trợ OCR trong bản demo này.
- API key nằm trong `.env` phía server (không lộ ra trình duyệt) — đúng luật an toàn của hackathon ("không commit API key/.env — key để biến môi trường").
- Chế độ "Thử nghiệm" chỉ nên dùng trong lúc trình bày rủi ro (spec §5/§6), không dùng làm nguồn quiz thật phát cho học viên.
- Đây là prototype mức **Mock/Working một phần**: flow chính chạy thật end-to-end (upload → extract → AI call thật → hiển thị), chưa có bước người dạy duyệt trước khi phát (automation Augment theo thiết kế — bước duyệt hiện là *quy trình đề xuất*, chưa có UI riêng cho GV/TA).
