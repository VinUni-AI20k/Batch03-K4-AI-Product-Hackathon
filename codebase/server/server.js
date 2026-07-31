require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const { getSection, getSectionGroundingText, getDocGroundingText } = require("./data/knowledge");
const { buildQuizPrompt, buildChatPrompt, buildExplainAnswerPrompt } = require("./prompts");
const { quizResponseSchema, explainAnswerResponseSchema } = require("./quizSchema");

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";
// Google Search grounding tool currently can't be combined with responseSchema/JSON
// mode in the Gemini API, so /api/chat-ask (plain text + citations) uses this model
// directly rather than the structured quizResponseSchema path below.
const CHAT_MODEL = "gemini-flash-lite-latest";

if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY — copy .env.example to .env and paste your key.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Pre-built per-section question pool (see codebase/server/scripts/generate-question-bank.js).
// generate-quiz draws its 2-3 questions from here instead of calling Gemini
// live on every quiz load/retry. Missing file (bank not generated yet) just
// means bankQuestionsFor() returns [] and the live-generation fallback below
// kicks in, so the app still works before the bank exists.
let questionBank = {};
try {
    questionBank = require("./data/questionBank.json").bank || {};
} catch (err) {
    console.warn("No question bank found at data/questionBank.json — falling back to live Gemini generation for every quiz. Run: node codebase/server/scripts/generate-question-bank.js");
}

function bankQuestionsFor(day, sectionId) {
    return (questionBank[day] && questionBank[day][sectionId]) || [];
}

// Fisher-Yates shuffle, non-mutating.
function sampleQuestions(pool, count) {
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

// Simple in-memory cache so reloading a section during one server run keeps
// showing the same quiz (a fresh quiz every reload would make "did you pass
// this section" meaningless). Restarting the server clears it.
const quizCache = new Map();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/.."));

app.get("/api/health", (req, res) => {
    res.json({ ok: true, hasKey: Boolean(GEMINI_API_KEY) });
});

app.post("/api/generate-quiz", async (req, res) => {
    try {
        const { day, sectionId, questionCount = 3, regenerate = false } = req.body || {};

        if (!day || !sectionId) {
            return res.status(400).json({ error: "day and sectionId are required" });
        }

        const section = getSection(day, sectionId);
        if (!section) {
            return res.status(404).json({ error: `Unknown section ${day}/${sectionId}` });
        }

        const cacheKey = `${day}:${sectionId}`;
        if (!regenerate && quizCache.has(cacheKey)) {
            return res.json(quizCache.get(cacheKey));
        }

        const clampedCount = Math.max(2, Math.min(3, Number(questionCount) || 3));

        const pool = bankQuestionsFor(day, sectionId);
        if (pool.length) {
            const payload = {
                day,
                sectionId,
                sectionTitle: section.title,
                questions: sampleQuestions(pool, Math.min(clampedCount, pool.length))
            };
            quizCache.set(cacheKey, payload);
            return res.json(payload);
        }

        // Fallback: no pre-built bank for this section (bank not generated
        // yet) — generate live from Gemini so the app still works.
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "No question bank for this section and server missing GEMINI_API_KEY — see codebase/server/.env.example" });
        }

        console.warn(`No bank entry for ${cacheKey} — generating live via Gemini.`);
        const groundingText = getSectionGroundingText(day, sectionId);
        const prompt = buildQuizPrompt({
            day,
            sectionTitle: section.title,
            groundingText,
            questionCount: clampedCount
        });

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizResponseSchema,
                temperature: 0.4
            }
        });

        const parsed = JSON.parse(response.text);
        const payload = { day, sectionId, sectionTitle: section.title, questions: parsed.questions || [] };

        quizCache.set(cacheKey, payload);
        res.json(payload);
    } catch (err) {
        console.error("generate-quiz failed:", err);
        res.status(502).json({ error: "AI generation failed, please retry.", detail: String(err.message || err) });
    }
});

