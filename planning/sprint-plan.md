# Sprint Plan: AI tạo quiz cuối bài — VLearn (Hướng A) · Khoá 4

**Thời gian:** Hiện tại (giữa CP1 Canvas) → CP6 Demo, 15:00 Ngày 2 (N2)
**Sprint goal:** Build và demo được tính năng "AI tự động sinh quiz kiểm tra hiểu bài, bám sát nội dung 1 bài giảng VLearn" — đạt đủ 5 tiêu chí nghiệm thu + rubric R1-R7, nộp đúng 5/5 checkpoint còn lại (CP2-CP6 tính điểm nộp, CP1 coi như đang làm dở).

## 0. Lịch mốc Khoá 4 (tham chiếu — xem `04-rubric.md` Phần 3)

| Mốc | Giờ | Artifact cần show |
|---|---|---|
| CP1 · Canvas | 15:00 N1 | Canvas 7 dòng — **đang làm** |
| CP2 · Bấm được | 17:00 N1 | Flow chính bấm hết được + commit đầu |
| CP3 · AI thật + đo lượt đầu | 10:30 N2 | AI call thật + golden set ≥20 + bảng % lượt 1 |
| CP4 · Chốt tiến độ | 12:00 N2 | Spec gần cuối + việc còn thiếu |
| CP5 · Validation + dry run | 14:00 N2 | Feedback log ≥5 + changelog + dry run |
| CP6 · Demo | 15:00 N2 | Slide 6 trang + demo live |

⚠️ **Mâu thuẫn cần hỏi TA ngay, đừng để tới gần deadline mới hỏi:** rubric ghi "spec.md commit hạn cứng 23:59 ngày 1, quality bar chốt từ thời điểm này" áp dụng mọi khoá, nhưng bảng mốc lại đặt CP4 (chốt tiến độ) của Khoá 4 ở 12:00 **N2** — tức sau nửa đêm N1. Plan này giả định **23:59 N1 là deadline commit spec thật** (an toàn hơn) và CP4 12:00 N2 là buổi TA duyệt tiến độ. Xác nhận lại với TA trong buổi CP2 để không bị 0 điểm oan.

## 1. Capacity thực tế của team

**3 người, chưa chia vai cố định.**

⚠️ **Rủi ro thể lệ:** đề bài quy định nhóm 4-5 người. Nhóm hiện có 3 người — cần xác nhận với TA/ban tổ chức ngay tại CP1 xem có được thi hợp lệ không, trước khi đầu tư công sức.

| Khung thời gian | Loại | Ước lượng hiệu quả/người | Ghi chú |
|---|---|---|---|
| 15:00-23:00 N1 (sau CP1) | Làm việc chính buổi tối | ~6h (trừ ăn tối + CP2 17:00) | Hệ số tập trung ~75% |
| 23:00-01:00 N1 | Buffer khuya (tuỳ chọn) | ~0-2h | Không bắt buộc cả nhóm thức — nên luân phiên, không để cả 3 người cùng thức trắng rồi sáng mai không tỉnh táo cho CP3/demo |
| 06:00-10:30 N2 | Sáng sớm trước CP3 | ~3.5h | Hệ số ~70% (mới ngủ dậy) |
| 10:30-15:00 N2 | Giữa các mốc CP3→CP6 | ~2.5h thực làm (phần còn lại là họp CP + demo) | Việc chính: validation, chốt slide, dry run |

**Tổng capacity kỳ này (3 người, không tính buffer khuya):** ≈ 3 × 12h = **36 giờ-người**
Cộng buffer khuya tối đa (nếu dùng): +18 giờ-người → tối đa ~54 giờ-người, nhưng **không nên lập kế hoạch dựa trên mức tối đa này** — burnout làm giảm chất lượng quyết định đúng lúc cần tỉnh táo nhất (build AI call, chốt spec).

## 2. Danh sách task đã breakdown

