# AI SPEC — Lab Guide Builder · Nhóm SPIDERMAN · Zone D305

Hướng: [X] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [X] Tính năng mới

## §1. User & Job

- **Job executor:** Thành viên nhóm hackathon đang chuẩn bị lab guide và artifact nộp bài trong thời gian giới hạn.
- **Core JTBD:** Khi cần chuẩn bị tài liệu lab cho nhóm, tôi muốn biết phải làm gì, theo thứ tự nào và bàn giao file nào để hoàn thành demo đúng hạn mà không phải sửa nhiều khi review.
- **Problem statement:** Thành viên nhóm đọc các guideline rời rạc, khó xác định vai trò, file cần nộp và cách kiểm tra; hậu quả là mất thời gian phối hợp và dễ thiếu artifact trước demo.

### Evidence mining (đường B)

Nguồn: `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv`, lọc `role=student`; dùng mã hội thoại ẩn danh, không sao chép data pack vào artifact. Data dictionary ghi nhận 1.261 lượt hỏi của 369 user. Nhóm sẽ đếm thêm trong vòng evidence riêng trước CP4; các ví dụ dưới đây chứng minh nhu cầu hướng dẫn có căn cứ và hỗ trợ khi thiếu ngữ cảnh.

| Mã nguồn | Ví dụ nguyên văn rút gọn | Tín hiệu |
|---|---|---|
| C0001 / T0649 | “tóm tắt nội dung chính trong slide này” | Cần hướng dẫn theo task rõ ràng |
| C0006 / T0058 | “xem bài tập thực hành lab day 2 chiều nay ở đaau” | Khó tìm đúng artifact/lab |
| C0009 / T0191 | “heloo” | Input thiếu mục tiêu cần được làm rõ |
| C0013 / T0990 | “Context là gì” | Cần giải thích khái niệm theo ngữ cảnh |
| C0015 / T0811 | “Designt Pattern ReAct là gì có lưu ý gì về nó?” | Cần câu trả lời có giới hạn và căn cứ |
| C0020 / T0122 | “tóm tắt hết slice trong vài câu đi” | Cần đầu ra đúng phạm vi/yêu cầu |

**Phương pháp:** đối chiếu ID nguồn ở cột `conversation_id` và `turn_id`, chỉ lưu trích đoạn tối thiểu. Không suy ngược danh tính, không dùng `user_id` làm tên người thử.

## §2. Impact & quyết định chọn

| Ứng viên | Người gặp | Tần suất | Tốn mỗi lần | Khả thi trong hackathon | Quyết định |
|---|---:|---|---|---|---|
| Lab Guide Builder | 4–5 thành viên/nhóm | Mỗi lab, mỗi checkpoint | 20–30 phút tổng hợp và sửa format | Cao: dùng hai skill hiện có | Chọn |
| Auto reviewer | 4–5 thành viên/nhóm | Mỗi PR | 10–20 phút sửa review | Trung bình: cần rule/code integration | Loại |
| Meeting summary | 4–5 thành viên/nhóm | 1–2 lần/ngày | 5–10 phút | Cao nhưng impact thấp hơn | Loại |

Chọn **Lab Guide Builder** vì tác động trực tiếp đến artifact CP1–CP6, dùng được workflow và validator có sẵn trong `build-codelab-markdown/` và `build-repo-lab-guide/`. Auto reviewer bị loại vì cần hiểu source code và rule chất lượng ngoài lát cắt; meeting summary bị loại vì không giải quyết trực tiếp rủi ro thiếu guide/artifact.

## §3. Giải pháp tương tự đã nghiên cứu

| Giải pháp | Flow quan sát | Học | Tránh | Khác biệt của nhóm |
|---|---|---|---|---|
| ChatGPT | User hỏi → AI trả lời | Giải thích linh hoạt | Trả lời không biết guideline nội bộ | Audit repo trước, gắn evidence/cảnh báo thiếu căn cứ |
| NotebookLM | Hỏi trên nguồn đã nạp | Hiển thị căn cứ theo nguồn | Không thay thế workflow giao file | Biến source thành checklist, Markdown/HTML và workflow graph |
| Template Markdown thủ công | Copy khung → tự điền | Dễ kiểm diff | Dễ bỏ sót contract và validation | Validator kiểm format/case trước khi nộp |

