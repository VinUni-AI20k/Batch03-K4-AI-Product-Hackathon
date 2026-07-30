from __future__ import annotations

import os
import unittest
from unittest.mock import Mock, patch

from chat import run_model_tool_loop
from providers.base import ModelResponse, ToolCall
from tools.send.tool import send_telegram


class SendProvider:
    def __init__(self) -> None:
        self.calls = 0

    def complete(self, messages, tools, **kwargs):
        self.calls += 1
        return ModelResponse(
            tool_calls=[ToolCall(name="send", args={"text": "VetClaw summary", "confirmed": True})]
        )


class TelegramSendTests(unittest.TestCase):
    @patch("tools.send.tool.requests.post")
    def test_direct_confirmed_send_executes(self, post) -> None:
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {"result": {"message_id": 42}}
        post.return_value = response

        with patch.dict(os.environ, {"TELEGRAM_BOT_TOKEN": "token", "TELEGRAM_CHAT_ID": "chat"}):
            result = send_telegram("VetClaw summary", confirmed=True)

        post.assert_called_once()
        self.assertEqual(result["status"], "sent")
        self.assertTrue(result["action_completed"])
        self.assertEqual(result["message_ids"], [42])

    @patch("tools.send.tool.requests.post")
    def test_low_level_unconfirmed_call_stays_blocked(self, post) -> None:
        result = send_telegram("VetClaw summary", confirmed=False)

        post.assert_not_called()
        self.assertEqual(result["status"], "needs_confirmation")

    def test_agent_loop_stops_after_one_successful_send(self) -> None:
        provider = SendProvider()
        fake_send = lambda **kwargs: {
            "tool": "send_telegram",
            "status": "sent",
            "action_completed": True,
            "message": "Đã gửi nội dung lên Telegram.",
        }
        with patch.dict("chat.TOOL_FUNCTIONS", {"send": fake_send}, clear=False):
            result = run_model_tool_loop(
                provider=provider,
                messages=[{"role": "user", "content": "Gửi Telegram"}],
                tools=[{"type": "function", "function": {"name": "send"}}],
                model=None,
                max_tool_rounds=4,
            )

        self.assertEqual(provider.calls, 1)
        self.assertEqual(result["status"], "action_completed")
        self.assertEqual([event["tool"] for event in result["tool_events"]], ["send"])


if __name__ == "__main__":
    unittest.main()
