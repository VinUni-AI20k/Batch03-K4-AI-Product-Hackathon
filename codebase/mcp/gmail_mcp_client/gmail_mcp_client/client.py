"""Async client for a Gmail MCP server exposed via Streamable HTTP."""

from __future__ import annotations

import os
import webbrowser
from collections.abc import AsyncIterator, Mapping
from contextlib import asynccontextmanager
from typing import Any
from urllib.parse import parse_qs, urlparse

import httpx
from mcp import ClientSession
from mcp.client.auth import OAuthClientProvider, TokenStorage
from mcp.client.streamable_http import streamable_http_client
from mcp.shared.auth import OAuthClientInformationFull, OAuthClientMetadata, OAuthToken
from pydantic import AnyUrl

SEARCH_TOOL_CANDIDATES = (
    "search_threads", "search_emails", "search_email", "list_emails", "gmail_search",
)
READ_TOOL_CANDIDATES = (
    "get_thread", "get_email", "read_email", "get_message", "read_message",
)
GOOGLE_GMAIL_MCP_URL = "https://gmailmcp.googleapis.com/mcp/v1"
GMAIL_READ_SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose"
READ_ONLY_TOOLS = {"search_threads", "get_thread", "list_labels", "list_drafts"}


class InMemoryTokenStorage(TokenStorage):
    """Ephemeral storage useful only for local development and tests.

    Production multi-user apps must provide their own TokenStorage backed by an
    encrypted, per-user secret store.
    """

    def __init__(self, client_info: OAuthClientInformationFull) -> None:
        self.client_info = client_info
        self.tokens: OAuthToken | None = None

    async def get_tokens(self) -> OAuthToken | None:
        return self.tokens

    async def set_tokens(self, tokens: OAuthToken) -> None:
        self.tokens = tokens

    async def get_client_info(self) -> OAuthClientInformationFull | None:
        return self.client_info

    async def set_client_info(self, client_info: OAuthClientInformationFull) -> None:
        self.client_info = client_info


class GmailMcpClient:
    """Connect to a Gmail MCP server and invoke its tools.

    OAuth and Gmail scopes are owned by the MCP server. If the server requires a
    bearer token, provide ``access_token`` or set ``GMAIL_MCP_ACCESS_TOKEN``.
    """

    def __init__(
        self,
        url: str | None = None,
        access_token: str | None = None,
        token_storage: TokenStorage | None = None,
    ) -> None:
        self.url = url or os.environ.get("GMAIL_MCP_URL", GOOGLE_GMAIL_MCP_URL)
        self.access_token = access_token or os.environ.get("GMAIL_MCP_ACCESS_TOKEN")
        self.token_storage = token_storage
        self._tools: dict[str, Any] = {}

    @asynccontextmanager
    async def connect(self) -> AsyncIterator["ConnectedGmailMcpClient"]:
        """Open and initialize one MCP session; always close it on exit."""
        async with self._http_client() as http_client:
            async with streamable_http_client(self.url, http_client=http_client) as (read, write, _):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    tools = await session.list_tools()
                    self._tools = {tool.name: tool for tool in tools.tools}
                    yield ConnectedGmailMcpClient(session, self._tools)

    @asynccontextmanager
    async def _http_client(self) -> AsyncIterator[httpx.AsyncClient]:
        if self.access_token:
            async with httpx.AsyncClient(headers={"Authorization": f"Bearer {self.access_token}"}) as client:
                yield client
            return

        client_id = os.environ.get("GMAIL_MCP_OAUTH_CLIENT_ID")
        client_secret = os.environ.get("GMAIL_MCP_OAUTH_CLIENT_SECRET")
        redirect_uri = os.environ.get("GMAIL_MCP_OAUTH_REDIRECT_URI", "http://localhost:8765/oauth/callback")
        if not client_id or not client_secret:
            raise ValueError("Set GMAIL_MCP_OAUTH_CLIENT_ID and GMAIL_MCP_OAUTH_CLIENT_SECRET, or GMAIL_MCP_ACCESS_TOKEN")

        client_info = OAuthClientInformationFull(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uris=[AnyUrl(redirect_uri)],
            token_endpoint_auth_method="client_secret_post",
            grant_types=["authorization_code", "refresh_token"],
            response_types=["code"],
            scope=GMAIL_READ_SCOPES,
        )
        # No local JSON persistence. In a multi-user service, pass a storage
        # object scoped to the authenticated user and backed by encrypted data.
        storage = self.token_storage or InMemoryTokenStorage(client_info)

        async def show_authorization_url(auth_url: str) -> None:
            print(f"Open this URL to authorize Gmail MCP:\n{auth_url}")
            webbrowser.open(auth_url)

        async def receive_callback() -> tuple[str, str | None]:
            callback_url = input("Paste the full redirect URL after signing in: ").strip()
            params = parse_qs(urlparse(callback_url).query)
            if "error" in params:
                raise RuntimeError(f"OAuth authorization failed: {params['error'][0]}")
            if "code" not in params:
                raise ValueError("Redirect URL does not contain an OAuth code")
            return params["code"][0], params.get("state", [None])[0]

        oauth = OAuthClientProvider(
            server_url=self.url,
            client_metadata=OAuthClientMetadata(
                client_name="gmail-mcp-client",
                redirect_uris=[AnyUrl(redirect_uri)],
                grant_types=["authorization_code", "refresh_token"],
                response_types=["code"],
                scope=GMAIL_READ_SCOPES,
            ),
            storage=storage,
            redirect_handler=show_authorization_url,
            callback_handler=receive_callback,
        )
        async with httpx.AsyncClient(auth=oauth, follow_redirects=True) as client:
            yield client


