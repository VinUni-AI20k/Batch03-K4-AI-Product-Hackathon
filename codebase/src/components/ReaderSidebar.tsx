"use client";

import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles
} from "lucide-react";
import { DayCurriculum, MaterialItem } from "@/types/vlearn";

interface ReaderSidebarProps {
  curriculum: DayCurriculum[];
  selectedMaterialId: string;
  onSelectMaterial: (material: MaterialItem) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function ReaderSidebar({
  curriculum,
  selectedMaterialId,
  onSelectMaterial,
  isOpenMobile = false,
  onCloseMobile
}: ReaderSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    Lecture_material_ms203mb1_squf06: true, // Day 1 expanded by default
    Lecture_material_ms203vsq_ob7vqp: true  // Day 2
  });

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const filteredCurriculum = curriculum.map(day => {
    if (!searchQuery) return day;
    const matchingItems = day.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...day, items: matchingItems };
  }).filter(day => day.items.length > 0 || day.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {/* Overlay for mobile view */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed bottom-0 top-14 z-40 flex w-[320px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header: Search & Course info */}
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Khoá 3 + 4 Phase 1
            </h2>
            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-[#124f8c] dark:bg-sky-950 dark:text-sky-400">
              COMP2010
            </span>
          </div>

          {/* Search box */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học, tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#124f8c] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Curriculum Days & Materials List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredCurriculum.map((day) => {
            const isExpanded = expandedDays[day.id] ?? true;

            return (
              <div
                key={day.id}
                className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition-colors dark:border-slate-800/80 dark:bg-slate-950/40"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.id)}
                  className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {day.title}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      · {day.items.length} tài liệu
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    published
                  </span>
                </button>

                {/* Day Materials Items */}
                {isExpanded && (
                  <div className="space-y-1 px-2 pb-2">
                    {day.items.map((item) => {
                      const isSelected = item.id === selectedMaterialId;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectMaterial(item);
                            if (onCloseMobile) onCloseMobile();
                          }}
                          className={`flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left transition-all ${
                            isSelected
                              ? "bg-white text-[#124f8c] shadow-sm ring-1 ring-[#124f8c]/20 dark:bg-slate-800 dark:text-sky-400 dark:ring-sky-500/30"
                              : "text-slate-700 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                            isSelected
                              ? "bg-[#124f8c]/10 text-[#124f8c] dark:bg-sky-500/20 dark:text-sky-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }`}>
                            <FileText className="h-3.5 w-3.5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-semibold leading-tight">
                              {item.title}
                            </p>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                              <span>{item.page_count ? `${item.page_count} trang` : 'PDF'}</span>
                              {isSelected && (
                                <span className="flex items-center gap-1 font-semibold text-[#124f8c] dark:text-sky-400">
                                  Đang xem
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Tiến độ bài học
            </span>
            <span className="font-bold text-[#124f8c] dark:text-sky-400">1 / 12 (8%)</span>
          </div>
        </div>
      </aside>
    </>
  );
}
