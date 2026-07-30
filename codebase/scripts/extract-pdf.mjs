/**
 * Trích text từng trang của học liệu PDF ra JSON để API route dùng làm căn cứ.
 *
 *   node scripts/extract-pdf.mjs
 *
 * Chạy một lần rồi commit file JSON. Cố ý KHÔNG parse PDF lúc runtime:
 *  - serverless function không phải tải PDF mỗi request
 *  - căn cứ trở thành dữ liệu tĩnh, xác định được -> golden set chấm lại được
 *
 * Nguồn là 2 bộ slide bản hackathon trong data pack (KHÔNG phải bản gốc
 * day01-slide-blue-v0/v1 — bản đó không thuộc data pack được cấp). Số trang
 * ở đây là số trang bản rút gọn 29 trang mà học viên thấy trong app, không
 * phải số trang bản gốc trong chatlog — xem cp1/impact-table.md giới hạn #8.
 *
 * route.ts hiện chỉ dùng d1-pages.json (deck Day 1) — giữ đúng thiết kế
 * một-deck ban đầu. d2-pages.json được sinh sẵn cho việc mở rộng sau,
 * chưa wire vào route.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");
const OUT_DIR = resolve(import.meta.dirname, "..", "src", "data");

const DECKS = [
  { id: "d1", file: "d1-slide-hackathon.pdf", label: "Day 1 · AI & LLM Foundation" },
  { id: "d2", file: "d2-slide-hackathon.pdf", label: "Day 2 · Xác định bài toán cho AI" },
];

const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

async function extractOne(deck) {
  const src = resolve(ROOT, "data", "vlearn-pack", "slides", deck.file);
  const data = new Uint8Array(await readFile(src));
  const pdf = await getDocument({ data, useSystemFonts: true }).promise;

  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();

    const lines = new Map();
    for (const item of content.items) {
      if (!item.str?.trim()) continue;
      const y = Math.round(item.transform[5]);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y).push({ x: item.transform[4], str: item.str });
    }
    const text = [...lines.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map((i) => i.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean)
      .join("\n");

    pages.push({ page: n, text, chars: text.length });
  }

  const out = {
    source: deck.file,
    label: deck.label,
    extractedAt: new Date().toISOString(),
    totalPages: pdf.numPages,
    pages,
  };

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, `${deck.id}-pages.json`);
  await writeFile(outPath, JSON.stringify(out, null, 2), "utf8");

  const empty = pages.filter((p) => p.chars === 0).map((p) => p.page);
  console.log(`[${deck.id}] ${pdf.numPages} trang -> ${outPath}`);
  console.log(
    `[${deck.id}] ký tự: tổng ${pages.reduce((s, p) => s + p.chars, 0)}, median ${
      pages.map((p) => p.chars).sort((a, b) => a - b)[Math.floor(pages.length / 2)]
    }`
  );
  console.log(
    empty.length
      ? `[${deck.id}] ⚠️  ${empty.length} trang KHÔNG có text (khả năng là ảnh): ${empty.join(", ")}`
      : `[${deck.id}] mọi trang đều có text`
  );
}

for (const deck of DECKS) {
  await extractOne(deck);
}
