# ui/app.py - Streamlit AI Slide Tutor Demo App (Dark Slide Viewer View)
"""
VLearn AI Tutor - Streamlit Application for AI Slide Reading & Context Learning.
Matched 100% to Latest Dark Slide Viewer Screenshot with 100% Interactive Buttons.
Run command: streamlit run Space/ui/app.py
"""

import os
import sys
import json
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

# --- PATH & MODULE RESOLUTION ---
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
CODEBASE_DIR = PROJECT_ROOT / "codebase"
SLIDES_DIR = PROJECT_ROOT / "data" / "vlearn-pack" / "slides"

if str(CODEBASE_DIR) not in sys.path:
    sys.path.insert(0, str(CODEBASE_DIR))

# Attempt to load AI agent & PDF processor from codebase/core
try:
    from core.agent import run_agent
    from core.pdf_processor import read_slide_page_real
    HAS_AI_CORE = True
except Exception as err:
    HAS_AI_CORE = False

import threading
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler

# --- LIGHTWEIGHT BACKEND API BRIDGE FOR AI CHATBOT ---
class ChatAPIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            user_msg = data.get('message', '')
            day_code = data.get('day_code', 'd1')
            slide_num = data.get('current_slide', 1)

            prompt = f"Tôi đang xem slide {day_code.upper()}, trang {slide_num}. Câu hỏi của tôi: {user_msg}"

            reply = ""
            if HAS_AI_CORE:
                try:
                    reply = run_agent(prompt)
                except Exception as e:
                    reply = f"⚠️ Lỗi kết nối AI Agent: {str(e)}. Hãy kiểm tra file .env API Key."
            else:
                reply = f"🤖 <strong>VLearn Tutor:</strong> Bạn vừa hỏi: '{user_msg}' tại slide {slide_num}."

            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            response_body = json.dumps({'reply': reply}, ensure_ascii=False).encode('utf-8')
            self.wfile.write(response_body)

def start_api_server():
    try:
        server = HTTPServer(('0.0.0.0', 8502), ChatAPIHandler)
        server.serve_forever()
    except Exception:
        pass

if 'api_server_started' not in st.session_state:
    st.session_state.api_server_started = True
    t = threading.Thread(target=start_api_server, daemon=True)
    t.start()

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
