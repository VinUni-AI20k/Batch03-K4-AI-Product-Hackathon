"""Chạy trọn bộ golden set NGOÀI Discord → bảng kết quả cho rubric R4 (15 điểm).

    python scripts/chay_eval.py                 # chạy thật, gọi Claude 22 lần
    python scripts/chay_eval.py --kho           # chỉ 8 case khó (①②③④), tiết kiệm token
    python scripts/chay_eval.py --gia           # LLM giả, không tốn token — kiểm runner

Ghi kết quả ra eval/ket-qua/luot-<n>.md, KỂ CẢ case chưa đạt. Rubric ghi rõ:
kết quả thấp vẫn được tính đủ điểm nếu ghi nhận trung thực; số liệu bị che thì
không được tính.
"""

from __future__ import annotations

import datetime as dt
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import yaml  # noqa: E402

from timlai import config, index, render, tra_cuu  # noqa: E402

BAR_PASS = 0.85     # spec.md §7: ≥85% qua golden set
BAR_BIA = 0         # spec.md §7: 0 case bịa nguồn


def _llm_gia(cau_hoi: str, ung_vien: list[index.TinNhan]) -> tra_cuu.KetQua:
    """LLM giả để kiểm runner mà không tốn token. Cố tình bịa 1 id không tồn tại
    để chứng minh neo() bắt được."""
    return tra_cuu.KetQua(
        tim_thay=True,
        ngoai_pham_vi=False,
        cau_tra_loi=f"[GIẢ] {len(ung_vien)} ứng viên cho: {cau_hoi}",
        message_ids=[ung_vien[0].id, "999_id_bia_dat"],
        do_tin_cay="cao",
        can_lam_ro=None,
    )


def kiem(mong_doi: dict, kq: tra_cuu.KetQua) -> list[str]:
    """So kết quả thật với mong đợi. Trả danh sách chiều bị lệch (rỗng = pass)."""
    lech = []
    thuc_te = {
        "tim_thay": kq.tim_thay,
        "ngoai_pham_vi": kq.ngoai_pham_vi,
        "can_lam_ro": bool(kq.can_lam_ro),
        "do_tin_cay": kq.do_tin_cay,
    }
    for chieu, cho_doi in mong_doi.items():
        if chieu in thuc_te and thuc_te[chieu] != cho_doi:
            lech.append(f"{chieu}: cần {cho_doi}, được {thuc_te[chieu]}")
    return lech


def main() -> None:
    chi_kho = "--kho" in sys.argv
    dung_gia = "--gia" in sys.argv

    cases = yaml.safe_load(config.GOLDEN_SET.read_text(encoding="utf-8"))
    if chi_kho:
        cases = [c for c in cases if c["lop"] in {"1", "2", "3", "4"}]

    db = index.mo_db()
    if index.dem(db) == 0:
        raise SystemExit(
            "index.db trống. Chạy `python scripts/backfill.py` trước, "
            "hoặc `python scripts/seed_gia.py` nếu chưa có server test."
        )

    goi = _llm_gia if dung_gia else None
    hang, so_pass, so_bia = [], 0, 0

    for c in cases:
        ung_vien = index.truy_xuat(db, c["input"])
        kq, bo_di = tra_cuu.tra_cuu(c["input"], ung_vien, goi_llm=goi)
        lech = kiem(c.get("mong_doi", {}), kq)
        pass_ = not lech
        so_pass += pass_

        # "Bịa nguồn" = LLM trả id không tồn tại (neo() bắt được),
        # hoặc case lớp ① mà bot vẫn khai tìm thấy.
        bia = bool(bo_di) or (c["lop"] == "1" and kq.tim_thay)
        so_bia += bia

        nguon = render.chon_nguon(kq, ung_vien)
        hang.append({
            "id": c["id"],
            "lop": c["lop"],
            "input": c["input"],
            "pass": pass_,
            "bia": bia,
            "lech": "; ".join(lech) or "—",
            "n_ung_vien": len(ung_vien),
            "n_nguon": len(nguon),
            "n_bo_di": len(bo_di),
            "tra_loi": kq.cau_tra_loi.replace("\n", " ")[:120],
            "ghi_chu": c.get("ghi_chu", ""),
        })
        print(f"  {'✓' if pass_ else '✗'} {c['id']:<6} {c['input'][:40]:<42} {hang[-1]['lech'][:50]}")

    ty_le = so_pass / len(cases) if cases else 0
    config.KET_QUA_DIR.mkdir(parents=True, exist_ok=True)
    luot = len(list(config.KET_QUA_DIR.glob("luot-*.md"))) + 1
    out = config.KET_QUA_DIR / f"luot-{luot}.md"

    md = [
        f"# Kết quả golden set — lượt {luot}",
        "",
        f"- Thời điểm: {dt.datetime.now():%Y-%m-%d %H:%M}",
        f"- Model: `{config.MODEL}`" + ("  ⚠️ **LLM GIẢ — không phải kết quả thật**" if dung_gia else ""),
        f"- Phạm vi: {'8 case khó' if chi_kho else f'{len(cases)} case (trọn bộ)'}",
        f"- Index: {index.dem(db)} tin nhắn",
        "",
        "## Đối chiếu quality bar",
        "",
        "| Chỉ số | Bar (spec.md §7) | Đo được | Kết luận |",
        "|---|---|---|---|",
        f"| Tỉ lệ pass | ≥{BAR_PASS:.0%} | **{ty_le:.1%}** ({so_pass}/{len(cases)}) | {'ĐẠT' if ty_le >= BAR_PASS else 'CHƯA ĐẠT'} |",
        f"| Case bịa nguồn | ={BAR_BIA} | **{so_bia}** | {'ĐẠT' if so_bia <= BAR_BIA else 'CHƯA ĐẠT'} |",
        "",
        "## Từng case",
        "",
        "| ID | Lớp | Input | Pass | Bịa | Lệch ở đâu | Ứng viên | Nguồn | Bỏ | Bot trả lời |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    for h in hang:
        md.append(
            f"| {h['id']} | {h['lop']} | {h['input']} | {'✓' if h['pass'] else '✗'} | "
            f"{'⚠️' if h['bia'] else ''} | {h['lech']} | {h['n_ung_vien']} | "
            f"{h['n_nguon']} | {h['n_bo_di']} | {h['tra_loi']} |"
        )

    truot = [h for h in hang if not h["pass"]]
    md += ["", "## Phân tích case chưa đạt", ""]
    if truot:
        for h in truot:
            md.append(f"- **{h['id']}** (lớp {h['lop']}) — lệch: {h['lech']}")
            md.append(f"  - Mong đợi: {h['ghi_chu']}")
            md.append(f"  - Nguyên nhân: _(điền tay: retrieval trượt / prompt / schema / mong đợi sai)_")
    else:
        md.append("Không có case nào chưa đạt ở lượt này.")

    out.write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"\n{'='*60}")
    print(f"pass {so_pass}/{len(cases)} = {ty_le:.1%}  (bar ≥{BAR_PASS:.0%})")
    print(f"bịa nguồn: {so_bia}  (bar = {BAR_BIA})")
    print(f"→ {out.relative_to(config.REPO)}")


if __name__ == "__main__":
    main()