class ConnectedGmailMcpClient:
    """Operations available while the parent client's ``connect`` context is open."""

    def __init__(self, session: ClientSession, tools: Mapping[str, Any]) -> None:
        self._session = session
        self._tools = tools
        self._allow_writes = os.environ.get("GMAIL_MCP_ALLOW_WRITE", "false").lower() == "true"

    def list_tools(self) -> list[Any]:
        """Return metadata for tools advertised by this server."""
        return list(self._tools.values())

    async def call_tool(self, name: str, arguments: dict[str, Any] | None = None) -> Any:
        """Call any Gmail MCP tool by its server-defined name."""
        if not self._allow_writes and name not in READ_ONLY_TOOLS:
            raise PermissionError(
                f"Refusing non-read Gmail MCP tool '{name}'. "
                "Set GMAIL_MCP_ALLOW_WRITE=true only after explicit user approval."
            )
        return await self._session.call_tool(name, arguments or {})

    async def search(self, query: str, **extra_arguments: Any) -> Any:
        tool = self._find_tool(os.environ.get("GMAIL_MCP_SEARCH_TOOL"), SEARCH_TOOL_CANDIDATES)
        return await self.call_tool(tool, {"query": query, **extra_arguments})

    async def read_thread(self, thread_id: str, **extra_arguments: Any) -> Any:
        tool = self._find_tool(os.environ.get("GMAIL_MCP_READ_TOOL"), READ_TOOL_CANDIDATES)
        return await self.call_tool(tool, {"thread_id": thread_id, **extra_arguments})

    async def read_message(self, message_id: str, **extra_arguments: Any) -> Any:
        """Compatibility alias; Google Gmail MCP returns complete threads."""
        return await self.read_thread(message_id, **extra_arguments)

    def _find_tool(self, configured_name: str | None, candidates: tuple[str, ...]) -> str:
        if configured_name and configured_name in self._tools:
            return configured_name
        for name in candidates:
            if name in self._tools:
                return name
        available = ", ".join(self._tools) or "(none)"
        raise LookupError(
            f"No compatible Gmail tool found. Available tools: {available}. "
            "Set GMAIL_MCP_SEARCH_TOOL or GMAIL_MCP_READ_TOOL to the correct tool name."
        )
