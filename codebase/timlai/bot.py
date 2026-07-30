"""Lớp ① — Discord.

    python -m timlai.bot

Chỉ làm 3 việc: nhận slash command, gọi lớp ② rồi lớp ③, render kết quả.
Mọi logic quyết định nằm ở tra_cuu.py — nhờ vậy test được ngoài Discord.
"""

from __future__ import annotations

import discord
from discord import app_commands

from . import config, index, render, tra_cuu

intents = discord.Intents.default()
intents.message_content = True   # ★ phải bật CẢ ở đây VÀ ở Developer Portal


class Bot(discord.Client):
    def __init__(self) -> None:
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        self.db = index.mo_db()

    async def setup_hook(self) -> None:
        if config.GUILD_ID:
            # Sync vào 1 guild -> command hiện ra ngay, khỏi chờ Discord cache
            # toàn cục (có thể tới 1 tiếng). Rất đáng khi đang demo.
            guild = discord.Object(id=int(config.GUILD_ID))
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
        else:
            await self.tree.sync()

    async def on_ready(self) -> None:
        print(f"online: {self.user} · index có {index.dem(self.db)} tin nhắn")

    async def on_message(self, msg: discord.Message) -> None:
        """Tin mới vào index ngay, khỏi phải backfill lại."""
        if msg.guild is None or msg.author.bot:
            return
        if config.KENH_INDEX and msg.channel.name not in config.KENH_INDEX:
            return
        index.them_nhieu(self.db, [tu_discord(msg)])


bot = Bot()


def tu_discord(m: discord.Message) -> index.TinNhan:
    """Message của discord.py -> TinNhan của mình.

    Gộp cả tên file đính kèm: 84% người khảo sát tìm SLIDE, mà slide thường là
    file .pdf đính kèm chứ không phải URL trong text. Không index tên file là
    mất phần lớn kết quả.
    """
    them = [a.filename for a in m.attachments]
    them += [e.title or "" for e in m.embeds]
    them += [e.url or "" for e in m.embeds]
    return index.TinNhan(
        id=str(m.id),
        kenh=getattr(m.channel, "name", "?"),
        tac_gia=m.author.display_name,
        thoi_diem=m.created_at.isoformat(),
        url=m.jump_url,
        noi_dung=" ".join([m.content, *filter(None, them)]).strip(),
    )


@bot.tree.command(name="timlai", description="Tìm lại link/tài liệu đã đăng trong Discord")
@app_commands.describe(cau_hoi="VD: link slide buổi 5")
async def timlai(itx: discord.Interaction, cau_hoi: str) -> None:
    await itx.response.defer(ephemeral=True)   # ★ AI call > 3s, không defer là fail

    ung_vien = index.truy_xuat(bot.db, cau_hoi)
    kq, bo_di = tra_cuu.tra_cuu(cau_hoi, ung_vien)
    nguon = render.chon_nguon(kq, ung_vien)

    await itx.followup.send(
        embed=render.thanh_embed(kq, nguon, bo_di), ephemeral=True
    )


if __name__ == "__main__":
    bot.run(config.can_discord())
