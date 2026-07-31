import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const appDir = path.resolve(__dirname, "..");
const slidesPath = path.join(rootDir, "data/mock-slides.json");
const port = Number(process.env.PORT || 3001);
const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const app = express();
app.use(express.json({ limit: "250kb" }));

async function loadSlides() {
  const raw = await readFile(slidesPath, "utf8");
  return JSON.parse(raw);
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (message) =>
        message &&
        ["user", "assistant"].includes(message.role) &&
        typeof message.content === "string"
    )
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 2500)
    }));
}

function fallbackPayload(slide, includeQuiz) {
  const answer =
    slide.demoSelection?.tutorAnswer ||
    slide.tutorRecap ||
    `Theo Slide ${slide.id}, ${slide.summary.join(" ")}`;

  return {
    answer,
    quiz: includeQuiz ? slide.quiz : null,
    mode: "mock",
    model
  };
}

function parseTutorResponse(content, slide, includeQuiz) {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed.answer !== "string") throw new Error("Missing answer");

    return {
      answer: parsed.answer,
      quiz: includeQuiz ? parsed.quiz || slide.quiz : null,
      mode: "openrouter",
      model
    };
  } catch {
    return {
      answer: content,
      quiz: includeQuiz ? slide.quiz : null,
      mode: "openrouter",
      model
    };
  }
}

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    provider: "openrouter",
    model,
    aiConfigured: Boolean(process.env.OPENROUTER_API_KEY)
  });
});

app.get("/api/slides", async (_request, response, next) => {
  try {
    response.json(await loadSlides());
  } catch (error) {
    next(error);
  }
});

app.post("/api/chat", async (request, response, next) => {
  try {
    const {
      messages,
      slideId,
      selectedText = "",
      includeQuiz = false
    } = request.body || {};
    const slideData = await loadSlides();
    const slide = slideData.slides.find((item) => item.id === Number(slideId));

    if (!slide) {
      return response.status(400).json({ error: "Slide không tồn tại." });
    }

    const safeMessages = cleanMessages(messages);
    if (!safeMessages.length) {
      return response.status(400).json({ error: "Câu hỏi không hợp lệ." });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      if (process.env.DEMO_FALLBACK !== "false") {
        return response.json(fallbackPayload(slide, includeQuiz));
      }
      return response.status(503).json({
        error: "Chưa cấu hình OPENROUTER_API_KEY."
      });
    }

    const slideContext = {
      id: slide.id,
      title: slide.title,
      learningObjective: slide.learningObjective,
      summary: slide.summary,
      content: slide.content,
      selectableTerms: slide.selectableTerms,
      quizReference: includeQuiz ? slide.quiz : null
    };

    const systemPrompt = `
Bạn là AI Tutor của VLearn cho môn SWD392.
Chỉ giải thích dựa trên CONTEXT SLIDE được cung cấp. Trả lời bằng tiếng Việt, rõ ràng, tối đa 3 câu.
Mở đầu bằng "Theo Slide ${slide.id},". Nếu thông tin không có trong slide, nói rõ "[Ngoài Slide]".
Không làm hộ assignment; chỉ hướng dẫn lý thuyết để học viên tự làm.
Nếu includeQuiz=true, trả về đúng 1 câu micro-quiz ngắn. Dùng quizReference để luồng demo và đáp án ổn định.

Chỉ trả về JSON hợp lệ theo dạng:
{
  "answer": "Nội dung trả lời",
  "quiz": null hoặc {
    "id": "string",
    "type": "true_false hoặc multiple_choice",
    "question": "string",
    "options": [{"id": "string", "text": "string"}],
    "correctOptionId": "string",
    "correctFeedback": "string",
    "incorrectFeedback": "string",
    "remediation": null hoặc {
      "reason": "string",
      "targetSlideId": 5,
      "cardTitle": "Open Slide 5",
      "cardSubtitle": "string"
    }
  }
}

includeQuiz=${Boolean(includeQuiz)}
Đoạn học viên đang chọn: ${String(selectedText).slice(0, 500) || "(không có)"}
CONTEXT SLIDE:
${JSON.stringify(slideContext)}
`.trim();

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
          "X-Title": "VLearn Context-Aware AI Tutor"
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 700,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            ...safeMessages
          ]
        }),
        signal: AbortSignal.timeout(25000)
      }
    );

    if (!openRouterResponse.ok) {
      const details = await openRouterResponse.text();
      throw new Error(
        `OpenRouter ${openRouterResponse.status}: ${details.slice(0, 300)}`
      );
    }

    const completion = await openRouterResponse.json();
    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenRouter không trả về nội dung.");

    response.json(parseTutorResponse(content, slide, includeQuiz));
  } catch (error) {
    if (process.env.DEMO_FALLBACK !== "false") {
      try {
        const slideData = await loadSlides();
        const slide = slideData.slides.find(
          (item) => item.id === Number(request.body?.slideId)
        );
        if (slide) {
          return response.json({
            ...fallbackPayload(slide, Boolean(request.body?.includeQuiz)),
            warning: "AI tạm thời không khả dụng; đang dùng dữ liệu demo."
          });
        }
      } catch {
        // Forward the original error below.
      }
    }
    next(error);
  }
});

const distDir = path.join(appDir, "dist");
app.use(express.static(distDir));
app.get("*", async (request, response, next) => {
  if (request.path.startsWith("/api/")) return next();
  try {
    await readFile(path.join(distDir, "index.html"));
    response.sendFile(path.join(distDir, "index.html"));
  } catch {
    response.status(404).send("Frontend chưa được build. Chạy: npm run build");
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(502).json({
    error: "Không thể kết nối AI Tutor. Vui lòng thử lại."
  });
});

app.listen(port, () => {
  console.log(`VLearn API running at http://localhost:${port}`);
  console.log(`OpenRouter model: ${model}`);
});
