from __future__ import annotations

import os
import unittest
from unittest.mock import patch

from chat import run_model_tool_loop
from providers.base import ModelResponse, ToolCall
from tools.fetch.tool import read_url
from tools.paper_text.tool import get_arxiv_paper_text


class ScriptedProvider:
    def __init__(self) -> None:
        self.tool_sets: list[list[dict]] = []

    def complete(self, messages, tools, **kwargs):
        self.tool_sets.append(tools)
        if len(self.tool_sets) == 1:
            return ModelResponse(
                text="Reading the supplied article.",
                tool_calls=[ToolCall(name="fetch", args={"url": "not-a-url"})],
            )
        return ModelResponse(
            text="URL không hợp lệ nên bài báo đã được bỏ qua; tôi không tìm nguồn thay thế.",
        )


class UrlGuardrailTests(unittest.TestCase):
    @patch("tools.fetch.tool.requests.post")
    def test_invalid_url_is_blocked_before_network(self, post) -> None:
        result = read_url("not-a-url")

        post.assert_not_called()
        self.assertEqual(result["status"], "blocked")
        self.assertTrue(result["skipped"])
        self.assertFalse(result["fallback_allowed"])
        self.assertEqual(result["error"], "invalid_url")

    @patch("tools.fetch.tool.requests.post")
    def test_private_url_is_blocked_before_network(self, post) -> None:
        result = read_url("http://127.0.0.1:8501/private")

        post.assert_not_called()
        self.assertEqual(result["error"], "unsafe_url")
        self.assertFalse(result["fallback_allowed"])

    @patch("tools.fetch.tool.requests.post", side_effect=TimeoutError("timed out"))
    def test_unreachable_url_is_skipped_without_fallback(self, post) -> None:
        with patch.dict(os.environ, {"FIRECRAWL_API_KEY": "test-key"}):
            result = read_url("https://example.com/missing")

        post.assert_called_once()
        self.assertEqual(result["status"], "skipped")
        self.assertEqual(result["error"], "TimeoutError")
        self.assertFalse(result["fallback_allowed"])

    def test_invalid_arxiv_reference_is_terminal(self) -> None:
        result = get_arxiv_paper_text("not-an-arxiv-id")

        self.assertEqual(result["status"], "blocked")
        self.assertTrue(result["skipped"])
        self.assertFalse(result["fallback_allowed"])

    def test_chat_loop_removes_all_tools_after_terminal_skip(self) -> None:
        provider = ScriptedProvider()
        result = run_model_tool_loop(
            provider=provider,
            messages=[{"role": "user", "content": "Tóm tắt not-a-url"}],
            tools=[{"type": "function", "function": {"name": "fetch"}}],
            model=None,
            max_tool_rounds=4,
        )

        self.assertEqual(result["status"], "guardrail_skipped")
        self.assertEqual(len(provider.tool_sets), 2)
        self.assertEqual(provider.tool_sets[1], [])
        self.assertEqual([event["tool"] for event in result["tool_events"]], ["fetch"])
        self.assertEqual(result["rounds"][1]["tool_calls"], [])


if __name__ == "__main__":
    unittest.main()
