"""Build the six-page VLearn Quiz demo deck as a detailed, honest PDF draft."""
from pathlib import Path

from matplotlib import pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "demo-slides.pdf"

NAVY = "#103B71"
BLUE = "#1768C9"
SKY = "#EAF4FF"
INK = "#18324F"
MUTED = "#647992"
GREEN = "#188B61"
GREEN_SOFT = "#EAF8F1"
ORANGE = "#B87810"
ORANGE_SOFT = "#FFF5DE"
RED = "#B84D53"
RED_SOFT = "#FFF0F1"
LINE = "#D9E5F0"
CANVAS = "#F5F9FD"


def text(ax, x, y, value, size=14, color=INK, weight="normal", ha="left", va="top", **kwargs):
    return ax.text(x, y, value, transform=ax.transAxes, fontsize=size, color=color, weight=weight,
                   ha=ha, va=va, fontfamily="DejaVu Sans", **kwargs)


def card(ax, x, y, w, h, face="#FFFFFF", edge=LINE, radius=0.018):
    patch = FancyBboxPatch((x, y), w, h, transform=ax.transAxes,
                           boxstyle=f"round,pad=0.006,rounding_size={radius}",
                           linewidth=1, edgecolor=edge, facecolor=face)
    ax.add_patch(patch)
    return patch


def pill(ax, x, y, label, face=SKY, color=BLUE, width=None):
    width = width or max(0.08, len(label) * 0.0085 + 0.03)
    card(ax, x, y, width, 0.042, face=face, edge=face, radius=0.025)
    text(ax, x + width / 2, y + 0.021, label, 9.5, color, "bold", ha="center", va="center")


def wrapped(ax, x, y, lines, size=13, leading=0.052, color=INK, weight="normal"):
    for index, line in enumerate(lines):
        text(ax, x, y - index * leading, line, size=size, color=color, weight=weight)


def header(ax, number, title, subtitle):
    ax.axis("off")
    ax.add_patch(plt.Rectangle((0, 0), 1, 1, transform=ax.transAxes, facecolor=CANVAS, edgecolor="none"))
    ax.add_patch(plt.Rectangle((0, .93), 1, .07, transform=ax.transAxes, facecolor=NAVY, edgecolor="none"))
    text(ax, .055, .885, f"0{number} · {title}", 23, NAVY, "bold")
    text(ax, .058, .826, subtitle, 11.5, MUTED)
    text(ax, .055, .038, "TEAM RAU MÁ  ·  VLEARN QUIZ", 9, MUTED, "bold")
    text(ax, .945, .038, f"{number}/6", 9, MUTED, "bold", ha="right")


def stat(ax, x, label, value, color=BLUE):
    card(ax, x, .105, .19, .105, face="#FFFFFF")
    text(ax, x + .018, .181, value, 24, color, "bold")
    text(ax, x + .018, .132, label, 10, MUTED)


def slide_1(ax):
    header(ax, 1, "VẤN ĐỀ", "Học xong không đồng nghĩa biết mình đã hiểu đúng phần nào.")
    card(ax, .055, .27, .535, .46, face="#FFFFFF")
    pill(ax, .082, .666, "BỐI CẢNH", GREEN_SOFT, GREEN)
    text(ax, .082, .605, "Học viên vừa hoàn thành một bài trên VLearn", 19, NAVY, "bold")
    wrapped(ax, .082, .515, [
        "Nhưng chưa có feedback loop ngắn, đáng tin để phân biệt phần đã hiểu",
        "với phần cần xem lại — trước khi sang bài tiếp theo.",
    ], size=13, leading=.05, color=INK)
    text(ax, .082, .388, "HẬU QUẢ GIẢ THUYẾT", 10, BLUE, "bold")
    steps = [("1", "Ôn lan man"), ("2", "Bỏ qua lỗ hổng"), ("3", "Thiếu tự tin"), ("4", "Mang hổng sang bài sau")]
    for idx, (num, label) in enumerate(steps):
        x = .085 + idx * .12
        card(ax, x, .295, .10, .064, face=SKY, edge=SKY, radius=.03)
        text(ax, x + .018, .327, num, 12, BLUE, "bold", va="center")
        text(ax, x + .044, .327, label, 8.5, INK, "bold", va="center")
    card(ax, .62, .27, .325, .46, face=RED_SOFT, edge="#F2C7CA")
    pill(ax, .647, .666, "TRẠNG THÁI EVIDENCE", RED_SOFT, RED)
    text(ax, .647, .594, "CHƯA ĐO", 27, RED, "bold")
    text(ax, .647, .534, "Pain là giả thuyết\ncần kiểm chứng", 12, INK)
    wrapped(ax, .647, .417, [
        "Không báo cáo prevalence khi chưa", "có khảo sát người dùng thật.",
        "Điều kiện chốt: ≥20 người,", "≥50% xác nhận và ≥5 quote.",
    ], size=11.5, leading=.047, color=RED)
    stat(ax, .055, "câu quiz cuối bài", "15")
    stat(ax, .265, "mục để phân tích", "4", GREEN)
    stat(ax, .475, "câu quiz củng cố", "5", ORANGE)


