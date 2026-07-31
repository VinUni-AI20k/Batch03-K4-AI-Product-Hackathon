# ui/app.py - Streamlit AI Slide Tutor Demo App (Bản Kết Nối Backend Thật)
"""
VLearn AI Tutor - Streamlit Application for AI Slide Reading & Context Learning.
Matched 100% to Latest Dark Slide Viewer Screenshot with 100% Interactive Buttons.
Run command: streamlit run ui/app.py
"""

import os
import sys
import json
import threading
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
import streamlit as st
import streamlit.components.v1 as components

# --- PATH & MODULE RESOLUTION ---
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
CODEBASE_DIR = PROJECT_ROOT / "codebase"
SLIDES_DIR = PROJECT_ROOT / "data" / "vlearn-pack" / "slides"

if str(CODEBASE_DIR) not in sys.path:
    sys.path.insert(0, str(CODEBASE_DIR))

# Nạp AI agent từ codebase/core của nhóm
try:
    from core.agent import run_agent
    HAS_AI_CORE = True
except Exception as err:
    HAS_AI_CORE = False

# --- CỔNG API LẮNG NGHE CHẠY NGẦM (PORT 8000) ---
class AIChatAPIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Trả về CORS Header cho trình duyệt chấp nhận gọi chéo cổng (Cross-Origin)
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                user_message = payload.get("message", "")
                day_code = payload.get("day_code", "d1")
                current_slide = payload.get("current_slide", 1)

                # Thiết lập câu hỏi kèm theo ngữ cảnh slide học viên đang xem gửi cho Backend
                prompt_with_context = f"Học viên đang xem slide {day_code.upper()} trang {current_slide}. Câu hỏi: '{user_message}'"
                
                # Thực thi hàm xử lý thực tế dưới Backend
                if HAS_AI_CORE:
                    ai_reply = run_agent(prompt_with_context)
                else:
                    ai_reply = "[Lỗi]: Chưa kết nối được với codebase/core/agent.py."

            except Exception as e:
                ai_reply = f"[Lỗi backend]: {str(e)}"

            # Trả dữ liệu JSON về cho JavaScript hiển thị lên bong bóng chat
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = json.dumps({"reply": ai_reply})
            self.wfile.write(response_data.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Tắt bớt log HTTP để Terminal luôn sạch
        return

def start_api_server():
    try:
        server_address = ('', 8000)
        httpd = HTTPServer(server_address, AIChatAPIHandler)
        httpd.serve_forever()
    except Exception as e:
        pass

# Khởi tạo API Server ngầm (chỉ chạy duy nhất 1 lần)
if "api_server_started" not in st.session_state:
    t = threading.Thread(target=start_api_server, daemon=True)
    t.start()
    st.session_state.api_server_started = True

# --- STREAMLIT PAGE CONFIGURATION ---
st.set_page_config(
    page_title="VLearn AI Tutor - day01_302.pdf",
    page_icon="📖",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- REMOVE STREAMLIT DEFAULT PADDING FOR FULLSCREEN MATCH ---
st.markdown("""
<style>
    /* Hide Streamlit Default Top Header & Bottom Footer */
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Remove padding around stApp container */
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        max-width: 100% !important;
    }
    
    body {
        margin: 0;
        padding: 0;
        background-color: #060914;
        overflow: hidden;
    }
</style>
""", unsafe_allow_html=True)

# --- READ HTML, CSS & JS BUNDLE ---
html_path = BASE_DIR / "product.html"
css_path = BASE_DIR / "style.css"
js_path = BASE_DIR / "app.js"

if html_path.exists() and css_path.exists() and js_path.exists():
    import base64
    pdf_d1_b64 = ""
    pdf_d2_b64 = ""
    d1_path = SLIDES_DIR / "d1-slide-hackathon.pdf"
    d2_path = SLIDES_DIR / "d2-slide-hackathon.pdf"
    if d1_path.exists():
        with open(d1_path, "rb") as f_pdf:
            pdf_d1_b64 = base64.b64encode(f_pdf.read()).decode("utf-8")
    if d2_path.exists():
        with open(d2_path, "rb") as f_pdf:
            pdf_d2_b64 = base64.b64encode(f_pdf.read()).decode("utf-8")

    with open(html_path, "r", encoding="utf-8") as f_h:
        html_code = f_h.read()
    with open(css_path, "r", encoding="utf-8") as f_c:
        css_code = f_c.read()
    with open(js_path, "r", encoding="utf-8") as f_j:
        js_code = f_j.read()

    # Inline PDF Base64, CSS and JS into single standalone bundle
    pdf_script = f'<script>window.PDF_D1_BASE64 = "{pdf_d1_b64}"; window.PDF_D2_BASE64 = "{pdf_d2_b64}";</script>'
    standalone_bundle = html_code.replace(
        '</head>',
        f'{pdf_script}</head>'
    ).replace(
        '<link rel="stylesheet" href="style.css">',
        f'<style>{css_code}</style>'
    ).replace(
        '<script src="app.js"></script>',
        f'<script>{js_code}</script>'
    )

    # Render full height embedded view with 100% interactive buttons
    components.html(standalone_bundle, height=760, scrolling=False)

else:
    st.error("Không tìm thấy các file giao diện (product.html, style.css, app.js) trong thư mục ui/")