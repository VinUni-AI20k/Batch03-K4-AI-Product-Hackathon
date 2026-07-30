"""Manual smoke test for the Google Gmail MCP connection.

Run after ``pip install -e .`` from the gmail_mcp_client directory.
This script uses in-memory OAuth storage, so it never writes tokens to disk.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
from typing import Any

from gmail_mcp_client import GmailMcpClient
from gmail_mcp_client.config import load_mcp_env


def json_default(value: Any) -> Any:
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    return str(value)


async def run(args: argparse.Namespace) -> None:
    client = GmailMcpClient()
    async with client.connect() as gmail:
        if args.search:
            result = await gmail.search(args.search)
            print(json.dumps(result, ensure_ascii=False, indent=2, default=json_default))
            return

        if args.thread_id:
            result = await gmail.read_thread(args.thread_id)
            print(json.dumps(result, ensure_ascii=False, indent=2, default=json_default))
            return

        tools = [tool.name for tool in gmail.list_tools()]
        required = {"search_threads", "get_thread"}
        print("Connected to Gmail MCP successfully.")
        print("Available tools:", ", ".join(tools))
        missing = required - set(tools)
        if missing:
            raise RuntimeError(f"Expected Gmail read tools missing: {', '.join(sorted(missing))}")
        print("Read tools verified: search_threads, get_thread")


def main() -> None:
    parser = argparse.ArgumentParser(description="Manual Gmail MCP smoke test")
    actions = parser.add_mutually_exclusive_group()
    actions.add_argument("--search", metavar="QUERY", help="Run a Gmail search query")
    actions.add_argument("--thread-id", help="Read one Gmail thread")
    args = parser.parse_args()

    load_mcp_env()
    try:
        asyncio.run(run(args))
    except Exception as error:
        print(f"Gmail MCP test failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error


if __name__ == "__main__":
    main()
