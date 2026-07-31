"""CLI: learning-agent <lệnh>

  onboard   kiểm tra cấu hình lần đầu (.env, token, thư mục)
  config    wizard cấu hình tương tác: chọn provider LLM, dán key, model, kênh, khởi động
  chat      chat liên tục với agent ngay trong terminal (REPL)
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
    _ensure_indexed(cfg, vault, index)
    return vault, index


def _ensure_indexed(cfg, vault, index) -> None:
    """Cài đặt là DÙNG ĐƯỢC NGAY: repo đã bundle sẵn vault (bài học); lần đầu chạy mà index còn
    rỗng thì tự embed toàn bộ kho có sẵn (một lần) — khớp đúng embedder người dùng vừa cấu hình."""
    try:
        if index.collection.count() > 0:
            return
        notes = list(vault.notes("courses"))
        if not notes:
            return
        emb = "Voyage" if cfg.voyage_api_key else "local (miễn phí)"
        print(f"🔎 Lần đầu chạy — đang index {len(notes)} bài học có sẵn trong repo bằng embedding {emb} "
              "(một lần, chờ chút)...", flush=True)
        from .updater.sync import reindex_all
        n = reindex_all(cfg, vault, index)
        print(f"✅ Kho kiến thức sẵn sàng — {n} đoạn. Agent trả lời được ngay.", flush=True)
    except Exception as e:  # lỗi index không được chặn agent khởi động
        print(f"⚠️ Chưa tự index được kho kiến thức ({e}). Chạy tay: learning-agent reindex", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(prog="learning-agent", description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("onboard")
    sub.add_parser("config")
    sub.add_parser("update")
    ui = sub.add_parser("ui")
    ui.add_argument("--port", type=int, default=8321)
    ui.add_argument("--host", default="127.0.0.1", help="0.0.0.0 khi chạy trong Docker")
    sub.add_parser("sync")
    sub.add_parser("reindex")
    ask = sub.add_parser("ask")
    ask.add_argument("question", nargs="+")
    sub.add_parser("chat")
    sub.add_parser("bot")
    args = parser.parse_args()

    cfg = load_config()

    if args.cmd == "onboard":
        _onboard(cfg)
        return

    if args.cmd == "config":
        _config_wizard(cfg)
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

    elif args.cmd == "chat":
        from .agent import TutorAgent
        _repl(TutorAgent(cfg, vault, index))

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


def _repl(agent) -> None:
    """Chat với Vlearn Agent ngay trong terminal (REPL đơn giản)."""
    print("\n\033[1;35m💬 Chat với Vlearn Agent\033[0m — gõ câu hỏi; Enter rỗng hoặc 'thoát' để dừng.\n")
    history: list[dict] = []
    while True:
        try:
            q = input("\033[1;36mBạn:\033[0m ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not q or q.lower() in ("thoát", "thoat", "quit", "exit", ":q"):
            break
        history.append({"role": "user", "content": q})
        answer = agent.reply("cli-user", "CLI", history)
        history.append({"role": "assistant", "content": answer})
        print(f"\033[1;35mVlearn:\033[0m {answer}\n")


# ─────────────────────────── wizard cấu hình tương tác ───────────────────────────
_PROVIDERS = [
    ("openai",     "OpenAI — GPT (gpt-4o-mini, gpt-5.4-mini)"),
    ("openrouter", "OpenRouter — Claude / Gemini / Llama qua 1 key"),
    ("gemini",     "Google Gemini"),
    ("groq",       "Groq — siêu nhanh, có bậc miễn phí"),
    ("together",   "Together AI"),
    ("ollama",     "Ollama — chạy local, KHÔNG cần key"),
]

# Model gợi ý theo provider (chọn từ list; luôn kèm mục "nhập tay" cho model khác)
_MODELS = {
    "openai":     ["gpt-5.4-mini", "gpt-4o-mini", "gpt-4o", "o4-mini", "gpt-4.1-mini"],
    "openrouter": ["anthropic/claude-3.7-sonnet", "anthropic/claude-3.5-sonnet",
                   "google/gemini-2.0-flash", "meta-llama/llama-3.3-70b-instruct", "openai/gpt-4o-mini"],
    "gemini":     ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    "groq":       ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    "together":   ["meta-llama/Llama-3.3-70B-Instruct-Turbo",
                   "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo", "Qwen/Qwen2.5-72B-Instruct-Turbo"],
    "ollama":     ["llama3.1", "llama3.2", "qwen2.5", "mistral"],
}
_MODEL_CUSTOM = "__custom__"


def _env_set(path, key: str, value: str) -> None:
    """Ghi/ghi đè KEY=value trong .env, giữ nguyên các dòng khác."""
    lines = path.read_text(encoding="utf-8").splitlines() if path.exists() else []
    out, found = [], False
    for ln in lines:
        if ln.startswith(key + "="):
            out.append(f"{key}={value}")
            found = True
        else:
            out.append(ln)
    if not found:
        out.append(f"{key}={value}")
    path.write_text("\n".join(out) + "\n", encoding="utf-8")


def _yaml_set(path, key: str, value: str) -> None:
    """Thay dòng '  key: ...' ĐẦU TIÊN trong config.yaml, giữ indent + comment inline."""
    import re
    if not path.exists():
        return
    lines = path.read_text(encoding="utf-8").splitlines()
    pat = re.compile(rf"^(\s*){re.escape(key)}:\s*.*?(\s*#.*)?$")
    for i, ln in enumerate(lines):
        m = pat.match(ln)
        if m:
            indent, comment = m.group(1), m.group(2) or ""
            lines[i] = f"{indent}{key}: {value}{comment}"
            path.write_text("\n".join(lines) + "\n", encoding="utf-8")
            return


def _tg_get(token: str, method: str, timeout: int = 35, **params):
    import json
    import urllib.parse
    import urllib.request
    url = f"https://api.telegram.org/bot{token}/{method}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    with urllib.request.urlopen(url, timeout=timeout) as r:  # noqa: S310 (host cố định telegram)
        return json.load(r)


def _telegram_capture_id(token: str):
    """Validate token + tự bắt Telegram user ID: hướng dẫn nhắn bot rồi đọc getUpdates."""
    try:
        me = _tg_get(token, "getMe", timeout=10)
    except Exception as e:
        print(f"  ⚠️ Không gọi được Telegram ({e}). Nhập ID tay nếu biết.")
        return None
    if not me.get("ok"):
        print("  ⚠️ Token không hợp lệ (getMe thất bại).")
        return None
    uname = me["result"].get("username", "")
    print(f"  ✓ Token OK — bot \033[36m@{uname}\033[0m")
    print(f"  → Mở \033[36mhttps://t.me/{uname}\033[0m, bấm \033[1mSTART\033[0m (hoặc gửi 1 tin nhắn bất kỳ).")
    try:
        input("  → Nhắn xong bấm Enter để mình tự lấy ID (bỏ qua: gõ 'skip' rồi Enter)… ")
    except (EOFError, KeyboardInterrupt):
        return None
    try:
        upd = _tg_get(token, "getUpdates", timeout=30, limit=10)
    except Exception as e:
        print(f"  ⚠️ Không đọc được updates ({e}).")
        return None
    ids = []
    for u in upd.get("result", []):
        frm = ((u.get("message") or u.get("edited_message") or {}).get("from") or {})
        if frm.get("id") and not frm.get("is_bot"):
            ids.append((str(frm["id"]), frm.get("first_name", "")))
    if not ids:
        print("  ⚠️ Chưa thấy tin nhắn nào tới bot. Nhắn cho bot rồi chạy lại: learning-agent config")
        return None
    uid, name = ids[-1]
    print(f"  ✓ Đã lấy ID: \033[1;32m{uid}\033[0m ({name})")
    return uid


def _config_wizard(cfg) -> None:
    """Wizard tương tác (kiểu `openclaw config`): chọn provider, dán key (mask), model, embedding, kênh."""
    from .config import LLM_PROVIDERS

    env_path = cfg.root / ".env"
    if not env_path.exists():
        ex = cfg.root / ".env.example"
        if ex.exists():
            shutil.copy(ex, env_path)
    cur_provider = cfg.llm_provider if cfg.llm_provider in LLM_PROVIDERS else "openai"
    cur_model = str((cfg.raw.get("llm") or {}).get("model", "") or "")

    try:
        import questionary
        from questionary import Choice, Style
    except Exception:
        return _config_simple(cfg, env_path)
    if not sys.stdin.isatty():
        return _config_simple(cfg, env_path)

    style = Style([
        ("qmark", "fg:#F59E0B bold"), ("question", "bold"),
        ("pointer", "fg:#F59E0B bold"), ("highlighted", "fg:#F59E0B bold"),
        ("selected", "fg:#10B981"), ("answer", "fg:#10B981 bold"),
    ])

    print("\n\033[1;35m🎓 Vlearn Agent — Cấu hình\033[0m")
    print(f"  Hiện tại: provider=\033[36m{cfg.llm_provider}\033[0m"
          f"  model=\033[36m{cur_model or '—'}\033[0m"
          f"  key={'✓' if cfg.llm_api_key else '✗ chưa có'}"
          f"  embedding={'Voyage' if cfg.voyage_api_key else 'local'}\n")

    try:
        provider = questionary.select(
            "Nhà cung cấp LLM (model để chat)?",
            choices=[Choice(label, value=pid) for pid, label in _PROVIDERS],
            default=next((c for c in _PROVIDERS if c[0] == cur_provider), _PROVIDERS[0])[0],
            style=style, qmark="▸",
        ).ask()
        if provider is None:
            print("Đã huỷ."); return
        preset = LLM_PROVIDERS[provider]
        key = None
        if provider != "ollama":
            key = questionary.password(
                f"API key cho {provider} (dán vào — hiện dạng ***, Enter để giữ nguyên):",
                style=style, qmark="▸",
            ).ask()
        model_opts = list(_MODELS.get(provider, []))
        if cur_model and cur_model not in model_opts:
            model_opts.insert(0, cur_model)  # giữ model đang dùng nếu khác list
        model_choices = [Choice(m, value=m) for m in model_opts]
        model_choices.append(Choice("✏️  Nhập model khác…", value=_MODEL_CUSTOM))
        picked = questionary.select(
            "Model (chọn từ list, hoặc nhập tay):",
            choices=model_choices,
            default=cur_model if cur_model in model_opts else (model_opts[0] if model_opts else _MODEL_CUSTOM),
            style=style, qmark="▸",
        ).ask()
        if picked == _MODEL_CUSTOM:
            model = questionary.text(
                "Nhập tên model:", default=cur_model or preset["example_model"], style=style, qmark="▸",
            ).ask()
        else:
            model = picked
        use_voyage = questionary.confirm(
            "Dùng Voyage AI embedding? (No = local, miễn phí, không cần key)",
            default=bool(cfg.voyage_api_key), style=style, qmark="▸",
        ).ask()
        vk = questionary.password("VOYAGE_API_KEY (dán vào):", style=style, qmark="▸").ask() if use_voyage else None

        tg = dc = tg_allow = dc_allow = None
        if questionary.confirm("Bật kênh Telegram? (chat qua bot Telegram)",
                               default=bool(cfg.telegram_token), style=style, qmark="▸").ask():
            tg = questionary.password("Dán TELEGRAM_BOT_TOKEN (lấy ở @BotFather):", style=style, qmark="▸").ask()
            auto = _telegram_capture_id(tg.strip()) if tg and tg.strip() else None
            if auto:
                if questionary.confirm(f"Chỉ cho phép ID {auto} (bạn) dùng bot?",
                                       default=True, style=style, qmark="▸").ask():
                    tg_allow = auto
                else:
                    tg_allow = questionary.text(
                        "Nhập ID được phép (phẩy ngăn cách; để trống = MỞ cho mọi người):",
                        default=auto, style=style, qmark="▸").ask()
            else:
                tg_allow = questionary.text(
                    "Telegram user ID được phép (phẩy ngăn cách; để trống = MỞ cho mọi người):",
                    style=style, qmark="▸").ask()
        if questionary.confirm("Bật kênh Discord?", default=bool(cfg.discord_token),
                               style=style, qmark="▸").ask():
            dc = questionary.password("Dán DISCORD_BOT_TOKEN:", style=style, qmark="▸").ask()
            dc_allow = questionary.text(
                "Discord user ID được phép (phẩy ngăn cách; để trống = MỞ cho mọi người):",
                style=style, qmark="▸").ask()
    except KeyboardInterrupt:
        print("Đã huỷ."); return
    except Exception:
        # prompt_toolkit không mở được TUI (vd chạy trong script/không có tty chuẩn) -> nhập tay
        print("⚠️ Không mở được giao diện chọn — chuyển sang nhập tay (dán vào được).")
        return _config_simple(cfg, env_path)

    if key and key.strip():
        _env_set(env_path, preset["key_env"], key.strip())
    if vk and vk.strip():
        _env_set(env_path, "VOYAGE_API_KEY", vk.strip())
    if tg and tg.strip():
        _env_set(env_path, "TELEGRAM_BOT_TOKEN", tg.strip())
        _env_set(env_path, "TELEGRAM_ALLOWED_USERS", (tg_allow or "").strip())
    if dc and dc.strip():
        _env_set(env_path, "DISCORD_BOT_TOKEN", dc.strip())
        _env_set(env_path, "DISCORD_ALLOWED_USERS", (dc_allow or "").strip())
    # bật kênh nhưng để trống allowlist -> cho phép bot chạy (mở cho mọi người, hợp demo)
    open_bot = (tg and not (tg_allow or "").strip()) or (dc and not (dc_allow or "").strip())
    if open_bot:
        _env_set(env_path, "VLEARN_ALLOW_ALL", "1")
    _yaml_set(cfg.root / "config.yaml", "provider", provider)
    if model and model.strip():
        _yaml_set(cfg.root / "config.yaml", "model", model.strip())
    env_path.chmod(0o600)

    print("\n\033[1;32m✅ Đã lưu cấu hình.\033[0m")
    if open_bot:
        print("\033[1;33m⚠️ Kênh bot đang MỞ cho mọi người (allowlist trống). "
              "Điền *_ALLOWED_USERS trong .env để giới hạn.\033[0m")

    # ── chọn khởi động ngay ──
    has_bot = bool((tg and tg.strip()) or (dc and dc.strip()) or cfg.telegram_token or cfg.discord_token)
    launch_choices = [
        Choice("💬 Chat thử ngay trong Terminal", value="chat"),
        Choice("🌐 Dashboard web  (http://127.0.0.1:8321)", value="ui"),
    ]
    if has_bot:
        launch_choices.append(Choice("🤖 Chạy bot Telegram/Discord đã cấu hình", value="bot"))
    launch_choices.append(Choice("⏭  Để sau (thoát)", value="quit"))
    try:
        launch = questionary.select(
            "Khởi động Vlearn Agent ở đâu bây giờ?", choices=launch_choices,
            style=style, qmark="▸",
        ).ask()
    except Exception:
        launch = None
    if launch and launch != "quit":
        import os
        exe = sys.argv[0]
        print(f"\n▸ \033[36mlearning-agent {launch}\033[0m …\n")
        os.execvp(exe, [exe, launch])
    else:
        print("Chạy sau:  \033[36mlearning-agent ui\033[0m  ·  \033[36mlearning-agent chat\033[0m"
              + ("  ·  \033[36mlearning-agent bot\033[0m" if has_bot else ""))


def _config_simple(cfg, env_path) -> None:
    """Fallback không TUI (questionary thiếu / không phải terminal): nhập HIỆN rõ để dán được."""
    from .config import LLM_PROVIDERS
    if not sys.stdin.isatty():
        print("⚠️ Không có bàn phím tương tác. Mở terminal rồi chạy: learning-agent config")
        return
    print("\n🎓 Vlearn Agent — Cấu hình (nhập tay)")
    for i, (pid, label) in enumerate(_PROVIDERS, 1):
        print(f"  {i}) {label}")
    sel = input("Chọn provider [1]: ").strip() or "1"
    try:
        provider = _PROVIDERS[int(sel) - 1][0]
    except (ValueError, IndexError):
        provider = "openai"
    preset = LLM_PROVIDERS[provider]
    if provider != "ollama":
        key = input(f"API key cho {provider} (dán vào, hiện rõ; Enter bỏ qua): ").strip()
        if key:
            _env_set(env_path, preset["key_env"], key)
    model = input(f"Model [{preset['example_model']}]: ").strip() or preset["example_model"]
    vk = input("VOYAGE_API_KEY (Enter = dùng local miễn phí): ").strip()
    if vk:
        _env_set(env_path, "VOYAGE_API_KEY", vk)
    t = input("TELEGRAM_BOT_TOKEN (Enter nếu không dùng): ").strip()
    if t:
        _env_set(env_path, "TELEGRAM_BOT_TOKEN", t)
    d = input("DISCORD_BOT_TOKEN (Enter nếu không dùng): ").strip()
    if d:
        _env_set(env_path, "DISCORD_BOT_TOKEN", d)
    _yaml_set(cfg.root / "config.yaml", "provider", provider)
    _yaml_set(cfg.root / "config.yaml", "model", model)
    env_path.chmod(0o600)
    print("✅ Đã lưu. Chạy: learning-agent ui  (hoặc learning-agent bot)")


if __name__ == "__main__":
    main()
