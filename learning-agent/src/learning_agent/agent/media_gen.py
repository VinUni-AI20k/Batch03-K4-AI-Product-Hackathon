"""Sinh audio tiếng Việt (TTS) và ảnh minh hoạ — CHỈ khi học viên yêu cầu rõ ràng
(rule trong SYSTEM_PROMPT), không tự động chèn vào mọi câu trả lời.

- Audio: edge-tts (giọng neural Microsoft, MIỄN PHÍ, không cần API key riêng, chất
  lượng tiếng Việt tốt) — không phụ thuộc provider LLM đang cấu hình (Ollama/Groq/...
  vẫn dùng được tính năng này).
- Ảnh: OpenAI Images API — cần OPENAI_API_KEY riêng (tính năng này CHỈ có ở OpenAI,
  không có lựa chọn free/local tương đương đủ tốt). Nếu provider chat khác OpenAI mà
  không có OPENAI_API_KEY thì báo rõ, không âm thầm thất bại.

Trả (message, file_path|None) — path để caller (gateway/webui) tự đính kèm đúng kiểu
kênh, giống hệt pattern diagram_attachments() đã có trong render.py.
"""
from __future__ import annotations

import os
import re
import uuid
from datetime import date
from pathlib import Path

TTS_MAX_CHARS = 2000       # 1 clip vừa phải, tránh audio quá dài/chậm
IMAGE_MAX_PROMPT = 900
VI_VOICE = "vi-VN-HoaiMyNeural"


class MediaRateLimiter:
    """Giới hạn RIÊNG cho tạo audio/ảnh trên web công khai — tách biệt hẳn rate-limit
    chat thường (chat-public dùng CHUNG 1 user_id cho mọi khách nên phải đếm theo IP
    thật, không theo user_id). Chỉ áp cho public; Telegram/Discord/admin đã qua
    allowlist riêng nên không giới hạn thêm ở đây. In-memory, reset khi restart —
    đủ dùng cho demo, không cần bền vững qua restart."""

    def __init__(self):
        self.audio_cap = int(os.environ.get("VLEARN_MEDIA_AUDIO_DAILY_PUBLIC", "10"))
        self.image_cap = int(os.environ.get("VLEARN_MEDIA_IMAGE_DAILY_PUBLIC", "2"))
        self._counts: dict[str, int] = {}  # key: f"{kind}:{ip}:{ngày}"

    def check(self, kind: str, ip: str) -> str:
        """'' nếu còn hạn mức, chuỗi lý do nếu đã hết (KHÔNG tự tăng đếm — gọi consume() sau khi thật sự sinh xong)."""
        cap = self.audio_cap if kind == "audio" else self.image_cap
        key = f"{kind}:{ip}:{date.today().isoformat()}"
        if self._counts.get(key, 0) >= cap:
            noun = "audio" if kind == "audio" else "ảnh"
            return f"⚠️ Bản demo công khai giới hạn {cap} {noun}/ngày cho mỗi người — bạn đã dùng hết hôm nay, hẹn mai nhé!"
        return ""

    def consume(self, kind: str, ip: str) -> None:
        key = f"{kind}:{ip}:{date.today().isoformat()}"
        self._counts[key] = self._counts.get(key, 0) + 1


