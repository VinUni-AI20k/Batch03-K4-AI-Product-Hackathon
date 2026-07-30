"use client";

import {
  CheckCircle2,
  CircleHelp,
  GitBranch,
  Lightbulb,
  Target,
  Workflow,
} from "lucide-react";
import type { ReviewStatus } from "@/types/learning-trace";

interface KnowledgeMindmapProps {
  statuses: Record<string, ReviewStatus>;
}

export function KnowledgeMindmap({ statuses }: KnowledgeMindmapProps) {
  const automationStatus = statuses["augment-vs-automate"] ?? "suggested";
  const impactStatus = statuses["estimate-impact"] ?? "suggested";
  const automationConfirmed = automationStatus === "confirmed";
  const impactConfirmed = impactStatus === "confirmed";

  return (
    <section aria-labelledby="mindmap-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#2e5596]">
            Liên kết kiến thức
          </p>
          <h2
            id="mindmap-heading"
            className="mt-1 text-xl font-extrabold tracking-[-0.025em] text-[#0b1730]"
          >
            Bản đồ kiến thức
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#71809a]">
            Hai cách xem dùng chung một learning trace và cập nhật đồng bộ.
          </p>
        </div>
        <span className="hidden rounded-full bg-[#edf3fb] px-3 py-1.5 text-xs font-bold text-[#2e5596] sm:inline-flex">
          3 nhánh chính
        </span>
      </div>

      <div className="mindmap-canvas mt-5 hidden overflow-hidden rounded-[20px] border border-[#dce4ee] bg-[#f8fbfe] px-5 py-8 md:block">
        <div className="mindmap-root">
          <span className="mindmap-root-icon">
            <GitBranch aria-hidden="true" className="h-5 w-5" />
          </span>
          <span>
            <small>DAY 2</small>
            <strong>Xác định bài toán cho AI</strong>
          </span>
        </div>

        <div className="mindmap-branches">
          <div className="mindmap-branch">
            <div className="mindmap-topic mindmap-topic-blue">
              <Target aria-hidden="true" className="h-5 w-5" />
              <span>
                <small>Chủ đề 01</small>
                <strong>Problem Statement</strong>
              </span>
            </div>
            <div className="mindmap-child mindmap-child-neutral">
              User · Pain · Outcome
            </div>
          </div>

          <div className="mindmap-branch">
            <div className="mindmap-topic mindmap-topic-red">
              <Workflow aria-hidden="true" className="h-5 w-5" />
              <span>
                <small>Chủ đề 02</small>
                <strong>Impact–Effort</strong>
              </span>
            </div>
            <div
              className={`mindmap-child ${
                impactConfirmed
                  ? "mindmap-child-confirmed"
                  : "mindmap-child-review"
              }`}
            >
              {impactConfirmed ? (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              ) : (
                <CircleHelp aria-hidden="true" className="h-4 w-4" />
              )}
              <span>
                Ước lượng impact
                <small>
                  {impactConfirmed ? "Đã xác nhận" : "Cần xác nhận"}
                </small>
              </span>
            </div>
          </div>

          <div className="mindmap-branch">
            <div className="mindmap-topic mindmap-topic-blue">
              <Lightbulb aria-hidden="true" className="h-5 w-5" />
              <span>
                <small>Chủ đề 03</small>
                <strong>Automation</strong>
              </span>
            </div>
            <div
              className={`mindmap-child ${
                automationConfirmed
                  ? "mindmap-child-confirmed"
                  : "mindmap-child-review"
              }`}
              data-testid="automation-mindmap-node"
            >
              {automationConfirmed ? (
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              ) : (
                <CircleHelp aria-hidden="true" className="h-4 w-4" />
              )}
              <span>
                Augment vs Automate
                <small>
                  {automationConfirmed ? "Đã xác nhận" : "Cần xác nhận"}
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:hidden" aria-label="Bản đồ kiến thức dạng danh sách">
        {[
          {
            title: "Problem Statement",
            child: "User · Pain · Outcome",
            confirmed: true,
          },
          {
            title: "Impact–Effort",
            child: "Ước lượng impact",
            confirmed: impactConfirmed,
          },
          {
            title: "Automation",
            child: "Augment vs Automate",
            confirmed: automationConfirmed,
          },
        ].map((branch) => (
          <article
            key={branch.title}
            className="rounded-2xl border border-[#dce4ee] bg-white p-4"
          >
            <p className="text-sm font-extrabold text-[#10213d]">
              {branch.title}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-[#f4f7fb] px-3 py-2.5">
              <span className="text-sm text-[#566983]">{branch.child}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                  branch.confirmed
                    ? "bg-[#dff3eb] text-[#17775d]"
                    : "bg-[#fff0ca] text-[#9b6412]"
                }`}
              >
                {branch.confirmed ? "Đã xác nhận" : "Cần xác nhận"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
