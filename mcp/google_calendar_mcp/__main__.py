import asyncio

from . import calendar_client, config
from .server import mcp


async def main() -> None:
    print("Authenticating with Google Calendar...")
    if not config.GOOGLE_CALENDAR_TOKEN_FILE.exists():
        print("No cached token found — a browser window will open for you to grant access.")
    # get_service() is blocking (may run the interactive OAuth flow), so it
    # runs off the event loop.
    await asyncio.to_thread(calendar_client.get_service)
    print(f"Authenticated. Using calendar: {config.GOOGLE_CALENDAR_ID}")

    url = f"http://{config.MCP_HOST}:{config.MCP_PORT}{mcp.settings.streamable_http_path}"
    print(f"Starting MCP server (streamable-http) at {url}")
    await mcp.run_streamable_http_async()


if __name__ == "__main__":
    asyncio.run(main())
