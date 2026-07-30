from pathlib import Path
import textwrap
from matplotlib import pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages

ROOT = Path(__file__).resolve().parents[1]
slides = [
    ("01 · USER & JOB", "Học viên vừa kết thúc buổi học cần biết mình chưa nắm gì.\n\nCore JTBD\nKiểm tra ý chính chưa nắm để ôn đúng phần.\n\nEVIDENCE: [PENDING — n, %, quote có nguồn]"),
    ("02 · VÌ SAO CHỌN", "So sánh ≥3 primary pain bằng:\n• Bao nhiêu người\n• Tần suất\n• Thời gian/hậu quả mỗi lần\n\nPAIN CHỌN: [PENDING]\nỨNG VIÊN LOẠI: [PENDING + lý do bằng số]"),
    ("03 · GIẢI PHÁP & LIVE DEMO", "AI quyết định tạo quiz 15 câu khi học liệu đủ căn cứ.\n\nConditional vì quiz sai có thể làm học viên học sai.\n\nLIVE\n1. Happy path: quiz → 12/15 → phần cần ôn → +1 credit\n2. Failure: thiếu nguồn / ngoài phạm vi"),
    ("04 · KẾT QUẢ ĐO", "QUALITY BAR: ≥85%\nHard constraints: 100% câu có nguồn hỗ trợ; 100% case ngoài phạm vi xử lý đúng.\n\nRUN 1: [PENDING — pass/20, %]\nFAILURE LỚN NHẤT: [PENDING]"),
    ("05 · USER THẬT NÓI GÌ", "“[PENDING quote 1]” — [Tên/vai]\n\n“[PENDING quote 2]” — [Tên/vai]\n\nTHAY ĐỔI TỪ FEEDBACK\n[PENDING — trỏ về feedback log/changelog]"),
    ("06 · NẾU CÓ THÊM 1 TUẦN", "1. Xử lý failure lớn nhất từ eval\n2. Kiểm định độ khó trên nhiều bài học\n3. Thử reward/cap với nhóm lớn hơn\n\nBÀI HỌC LỚN NHẤT: [PENDING]"),
]

with PdfPages(ROOT / "demo-slides.pdf") as pdf:
    for title, body in slides:
        fig = plt.figure(figsize=(13.333, 7.5), facecolor="#F4F8FC")
        ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off")
        ax.add_patch(plt.Rectangle((0, .92), 1, .08, color="#123F7F", transform=ax.transAxes))
        ax.text(.055, .86, title, fontsize=24, weight="bold", color="#123F7F", va="top")
        wrapped = "\n".join(textwrap.fill(line, 72) for line in body.splitlines())
        ax.text(.06, .72, wrapped, fontsize=18, color="#233D5B", va="top", linespacing=1.55)
        ax.text(.94, .045, "TEAM RAU MÁ · VLEARN QUIZ", ha="right", fontsize=10, color="#7890AA")
        pdf.savefig(fig); plt.close(fig)
print(ROOT / "demo-slides.pdf")
