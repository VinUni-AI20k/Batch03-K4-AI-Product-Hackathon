"""Cron scheduler — mô hình Hermes: tick, mỗi job chạy một phiên agent MỚI,
kết quả tự giao về chat.

Hai loại job:
1. Tĩnh (config.yaml `schedules`): chạy hằng ngày theo giờ, giao về home chat (/sethome).
2. Động (học viên tạo từ chat qua tool schedule_task — UX kiểu ChatGPT Scheduled tasks):
   "5 phút nữa nhắc tôi uống nước", "mỗi ngày 21:00 quiz tôi" — lưu data/schedules.json
   (sống qua restart), kết quả giao về đúng chat đã tạo.
"""
from __future__ import annotations

import asyncio
import json
import re
import uuid
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Awaitable, Callable

Notifier = Callable[[str], Awaitable[None]]            # gửi text về home chat
Sender = Callable[[str, str], Awaitable[None]]         # gửi text về (chat_id, text)


def parse_when(when: str, now: datetime | None = None) -> tuple[str, str] | None:
    """'5m'/'10 phút'/'2h' -> ('once', iso) · 'daily 07:30' -> ('daily', 'HH:MM')
    · '21:00' -> ('once', iso lần tới) · ISO datetime -> ('once', iso). None = không hiểu."""
    now = now or datetime.now()
    s = when.strip().lower()

    m = re.fullmatch(r"(\d+)\s*(m|min|phut|phút)", s)
    if m:
        return "once", (now + timedelta(minutes=int(m.group(1)))).isoformat(timespec="seconds")
    m = re.fullmatch(r"(\d+)\s*(h|gio|giờ)", s)
    if m:
        return "once", (now + timedelta(hours=int(m.group(1)))).isoformat(timespec="seconds")

    m = re.fullmatch(r"(?:daily|hằng ngày|hàng ngày|mỗi ngày)\s*(\d{1,2}):(\d{2})", s) \
        or re.fullmatch(r"(\d{1,2}):(\d{2})\s*(?:daily|hằng ngày|hàng ngày|mỗi ngày)", s)
    if m:
        return "daily", f"{int(m.group(1)):02d}:{m.group(2)}"

    m = re.fullmatch(r"(\d{1,2}):(\d{2})", s)
    if m:
        target = now.replace(hour=int(m.group(1)), minute=int(m.group(2)), second=0, microsecond=0)
        if target <= now:
            target += timedelta(days=1)
        return "once", target.isoformat(timespec="seconds")

    try:
        return "once", datetime.fromisoformat(when.strip()).isoformat(timespec="seconds")
    except ValueError:
        return None


class TaskStore:
    """Task động, persist ra JSON để sống qua restart."""

    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.tasks: list[dict] = []
        if path.exists():
            self.tasks = json.loads(path.read_text(encoding="utf-8"))

    def _save(self) -> None:
        self.path.write_text(
            json.dumps(self.tasks, ensure_ascii=False, indent=1), encoding="utf-8"
        )

    def add(self, prompt: str, when: str, platform: str, chat_id: str) -> str:
        parsed = parse_when(when)
        if parsed is None:
            return (
                f"⚠️ Không hiểu thời gian '{when}'. Dùng: '5m', '2h', '21:00', "
                f"'daily 07:30', hoặc ISO datetime."
            )
        when_type, at = parsed
        task = {
            "id": uuid.uuid4().hex[:8],
            "prompt": prompt,
            "type": when_type,
            "at": at,
            "platform": platform,
            "chat_id": chat_id,
        }
        self.tasks.append(task)
        self._save()
        desc = f"mỗi ngày lúc {at}" if when_type == "daily" else f"lúc {at.replace('T', ' ')}"
        return f"✅ Đã lên lịch [{task['id']}] {desc}: {prompt}"

    def list(self) -> str:
        if not self.tasks:
            return "Chưa có công việc nào được lên lịch."
        lines = []
        for t in self.tasks:
            when = f"hằng ngày {t['at']}" if t["type"] == "daily" else t["at"].replace("T", " ")
            lines.append(f"- [{t['id']}] {when} — {t['prompt']} (kênh {t['platform']})")
        return "\n".join(lines)

    def cancel(self, task_id: str) -> str:
        before = len(self.tasks)
        self.tasks = [t for t in self.tasks if t["id"] != task_id.strip()]
        if len(self.tasks) == before:
            return f"Không có task id '{task_id}'. Danh sách:\n{self.list()}"
        self._save()
        return f"✅ Đã huỷ task {task_id}."


