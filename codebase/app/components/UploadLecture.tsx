"use client";

import { useRef } from "react";

export default function UploadLecture({ onUpload, disabled }: { onUpload: (file: File) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const chooseFile = () => inputRef.current?.click();
  return (
    <div className="upload-block">
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          event.currentTarget.value = "";
        }}
      />
      <button className="upload-button" onClick={chooseFile} disabled={disabled}>
        <span className="upload-icon">↑</span>
        <span><strong>{disabled ? "Đang tải lên…" : "Upload slide"}</strong><small>PDF hoặc PowerPoint · tối đa 50 MB</small></span>
      </button>
    </div>
  );
}
