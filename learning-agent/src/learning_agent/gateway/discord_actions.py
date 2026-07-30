"""Hành động Discord native cho agent — tạo sự kiện, link mời, ghim tin.

Agent chạy trong worker thread (asyncio.to_thread); Discord API chạy ở event loop.
Cầu nối bằng run_coroutine_threadsafe: tool của agent gọi hàm sync ở đây, hàm này
đẩy coroutine sang loop của discord client và chờ kết quả.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta

import discord

from ..scheduler import parse_when

# schema các tool Discord — chỉ thêm vào agent khi đang chat qua Discord
DISCORD_TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "discord_create_event",
            "description": "Tạo SỰ KIỆN Discord THẬT trong server (hiện ở tab Sự kiện, mọi người thấy/đăng ký). Dùng khi học viên muốn 'tạo sự kiện', 'lên lịch họp nhóm trong server'. Khác schedule_task (chỉ nhắc riêng 1 người).",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Tên sự kiện, vd 'Họp nhóm'"},
                    "when": {"type": "string", "description": "Thời gian bắt đầu. Nếu có NGÀY cụ thể (mai, 3/8, tuần sau) PHẢI truyền ISO datetime 'YYYY-MM-DDTHH:MM:SS' tự tính từ ngày giờ hiện tại trong context. Hoặc: 'HH:MM' (trong 24h tới), '2h' (2 tiếng nữa)."},
                    "location": {"type": "string", "description": "Địa điểm/link, vd 'Google Meet', 'Phòng Chung'. Mặc định Online"},
                    "description": {"type": "string", "description": "Mô tả ngắn (tuỳ chọn)"},
                },
                "required": ["name", "when"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "discord_create_invite",
            "description": "Tạo link mời vào channel Discord hiện tại (hạn 24h). Dùng khi học viên xin 'link vào group', 'link mời'.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]


class DiscordActions:
    def __init__(self, bot, guild_id: int | None, channel_id: int):
        self.bot = bot
        self.guild_id = guild_id
        self.channel_id = channel_id

    def _run(self, coro):
        try:
            fut = asyncio.run_coroutine_threadsafe(coro, self.bot.loop)
            return fut.result(timeout=20)
        except Exception as e:
            return f"⚠️ Lỗi thực hiện hành động Discord: {e}"

    # ---------- dispatch từ agent ----------
    def handle(self, tool: str, args: dict) -> str:
        if tool == "discord_create_event":
            return self.create_event(**args)
        if tool == "discord_create_invite":
            return self._run(self._create_invite())
        return f"Tool Discord không tồn tại: {tool}"

    def create_event(self, name: str, when: str, location: str = "Online", description: str = "") -> str:
        parsed = parse_when(when)
        if not parsed or parsed[0] != "once":
            return f"⚠️ Cần thời điểm cụ thể cho sự kiện (vd '07:00' hoặc '2h'), không dùng lịch lặp lại."
        start = datetime.fromisoformat(parsed[1]).astimezone()
        return self._run(self._create_event(name, start, location or "Online", description))

    async def _create_event(self, name, start, location, description) -> str:
        if self.guild_id is None:
            return "⚠️ Sự kiện chỉ tạo được trong server, không tạo trong DM."
        guild = self.bot.get_guild(self.guild_id)
        if guild is None:
            return "⚠️ Không tìm thấy server."
        try:
            await guild.create_scheduled_event(
                name=name[:100],
                start_time=start,
                end_time=start + timedelta(hours=1),
                entity_type=discord.EntityType.external,
                location=(location or "Online")[:100],
                privacy_level=discord.PrivacyLevel.guild_only,
                description=(description or f"Tạo bởi Vlearn Agent")[:1000],
            )
            return (f"✅ Đã tạo sự kiện Discord **{name}** lúc {start.strftime('%H:%M %d/%m')} "
                    f"({location}) — mọi người xem/đăng ký ở tab **Sự kiện** của server.")
        except discord.Forbidden:
            return "⚠️ Bot thiếu quyền **Manage Events**. Admin cấp quyền đó cho role của bot rồi thử lại nhé."
        except Exception as e:
            return f"⚠️ Không tạo được sự kiện: {e}"

    async def _create_invite(self) -> str:
        ch = self.bot.get_channel(self.channel_id)
        if ch is None or not hasattr(ch, "create_invite"):
            return "⚠️ Không tạo được link mời ở đây (thử trong channel của server)."
        try:
            inv = await ch.create_invite(max_age=86400, unique=True, reason="Vlearn Agent")
            return f"🔗 Link mời (hạn 24h): {inv.url}"
        except discord.Forbidden:
            return "⚠️ Bot thiếu quyền **Create Invite**."
        except Exception as e:
            return f"⚠️ Không tạo được link mời: {e}"
