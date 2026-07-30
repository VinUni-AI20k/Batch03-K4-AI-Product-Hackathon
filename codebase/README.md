# Prototype — CP2 · "Show được thứ bấm được"

**Mức prototype khai báo: Mock.** Giao diện và toàn bộ flow bấm được end-to-end; phần lõi AI và backend **chưa nối** — mọi câu trả lời của tutor là dữ liệu giả trong `data.js`.

## Chạy

Mở `index.html` bằng trình duyệt. Không cần cài đặt, không cần build, không cần server.

## Flow chính bấm hết được

1. Mở tài liệu từ cây học liệu bên trái (Day01–Day06 mở/đóng được, Day02 đang mở tài liệu 76 trang).
2. Cuộn / bấm mũi tên dưới đáy để đi giữa 76 trang slide.
3. **Bôi đen một đoạn** trên slide → hiện popup **Hỏi AI · Báo bối rối · Ghi chú**.
4. Bấm **Hỏi AI** → panel VLearn Tutor trả lời kèm % độ tin cậy, dòng ngữ cảnh, trích dẫn `[trang N]` bấm được để nhảy tới trang, thẻ nguồn tham khảo, nút phản hồi 👍/👎.
5. **★ Công cụ mới — Chụp vùng:** bấm `Chụp vùng` trên toolbar (hoặc phím `S`) → kéo chuột chọn một vùng bất kỳ → vùng chọn có **viền cam + 8 điểm neo kéo lại được**, nhãn kích thước, và thanh nút **Hỏi AI vùng này · Ghi chú · Sao chép · Huỷ**. Bấm *Hỏi AI vùng này* → vùng ảnh được đính vào khung chat và tutor trả lời theo vùng đó.
6. Ghi chú lưu lại thành ghim trên slide, đếm trong chip `Trang N · X note`, xem lại và **xuất ra file .md** được.

## Các nút đều có hành vi thật

| Nhóm | Nút | Hành vi |
|---|---|---|
| Chế độ | Đọc · Bút · Highlight · Chụp vùng | Bút vẽ thật lên slide (SVG), Highlight bôi vàng đoạn đã chọn thật |
| Toolbar | `…` | Mở **thanh công cụ phụ** (xem bảng dưới) |
| Header | `⋮` | Vừa khung · toàn màn hình · in · thông tin tài liệu · báo lỗi · **mô phỏng lỗi mạng** |
| Toolbar | `Trang N · X note` | Mở danh sách ghi chú |
| Toolbar | zoom `−` `%` `+` | Phóng to/thu nhỏ slide thật |
| Toolbar | `+` `−` | Tăng/giảm cỡ bút |
| Toolbar | tải · xuất · hoàn tác · xoá | Xuất ghi chú ra `.md` thật; hoàn tác/xoá annotation theo trang (mờ khi không có gì để hoàn tác) |
| Header | `VI` · trăng | Đổi ngôn ngữ VI/EN · đổi sáng/tối |
| Rail `‹` `›` | | Ẩn/hiện cột học liệu và panel tutor |
| Tutor | lịch sử · `+` · gửi · 👍👎 | Đều có phản hồi |

Phím tắt: `R` đọc · `B` bút · `H` highlight · `S` chụp vùng · `←`/`→` đổi trang · `Esc` thoát.

## Thanh công cụ phụ

Hiện ra khi đang dùng **Bút / Khoanh / Text**, hoặc khi bấm **`…`** trên toolbar — giống hành vi của VLearn bản thật:

| Đang chọn | Thanh phụ hiện gì |
|---|---|
| Bút (chưa bấm `…`) | 6 ô màu + thanh trượt **NÉT** |
| Bút + đã bấm `…` | Khoanh · Text · Ảnh · Tẩy **+** 6 ô màu + **NÉT** |
| Highlight + đã bấm `…` | Chỉ Khoanh · Text · Ảnh · Tẩy (highlight không dùng màu bút) |

| Công cụ | Hành vi thật |
|---|---|
| **Khoanh** | Kéo chuột để vẽ hình ellipse bao quanh nội dung, theo màu và độ dày đang chọn |
| **Text** | Bấm lên slide → hiện ô chữ gõ trực tiếp; cỡ chữ theo thanh NÉT, màu theo ô màu; để trống rồi bấm ra ngoài thì tự huỷ |
| **Ảnh** | Mở hộp chọn file → chèn ảnh thật vào giữa trang đang xem |
| **Tẩy** | Bấm vào một nét bút, hình khoanh, ô chữ, ảnh hoặc đoạn highlight để xoá đúng phần tử đó — hoàn tác được |
| **6 ô màu** | Đỏ · xanh dương · xanh lá · vàng · cam · đen, áp cho bút, khoanh và text |
| **NÉT** | Độ dày nét 1–12px, đồng bộ hai chiều với hai nút `+` `−` trên toolbar chính |

## Bốn đường đi trải nghiệm đã dựng sẵn (để nối vào spec §6)

Tutor chọn câu trả lời theo từ khoá trong câu hỏi — dùng để demo 4 đường đi:

| Đường đi | Gõ thử | Kết quả |
|---|---|---|
| Happy | "6 yếu tố của problem statement" | Trả lời 85%, có trích dẫn |
| Low-confidence | "ai phát minh ra khung này năm nào" | 41% · nhãn ĐỘ TIN THẤP · nói rõ chưa chắc |
| Ngoài phạm vi ③ | "deadline nộp bài là khi nào" | Từ chối trả lời từ suy đoán + đề nghị chuyển TA |
| Thiếu thông tin ② | "cái này là gì" | Hỏi lại kèm 3 gợi ý bấm được |
| Failure / correction | `…` → *Mô phỏng lỗi mạng* rồi hỏi | Trạng thái LỖI + nút **Thử lại** |

## Cấu trúc

| File | Nội dung |
|---|---|
| `index.html` | Khung giao diện |
| `styles.css` | Toàn bộ style, có theme sáng/tối |
| `data.js` | **Toàn bộ dữ liệu giả**: 76 trang slide, cây học liệu, các câu trả lời mock |
| `app.js` | Logic: render slide, công cụ annotate, công cụ chụp vùng, panel tutor |

## Phần nào là mock — ghi rõ để chấm R5

- Nội dung 76 trang slide: **tự sinh**, không phải tài liệu thật của khoá.
- Câu trả lời tutor: **hardcode** trong `ANSWERS` (`data.js`), chọn bằng từ khoá.
- % độ tin cậy, trích dẫn trang, nguồn tham khảo: **giả**.
- "Sao chép vùng ảnh", "tải bản gốc", "chuyển cho TA": **chưa nối**, chỉ báo toast.
- Ghi chú lưu trong bộ nhớ trang, **mất khi refresh** (chưa có backend).

## Chỗ sẽ nối AI thật ở CP3

Đúng **một** hàm: `mockAnswer(question, opts)` trong `app.js` (đánh dấu `AI_CALL`). Thay thân hàm bằng lời gọi model thật và trả về cùng shape `{conf, body[], sources[], kind?}` là xong — phần còn lại của UI không phải sửa.
