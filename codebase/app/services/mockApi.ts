import type { Lecture, TutorAnswer } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadLecture(file: File, id: string, fileUrl: string): Promise<Lecture> {
  await delay(450);
  const fileType = file.name.toLowerCase().endsWith(".pptx") ? "pptx" : "pdf";
  return {
    id,
    name: file.name,
    uploadedAt: new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date()),
    status: fileType === "pdf" ? "ready" : "processing",
    fileType,
    file,
    fileUrl,
  };
}

export async function askTutor(question: string, page: number): Promise<TutorAnswer> {
  await delay(850);
  const isAmbiguous = question.trim().length < 14 || /toàn bộ|nó là gì|giải thích đi/i.test(question);
  if (isAmbiguous) return {
    text: "Mình chưa có đủ ngữ cảnh để trả lời chính xác. Chọn một hướng bên dưới để mình giải thích đúng ý và thật ngắn gọn nhé.",
    citations: [{ page, label: `Trang ${page}` }], confidence: 61,
    confidenceLabel: `Khớp 61% với transcript Trang ${page}`,
    clarificationOptions: ["Bạn muốn hỏi về định nghĩa hay ví dụ ứng dụng?", "Bạn đang hỏi nội dung ở trang hiện tại hay toàn bộ bài?"],
  };
  return {
    text: "Khái niệm này nhấn mạnh rằng chất lượng đầu ra phụ thuộc vào ngữ cảnh và nguồn dữ liệu được cung cấp. Trong thực tế, bạn nên nêu mục tiêu rõ và luôn kiểm tra câu trả lời với tài liệu gốc.",
    citations: [{ page, label: `Trang ${page}` }], confidence: 95,
    confidenceLabel: `Khớp 95% với transcript Trang ${page}`,
  };
}

export async function explainSelection(selection: string, page: number): Promise<TutorAnswer> {
  await delay(500);
  return {
    text: `“${selection.slice(0, 58)}${selection.length > 58 ? "…" : ""}” nói về cách AI dùng ngữ cảnh để đưa ra dự đoán phù hợp. Hiểu đơn giản: đầu vào càng rõ và có căn cứ, câu trả lời càng dễ kiểm chứng.`,
    citations: [{ page, label: `Trang ${page}` }], confidence: 96,
    confidenceLabel: `Khớp 96% với transcript Trang ${page}`,
  };
}

export async function saveFeedback(): Promise<void> { await delay(350); }
