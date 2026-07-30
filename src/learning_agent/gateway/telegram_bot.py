"""Telegram gateway (python-telegram-bot v21+, long polling).

UX theo Hermes: chat riêng = 1 phiên; allowlist TELEGRAM_ALLOWED_USERS;
gửi file (PDF/audio/video/md) là nạp thẳng vào tài liệu học; /sethome chọn nơi
nhận báo cáo cron. Giới hạn Bot API: nhận file ≤20MB (nâng 2GB bằng local
telegram-bot-api server), message ≤4096 ký tự → cắt 4000.
"""
from __future__ import annotations

import asyncio
import os
from collections import defaultdict, deque

from telegram import Update
from telegram.ext import (
    Application, CommandHandler, ContextTypes, MessageHandler, filters,
)

from ..agent import TutorAgent
from ..agent.subagent import run_quiz, run_summary
from ..index import LessonIndex
from ..updater.inbox import ingest_upload
from ..vault import Vault
from .base import HomeStore, allowed_users, split_message

MAX_LEN = 4000
MAX_DOWNLOAD = 20 * 1024 * 1024  # Bot API chuẩn chỉ cho bot tải file ≤20MB
HISTORY_TURNS = 12


class TelegramGateway:
    def __init__(self, cfg, agent: TutorAgent, vault: Vault, index: LessonIndex, home: HomeStore):
        self.cfg = cfg
        self.agent = agent
        self.vault = vault
        self.index = index
        self.home = home
        self.allowed = allowed_users("TELEGRAM_ALLOWED_USERS")
        self.histories: dict[int, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))
        self.app = Application.builder().token(os.environ["TELEGRAM_BOT_TOKEN"]).build()
        self._register()

    def _ok(self, update: Update) -> bool:
        return not self.allowed or str(update.effective_user.id) in self.allowed

    # ---------- handlers ----------
    def _register(self) -> None:
        app = self.app
        app.add_handler(CommandHandler("start", self.cmd_start))
        app.add_handler(CommandHandler("help", self.cmd_start))
        app.add_handler(CommandHandler("sethome", self.cmd_sethome))
        app.add_handler(CommandHandler("quiz", self.cmd_quiz))
        app.add_handler(CommandHandler("tomtat", self.cmd_tomtat))
        app.add_handler(MessageHandler(
            filters.Document.ALL | filters.AUDIO | filters.VOICE | filters.VIDEO,
            self.on_file,
        ))
        app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.on_text))

    async def cmd_start(self, update: Update, _ctx: ContextTypes.DEFAULT_TYPE) -> None:
        if not self._ok(update):
            await update.message.reply_text(f"Bạn chưa được cấp quyền. User ID của bạn: {update.effective_user.id} — thêm vào TELEGRAM_ALLOWED_USERS.")
            return
        await update.message.reply_text(
            "📚 Mình là trợ giảng AI của bạn.\n"
            "• Nhắn tin để hỏi về nội dung học (mình luôn trích nguồn, không bịa).\n"
            "• Gửi file slide PDF/PPTX, ghi âm, video, ghi chú .md để nạp bài học mới.\n"
            "• Hỏi \"có bộ kiến thức nào cài được không?\" — mình cài bộ bài học từ GitHub cho bạn.\n"
            "• /quiz <bài> — tạo quiz ôn tập · /tomtat <bài> — tóm tắt bài\n"
            "• Nhắc hẹn/việc định kỳ: cứ nói tự nhiên (\"mỗi tối 21h quiz tôi\").\n"
            "• /sethome — nhận báo cáo học tập hằng ngày ở chat này"
        )

    async def cmd_sethome(self, update: Update, _ctx) -> None:
        if not self._ok(update):
            return
        self.home.set("telegram", str(update.effective_chat.id))
        await update.message.reply_text("✅ Báo cáo định kỳ sẽ gửi vào chat này.")

    async def cmd_quiz(self, update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
        await self._long_task(update, ctx, "quiz", run_quiz)

    async def cmd_tomtat(self, update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
        await self._long_task(update, ctx, "tóm tắt", run_summary)

    async def _long_task(self, update: Update, ctx, label: str, fn) -> None:
        if not self._ok(update):
            return
        lesson = " ".join(ctx.args or [])
        if not lesson:
            await update.message.reply_text(f"Dùng: /{'quiz' if label=='quiz' else 'tomtat'} <tên bài>")
            return
        status = await update.message.reply_text(f"⏳ Đang làm {label}: {lesson}…")
        user = update.effective_user

        async def worker():
            result = await asyncio.to_thread(fn, self.agent, str(user.id), user.first_name, lesson)
            for chunk in split_message(result, MAX_LEN):
                await update.effective_chat.send_message(chunk)
            await status.edit_text(f"✅ Xong {label}: {lesson}")

        asyncio.create_task(worker())

    async def on_text(self, update: Update, _ctx) -> None:
        if not self._ok(update):
            return
        chat = update.effective_chat
        session = self.histories[chat.id]
        session.append({"role": "user", "content": update.message.text})
        await chat.send_action("typing")
        answer = await asyncio.to_thread(
            self.agent.reply, str(update.effective_user.id),
            update.effective_user.first_name, list(session),
            "", {"platform": "telegram", "chat_id": chat.id},
        )
        session.append({"role": "assistant", "content": answer})
        for chunk in split_message(answer, MAX_LEN):
            await update.message.reply_text(chunk)

    async def on_file(self, update: Update, _ctx) -> None:
        if not self._ok(update):
            return
        att = (update.message.document or update.message.audio
               or update.message.voice or update.message.video)
        name = getattr(att, "file_name", None) or f"telegram_{att.file_unique_id}.ogg"
        if (att.file_size or 0) > MAX_DOWNLOAD:
            await update.message.reply_text(
                "⚠️ File quá 20MB — Bot API chuẩn không tải được. "
                "Bỏ file vào thư mục nguồn (source_mirror/) giúp mình, hoặc admin bật local Bot API server."
            )
            return
        await update.message.reply_text(f"📥 Nhận `{name}` — đang xử lý thành tài liệu học…")
        f = await att.get_file()
        data = bytes(await f.download_as_bytearray())
        msg = await asyncio.to_thread(
            ingest_upload, self.cfg, self.vault, self.index, data, name
        )
        await update.message.reply_text(msg)

    # ---------- lifecycle & notifier ----------
    async def notify_home(self, text: str) -> None:
        chat_id = self.home.get("telegram")
        if chat_id:
            await self.send_to(chat_id, text)

    async def send_to(self, chat_id: str, text: str) -> None:
        for chunk in split_message(text, MAX_LEN):
            await self.app.bot.send_message(chat_id=chat_id, text=chunk)

    async def run(self) -> None:
        """Manual lifecycle để chạy chung event loop với discord.py."""
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling(allowed_updates=["message"])
        print("Telegram gateway: đang chạy (long polling)")
        await asyncio.Event().wait()
