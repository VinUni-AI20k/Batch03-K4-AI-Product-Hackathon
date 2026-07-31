import { useState } from "react";
import type { LLMStatus } from "../api/client";

export type Stage = "upload" | "ready" | "quiz" | "open-answer" | "diagnosis" | "retest-config" | "style" | "roadmap" | "review" | "report";

type Props = {
  stage: Stage;
  quizMode: "round1" | "retest";
  answer?: string;
  providerStatus?: LLMStatus | null;
  onAsk?: (question: string) => Promise<void>;
};

const messages: Record<Stage, { phase: string; title: string; text: string }> = {
  upload: {
    phase: "Phase 1 — Knowledge Preparation",
    title: "Bắt đầu học cùng AI",
    text: "Tải file slide/PDF lên để AI phân loại nội dung, trích xuất outline và chuẩn bị tạo quiz.",
  },
  ready: {
    phase: "Phase 1 — Knowledge Preparation",
    title: "Sẵn sàng tạo MCQ",
    text: "Bạn có thể bấm 'Tạo MCQ' để sinh 20 câu hỏi trắc nghiệm dựa trên nội dung slide.",
  },
  quiz: {
    phase: "Phase 2 / 4",
    title: "Làm quiz từng câu",
    text: "AI hiển thị từng câu hỏi một. Chọn đáp án và tiếp tục đến câu tiếp theo.",
  },
  "open-answer": {
    phase: "Phase 2 — Learning Diagnosis",
    title: "Chia sẻ mục tiêu học tập",
    text: "Câu trả lời của bạn sẽ giúp AI hiểu phần nào cần được ưu tiên ôn tập.",
  },
  diagnosis: {
    phase: "Phase 2 — Learning Diagnosis",
    title: "Xem kết quả chẩn đoán",
    text: "AI đã chấm bài và xác định phần bạn đã tốt / cần cải thiện.",
  },
  "retest-config": {
    phase: "Phase 4 — Learning Validation",
    title: "Thiết lập bài kiểm tra lại",
    text: "Chọn số câu và phạm vi kiến thức muốn xác nhận.",
  },
  style: {
    phase: "Phase 3 — Adaptive Re-teaching",
    title: "Chọn cách ôn tập",
    text: "Chọn cách học (trực quan/toán học) và thời gian để AI tạo lộ trình ôn tập phù hợp.",
  },
  roadmap: {
    phase: "Phase 3 — Adaptive Re-teaching",
    title: "Ôn lại theo lộ trình",
    text: "Mỗi phần yếu có Summary, ví dụ thực tế, và câu hỏi luyện nhanh. Học xong bấm kiểm tra lại.",
  },
  review: {
    phase: "Phase 4 — Learning Validation",
    title: "Chưa đạt mức hiểu vững",
    text: "Xem lại câu sai kèm nguồn tham chiếu, sau đó ôn tập lại phần chưa vững.",
  },
  report: {
    phase: "Phase 4 — Learning Validation",
    title: "Hoàn thành!",
    text: "Bạn đã đạt mức hiểu vững cho các phần vừa ôn tập.",
  },
};

export default function ChatPanel({ stage, quizMode, answer, providerStatus, onAsk }: Props) {
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");
  const message = messages[stage];
  const title =
    stage === "quiz" ? (quizMode === "round1" ? "Quiz chẩn đoán ban đầu" : "Kiểm tra lại (Retest)") : message.title;

  return (
    <div className="chat-panel">
      <div className="chat-avatar">💡</div>
      <div className="chat-copy">
        <p className="eyebrow">{message.phase}</p>
        <p className="chat-title">{title}</p>
        <p>{message.text}</p>
        <p className="provider-status">
          LLM: {providerStatus?.configured ? `${providerStatus.provider} / ${providerStatus.model}` : "chưa cấu hình"}
        </p>
        {answer && <p className="chat-answer">{answer}</p>}
        {onAsk && (
          <form
            className="chat-ask-form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!question.trim()) return;
              setIsAsking(true);
              setError("");
              try {
                await onAsk(question.trim());
                setQuestion("");
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
              } finally {
                setIsAsking(false);
              }
            }}
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Hỏi AI trên nội dung đang học..."
              disabled={isAsking}
            />
            <button type="submit" disabled={isAsking || !question.trim()}>
              {isAsking ? "Đang hỏi..." : "Hỏi"}
            </button>
          </form>
        )}
        {error && <p className="chat-error">{error}</p>}
      </div>
    </div>
  );
}
