import asyncio

from . import config
from .discord_bot import client, start_bot
from .server import mcp


async def main() -> None:
    print("Connecting to Discord...")
    try:
        bot_task = await start_bot()
        print(f"Logged in to Discord as {client.user} (ID: {client.user.id})")

        url = f"http://{config.MCP_HOST}:{config.MCP_PORT}{mcp.settings.streamable_http_path}"
        print(f"Starting MCP server (streamable-http) at {url}")
        await mcp.run_streamable_http_async()
    finally:
        await client.close()


if __name__ == "__main__":
    asyncio.run(main())
