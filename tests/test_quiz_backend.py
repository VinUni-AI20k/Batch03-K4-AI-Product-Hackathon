import json, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "codebase"))
import api_server
from quiz_agent import run_quiz_agent


class QuizBackendTests(unittest.TestCase):
    def test_load_real_transcript_chunks(self):
        chunks = api_server.load_chunks(["T03-030", "T03-031", "T03-032"])
        self.assertEqual([c["id"] for c in chunks], ["T03-030", "T03-031", "T03-032"])
        self.assertTrue(all(c["text"] for c in chunks))

    def test_reject_unknown_source(self):
        with self.assertRaises(ValueError):
            api_server.load_chunks(["T99-999"])

    def test_validate_quiz_schema(self):
        question = {"question":"Q?", "options":["A","B","C","D"], "correct":1, "explanation":"E", "source_ids":["T03-030"]}
        payload = {"status":"OK", "questions":[question] * 15}
        self.assertEqual(api_server.validate_quiz(payload, {"T03-030"})["status"], "OK")

    def test_validate_short_reinforcement_quiz(self):
        question = {"question":"Q?", "options":["A","B","C","D"], "correct":1, "explanation":"E", "source_ids":["T03-030"]}
        payload = {"status":"OK", "questions":[question] * 5}
        self.assertEqual(api_server.validate_quiz(payload, {"T03-030"}, question_count=5)["status"], "OK")

    def test_reject_untraceable_question(self):
        question = {"question":"Q?", "options":["A","B","C","D"], "correct":1, "explanation":"E", "source_ids":["T99-999"]}
        with self.assertRaises(ValueError):
            api_server.validate_quiz({"status":"OK", "questions":[question]*15}, {"T03-030"})

    def test_langgraph_quiz_agent_retrieves_then_validates(self):
        calls = []
        question = {
            "question": "Q?", "options": ["A", "B", "C", "D"], "correct": 1,
            "explanation": "E", "source_ids": ["T03-030"],
        }

        def loader(source_ids):
            calls.append(("retrieve", source_ids))
            return [{"id": "T03-030", "text": "Nội dung transcript."}]

        def generator(title, chunks, feedback):
            calls.append(("generate", title, chunks, feedback))
            return {"status": "OK", "questions": [question] * 15}, {"model": "test"}

        quiz, trace = run_quiz_agent(
            "Day03", ["T03-030"], loader, generator, api_server.validate_quiz
        )
        self.assertEqual(quiz["status"], "OK")
        self.assertEqual(calls[0], ("retrieve", ["T03-030"]))
        self.assertEqual(calls[1][0], "generate")
        self.assertEqual(trace["langgraph"]["workflow"], "retrieve_transcript → generate_quiz → validate_quiz")


if __name__ == "__main__": unittest.main()
