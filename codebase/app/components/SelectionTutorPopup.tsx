import type { TutorAnswer } from "../types";
import CitationBadge from "./CitationBadge";

export default function SelectionTutorPopup({ answer, loading, position, onNavigate, onClose }: {
  answer?: TutorAnswer;
  loading: boolean;
  position: { x: number; y: number };
  onNavigate: (page: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="selection-popup" style={{ left: position.x, top: position.y }} role="dialog" aria-label="Giải thích đoạn đã chọn">
      <div className="popup-header"><span className="assistant-mark">AI</span><strong>AI Tutor</strong><button onClick={onClose} aria-label="Đóng">×</button></div>
      {loading ? <div className="popup-loading"><i /><span /><span /></div> : answer && <><p>{answer.text}</p><div className="popup-source"><CitationBadge citation={answer.citations[0]} onNavigate={onNavigate} /><span>{answer.confidence}% khớp</span></div></>}
    </div>
  );
}
