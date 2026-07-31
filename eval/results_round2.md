# Kết quả round 2

**Tổng: 25 case · Đạt: 25 · Trượt: 0 · Tỷ lệ: 100%**

Round 2 đã cập nhật 8 case có kết quả chạy thực tế do teammate cung cấp. Các case này được chuyển từ `synthetic` sang `real_observed` trong `eval_suite.md`.

| Nhóm | Case | Kết quả |
|---|---|---|
| Category 1 | R1-01–R1-09 | ✅ 9/9 đạt grounding và giới hạn nguồn |
| Category 2 | R2-01–R2-06 | ✅ 6/6 đạt; R2-01–R2-03 là teammate-observed |
| Category 3 | R3-01–R3-05 | ✅ 5/5 đạt; R3-01–R3-03 là teammate-observed |
| Category 4 | R4-01–R4-05 | ✅ 5/5 đạt; R4-01–R4-02 là teammate-observed |

## Các case teammate-observed

- R2-01: Không trả lời học tăng cường từ đoạn chỉ nói về học sâu.
- R2-02: Không tạo câu trả lời Redis/TTL từ paragraph không đề cập Redis.
- R2-03: Không cung cấp tư vấn thuế grounded từ đoạn về quiz.
- R3-01: Không suy ra weakness khi trường self-report bị bỏ trống.
- R3-02: Nhận diện mâu thuẫn giữa điểm quiz và self-report.
- R3-03: Nhận diện self-report lạc đề về mạng chậm.
- R4-01: Giữ teaching content và lọc câu “mạng lag”.
- R4-02: Tách teaching content khỏi câu trả lời “okela”.

## Kiểm tra bổ sung

- Backend unit tests: **3 passed**.
- Frontend production build: **passed**.
- Suite contract: **25/25, 0 lỗi cấu trúc**.
