"""Dựng index từ lịch sử Discord.

    python scripts/backfill.py            # 3000 tin/kênh
    python scripts/backfill.py 500        # giới hạn khác

Chạy 1 lần. Sau đó bot tự cập nhật tin mới qua on_message.
Bot đọc được cả tin đăng TRƯỚC khi bot vào server.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import discord  # noqa: E402

from timlai import config, index  # noqa: E402
from timlai.bot import tu_discord  # noqa: E402

intents = discord.Intents.default()
intents.message_content = True

MOI_KENH = int(sys.argv[1]) if len(sys.argv) > 1 else 3000


class Backfill(discord.Client):
    async def on_ready(self) -> None:
        db = index.mo_db()
        tong = 0
        for guild in self.guilds:
            print(f"SERVER: {guild.name}")
            for ch in guild.text_channels:
                if config.KENH_INDEX and ch.name not in config.KENH_INDEX:
                    continue
                if not ch.permissions_for(guild.me).read_message_history:
                    print(f"  #{ch.name:<22} bỏ qua (thiếu quyền)")
                    continue
                dsach = [
                    tu_discord(m)
                    async for m in ch.history(limit=MOI_KENH)
                    if not m.author.bot and (m.content or m.attachments or m.embeds)
                ]
                n = index.them_nhieu(db, dsach)
                tong += n
                print(f"  #{ch.name:<22} +{n}")
        print(f"\nindex.db: {index.dem(db)} tin nhắn (vừa ghi {tong})")
        if config.KENH_INDEX:
            print(f"Kênh được index: {', '.join(config.KENH_INDEX)}")
        await self.close()


if __name__ == "__main__":
    Backfill(intents=intents).run(config.can_discord())
