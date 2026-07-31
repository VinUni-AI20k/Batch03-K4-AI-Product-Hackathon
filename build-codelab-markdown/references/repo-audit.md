# Repo audit và dựng timeline

Đọc ở Phase 1 (audit) và Phase 2 (phân loại dạng lab, dựng timeline).

Nguyên tắc chi phối cả file: **repo là bằng chứng, không phải tài liệu đã đúng.** README được viết một lần rồi ít ai sửa; code thì đổi liên tục. Khi hai bên nói khác nhau, code thắng — nhưng ý định giảng dạy có thể chỉ tồn tại trong docs, nên giữ nó và ghi lại mâu thuẫn.

## Nội dung

1. Đọc gì
2. Evidence ledger
3. Thứ tự thẩm quyền
4. Sáu loại lệnh
5. Phân loại mọi file
6. Truy input contract
7. Khối "Mâu thuẫn trong repo"
8. Phân loại dạng lab — 3 câu hỏi
9. Bảy dạng thường gặp
10. Dựng timeline

## Đọc gì

Bỏ qua thư mục vendored, generated, cache, model, dependency. Đọc khi có:

`README*` · `BRIEF.*` · `docs/**` · `LAB_GUIDE.md` · `*worksheet*.md` · `SCORING.md` · `grade.py` · `requirements.txt` · `pyproject.toml` · `package.json` · `Makefile` · CI workflow · `template.py` · `starter_*/` · `src/**` · `tests/**` · `data/**` · `config/*.json` · `.env.example` · `report/TEMPLATE_*.md` · `docs/PHAN_CONG*.md`

## Evidence ledger

Chưa có ledger thì chưa được viết step nào. Ledger là bảng nội bộ (không đưa vào output), mỗi fact một nguồn:

| Fact | Nguồn để chốt |
|---|---|
| Learning objective | doc giảng dạy **và** code path tương ứng |
| Lệnh setup | manifest → script → CI → docs |
| Lệnh smoke run | entrypoint chạy được, không có assertion |
| Lệnh test tự động | test config hoặc CI. Không suy từ chữ nghĩa trong README |
| Input contract | parser / loader / schema / fixture |
| Output kỳ vọng | assertion hoặc code deterministic |
| Deliverable đã có | path đã verify tồn tại |
| Deliverable phải tạo | docs nhắc tới nhưng chưa có trên disk → `FILE MỚI` |
| Thời lượng và mốc | timeline / checklist. Ghi lại nếu các nguồn lệch |
| Ownership | file bị sửa và dependency edge giữa các task |

## Thứ tự thẩm quyền

Khi hai nguồn nói khác nhau:

```
test / assertion → source code → manifest / script / CI → README / docs → Coach inference
```

## Sáu loại lệnh

Đừng gọi sai tên. Đây là lỗi làm học viên mất niềm tin nhanh nhất: chạy "test" xong xanh hết tưởng đúng, đến lúc chấm thì fail.

- **Setup** — tạo môi trường, cài dependency
- **Smoke run** — chạy cho thấy có output, không có assertion
- **Automated test** — có test runner hoặc assertion
- **Validation** — kiểm contract, read-only
- **Manual check** — người tự nhìn để xác nhận, không có lệnh. Vẫn phải nói rõ *nhìn cái gì thì gọi là đạt*
- **Security check** — kiểm không lộ secret trước khi push

Repo không có test tự động thì nói thẳng là không có, rồi thêm validation read-only hoặc manual check. Đừng bịa bộ test không tồn tại.

## Phân loại mọi file

Mọi path được nhắc trong guide phải thuộc một trong bốn loại:

- **File đã có cần sửa** — path relative + tên hàm hoặc section cần sửa
- **`FILE MỚI`** — path + mục đích + lệnh tạo + format + lệnh validate + output kỳ vọng. Nói rõ thư mục cha đã tồn tại hay cũng phải tạo
- **`KHÔNG COMMIT`** — path + vì sao + xác nhận đã có trong `.gitignore`
- **Generated / chỉ để đọc** — path + lệnh sinh ra nó, hoặc ghi rõ là file tham khảo không sửa

Verify mọi path bằng cách xem thật trên disk. Đừng bịa một file vì nó làm guide gọn hơn.

Lưu ý một cái bẫy hay gặp: nhiều lab đặt code trong subdir (`starter_v0/`) và guide bảo learner `cd` vào đó. Lúc đó path trong guide đúng theo CWD nhưng không đúng theo repo root — chọn một quy ước, nói rõ một lần ở step 1, rồi giữ nguyên cả bài.

