const { Type } = require("@google/genai");

// Shared between server.js (live fallback generation) and
// scripts/generate-question-bank.js (offline bank generation) so both paths
// ask Gemini for exactly the same JSON shape.
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
                    sourcePages: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                    reviewSummary: { type: Type.STRING },
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
                required: ["question", "citation", "sourcePages", "reviewSummary", "options"]
            }
        }
    },
    required: ["questions"]
};

module.exports = { quizResponseSchema };
