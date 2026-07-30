import os
import sys

from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN = os.environ.get("DISCORD_TOKEN", "").strip()
MCP_HOST = os.environ.get("MCP_HOST", "0.0.0.0")
MCP_PORT = int(os.environ.get("MCP_PORT", "8085"))

if not DISCORD_TOKEN:
    print("ERROR: The environment variable DISCORD_TOKEN is not set. Please set it to run the application properly.", file=sys.stderr)
    sys.exit(1)
