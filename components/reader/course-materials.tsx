"use client";

import { courseDays } from "@/data/mock-course";
import { Icon } from "@/components/icons";

export function CourseMaterials({
  open,
  activeMaterial,
  onClose,
}: {
  open: boolean;
  activeMaterial: string;
  onClose: () => void;
}) {
  return (
    <aside className={`materials-panel ${open ? "materials-open" : ""}`}>
      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
        <div className="dashboard-icon !rounded-xl !p-2"><Icon name="bookOpen" className="size-5" /></div>
        <div>
          <h2 className="text-sm font-black text-slate-950">Học liệu môn học</h2>
          <p className="text-[11px] text-slate-500">Chương, slide và tài liệu mock</p>
        </div>
        <button className="ml-auto grid size-8 place-items-center rounded-lg text-slate-500 lg:hidden" onClick={onClose} aria-label="Đóng học liệu">
          <Icon name="x" className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          {courseDays.map((day) => {
            const active = day.materials.some((material) => material.id === activeMaterial);
            return (
              <section key={day.day} className={`rounded-2xl border ${active ? "border-[#8db4d6] bg-[#edf5fb]" : "border-slate-200 bg-[#f8fafc]"}`}>
                <div className="flex min-h-[62px] items-center gap-3 px-3">
                  <Icon name="target" className="size-4 text-[#12568f]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Day{String(day.day).padStart(2, "0")}</p>
                    <p className="text-[11px] font-semibold uppercase text-[#8ea2bd]">{day.materials.length} tài liệu · published</p>
                  </div>
                  {active && <span className="rounded-full bg-[#d7e7f4] px-2 py-1 text-[9px] font-black text-[#12568f]">STUDYING</span>}
                  <Icon name={active ? "chevronUp" : "chevronDown"} className="size-4 text-[#8ba1bb]" />
                </div>
                {active && (
                  <div className="space-y-2 border-t border-[#c9dbe9] p-2">
                    {day.materials.map((material) => (
                      <button key={material.id} className={`flex w-full items-center gap-2 rounded-xl border bg-white p-3 text-left ${material.id === activeMaterial ? "border-[#9cbcdc] shadow-sm ring-l-4" : "border-slate-200"}`}>
                        <Icon name="target" className="size-4 shrink-0 text-[#12568f]" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-[#164873]">{material.name}</span>
                          <span className="mt-1 block text-[11px] text-[#8da1bb]">{material.pages} trang</span>
                        </span>
                        {material.id === activeMaterial && <span className="ml-auto grid size-4 place-items-center rounded-full border border-[#12568f] text-[#12568f]"><Icon name="check" className="size-2.5" /></span>}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
