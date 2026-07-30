"""
app.py — VLearn Concise-RAG Tutor (Streamlit UI)
Option 1: Tối ưu AI Tutor sẵn có — giải thích ngắn gọn + trích dẫn chính xác
"""

import streamlit as st
import time
from data_loader import load_transcripts, get_transcript_options
from retriever import TranscriptRetriever
from llm import generate_explanation

# ── Page config ──────────────────────────────────────────────────────
st.set_page_config(
    page_title="VLearn Concise-RAG Tutor",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ───────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* Global */
    .stApp {
        background: linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0d1322 100%);
    }

    /* Header */
    .hero-header {
        text-align: center;
        padding: 2rem 0 1.5rem;
    }
    .hero-badge {
        display: inline-block;
        background: rgba(108,99,255,0.15);
        border: 1px solid rgba(108,99,255,0.35);
        color: #a5a0ff;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 4px 16px;
        border-radius: 999px;
        margin-bottom: 12px;
    }
    .hero-title {
        font-family: 'Inter', sans-serif;
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #fff 30%, #00d4ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
        line-height: 1.2;
    }
    .hero-sub {
        color: #64748b;
        font-size: 0.95rem;
        font-family: 'Inter', sans-serif;
    }

    /* Glass card */
    .glass-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 20px 24px;
        backdrop-filter: blur(12px);
        margin-bottom: 16px;
    }

    /* Answer box */
    .answer-box {
        background: rgba(34,211,165,0.05);
        border: 1px solid rgba(34,211,165,0.2);
        border-radius: 14px;
        padding: 20px 24px;
        font-size: 1rem;
        line-height: 1.7;
        color: #e2e8f0;
    }
    .answer-box.low-conf {
        border-color: rgba(245,158,11,0.3);
        background: rgba(245,158,11,0.05);
    }
    .answer-box.not-found {
        border-color: rgba(255,92,108,0.3);
        background: rgba(255,92,108,0.05);
    }

    /* Citation chip */
    .cite-chip {
        display: inline-block;
        background: rgba(108,99,255,0.15);
        border: 1px solid rgba(108,99,255,0.3);
        color: #a5a0ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 2px 10px;
        border-radius: 6px;
        margin: 2px 4px 2px 0;
    }

    /* Source chunk card */
    .source-card {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 10px;
        font-size: 0.88rem;
        color: #94a3b8;
        line-height: 1.6;
    }
    .source-card .source-id {
        font-family: 'JetBrains Mono', monospace;
        color: #6c63ff;
        font-weight: 700;
        font-size: 0.8rem;
    }
    .source-card .source-label {
        color: #64748b;
        font-size: 0.75rem;
    }

    /* Metrics row */
    .metrics-row {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    }
    .metric-item {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 10px;
        padding: 10px 16px;
        flex: 1;
        text-align: center;
    }
    .metric-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.2rem;
        font-weight: 700;
        color: #00d4ff;
    }
    .metric-label {
        font-size: 0.7rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Sidebar */
    section[data-testid="stSidebar"] {
        background: rgba(13,19,34,0.95);
    }

    /* Hide streamlit branding */
    #MainMenu, footer, header {visibility: hidden;}

    /* Improve text area */
    .stTextArea textarea {
        background: rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        border-radius: 12px !important;
        color: #e2e8f0 !important;
        font-size: 1rem !important;
    }
    .stTextArea textarea:focus {
        border-color: rgba(108,99,255,0.5) !important;
    }

    /* Button */
    .stButton>button {
        background: linear-gradient(135deg, #6c63ff, #00d4ff) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 10px 32px !important;
        font-weight: 700 !important;
        font-size: 0.95rem !important;
        transition: all 0.2s !important;
    }
    .stButton>button:hover {
        opacity: 0.85 !important;
        box-shadow: 0 0 24px rgba(108,99,255,0.4) !important;
    }
</style>
""", unsafe_allow_html=True)


# ── Load data (cached) ───────────────────────────────────────────────
@st.cache_resource(show_spinner="📚 Đang đọc transcript bài giảng...")
def init_engine():
    """Load transcripts and build retriever index."""
    chunks = load_transcripts()
    retriever = TranscriptRetriever(chunks)
    return chunks, retriever


chunks, retriever = init_engine()


# ── Header ───────────────────────────────────────────────────────────
st.markdown("""
<div class="hero-header">
    <div class="hero-badge">🎓 Option 1 — Concise-RAG Tutor</div>
    <div class="hero-title">VLearn AI Tutor</div>
    <div class="hero-sub">Bôi đen đoạn khó → nhận giải thích ≤3 câu kèm trích dẫn transcript chính xác</div>
</div>
""", unsafe_allow_html=True)


# ── Sidebar ──────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚙️ Cấu hình")

    # API key
    api_key = st.text_input(
        "Gemini API Key",
        value=st.session_state.get("api_key", ""),
        type="password",
        help="Nhập Google Gemini API key",
    )
    if api_key:
        st.session_state["api_key"] = api_key

    st.divider()

    # Transcript filter
    transcript_options = get_transcript_options()
    selected_source = st.selectbox(
        "📖 Buổi học",
        options=[opt["value"] for opt in transcript_options],
        format_func=lambda v: next(
            opt["label"] for opt in transcript_options if opt["value"] == v
        ),
        index=0,
        help="Chọn buổi học để thu hẹp phạm vi tìm kiếm (khuyến khích)",
    )

    # Slide page (optional)
    slide_page = st.text_input(
        "📄 Số trang slide (tuỳ chọn)",
        placeholder="VD: 37",
        help="Nếu biết số trang slide, nhập để tăng ngữ cảnh",
    )

    st.divider()

    # Stats
    st.markdown("### 📊 Dữ liệu")
    st.markdown(f"""
    <div class="glass-card" style="padding:12px 16px;">
        <div style="color:#64748b;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Transcript chunks</div>
        <div style="font-family:'JetBrains Mono';font-size:1.4rem;font-weight:700;color:#00d4ff;">{len(chunks)}</div>
        <div style="color:#475569;font-size:0.75rem;">từ 6 buổi giảng</div>
    </div>
    """, unsafe_allow_html=True)

    st.divider()

    # Ví dụ nhanh
    st.markdown("### 💡 Thử nhanh")
    examples = [
        "context window",
        "MoE — Mixture of Experts",
        "product manager và project manager khác nhau thế nào",
        "dogfooding",
        "token prediction loop",
        "ReAct design pattern",
    ]
    for ex in examples:
        if st.button(f"→ {ex}", key=f"ex_{ex}", use_container_width=True):
            st.session_state["input_text"] = ex


# ── Main input ───────────────────────────────────────────────────────
col1, col2 = st.columns([3, 1])

with col1:
    input_text = st.text_area(
        "📝 Đoạn bôi đen từ slide",
        value=st.session_state.get("input_text", ""),
        height=100,
        placeholder="Dán đoạn text bạn bôi đen từ slide vào đây...\nVí dụ: \"context window\" hoặc \"Nếu bài toán không cần dữ liệu mới, nhiều bước, hay quyết định động, agent thường là overkill.\"",
        key="main_input",
    )

with col2:
    st.markdown("<br>", unsafe_allow_html=True)
    submit = st.button("🚀 Giải thích ngay", use_container_width=True, type="primary")
    clear = st.button("🗑️ Xoá", use_container_width=True)
    if clear:
        st.session_state["input_text"] = ""
        st.session_state["main_input"] = ""
        st.rerun()


# ── Process & Display ────────────────────────────────────────────────
if submit and input_text.strip():
    query = input_text.strip()
    effective_key = st.session_state.get("api_key", "")

    if not effective_key:
        st.error("⚠️ Vui lòng nhập Gemini API Key ở sidebar trước.")
        st.stop()

    # ── Step 1: Retrieve ──
    with st.spinner("🔍 Đang tìm trong transcript..."):
        source_filter = selected_source if selected_source != "all" else None
        results = retriever.search(query, top_k=3, source_filter=source_filter)
        top_score = results[0][1] if results else 0.0
        confidence = retriever.get_confidence_level(top_score)

    # ── Step 2: Generate ──
    with st.spinner("✨ Đang tạo giải thích..."):
        t0 = time.time()
        answer = generate_explanation(
            selected_text=query,
            retrieved_results=results,
            confidence=confidence,
            api_key=effective_key,
            slide_page=slide_page if slide_page else None,
        )
        gen_time = time.time() - t0

    # ── Metrics ──
    conf_emoji = {"high": "🟢", "low": "🟡", "not_found": "🔴"}
    conf_label = {"high": "Cao", "low": "Thấp", "not_found": "Không tìm thấy"}
    st.markdown(f"""
    <div class="metrics-row">
        <div class="metric-item">
            <div class="metric-num">{conf_emoji.get(confidence,'')} {conf_label.get(confidence,'')}</div>
            <div class="metric-label">Độ tin cậy</div>
        </div>
        <div class="metric-item">
            <div class="metric-num">{len(results)}</div>
            <div class="metric-label">Đoạn tìm được</div>
        </div>
        <div class="metric-item">
            <div class="metric-num">{top_score:.3f}</div>
            <div class="metric-label">Similarity score</div>
        </div>
        <div class="metric-item">
            <div class="metric-num">{gen_time:.1f}s</div>
            <div class="metric-label">Thời gian xử lý</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # ── Answer ──
    answer_class = {
        "high": "answer-box",
        "low": "answer-box low-conf",
        "not_found": "answer-box not-found",
    }
    st.markdown("#### 💬 Giải thích")
    st.markdown(f'<div class="{answer_class.get(confidence, "answer-box")}">{answer}</div>', unsafe_allow_html=True)

    # ── Sources (expander) ──
    if results:
        st.markdown("#### 📄 Đoạn transcript nguồn")
        for chunk, score in results:
            with st.expander(
                f"`{chunk['id']}` — {chunk['source_label']} (score: {score:.3f})",
                expanded=False,
            ):
                st.markdown(f"""
                <div class="source-card">
                    <div style="margin-bottom:8px;">
                        <span class="source-id">[{chunk['id']}]</span>
                        <span class="source-label"> · {chunk['source_label']}</span>
                    </div>
                    {chunk['text'][:1000]}{'...' if len(chunk['text']) > 1000 else ''}
                </div>
                """, unsafe_allow_html=True)

    # ── Save to history ──
    if "history" not in st.session_state:
        st.session_state["history"] = []
    st.session_state["history"].append({
        "query": query,
        "answer": answer,
        "confidence": confidence,
        "score": top_score,
        "sources": [r[0]["id"] for r in results],
    })


# ── History ──────────────────────────────────────────────────────────
if st.session_state.get("history"):
    st.divider()
    st.markdown("#### 📜 Lịch sử câu hỏi")
    for i, h in enumerate(reversed(st.session_state["history"])):
        conf_e = {"high": "🟢", "low": "🟡", "not_found": "🔴"}
        with st.expander(
            f"{conf_e.get(h['confidence'],'')} {h['query'][:60]}...",
            expanded=False,
        ):
            st.markdown(h["answer"])
            if h["sources"]:
                chips = " ".join(
                    f'<span class="cite-chip">{s}</span>' for s in h["sources"]
                )
                st.markdown(f"Nguồn: {chips}", unsafe_allow_html=True)


# ── Footer ───────────────────────────────────────────────────────────
st.markdown("""
<div style="text-align:center;padding:40px 0 20px;color:#334155;font-size:0.75rem;">
    VLearn Concise-RAG Tutor · K4 Hackathon Ricons D304 · Option 1<br>
    Prototype — chỉ dùng transcript bài giảng làm nguồn sự thật
</div>
""", unsafe_allow_html=True)
