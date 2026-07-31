import json
from typing import Optional

import discord

from . import discord_bot
from .discord_bot import client
from .server import mcp

MAX_MESSAGE_COUNT = 100
DEFAULT_MESSAGE_COUNT = 100


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def _format_file_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    if num_bytes < 1024 * 1024 * 1024:
        return f"{num_bytes / (1024 * 1024):.1f} MB"
    return f"{num_bytes / (1024 * 1024 * 1024):.1f} GB"


def _format_attachment_summary(attachment: discord.Attachment) -> str:
    content_type = attachment.content_type or "unknown"
    return (
        f"(Attachment ID: {attachment.id}) `{attachment.filename}` "
        f"({_format_file_size(attachment.size)}, {content_type}) URL: {attachment.url}"
    )


def _format_message(message: discord.Message) -> str:
    lines = [
        f"- (ID: {message.id}) **[{message.author.name}]** `{message.created_at.isoformat()}`: ```{message.content}```"
    ]
    if message.attachments:
        lines.append("  Attachments:")
        for attachment in message.attachments:
            lines.append(f"    - {_format_attachment_summary(attachment)}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Server info
# ---------------------------------------------------------------------------

@mcp.tool(
    name="list_my_guilds",
    description="List every guild (server) this bot is currently a member of — a bot can be in "
    "more than one. Connection-management action for the backend's 'Quản lý kết nối' UI — not "
    "for the chat agent.",
)
async def list_my_guilds() -> str:
    guilds = [
        {"id": str(guild.id), "name": guild.name, "member_count": guild.member_count}
        for guild in client.guilds
    ]
    return json.dumps(guilds)


@mcp.tool(
    name="list_guilds",
    description="List every Discord server (guild) this bot has been invited into and can currently see.",
)
async def list_guilds() -> str:
    guilds = client.guilds
    if not guilds:
        return "Bot chưa được mời vào server Discord nào."
    lines = [f"**Bot hiện có mặt trong {len(guilds)} server:**"]
    for guild in guilds:
        lines.append(f"- (ID: {guild.id}) **{guild.name}** — {guild.member_count} thành viên")
    return "\n".join(lines)


@mcp.tool(name="get_server_info", description="Get detailed Discord server information")
async def get_server_info(guild_id: Optional[str] = None) -> str:
    guild = await discord_bot.resolve_guild(guild_id)
    owner = guild.owner or (await guild.fetch_member(guild.owner_id) if guild.owner_id else None)
    return (
        f"**Server Info**\n"
        f"- Name: {guild.name}\n"
        f"- ID: {guild.id}\n"
        f"- Owner: {owner} (ID: {guild.owner_id})\n"
        f"- Member count: {guild.member_count}\n"
        f"- Channel count: {len(guild.channels)}\n"
        f"- Role count: {len(guild.roles)}\n"
        f"- Boost tier: {guild.premium_tier} ({guild.premium_subscription_count} boosts)\n"
        f"- Created at: {guild.created_at.isoformat()}"
    )


@mcp.tool(
    name="leave_guild",
    description="Make the bot leave a specific guild. Connection-management action for the "
    "backend's 'Quản lý kết nối' UI — not for the chat agent to call on its own.",
)
async def leave_guild(guild_id: Optional[str] = None) -> str:
    guild = await discord_bot.resolve_guild(guild_id)
    name, gid = guild.name, guild.id
    await guild.leave()
    return f"Left guild: {name} (ID: {gid})"


# ---------------------------------------------------------------------------
# Channel management
# ---------------------------------------------------------------------------

@mcp.tool(
    name="list_channels",
    description=(
        "List all channels in the server, grouped by category. output='text' (default) returns a "
        "formatted listing for chat; output='json' returns structured records (id, name, type, "
        "category) for ingestion callers."
    ),
)
async def list_channels(guild_id: Optional[str] = None, output: str = "text") -> str:
    if output not in ("text", "json"):
        raise ValueError("output must be 'text' or 'json'")
    guild = await discord_bot.resolve_guild(guild_id)
    channels = sorted(guild.channels, key=lambda c: (c.position if hasattr(c, "position") else 0))

    if output == "json":
        return json.dumps([
            {
                "id": str(channel.id),
                "name": getattr(channel, "name", ""),
                "type": channel.type.name,
                "category": channel.category.name if channel.category else "",
            }
            for channel in channels
        ])

    if not channels:
        return "No channels found."
    lines = [f"**Found {len(channels)} channel(s):**"]
    for channel in channels:
        category = f" [category: {channel.category.name}]" if channel.category else ""
        lines.append(f"- (ID: {channel.id}) `{channel.name}` type={channel.type.name}{category}")
    return "\n".join(lines)


@mcp.tool(name="get_channel_info", description="Get detailed information about a channel")
async def get_channel_info(channel_id: str) -> str:
    channel = await discord_bot.resolve_channel(channel_id)
    lines = [
        "**Channel Info**",
        f"- Name: {getattr(channel, 'name', 'n/a')}",
        f"- ID: {channel.id}",
        f"- Type: {channel.type.name}",
        f"- Guild: {channel.guild.name} (ID: {channel.guild.id})",
    ]
    if isinstance(channel, discord.TextChannel):
        lines.append(f"- Topic: {channel.topic or '(none)'}")
        lines.append(f"- NSFW: {channel.nsfw}")
        lines.append(f"- Slowmode: {channel.slowmode_delay}s")
        if channel.category:
            lines.append(f"- Category: {channel.category.name} (ID: {channel.category.id})")
    return "\n".join(lines)


@mcp.tool(name="find_channel", description="Find a channel's type and ID by name")
async def find_channel(name: str, guild_id: Optional[str] = None) -> str:
    if not name:
        raise ValueError("name cannot be empty")
    guild = await discord_bot.resolve_guild(guild_id)
    matches = [c for c in guild.channels if c.name.lower() == name.lower()]
    if not matches:
        matches = [c for c in guild.channels if name.lower() in c.name.lower()]
    if not matches:
        return f"No channel found matching name: {name}"
    lines = [f"**Found {len(matches)} matching channel(s):**"]
    for channel in matches:
        lines.append(f"- (ID: {channel.id}) `{channel.name}` type={channel.type.name}")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# User management
# ---------------------------------------------------------------------------

@mcp.tool(name="get_user_id_by_name", description="Get a Discord user's ID by username in a guild, for ping usage <@id>")
async def get_user_id_by_name(username: str, guild_id: Optional[str] = None) -> str:
    if not username:
        raise ValueError("username cannot be empty")
    guild = await discord_bot.resolve_guild(guild_id)

    member = guild.get_member_named(username)
    if member is None:
        candidates = await guild.query_members(query=username, limit=5)
        if not candidates:
            raise ValueError(f"User not found by username: {username}")
        exact = [
            m for m in candidates
            if m.name.lower() == username.lower() or (m.nick and m.nick.lower() == username.lower())
        ]
        member = exact[0] if exact else candidates[0]

    return f"Found user: {member.name} (ID: {member.id}). Ping usage: <@{member.id}>"


@mcp.tool(name="send_private_message", description="Send a private (DM) message to a specific user")
async def send_private_message(user_id: str, message: str) -> str:
    if not user_id:
        raise ValueError("userId cannot be empty")
    if not message:
        raise ValueError("message cannot be empty")

    numeric_id = discord_bot.parse_id(user_id, "userId")
    user = client.get_user(numeric_id)
    if user is None:
        try:
            user = await client.fetch_user(numeric_id)
        except discord.NotFound:
            raise ValueError(f"User not found by userId: {user_id}")

    dm_channel = user.dm_channel or await user.create_dm()
    sent = await dm_channel.send(message)
    return f"Private message sent successfully. Message link: {sent.jump_url}"


# ---------------------------------------------------------------------------
# Message management
# ---------------------------------------------------------------------------

@mcp.tool(name="send_message", description="Send a message to a specific channel")
async def send_message(channel_id: str, message: str) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if not message:
        raise ValueError("message cannot be empty")

    channel = await discord_bot.resolve_message_channel(channel_id)
    sent = await channel.send(message)
    return f"Message sent successfully. Message link: {sent.jump_url}"


@mcp.tool(name="edit_message", description="Edit a message in a specific channel")
async def edit_message(channel_id: str, message_id: str, new_message: str) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if not message_id:
        raise ValueError("messageId cannot be empty")
    if not new_message:
        raise ValueError("newMessage cannot be empty")

    channel = await discord_bot.resolve_message_channel(channel_id)
    message_numeric_id = discord_bot.parse_id(message_id, "messageId")
    try:
        message = await channel.fetch_message(message_numeric_id)
    except discord.NotFound:
        raise ValueError(f"Message not found by messageId: {message_id}")

    edited = await message.edit(content=new_message)
    return f"Message edited successfully. Message link: {edited.jump_url}"


@mcp.tool(name="delete_message", description="Delete a message from a specific channel")
async def delete_message(channel_id: str, message_id: str) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if not message_id:
        raise ValueError("messageId cannot be empty")

    channel = await discord_bot.resolve_message_channel(channel_id)
    message_numeric_id = discord_bot.parse_id(message_id, "messageId")
    try:
        message = await channel.fetch_message(message_numeric_id)
    except discord.NotFound:
        raise ValueError(f"Message not found by messageId: {message_id}")

    await message.delete()
    return "Message deleted successfully"


def _parse_message_count(count: Optional[str]) -> int:
    if count is None or count == "":
        return DEFAULT_MESSAGE_COUNT
    try:
        limit = int(count)
    except ValueError:
        raise ValueError("count must be an integer between 1 and 100")
    if limit < 1 or limit > MAX_MESSAGE_COUNT:
        raise ValueError("count must be between 1 and 100")
    return limit


def _validate_cursors(before: Optional[str], after: Optional[str], around: Optional[str]) -> None:
    provided = [c for c in (before, after, around) if c]
    if len(provided) > 1:
        raise ValueError("before, after, and around are mutually exclusive; provide only one")


def _message_json(message: discord.Message) -> dict:
    """Structured form of one message — for ingestion callers that need to
    chunk/paginate by message boundary, not free text. Mirrors
    gmail_mcp/tools.py's output=json addition for the same reason."""
    return {
        "id": str(message.id),
        "author": message.author.name,
        "created_at": message.created_at.isoformat(),
        "content": message.content,
        "attachments": [a.filename for a in message.attachments],
        "is_bot": bool(message.author.bot),
    }


@mcp.tool(
    name="read_messages",
    description=(
        "Read message history from a specific channel, optionally paginated with before/after/around "
        "cursors. output='text' (default) returns a formatted listing for chat; output='json' returns "
        "structured records (id, author, created_at, content, is_bot) for ingestion callers."
    ),
)
async def read_messages(
    channel_id: str,
    count: Optional[str] = None,
    before: Optional[str] = None,
    after: Optional[str] = None,
    around: Optional[str] = None,
    output: str = "text",
) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if output not in ("text", "json"):
        raise ValueError("output must be 'text' or 'json'")
    limit = _parse_message_count(count)
    _validate_cursors(before, after, around)

    channel = await discord_bot.resolve_message_channel(channel_id)

    history_kwargs: dict = {"limit": limit}
    if before:
        history_kwargs["before"] = discord.Object(id=discord_bot.parse_id(before, "before"))
    elif after:
        history_kwargs["after"] = discord.Object(id=discord_bot.parse_id(after, "after"))
    elif around:
        history_kwargs["around"] = discord.Object(id=discord_bot.parse_id(around, "around"))

    messages = [m async for m in channel.history(**history_kwargs)]

    if output == "json":
        return json.dumps([_message_json(m) for m in messages])

    formatted = "\n".join(_format_message(m) for m in messages)
    return f"**Retrieved {len(messages)} messages:**\n{formatted}"


@mcp.tool(name="add_reaction", description="Add a reaction (emoji) to a specific message")
async def add_reaction(channel_id: str, message_id: str, emoji: str) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if not message_id:
        raise ValueError("messageId cannot be empty")
    if not emoji:
        raise ValueError("emoji cannot be empty")

    channel = await discord_bot.resolve_message_channel(channel_id)
    message_numeric_id = discord_bot.parse_id(message_id, "messageId")
    try:
        message = await channel.fetch_message(message_numeric_id)
    except discord.NotFound:
        raise ValueError(f"Message not found by messageId: {message_id}")

    await message.add_reaction(emoji)
    return f"Added reaction successfully. Message link: {message.jump_url}"


@mcp.tool(name="remove_reaction", description="Remove the bot's reaction (emoji) from a message")
async def remove_reaction(channel_id: str, message_id: str, emoji: str) -> str:
    if not channel_id:
        raise ValueError("channelId cannot be empty")
    if not message_id:
        raise ValueError("messageId cannot be empty")
    if not emoji:
        raise ValueError("emoji cannot be empty")

    channel = await discord_bot.resolve_message_channel(channel_id)
    message_numeric_id = discord_bot.parse_id(message_id, "messageId")
    try:
        message = await channel.fetch_message(message_numeric_id)
    except discord.NotFound:
        raise ValueError(f"Message not found by messageId: {message_id}")

    await message.remove_reaction(emoji, client.user)
    return f"Removed reaction successfully. Message link: {message.jump_url}"
