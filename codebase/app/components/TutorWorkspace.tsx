"use client";

import { useEffect, useMemo, useState } from "react";
import { initialLectures, initialMessages } from "../data/mockData";
import { uploadLecture } from "../services/mockApi";
import type { ChatMessageData, Lecture } from "../types";
import Sidebar from "./Sidebar";
import SlideViewer from "./SlideViewer";
import TutorPanel from "./TutorPanel";

export default function TutorWorkspace() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadError, setUploadError] = useState<string>();
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLectures(initialLectures);
      setActiveId(initialLectures[0].id);
      setIsLoading(false);
    }, 650);
    return () => window.clearTimeout(timer);
  }, []);

  const activeLecture = useMemo(() => lectures.find((lecture) => lecture.id === activeId), [lectures, activeId]);
  const handleUpload = async (file: File) => {
    setUploadError(undefined);
    const isAccepted = /\.(pdf|pptx)$/i.test(file.name);
    if (!isAccepted) { setUploadError("Định dạng chưa hỗ trợ. Hãy chọn file PDF hoặc PPTX."); return; }
    if (file.size > 50 * 1024 * 1024) { setUploadError("File vượt quá giới hạn 50 MB."); return; }
    const temporary: Lecture = { id: `upload-${Date.now()}`, name: file.name, uploadedAt: "Vừa xong", status: "uploading", fileType: file.name.toLowerCase().endsWith(".pptx") ? "pptx" : "pdf", progress: 40 };
    setLectures((current) => [temporary, ...current]);
    try {
      const created = await uploadLecture(file);
      setLectures((current) => current.map((lecture) => lecture.id === temporary.id ? created : lecture));
      setActiveId(created.id);
      setPage(1);
    } catch {
      setLectures((current) => current.map((lecture) => lecture.id === temporary.id ? { ...lecture, status: "error" } : lecture));
      setUploadError("Upload thất bại. Vui lòng thử lại.");
    }
  };
  const selectLecture = (lecture: Lecture) => { setActiveId(lecture.id); setPage(1); };
  const deleteLecture = (id: string) => {
    setLectures((current) => {
      const next = current.filter((lecture) => lecture.id !== id);
      if (activeId === id) { setActiveId(next[0]?.id); setPage(1); }
      return next;
    });
  };

  return (
    <div className="app-shell">
      <Sidebar lectures={lectures} activeId={activeId} isLoading={isLoading} uploadError={uploadError} onUpload={handleUpload} onSelect={selectLecture} onDelete={deleteLecture} />
      <SlideViewer lecture={activeLecture} page={page} onPageChange={setPage} />
      <TutorPanel lecture={activeLecture} page={page} messages={messages} setMessages={setMessages} onNavigate={(targetPage) => setPage(Math.max(1, Math.min(activeLecture?.pageCount ?? 1, targetPage)))} />
    </div>
  );
}
