"""CLI: learning-agent <lệnh>

  onboard   kiểm tra cấu hình lần đầu (.env, token, thư mục)
  sync      quét source_mirror, ingest bài mới/đổi, cập nhật index (incremental)
  reindex   rebuild toàn bộ index từ vault (index là phái sinh)
  ask       hỏi thử agent trong terminal (không cần Discord/Telegram)
  bot       chạy gateway: Discord + Telegram + cron scheduler (kênh nào có token thì bật)
  update    cập nhật lên bản mới nhất từ GitHub (git pull + cài deps) rồi khởi động lại bot
  ui        mở dashboard quản trị web (http://127.0.0.1:8321, chỉ local)
"""
from __future__ import annotations

import argparse
import asyncio
import shutil
import sys

from .config import load_config


def _setup(cfg):
    from .index import LessonIndex, make_embedder
    from .vault import Vault

    vault = Vault(cfg.path("vault", "path"), cfg.get("vault", "git_autocommit", default=False))
    index = LessonIndex(
        cfg.path("index", "chroma_path"),
        cfg.get("index", "collection", default="lessons"),
        make_embedder(cfg),
    )
    return vault, index


def main() -> None:
    parser = argparse.ArgumentParser(prog="learning-agent", description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("onboard")
    sub.add_parser("update")
    ui = sub.add_parser("ui")
    ui.add_argument("--port", type=int, default=8321)
    ui.add_argument("--host", default="127.0.0.1", help="0.0.0.0 khi chạy trong Docker")
    sub.add_parser("sync")
    sub.add_parser("reindex")
    ask = sub.add_parser("ask")
    ask.add_argument("question", nargs="+")
    sub.add_parser("bot")
    args = parser.parse_args()

    cfg = load_config()

    if args.cmd == "onboard":
        _onboard(cfg)
        return

    if args.cmd == "update":
        from .updater.selfupdate import do_update
        do_update(cfg)
        return

    if args.cmd == "ui":
        from .webui import run_ui
        run_ui(cfg, args.port, args.host)
        return

    vault, index = _setup(cfg)

    if args.cmd == "sync":
        from .updater.sync import sync_once
        stats = sync_once(cfg, vault, index)
        print(f"Xong: +{stats['ingested']} bài, -{stats['removed']} bài, {stats['chunks']} chunks")

    elif args.cmd == "reindex":
        from .updater.sync import reindex_all
        print(f"Đã index lại {reindex_all(cfg, vault, index)} chunks")

    elif args.cmd == "ask":
        from .agent import TutorAgent
        agent = TutorAgent(cfg, vault, index)
        question = " ".join(args.question)
        print(agent.reply("cli-user", "CLI", [{"role": "user", "content": question}]))

    elif args.cmd == "bot":
        if not cfg.discord_token and not cfg.telegram_token:
            sys.exit("Cần ít nhất DISCORD_BOT_TOKEN hoặc TELEGRAM_BOT_TOKEN trong .env")
        asyncio.run(_run_gateway(cfg, vault, index))


async def _run_gateway(cfg, vault, index) -> None:
    """Một process chạy mọi channel + cron scheduler chung 1 event loop (mô hình gateway Vlearn Agent)."""
    from .agent import TutorAgent
    from .gateway.base import HomeStore
    from .scheduler import Scheduler

    agent = TutorAgent(cfg, vault, index)
    home = HomeStore(cfg.root / "data" / "home.json")
    scheduler = Scheduler(cfg, agent)
    agent.attach_task_store(scheduler.store)  # bật tools schedule_task từ chat
    tasks = []

    async def guarded(name: str, coro):
        """Một kênh lỗi thì chỉ kênh đó dừng, không kéo sập cả gateway."""
        try:
            await coro
        except Exception as e:
            print(f"⚠️ Kênh {name} dừng: {type(e).__name__}: {e}")

    if cfg.discord_token:
        try:
            from .gateway.discord_bot import TutorBot
            bot = TutorBot(cfg, agent, vault, index, home)
            scheduler.register("discord", bot.notify_home, bot.send_to)
            tasks.append(guarded("Discord", bot.start(cfg.discord_token)))
        except Exception as e:
            print(f"⚠️ Không bật Discord: {e}")
    if cfg.telegram_token:
        try:
            from .gateway.telegram_bot import TelegramGateway
            tg = TelegramGateway(cfg, agent, vault, index, home)
            scheduler.register("telegram", tg.notify_home, tg.send_to)
            tasks.append(guarded("Telegram", tg.run()))
        except Exception as e:
            print(f"⚠️ Không bật Telegram: {e}")
    tasks.append(guarded("Scheduler", scheduler.run()))
    await asyncio.gather(*tasks)


def _onboard(cfg) -> None:
    """Checklist cấu hình lần đầu — lần đầu."""
    env_file = cfg.root / ".env"
    if not env_file.exists():
        example = cfg.root / ".env.example"
        if example.exists():
            shutil.copy(example, env_file)
            print(f"→ Đã tạo {env_file} từ .env.example — mở lên điền key.")
    if env_file.exists():
        env_file.chmod(0o600)  # chỉ chủ máy đọc được secrets
    import os
    if not (os.environ.get("TELEGRAM_ALLOWED_USERS") or os.environ.get("DISCORD_ALLOWED_USERS")):
        print("⚠️ Allowlist trống — bot sẽ mở cho MỌI người. Điền *_ALLOWED_USERS trước khi chạy thật.")
    checks = [
        (f"LLM key cho provider '{cfg.llm_provider}' (bắt buộc)", bool(cfg.llm_api_key)),
        ("DISCORD_BOT_TOKEN (kênh Discord)", bool(cfg.discord_token)),
        ("TELEGRAM_BOT_TOKEN (kênh Telegram)", bool(cfg.telegram_token)),
        ("VOYAGE_API_KEY (embedding — thiếu thì dùng local)", bool(cfg.voyage_api_key)),
        ("ffmpeg (xử lý video/ghi âm)", shutil.which("ffmpeg") is not None),
    ]
    print("Kiểm tra cấu hình:")
    for label, ok in checks:
        print(f"  {'✅' if ok else '⬜'} {label}")
    print(
        "\nTiếp theo:\n"
        "  1. Bỏ tài liệu vào source_mirror/<khoá>/<module>/ rồi chạy: learning-agent sync\n"
        "     (hoặc gửi file trực tiếp cho bot sau khi chạy: learning-agent bot)\n"
        "  2. Trong chat: /sethome để nhận báo cáo học tập hằng ngày (cron trong config.yaml)\n"
        "  3. Giới hạn người dùng: DISCORD_ALLOWED_USERS / TELEGRAM_ALLOWED_USERS trong .env"
    )


if __name__ == "__main__":
    main()