def slide_2(ax):
    header(ax, 2, "USER & MỤC TIÊU", "Biến cảm giác “có vẻ hiểu” thành một hành động ôn tập rõ ràng.")
    card(ax, .055, .47, .89, .23, face="#FFFFFF")
    pill(ax, .082, .636, "CORE JTBD", GREEN_SOFT, GREEN)
    wrapped(ax, .082, .575, [
        "“Sau khi học xong, tôi muốn kiểm tra nhanh các ý chính để biết chính xác",
        "mình cần ôn gì tiếp — thay vì tự đoán mình đã hiểu.”",
    ], size=18, leading=.068, color=NAVY, weight="bold")
    stages = [
        ("TRƯỚC", "Vừa học xong", "Không chắc mức hiểu"),
        ("TRONG", "Làm quiz ngắn", "Nhận feedback ngay"),
        ("SAU", "Biết phần yếu", "Có bước ôn tiếp theo"),
    ]
    for i, (tag, head, detail) in enumerate(stages):
        x = .055 + i * .30
        card(ax, x, .225, .27, .15, face=SKY if i == 1 else "#FFFFFF")
        text(ax, x + .02, .345, tag, 9, BLUE, "bold")
        text(ax, x + .02, .305, head, 14, NAVY, "bold")
        text(ax, x + .02, .26, detail, 11, MUTED)
    card(ax, .055, .095, .89, .075, face=ORANGE_SOFT, edge="#F3D9A7")
    text(ax, .08, .137, "SUCCESS DEMO", 10, ORANGE, "bold")
    text(ax, .24, .137, "15 câu quiz cuối bài  →  4 % theo đề cương  →  5 câu củng cố đúng phần yếu", 12, INK, "bold")


def slide_3(ax):
    header(ax, 3, "GIẢI PHÁP CỦA TEAM", "VLearn Mastery Loop: quiz đáng tin trước, AI cá nhân hoá sau.")
    lanes = [("QUIZ ĐÁNG TIN", .66, GREEN_SOFT, GREEN), ("PHẢN HỒI DỄ HIỂU", .44, SKY, BLUE), ("ÔN ĐÚNG TRỌNG TÂM", .22, ORANGE_SOFT, ORANGE)]
    for label, y, fill, color in lanes:
        card(ax, .055, y, .89, .15, face=fill, edge=fill)
        pill(ax, .077, y + .088, label, fill, color, width=.11)
    steps = [
        (.22, .735, "AI hỗ trợ\nsoạn nháp"), (.41, .735, "GV verify\ntrước release"), (.60, .735, "15 câu cố định\nđã phát hành"),
        (.22, .515, "Làm quiz\ncuối bài"), (.43, .515, "Xem đúng/sai\n& explanation"), (.64, .515, "Phân tích %\ntheo đề cương"),
        (.22, .295, "Xác định\nphần <70%"), (.43, .295, "Đọc transcript\nđúng phần đó"), (.64, .295, "Quiz củng cố\n5 câu đúng trọng tâm"),
    ]
    for x, y, label in steps:
        card(ax, x, y - .055, .15, .075, face="#FFFFFF", edge=LINE, radius=.012)
        text(ax, x + .075, y - .018, label, 9.5, INK, "bold", ha="center", va="center")
    for y in (.696, .476, .256):
        for x in (.37, .56):
            ax.add_patch(FancyArrowPatch((x, y), (x + .035, y), transform=ax.transAxes,
                                         arrowstyle="-|>", mutation_scale=11, linewidth=1.3, color=MUTED))
    text(ax, .055, .105, "SAFETY BOUNDARY", 10, RED, "bold")
    text(ax, .055, .07, "Không dùng quiz hoặc credit cho điểm học phần / assessment chính thức.", 12, INK)


