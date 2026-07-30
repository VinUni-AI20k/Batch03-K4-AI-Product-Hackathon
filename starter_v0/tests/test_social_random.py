from __future__ import annotations

import unittest
from unittest.mock import patch

from tools.search_social_topic.tool import search_social_topic


class RandomSocialSearchTests(unittest.TestCase):
    @patch("tools.search_social_topic.tool.secrets.choice", return_value="science")
    @patch("tools.search_social_topic.tool.search_tweets")
    def test_random_request_runs_without_missing_info(self, search, choice) -> None:
        search.return_value = {"tool": "search_tweets", "items": [{"title": "Post"}]}

        result = search_social_topic(
            query="random",
            random_mode=True,
            search_type="Latest",
            limit=4,
        )

        choice.assert_called_once()
        search.assert_called_once_with(query="science", search_type="Latest", limit=4)
        self.assertTrue(result["random_mode"])
        self.assertEqual(result["selected_topic"], "science")
        self.assertEqual(result["requested_query"], "random")

    @patch("tools.search_social_topic.tool.search_tweets")
    def test_vietnamese_random_phrase_is_recognized(self, search) -> None:
        search.return_value = {"tool": "search_tweets", "items": []}
        with patch("tools.search_social_topic.tool.secrets.choice", return_value="AI"):
            result = search_social_topic(query="ngẫu nhiên", limit=3)

        search.assert_called_once_with(query="AI", search_type="Latest", limit=3)
        self.assertTrue(result["random_mode"])

    @patch("tools.search_social_topic.tool.search_tweets")
    def test_empty_non_random_query_does_not_hit_api(self, search) -> None:
        result = search_social_topic(query="", random_mode=False)

        search.assert_not_called()
        self.assertEqual(result["status"], "missing_query")


if __name__ == "__main__":
    unittest.main()
