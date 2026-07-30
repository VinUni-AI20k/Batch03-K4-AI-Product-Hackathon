import type { ChatMessageData, Lecture } from "../types";

export const initialLectures: Lecture[] = [
  { id: "lecture-foundation", name: "AI & LLM Foundation.pdf", uploadedAt: "Hôm nay, 09:42", pageCount: 29, status: "ready", fileType: "pdf" },
  { id: "lecture-product", name: "Xác định bài toán cho AI.pdf", uploadedAt: "Hôm qua, 16:18", pageCount: 29, status: "ready", fileType: "pdf" },
  { id: "lecture-transformer", name: "Transformer nâng cao.pptx", uploadedAt: "28/07/2026, 14:05", status: "processing", fileType: "pptx" },
  { id: "lecture-error", name: "Workshop notes.pdf", uploadedAt: "26/07/2026, 10:11", status: "error", fileType: "pdf" },
];

export const initialMessages: ChatMessageData[] = [{
  id: "welcome", role: "assistant", text: "",
  answer: {
    text: "Mình hỗ trợ giải thích ngắn các khái niệm trong bài giảng Buổi 1. Câu trả lời sẽ bám sát slide và transcript đang mở.",
    citations: [{ page: 1, label: "Trang 1" }], confidence: 98,
    confidenceLabel: "Khớp 98% với transcript Trang 1",
  },
}];

export const slideContent = [
  { eyebrow: "AI THỰC CHIẾN · FOUNDATION", title: "AI không phải là phép màu", body: "AI là một hệ thống dự đoán dựa trên dữ liệu. Giá trị thực xuất hiện khi ta đặt đúng bài toán, cung cấp đủ ngữ cảnh và biết cách kiểm chứng đầu ra.", note: "Bôi đen một đoạn bất kỳ để hỏi AI Tutor" },
  { eyebrow: "TỪ DỮ LIỆU ĐẾN QUYẾT ĐỊNH", title: "Mô hình ngôn ngữ hoạt động thế nào?", body: "Mô hình ngôn ngữ lớn học các mẫu thống kê từ lượng văn bản rất lớn. Với mỗi ngữ cảnh, mô hình dự đoán token tiếp theo có xác suất phù hợp nhất.", note: "Token là đơn vị nhỏ mà mô hình dùng để xử lý ngôn ngữ." },
  { eyebrow: "NGỮ CẢNH QUYẾT ĐỊNH CHẤT LƯỢNG", title: "Prompt tốt bắt đầu từ mục tiêu rõ", body: "Một prompt hữu ích nêu rõ vai trò, việc cần làm, dữ liệu được phép dùng và định dạng đầu ra. Ràng buộc rõ giúp giảm câu trả lời lan man.", note: "Hãy mô tả kết quả mong muốn thay vì chỉ nói chủ đề." },
  { eyebrow: "GROUNDING & KIỂM CHỨNG", title: "Căn cứ quan trọng hơn sự tự tin", body: "Một câu trả lời đáng tin cần truy ngược được về nguồn. Citation giúp người học kiểm tra phát biểu của AI ngay trên trang bài giảng liên quan.", note: "Nguồn sự thật của Tutor là slide và transcript được chọn." },
  { eyebrow: "HUMAN IN THE LOOP", title: "Con người vẫn giữ quyền quyết định", body: "AI nên hỗ trợ khả năng phán đoán của người học, không thay thế nó. Khi thiếu căn cứ, hệ thống cần nói rõ giới hạn và hỏi lại để thu hẹp phạm vi.", note: "Không chắc chắn là tín hiệu để hỏi rõ, không phải để đoán." },
];