// Live "AI phân tích sâu hơn" — unlike the static per-option feedback baked
// into the question bank at generation time, this calls Gemini fresh with the
// exact question the student answered, using the same verdict schema as
// eval/prompts.md Prompt B (see buildExplainAnswerPrompt for the fixes applied
// after eval/results_run1.md's 70% run). Grounding text is always looked up
// server-side from the section id — never trusts client-supplied slide text.
app.post("/api/explain-answer", async (req, res) => {
    try {
        const { day, sectionId, question, options, selectedKey } = req.body || {};

        if (!day || !sectionId || !question || !Array.isArray(options) || !selectedKey) {
            return res.status(400).json({ error: "day, sectionId, question, options and selectedKey are required" });
        }
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "Server missing GEMINI_API_KEY — see codebase/server/.env.example" });
        }

        const section = getSection(day, sectionId);
        if (!section) {
            return res.status(404).json({ error: `Unknown section ${day}/${sectionId}` });
        }

        const chosen = options.find((o) => o.key === selectedKey);
        if (!chosen) {
            return res.status(400).json({ error: `selectedKey ${selectedKey} not found in options` });
        }

        const groundingText = getSectionGroundingText(day, sectionId);
        const studentAnswerText = `(Trắc nghiệm, chọn đáp án ${chosen.key}) ${chosen.text}`;

        const prompt = buildExplainAnswerPrompt({
            day,
            sectionTitle: section.title,
            groundingText,
            question,
            studentAnswerText
        });

        // Uses CHAT_MODEL, not MODEL: MODEL (gemini-flash-latest) only gets a 20
        // requests/day free-tier quota, already spent 1:1 by the 20-case golden set
        // in eval/results_run1.md and easily exhausted by normal quiz generation
        // traffic too. CHAT_MODEL (gemini-flash-lite-latest, already used by
        // /api/chat-ask) has separate, higher headroom and doesn't need tool support
        // here, so JSON/responseSchema mode works the same as it does for MODEL.
        const response = await ai.models.generateContent({
            model: CHAT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: explainAnswerResponseSchema,
                temperature: 0.3
            }
        });

        const parsed = JSON.parse(response.text);
        res.json(parsed);
    } catch (err) {
        console.error("explain-answer failed:", err);
        res.status(502).json({ error: "AI phân tích thất bại, thử lại.", detail: String(err.message || err) });
    }
});

app.post("/api/chat-ask", async (req, res) => {
    try {
        const { day, message, history } = req.body || {};

        if (!day || !message) {
            return res.status(400).json({ error: "day and message are required" });
        }
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "Server missing GEMINI_API_KEY — see codebase/server/.env.example" });
        }

        const groundingText = getDocGroundingText(day);
        if (!groundingText) {
            return res.status(404).json({ error: `Unknown day ${day}` });
        }

        const prompt = buildChatPrompt({ day, groundingText, message });

        // Multi-turn context memory: earlier turns of this chat session (sent by the
        // client, see chatHistory in index.html) go in as plain conversation turns so
        // the model can reference what was already said ("như mình vừa giải thích ở
        // trên..."). Only the LATEST turn carries the full grounding + source-priority
        // rules from buildChatPrompt — prior answers were already generated under those
        // same rules, so repeating them every turn is unnecessary. Capped to the last 8
        // turns (~4 exchanges) so a long conversation doesn't blow up token cost.
        const MAX_HISTORY_TURNS = 8;
        const priorTurns = Array.isArray(history)
            ? history
                .filter((h) => h && typeof h.text === "string" && (h.role === "user" || h.role === "ai"))
                .slice(-MAX_HISTORY_TURNS)
                .map((h) => ({ role: h.role === "ai" ? "model" : "user", parts: [{ text: h.text.slice(0, 2000) }] }))
            : [];
        const contents = [...priorTurns, { role: "user", parts: [{ text: prompt }] }];

        // googleSearch is a built-in tool: the model decides for itself whether it
        // needs to search, per the source-priority rules in buildChatPrompt (slide
        // first, web only as fallback). Tool use is not combinable with
        // responseSchema/JSON mode in the current Gemini API, so this returns plain
        // text — slide citations show up inline as [T0x-NNN] and are parsed out
        // client-side (see renderChatAnswer in index.html).
        //
        // Google Search grounding needs a higher API tier than plain generateContent
        // (a free-tier-only key gets RESOURCE_EXHAUSTED on the tool call specifically,
        // even when plain calls still work). Rather than fail the whole chat feature
        // on that, fall back to a slide-only answer (no tool) so the assistant still
        // works — it just can't reach the web until billing/a higher tier is enabled.
        let response, usedWebSearch = true;
        try {
            response = await ai.models.generateContent({
                model: CHAT_MODEL,
                contents,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.3
                }
            });
        } catch (toolErr) {
            console.warn("chat-ask: googleSearch tool unavailable, falling back to slide-only:", toolErr.message);
            usedWebSearch = false;
            response = await ai.models.generateContent({
                model: CHAT_MODEL,
                contents,
                config: { temperature: 0.3 }
            });
        }

        const candidate = response.candidates && response.candidates[0];
        const groundingChunks = (candidate && candidate.groundingMetadata && candidate.groundingMetadata.groundingChunks) || [];
        const webSources = groundingChunks
            .map((c) => c.web)
            .filter(Boolean)
            .map((w) => ({ title: w.title, uri: w.uri }))
            .filter((w, i, arr) => w.uri && arr.findIndex((x) => x.uri === w.uri) === i);

        res.json({ answer: response.text || "", webSources, usedWebSearch });
    } catch (err) {
        console.error("chat-ask failed:", err);
        res.status(502).json({ error: "AI trả lời thất bại, thử lại.", detail: String(err.message || err) });
    }
});

app.listen(PORT, () => {
    console.log(`VLearn Active Recall server listening on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html to load the prototype through this server.`);
});
