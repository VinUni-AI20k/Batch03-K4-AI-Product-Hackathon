"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initialLectures, initialMessages } from "../data/mockData";
import { uploadLecture } from "../services/mockApi";
import type { ChatMessageData, Lecture } from "../types";
import Sidebar from "./Sidebar";
import SlideViewer from "./SlideViewer";
import TutorPanel from "./TutorPanel";

export default function TutorWorkspace() {
  const [documents, setDocuments] = useState<Lecture[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Lecture>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string>();
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isTutorPanelOpen, setIsTutorPanelOpen] = useState(true);
  const [hasUploadedDocument, setHasUploadedDocument] = useState(false);
  const objectUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDocuments(initialLectures);
      setIsLoading(false);
    }, 500);
    const objectUrls = objectUrlsRef.current;
    return () => {
      window.clearTimeout(timer);
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const replaceDocument = (updated: Lecture) => {
    setDocuments((current) => current.map((document) => document.id === updated.id ? updated : document));
    setSelectedDocument((current) => current?.id === updated.id ? updated : current);
  };

  const handleUpload = async (file: File) => {
    setUploadError(undefined);
    if (!/\.(pdf|pptx)$/i.test(file.name)) {
      setUploadError("Định dạng chưa hỗ trợ. Hãy chọn file PDF hoặc PPTX.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File vượt quá giới hạn 50 MB.");
      return;
    }

    const id = `document-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileUrl = URL.createObjectURL(file);
    objectUrlsRef.current.add(fileUrl);
    const fileType = file.name.toLowerCase().endsWith(".pptx") ? "pptx" : "pdf";
    const pending: Lecture = {
      id,
      name: file.name,
      uploadedAt: "Đang tải lên…",
      status: "uploading",
      fileType,
      file,
      fileUrl,
      progress: 40,
    };

    setHasUploadedDocument(true);
    setDocuments((current) => [pending, ...current]);
    setSelectedDocument(pending);
    setCurrentPage(1);

    try {
      const uploaded = await uploadLecture(file, id, fileUrl);
      replaceDocument(uploaded);
    } catch {
      replaceDocument({ ...pending, status: "error", uploadedAt: "Vừa xong" });
      setUploadError("Upload thất bại. Vui lòng thử lại.");
    }
  };

  const selectDocument = (document: Lecture) => {
    setSelectedDocument(document);
    setCurrentPage(1);
  };

  const updatePageCount = useCallback((id: string, pageCount: number) => {
    setDocuments((current) => current.map((document) => document.id === id ? { ...document, pageCount, status: "ready" } : document));
    setSelectedDocument((current) => current?.id === id ? { ...current, pageCount, status: "ready" } : current);
  }, []);

  const markDocumentError = useCallback((id: string) => {
    setDocuments((current) => current.map((document) => document.id === id ? { ...document, status: "error", pageCount: undefined } : document));
    setSelectedDocument((current) => current?.id === id ? { ...current, status: "error", pageCount: undefined } : current);
  }, []);

  const deleteDocument = (id: string) => {
    const target = documents.find((document) => document.id === id);
    if (target?.fileUrl) {
      URL.revokeObjectURL(target.fileUrl);
      objectUrlsRef.current.delete(target.fileUrl);
    }
    const remaining = documents.filter((document) => document.id !== id);
    setDocuments(remaining);
    if (selectedDocument?.id === id) {
      setSelectedDocument(remaining[0]);
      setCurrentPage(1);
    }
  };

  const shellClasses = [
    "app-shell",
    isLeftSidebarOpen ? "left-open" : "left-closed",
    isTutorPanelOpen ? "tutor-open" : "tutor-closed",
  ].join(" ");

  return (
    <div className={shellClasses}>
      <Sidebar
        lectures={documents}
        activeId={selectedDocument?.id}
        isLoading={isLoading}
        isOpen={isLeftSidebarOpen}
        uploadError={uploadError}
        onUpload={handleUpload}
        onSelect={selectDocument}
        onDelete={deleteDocument}
        onToggle={() => setIsLeftSidebarOpen(false)}
      />
      {!isLeftSidebarOpen && (
        <button className="panel-reopen left-reopen" onClick={() => setIsLeftSidebarOpen(true)} aria-label="Mở danh sách tài liệu" title="Mở danh sách tài liệu">›</button>
      )}
      <SlideViewer
        key={selectedDocument ? `${selectedDocument.id}-${selectedDocument.fileUrl ?? "mock"}` : "default"}
        lecture={selectedDocument}
        page={currentPage}
        showDefault={!hasUploadedDocument && !selectedDocument}
        onPageChange={setCurrentPage}
        onDocumentLoaded={updatePageCount}
        onDocumentError={markDocumentError}
      />
      <TutorPanel
        lecture={selectedDocument}
        page={currentPage}
        messages={messages}
        setMessages={setMessages}
        isOpen={isTutorPanelOpen}
        onToggle={() => setIsTutorPanelOpen(false)}
        onNavigate={(targetPage) => setCurrentPage(Math.max(1, Math.min(selectedDocument?.pageCount ?? 1, targetPage)))}
      />
      {!isTutorPanelOpen && (
        <button className="panel-reopen tutor-reopen" onClick={() => setIsTutorPanelOpen(true)} aria-label="Mở AI Tutor" title="Mở AI Tutor">‹</button>
      )}
    </div>
  );
}
