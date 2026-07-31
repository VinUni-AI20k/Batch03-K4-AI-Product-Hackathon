"""Discord gateway — pattern tổng hợp từ llmcord + Vlearn Agent + Vlearn Agent:

- DM hoặc @mention trong channel -> trả lời; channel chung thì mở thread (thread = 1 phiên).
- Gửi file đính kèm (DM/mention) -> nạp thẳng vào tài liệu học tập.
- Slash: /hoi, /quiz, /tomtat — defer ngay (hạn 3s), việc dài chạy nền post vào thread.
- /sethome: channel hiện tại nhận báo cáo cron. Allowlist DISCORD_ALLOWED_USERS.
- Tự split 2000 ký tự; event budget chống bot-loop.
"""
from __future__ import annotations

import asyncio
import tempfile
import time
from collections import defaultdict, deque

import discord
from discord import app_commands

from ..agent import TutorAgent
from ..agent.subagent import run_quiz, run_summary
from ..index import LessonIndex
from ..security import Audit, RateLimiter
from ..updater.inbox import commit_upload, receive_upload
from ..vault import Vault
from .base import HomeStore, PendingUploads, allowed_users, split_message

MAX_LEN = 2000
HISTORY_TURNS = 12


class TutorBot(discord.Client):
    def __init__(self, cfg, agent: TutorAgent, vault: Vault, index: LessonIndex, home: HomeStore):
        intents = discord.Intents.default()
        # message_content là privileged intent — chỉ bật nếu admin đã bật trong Developer Portal
        # VÀ đặt discord.message_content_intent: true. Không bật: bot vẫn đọc được DM + tin @mention
        # + mọi slash command (đủ cho trợ giảng); chỉ không đọc tin không-mention trong channel.
        if cfg.get("discord", "message_content_intent", default=False):
            intents.message_content = True
        super().__init__(intents=intents)
        self.cfg = cfg
        self.agent = agent
        self.vault = vault
        self.index = index
        self.home = home
        self.allowed = allowed_users("DISCORD_ALLOWED_USERS")
        if not self.allowed and not getattr(cfg, "allow_all_users", False):
            raise RuntimeError(
                "DISCORD_ALLOWED_USERS trống. Đặt danh sách user id được phép, "
                "hoặc set VLEARN_ALLOW_ALL=1 để mở cho mọi người (chỉ nên dùng cá nhân/dev).")
        if not self.allowed:
            print("⚠️ DISCORD_ALLOWED_USERS trống — bot MỞ CHO MỌI NGƯỜI (VLEARN_ALLOW_ALL=1).")
        self.audit = Audit(cfg.root / "data" / "audit.log")
        self.rate = RateLimiter(int(cfg.get("security", "user_rate_per_minute", default=10)))
        self.max_upload = int(cfg.get("security", "max_upload_mb", default=32)) * 1024 * 1024
        self.tree = app_commands.CommandTree(self)
        self.pending = PendingUploads()
        # session -> lịch sử hội thoại (giữ trong RAM; memory dài hạn đã có vault)
        self.histories: dict[int, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))
        self.event_times: deque = deque(maxlen=int(cfg.get("discord", "max_events_per_minute", default=20)))
        self._register_commands()

    def _ok(self, user) -> bool:
        uid = str(user.id)
        if self.allowed and uid not in self.allowed:
            self.audit.log("denied_user", platform="discord", user=uid)
            return False
        if not self.rate.allow(uid):
            self.audit.log("rate_limited", platform="discord", user=uid)
            return False
        return True

    def _intent_warned(self, channel_id: int) -> bool:
        """Chỉ nhắc 'chưa đọc được nội dung' 1 lần mỗi channel — tránh spam."""
        warned = getattr(self, "_warned_channels", None)
        if warned is None:
            warned = self._warned_channels = set()
        if channel_id in warned:
            return True
        warned.add(channel_id)
        return False

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

        # Nội dung rỗng + không có file: thường do Message Content Intent tắt (tin không-mention
        # trong channel/thread về rỗng). Không gọi agent với input trống — nhắc học viên 1 lần rồi im.
        content_now = message.content.replace(self.user.mention, "").strip()
        if not content_now and not message.attachments:
            if not is_dm and not self._intent_warned(message.channel.id):
                await message.channel.send(
                    "⚠️ Mình chưa đọc được nội dung tin này (Discord chưa cấp quyền đọc tin không nhắc tên). "
                    "Bạn **@vlearn agent** kèm câu hỏi nhé — hoặc admin bật *Message Content Intent* để mình đọc mọi tin."
                )
            return

        uid = str(message.author.id)

        # file đính kèm -> ĐỌC (chưa nạp), hỏi xác nhận có nạp thành kiến thức không
        if message.attachments:
            for att in message.attachments:
                if att.size > self.max_upload:
                    await message.channel.send(
                        f"⚠️ `{att.filename}` quá {self.max_upload // (1024*1024)}MB — bỏ vào source_mirror/ giúp mình.")
                    continue
                note = await message.channel.send(f"📥 Nhận `{att.filename}` — đang đọc…")
                data = await att.read()
                up = await asyncio.to_thread(receive_upload, self.cfg, data, att.filename)
                if isinstance(up, str):
                    await note.edit(content=up)
                    continue
                self.pending.set(uid, up)
                self.audit.log("file_received", platform="discord", user=uid,
                               file=up.name, chars=len(up.text), is_update=up.is_update)
                if up.is_update:
                    await note.edit(content=(
                        f"📄 Đã đọc `{up.name}` — hỏi mình về file này được ngay.\n"
                        f"⚠️ Bài đã CÓ trong kiến thức. Trả lời: **nạp** (thay bản cũ) · **cả 2** (giữ cả hai) · **không** (chỉ tra cứu)."))
                else:
                    await note.edit(content=(
                        f"📄 Đã đọc `{up.name}` ({len(up.text)} ký tự) — hỏi mình về file này được ngay.\n"
                        f"📚 Muốn mình **nạp thành kiến thức lâu dài**? Trả lời **nạp** để lưu; hoặc cứ hỏi bình thường nếu chỉ tra cứu lần này."))
            if not message.content.strip().replace(self.user.mention, "").strip():
                return

        # đang chờ xác nhận nạp file? phân loại câu trả lời
        if self.pending.get(uid) is not None:
            up = self.pending.get(uid)
            action = self.pending.interpret(content_now)
            if action in ("commit", "both"):
                async with message.channel.typing():
                    msg = await asyncio.to_thread(commit_upload, self.cfg, self.vault, self.index,
                                                  up, action == "both")
                self.audit.log("ingest_confirmed", platform="discord", user=uid, file=up.name, mode=action)
                self.pending.clear(uid)
                await message.channel.send(msg)
                return
            if action == "skip":
                self.pending.clear(uid)
                await message.channel.send("👌 Ok, chỉ dùng để trả lời câu hỏi về file này, không nạp vào kiến thức.")
                return
            # None -> câu hỏi về file: trả lời (dưới), giữ pending

        # thread_per_question=true (channel đông): mở thread riêng. false (mặc định): trả lời thẳng.
        target = message.channel
        use_thread = mentioned and not in_thread and self.cfg.get("discord", "thread_per_question", default=False)
        if use_thread:
            name = message.content.replace(self.user.mention, "").strip()[:80] or "Hỏi đáp"
            target = await message.create_thread(name=name)

        content = message.content.replace(self.user.mention, "").strip()
        session = self.histories[target.id]
        session.append({"role": "user", "content": content})

        from .discord_actions import DiscordActions
        actions = DiscordActions(self, message.guild.id if message.guild else None, message.channel.id)
        async with target.typing():
            answer = await asyncio.to_thread(
                self.agent.reply,
                str(message.author.id),
                message.author.display_name,
                list(session),
                self.pending.context(uid),
                {"platform": "discord", "chat_id": target.id, "discord_actions": actions},
            )
        session.append({"role": "assistant", "content": answer})
        # Có sơ đồ/mindmap (```mermaid) -> render ra PNG + HTML đính kèm (Discord không vẽ code được)
        import discord
        from ..render import diagram_attachments
        _tmp = tempfile.mkdtemp()
        files, answer = await asyncio.to_thread(diagram_attachments, answer, _tmp)
        chunks = split_message(answer, MAX_LEN)
        # trả lời thẳng trong channel: reply (trích dẫn) tin học viên cho rõ đang đáp ai; DM/thread thì gửi thường
        for i, chunk in enumerate(chunks):
            if i == 0 and not use_thread and not is_dm and not in_thread:
                await message.reply(chunk, mention_author=False)
            else:
                await target.send(chunk)
        if files:
            await target.send(files=[discord.File(p) for p in files])

    # ---------- slash commands ----------
    def _register_commands(self):
        @self.tree.command(name="hoi", description="Hỏi trợ giảng về nội dung khoá học")
        @app_commands.describe(cau_hoi="Câu hỏi của bạn")
        async def hoi(interaction: discord.Interaction, cau_hoi: str):
            if not self._ok(interaction.user):
                await interaction.response.send_message("Bạn chưa được cấp quyền.", ephemeral=True)
                return
            await interaction.response.defer()  # hạn 3 giây
            from .discord_actions import DiscordActions
            actions = DiscordActions(self, interaction.guild_id, interaction.channel_id)
            answer = await asyncio.to_thread(
                self.agent.reply,
                str(interaction.user.id),
                interaction.user.display_name,
                [{"role": "user", "content": cau_hoi}],
                "", {"platform": "discord", "chat_id": interaction.channel_id, "discord_actions": actions},
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
