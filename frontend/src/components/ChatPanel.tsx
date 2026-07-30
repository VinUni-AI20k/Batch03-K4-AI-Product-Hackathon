type Props = {
  stage: "upload" | "ready" | "quiz" | "results" | "review";
};

const messages: Record<string, { title: string; text: string }> = {
  upload: {
    title: "Bắt đầu học cùng AI",
    text: "Tải file slide/PDF lên để AI tự động chuyển toàn bộ nội dung sang text.md và chuẩn bị tạo quiz.",
  },
  ready: {
    title: "Sẵn sàng tạo MCQ",
    text: "Bạn có thể bấm 'Tạo MCQ' để sinh 20 câu hỏi trắc nghiệm dựa trên nội dung slide.",
  },
  quiz: {
    title: "Làm quiz từng câu",
    text: "AI sẽ hiển thị từng câu hỏi một. Chọn đáp án và tiếp tục đến câu tiếp theo.",
  },
  results: {
    title: "Học xong rồi",
    text: "Xem những gì bạn đã nắm và cần cải thiện, rồi chọn prompt ôn lại phù hợp.",
  },
  review: {
    title: "Ôn lại theo tab",
    text: "Chọn tab từ khóa để xem nội dung tóm tắt ngắn gọn, sau đó bạn có thể quay lại quiz mới.",
  },
};

export default function ChatPanel({ stage }: Props) {
  const message = messages[stage];

  return (
    <div className="chat-panel">
      <div className="chat-avatar">💡</div>
      <div className="chat-copy">
        <p className="chat-title">{message.title}</p>
        <p>{message.text}</p>
      </div>
    </div>
  );
}
