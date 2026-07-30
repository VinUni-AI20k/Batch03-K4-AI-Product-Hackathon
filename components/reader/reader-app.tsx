"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { CourseMaterials } from "./course-materials";
import { MockPdf } from "./mock-pdf";
import { SmartTutor } from "./smart-tutor";

const TOTAL_PAGES = 44;

export function ReaderApp() {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [materialsOpen, setMaterialsOpen] = useState(true);
  const [tutorOpen, setTutorOpen] = useState(true);
  const [mode, setMode] = useState<"read" | "pen" | "highlight">("read");
  const [moreTools, setMoreTools] = useState(false);

  function navigate(nextPage: number) {
    setPage(Math.min(TOTAL_PAGES, Math.max(1, nextPage)));
  }

  return (
    <div className="reader-app">
      <header className="reader-header">
        <Link href="/course/comp2010" className="reader-icon-button" title="Quay lại">
          <Icon name="chevronLeft" className="size-4" />
        </Link>
        <Logo />
        <div className="h-8 w-px bg-slate-200" />
        <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#cdddea] bg-[#f5f9fc] text-[#12568f]">
          <Icon name="bookOpen" className="size-[18px]" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-black text-[#27364d]">day05-ai-product-thinking-requirements.pdf</h1>
          <p className="truncate text-[10px] text-[#7087a1]">COMP2010 · Tài liệu demo cục bộ</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="header-tool">VI</button>
          <button className="header-tool"><Icon name="moon" className="size-4" /></button>
        </div>
      </header>

      <div className={`reader-workspace ${materialsOpen ? "has-materials" : ""} ${tutorOpen ? "has-tutor" : ""}`}>
        <CourseMaterials open={materialsOpen} activeMaterial="D05-S01" onClose={() => setMaterialsOpen(false)} />

        <main className="pdf-workspace">
          <div className="pdf-toolbar">
            <div className="flex gap-1">
              {([
                ["read", "Đọc", "target"],
                ["pen", "Bút", "pen"],
                ["highlight", "Highlight", "highlighter"],
              ] as const).map(([value, label, icon]) => (
                <button key={value} onClick={() => setMode(value)} className={`toolbar-pill ${mode === value ? "toolbar-active" : ""}`}>
                  <Icon name={icon} className="size-4" />{label}
                </button>
              ))}
              <div className="relative">
                <button className="reader-icon-button" title="Công cụ bổ sung" onClick={() => setMoreTools(!moreTools)}><Icon name="plus" className="size-4" /></button>
                {moreTools && (
                  <div className="absolute left-0 top-10 z-20 flex gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {["Khoanh", "Text", "Ảnh", "Tẩy"].map((tool) => <button key={tool} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-500">{tool}</button>)}
                  </div>
                )}
              </div>
            </div>

            <div className="toolbar-divider" />
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
              <button className="reader-icon-button !size-7" onClick={() => setZoom(Math.max(60, zoom - 10))}><Icon name="minus" className="size-3" /></button>
              <button className="w-12 text-[11px] font-bold text-[#536b84]" onClick={() => setZoom(100)}>{zoom}%</button>
              <button className="reader-icon-button !size-7" onClick={() => setZoom(Math.min(140, zoom + 10))}><Icon name="plus" className="size-3" /></button>
            </div>
            <div className="toolbar-divider" />
            <button className="reader-icon-button" title="Thêm trang note"><Icon name="plus" className="size-4" /></button>
            <button className="reader-icon-button" title="Hoàn tác"><Icon name="history" className="size-4" /></button>
          </div>

          {!materialsOpen && (
            <button className="reader-edge-button left-0" onClick={() => setMaterialsOpen(true)} title="Hiện học liệu">
              <Icon name="chevronRight" className="size-5" />
            </button>
          )}
          {!tutorOpen && (
            <button className="reader-edge-button right-0" onClick={() => setTutorOpen(true)} title="Hiện Đi Đúng Trang">
              <Icon name="bot" className="size-5" />
            </button>
          )}

          <div className="pdf-scroll" style={{ ["--reader-zoom" as string]: zoom / 100 }}>
            <div className="pdf-zoom-layer"><MockPdf page={page} total={TOTAL_PAGES} /></div>
          </div>

          <footer className="reader-pagination">
            <button className="reader-icon-button" disabled={page === 1} onClick={() => navigate(page - 1)}><Icon name="chevronLeft" className="size-4" /></button>
            <span className="text-xs text-[#607994]">Trang <b className="text-[#123f6f]">{page}</b> / {TOTAL_PAGES}</span>
            <button className="reader-icon-button" disabled={page === TOTAL_PAGES} onClick={() => navigate(page + 1)}><Icon name="chevronRight" className="size-4" /></button>
          </footer>
        </main>

        <SmartTutor open={tutorOpen} currentPage={page} totalPages={TOTAL_PAGES} onClose={() => setTutorOpen(false)} onNavigate={navigate} />

        {materialsOpen && <button className="panel-collapse materials-collapse" onClick={() => setMaterialsOpen(false)} title="Thu gọn học liệu"><Icon name="chevronLeft" className="size-5" /></button>}
        {tutorOpen && <button className="panel-collapse tutor-collapse" onClick={() => setTutorOpen(false)} title="Thu gọn Tutor"><Icon name="chevronRight" className="size-5" /></button>}
      </div>
    </div>
  );
}
