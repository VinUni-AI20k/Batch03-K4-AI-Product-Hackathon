"""Discord gateway — pattern tổng hợp từ llmcord + OpenClaw + Hermes:

- DM hoặc @mention trong channel -> trả lời; channel chung thì mở thread (thread = 1 phiên).
- Gửi file đính kèm (DM/mention) -> nạp thẳng vào tài liệu học tập.
- Slash: /hoi, /quiz, /tomtat — defer ngay (hạn 3s), việc dài chạy nền post vào thread.
- /sethome: channel hiện tại nhận báo cáo cron. Allowlist DISCORD_ALLOWED_USERS.
- Tự split 2000 ký tự; event budget chống bot-loop.
"""
from __future__ import annotations

import asyncio
import time
from collections import defaultdict, deque

import discord
from discord import app_commands

from ..agent import TutorAgent
from ..agent.subagent import run_quiz, run_summary
from ..index import LessonIndex
from ..updater.inbox import ingest_upload
from ..vault import Vault
from .base import HomeStore, allowed_users, split_message

MAX_LEN = 2000
HISTORY_TURNS = 12


class TutorBot(discord.Client):
    def __init__(self, cfg, agent: TutorAgent, vault: Vault, index: LessonIndex, home: HomeStore):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(intents=intents)
        self.cfg = cfg
        self.agent = agent
        self.vault = vault
        self.index = index
        self.home = home
        self.allowed = allowed_users("DISCORD_ALLOWED_USERS")
        self.tree = app_commands.CommandTree(self)
        # session -> lịch sử hội thoại (giữ trong RAM; memory dài hạn đã có vault)
        self.histories: dict[int, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))
        self.event_times: deque = deque(maxlen=int(cfg.get("discord", "max_events_per_minute", default=20)))
        self._register_commands()

    def _ok(self, user) -> bool:
        return not self.allowed or str(user.id) in self.allowed

    # ---------- chống loop ----------
    def _budget_ok(self) -> bool:
        now = time.monotonic()
        if len(self.event_times) == self.event_times.maxlen and now - self.event_times[0] < 60:
            return False
        self.event_times.append(now)
        return True

    # ---------- chat thường + nhận file ----------
    async def on_ready(self):
        await self.tree.sync()
        print(f"Discord gateway: đăng nhập {self.user}")

    async def on_message(self, message: discord.Message):
        if message.author.bot or not self._budget_ok() or not self._ok(message.author):
            return
        is_dm = message.guild is None
        mentioned = self.user in message.mentions
        in_thread = isinstance(message.channel, discord.Thread)
        if not (is_dm or mentioned or in_thread):
            return

        # file đính kèm -> nạp vào tài liệu học tập
        if message.attachments:
            for att in message.attachments:
                note = await message.channel.send(f"📥 Nhận `{att.filename}` — đang xử lý…")
                data = await att.read()
                msg = await asyncio.to_thread(
                    ingest_upload, self.cfg, self.vault, self.index, data, att.filename
                )
                await note.edit(content=msg)
            if not message.content.strip().replace(self.user.mention, "").strip():
                return

        # channel chung + mention -> mở thread trả lời (channel sạch, context cô lập)
        target = message.channel
        if mentioned and not in_thread and self.cfg.get("discord", "thread_per_question", default=True):
            name = message.content.replace(self.user.mention, "").strip()[:80] or "Hỏi đáp"
            target = await message.create_thread(name=name)

        content = message.content.replace(self.user.mention, "").strip()
        session = self.histories[target.id]
        session.append({"role": "user", "content": content})

        async with target.typing():
            answer = await asyncio.to_thread(
                self.agent.reply,
                str(message.author.id),
                message.author.display_name,
                list(session),
                "", {"platform": "discord", "chat_id": target.id},
            )
        session.append({"role": "assistant", "content": answer})
        for chunk in split_message(answer, MAX_LEN):
            await target.send(chunk)

    # ---------- slash commands ----------
    def _register_commands(self):
        @self.tree.command(name="hoi", description="Hỏi trợ giảng về nội dung khoá học")
        @app_commands.describe(cau_hoi="Câu hỏi của bạn")
        async def hoi(interaction: discord.Interaction, cau_hoi: str):
            if not self._ok(interaction.user):
                await interaction.response.send_message("Bạn chưa được cấp quyền.", ephemeral=True)
                return
            await interaction.response.defer()  # hạn 3 giây
            answer = await asyncio.to_thread(
                self.agent.reply,
                str(interaction.user.id),
                interaction.user.display_name,
                [{"role": "user", "content": cau_hoi}],
            )
            chunks = split_message(answer, MAX_LEN)
            await interaction.followup.send(chunks[0])
            for chunk in chunks[1:]:
                await interaction.channel.send(chunk)

        @self.tree.command(name="quiz", description="Tạo quiz ôn tập từ một bài học")
        @app_commands.describe(bai="Tên bài học", so_cau="Số câu hỏi (mặc định 5)")
        async def quiz(interaction: discord.Interaction, bai: str, so_cau: int = 5):
            await self._long_task(
                interaction, f"Quiz: {bai}",
                lambda: run_quiz(self.agent, str(interaction.user.id),
                                 interaction.user.display_name, bai, so_cau),
            )

        @self.tree.command(name="tomtat", description="Tóm tắt một bài học để ôn tập")
        @app_commands.describe(bai="Tên bài học")
        async def tomtat(interaction: discord.Interaction, bai: str):
            await self._long_task(
                interaction, f"Tóm tắt: {bai}",
                lambda: run_summary(self.agent, str(interaction.user.id),
                                    interaction.user.display_name, bai),
            )

        @self.tree.command(name="sethome", description="Nhận báo cáo học tập định kỳ ở channel này")
        async def sethome(interaction: discord.Interaction):
            if not self._ok(interaction.user):
                await interaction.response.send_message("Bạn chưa được cấp quyền.", ephemeral=True)
                return
            self.home.set("discord", str(interaction.channel_id))
            await interaction.response.send_message("✅ Báo cáo định kỳ sẽ gửi vào channel này.")

    async def _long_task(self, interaction: discord.Interaction, title: str, job):
        """Việc dài: defer -> báo nhận việc -> chạy nền -> post kết quả vào thread đặt tên theo việc.
        Post bằng channel.send nên không chết theo token interaction (hạn 15 phút)."""
        if not self._ok(interaction.user):
            await interaction.response.send_message("Bạn chưa được cấp quyền.", ephemeral=True)
            return
        await interaction.response.defer()
        status = await interaction.followup.send(f"⏳ Đang làm: **{title}** — xong sẽ đăng vào thread.")
        channel = interaction.channel
        thread = None
        if isinstance(channel, discord.TextChannel):
            thread = await status.create_thread(name=title[:90])

        async def worker():
            try:
                result = await asyncio.to_thread(job)
                dest = thread or channel
                for chunk in split_message(result, MAX_LEN):
                    await dest.send(chunk)
                await status.edit(content=f"✅ Xong: **{title}** {interaction.user.mention}")
            except Exception as e:
                await status.edit(content=f"❌ Lỗi khi làm '{title}': {e}")

        asyncio.create_task(worker())

    # ---------- notifier cho scheduler ----------
    async def notify_home(self, text: str) -> None:
        chat_id = self.home.get("discord")
        if chat_id:
            await self.send_to(chat_id, text)

    async def send_to(self, chat_id: str, text: str) -> None:
        channel = self.get_channel(int(chat_id)) or await self.fetch_channel(int(chat_id))
        for chunk in split_message(text, MAX_LEN):
            await channel.send(chunk)
