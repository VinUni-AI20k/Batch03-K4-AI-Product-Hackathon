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


def _tool_call(call_id: str, name: str, args: dict) -> SimpleNamespace:
    return SimpleNamespace(
        id=call_id,
        type="function",
        function=SimpleNamespace(name=name, arguments=json.dumps(args, ensure_ascii=False)),
    )


def _reply(content, tool_calls=None) -> SimpleNamespace:
    return SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=content, tool_calls=tool_calls))]
    )


class FakeCompletions:
    """Mô phỏng agent loop nhiều bước.

    `mode` quyết định agent hành xử ra sao ở lượt đầu:
    - "search" → gọi `search_topics` rồi trả JSON xếp hạng
    - "chat"   → trả lời thẳng, không gọi tool nào
    - "detail" → gọi `get_topic_detail` rồi trả lời hội thoại (không xếp hạng)
    - "browse" → gọi `browse_catalogue` rồi trả lời hội thoại
    """

    def __init__(
        self,
        include_invalid_code: bool = False,
        call_tool: bool = True,
        mode: str | None = None,
        detail_code: str = "VSOC-001",
        search_args: dict | None = None,
        browse_khoi: str | None = None,
    ) -> None:
        self.include_invalid_code = include_invalid_code
        self.mode = mode or ("search" if call_tool else "chat")
        self.detail_code = detail_code
        self.search_args = search_args
        self.browse_khoi = browse_khoi
        self.last_request: dict | None = None
        self.first_request: dict | None = None
        self.tool_query: str | None = None
        self.detail_result: dict | None = None
        self.browse_result: dict | None = None

    def create(self, **kwargs):
        self.last_request = kwargs
        tool_messages = [m for m in kwargs["messages"] if m.get("role") == "tool"]

        if not tool_messages:
            self.first_request = kwargs
            if self.mode == "chat":
                return _reply("Chào bạn! Mình là Ideora, bạn cần mình giúp gì?")
            if self.mode == "detail":
                return _reply(
                    None, [_tool_call("call_d", "get_topic_detail", {"ma_de": self.detail_code})]
                )
            if self.mode == "browse":
                args = {"khoi": self.browse_khoi} if self.browse_khoi else {}
                return _reply(None, [_tool_call("call_b", "browse_catalogue", args)])
            self.tool_query = "đề tài phù hợp với hồ sơ đã xác nhận"
            args = {"query": self.tool_query, **(self.search_args or {})}
            return _reply(None, [_tool_call("call_1", "search_topics", args)])

        last_payload = json.loads(tool_messages[-1]["content"])

        # Sau browse_catalogue → agent trả lời hội thoại.
        if "blocks" in last_payload or "total_topics" in last_payload:
            self.browse_result = last_payload
            return _reply("Kho hiện có các lĩnh vực như trên.")

        # Sau get_topic_detail → agent trả lời hội thoại, không xếp hạng.
        if "topic" in last_payload or "error" in last_payload:
            self.detail_result = last_payload
            return _reply("Đây là thông tin chi tiết bạn hỏi về đề tài đó.")

        # Sau search_topics: lượt còn `tools=` → thoát vòng lặp bằng text rỗng;
        # lượt có `response_format=` → trả JSON theo RECOMMENDATION_SCHEMA.
        if "response_format" not in kwargs:
            return _reply("")

        codes = [topic["ma_de"] for topic in last_payload["topics"][:3]]
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
            "assistant_message": "Mình đã dùng yêu cầu mới nhất để xếp hạng lại.",
        }
        return _reply(json.dumps(response, ensure_ascii=False))


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

            # Lượt 1 của agent nhận hồ sơ + ngữ cảnh dạng text tự nhiên (không
            # phải JSON như kiến trúc single-shot cũ) để nó tự quyết định gọi tool.
            first_turn = completions.first_request["messages"][-1]["content"]
            self.assertIn("React", first_turn)
            self.assertIn("Ứng dụng quản lý câu lạc bộ", first_turn)
            self.assertIn("intermediate", first_turn)
            self.assertIn("Ưu tiên scope nhỏ, không dùng machine learning.", first_turn)
            self.assertIn("Mình muốn làm web.", first_turn)
            # Agent phải được cấp tool search_topics ở lượt quyết định.
            tool_names = [
                tool["function"]["name"] for tool in completions.first_request["tools"]
            ]
            self.assertIn("search_topics", tool_names)
            self.assertEqual(result.response_type, "recommendation")
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

    def test_agent_answers_without_calling_tool_for_offtopic_question(self) -> None:
        """Hành vi agent cốt lõi: câu hỏi ngoài lề KHÔNG kích hoạt retrieval.

        Kiến trúc cũ luôn chạy retrieval rồi ép model chọn trong 24 đề tài, nên
        mọi tin nhắn (kể cả "xin chào") đều bị trả lời như đang xếp hạng đề tài.
        """
        completions = FakeCompletions(call_tool=False)
        payload = main.RecommendRequest(
            interest="data",
            skills=["Python"],
            user_query="Xin chào, bạn là ai vậy?",
        )

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                result = main.recommend(payload)

        self.assertEqual(result.response_type, "conversational")
        self.assertEqual(result.selections, [])
        self.assertEqual(result.candidate_count, 0)
        self.assertIn("Ideora", result.assistant_message)
        # Chỉ gọi model đúng 1 lượt — không có lượt xếp hạng nào theo sau.
        self.assertFalse(
            any(message.get("role") == "tool" for message in completions.last_request["messages"])
        )

    def test_agent_reads_topic_detail_from_real_data(self) -> None:
        """Agent gọi `get_topic_detail` và nhận đúng field thật của đề tài."""
        completions = FakeCompletions(mode="detail", detail_code="VSOC-001")
        payload = main.RecommendRequest(
            interest="security",
            skills=["Network"],
            user_query="Đề tài VSOC-001 cần dữ liệu gì và ai duyệt kết quả?",
        )

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                result = main.recommend(payload)

        # Tool trả về dữ liệu thật từ mock-data.json, không phải model bịa.
        topic = completions.detail_result["topic"]
        self.assertEqual(topic["ma_de"], "VSOC-001")
        self.assertTrue(topic["nguon_su_that"])
        self.assertTrue(topic["hitl"])
        # Hỏi sâu một đề tài là hội thoại, không phải yêu cầu xếp hạng lại.
        self.assertEqual(result.response_type, "conversational")
        self.assertEqual(result.candidate_count, 0)

    def test_agent_rejects_unknown_topic_code(self) -> None:
        """Mã đề tài không có thật → tool trả lỗi rõ ràng thay vì dữ liệu bịa."""
        completions = FakeCompletions(mode="detail", detail_code="FAKE-999")
        payload = main.RecommendRequest(interest="data", user_query="Cho mình xem FAKE-999")

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                main.recommend(payload)

        self.assertIn("error", completions.detail_result)
        self.assertNotIn("topic", completions.detail_result)

    def test_browse_catalogue_returns_real_counts(self) -> None:
        """"Kho có những lĩnh vực nào" → số liệu đếm thật, không để model đoán."""
        completions = FakeCompletions(mode="browse")
        payload = main.RecommendRequest(interest="data", user_query="kho có lĩnh vực nào?")

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                result = main.recommend(payload)

        browse = completions.browse_result
        self.assertEqual(browse["total_topics"], len(self.projects))
        codes = {block["khoi"] for block in browse["blocks"]}
        self.assertIn("HC", codes)
        self.assertIn("VSOC", codes)
        # Tổng số đề tài theo khối phải khớp tổng kho — không được bịa.
        self.assertEqual(sum(b["count"] for b in browse["blocks"]), len(self.projects))
        self.assertEqual(result.response_type, "conversational")

    def test_search_filters_hard_by_block(self) -> None:
        """`khoi` là lọc CỨNG: hỏi đề tài y tế thì chỉ được trả đề tài khối HC."""
        completions = FakeCompletions(search_args={"khoi": "HC"})
        payload = main.RecommendRequest(
            interest="data",  # cố tình lệch khối để chắc chắn filter thắng
            skills=["Python"],
            user_query="chỉ cho tôi đề tài về y tế",
        )

        with tempfile.TemporaryDirectory() as directory:
            with patch.object(main, "_client", return_value=FakeClient(completions)), patch.object(
                main, "LOG_PATH", Path(directory) / "recommend.jsonl"
            ):
                result = main.recommend(payload)

        self.assertTrue(result.selections)
        for selection in result.selections:
            self.assertTrue(
                selection.ma_de.startswith("HC-"),
                f"{selection.ma_de} không thuộc khối HC dù đã lọc cứng",
            )

    def test_randomize_varies_results(self) -> None:
        """`randomize=true` phải cho tập kết quả khác nhau giữa các lần gọi."""
        payload = main.RecommendRequest(
            interest="data", skills=["Python", "SQL"], user_query="gợi ý ngẫu nhiên gì đó đi"
        )
        seen = set()
        for _ in range(6):
            picked = main._retrieve_candidates(
                self.projects, payload, limit=3, agent_query="đề tài bất kỳ", randomize=True
            )
            seen.add(tuple(p["ma_de"] for p in picked))
        self.assertGreater(len(seen), 1, "randomize luôn trả cùng một bộ đề tài")


if __name__ == "__main__":
    unittest.main()
