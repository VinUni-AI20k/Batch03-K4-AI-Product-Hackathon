"use client";

import { useRef, useState } from "react";
import { explainSelection } from "../services/mockApi";
import type { Lecture, TutorAnswer } from "../types";
import { slideContent } from "../data/mockData";
import SelectionTutorPopup from "./SelectionTutorPopup";
import SlideToolbar from "./SlideToolbar";

export default function SlideViewer({ lecture, page, onPageChange }: { lecture?: Lecture; page: number; onPageChange: (page: number) => void }) {
  const [zoom, setZoom] = useState(100);
  const [selection, setSelection] = useState<{ answer?: TutorAnswer; loading: boolean; position: { x: number; y: number } } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = lecture?.pageCount ?? 1;
  const content = slideContent[(page - 1) % slideContent.length];

  const handleSelection = async () => {
    const selectedText = window.getSelection()?.toString().trim() ?? "";
    if (selectedText.length < 3 || !stageRef.current) return;
    const range = window.getSelection()?.rangeCount ? window.getSelection()?.getRangeAt(0) : null;
    const rect = range?.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();
    const position = {
      x: Math.max(16, Math.min((rect?.left ?? stageRect.left) - stageRect.left, stageRect.width - 350)),
      y: Math.max(16, (rect?.bottom ?? stageRect.top) - stageRect.top + 10),
    };
    setSelection({ loading: true, position });
    const answer = await explainSelection(selectedText, page);
    setSelection({ loading: false, answer, position });
  };

  if (!lecture) return <main className="viewer empty-viewer"><div><span>▱</span><h2>Chọn một tài liệu để bắt đầu</h2><p>Slide và transcript sẽ xuất hiện tại đây.</p></div></main>;
  return (
    <main className="viewer">
      <header className="viewer-header"><div><span className="breadcrumb">Bài giảng <b>/</b> {lecture.name}</span><strong>{lecture.name.replace(/\.(pdf|pptx)$/i, "")}</strong></div><button className="viewer-action">⋯</button></header>
      {lecture.status === "processing" ? (
        <div className="conversion-state"><div className="conversion-visual"><span>↻</span></div><h2>Đang chuyển đổi để xem trước</h2><p>PowerPoint đang được xử lý. Bạn vẫn có thể chọn tài liệu khác trong lúc chờ.</p><div className="progress-track"><i /></div><small>Khoảng 1–2 phút</small></div>
      ) : lecture.status === "error" ? (
        <div className="conversion-state error-view"><div className="conversion-visual">!</div><h2>Không thể xử lý tài liệu</h2><p>File có thể bị lỗi hoặc được bảo vệ bằng mật khẩu.</p><button>Thử tải lại</button></div>
      ) : (
        <>
          <div className="slide-stage" ref={stageRef} onMouseUp={handleSelection}>
            <div className="slide-paper" style={{ transform: `scale(${zoom / 100})` }}>
              <div className="slide-accent" />
              <div className="slide-number">{String(page).padStart(2, "0")}</div>
              <span className="slide-eyebrow">{content.eyebrow}</span>
              <h1>{content.title}</h1>
              <p>{content.body}</p>
              <div className="slide-note"><span>✦</span>{content.note}</div>
              <footer><strong>VLearn</strong><span>AI Thực Chiến</span></footer>
            </div>
            {selection && <SelectionTutorPopup {...selection} onNavigate={(targetPage) => { onPageChange(targetPage); setSelection(null); }} onClose={() => setSelection(null)} />}
          </div>
          <SlideToolbar page={page} total={total} zoom={zoom} onPageChange={(nextPage) => onPageChange(Math.max(1, Math.min(total, nextPage || 1)))} onZoomChange={(nextZoom) => setZoom(Math.max(70, Math.min(130, nextZoom)))} />
        </>
      )}
    </main>
  );
}
