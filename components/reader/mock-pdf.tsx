import { getSlideContent } from "@/data/mock-course";

export function MockPdf({ page, total }: { page: number; total: number }) {
  const slide = getSlideContent(page);
  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-8">
      <div className="mock-pdf-page">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#124f8c]" />
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-[#d6222f]" />
        <div className="relative z-10 flex h-full flex-col p-[7%]">
          <p className="text-[clamp(8px,1vw,12px)] font-black uppercase tracking-[.2em] text-[#d6222f]">{slide.eyebrow}</p>
          <div className="my-auto max-w-[78%]">
            <p className="mb-3 text-[clamp(9px,1vw,13px)] font-bold uppercase tracking-[.16em] text-[#537698]">VLearn · AI Thực Chiến</p>
            <h2 className="text-[clamp(26px,4vw,54px)] font-black leading-[1.08] tracking-[-.035em] text-[#123f6f]">{slide.title}</h2>
            <p className="mt-5 text-[clamp(12px,1.55vw,19px)] leading-relaxed text-[#5f7488]">{slide.body}</p>
          </div>
          <div className="flex justify-between text-[clamp(8px,1vw,11px)] font-semibold text-[#8aa0b4]">
            <span>day05-ai-product-thinking-requirements.pdf</span>
            <span>Trang {page} / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
