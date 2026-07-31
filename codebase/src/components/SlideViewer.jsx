import { useEffect, useRef, useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { Icon } from "./Icons";

function SlideShell({ slide, children }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
          Chương 3
        </span>
        <span className="text-xs text-slate-500">Slide {slide.id} / 45</span>
      </div>
      <h1 className="mt-4 text-[28px] font-bold tracking-tight text-white">
        {slide.title}
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">{slide.learningObjective}</p>
      {children}
    </>
  );
}

function CouplingSlide({ slide }) {
  return (
    <SlideShell slide={slide}>
      <div className="mt-7 grid grid-cols-2 gap-4">
        <ComparisonCard
          tone="bad"
          title="Tight Coupling"
          description={slide.content.tightCoupling.definition}
          bullets={[
            "Phụ thuộc vào chi tiết triển khai",
            "Thay đổi dễ lan sang module khác",
            "Khó kiểm thử và triển khai riêng"
          ]}
        />
        <ComparisonCard
          tone="good"
          title="Loose Coupling"
          description={slide.content.looseCoupling.definition}
          bullets={[
            "Giao tiếp qua interface hoặc contract",
            "Giảm ảnh hưởng khi có thay đổi",
            "Dễ kiểm thử và triển khai độc lập"
          ]}
          highlighted
        />
      </div>

      <section className="mt-4 rounded-2xl border border-blue-500/15 bg-blue-500/[0.045] p-5">
        <h3 className="text-sm font-semibold text-blue-300">Cohesion</h3>
        <p className="mt-1.5 text-[13px] text-slate-400">
          Một module tốt nên có{" "}
          <strong className="text-blue-200">High Cohesion</strong>: các chức năng
          bên trong cùng phục vụ một trách nhiệm rõ ràng.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ["Low", "Nhiều trách nhiệm rời rạc", "text-red-300"],
            ["Medium", "Có liên quan nhưng chưa tập trung", "text-amber-300"],
            ["High", "Một trách nhiệm rõ ràng", "text-emerald-300"]
          ].map(([label, caption, color]) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.07] bg-[#0D131F] px-4 py-3"
            >
              <p className={`text-xs font-semibold ${color}`}>{label}</p>
              <p className="mt-1 text-[11px] text-slate-500">{caption}</p>
            </div>
          ))}
        </div>
      </section>
    </SlideShell>
  );
}

