import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decideWithAI, loadDotEnv, loadKnowledgeBase } from "./ai-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data, null, 2));
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://localhost:${port}`);
  const safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(__dirname, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/api/health") {
      await loadDotEnv();
      await sendJson(response, 200, {
        ok: true,
        provider: process.env.OPENAI_API_KEY ? "openai" : process.env.GEMINI_API_KEY ? "gemini" : process.env.ALLOW_MOCK_AI === "1" ? "mock" : "missing_key"
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/ask") {
      const body = JSON.parse(await readBody(request));
      if (!body.question || typeof body.question !== "string") {
        await sendJson(response, 400, { error: "question is required" });
        return;
      }

      const startedAt = Date.now();
      const decision = await decideWithAI(body.question);
      await sendJson(response, 200, {
        ...decision,
        latency_ms: Date.now() - startedAt
      });
      return;
    }

    if (request.method === "GET") {
      await serveStatic(request, response);
      return;
    }

    response.writeHead(405);
    response.end("Method not allowed");
  } catch (error) {
    await sendJson(response, 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Campus Companion CP3 running at http://localhost:${port}`);
});
