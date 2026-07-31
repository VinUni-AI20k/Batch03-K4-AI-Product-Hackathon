import { useRef } from "react";
import { Icon } from "./Icons";

export default function DocumentWelcome({
  decks,
  onOpenDeck,
  onUpload,
  isUploading,
  uploadError
}) {
  const fileInputRef = useRef(null);
  const uploadedDecks = decks.filter((deck) => deck.uploaded);

  return (
    <main className="flex min-h-0 flex-1 bg-[#0B0F1A] p-5">
      <section className="welcome-grid relative flex min-h-0 flex-1 items-center justify-center overflow-y-auto rounded-2xl border border-white/[0.075] bg-[#111722] px-8 py-10 shadow-panel">
        <div className="relative z-10 w-full max-w-[820px]">
          <div className="mx-auto max-w-[640px] text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-950/40">
              <Icon name="book" className="h-7 w-7" />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              VLearn Context-Aware AI Tutor
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Học trực tiếp trên tài liệu của nhóm
            </h1>
            <p className="mx-auto mt-3 max-w-[560px] text-sm leading-6 text-slate-400">
              Thêm PDF, cuộn để đọc từng trang và bôi đen bất kỳ đoạn nào bạn
              chưa hiểu. AI Tutor sẽ giải thích theo đúng ngữ cảnh tài liệu và
              tạo câu hỏi ngắn giúp bạn tự kiểm tra.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-[720px] grid-cols-3 gap-3">
            {[
              ["01", "Thêm tài liệu", "Chọn PDF bài học hoặc tài liệu của nhóm."],
              ["02", "Bôi đen để hỏi", "Chọn đoạn cần làm rõ ngay trên trang."],
              ["03", "Kiểm tra nhanh", "Làm Micro-Quiz và xem lại phần còn hổng."]
            ].map(([number, title, caption]) => (
              <div
                key={number}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <span className="text-[10px] font-bold tracking-[0.18em] text-blue-400">
                  {number}
                </span>
                <h2 className="mt-2 text-sm font-semibold text-slate-100">
                  {title}
                </h2>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                  {caption}
                </p>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
              event.target.value = "";
            }}
          />

          <div className="mx-auto mt-5 max-w-[720px] rounded-2xl border border-dashed border-blue-400/25 bg-blue-500/[0.045] p-5 text-center">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span className="text-lg leading-none">＋</span>
              {isUploading
                ? "Đang tải tài liệu…"
                : "Thêm tài liệu PDF của nhóm"}
            </button>
            <p className="mt-2 text-[11px] text-slate-500">
              Chỉ nhận file PDF, dung lượng tối đa 30 MB
            </p>
            {uploadError && (
              <p className="mt-2 text-xs text-red-300">{uploadError}</p>
            )}
          </div>

          {uploadedDecks.length > 0 && (
            <div className="mx-auto mt-5 max-w-[720px]">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Tài liệu nhóm đã tải lên
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {uploadedDecks.map((deck) => (
                  <button
                    key={deck.id}
                    type="button"
                    onClick={() => onOpenDeck(deck.id)}
                    className="rounded-lg border border-blue-400/15 bg-blue-500/[0.06] px-4 py-2 text-xs font-medium text-blue-100 transition hover:border-blue-400/35 hover:bg-blue-500/10"
                  >
                    {deck.title}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