## §4. Thiết kế

**Lát cắt một câu:** Một thành viên nhóm hackathon muốn biến repo lab thành hướng dẫn đúng chuẩn; hệ thống audit evidence và quyết định mức chắc chắn của yêu cầu; kết quả là Markdown/HTML cùng workflow graph có thể review và commit.

### Phạm vi và mức prototype

- **Mức:** Working cho artifact generation/validation; chưa xác nhận UI production hay đăng nhập.
- **Thật:** audit file, render/validator của hai skill, golden-set validator.
- **Mock/chưa đo:** AI call trung tâm và kết quả chạy end-to-end của prototype phải được ghi trace riêng trước CP3.
- **Automation:** conditional. Với repo có evidence đủ, hệ thống sinh draft; với source mâu thuẫn/thiếu, hệ thống gắn nhãn giới hạn và yêu cầu user cung cấp context. Sai guideline khiến learner làm sai artifact nên không automate toàn phần.

### Non-goals

1. Không review hoặc sửa source code của repo lab.
2. Không trả lời kiến thức ngoài phạm vi repo/guideline đã audit.
3. Không quản lý Git, commit hoặc quyền truy cập repository.
4. Không tạo hay xác thực tài khoản đăng nhập.

### Nguyên tắc HAX/PAIR

| Nguyên tắc | Áp dụng cụ thể |
|---|---|
| G1 — làm rõ hệ thống làm được gì | Mở đầu guide nêu input là repo/guideline và output là Markdown/HTML/workflow graph. |
| G2 — làm rõ mức tin cậy | Mỗi claim suy ra phải ghi `Coach inference`; claim có evidence trỏ file/lệnh/assertion. |
| G10 — thu hẹp khi nghi ngờ | Thiếu repo context, case yêu cầu hỏi một câu làm rõ thay vì đoán framework hoặc output. |
| G11 — giải thích vì sao | Audit finding ghi evidence, impact và decision; golden case chấm source reference. |
| PAIR Explainability + Trust | Trích source/repository URL khi có, không bịa URL khi không có. |
| PAIR Feedback + Control | Feedback log hỏi người thử về chỗ khó hiểu, mức tin và ý định dùng thật; changelog ghi quyết định tiếp theo. |

## §5. Kiểu lỗi và kịch bản

| ID | Lớp | Tình huống | Hành vi mong muốn |
|---|---|---|---|
| S01 | ① Source of Truth | README yêu cầu file khác test | Nêu mâu thuẫn, ưu tiên test/source và gắn evidence. |
| S02 | ① Source of Truth | User đòi cite guideline không tồn tại | Nói không có căn cứ, yêu cầu file/link. |
| S03 | ② Thiếu thông tin | Chỉ nói “viết README” | Hỏi repo, audience, runtime hoặc đưa draft có giả định rõ. |
| S04 | ② Thiếu thông tin | Repo có nhiều entrypoint | Nêu các lựa chọn và hỏi command/flow chính. |
| S05 | ③ Ngoài phạm vi | Đòi review bảo mật production | Từ chối phạm vi, chỉ dẫn quay lại artifact lab. |
| S06 | ③ Ngoài phạm vi | Đòi push/commit Git | Không thực hiện Git; nêu file sẵn sàng để user review. |
| S07 | ④ Domain | Workflow graph thiếu fallback | Chặn xuất bản; yêu cầu direct/tool/fallback branch. |
| S08 | ④ Domain | Codelab thiếu field/directive renderer | Chạy validator, nêu lỗi theo dòng/field và không tuyên bố publish được. |
| S09 | ④ Domain | Case yêu cầu file mới nhưng không có contract | Ghi `FILE MỚI` với path, purpose, format, consumer và validation. |
| S10 | ① Source of Truth | URL repo không được cung cấp | Đặt `repository_url: null`, không tự tạo URL. |

## §6. Bốn đường đi của trải nghiệm

| Đường đi | Trigger | Hệ thống làm gì | Đầu ra user nhận |
|---|---|---|---|
| Happy path | Repo rõ README/test/entrypoint | Audit → model → render → validate | Guide và workflow graph pass validator |
| Low-confidence | Thiếu framework hoặc target audience | Hỏi đúng một câu hoặc đưa assumption có nhãn | Draft bị giới hạn, không claim đã verify |
| Failure/không căn cứ | Source xung đột hoặc URL thiếu | Không bịa; nêu evidence và phần không quyết định được | Finding có impact/decision và việc cần bổ sung |
| Correction | User sửa repo context hoặc yêu cầu | Dùng thông tin mới để render/validate lại | Phiên bản mới, rationale trong changelog |