class MediaGen:
    def __init__(self, cfg):
        self.cfg = cfg
        self.out_dir = Path(cfg.root) / "data" / "generated"
        self.limiter = MediaRateLimiter()

    def tts(self, text: str, rate_key: str | None = None) -> tuple[str, str | None]:
        if rate_key:
            blocked = self.limiter.check("audio", rate_key)
            if blocked:
                return blocked, None
        text = re.sub(r"\s+", " ", (text or "")).strip()[:TTS_MAX_CHARS]
        if not text:
            return "⚠️ Thiếu nội dung cần đọc.", None
        try:
            import edge_tts
        except ImportError:
            return ("⚠️ Chưa cài công cụ tạo audio — chạy: pip install edge-tts", None)
        self.out_dir.mkdir(parents=True, exist_ok=True)
        out = self.out_dir / f"tts-{uuid.uuid4().hex[:10]}.mp3"
        try:
            import asyncio

            async def _gen() -> None:
                await edge_tts.Communicate(text, voice=VI_VOICE).save(str(out))

            asyncio.run(_gen())
        except Exception as e:
            return f"⚠️ Không tạo được audio: {e}", None
        if not out.exists() or out.stat().st_size == 0:
            return "⚠️ Không tạo được audio (file rỗng).", None
        if rate_key:
            self.limiter.consume("audio", rate_key)
        return f"✅ Đã tạo audio tiếng Việt ({len(text)} ký tự).", str(out)

    def _openai_key(self) -> str:
        """Images API chỉ tồn tại ở api.openai.com — chấp nhận OPENAI_API_KEY riêng, HOẶC
        LLM_API_KEY/LLM_BASE_URL (provider='custom') nếu base_url đó CHÍNH LÀ OpenAI thật."""
        import os
        key = os.environ.get("OPENAI_API_KEY", "").strip()
        if key:
            return key
        if str(self.cfg.llm_base_url).rstrip("/").startswith("https://api.openai.com"):
            return self.cfg.llm_api_key
        return ""

    def image(self, mo_ta: str, rate_key: str | None = None) -> tuple[str, str | None]:
        if rate_key:
            blocked = self.limiter.check("image", rate_key)
            if blocked:
                return blocked, None
        key = self._openai_key()
        if not key:
            return ("⚠️ Tạo ảnh cần key OpenAI thật (OPENAI_API_KEY, hoặc LLM_API_KEY nếu "
                    "LLM_BASE_URL trỏ tới api.openai.com) — tính năng này luôn dùng OpenAI "
                    "Images, không phụ thuộc provider chat đang cấu hình.", None)
        mo_ta = (mo_ta or "").strip()[:IMAGE_MAX_PROMPT]
        if not mo_ta:
            return "⚠️ Thiếu mô tả ảnh cần tạo.", None
        try:
            from openai import OpenAI
            client = OpenAI(base_url="https://api.openai.com/v1", api_key=key)
            resp = client.images.generate(model="gpt-image-2", prompt=mo_ta, size="1024x1024", n=1)
            item = resp.data[0]
        except Exception as e:
            return f"⚠️ Không tạo được ảnh: {e}", None
        self.out_dir.mkdir(parents=True, exist_ok=True)
        out = self.out_dir / f"img-{uuid.uuid4().hex[:10]}.png"
        try:
            b64 = getattr(item, "b64_json", None)
            if b64:
                import base64
                out.write_bytes(base64.b64decode(b64))
            else:
                import urllib.request
                # url do chính OpenAI trả về (CDN của họ), không phải input người dùng/LLM
                # tự do -> không cần SSRF-guard như hoc_tu_nguon_ngoai (nguồn tin cậy)
                urllib.request.urlretrieve(item.url, out)  # noqa: S310
        except Exception as e:
            return f"⚠️ Lưu ảnh lỗi: {e}", None
        if not out.exists() or out.stat().st_size == 0:
            return "⚠️ Tải ảnh về lỗi (file rỗng).", None
        if rate_key:
            self.limiter.consume("image", rate_key)
        return "✅ Đã tạo ảnh.", str(out)

    def tool_schemas(self) -> list[dict]:
        return [
            {
                "type": "function",
                "function": {
                    "name": "tao_am_thanh",
                    "description": (
                        "Đọc một đoạn văn bản thành audio TIẾNG VIỆT (giọng đọc thật, .mp3). "
                        "CHỈ gọi khi học viên YÊU CẦU RÕ RÀNG ('đọc cho tôi nghe', 'tạo audio', "
                        "'chuyển thành giọng nói'...) — KHÔNG tự ý tạo audio cho câu trả lời "
                        "thường. Tối đa ~2000 ký tự/lần, nội dung dài thì tóm gọn trước."),
                    "parameters": {
                        "type": "object",
                        "properties": {"text": {"type": "string", "description": "Nội dung cần đọc thành giọng nói"}},
                        "required": ["text"],
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "tao_anh",
                    "description": (
                        "Tạo một ảnh minh hoạ từ mô tả (OpenAI Images). CHỈ gọi khi học viên "
                        "YÊU CẦU RÕ RÀNG ('vẽ cho tôi', 'tạo ảnh', 'minh hoạ bằng hình'...) — "
                        "KHÔNG tự ý tạo ảnh để trang trí câu trả lời thường. Mô tả nên cụ thể, "
                        "rõ phong cách (sơ đồ/ảnh thực/minh hoạ...) để kết quả đúng ý."),
                    "parameters": {
                        "type": "object",
                        "properties": {"mo_ta": {"type": "string", "description": "Mô tả ảnh cần tạo, càng cụ thể càng tốt"}},
                        "required": ["mo_ta"],
                    },
                },
            },
        ]
