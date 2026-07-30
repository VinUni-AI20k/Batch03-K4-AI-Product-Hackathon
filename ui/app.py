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
    with open(html_path, "r", encoding="utf-8") as f_h:
        html_code = f_h.read()
    with open(css_path, "r", encoding="utf-8") as f_c:
        css_code = f_c.read()
    with open(js_path, "r", encoding="utf-8") as f_j:
        js_code = f_j.read()

    # Inline CSS and JS into single standalone bundle
    standalone_bundle = html_code.replace(
        '<link rel="stylesheet" href="style.css">',
        f'<style>{css_code}</style>'
    ).replace(
        '<script src="app.js"></script>',
        f'<script>{js_code}</script>'
    )

    # Render full height embedded view with 100% interactive buttons
    components.html(standalone_bundle, height=950, scrolling=True)

else:
    st.error("Không tìm thấy các file giao diện (product.html, style.css, app.js) trong thư mục ui/")
