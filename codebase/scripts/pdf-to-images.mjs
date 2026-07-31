// Build-time tool (not run at server runtime): rasterizes the original
// hackathon slide PDFs into per-page PNGs under codebase/assets/, so the
// student-facing viewer can show the real slide instead of a text summary.
// Usage: node pdf-to-images.mjs
import { pdf } from "pdf-to-img";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const jobs = [
    { pdfPath: path.join(repoRoot, "data", "vlearn-pack", "slides", "d1-slide-hackathon.pdf"), outDir: path.join(repoRoot, "codebase", "assets", "d1") },
    { pdfPath: path.join(repoRoot, "data", "vlearn-pack", "slides", "d2-slide-hackathon.pdf"), outDir: path.join(repoRoot, "codebase", "assets", "d2") }
];

for (const job of jobs) {
    fs.mkdirSync(job.outDir, { recursive: true });
    console.log(`Rendering ${job.pdfPath} -> ${job.outDir}`);
    const document = await pdf(job.pdfPath, { scale: 2 });
    let page = 0;
    for await (const image of document) {
        page++;
        const outPath = path.join(job.outDir, `page-${String(page).padStart(3, "0")}.png`);
        fs.writeFileSync(outPath, image);
    }
    console.log(`  -> ${page} pages written`);
}
