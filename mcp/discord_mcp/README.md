# discord-mcp (Python)

A local MCP server for Discord, built with the official `mcp` Python SDK's
`FastMCP` (decorator-based tools, same idea as the Java example in
`../example/discord-mcp`, just Python + `discord.py` instead of Spring AI + JDA).

Tools talk to Discord over plain REST calls on demand (via `discord.py`'s
client, no bot command framework) — there's no persistent event loop reacting
to messages, so it fits an MCP request/response model rather than running
as a always-on chat bot.

## Setup

```bash
cd mcp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DISCORD_TOKEN (and DISCORD_GUILD_ID if you want it as a default)
```

### Creating the Discord bot + token

1. https://discord.com/developers/applications → New Application → Bot tab → Reset/copy token → put it in `.env` as `DISCORD_TOKEN`.
2. On the same Bot tab, enable **Privileged Gateway Intents**: `Server Members Intent` and `Message Content Intent`. Both are required — `get_user_id_by_name` needs members, and reading message content (`read_messages`) needs message content.
3. OAuth2 → URL Generator → scope `bot`, permissions at least: View Channels, Send Messages, Read Message History, Add Reactions, Manage Messages (for edit/delete). Use the generated URL to invite the bot to your course's Discord server.
4. Right-click the server icon → Copy Server ID (enable Developer Mode in Discord settings first) → put it in `.env` as `DISCORD_GUILD_ID` if you want `guild_id` to be optional on every tool call.

## Run

```bash
python -m discord_mcp
```

Starts the Discord gateway connection, then serves MCP over streamable-http at:

```
http://localhost:8085/mcp
```

## Connecting your agent

Point your agent's MCP client at `http://localhost:8085/mcp` using the
streamable-http transport. Since this isn't Claude Desktop/Code, there's no
`mcpServers` JSON needed — just whatever your agent framework's MCP client
config expects (server URL + transport type).

## Available tools

| Tool | Description |
|---|---|
| `get_server_info` | Server name, owner, member/channel/role counts, boost tier |
| `list_channels` | List all channels, grouped by category |
| `get_channel_info` | Detailed info about one channel |
| `find_channel` | Find a channel's ID/type by name |
| `get_user_id_by_name` | Look up a member's ID by username/nickname |
| `send_private_message` | DM a user |
| `send_message` | Send a message to a channel |
| `edit_message` | Edit a message |
| `delete_message` | Delete a message |
| `read_messages` | Read channel history (`count` 1-100, optional `before`/`after`/`around` cursor) |
| `add_reaction` | Add an emoji reaction to a message |
| `remove_reaction` | Remove the bot's own emoji reaction from a message |

If `DISCORD_GUILD_ID` is set in `.env`, `guild_id` becomes optional on every tool that takes it.

This is a lean subset of the Java example's ~80 tools — just what's needed to
read/answer questions in a course Discord and mine channel history. Add more
tools in `discord_mcp/tools.py` (they auto-register via `@mcp.tool()`) if the
agent needs more, e.g. roles or moderation.
