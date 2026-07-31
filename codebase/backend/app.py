import sys
import os
import tempfile
from pathlib import Path

# Đảm bảo Python nhận diện được thư mục backend và thư mục gốc của dự án
BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import streamlit as st
from agents import PageAwareRAGAgent, SlideSummaryAgent
from tools import SlideParser
from config.settings import DEFAULT_OPENAI_MODEL, SLIDES_DIR, DEFAULT_PROVIDER

st.set_page_config(
    page_title="VLearn Page-Aware AI Tutor",
    page_icon="🎓",
    layout="wide"
)

st.title("🎓 VLearn Page-Aware AI Tutor (OpenAI RAG)")
st.caption("Shark B - Zone E403 | Trợ lý AI định vị trang slide & RAG hỗ trợ học viên VLearn")

# Sidebar configuration
st.sidebar.header("⚙️ Cấu hình AI Tutor")
provider = st.sidebar.selectbox("LLM Provider", ["openai", "gemini"], index=0)
model_options = ["gpt-3.5-turbo", "gpt-4o-mini", "gpt-4o"] if provider == "openai" else ["gemini-1.5-flash", "gemini-2.0-flash"]
model_name = st.sidebar.selectbox("Tên Model (Thấp ➡️ Cao)", model_options, index=0)



if provider == "gemini":
    if not os.getenv("GEMINI_API_KEY") and not os.getenv("GOOGLE_API_KEY"):
        api_key_input = st.sidebar.text_input("Nhập Gemini API Key", type="password")
        if api_key_input:
            os.environ["GEMINI_API_KEY"] = api_key_input

# Chọn file slide mặc định hoặc tải mới
sample_slides = list(SLIDES_DIR.glob("*.pdf")) + list(SLIDES_DIR.glob("*.pptx"))
sample_options = [f.name for f in sample_slides]

slide_source = st.sidebar.radio("Nguồn Slide", ["File mẫu có sẵn", "Tải slide mới"])
slide_file_path = None

if slide_source == "File mẫu có sẵn" and sample_options:
    selected_sample = st.sidebar.selectbox("Chọn slide mẫu", sample_options)
    slide_file_path = str(SLIDES_DIR / selected_sample)
else:
    uploaded_file = st.file_uploader("Tải lên Slide (.pdf / .pptx)", type=["pdf", "pptx"])
    if uploaded_file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(uploaded_file.name).suffix) as tmp:
            tmp.write(uploaded_file.getvalue())
            slide_file_path = tmp.name

if slide_file_path and os.path.exists(slide_file_path):
    try:
        slides_data = SlideParser.extract_slides(slide_file_path)
        total_pages = len(slides_data)

        # Giao diện 2 cột chuẩn VLearn
        col_left, col_right = st.columns([1, 1])

        with col_left:
            st.subheader("📖 Nội dung Slide")
            selected_page = st.number_input("Chọn trang slide đang xem:", min_value=1, max_value=total_pages, value=1, step=1)
            
            # Content of current page
            page_content = slides_data[selected_page - 1]["content"] if selected_page <= total_pages else ""
            st.info(f"**Trang {selected_page} / {total_pages}**")
            
            if page_content:
                st.text_area("Nội dung text trên slide:", value=page_content, height=350, disabled=True)
            else:
                st.warning("⚠️ Slide này không chứa text (slide hình ảnh hoặc slide trống).")

        with col_right:
            st.subheader("💬 AI Tutor (Page-Aware RAG)")

            # Action buttons
            btn_col1, btn_col2 = st.columns(2)
            with btn_col1:
                summarize_btn = st.button("📝 Tóm tắt trang này", type="primary", use_container_width=True)
            with btn_col2:
                all_summary_btn = st.button("📊 Tóm tắt toàn bộ Slide", use_container_width=True)

            agent = PageAwareRAGAgent(provider=provider, model_name=model_name)

            if summarize_btn:
                with st.spinner(f"Gemini 2.5 Flash đang lọc dữ liệu Trang {selected_page}..."):
                    summary_result = agent.summarize_page(slide_file_path, page_number=selected_page)
                    st.markdown(f"### 📑 Tóm tắt Trang {selected_page}")
                    st.markdown(summary_result)

            if all_summary_btn:
                with st.spinner("Đang tổng hợp toàn bộ bài giảng..."):
                    full_agent = SlideSummaryAgent(provider=provider, model_name=model_name)
                    res = full_agent.summarize_slide_file(slide_file_path)
                    st.markdown("### 📄 Bản tóm tắt tổng quan bộ Slide")
                    st.markdown(res.get("summary_md", ""))

            st.divider()
            st.markdown("**❓ Hỏi đáp với AI Tutor về bài học:**")
            user_query = st.text_input("Nhập câu hỏi của bạn (ví dụ: 'Nêu các điểm chính của trang này'):")

            if st.button("Gửi câu hỏi", use_container_width=True):
                if user_query:
                    with st.spinner("Tutor đang tra cứu dữ liệu..."):
                        answer = agent.ask_question(slide_file_path, query=user_query, page_number=selected_page)
                        st.markdown("**Trả lời:**")
                        st.markdown(answer)

    except Exception as e:
        st.error(f"Lỗi khi đọc file slide: {str(e)}")
else:
    st.info("👈 Vui lòng chọn file slide ở thanh bên trái để khởi tạo AI Tutor.")
