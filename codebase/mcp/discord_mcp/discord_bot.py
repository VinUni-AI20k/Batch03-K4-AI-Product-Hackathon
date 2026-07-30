import asyncio
from typing import Optional

import discord

from . import config

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

client = discord.Client(intents=intents)


async def start_bot() -> asyncio.Task:
    """Log in (surfaces bad-token errors immediately), then run the gateway
    connection in the background and wait until ready.

    `client.start()` is login() + connect(); backgrounding the whole thing
    races wait_until_ready() against login() setting up the _ready event, so
    login is awaited directly here and only the long-running connect() is
    backgrounded.
    """
    await client.login(config.DISCORD_TOKEN)
    connect_task = asyncio.create_task(client.connect(reconnect=True))
    ready_task = asyncio.create_task(client.wait_until_ready())

    # Race the two: if the gateway connection dies (e.g. disallowed
    # privileged intents -> PrivilegedIntentsRequired) before READY is ever
    # received, connect_task finishes first and we must surface that error
    # instead of waiting on ready_task forever.
    done, _ = await asyncio.wait({connect_task, ready_task}, return_when=asyncio.FIRST_COMPLETED)
    if ready_task not in done:
        ready_task.cancel()
        raise connect_task.exception() or RuntimeError(
            "Discord gateway connection closed before the client became ready"
        )
    return connect_task


def parse_id(raw_id: str, label: str) -> int:
    try:
        return int(raw_id)
    except (TypeError, ValueError):
        raise ValueError(f"{label} must be a numeric Discord snowflake, got: {raw_id!r}")


async def resolve_guild(guild_id: Optional[str] = None) -> discord.Guild:
    if guild_id:
        numeric_id = parse_id(guild_id, "guildId")
        guild = client.get_guild(numeric_id)
        if guild is not None:
            return guild
        try:
            return await client.fetch_guild(numeric_id)
        except discord.NotFound:
            raise ValueError(f"Guild not found by guildId: {guild_id}")

    # No guild_id given — resolve dynamically from whatever guilds the bot
    # is actually in right now (list_guilds) rather than a static config
    # default, since which servers the bot has been invited into can change
    # at any time and it can be in more than one at once.
    guilds = client.guilds
    if len(guilds) == 1:
        return guilds[0]
    if not guilds:
        raise ValueError("Bot is not currently a member of any Discord server — invite it first.")
    names = ", ".join(f"{g.name} (guild_id={g.id})" for g in guilds)
    raise ValueError(f"Bot is in multiple servers ({names}) — specify guild_id to pick one.")


async def resolve_channel(channel_id: str) -> discord.abc.GuildChannel | discord.Thread:
    numeric_id = parse_id(channel_id, "channelId")
    channel = client.get_channel(numeric_id)
    if channel is not None:
        return channel
    try:
        return await client.fetch_channel(numeric_id)
    except discord.NotFound:
        raise ValueError(f"Channel not found by channelId: {channel_id}")


async def resolve_message_channel(channel_id: str) -> discord.abc.Messageable:
    channel = await resolve_channel(channel_id)
    if not isinstance(channel, discord.abc.Messageable):
        raise ValueError(f"Channel {channel_id} does not support messages (type: {type(channel).__name__})")
    return channel
