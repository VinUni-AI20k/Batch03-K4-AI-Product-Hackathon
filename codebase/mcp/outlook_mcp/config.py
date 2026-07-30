import os

from dotenv import load_dotenv

load_dotenv()

# "outlook-desktop" — Microsoft's own well-known first-party public client ID
# for the Outlook desktop app, reused here so no Azure app registration is
# needed. It forces device-code auth (see InferAuthMethod in the upstream Go
# project): the container prints a URL + short code to stderr and polls
# Microsoft's token endpoint, no redirect URI required.
OUTLOOK_MCP_CLIENT_ID = os.environ.get("OUTLOOK_MCP_CLIENT_ID", "d3590ed6-52b3-4102-aeff-aad2292ab01c")
OUTLOOK_MCP_TENANT_ID = os.environ.get("OUTLOOK_MCP_TENANT_ID", "common")

OUTLOOK_MCP_IMAGE = os.environ.get("OUTLOOK_MCP_IMAGE", "outlook-local-mcp:local")
# Named Docker volume (not a host path) so the cached device-code token
# survives across container runs without depending on a specific host dir.
OUTLOOK_MCP_VOLUME = os.environ.get("OUTLOOK_MCP_VOLUME", "outlook-mcp-auth")

OUTLOOK_MCP_MAIL_ENABLED = os.environ.get("OUTLOOK_MCP_MAIL_ENABLED", "true")
OUTLOOK_MCP_MAIL_MANAGE_ENABLED = os.environ.get("OUTLOOK_MCP_MAIL_MANAGE_ENABLED", "false")
OUTLOOK_MCP_READ_ONLY = os.environ.get("OUTLOOK_MCP_READ_ONLY", "false")
OUTLOOK_MCP_DEFAULT_TIMEZONE = os.environ.get("OUTLOOK_MCP_DEFAULT_TIMEZONE", "Asia/Ho_Chi_Minh")
OUTLOOK_MCP_LOG_LEVEL = os.environ.get("OUTLOOK_MCP_LOG_LEVEL", "warn")


def docker_run_args() -> list[str]:
    """Args for `docker run` that start the container as an MCP stdio server.

    -i keeps stdin open (required: that's the MCP transport). No -t (no TTY)
    since this runs unattended from Python, not a terminal — device-code
    auth doesn't need one, it just prints to stderr and polls.
    """
    return [
        "run",
        "--rm",
        "-i",
        "-v",
        f"{OUTLOOK_MCP_VOLUME}:/data/auth",
        "-e",
        f"OUTLOOK_MCP_CLIENT_ID={OUTLOOK_MCP_CLIENT_ID}",
        "-e",
        f"OUTLOOK_MCP_TENANT_ID={OUTLOOK_MCP_TENANT_ID}",
        "-e",
        f"OUTLOOK_MCP_MAIL_ENABLED={OUTLOOK_MCP_MAIL_ENABLED}",
        "-e",
        f"OUTLOOK_MCP_MAIL_MANAGE_ENABLED={OUTLOOK_MCP_MAIL_MANAGE_ENABLED}",
        "-e",
        f"OUTLOOK_MCP_READ_ONLY={OUTLOOK_MCP_READ_ONLY}",
        "-e",
        f"OUTLOOK_MCP_DEFAULT_TIMEZONE={OUTLOOK_MCP_DEFAULT_TIMEZONE}",
        "-e",
        f"OUTLOOK_MCP_LOG_LEVEL={OUTLOOK_MCP_LOG_LEVEL}",
        OUTLOOK_MCP_IMAGE,
    ]
