"use client";

import { useState } from "react";
import Link from "next/link";
import { courseDays } from "@/data/mock-course";
import { Header } from "./header";
import { Icon } from "./icons";

export function CoursePage() {
  const [openDay, setOpenDay] = useState(1);
  return (
    <div className="min-h-screen bg-[#eef4f8]">
      <Header />
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">VLearn · VinUni AI Thực Chiến</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">COMP2010 - Khoá 3 + 4 Phase 1</h1>
            <p className="mt-1 text-sm text-slate-500">1.074 học viên cùng lớp</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 rounded-full border border-[#cfe0ec] bg-white px-3 py-2 text-xs font-bold text-[#31516e] shadow-sm sm:flex">
              <span className="text-[#0c9e67]">✓</span>Đã đọc 0/6 ngày
              <span className="h-1.5 w-24 rounded-full bg-[#edf1f5]" />
              <span className="text-[#0c9e67]">0%</span>
            </div>
            <Link href="/course/comp2010/reader?slide=D05-S01" className="rounded-xl bg-[#12568f] px-5 py-2.5 text-sm font-black text-white shadow-sm">Bắt đầu đọc</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] space-y-4 p-4 sm:p-6 lg:p-8">
        {courseDays.map((day) => {
          const open = openDay === day.day;
          return (
            <section key={day.day} className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
              <button className="flex min-h-[104px] w-full items-center gap-4 p-6 text-left" onClick={() => setOpenDay(open ? 0 : day.day)}>
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f0f5f9] text-center">
                  <span><span className="block text-[9px] font-bold text-[#667d96]">DAY</span><b className="block text-xl leading-none text-[#193d65]">{String(day.day).padStart(2, "0")}</b></span>
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-base font-black">Day{String(day.day).padStart(2, "0")}</b>
                  <span className="mt-1 block text-xs text-[#527292]">Chưa hoàn thành ngày học · {day.materials.length} slide</span>
                </span>
                <Icon name={open ? "chevronUp" : "chevronDown"} className="size-5 text-[#89a3bd]" />
              </button>
              {open && (
                <div className="space-y-2 border-t border-slate-200 p-6 pt-4">
                  {day.materials.map((material) => (
                    <Link key={material.id} href={`/course/comp2010/reader?slide=${material.id}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-[#294d70] hover:border-[#9abbd6] hover:bg-[#f7fbfe]">
                      <Icon name="file" className="size-4" />{material.name}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
