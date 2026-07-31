# BÁO CÁO VALIDATION NGƯỜI DÙNG
## Dự án: AI-Powered Learning Assistant cho VLearn nhóm 50s

**Ngày báo cáo:** 31/07/2026  
**Vòng validation:** Vòng 1 - User testing với prototype  
**Số lượng người thử:** 5 người (100% ngoài nhóm phát triển)

---

## 1. Bảng Log Chi Tiết

| Người thử (tên/vai) | Willing user (CP1)? | Task giao | Quan sát (bấm gì, kẹt đâu) | Quote nguyên văn | Mức nghiêm trọng |
|---|---|---|---|---|---|
| **Hoàng Thị Thuyên** | Có | Upload slide bài "Lập trình hướng đối tượng - Chương 4", yêu cầu tạo mind map và animation minh họa | Bấm chọn agent "Tạo Mind Map" từ màn hình chính → chờ 8 giây load. Khi xem animation, bấm nút Play → animation chạy nhưng hơi giật ở bước 3. *Không kẹt* ở bước nào. | "Ý tưởng hay, học bằng animation và chatbot dễ hiểu hơn nhiều." | Trung bình |
| **Dương Tiến Dũng** | Có | Upload slide bài "Cấu trúc dữ liệu - Chương 3 (Stack & Queue)", yêu cầu tạo outline và quiz 10 câu | Bấm vào agent "Tạo Quiz" → system generate 10 câu hỏi trong 12 giây. *Kẹt nhẹ* ở bước chọn số câu hỏi (dropdown chưa responsive, bấm 2 lần mới chọn được). Outline hiển thị đúng cấu trúc 5 section. | "Tính năng AI tự tạo outline và quiz khá hữu ích cho việc ôn tập." | Thấp–Trung bình |
| **Đặng Quang Trung** | Không | Task: Không test trên prototype (tại thời điểm, tính năng này mới ở dạng ý tưởng/mô tả bằng lời). Trung được giới thiệu concept và phản hồi trên mô tả. | *Không áp dụng* — chưa có hệ thống thật để tương tác. Đã xác nhận với nhóm (31/07/2026): chỉ phản hồi trên concept. | "Chatbot trả lời theo từng Section giúp tìm kiến thức nhanh hơn." | Trung bình |
| **Phạm Thanh Hưng** | Không | Upload slide bài "Hệ điều hành - Chương 2 (Quản lý tiến trình)", yêu cầu tạo mind map và outline | Bấm upload file PDF dung lượng 4.2MB → mất 6 giây để xử lý. Bấm vào agent "Tạo Mind Map" → hiển thị outline trước, mind map hiện sau 4 giây. *Kẹt* ở màn hình loading giữa các bước (không có progress bar). | "Mind Map và Outline giúp mình nắm được cấu trúc bài học rất nhanh." | Thấp–Trung bình |
| **Trương Công Cường** | Không | Upload slide bài "Cơ sở dữ liệu - Chương 5 (SQL nâng cao)", yêu cầu tạo animation và quiz | Bấm agent "Tạo Animation" → chờ 15 giây xử lý (lâu nhất trong các task). Animation hiển thị đúng 4 bước của SQL JOIN. *Không kẹt* nhưng bị giật nhẹ ở bước chuyển cảnh. | "Nếu tích hợp vào VLearn thật thì sẽ hỗ trợ việc tự học hiệu quả hơn." | Thấp |

---

## 2. Tổng Hợp

### Chủ đề lặp nhiều nhất
Cả 5 người đều phản hồi tích cực về việc đa dạng hóa định dạng ôn tập (outline/mindmap/animation/quiz) giúp nắm bài nhanh hơn so với đọc tài liệu gốc — khớp đúng pain point đã đo ở `spec.md` §1.

### 1-2 thay đổi làm trước demo 
1. **Thêm progress bar** ở tất cả bước xử lý (upload, generate mind map, animation) — phản hồi Phạm Thanh Hưng.
2. **Tối ưu thời gian xử lý** xuống < 10 giây cho file < 5MB — phản hồi Hoàng Thị Thuyên, Trương Công Cường.
3. **Sửa UI dropdown** chọn số câu quiz (tăng vùng bấm, thêm debounce) — phản hồi Dương Tiến Dũng.

### Giữ nguyên có lý do
Automation mức "Automate" cho outline/slide/quiz/mindmap/animation — không có phản hồi nào đòi hỏi bước duyệt thủ công trước khi xem, giữ nguyên theo cost-of-error đã phân tích ở `spec.md` §4.

### Đưa vào backlog
- Tích hợp thẳng vào VLearn production (Trương Công Cường) — ngoài phạm vi lát cắt sự kiện.
- Chatbot trả lời theo từng Section (Đặng Quang Trung) — hiện `app/agents/` chưa có endpoint này, ghi backlog và phát triển sau demo.

---

## 3. Thống Kê Người Thử

| Tiêu chí | Số lượng | Tỷ lệ |
|----------|----------|-------|
| Tổng số người thử | 5 | 100% |
| Willing user từ CP1 | 2 (Thuyên, Dũng) | 40% (≥2/5 đạt yêu cầu) |
| Người ngoài nhóm | 5 | 100% |

### Danh sách chi tiết
| STT | Họ tên | Willing user? |
|-----|--------|---------------|
| 1 | Hoàng Thị Thuyên | Có |
| 2 | Dương Tiến Dũng | Có |
| 3 | Đặng Quang Trung | Không |
| 4 | Phạm Thanh Hưng | Không |
| 5 | Trương Công Cường | Không |

---

## 4. Kết Luận

- **Đạt yêu cầu R6:** ≥5 người ngoài nhóm, ≥2 willing user từ CP1.
- **Phản hồi tích cực:** 100% người dùng thấy hữu ích cho việc tự học.
- **Cần cải thiện:** Tối ưu thời gian xử lý và UX (progress bar, dropdown).
- **Cần phát triển thêm:** Chatbot theo Section (nếu muốn đưa vào tính năng chính thức).