Không bao giờ để lộ path máy cá nhân (`/home/<user>/`, `C:\Users\`, `file:///`). Learner copy vào là chạy sai.

## Truy input contract

Truy từ entrypoint, không từ mô tả. Ghi lại: path, encoding, container (JSON array hay object), field required và kiểu, **chính xác item hoặc index nào được dùng**, hành vi khi input sai.

Mâu thuẫn hay gặp nhất: README nói "chạy toàn bộ 20 case", `main()` có `for case in cases[:1]`.

## Khối "Mâu thuẫn trong repo"

Đưa lên đầu CODELAB.md ngay sau khối TL;DR và timeline, không nhét footnote. Học viên gặp mâu thuẫn giữa bài mà không được báo trước sẽ tưởng mình sai.

```markdown
> **Mâu thuẫn trong repo — cách guide này xử lý**
>
> - `README.md` ghi 180 phút; bảng mốc cộng lại 150 phút. Guide dùng 150 phút theo bảng chi tiết.
> - `README.md` nhắc `docs/hybrid_flowchart.mermaid` nhưng file chưa có → FILE MỚI ở step 5.
> - Không có test tự động cho `src/tools.py`. Step 3 dùng smoke run + validation thay thế.
```

Loại phải nêu: thời lượng lệch · file bắt buộc không có trên disk · README nói chạy hết case mà code chạy một phần · output kỳ vọng code không thể sinh ra · rubric chấm file mà guide không có chỗ tạo · lệnh trong docs đã chết.

Không tự "sửa hộ" lab. Thấy bug thì ghi vào khối này, đừng sửa code app, đừng cài thêm package.

## Phân loại dạng lab — 3 câu hỏi

Phân loại bằng chính repo trước mắt, không bằng cách so với lab cũ:

1. **Deliverable được chấm là gì** — code chạy được, file cấu hình hoặc prompt, tài liệu, hay số đo?
2. **Có lệnh nào learner chạy được để tự biết mình đúng chưa?** Có bộ chấm tự động không?
3. **Làm cá nhân hay nhóm?** Nếu nhóm thì repo có tách file theo vai chưa?

Ba câu đó quyết định bốn thứ: **step là gì · checkpoint đo bằng gì · có cần phân vai không · có code block hay không.** Bảy điều bất biến giữ nguyên ở mọi dạng.

## Bảy dạng thường gặp

Mô tả theo tính chất, không theo tên repo — lab mới có thể không thuộc dạng nào ở đây, lúc đó quay lại ba câu hỏi trên.

- **Code trong file có sẵn TODO, kèm test theo phần.** Step là một phần của bộ test; checkpoint là lệnh test và số test pass. Thường cá nhân, không cần phân vai. Escape hatch quan trọng nhất ở dạng này vì lớp lệch nhịp lộ ra rõ nhất.
- **Deliverable là tài liệu, không có gì để chạy.** Bỏ luật "mỗi lệnh có output kỳ vọng" vì không có lệnh; thay bằng một mẫu đã điền để learner đối chiếu ở mỗi phase. Step là một bước suy nghĩ. Checkpoint là section đã điền đủ cộng một câu tự giải thích. Worked example gần như bắt buộc — learner không có cách nào khác để biết "xong" trông thế nào.
- **Hệ thống nhiều file, làm nhóm.** Step là một thành phần chạy được. Cần phân vai theo file và integration gate ở cuối mỗi mốc.
- **Một file nộp, máy chấm.** Không có gì để build theo bước. Guide xoay quanh contract của file nộp, các cách mất điểm, và luật của bộ chấm. Step là từng chiều bị chấm. Checkpoint là chạy bộ chấm trên tập public.
- **Chuỗi phiên bản có đo.** Mỗi version một giả thuyết và một metric. Step là một vòng cải tiến. Checkpoint là before/after trên metric có trong log. Báo cáo là trung tâm, không phải code.
- **Chốt theo mốc giờ (hackathon, sprint).** Step là checkpoint trên đồng hồ. Rubric trỏ về artifact, không trỏ về test.
- **Repo chỉ để đọc hoặc demo, không có bài nộp.** Cân nhắc `format: "prose"` thay vì `"steps"`, hoặc hỏi coach mục đích trước khi viết.

Lab lai hai dạng thì chọn theo **deliverable được chấm**, không chọn theo phần code nhiều nhất.

## Dựng timeline

Làm việc này trước khi viết chữ nào, vì nó là thứ quyết định số step.

1. Liệt kê deliverable cuối cùng (thứ được chấm).
2. Đi ngược ra các step. Mỗi step là **một artifact chạy được**, không phải một chủ đề lý thuyết. Tên step là cụm động từ (`Lắp ReAct Agent V1`), không phải chủ đề (`Về ReAct Agent`).
3. Sắp theo dependency thật, không theo thứ tự chương sách.
4. Gán phút cho từng step. Tính cho **người chậm nhất trong lớp**, không tính cho coach. Cộng lại phải khớp `duration` trong frontmatter.
5. Đánh dấu quan hệ: song song (khác file, không ăn output của nhau) / tuần tự (chung file, hoặc cần output bước trước) / gate (cả nhóm phải có mặt).
6. Đặt một câu hỏi trọng tâm cho cả bài, học viên trả lời được ở step cuối.

Timeline này lên đầu bài dưới dạng bảng `Mốc | Step | Xong sẽ có gì`, và mỗi step mở bằng dòng `**<N> phút · mốc <a>–<b>.**`.

Ràng buộc cứng cho step 1: **phải chạy được không cần API key** (mock / local / deterministic). Đây là điều kiện để cả lớp qua được step 1, và là rào cản bỏ cuộc số một nếu làm sai.
