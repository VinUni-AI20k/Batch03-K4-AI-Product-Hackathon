"""Command line interface for inspecting and reading a Gmail MCP server."""

from __future__ import annotations

import argparse
import asyncio
import json
from typing import Any

from .client import GmailMcpClient
from .config import load_codebase_env


def _json_default(value: Any) -> Any:
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if hasattr(value, "__dict__"):
        return value.__dict__
    return str(value)


async def run(args: argparse.Namespace) -> None:
    client = GmailMcpClient()
    async with client.connect() as gmail:
        if args.command == "tools":
            result = gmail.list_tools()
        elif args.command == "search":
            result = await gmail.search(args.query)
        else:
            result = await gmail.read_thread(args.thread_id)
        print(json.dumps(result, indent=2, default=_json_default, ensure_ascii=False))


def main() -> None:
    load_codebase_env()
    parser = argparse.ArgumentParser(description="Connect to a Gmail MCP server")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("tools", help="List tools exposed by the MCP server")
    search_parser = subparsers.add_parser("search", help="Search Gmail")
    search_parser.add_argument("query", help="Gmail search query, e.g. is:unread newer_than:2d")
    read_parser = subparsers.add_parser("read", help="Read a Gmail thread by thread ID")
    read_parser.add_argument("thread_id")
    asyncio.run(run(parser.parse_args()))


if __name__ == "__main__":
    main()
