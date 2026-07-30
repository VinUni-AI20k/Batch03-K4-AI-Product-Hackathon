"""Golden set — 22 case cho quyết định AI trung tâm: sinh MCQ từ transcript thật.

Mỗi case: input (danh sách Section thật hoặc dựng tay) + n_questions + lớp chỗ khó
(nếu có) + expected: mô tả hành vi mong muốn, dùng để chấm pass/fail thủ công/script.
"""
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.pipeline.outline import Section, Segment, parse_transcript  # noqa: E402

TRANSCRIPT_PATH = Path(__file__).resolve().parent.parent / "data" / "vlearn-pack" / "transcript" / "transcript-01-clean.md"
REAL_SECTIONS = parse_transcript(TRANSCRIPT_PATH.read_text(encoding="utf-8"))
REAL_BY_ID = {s.section_id: s for s in REAL_SECTIONS}


def real(*ids: str) -> list[Section]:
    return [REAL_BY_ID[i] for i in ids]


CASES = []

# ---- Case thường (11) — mỗi section thật trong transcript-01, 1 case/section ----
for sid in [s.section_id for s in REAL_SECTIONS]:
    CASES.append({
        "id": f"N-{sid}",
        "group": "thường",
        "class": None,
        "sections": real(sid),
        "n_questions": 3,
        "expected": "Sinh được >=1 câu, mọi câu grounded đúng section/segment đã cho, không câu nào bị drop vì hallucination/format.",
    })

# ---- Lớp ① Nguồn sự thật (2) ----
CASES.append({
    "id": "C1-empty-input",
    "group": "chỗ khó",
    "class": "1-nguon-su-that",
    "sections": [],
    "n_questions": 5,
    "expected": "Không có section nào -> từ chối/không bịa câu hỏi (error=no_sections_provided, valid rỗng).",
})
CASES.append({
    "id": "C2-single-thin-segment",
    "group": "chỗ khó",
    "class": "1-nguon-su-that",
    "sections": [Section(section_id="SYN1", title="Đoạn cực ngắn", segments=[
        Segment(segment_id="SYN1-001", text="AI là công nghệ mô phỏng trí tuệ con người."),
    ])],
    "n_questions": 5,
    "expected": "Chỉ có 1 câu để hỏi -> model nên trả về rất ít câu (<=2), không bịa thêm chi tiết ngoài câu đã cho.",
})

# ---- Lớp ② Mơ hồ (2) ----
CASES.append({
    "id": "C3-thin-section-overask",
    "group": "chỗ khó",
    "class": "2-mo-ho",
    "sections": real("S4"),  # chỉ 4 segment thật, ngắn nhất trong transcript-01
    "n_questions": 15,
    "expected": "Yêu cầu 15 câu nhưng chỉ có 4 đoạn nội dung -> model nên trả về ít câu hơn nhiều (~4-6), không ép đủ 15 bằng cách bịa.",
})
CASES.append({
    "id": "C4-section-no-segments",
    "group": "chỗ khó",
    "class": "2-mo-ho",
    "sections": [Section(section_id="SYN2", title="Section rỗng", segments=[])],
    "n_questions": 5,
    "expected": "Section không có đoạn nội dung nào -> không sinh được câu nào có căn cứ, valid rỗng, không lỗi crash.",
})

# ---- Lớp ③ Ngoài phạm vi (2) ----
CASES.append({
    "id": "C5-offtopic-content",
    "group": "chỗ khó",
    "class": "3-ngoai-pham-vi",
    "sections": [Section(section_id="SYN3", title="Công thức nấu ăn", segments=[
        Segment(segment_id="SYN3-001", text="Để nấu phở bò ngon, cần ninh xương bò từ 6-8 tiếng, "
                "nêm gia vị gồm quế, hồi, gừng nướng, và thảo quả."),
    ])],
    "n_questions": 5,
    "expected": "Nội dung hoàn toàn ngoài phạm vi AI/product (công thức nấu ăn) -> model vẫn chỉ được bám sát ĐÚNG nội dung đã cho (câu hỏi về phở), TUYỆT ĐỐI không tự chuyển sang hỏi kiến thức AI/product từ tri thức nền của nó.",
})
CASES.append({
    "id": "C6-overask-forces-outside-knowledge",
    "group": "chỗ khó",
    "class": "3-ngoai-pham-vi",
    "sections": real("S1"),
    "n_questions": 50,
    "expected": "Yêu cầu 50 câu nhưng S1 chỉ có 6 đoạn -> model không được lấy thêm kiến thức ngoài S1 để lấp đầy; mọi câu hỏi (dù ít) vẫn phải trace về đúng segment_id trong S1.",
})

# ---- Lớp ④ Đặc thù domain (2) ----
CASES.append({
    "id": "C7-factual-statistic",
    "group": "chỗ khó",
    "class": "4-dac-thu-domain",
    "sections": real("S1"),
    "n_questions": 6,
    "expected": "S1 có số liệu cụ thể (T01-003: '70% đến từ con người và vận hành, không phải công nghệ') -> "
                "nếu model ra câu hỏi về số liệu này, đáp án đúng phải khớp chính xác con số/ý gốc — chấm tay.",
})
CASES.append({
    "id": "C8-named-framework",
    "group": "chỗ khó",
    "class": "4-dac-thu-domain",
    "sections": real("S7", "S10"),
    "n_questions": 6,
    "expected": "S7 nói về Double Diamond, S10 nói về impact-effort matrix — 2 framework khác nhau. "
                "Câu hỏi không được lẫn lộn framework của section này sang section kia — chấm tay.",
})

# ---- Case hiếm (3) ----
CASES.append({
    "id": "R1-multi-section-combined",
    "group": "hiếm",
    "class": None,
    "sections": real("S1", "S2"),
    "n_questions": 6,
    "expected": "Đưa 2 section cùng lúc -> câu hỏi phải gắn đúng section_id tương ứng (không gán nhầm S1<->S2).",
})
CASES.append({
    "id": "R2-student-speech-excluded",
    "group": "hiếm",
    "class": None,
    "sections": real("S2"),  # S2 gốc có lượt học viên T01-009, đã bị parser loại
    "n_questions": 6,
    "expected": "S2 gốc có đoạn học viên trả lời (T01-009) — parser phải đã loại bỏ; verify: không câu nào cite T01-009.",
})
CASES.append({
    "id": "R3-min-boundary-n1",
    "group": "hiếm",
    "class": None,
    "sections": real("S6"),
    "n_questions": 1,
    "expected": "Yêu cầu tối thiểu 1 câu -> trả về đúng 1 câu hợp lệ, không trả về 0 hay nhiều hơn hẳn.",
})

assert len(CASES) >= 20, f"Golden set cần >=20 case, hiện có {len(CASES)}"
