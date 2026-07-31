# 04 — Lộ Trình Ôn Tập (Adaptive Review Path)

**What to build:** Hệ thống gợi ý slide cần ôn tập ngay sau bài quiz. Xây dựng API `GET /users/me/review-path` dịch Elo ra trạng thái Mastery để lọc 3-5 slides phù hợp nhất, và hiển thị chúng ở nửa dưới của UI Phase 2.

**Blocked by:** 03 — Động Cơ Quyết Định Elo (Elo Engine)

**Status:** ready-for-agent

- [ ] API `GET /users/me/review-path` nhận diện được trạng thái Mastery của học viên hiện tại.
- [ ] API lọc ra danh sách 3-5 slide ưu tiên chứa nội dung các khái niệm yếu (dựa vào `concept_slide_map` và Mastery state).
- [ ] Nửa dưới giao diện Phase 2 (khu vực "SLIDE CẦN ÔN") trong file HTML gọi API và render các thẻ slide thật.
- [ ] Nút "Mở slide" trên thẻ ở UI hoạt động, chuyển Viewer (ở cột giữa) đến đúng trang slide vừa được hệ thống đề xuất.
