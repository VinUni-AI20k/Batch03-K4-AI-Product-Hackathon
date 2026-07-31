export type LabKind = "lab" | "presentation";

export type Lab = {
  slug: string;
  title: string;
  /** Shown under the title — the "goal" that the search box matches against. */
  goal: string;
  /** Free-form duration label, e.g. "4h" or "30 min". */
  duration: string;
  /** Relative freshness label as rendered by the source site, e.g. "Updated 1w". */
  updated: string;
  kind: LabKind;
  comingSoon?: boolean;
  /** Number of optional preparation tips; omitted when the lab has none. */
  tips?: number;
  /** Progress through the lab's steps — only meaningful for released labs. */
  step?: { current: number; total: number };
};

export type Day = {
  /** Day label as shown in the section heading. */
  label: string;
  labs: Lab[];
};

export const days: Day[] = [
  {
    label: "Day 1",
    labs: [
      {
        slug: "lab-01-nen-tang-llm-api",
        title: "Lab 01 — Nền tảng LLM API",
        goal: "Học viên hoàn thiện toàn bộ TODO trong template.py: API cơ bản, system prompt và token, streaming/retry, rồi ghép thành trợ lý CLI.",
        duration: "4h",
        updated: "Updated 1w",
        kind: "lab",
        tips: 5,
        step: { current: 1, total: 1 },
      },
    ],
  },
  {
    label: "Day 2",
    labs: [
      {
        slug: "lab-02-tim-dung-bai-toan-cho-ai",
        title: "Lab 02 — Tìm đúng bài toán cho AI",
        goal: "Tìm và kiểm chứng một bài toán thực tế, vẽ workflow, viết Problem Statement có metric và boundary, rồi chọn mức ứng dụng AI phù hợp.",
        duration: "4h",
        updated: "Updated 5d",
        kind: "lab",
        comingSoon: true,
        tips: 1,
      },
      {
        slug: "presentation-lab-02-tim-dung-bai-toan-cho-ai",
        title: "Presentation — Lab 02: Tìm đúng bài toán cho AI",
        goal: "Slide trực quan để Lab Coach trình bày Lab 02; không phải giáo án chính thức và cần đối chiếu theo từng lớp.",
        duration: "4h",
        updated: "Updated 4d",
        kind: "presentation",
        comingSoon: true,
      },
    ],
  },
  {
    label: "Day 3",
    labs: [
      {
        slug: "warm-up-chuan-bi-moi-truong-agent",
        title: "Warm-up — Chuẩn bị môi trường Agent",
        goal: "Cài đặt và kiểm tra môi trường trước khi vào Lab 03: khóa API, dependency và một lệnh chạy thử ngắn.",
        duration: "30 min",
        updated: "Updated 1w",
        kind: "lab",
        comingSoon: true,
      },
      {
        slug: "lab-03-chatbot-vs-react-agent",
        title: "Lab 03 — Chatbot vs ReAct Agent",
        goal: "So sánh chatbot một lượt với vòng lặp ReAct có tool: dựng cả hai, đo số bước và chi phí, rồi kết luận khi nào cần agent.",
        duration: "4h",
        updated: "Updated 3d",
        kind: "lab",
        tips: 3,
        step: { current: 1, total: 4 },
      },
      {
        slug: "presentation-lab-03-chatbot-vs-react-agent",
        title: "Presentation — Lab 03: Chatbot vs ReAct Agent",
        goal: "Slide trực quan để Lab Coach trình bày Lab 03; không phải giáo án chính thức và cần đối chiếu theo từng lớp.",
        duration: "4h",
        updated: "Updated 3d",
        kind: "presentation",
        comingSoon: true,
      },
    ],
  },
];

export const labBySlug = new Map(
  days.flatMap((day) => day.labs.map((lab) => [lab.slug, { ...lab, day: day.label }] as const)),
);
