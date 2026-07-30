# Trạng thái CP3–CP6

## CP3 — AI thật + lượt đo đầu

- [x] Backend OpenAI và trace logger.
- [x] Golden set 20 case đúng cơ cấu.
- [ ] Điền key mới trong `.env`.
- [ ] Chạy `python3 codebase/api_server.py`.
- [ ] Chạy `uv run python eval/run_eval.py`.
- [ ] Hai người chấm groundedness/relevance; lưu bảng đầy đủ kể cả fail.

## CP4 — Spec chốt 23:59 ngày 1

- [x] `spec.md` đủ §1–§9, 4 lớp, ≥8 scenario, HAX/PAIR, quality bar.
- [ ] Export Google Forms vào `evidence/raw/` (không commit file có tên).
- [ ] Chạy `uv run python scripts/analyze_survey.py evidence/raw/responses.csv --exclude-name "Tên thành viên"`.
- [ ] Điền evidence, impact và tên phân công trong `spec.md`.
- [ ] Commit `spec.md` trước hạn; không đổi quality bar sau đó.

## CP5 — Validation + dry run

- [ ] 5 người thật hoàn thành task; ≥2 người từ willing users CP1.
- [ ] Điền `validation/feedback-log.md` bằng quan sát + quote nguyên văn.
- [ ] Làm ≥1 thay đổi hoặc ghi lý do giữ nguyên; cập nhật `spec.md` §9.
- [ ] Điền `validation/dry-run.md`, bấm giờ ≤5 phút.

## CP6 — Demo

- [ ] Thay toàn bộ `[PENDING]` trong slide/script.
- [ ] Chạy `uv run python scripts/build_slides.py` tạo PDF final.
- [ ] Chuẩn bị ảnh/video backup.
- [ ] Mỗi thành viên nói ≥1 phần; tập case lạ của giám khảo.
- [ ] Mỗi thành viên copy `reflection/TEMPLATE.md` và tự điền.