class Scheduler:
    def __init__(self, cfg, agent):
        self.agent = agent
        self.static_jobs: list[dict] = cfg.get("schedules", default=None) or []
        self.store = TaskStore(cfg.root / "data" / "schedules.json")
        self.notifiers: dict[str, Notifier] = {}   # platform -> gửi về home chat
        self.senders: dict[str, Sender] = {}       # platform -> gửi về chat bất kỳ
        self._last_run: dict[str, date] = {}

    def register(self, platform: str, notifier: Notifier, sender: Sender) -> None:
        self.notifiers[platform] = notifier
        self.senders[platform] = sender

    async def run(self) -> None:
        while True:
            now = datetime.now()
            for job in self.static_jobs:
                name = job.get("name", job.get("skill", "job"))
                if now.strftime("%H:%M") == str(job.get("time")) and self._last_run.get(name) != now.date():
                    self._last_run[name] = now.date()
                    asyncio.create_task(self._run_static(job))
            for task in list(self.store.tasks):
                due = (
                    task["at"] <= now.isoformat() if task["type"] == "once"
                    else now.strftime("%H:%M") == task["at"]
                    and self._last_run.get(task["id"]) != now.date()
                )
                if due:
                    self._last_run[task["id"]] = now.date()
                    if task["type"] == "once":
                        self.store.tasks.remove(task)
                        self.store._save()
                    asyncio.create_task(self._run_dynamic(task))
            await asyncio.sleep(20)

    # ---------- thực thi (phiên agent mới — mô hình cron Hermes) ----------
    async def _run_static(self, job: dict) -> None:
        prompt = (
            f"Hôm nay là {datetime.now().strftime('%A %d/%m/%Y')}. "
            f"Đây là công việc định kỳ '{job.get('name')}'. "
            f"Hãy load skill '{job.get('skill', '')}' và thực hiện đúng quy trình trong đó. "
            f"Kết quả của bạn sẽ được gửi thẳng cho học viên."
        )
        text = await asyncio.to_thread(
            self.agent.reply, "scheduler", "Scheduler",
            [{"role": "user", "content": prompt}],
        )
        deliver = str(job.get("deliver", "all"))
        targets = self.notifiers if deliver == "all" else {
            k: v for k, v in self.notifiers.items() if k in deliver
        }
        for platform, send in targets.items():
            try:
                await send(text)
            except Exception as e:
                print(f"[scheduler] gửi {platform} lỗi: {e}")

    async def _run_dynamic(self, task: dict) -> None:
        prompt = (
            f"Bây giờ là {datetime.now().strftime('%H:%M %d/%m/%Y')}. "
            f"Đây là công việc học viên đã lên lịch từ trước, đến giờ thực hiện: \"{task['prompt']}\". "
            f"Nếu là lời nhắc thì nhắc ngắn gọn thân thiện; nếu là việc (quiz, tóm tắt, báo cáo...) "
            f"thì thực hiện luôn. Trả lời như đang gửi trực tiếp cho học viên."
        )
        text = await asyncio.to_thread(
            self.agent.reply, "scheduler", "Scheduler",
            [{"role": "user", "content": prompt}],
        )
        sender = self.senders.get(task["platform"])
        try:
            if sender:
                await sender(task["chat_id"], f"⏰ {text}")
            elif self.notifiers.get(task["platform"]):
                await self.notifiers[task["platform"]](f"⏰ {text}")
        except Exception as e:
            print(f"[scheduler] gửi task {task['id']} lỗi: {e}")
