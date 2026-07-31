"use client";

import { useState } from "react";
import type { Lecture } from "../types";
import UploadLecture from "./UploadLecture";

const statusLabels = {
  ready: "Sẵn sàng",
  processing: "Đang chuyển đổi để xem trước",
  error: "Xử lý thất bại",
  uploading: "Đang tải lên",
};

export default function Sidebar({ lectures, activeId, isLoading, isOpen, uploadError, onUpload, onSelect, onDelete, onToggle }: {
  lectures: Lecture[];
  activeId?: string;
  isLoading: boolean;
  isOpen: boolean;
  uploadError?: string;
  onUpload: (file: File) => void;
  onSelect: (lecture: Lecture) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isUploading = lectures.some((lecture) => lecture.status === "uploading");
  return (
    <aside className={`sidebar ${isOpen ? "is-open" : "is-closed"}`} aria-hidden={!isOpen}>
      <header className="brand-row">
        <div className="brand-mark">V</div>
        <div><strong>VLearn</strong><span>AI learning space</span></div>
        <button className="icon-button sidebar-toggle" onClick={onToggle} aria-label="Thu gọn danh sách tài liệu" title="Thu gọn danh sách tài liệu">‹</button>
      </header>
      <div className="sidebar-body">
        <UploadLecture onUpload={onUpload} disabled={isUploading} />
        {uploadError && <div className="inline-error"><span>!</span>{uploadError}</div>}
        <div className="list-heading"><span>TÀI LIỆU CỦA BẠN</span><em>{lectures.length}</em></div>
        <div className="lecture-list">
          {isLoading && Array.from({ length: 4 }).map((_, index) => <div className="lecture-skeleton" key={index}><i /><span /><small /></div>)}
          {!isLoading && lectures.length === 0 && (
            <div className="empty-state"><div>▱</div><strong>Chưa có bài giảng</strong><p>Upload file đầu tiên để bắt đầu học cùng AI Tutor.</p></div>
          )}
          {!isLoading && lectures.map((lecture) => {
            const isActive = lecture.id === activeId;
            return (
              <article className={`lecture-item ${isActive ? "active" : ""}`} key={lecture.id}>
                <button className="lecture-main" onClick={() => onSelect(lecture)} disabled={lecture.status === "uploading"}>
                  <span className={`file-icon ${lecture.fileType}`}><b>{lecture.fileType === "pdf" ? "PDF" : "PPT"}</b></span>
                  <span className="lecture-copy">
                    <strong title={lecture.name}>{lecture.name}</strong>
                    <small>{lecture.uploadedAt}{lecture.pageCount ? ` · ${lecture.pageCount} trang` : ""}</small>
                    <span className={`status ${lecture.status}`}><i />{statusLabels[lecture.status]}</span>
                  </span>
                </button>
                <button className="more-button" aria-label={`Mở menu cho ${lecture.name}`} onClick={() => setOpenMenu(openMenu === lecture.id ? null : lecture.id)}>•••</button>
                {openMenu === lecture.id && (
                  <div className="file-menu">
                    <button onClick={() => { onSelect(lecture); setOpenMenu(null); }}>Mở tài liệu</button>
                    <button className="danger" onClick={() => { onDelete(lecture.id); setOpenMenu(null); }}>Xóa tài liệu</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <footer className="sidebar-footer"><div className="avatar">NH</div><div><strong>Nguyễn Hoàng</strong><span>Học viên</span></div></footer>
    </aside>
  );
}
