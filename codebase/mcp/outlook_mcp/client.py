from contextlib import AsyncExitStack
from datetime import timedelta
from typing import Any, Optional

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import Tool

from . import config

# Device-code auth (first run, or whenever the cached token has expired) can
# sit waiting on the user for a while — the container polls Microsoft's token
# endpoint until they finish signing in in a browser. Give the very first
# call plenty of room instead of timing out the whole flow.
FIRST_CALL_TIMEOUT = timedelta(minutes=15)
DEFAULT_CALL_TIMEOUT = timedelta(seconds=60)


class OutlookMCPClient:
    """A generic MCP client that speaks to the outlook-local-mcp Go server
    over stdio, spawned as `docker run -i --rm ...` (see config.docker_run_args).

    The container is stdio-only (no HTTP mode), so unlike discord_mcp /
    gmail_mcp this isn't a server your agent connects to over a
    port — it's a subprocess your agent's Python process holds open and
    talks MCP to directly, the same way Claude Desktop's `"command": "docker"`
    config does, just from Python instead of a GUI.

    Usage:
        async with OutlookMCPClient() as outlook:
            tools = await outlook.list_tools()
            result = await outlook.call_tool("calendar", {"operation": "list_events", "date": "today"})
    """

    def __init__(self) -> None:
        self._stack: Optional[AsyncExitStack] = None
        self._session: Optional[ClientSession] = None
        self._first_call_done = False

    async def __aenter__(self) -> "OutlookMCPClient":
        self._stack = AsyncExitStack()
        params = StdioServerParameters(command="docker", args=config.docker_run_args())
        read, write = await self._stack.enter_async_context(stdio_client(params))
        self._session = await self._stack.enter_async_context(ClientSession(read, write))
        await self._session.initialize()
        return self

    async def __aexit__(self, *exc_info: object) -> None:
        if self._stack is not None:
            await self._stack.aclose()
        self._stack = None
        self._session = None

    @property
    def session(self) -> ClientSession:
        if self._session is None:
            raise RuntimeError("OutlookMCPClient must be used as `async with OutlookMCPClient() as outlook:`")
        return self._session

    async def list_tools(self) -> list[Tool]:
        return (await self.session.list_tools()).tools

    async def call_tool(self, name: str, arguments: dict[str, Any]) -> str:
        """Call a tool and return its text content, raising on tool error.

        The first call on a fresh container/volume may block for a while on
        interactive device-code auth (URL + code printed to this process's
        stderr) — see FIRST_CALL_TIMEOUT.
        """
        timeout = FIRST_CALL_TIMEOUT if not self._first_call_done else DEFAULT_CALL_TIMEOUT
        result = await self.session.call_tool(name, arguments, read_timeout_seconds=timeout)
        self._first_call_done = True

        text = "\n".join(block.text for block in result.content if hasattr(block, "text"))
        if result.isError:
            raise RuntimeError(f"Outlook MCP tool '{name}' returned an error: {text}")
        return text