function ArchitectureDiagram({ services }) {
  return (
    <div className="mt-3 rounded-xl border border-white/[0.07] bg-[#0B101A] p-4">
      <div className="flex items-center justify-center gap-3">
        {services.map((service, index) => (
          <div key={service.id} className="contents">
            <div className="min-w-[130px] rounded-xl border border-blue-400/25 bg-blue-500/[0.08] px-3 py-3 text-center">
              <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-blue-400" />
              <p className="text-xs font-semibold text-slate-100">
                {service.name}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {service.responsibility}
              </p>
            </div>
            {index < services.length - 1 && (
              <div className="text-center text-blue-400">
                <span className="text-lg">⟷</span>
                <p className="text-[9px] uppercase tracking-wider text-slate-600">
                  API
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MicroservicesSlide({ slide }) {
  const rows = [
    ["Cấu trúc", "Một ứng dụng lớn", "Nhiều service nhỏ"],
    ["Phụ thuộc", "Tightly Coupled", "Loosely Coupled"],
    ["Triển khai", "Toàn bộ ứng dụng", "Theo từng service"],
    ["Lỗi", "Dễ ảnh hưởng toàn hệ thống", "Có thể cô lập theo service"]
  ];

  return (
    <SlideShell slide={slide}>
      <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="grid grid-cols-[150px_1fr_1fr] bg-[#101722] text-xs font-semibold">
          <div className="px-4 py-3 text-slate-500">Đặc điểm</div>
          <div className="border-l border-white/[0.06] bg-red-500/[0.08] px-4 py-3 text-red-200">
            Monolithic
          </div>
          <div className="border-l border-white/[0.06] bg-emerald-500/[0.08] px-4 py-3 text-emerald-200">
            Microservices
          </div>
        </div>
        {rows.map((row, index) => (
          <div
            key={row[0]}
            className={`grid grid-cols-[150px_1fr_1fr] text-[13px] ${
              index % 2 ? "bg-white/[0.025]" : "bg-[#0D131E]"
            }`}
          >
            <div className="px-4 py-3 font-medium text-slate-400">{row[0]}</div>
            <div className="border-l border-white/[0.06] px-4 py-3 text-slate-300">
              {row[1]}
            </div>
            <div className="border-l border-white/[0.06] px-4 py-3 text-slate-200">
              {row[2] === "Loosely Coupled" ? (
                <span className="rounded-full bg-amber-200 px-2.5 py-1 font-semibold text-slate-950">
                  {row[2]}
                </span>
              ) : (
                row[2]
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-r-xl border-y border-r border-amber-400/15 border-l-4 border-l-amber-400 bg-amber-500/[0.055] px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
          Khái niệm cốt lõi
        </p>
        <p className="mt-2 text-[13px] leading-6 text-slate-300">
          <mark className="rounded bg-amber-200 px-1.5 py-0.5 font-semibold text-slate-950">
            Microservices
          </mark>{" "}
          chia hệ thống theo năng lực nghiệp vụ. Mỗi service có thể phát triển và
          triển khai tương đối độc lập nhờ{" "}
          <strong className="text-emerald-300">Loose Coupling</strong>.
        </p>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Sơ đồ kiến trúc service
        </p>
        <ArchitectureDiagram services={slide.content.services} />
      </div>
    </SlideShell>
  );
}

export default function SlideViewer({
  slide,
  onAskSelection,
  onPrev,
  onNext,
  canPrev,
  canNext
}) {
  const contentRef = useRef(null);
  const [selection, setSelection] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, [slide.id]);

  function handleSelection() {
    const selected = window.getSelection();
    const text = selected?.toString().trim();
    if (!text || !selected.rangeCount || !contentRef.current) {
      setSelection(null);
      return;
    }

    const range = selected.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) return;

    const rect = range.getBoundingClientRect();
    const parentRect = contentRef.current.getBoundingClientRect();
    setSelection({
      text,
      left: Math.min(
        Math.max(rect.left - parentRect.left + rect.width / 2, 95),
        parentRect.width - 95
      ),
      top: rect.top - parentRect.top - 48
    });
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#0B0F1A] p-6">
      <div
        ref={contentRef}
        onMouseUp={handleSelection}
        className="slide-selection relative min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/[0.075] bg-[#121824] shadow-panel"
      >
        {selection && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onAskSelection(selection.text);
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="absolute z-30 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-3.5 py-2 text-xs font-semibold text-white shadow-xl shadow-fuchsia-950/40 transition hover:scale-[1.03]"
            style={{ left: selection.left, top: Math.max(selection.top, 8) }}
          >
            <Icon name="sparkles" className="h-4 w-4" />
            Hỏi AI Tutor
          </button>
        )}

        <div
          className="mx-auto max-w-[900px] origin-top p-8 transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100})`,
            width: `${10000 / zoom}%`
          }}
        >
          {slide.id === 5 ? (
            <CouplingSlide slide={slide} />
          ) : (
            <MicroservicesSlide slide={slide} />
          )}
        </div>
      </div>

      <div className="mt-4 grid h-10 grid-cols-3 items-center px-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            className="rounded-lg p-2 transition hover:bg-white/5 hover:text-white"
            onClick={() => setZoom((value) => Math.max(80, value - 10))}
            aria-label="Thu nhỏ"
          >
            <Icon name="zoomOut" className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-medium text-slate-400">
            {zoom}%
          </span>
          <button
            className="rounded-lg p-2 transition hover:bg-white/5 hover:text-white"
            onClick={() => setZoom((value) => Math.min(120, value + 10))}
            aria-label="Phóng to"
          >
            <Icon name="zoomIn" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span
            className={`h-1.5 rounded-full transition-all ${
              slide.id === 5 ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700"
            }`}
          />
          <span
            className={`h-1.5 rounded-full transition-all ${
              slide.id === 12 ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700"
            }`}
          />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
