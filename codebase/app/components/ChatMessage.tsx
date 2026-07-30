import type { ChatMessageData } from "../types";
import CitationBadge from "./CitationBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import FeedbackControls from "./FeedbackControls";

export default function ChatMessage({ message, onNavigate, onFeedback, onSuggestion }: {
  message: ChatMessageData;
  onNavigate: (page: number) => void;
  onFeedback: (id: string, value: "up" | "down", note?: string) => void;
  onSuggestion: (suggestion: string) => void;
}) {
  if (message.role === "user") return <div className="message user-message">{message.text}</div>;
  const answer = message.answer;
  if (!answer) return null;
  return (
    <article className="message assistant-message">
      <div className="assistant-mark">AI</div>
      <div className="message-content">
        <p>{answer.text}</p>
        {answer.clarificationOptions && (
          <div className="clarification-options">
            {answer.clarificationOptions.map((option) => <button key={option} onClick={() => onSuggestion(option)}>{option}<span>→</span></button>)}
          </div>
        )}
        <div className="answer-evidence">
          {answer.citations.map((citation) => <CitationBadge key={`${message.id}-${citation.page}`} citation={citation} onNavigate={onNavigate} />)}
          <ConfidenceBadge score={answer.confidence} label={answer.confidenceLabel} />
        </div>
        {message.id !== "welcome" && <FeedbackControls value={message.feedback} onChange={(value, note) => onFeedback(message.id, value, note)} />}
      </div>
    </article>
  );
}
