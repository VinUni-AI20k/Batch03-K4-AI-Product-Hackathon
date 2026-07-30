"use client";

import { useState } from "react";
import { saveFeedback } from "../services/mockApi";

export default function FeedbackControls({ value, onChange }: { value?: "up" | "down"; onChange: (value: "up" | "down", note?: string) => void }) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const submit = async () => {
    await saveFeedback();
    onChange("down", note);
    setSaved(true);
  };
  return (
    <div className="feedback-wrap">
      <div className="feedback-row">
        <span>Câu trả lời này hữu ích?</span>
        <button className={value === "up" ? "active" : ""} aria-label="Hữu ích" onClick={() => onChange("up")}>👍</button>
        <button className={value === "down" ? "active" : ""} aria-label="Chưa hữu ích" onClick={() => { setSaved(false); onChange("down"); }}>👎</button>
      </div>
      {value === "down" && !saved && (
        <div className="feedback-form">
          <label htmlFor="feedback-note">Mình có thể cải thiện điều gì?</label>
          <textarea id="feedback-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ví dụ: citation chưa đúng trang…" />
          <button onClick={submit} disabled={!note.trim()}>Gửi góp ý</button>
        </div>
      )}
      {saved && <span className="feedback-thanks">Cảm ơn bạn — góp ý đã được ghi nhận.</span>}
    </div>
  );
}
