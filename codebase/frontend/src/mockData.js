export const FALLBACK_KB_ITEMS = [
  {
    id: "fb_post_1001",
    post_id: "1001",
    question: "Mọi người cho em hỏi lỗi khi chạy pip install -r requirements.txt trên Windows báo 'error: Microsoft Visual C++ 14.0 or greater is required' khi cài pycrypto hoặc một số package là fix thế nào ạ?",
    category: "technical_setup",
    verified_answer: {
      author_name: "TA Nguyễn Minh (Mentor AI Thực Chiến)",
      content: "Chào bạn, lỗi này do Windows thiếu Build Tools để biên dịch extension C++. Cách xử lý nhanh cho khoá AI Thực Chiến: 1) Ưu tiên dùng wheel có sẵn hoặc pycryptodome thay thế pycrypto (đã cũ). 2) Trong repo hackathon, bạn chỉ cần dùng Python 3.10-3.12 và cài các package thuần Python như requests, fastAPI, uvicorn.",
      likes: 24,
      source_url: "https://facebook.com/groups/363757814515154/posts/1001"
    }
  },
  {
    id: "fb_post_1002",
    post_id: "1002",
    question: "Anh chị TA cho em hỏi hạn nộp bài spec.md cho Mini Hackathon Batch 03 chính xác là mấy giờ ngày 1 vậy ạ?",
    category: "logistics_deadline",
    verified_answer: {
      author_name: "TA Trần Thu Hà (BTC Hackathon)",
      content: "Lưu ý quan trọng cho Batch 03: 17:30 Ngày 1 là mốc CP4 (Chốt tiến độ trên lớp). Tuy nhiên, HẠN CỨNG (Hard Deadline) để commit file spec.md hoàn chỉnh lên repo nhóm là 23:59 Ngày 1. Sau thời gian này quality bar của spec sẽ được giữ nguyên để ban giám khảo chấm điểm R1-R4 nhé!",
      likes: 42,
      source_url: "https://facebook.com/groups/363757814515154/posts/1002"
    }
  },
  {
    id: "fb_post_1004",
    post_id: "1004",
    question: "Mọi người cho em hỏi nguyên tắc HAX và PAIR trong mục §4b của AI Spec là gì vậy ạ? Em nên áp dụng thế nào cho tính năng AI QA của nhóm?",
    category: "course_concept",
    verified_answer: {
      author_name: "TA Nguyễn Minh (Mentor AI Thực Chiến)",
      content: "HAX (Human-AI eXperience của Microsoft) và PAIR (People + AI Research của Google) là bộ nguyên tắc thiết kế trải nghiệm AI. Khi viết §4b trong spec.md, nhóm bạn cần chọn ≥4 nguyên tắc và chỉ rõ áp dụng vào đâu trong prototype.",
      likes: 19,
      source_url: "https://facebook.com/groups/363757814515154/posts/1004"
    }
  },
  {
    id: "fb_post_1005",
    post_id: "1005",
    question: "Anh chị cho em hỏi luật Vibe-coding trong Hackathon quy định như thế nào ạ? Nhóm em dùng Cursor / Cline AI viết full code thì có bị trừ điểm không?",
    category: "rubric_course",
    verified_answer: {
      author_name: "TA Trần Thu Hà (BTC Hackathon)",
      content: "Theo Luật chung #2 (README.md): 'Vibe-coding rule: Dùng AI để build thoải mái, nhưng không giải thích được phần có tên mình thì phần đó 0 điểm (kiểm tra tại CP5)'.",
      likes: 55,
      source_url: "https://facebook.com/groups/363757814515154/posts/1005"
    }
  }
];

export const FALLBACK_STATS = {
  fb_posts_scraped: 8,
  vlearn_snippets: 3,
  total_verified_answers: 8,
  total_community_likes: 285,
  source_tool: "fb/facebook_post_comment_scraper (v2.0 GraphQL requests)"
};
