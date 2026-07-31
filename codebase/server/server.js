require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const { GoogleGenAI, Type } = require("@google/genai");
const { getSection, getSectionGroundingText } = require("./data/knowledge");
const { buildQuizPrompt } = require("./prompts");

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

if (!GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY — copy .env.example to .env and paste your key.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const quizResponseSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    citation: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                key: { type: Type.STRING },
                                text: { type: Type.STRING },
                                correct: { type: Type.BOOLEAN },
                                feedback: { type: Type.STRING }
                            },
                            required: ["key", "text", "correct", "feedback"]
                        }
                    }
                },
                required: ["question", "citation", "options"]
            }
        }
    },
    required: ["questions"]
};

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
        const { day, sectionId, questionCount = 4, regenerate = false } = req.body || {};

        if (!day || !sectionId) {
            return res.status(400).json({ error: "day and sectionId are required" });
        }
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "Server missing GEMINI_API_KEY — see codebase/server/.env.example" });
        }

        const section = getSection(day, sectionId);
        if (!section) {
            return res.status(404).json({ error: `Unknown section ${day}/${sectionId}` });
        }

        const cacheKey = `${day}:${sectionId}`;
        if (!regenerate && quizCache.has(cacheKey)) {
            return res.json(quizCache.get(cacheKey));
        }

        const groundingText = getSectionGroundingText(day, sectionId);
        const clampedCount = Math.max(3, Math.min(5, Number(questionCount) || 4));
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

app.listen(PORT, () => {
    console.log(`VLearn Active Recall server listening on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/index.html to load the prototype through this server.`);
});