## §7. Kiểm thử

### Chiều chất lượng

| Chiều | Pass kiểm chứng được |
|---|---|
| Grounding | Mọi case có `source_reference`; claim repo có URL HTTPS hoặc `null` rõ ràng. |
| Coverage | Có đúng 20 case: tối thiểu 2 case/lớp ①–④, 8 happy/normal và 2 rare edge case. |
| Safe behavior | Case thiếu source/out-of-scope yêu cầu clarify/refusal, không có instruction bịa output. |
| Domain contract | Case domain yêu cầu validator/render contract hoặc file contract cụ thể. |
| Traceability | `id` là duy nhất và schema có pass criteria để người ngoài nhóm chấm cùng kết quả. |

Golden set nằm trong năm file JSON của `eval/`; 10/20 case tham chiếu pattern/mã chatlog ẩn danh. Chạy `python eval/validate_golden_set.py` để kiểm schema và số lượng. Validator này chỉ kiểm artifact, không đánh giá output AI; khi prototype sẵn sàng, ghi một lượt chạy đầy đủ vào bảng dưới đây.

**Quality bar chốt:** Đạt khi **≥85% (17/20) case pass**, và **100% case Source of Truth hoặc ngoài phạm vi không bịa nguồn, URL hay hành động Git**. Bar này không được đổi sau 23:59 ngày 1.

| Lượt chạy | Ngày | Pass/20 | Tỷ lệ | So với bar | Ghi chú |
|---|---|---:|---:|---|---|
| Schema check v1 | 2026-07-31 | 20/20 | 100% | PASS (cấu trúc) | Được chạy bởi `validate_golden_set.py`; chưa phải evaluation output AI. |
| Prototype run | Chưa chạy | — | — | Chưa xác định | Phải chạy toàn bộ 20 case trước CP6, kể cả case fail. |

## §8. Phân công & kế hoạch

### Phân công

Tên thật của thành viên chưa có trong repo; không gán tên hư cấu. Trước CP1, thay các vai sau bằng tên/mã học viên thật trong README và bảng này.

|Thành viên | Vai | Trách nhiệm | Artifact |
|---|---|---|---|
|Hồ Văn Tâm| Spec owner | Chốt §1–§9 và changelog | `spec.md` |
| Evidence owner | Mining, phương pháp đếm và quote | log evidence riêng |
| Prompt/eval owner | Case, rubric và lượt chạy | `eval/` |
| Build owner | Prototype và AI trace | `codebase/` |
| Demo/validation owner | User test, dry run, slide | `validation/`, slide |

### Validation CP5

- Tuyển ≥5 người ngoài nhóm; ít nhất 2 trong 3 willing users phải được xác định bằng **tên/vai thật trước khi test**.
- Mỗi người làm một task thật trong 10 phút, quan sát không hướng dẫn, rồi hỏi: (1) *Điều gì khó hiểu hoặc khó chịu nhất?* (2) *Bạn có tin kết quả không, vì sao?* (3) *Bạn có dùng thật không, vì sao/chưa?*
- Người ghi log: Demo/validation owner. Ghi nguyên văn vào `validation/user-feedback-log.md`; không tạo quote/names giả.
- Sau ≥5 phiên, chọn ít nhất một thay đổi hoặc lý do giữ nguyên, ghi vào §9 với ID feedback.

### Multi-prototype

Nếu còn thời gian, so sánh hai phương án ở trục **mức automation**: (A) luôn render draft và gắn assumption; (B) hỏi lại khi thiếu input. Chọn B cho case rủi ro cao vì sai guideline tốn chi phí review/điểm; ghi kết quả vào changelog.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-31 | Hoàn thiện spec, 20 golden cases và feedback-log template | Chốt scope Lab Guide Builder; chưa có feedback user thật nên không ghi claim validation. |
| Sau CP5 | Chưa có dữ liệu | Chỉ thêm khi có feedback ID thật và quyết định có căn cứ. |