| Task | Ước lượng | Người phụ trách | Mức độ chắc chắn | Ghi chú/rủi ro |
|---|---|---|---|---|
| Hoàn thiện evidence (mining chatlog/transcript cho pain "quiz cuối bài") — chuẩn A/B | 3h | [Người 1] | Trung bình | Đã có mầm từ CP1; cần ≥5 quote/ví dụ nguyên văn |
| Nghiên cứu 1 sản phẩm tương tự/người (Quizlet AI, Khanmigo...) | 0.5h × 3 | Cả 3 người, song song | Cao | 4 câu theo guide §2.2, gộp vào spec §3 |
| Thiết kế lát cắt 1 câu + non-goals + automation (augment/conditional/automate) + ≥4 nguyên tắc HAX/PAIR | 1.5h | [Người 2] | Trung bình | Quiz sai kiến thức = cost-of-error cao → nhiều khả năng chọn **augment** (AI sinh, có review) |
| 4 lớp chỗ khó + ≥8 kịch bản rủi ro | 2h | Cả nhóm brainstorm | Trung bình | Đặc thù domain: quiz sai đáp án/sai trọng tâm bài → rủi ro cao nhất |
| Build flow chính (UI bấm được, data giả) — target CP2 | 3h | [Người 3] | Trung bình | Không dựng UI đẹp trước khi flow thông |
| Tích hợp AI call thật (sinh quiz từ transcript bài giảng) — target CP3 | 3h | [Người 3] | Thấp | Phụ thuộc Google AI Studio free tier (~1.500 req/ngày) — rủi ro rate limit giờ cao điểm cả lớp cùng dùng |
| Golden set ≥20 case từ 6 transcript có sẵn trong `data/vlearn-pack/` | 3h | [Người 1] | Trung bình | ≥2 case/lớp chỗ khó + ≥10 case từ transcript thật |
| Chạy đo lượt 1 + bảng % | 1h | [Người 1] hoặc [Người 3] | Cao | Sau khi có AI call thật |
| Viết spec.md hoàn chỉnh §1-§9 | 2h | [Người 2] | Trung bình | Commit trước 23:59 N1 (xem cảnh báo mốc 0) |
| Vòng validation ≥5 người thật (đổi chéo zone khác) + changelog | 2h | Cả nhóm chia nhau đi hỏi | Trung bình | Ưu tiên ≥3 willing users đã khai ở CP1 |
| Slide 6 trang + demo script + dry run có bấm giờ | 2h | [Người 2] | Cao | Luật "không bằng chứng thì không slide" |
| Backup demo (video/screenshot phòng live hỏng) | 0.5h | [Người 3] | Cao | |

**Tổng effort ước lượng:** ≈ 24.5 giờ-người

## 3. Đối chiếu workload vs capacity

- Tổng effort ước lượng: **~24.5 giờ-người**
- Tổng capacity (không tính buffer khuya): **~36 giờ-người**
- Kết luận: **Vừa đủ, còn buffer ~32%** — đủ dư để xử lý phát sinh (task nào cũng thường trễ hơn ước lượng ban đầu). Không nên lấp đầy buffer bằng task mới; giữ lại cho sửa lỗi/retest golden set sau CP3 và làm lại slide sau validation.
- Vì chỉ 3 người, mỗi người đang gánh 2-3 mảng việc khác nhau (không có ai "rảnh" để backup) — nếu 1 người vắng/mệt giữa chừng, sprint này không có người dự phòng thay thế ngay. Đây là rủi ro lớn hơn cả việc effort > capacity.

## 4. Rủi ro & phụ thuộc

| Rủi ro/phụ thuộc | Tác động nếu xảy ra | Phương án dự phòng |
|---|---|---|
| Team 3 người thay vì 4-5 theo thể lệ | Có thể không hợp lệ hoặc bị trừ điểm | Hỏi TA/BTC ngay tại CP1, trước khi đầu tư thêm công sức |
| Deadline spec.md mâu thuẫn giữa rubric (23:59 N1) và bảng mốc K4 (CP4 = 12:00 N2) | Nộp muộn → 0 điểm CP4 (5đ) oan | Hỏi TA xác nhận tại CP2; mặc định coi 23:59 N1 là deadline thật để an toàn |
| Google AI Studio free tier rate limit (cả lớp dùng chung khung giờ) | AI call thật bị chặn đúng lúc demo/đo golden set | Test sớm ở CP2-CP3 chứ không để tới CP6; có backup video demo |
| Chỉ 1 người (Người 3) làm cả build flow + tích hợp AI — single point of failure | Người đó mệt/kẹt kỹ thuật → nghẽn toàn bộ pipeline | CP2 là mốc hỗ trợ kỹ thuật chính thức — kẹt >20 phút gọi TA ngay, đừng tự loay hoay |
| Quiz AI sinh sai kiến thức/sai trọng tâm bài (đặc thù domain ④) | Mất điểm/mất niềm tin học viên — rủi ro nghiêm trọng nhất của tính năng này | Chọn automation mức **augment** (AI sinh nháp, có bước duyệt) thay vì automate hoàn toàn; đưa vào ≥2 kịch bản golden set |
| Overnight làm việc không luân phiên, cả 3 người thức trắng | Sáng N2 không tỉnh táo cho CP3 (mốc kỹ thuật quan trọng nhất) và demo N2 | Phân ca ngủ luân phiên 23:00-01:00, không ai thức quá 1 ca |

---
*Điền tên thật vào các ô [Người 1]/[Người 2]/[Người 3] khi nhóm đã chốt vai trò.*