def slide_4(ax):
    header(ax, 4, "TRẢI NGHIỆM SẢN PHẨM", "Từ bài học đến hành động tiếp theo trong một vòng lặp ngắn.")
    nodes = [
        ("1", "Mở quiz\ncuối bài", "15 câu GV release", BLUE),
        ("2", "Xem mức độ\nnắm vững", "4 % theo đề cương", ORANGE),
        ("3", "Chọn tạo quiz\ncủng cố", "chỉ phần <70%", GREEN),
        ("4", "Ôn tiếp\nđúng trọng tâm", "5 câu cá nhân hoá", RED),
    ]
    for i, (num, title, caption, color) in enumerate(nodes):
        x = .075 + i * .22
        card(ax, x, .53, .17, .18, face="#FFFFFF", edge=LINE)
        card(ax, x + .014, .65, .036, .036, face=color, edge=color, radius=.02)
        text(ax, x + .032, .668, num, 10, "#FFFFFF", "bold", ha="center", va="center")
        text(ax, x + .085, .63, title, 13, NAVY, "bold", ha="center", va="center")
        text(ax, x + .085, .56, caption, 9.5, MUTED, ha="center", va="center")
        if i < 3:
            ax.add_patch(FancyArrowPatch((x + .17, .62), (x + .21, .62), transform=ax.transAxes,
                                         arrowstyle="-|>", mutation_scale=12, linewidth=1.5, color=MUTED))
    card(ax, .075, .22, .87, .20, face="#FFFFFF")
    text(ax, .10, .378, "BỐN MỤC ĐỀ CƯƠNG ĐƯỢC PHÂN TÍCH", 10, BLUE, "bold")
    checks = [
        ("Problem–LLM fit", "bài toán nào cần LLM / công cụ khác"),
        ("Tool calling", "tách phần xác định để có độ chính xác"),
        ("Context & RAG", "đưa đúng reference cho model reasoning"),
        ("Product design", "đánh giá lợi ích, cost và cạnh tranh"),
    ]
    for i, (head, detail) in enumerate(checks):
        x = .10 + (i % 2) * .42
        y = .325 - (i // 2) * .08
        text(ax, x, y, "✓", 13, GREEN, "bold")
        text(ax, x + .025, y, head, 10.5, INK, "bold")
        text(ax, x + .15, y, detail, 9.8, MUTED)
    text(ax, .075, .135, "Kết quả là gợi ý học tập, không phải điểm học phần hay kết luận năng lực dài hạn.", 11.5, RED, "bold")


def slide_5(ax):
    header(ax, 5, "AI & NIỀM TIN", "LangGraph chỉ tạo quiz củng cố khi transcript có căn cứ để kiểm tra lại.")
    stats = [("6 / 6", "unit test pass", GREEN), ("15", "source chunks Day03", BLUE), ("4", "hard checks trước render", ORANGE), ("1", "lần retry tối đa", RED)]
    for i, (value, label, color) in enumerate(stats):
        x = .06 + i * .22
        card(ax, x, .61, .19, .13, face="#FFFFFF")
        text(ax, x + .018, .704, value, 25, color, "bold")
        text(ax, x + .018, .646, label, 9.5, MUTED)
    card(ax, .06, .285, .42, .23, face="#FFFFFF")
    text(ax, .085, .475, "LANGGRAPH WORKFLOW", 10, BLUE, "bold")
    wrapped(ax, .085, .43, [
        "retrieve transcript → generate quiz", "→ validate quiz → retry / return", "Trace lưu source ID và thời điểm chạy",
    ], size=11.5, leading=.052, color=INK)
    card(ax, .52, .285, .42, .23, face=RED_SOFT, edge="#F2C7CA")
    text(ax, .545, .475, "KHI CÓ LỖI", 10, RED, "bold")
    wrapped(ax, .545, .43, [
        "Source ID không tồn tại / thiếu evidence", "→ không render câu hỏi giả", "→ báo rõ lỗi + giữ trace để kiểm tra",
    ], size=11.5, leading=.052, color=INK)
    card(ax, .06, .135, .88, .09, face=ORANGE_SOFT, edge="#F3D9A7")
    text(ax, .085, .185, "QUY TẮC AN TOÀN", 10, ORANGE, "bold")
    text(ax, .285, .185, "Quiz sai có thể khiến học viên ôn sai → không sinh quiz an toàn hơn sinh đáp án thiếu căn cứ.", 11.5, INK)


def slide_6(ax):
    header(ax, 6, "ĐO LƯỜNG & BƯỚC TIẾP", "Chỉ coi đây là giải pháp hiệu quả sau khi evidence và user validation xác nhận.")
    card(ax, .055, .47, .39, .25, face="#FFFFFF")
    text(ax, .08, .68, "WILLING USERS", 10, BLUE, "bold")
    text(ax, .08, .62, "3 người đã đồng ý thử", 22, NAVY, "bold")
    wrapped(ax, .08, .555, ["Lâm Vũ · D303", "Lê Văn Tuấn · D303", "Cao Hương Giang · D303"], size=11.5, leading=.045, color=INK)
    card(ax, .49, .47, .455, .25, face=RED_SOFT, edge="#F2C7CA")
    text(ax, .515, .68, "VALIDATION STATUS", 10, RED, "bold")
    text(ax, .515, .62, "0 / 5", 22, RED, "bold")
    text(ax, .625, .62, "feedback log hoàn chỉnh", 11, INK, "bold", va="center")
    wrapped(ax, .515, .55, ["Chưa có quote nguyên văn để trình bày.", "Phải test task thật, quan sát im lặng và log thay đổi."], size=11.2, leading=.047, color=INK)
    priorities = [
        ("1", "Hoàn tất survey + impact", "≥20 phản hồi, ≥50% xác nhận, 5 quote", BLUE),
        ("2", "Chạy & review 20 golden cases", "báo % pass thật và failure lớn nhất", ORANGE),
        ("3", "Test hiểu % & quiz củng cố", "≥5 user ngoài nhóm, cập nhật changelog", GREEN),
    ]
    for i, (num, head, detail, color) in enumerate(priorities):
        y = .37 - i * .095
        card(ax, .055, y, .89, .07, face="#FFFFFF")
        card(ax, .072, y + .017, .035, .035, face=color, edge=color, radius=.02)
        text(ax, .09, y + .035, num, 10, "#FFFFFF", "bold", ha="center", va="center")
        text(ax, .125, y + .044, head, 11.5, INK, "bold")
        text(ax, .44, y + .044, detail, 10.5, MUTED)
    card(ax, .055, .08, .89, .075, face=GREEN_SOFT, edge="#BEE5D0")
    text(ax, .08, .122, "BÀI HỌC", 10, GREEN, "bold")
    text(ax, .205, .122, "AI phù hợp để tạo practice có kiểm soát; phát hành và hiệu quả vẫn cần GV + user validation xác nhận.", 11.5, INK)


SLIDE_BUILDERS = [slide_1, slide_2, slide_3, slide_4, slide_5, slide_6]


def main():
    with PdfPages(OUT) as pdf:
        for builder in SLIDE_BUILDERS:
            fig = plt.figure(figsize=(13.333, 7.5), facecolor=CANVAS)
            ax = fig.add_axes([0, 0, 1, 1])
            builder(ax)
            pdf.savefig(fig, dpi=180)
            plt.close(fig)
    print(OUT)


if __name__ == "__main__":
    main()
