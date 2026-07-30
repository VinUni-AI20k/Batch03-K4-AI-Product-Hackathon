from mcp.server.fastmcp import FastMCP

from . import config

mcp = FastMCP(
    "discord-mcp",
    host=config.MCP_HOST,
    port=config.MCP_PORT,
)

# Importing tools registers every @mcp.tool() defined there. Must come after
# `mcp` is created since tools.py does `from .server import mcp`.
from . import tools  # noqa: E402,F401
