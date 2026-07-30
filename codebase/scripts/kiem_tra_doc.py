"""SMOKE TEST 1 — bot có đọc được tin nhắn Discord không?

    python scripts/kiem_tra_doc.py

Không gọi AI. Không ghi gì. Chỉ đọc và in ra để bạn tự thấy.
Chạy cái này TRƯỚC khi làm gì khác — nếu nó không in ra nội dung tin nhắn thì
mọi thứ phía sau đều vô nghĩa.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import discord  # noqa: E402

from timlai import config  # noqa: E402

intents = discord.Intents.default()
intents.message_content = True


class KiemTra(discord.Client):
    async def on_ready(self) -> None:
        print(f"online: {self.user}\n")
        if not self.guilds:
            print("✗ Bot chưa ở trong server nào — chạy lại URL OAuth2 để mời bot.")
            return await self.close()

        for guild in self.guilds:
            print(f"SERVER: {guild.name}  (GUILD_ID={guild.id})")
            for ch in guild.text_channels:
                if config.KENH_INDEX and ch.name not in config.KENH_INDEX:
                    continue
                if not ch.permissions_for(guild.me).read_message_history:
                    print(f"  #{ch.name:<22} ✗ THIẾU QUYỀN Read Message History")
                    continue

                tin = [m async for m in ch.history(limit=5)]
                print(f"  #{ch.name:<22} ✓ đọc được {len(tin)} tin gần nhất")
                for m in tin:
                    khi = m.created_at.strftime("%d/%m %H:%M")
                    noi_dung = m.content.replace("\n", " ")[:60] or "(không có text)"
                    dinh_kem = f" 📎{len(m.attachments)}" if m.attachments else ""
                    print(f"       [{khi}] {m.author.display_name}: {noi_dung}{dinh_kem}")
                    print(f"                {m.jump_url}")

                if tin and all(not m.content and not m.attachments for m in tin):
                    print("       ⚠️ MỌI content rỗng → chưa bật MESSAGE CONTENT INTENT")
            print()
        await self.close()


if __name__ == "__main__":
    KiemTra(intents=intents).run(config.can_discord())
