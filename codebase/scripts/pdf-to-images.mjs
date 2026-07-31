// Build-time tool: rasterizes the original hackathon slide PDFs into per-page PNGs 
// under codebase/assets/ and codebase/public/assets/, so both HTML and Next.js show real slide images.

import { pdf } from "pdf-to-img";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const jobs = [
    { 
        pdfPath: path.join(repoRoot, "data", "vlearn-pack", "slides", "d1-slide-hackathon.pdf"), 
        outDirs: [
            path.join(repoRoot, "codebase", "assets", "d1"),
            path.join(repoRoot, "codebase", "public", "assets", "d1")
        ] 
    },
    { 
        pdfPath: path.join(repoRoot, "data", "vlearn-pack", "slides", "d2-slide-hackathon.pdf"), 
        outDirs: [
            path.join(repoRoot, "codebase", "assets", "d2"),
            path.join(repoRoot, "codebase", "public", "assets", "d2")
        ] 
    }
];

for (const job of jobs) {
    for (const dir of job.outDirs) {
        fs.mkdirSync(dir, { recursive: true });
    }
    console.log(`Rendering ${job.pdfPath}...`);
    const document = await pdf(job.pdfPath, { scale: 2 });
    let page = 0;
    for await (const image of document) {
        page++;
        const filename = `page-${String(page).padStart(3, "0")}.png`;
        for (const dir of job.outDirs) {
            fs.writeFileSync(path.join(dir, filename), image);
        }
    }
    console.log(`  -> ${page} pages written to ${job.outDirs.length} output directories`);
}
