# Kết quả round 1

**Tổng: 25 case · Đạt: 20 · Trượt: 5 · Tỷ lệ: 80%**

## Chi tiết

| Case        | Kết quả                                                             |
| ----------- | ------------------------------------------------------------------- |
| R1-01       | ❌ Bổ sung Scrum ngoài tài liệu nguồn                               |
| R1-02       | ❌ Đưa ví dụ y khoa/số liệu như thể có trong nguồn                  |
| R1-03       | ❌ Giải thích sampling temperature ngoài phạm vi nguồn              |
| R1-04–R1-09 | ✅ Đạt                                                              |
| R2-01       | ❌ Trả lời học tăng cường từ đoạn chỉ nói về học sâu                |
| R2-02–R2-06 | ✅ Đạt                                                              |
| R3-01       | ✅ Đạt                                                              |
| R3-02       | ❌ Chọn Classification là weakness duy nhất dù bằng chứng mâu thuẫn |
| R3-03–R3-05 | ✅ Đạt                                                              |
| R4-01–R4-05 | ✅ Đạt                                                              |

## Các case failed

- **R1-01:** Vi phạm giới hạn nguồn khi thêm nội dung Scrum không có trong slide/transcript.
- **R1-02:** Không gắn nhãn đầy đủ ví dụ y khoa và số liệu là kiến thức ngoài nguồn.
- **R1-03:** Tự bổ sung công thức và giải thích sampling temperature dù khái niệm vắng mặt trong tài liệu.
- **R2-01:** Trả lời câu hỏi về học tăng cường như thể suy ra được từ đoạn nói về học sâu.
- **R3-02:** Kết luận Classification là weakness duy nhất với confidence cao, bỏ qua mâu thuẫn giữa điểm quiz và self-report.

## Kiểm tra bổ sung

- Backend unit tests: **3 passed**.
- Frontend production build: **passed**.
- Suite contract: **25/25, 0 lỗi cấu trúc**.
