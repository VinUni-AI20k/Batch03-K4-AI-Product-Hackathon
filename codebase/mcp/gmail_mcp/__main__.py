import asyncio

from . import config, gmail_client
from .server import mcp


async def main() -> None:
    print("Checking Gmail credentials...")
    if not config.GOOGLE_TOKEN_FILE.exists():
        print(
            f"No Gmail token found at {config.GOOGLE_TOKEN_FILE} yet — connect Gmail via "
            "the backend (\"Quản lý kết nối\" > Gmail) first; tool calls will fail until "
            "that file exists, but the server will still start."
        )
    else:
        # get_service() is blocking (refreshes the token if needed), so it
        # runs off the event loop.
        await asyncio.to_thread(gmail_client.get_service)
        print("Authenticated with Gmail.")

    url = f"http://{config.MCP_HOST}:{config.MCP_PORT}{mcp.settings.streamable_http_path}"
    print(f"Starting MCP server (streamable-http) at {url}")
    await mcp.run_streamable_http_async()


if __name__ == "__main__":
    asyncio.run(main())
