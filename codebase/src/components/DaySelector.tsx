"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { LearningDay, ReviewStatus } from "@/types/learning-trace";

interface DaySelectorProps {
  days: LearningDay[];
  activeDayId: string;
  statuses: Record<string, ReviewStatus>;
  onSelectDay: (dayId: string) => void;
}

export function DaySelector({
  days,
  activeDayId,
  statuses,
  onSelectDay,
}: DaySelectorProps) {
  return (
    <section className="border-b border-[#e1e7ef] bg-white px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#c83b3b]">
            Chọn ngày học
          </p>
          <h2 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-[#0b1730]">
            Learning Trace được nhóm theo ngày
          </h2>
        </div>
        <p className="text-xs font-semibold text-[#7a879b]">
          Note và mindmap luôn hiển thị cùng một ngày
        </p>
      </div>

      <div
        className="mt-4 grid gap-3 lg:grid-cols-3"
        role="group"
        aria-label="Danh sách ngày học"
      >
        {days.map((day) => {
          const isActive = day.id === activeDayId;
          const confirmedCount = day.reviewItems.filter(
            (item) => statuses[item.id] === "confirmed",
          ).length;
          const remainingCount = day.reviewItems.length - confirmedCount;

          return (
            <button
              key={day.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectDay(day.id)}
              className={`group relative flex min-h-[118px] items-center gap-4 overflow-hidden rounded-[18px] border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e5596] ${
                isActive
                  ? "border-[#89a8ce] bg-[#f5f8fc] shadow-[0_8px_22px_rgba(46,85,150,0.11)]"
                  : "border-[#dce4ee] bg-white hover:-translate-y-0.5 hover:border-[#b9cbe0] hover:shadow-[0_8px_20px_rgba(15,35,64,0.07)]"
              }`}
            >
              {isActive ? (
                <span className="absolute inset-x-0 top-0 h-[3px] bg-[#c83b3b]" />
              ) : null}
              <span
                className={`grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full transition-colors ${
                  isActive
                    ? "bg-[#e4edf8] text-[#214a84]"
                    : "bg-[#f1f4f8] text-[#536784] group-hover:bg-[#e9eff7]"
                }`}
              >
                <span className="text-center">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.08em]">
                    Day
                  </span>
                  <strong className="block text-[25px] leading-6 tracking-[-0.04em]">
                    {day.number}
                  </strong>
                </span>
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <strong className="text-base font-black text-[#10213d]">
                    {day.label}
                  </strong>
                  {isActive ? (
                    <span className="rounded-full bg-[#dfeaf7] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#2e5596]">
                      Đang xem
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block truncate text-xs font-semibold text-[#60728d]">
                  {day.title}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-[#8794a7]">
                  <span>{day.slideCount} slide</span>
                  <span aria-hidden="true">·</span>
                  <span>{day.topics.length} chủ đề</span>
                  <span aria-hidden="true">·</span>
                  {remainingCount > 0 ? (
                    <span className="text-[#a66610]">
                      {remainingCount} gợi ý cần xác nhận
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#17775d]">
                      <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                      Đã xác nhận
                    </span>
                  )}
                </span>
              </span>

              <ArrowRight
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  isActive ? "text-[#2e5596]" : "text-[#9aa6b7]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
