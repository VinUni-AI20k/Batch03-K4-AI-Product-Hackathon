from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch


SERVER_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SERVER_DIR))

import main  # noqa: E402


class FakeCompletions:
    def __init__(self, include_invalid_code: bool = False) -> None:
        self.include_invalid_code = include_invalid_code
        self.last_request: dict | None = None

    def create(self, **kwargs):
        self.last_request = kwargs
        prompt = json.loads(kwargs["messages"][-1]["content"])
        codes = [candidate["ma_de"] for candidate in prompt["candidates"][:3]]
        if self.include_invalid_code:
            codes[0] = "FAKE-999"
        response = {
            "selections": [
                {
                    "ma_de": code,
                    "reasons": ["Khớp tín hiệu hồ sơ với dữ liệu đề tài."],
                    "risk_note": "Cần người dùng xem lại trước khi chọn.",
                }
                for code in codes
            ],
            "confidence": "high",
            "overall_note": "Đã xếp hạng trên candidate retrieval.",
            "assistant_message": "Mình đã dùng yêu cầu mới nhất để xếp hạng lại.",
        }
        return SimpleNamespace(
            choices=[
                SimpleNamespace(
                    message=SimpleNamespace(content=json.dumps(response, ensure_ascii=False))
                )
            ]
        )


class FakeClient:
    def __init__(self, completions: FakeCompletions) -> None:
        self.chat = SimpleNamespace(completions=completions)


class RecommendationEngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.projects = main._load_projects()

    def test_specialized_eval_profile_retrieves_matching_aip_projects(self) -> None:
        payload = main.RecommendRequest(
            interest="data",
            skills=["Python", "AI evaluation", "Prompt regression", "MLOps"],
            profile_major="AI Engineering",
            user_query="Mình muốn đề tài về eval và model drift.",
        )

        codes = [
            project["ma_de"]
            for project in main._retrieve_candidates(self.projects, payload, limit=10)
        ]

        self.assertEqual(codes[0], "AIP-03")
        self.assertIn("AIP-10", codes)
        self.assertNotEqual(
            codes,
            [
                "ITOPS-001",
                "ITOPS-002",
                "ITOPS-003",
                "ITOPS-004",
                "ITOPS-005",
                "ITOPS-006",
                "ITOPS-007",
                "ITOPS-008",
                "ITOPS-009",
                "ITOPS-010",
            ],
        )

    def test_different_profiles_get_different_candidate_pools(self) -> None:
        data_profile = main.RecommendRequest(
            interest="data",
            skills=["Python", "SQL", "Phân tích dữ liệu"],
        )
        security_profile = main.RecommendRequest(
            interest="security",
            skills=["Network", "SOC", "Log analysis"],
            user_query="Ưu tiên phát hiện phishing.",
        )

        data_codes = {
            project["ma_de"]
            for project in main._retrieve_candidates(self.projects, data_profile, limit=10)
        }
        security_codes = {
            project["ma_de"]
            for project in main._retrieve_candidates(self.projects, security_profile, limit=10)
        }

        self.assertNotEqual(data_codes, security_codes)
        self.assertTrue(any(code.startswith("DATA-") for code in data_codes))
        self.assertTrue(any(code.startswith("VSOC-") for code in security_codes))

    def test_explicit_chat_exclusions_are_not_treated_as_positive_preferences(self) -> None:
        payload = main.RecommendRequest(
            interest="product",
            skills=["React", "UX"],
            user_query="Ưu tiên web đơn giản, không dùng machine learning.",
        )

        excluded = main._excluded_query_terms(payload)
        candidates = main._retrieve_candidates(self.projects, payload, limit=10)

        self.assertIn("ml", excluded)
        self.assertNotIn("AIP-01", [project["ma_de"] for project in candidates[:5]])

    def test_model_receives_confirmed_profile_and_chat_context(self) -> None:
        completions = FakeCompletions()
        payload = main.RecommendRequest(
            interest="product",
            skills=["React", "UX"],
            team_size=3,
            difficulty="easy",
            profile_major="Kỹ thuật phần mềm",
            experience_level="intermediate",
            profile_projects=["Ứng dụng quản lý câu lạc bộ"],
            conversation_context=["Mình muốn làm web."],
            user_query="Ưu tiên scope nhỏ, không dùng machine learning.",
        )

        with tempfile.TemporaryDirectory() as directory:
            log_path = Path(directory) / "recommend.jsonl"
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", log_path
            ):
                result = main.recommend(payload)

            prompt = json.loads(completions.last_request["messages"][-1]["content"])
            self.assertEqual(prompt["profile"]["skills"], ["React", "UX"])
            self.assertEqual(
                prompt["profile"]["profile_projects"],
                ["Ứng dụng quản lý câu lạc bộ"],
            )
            self.assertEqual(prompt["profile"]["experience_level"], "intermediate")
            self.assertEqual(
                prompt["latest_user_query"],
                "Ưu tiên scope nhỏ, không dùng machine learning.",
            )
            self.assertEqual(prompt["conversation_context"], ["Mình muốn làm web."])
            self.assertEqual(result.candidate_count, 24)
            self.assertIn("Yêu cầu mới nhất trong chat", result.applied_profile_signals)

            log_entry = json.loads(log_path.read_text(encoding="utf-8").strip())
            self.assertNotIn("request", log_entry)
            self.assertTrue(log_entry["request_summary"]["has_user_query"])
            self.assertEqual(log_entry["request_summary"]["skills_count"], 2)

    def test_server_filters_model_code_outside_candidate_pool(self) -> None:
        completions = FakeCompletions(include_invalid_code=True)
        payload = main.RecommendRequest(
            interest="education",
            skills=["Thiết kế UX", "Nghiên cứu người dùng"],
            user_query="Đề tài hỗ trợ học viên.",
        )

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                result = main.recommend(payload)

        self.assertNotIn("FAKE-999", [selection.ma_de for selection in result.selections])
        self.assertEqual(result.confidence, "low")


if __name__ == "__main__":
    unittest.main()
