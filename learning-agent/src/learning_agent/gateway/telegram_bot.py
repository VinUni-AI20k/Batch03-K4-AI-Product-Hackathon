"""Telegram gateway (python-telegram-bot v21+, long polling).

UX theo Vlearn Agent: chat riêng = 1 phiên; allowlist TELEGRAM_ALLOWED_USERS;
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
from ..security import Audit, RateLimiter
from ..updater.inbox import commit_upload, receive_upload
from ..vault import Vault
from .base import HomeStore, PendingUploads, allowed_users, md_to_telegram_html, split_message

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
        if not self.allowed and not getattr(cfg, "allow_all_users", False):
            raise RuntimeError(
                "TELEGRAM_ALLOWED_USERS trống. Đặt danh sách user id được phép, "
                "hoặc set VLEARN_ALLOW_ALL=1 để mở cho mọi người (chỉ nên dùng cá nhân/dev).")
        if not self.allowed:
            print("⚠️ TELEGRAM_ALLOWED_USERS trống — bot MỞ CHO MỌI NGƯỜI (VLEARN_ALLOW_ALL=1).")
        self.audit = Audit(cfg.root / "data" / "audit.log")
        self.rate = RateLimiter(int(cfg.get("security", "user_rate_per_minute", default=10)))
        self.pending = PendingUploads()
        self.histories: dict[int, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))
        # concurrent_updates: tin nhắn xử lý song song — việc dài (cài pack, ingest)
        # không chặn cả hàng đợi chat
        self.app = (
            Application.builder()
            .token(os.environ["TELEGRAM_BOT_TOKEN"])
            .concurrent_updates(True)
            .build()
        )
        self._register()

    async def _send_formatted(self, sender, text: str) -> None:
        """sender(text, parse_mode)->coroutine. Cắt + render Markdown->HTML; lỗi parse thì gửi plain."""
        for chunk in split_message(text, MAX_LEN):
            try:
                await sender(md_to_telegram_html(chunk), "HTML")
            except Exception:
                await sender(chunk, None)

    def _ok(self, update: Update) -> bool:
        uid = str(update.effective_user.id)
        if self.allowed and uid not in self.allowed:
            self.audit.log("denied_user", platform="telegram", user=uid)
            return False
        if not self.rate.allow(uid):
            self.audit.log("rate_limited", platform="telegram", user=uid)
            return False
        return True

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
            "📚 Mình là Vlearn Agent — trợ giảng AI của bạn.\n"
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
            await self._send_formatted(
                lambda t, pm: update.effective_chat.send_message(t, parse_mode=pm), result)
            await status.edit_text(f"✅ Xong {label}: {lesson}")

        asyncio.create_task(worker())

    async def on_text(self, update: Update, _ctx) -> None:
        if not self._ok(update):
            return
        chat = update.effective_chat
        uid = str(update.effective_user.id)

        # đang chờ xác nhận nạp file? phân loại câu trả lời
        up = self.pending.get(uid)
        if up is not None:
            action = self.pending.interpret(update.message.text)
            if action in ("commit", "both"):
                await chat.send_action("typing")
                msg = await asyncio.to_thread(commit_upload, self.cfg, self.vault, self.index,
                                              up, action == "both")
                self.audit.log("ingest_confirmed", platform="telegram", user=uid,
                               file=up.name, mode=action)
                self.pending.clear(uid)
                await update.message.reply_text(msg)
                return
            if action == "skip":
                self.pending.clear(uid)
                await update.message.reply_text(
                    "👌 Ok, mình không nạp vào kiến thức — chỉ dùng để trả lời câu hỏi của bạn về file này thôi.")
                return
            # action None -> coi như câu hỏi về file: vẫn trả lời (dưới), giữ pending

        session = self.histories[chat.id]
        session.append({"role": "user", "content": update.message.text})
        await chat.send_action("typing")
        media: list = []  # audio/ảnh vừa sinh (tao_am_thanh/tao_anh), agent.reply tự append vào
        answer = await asyncio.to_thread(
            self.agent.reply, str(update.effective_user.id),
            update.effective_user.first_name, list(session),
            self.pending.context(uid), {"platform": "telegram", "chat_id": chat.id},
            None, media,
        )
        session.append({"role": "assistant", "content": answer})
        # Có sơ đồ/mindmap (```mermaid) -> render PNG + HTML đính kèm (Telegram không vẽ code được)
        import tempfile
        from ..render import diagram_attachments
        files, answer = await asyncio.to_thread(diagram_attachments, answer, tempfile.mkdtemp())
        files += media  # audio/ảnh vừa sinh, gửi kèm cùng đợt
        await self._send_formatted(
            lambda t, pm: update.message.reply_text(t, parse_mode=pm), answer)
        for p in files:
            with open(p, "rb") as fh:
                if p.endswith(".png") or p.endswith(".jpg") or p.endswith(".jpeg"):
                    await update.message.reply_photo(fh)
                elif p.endswith(".mp3") or p.endswith(".ogg") or p.endswith(".m4a"):
                    await update.message.reply_audio(fh)
                else:
                    await update.message.reply_document(fh)

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
        uid = str(update.effective_user.id)
        await update.message.reply_text(f"📥 Nhận `{name}` — đang đọc nội dung…")
        f = await att.get_file()
        data = bytes(await f.download_as_bytearray())
        up = await asyncio.to_thread(receive_upload, self.cfg, data, name)
        if isinstance(up, str):  # lỗi
            await update.message.reply_text(up)
            return
        self.pending.set(uid, up)
        self.audit.log("file_received", platform="telegram", user=uid,
                       file=up.name, chars=len(up.text), is_update=up.is_update)
        if up.is_update:
            await update.message.reply_text(
                f"📄 Đã đọc `{up.name}` — bạn hỏi mình về nội dung này được ngay.\n\n"
                f"⚠️ Bài này **đã có trong kiến thức** rồi. Bạn muốn:\n"
                f"• Trả lời **\"nạp\"** → cập nhật thay bản cũ\n"
                f"• Trả lời **\"cả 2\"** → giữ cả bản cũ lẫn bản mới\n"
                f"• Trả lời **\"không\"** → chỉ tra cứu lần này, không đụng kiến thức")
        else:
            await update.message.reply_text(
                f"📄 Đã đọc `{up.name}` ({len(up.text)} ký tự) — bạn hỏi mình về nội dung này được ngay.\n\n"
                f"📚 Có muốn mình **nạp thành kiến thức học tập lâu dài** không? "
                f"(trả lời **\"nạp\"** để lưu + học được sau này; hoặc cứ hỏi bình thường nếu chỉ cần tra cứu lần này)")

    # ---------- lifecycle & notifier ----------
    async def notify_home(self, text: str) -> None:
        chat_id = self.home.get("telegram")
        if chat_id:
            await self.send_to(chat_id, text)

    async def send_to(self, chat_id: str, text: str) -> None:
        await self._send_formatted(
            lambda t, pm: self.app.bot.send_message(chat_id=chat_id, text=t, parse_mode=pm), text)

    async def run(self) -> None:
        """Manual lifecycle để chạy chung event loop với discord.py."""
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling(allowed_updates=["message"])
        print("Telegram gateway: đang chạy (long polling)")
        await asyncio.Event().wait()
