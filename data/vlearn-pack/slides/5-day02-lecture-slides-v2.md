# 5 day02 lecture slides v2

## Slide 1

Xác định bài toán
cho AI.
Từ yêu cầu mơ hồ đến Problem Statement rõ ràng.
AI IN ACTION · DAY 02

## Slide 2

Bốn câu hỏi trọng tâm
— Từ xác định bài toán đến quyết định ứng dụng AI
01
Bài toán có thực sự cần AI giải quyết?
02
Nếu có, giải pháp ở cấp độ nào: Rule, Workflow, hay Agent?
03
Problem Statement đã đủ rõ ràng để triển khai?
04
Khi nào quyết định: Go, Not Yet, hay No-Go?
MỞ ĐẦU · 4 CÂU HỎI
DAY 02 ·  02 / 64

## Slide 3

Agenda
— Mục tiêu: Biến yêu cầu mơ hồ thành Problem Statement rõ ràng để ra quyết định
SÁNG: KHUNG LÝ THUYẾT (4H )
CHIỀU: THỰC HÀNH LAB (4H )
BÀI NỘP CUỐI BUỔI
MỞ ĐẦU · AGENDA
DAY 02 ·  03 / 64
Cụ thể hóa yêu cầu mơ hồ
Thấu hiểu người dùng (HCD)
Đánh giá sự cần thiết của AI
Phân loại giải pháp (Rule /
Workflow / Agent)
Hoàn thiện Problem Statement
Quyết định: Go / Not Yet / No-Go
Cá nhân: Tìm 5 bài toán & điền 3
Problem Cards
Nhóm: Phản biện chéo, chốt 1 bài
toán
Nhóm: Xác thực dữ liệu & vẽ quy
trình
Nhóm: Xác định giải pháp & ra
quyết định
Cá nhân: Viết nhật ký phản tư
(Reflection Log)
Nhật ký tìm và lọc bài toán
(Cá nhân)
Problem Statement hoàn
chỉnh (Nhóm)
Nhật ký phản tư (Cá nhân)

## Slide 4

Phát triển Sản phẩm AI (AI Product)
— Sản phẩm tích hợp AI bản chất vẫn là một sản phẩm hoàn chỉnh, kế thừa chứ không thay thế nguyên lý
sản phẩm truyền thống.
MỞ ĐẦU · NỀN TẢNG
DAY 02 ·  04 / 64

## Slide 5

Ba trụ cột nền tảng của AI Product
— Kỹ thuật hệ thống AI · Tư duy sản phẩm · Tư duy thiết kế
AI Engineering
Triển khai RAG, Agent, Guardrails,
Evaluation (Đánh giá) và vận hành hệ
thống AI thực tế.
Product Thinking
(Inspired)
Xác định đúng bài toán, thấu hiểu người
dùng, tránh xây dựng những tính năng
không mang lại giá trị.
Design Thinking
(Everyday Things)
Thiết kế dựa trên mô hình tư duy
(Mental Model), cơ chế phản hồi
(Feedback) và tối ưu trải nghiệm
khi AI sai sót.
NGUỒN Chip Huyen — AI Engineering · Marty Cagan — Inspired · Don Norman — Design of Everyday Things
MỞ ĐẦU · NỀN TẢNG
DAY 02 ·  05 / 64

## Slide 6

T H ẢO  L U ẬN  N H A N H
“Tôi muốn xây dựng chatbot AI
cho khách hàng.”
T H E O  B ẠN  C H AT B OT  Đ Ó  Đ A N G  L À M  G Ì ?
—  V I ẾT  CÂU  T R Ả L ỜI  L Ê N  D I S C O R D  ·  3  P H Ú T

## Slide 7

"AI chatbot" chưa phải là một bài toán
— Đối tượng khác nhau dẫn đến quy trình (workflow), chỉ số (metrics) và rủi ro khác nhau.
BÀI TOÁN · CHATBOT
DAY 02 ·  07 / 64
PHỤC VỤ KHÁCH HÀNG
HỖ TRỢ NỘI BỘ
Giải đáp câu hỏi thường gặp (FAQ) về sản
phẩm & chính sách
Tư vấn và hỗ trợ mua hàng
Chăm sóc sau mua hàng
Bán thêm & bán chéo (Upsell & Cross-
sell)
Phân loại yêu cầu hỗ trợ
(Tickets/Questions)
Tra cứu thông tin nghiệp vụ nhanh
Đề xuất nháp phản hồi để con người phê
duyệt
Chuyển tiếp câu hỏi phức tạp hoặc rủi ro
cao cho nhân sự hỗ trợ
đối tượng
khác
→ metric
khác!

## Slide 8

Khoan đã, bạn có hỏi không?
— Cần thấu hiểu bản chất vấn đề trước khi tìm giải pháp
Học viên gặp khó khăn ở công đoạn
nào?
Trợ giảng quá tải ở bước nào?
Quy trình hiện tại đang xử lý ra sao?
Giải pháp này xây dựng phục vụ ai?
Chưa thấu hiểu điểm đau (pain point) thì chưa đề xuất giải pháp.
BÀI TOÁN · PHÂN TÍCH
DAY 02 ·  08 / 64

## Slide 9

Từ trải nghiệm ngày học đầu tiên, liệt kê ít nhất 3 điểm đau (pain points) bạn quan sát hoặc
gặp phải.
Nhận diện điểm đau thực tế
5 PHÚT
GỬI LÊN DISCORD
BẠN GẶP TẮC NGHẼN Ở ĐÂU?
B À I  T ẬP  C Á  N H Â N
·
·

## Slide 10

C O U N T E R - I N T U I T I V E  R U L E
“never solve the problem
I am asked to solve.”
D O N  N O R M A N  · The Design of Everyday Things

## Slide 11

01
S E C T I O N
Problem Discovery
Tìm đúng vấn đề trước khi tìm giải pháp — Double Diamond,
HCD và các kỹ thuật phân kỳ / hội tụ.

## Slide 12

Tìm đúng vấn đề trước khi tìm giải pháp
— Mô hình Double Diamond — Don Norman / British Design Council (2005)
Diamond 1 — Tìm đúng vấn đề
Discover: Mở rộng — khảo sát vấn đề căn bản
Define: Thu hẹp — xác định đúng bài toán gốc
Diamond 2 — Tìm đúng giải pháp
Develop: Mở rộng — nhiều giải pháp tiềm năng
Deliver: Thu hẹp — chọn và triển khai
Kỹ sư và doanh nhân được đào tạo để giải vấn đề.
Nhà thiết kế được đào tạo để khám phá vấn đề thật.
Giải pháp xuất sắc cho sai vấn đề có thể còn tệ hơn không có giải pháp.
NGUỒN Don Norman, JND.org · The Design of Everyday Things
NGUỒN Design Council — Framework for Innovation
BÀI TOÁN · DOUBLE DIAMOND
DAY 02 ·  12 / 64

## Slide 13

Diamond 1 — Tìm đúng vấn đề
— Phân kỳ để thấu hiểu sâu sắc, Hội tụ để lựa chọn chính xác
BÀI TOÁN · DIAMOND 1
DAY 02 ·  13 / 64
DISCOVER · PHÂN KỲ
Khám phá
mở rộng góc nhìn
Quan sát thực tế (Observation)
Phỏng vấn người dùng (User Interview)
Khảo sát (Survey)
Nhật ký hành vi (Diary Study)
Phân tích dữ liệu / Nhật ký hệ thống
Bản đồ các bên liên quan (Stakeholder
Mapping)
DEFINE · HỘI TỤ
Định nghĩa
chọn lọc dựa vào dữ liệu
Sơ đồ đồng cảm / Gom nhóm (Affinity Mapping)
Kỹ thuật đặt câu hỏi 5 Whys
Ma trận Tác động – Nỗ lực (Impact-Effort)
Biểu quyết bằng chấm tròn (Dot Voting)
Câu hỏi mở hướng giải quyết (How Might We)
Phát biểu bài toán (Problem Statement)

## Slide 14

Quy trình thiết kế lấy con người làm trung tâm (HCD)
— 4 bước lặp lại bên trong mỗi Diamond — Don Norman
Observation (Quan sát)
Những người được quan sát phải phù hợp với đối tượng mục tiêu. Quan sát
khách hàng tiềm năng trong cuộc sống bình thường, hiểu các tình huống thực
tế họ gặp phải.
Ideation (Tạo ra ý tưởng)
Tạo nhiều ý tưởng, sáng tạo không bị ràng buộc bởi các hạn chế. Tránh phê
bình ý tưởng của bản thân hay người khác. Đặt câu hỏi về tất cả mọi thứ.
Prototype (Tạo mẫu thử)
Tạo nguyên mẫu nhanh cho mỗi giải pháp tiềm năng. Mục tiêu là kiểm tra
nhanh nhất có thể trước khi build.
Test (Kiểm tra)
Ngồi quan sát cách người dùng tương tác với Prototype trong thực tế.
Iteration (Lặp lại)
Tinh chỉnh và nâng cao liên tục.
NGUỒN Don Norman — Design of Everyday Things · IDEO — Design Thinking · Stanford d.school
BÀI TOÁN · HCD VÒNG LẶP
DAY 02 ·  14 / 64

## Slide 15

Những câu hỏi nguyên bản
— Đôi khi insight bắt đầu từ việc đặt câu hỏi cho những điều hiển nhiên
Isaac Newton
Quả táo rơi xuống đất — vậy Mặt Trăng
có đang "rơi" tự do không?
Polaroid
Tại sao không thể xem ảnh ngay lập tức
sau khi chụp?
Airbnb
Liệu không gian sống bỏ trống
có thể dùng làm dịch vụ lưu trú?
Tò mò trước. Đánh giá sau.
NGUỒN Britannica · Newton · ACS · Polaroid · Airbnb About
BÀI TOÁN · CÂU HỎI NGUYÊN BẢN
DAY 02 ·  15 / 64

## Slide 16

Câu hỏi gợi mở
— Đặt câu hỏi gợi mở để mở rộng tư duy trước khi lựa chọn bài toán
Giả định hiển nhiên nào cần được lật
lại?
Có cách tiếp cận nào hoàn toàn mới
cho vấn đề?
Nếu thiết kế lại từ đầu và không bị giới
hạn?
Tại sao bài toán này cần AI? Nếu không
thì sao?
Quy trình nào đang tồn tại chỉ vì thói
quen?
Có câu hỏi cốt lõi nào đang bị né tránh?
Gửi 1 câu hỏi phản biện lên Discord
BÀI TOÁN · CÂU HỎI GỢI MỞ
DAY 02 ·  16 / 64

## Slide 17

Khởi nguồn từ bài toán, không bắt đầu từ AI
— Ba bài học thực tế về am hiểu lĩnh vực, quy mô thị trường và định vị giải pháp
CURSOR
Lệch năng lực cốt lõi
Từ bỏ mảng AI thiết kế cơ khí để tập
trung vào AI code editor – nơi đội ngũ
am hiểu sâu sắc quy trình nghiệp vụ.
ARTIFACT
Sản phẩm tốt ≠ Thị
trường lớn
Ứng dụng đọc tin tích hợp AI xuất sắc,
nhưng quy mô thị trường quá hẹp để
thương mại hóa thành công.
NOTEBOOKLM
Định vị đúng điểm
đau
Tập trung giải quyết nhu cầu hỏi
đáp, tóm tắt trên tài liệu cá nhân
và đối chiếu nguồn gốc bằng
trích dẫn.
Lộ trình: Bài toán → Quy trình vận hành → Chỉ số đo lường → Giải pháp AI
NGUỒN Forbes · Cursor · TechCrunch · Artifact · Google · NotebookLM
BÀI TOÁN · CASE STUDY
DAY 02 ·  17 / 64

## Slide 18

Tìm bài toán AI ở đâu?
— Bắt đầu từ việc quan sát các hoạt động thực tế xung quanh
REPETITIVE
Tác vụ lặp lại
Việc diễn ra thường xuyên;
công đoạn nào cần chuẩn
hóa để hướng tới tự động
hóa?
TIME-CONSUMING
Tiêu tốn thời gian
Khối lượng xử lý lớn; thời
gian hao phí ở bước nào
(tìm kiếm, đọc hiểu, chờ
đợi, định dạng)?
AI ADVANTAGE
Lợi thế của AI
Tác vụ đòi hỏi phân tích
ngữ cảnh, xử lý ngôn ngữ
tự nhiên, tổng hợp đa
nguồn.
USER PAIN POINTS
Điểm đau người
dùng
Ai đang gặp khó khăn,
phàn nàn hoặc bị tắc
nghẽn liên tục?
Tập trung nhận diện vấn đề; chưa vội đề xuất giải pháp. Sàng lọc bài toán sẽ diễn ra vào buổi chiều.
BÀI TOÁN · 4 LENSES
DAY 02 ·  18 / 64

## Slide 19

Sai lầm thường gặp (Anti-patterns) khi tích hợp AI
— Dấu hiệu cảnh báo bài toán chưa được định hình rõ hoặc giải pháp AI được lựa chọn quá sớm
Ưu tiên giải pháp (Solution-first)
Xây dựng chatbot/agent trước khi làm rõ quy trình vận hành
và điểm nghẽn thực tế.
Mơ hồ hiện trạng (No baseline)
Không lượng hóa tổn thất hiện tại, dẫn đến mất căn cứ đánh
giá hiệu quả cải tiến.
Bỏ qua đánh giá (No evaluation)
Không thiết lập kịch bản kiểm thử, chỉ số đo lường hoặc
phương án đối chứng.
Mập mờ ranh giới (No boundary)
Không rõ phạm vi tự chủ của AI và thời điểm cần con người
phê duyệt (Human-in-the-loop).
Nếu phát hiện mắc các sai lầm trên, hãy quay lại làm rõ Problem Statement trước khi chọn công
nghệ.
BÀI TOÁN · ANTI-PATTERNS
DAY 02 ·  19 / 64

## Slide 20

Discovery interview: 5 câu hỏi nên hỏi stakeholder
Vấn đề nhức nhối (Pain Point) là gì?  Tần suất lặp lại trong ngày hoặc trong tuần ra sao?
Quy trình (Workflow) hiện tại như thế nào?  Công cụ nào được sử dụng ở từng bước, và ai bàn giao công việc
cho ai?
Thiệt hại (Cost) do vấn đề này gây ra là gì?  Hao phí cụ thể về thời gian xử lý, chi phí tài chính, cam kết dịch vụ
(SLA) hay tỷ lệ chuyển đổi (conversion)?
Hậu quả nếu hệ thống AI sai sót là gì?  Khâu nào cần con người tham gia kiểm soát (HITL/phê duyệt), hay AI
chỉ hỗ trợ đưa ra gợi ý?
Ai là người có quyền phê duyệt dự án (nói YES)?  Chỉ số hiệu quả (metric) và mức độ rủi ro (risk) nào sẽ trực
tiếp quyết định việc đầu tư?
Lưu ý: Nếu đối tác (stakeholder) không mô tả được quy trình hiện tại và chi phí thiệt hại khi xảy ra lỗi, mọi đề xuất giải pháp AI đều chỉ là phỏng
đoán thiếu căn cứ.
PROBLEM DISCOVERY · STAKEHOLDER INTERVIEW
DAY 02 ·  20 / 64

## Slide 21

02
S E C T I O N
Problem Statement
Từ pain point đến Problem Statement — bài toán định hình rõ nét
qua workflow, bottleneck, metrics và boundary.

## Slide 22

Quick Problem Card
— Khung định hình bài toán
Bài toán (1 câu)
problem
Vấn đề cụ thể cần giải quyết (không bao gồm giải pháp).
Đối tượng ảnh hưởng
actor
Cá nhân hoặc bộ phận chịu tác động trực tiếp từ vấn đề.
Quy trình hiện tại
workflow
Các bước vận hành thủ công hoặc tự động hiện tại (gồm 3–7 bước).
Nút thắt & Tác động
bottleneck + impact
Khâu gây chậm trễ, sai sót hoặc lặp lại; hệ quả hay tổn thất cụ thể.
Chỉ số đo thành
công
success metric
Chỉ số định lượng cụ thể dùng để chứng minh hiệu quả cải tiến.
Định hướng giải
pháp
direction
No AI / Rule / Workflow / Agent / Chưa xác định.
PROBLEM STATEMENT · QUICK CARD
DAY 02 ·  22 / 64

## Slide 23

Quick Problem Card — ví dụ đã điền
— Case: Weekly Report
Bài toán (1 câu)
problem
Mỗi thứ Hai, PM mất khoảng 90 phút tổng hợp Weekly Report từ Jira, Google Sheets và Slack; bước
viết narrative tốn thời gian nhất và dễ làm trễ deadline.
Đối tượng ảnh hưởng
actor
Junior PM chịu trách nhiệm gửi weekly report cho Engineering Manager và CEO trước buổi leadership
sync.
Quy trình hiện tại
workflow
Export Jira → lấy metrics từ Google Sheets → đọc Slack recap → tổng hợp vào Google Docs → viết
narrative → review/format → gửi email.
Nút thắt & Tác động
bottleneck + impact
Bước viết narrative từ raw data mất khoảng 25 phút. Tổng flow mất khoảng 90 phút/tuần/PM; team 3
PM tương đương khoảng 270 phút/tuần.
Chỉ số đo thành
công
success metric
Giảm thời gian làm report từ 90 phút xuống dưới 30 phút, nhưng không làm tăng số câu CEO/EM phải
hỏi lại.
Định hướng giải
pháp
direction
Workflow — tự động kéo và cấu trúc dữ liệu, AI hỗ trợ draft narrative, PM vẫn review/edit trước khi gửi.
PROBLEM STATEMENT · WORKED EXAMPLE
DAY 02 ·  23 / 64

## Slide 24

Câu hỏi khai thác bài toán
— Bộ câu hỏi định hình vấn đề dành cho các bên liên quan hoặc chính mình
01
Quy trình hiện tại như thế nào?
Công cụ, các bước, cơ chế bàn giao
thông tin?
02
Nút thắt nằm ở đâu?
Bước nào chậm, dễ sai sót, lặp lại?
03
Hao phí hiện tại là bao nhiêu?
Thời gian, chi phí nhân sự, SLA, cơ hội
bỏ lỡ?
04
Tiêu chí thành công đo bằng
gì?
Hiệu quả cải tiến định lượng cụ thể?
05
Hậu quả khi xảy ra sai sót?
Phạm vi tự quyết của AI; điểm cần con
người phê duyệt?
06
Có giải pháp phi AI đơn giản
hơn?
Quy tắc, checklist, quy trình hay tài liệu
hướng dẫn?
PROBLEM STATEMENT · 6 CÂU HỎI
DAY 02 ·  24 / 64

## Slide 25

Định lượng hóa bài toán
— Điểm đau chưa được định lượng thì không thể xác định giá trị thực tế của AI
01 · BASELINE
Hiện trạng
where we are
Mức hao phí hiện tại là bao nhiêu? Bằng
con số cụ thể.
02 · TARGET
Mục tiêu
where to go
Kỳ vọng cải thiện ở mức độ nào?
Ngưỡng cụ thể là gì?
03 · MEASUREMENT
Đo lường
how we know
Chỉ số nào chứng minh tính hiệu
quả? Cách thu thập?
THỜI GIAN HOÀN THÀNH
Rút ngắn từ 90 phút xuống dưới 30
phút.
CHẤT LƯỢNG CÔNG VIỆC
Giảm tỷ lệ lỗi phân loại từ 20% xuống
dưới 5%.
TẢI TRỌNG VẬN HÀNH
Cắt giảm 40% câu hỏi trùng lặp
cần Trợ giảng xử lý.
PROBLEM STATEMENT · ĐỊNH LƯỢNG
DAY 02 ·  25 / 64

## Slide 26

Thiết lập chỉ số: Output & Input
— Chỉ số đo lường cần phản ánh kết quả cuối và các đòn bẩy có thể tác động
"Nâng cao hiệu suất" không phải chỉ số — cần gắn với hiện trạng, mục tiêu và phương pháp đo.
NGUỒN Amplitude — North Star Framework · Lenny — Choosing Your North Star Metric
PROBLEM STATEMENT · METRICS
DAY 02 ·  26 / 64
OUTPUT METRIC
Kết quả cuối cùng
what we optimize
Thời lượng hoàn tất quy trình giảm bao nhiêu?
Tỷ lệ sai sót / Chất lượng đầu ra thay đổi thế nào?
Giá trị thực tế người dùng nhận được rõ nét hơn?
tăng cái
này
→ đo cái
kia
INPUT METRICS
Các đòn bẩy
what we can move
Tỷ lệ câu hỏi được phân loại chính xác.
Tỷ lệ yêu cầu được chuyển tiếp hỗ trợ kịp thời.
Thời gian Trợ giảng hiệu chỉnh bản nháp phản hồi.

## Slide 27

Lựa chọn một điểm đau đã nhận diện và thiết lập phương án đo lường cụ thể.
Chuyển điểm đau thành
chỉ số định lượng
5 PHÚT
BASELINE → TARGET → MEASUREMENT
B À I  T ẬP  N H A N H
·

## Slide 28

03
S E C T I O N
Có nên ứng dụng AI?
AI chỉ thực sự mang lại giá trị khi tích hợp chính xác vào quy trình
nghiệp vụ và giải quyết đúng điểm đau.

## Slide 29

Khi nào AI đáng để làm?
AI HỢP KHI NÀO
VÌ SAO DOANH NGHIỆP ĐẦU TƯ
Mục tiêu áp dụng AI sẽ trực tiếp quyết định phương thức xây dựng giải pháp, mức độ tự động hóa và quy mô đầu tư.
CÓ NÊN ỨNG DỤNG AI · KHI NÀO HỢP
DAY 02 ·  29 / 64
Tác vụ mang tính lặp lại nhưng có độ biến thiên vừa phải.
Yêu cầu tổng hợp hoặc tìm kiếm tri thức từ nhiều nguồn.
Quy trình gồm nhiều bước phức tạp và cần tương tác với
nhiều công cụ.
Nếu quy trình hoàn toàn có tính xác định (deterministic),
các quy tắc luật tĩnh (rule) sẽ tối ưu hơn.
01 Sống còn — Bắt buộc phải tích hợp AI để duy trì lợi
thế cạnh tranh trước đối thủ.
02 Hiệu quả — Giảm thiểu chi phí vận hành, tăng tốc độ
xử lý và nâng cao năng suất nghiệp vụ.
03 Khám phá — Tích lũy năng lực công nghệ, tránh tụt
hậu và tìm kiếm các mô hình cơ hội mới.

## Slide 30

Tự xây dựng hay mua giải pháp?
— Hai góc nhìn bổ sung nhau giúp định hình chiến lược triển khai
GÓC NHÌN 1 — CHIP HUYEN, AI ENGINEERING (2025)
In-house (Build)
Khi công nghệ AI là lợi thế cạnh tranh cốt lõi và yếu tố sống
còn
Mua / SaaS (Buy)
Khi giải pháp AI đóng vai trò như một công cụ tối ưu hóa năng
suất (productivity layer)
GÓC NHÌN 2 — MIT CISR (2025)
Buy
Boost
Build
Thực tế: Đa số đội ngũ phát triển đang ở giữa — Boost (RAG / fine-tune), thay vì phải tự xây dựng lại mọi thứ từ đầu (build from
scratch).
CÓ NÊN ỨNG DỤNG AI · BUILD / BOOST / BUY
DAY 02 ·  30 / 64
Giải pháp may sẵn (off-the-shelf), do nhà
cung cấp (vendor) duy trì.
Triển khai nhanh, nhưng ít tạo ra sự khác
biệt cạnh tranh.
Phụ thuộc hoàn toàn vào lộ trình
(roadmap) của vendor.
Mua mô hình sẵn có và cải tiến bằng dữ
liệu nội bộ.
Ứng dụng kỹ thuật tinh chỉnh (fine-tune)
hoặc RAG (truy xuất nâng cao).
Đòi hỏi năng lực quản trị dữ liệu (data
governance) tốt.
Tự xây dựng và tối ưu mô hình tùy biến
(custom model) riêng.
Khả năng kiểm soát cao nhất, nhưng chi
phí đắt đỏ nhất.
Đòi hỏi đội ngũ kỹ sư AI có năng lực
chuyên môn mạnh.

## Slide 31

Thiết lập kỳ vọng
— Đo lường các chỉ số để xác định mức độ hiệu quả trước khi chính thức phát hành giải pháp
1 — TÁC ĐỘNG KINH DOANH
Giải pháp tạo giá trị gì cho doanh
nghiệp?
ĐO BẰNG
2 — SỰ HÀI LÒNG KHÁCH HÀNG
Người dùng thực tế có thấy tốt hơn
không?
ĐO BẰNG
3 — NGƯỠNG HỮU DỤNG
Hệ thống đạt tiêu chí nào thì có thể
phát hành?
ĐO BẰNG
CÓ NÊN ỨNG DỤNG AI · THIẾT LẬP KỲ VỌNG
DAY 02 ·  31 / 64
Tỷ lệ tự động hóa tác vụ/yêu cầu (%).
✓
Quy mô xử lý lượng công việc tăng thêm.
✓
Tốc độ phản hồi & thời gian quy trình
được tối ưu.
✓
Chỉ số hài lòng CSAT / NPS.
✓
Đánh giá chất lượng trực tiếp từ người
dùng.
✓
Tỷ lệ hoàn thành tác vụ vs Tỷ lệ bỏ ngang
giữa chừng.
✓
Chất lượng: Độ chính xác và tính hữu ích
của đầu ra.
✓
Độ trễ: Tốc độ phản hồi (TTFT, TPOT).
✓
Chi phí: Chi phí tài chính trên mỗi lượt
yêu cầu.
✓

## Slide 32

Đánh giá mức độ phù hợp của AI
— Năm câu hỏi cốt lõi trước khi xác định cấp độ giải pháp (Rule / Workflow / Agent)
01
Nghiệp vụ có đòi hỏi xử lý ngôn ngữ, tri thức chuyên môn hoặc suy
luận?
02
Dữ liệu đầu vào có cung cấp đủ ngữ cảnh để AI phản hồi chính xác?
03
Đã thiết lập các chỉ số định lượng để đánh giá hiệu quả?
04
Hậu quả khi AI sai sót có nằm trong phạm vi kiểm soát?
05
Có giải pháp thay thế đơn giản và tối ưu chi phí hơn AI không?
Nếu phần lớn câu trả lời chưa rõ ràng → Quyết định: Not Yet.
NGUỒN Google — Rules of ML · Anthropic — Building effective agents
QUYẾT ĐỊNH AI · 5 CÂU HỎI
DAY 02 ·  32 / 64

## Slide 33

Vòng đời Sản phẩm AI (AI Product Lifecycle)
— Mỗi giai đoạn từ ý tưởng đến vận hành thực tế yêu cầu phương thức xác thực chuyên biệt
NGUỒN Chip Huyen — AI Engineering
QUYẾT ĐỊNH AI · LIFECYCLE
DAY 02 ·  33 / 64

## Slide 34

Khoảng cách giữa Demo và Production
— Phản hồi chính xác trong vài lần thử chưa đủ cơ sở để triển khai hệ thống thực tế
BASELINE
Thiết lập đối
chứng
Đối chiếu hiệu quả với quy
tắc tĩnh, nhân sự hay quy
trình hiện tại?
EVALUATION
Kiểm thử hệ
thống
Bộ dữ liệu kiểm thử, kịch
bản biên (edge cases) và
tiêu chí nghiệm thu?
CONTROLS
Cơ chế kiểm soát
Logging, fallback, rollback
và nhân sự chịu trách
nhiệm?
OPERATIONS
Vận hành liên tục
Ai giám sát lỗi, cập nhật tri
thức nền và tối ưu hệ
thống?
Mục tiêu Day 02 là xác định tính khả thi để tiếp tục nghiên cứu; chưa phải quyết định triển khai
ngay.
NGUỒN Google — Rules of ML · Chip Huyen — AI Engineering
QUYẾT ĐỊNH AI · DEMO TO PRODUCTION
DAY 02 ·  34 / 64

## Slide 35

Hệ thống AI = Model + Context + Planning + Tools
— Một giải pháp AI thực tế là sự kết hợp của một hệ thống, không chỉ dừng lại ở mô hình ngôn ngữ
NGUỒN Anthropic — Building effective agents · Chip Huyen — Agents
HỆ THỐNG AI · KIẾN TRÚC
DAY 02 ·  35 / 64

## Slide 36

Tổng quan về Hệ thống AI
— Khái quát các thành phần cấu thành để định vị giải pháp
MODEL
Tư duy & Sáng
tạo
Xử lý đọc hiểu, soạn thảo,
tổng hợp, phân loại và đưa
ra gợi ý.
CONTEXT
Tri thức chuyên
biệt
Cơ sở dữ liệu, tài liệu
nghiệp vụ, hồ sơ lịch sử
giúp AI phản hồi chính xác
theo bối cảnh.
PLANNING
Điều phối quy
trình
Tự động phân rã tác vụ
phức tạp và linh hoạt điều
chỉnh.
TOOLS
Liên kết hệ thống
Tích hợp CRM, database,
lịch làm việc hoặc API bên
thứ ba.
Tiến trình: Lên kế hoạch → Pilot → Vận hành thực tế → Vòng lặp phản hồi. Hôm nay tập trung vào lên
kế hoạch.
NGUỒN Anthropic — Building effective agents · Chip Huyen — Agents
HỆ THỐNG AI · TỔNG QUAN
DAY 02 ·  36 / 64

## Slide 37

Vai trò của UX trong Sản phẩm AI
— UX là chốt chặn xử lý các tình huống AI thiếu dữ liệu, độ tin cậy thấp hoặc yêu cầu phê duyệt thủ công
HỆ THỐNG AI · UX
DAY 02 ·  37 / 64

## Slide 38

04
S E C T I O N
Rule / Workflow / Agent
Phân tích cấp độ giải pháp. Cấp độ tối ưu là cấp độ đơn giản nhất
đủ để giải quyết bài toán.

## Slide 39

Ba mức giải pháp: Rule / Workflow / Agent
Rule / Script
Ví dụ: Tính thuế, chặn email spam theo từ
khóa, auto-reply theo template
LLM Feature / Workflow
Ví dụ: Tóm tắt email, chatbot FAQ, phân loại
ticket hỗ trợ
Agent
Ví dụ: Agent nghiên cứu thị trường, coding
agent sửa nhiều file
Thứ tự ưu tiên thực dụng: bắt đầu từ bên trái, chỉ đi sang bên phải khi giá trị tăng hơn độ phức tạp.
RWA · TỔNG QUAN
DAY 02 ·  39 / 64
Đầu vào ổn định, ít thay đổi
Logic viết được thành if/else
Cần kết quả luôn đúng 100%
Quy định pháp lý / tuân thủ chặt
Đầu vào đa dạng, không viết hết rule
được
Đầu ra cần linh hoạt (tóm tắt, dịch,
phân loại)
Có cách đo chất lượng
Người có thể kiểm tra trước khi gửi
Nhiều bước, dùng nhiều công cụ
Tình huống thay đổi liên tục
Cần tự ra quyết định giữa các bước
Có kiểm soát rủi ro rõ ràng

## Slide 40

Tình huống: Tối ưu nguồn lực Trợ giảng
— Quy trình nghiệp vụ hiện tại cần được mô hình hóa trước khi cân nhắc giải pháp AI
BỐI CẢNH & BÀI TOÁN
Lớp học số lượng học viên lớn nhưng nguồn lực Trợ giảng (TA) hạn chế. TA quá tải do rà soát thủ công các câu hỏi trùng lặp, hoặc xử lý yêu cầu hỗ trợ thiếu
thông tin lỗi. Mục tiêu: tối ưu hóa quy trình để giảm tải cho TA và giúp học viên không bị kẹt lâu.
01
Học viên
tắc nghẽn
→
02
Gửi yêu cầu
hỗ trợ
→
03
Trợ giảng
đọc ngữ cảnh
→
04
Phản hồi /
chuyển tiếp
→
05
Học viên
hiệu chỉnh
BOTTLENECK
Nhiều câu hỏi trùng lặp hoặc thiếu
thông tin chi tiết; Trợ giảng mất thời gian
rà soát thủ công.
METRICS
Thời gian học viên chờ phản hồi, tỷ lệ
câu hỏi trùng lặp, số học viên bị kẹt kéo
dài.
RISKS
AI hướng dẫn sai hoặc nhầm lẫn
kiến thức khiến học viên đi sai
hướng thực hành.
RWA · TÌNH HUỐNG
DAY 02 ·  40 / 64

## Slide 41

Cấp độ 1 — Giải pháp dựa trên Luật (Rule-based)
— Áp dụng khi logic nghiệp vụ tường minh, kết quả cố định và yêu cầu kiểm soát rủi ro nghiêm ngặt
Giải pháp dựa trên Luật (Rule) không thua kém AI. Nếu giải quyết triệt để bài toán, đó luôn là lựa
chọn tối ưu nhất.
RWA · MỨC 1: RULE
DAY 02 ·  41 / 64
ĐIỀU KIỆN ÁP DỤNG
Khi nào chọn Rule
when to use
Logic phân nhánh rành mạch (If/Else).
Yêu cầu hoặc trạng thái lặp lại hoàn toàn.
Không đòi hỏi khả năng tự suy luận của AI.
Yêu cầu kết quả có thể dự đoán và kiểm soát tuyệt
đối.
ỨNG DỤNG TRONG LAB
Ví dụ thực tế
in our context
Hỏi lịch nộp bài → Tự động gửi link thời khóa biểu.
Nộp thiếu file bài tập → Tự động nhắc nhở checklist.
Hỏi lỗi cài đặt quen thuộc → Gửi link tài liệu hướng
dẫn.
Câu hỏi ngoài danh mục → Tự động chuyển cho Trợ
giảng.

## Slide 42

Cấp độ 2 — Giải pháp dựa trên Quy trình (Workflow)
— Các bước xử lý đã định hình rõ, nhưng từng công đoạn cần AI hỗ trợ ngôn ngữ hoặc đánh giá
→
→
NGUỒN Anthropic — Building effective agents
RWA · MỨC 2: WORKFLOW
DAY 02 ·  42 / 64
01
Học viên gửi
Problem Card
02
AI rà soát &
yêu cầu bổ sung
AI
03
Trợ giảng phê
duyệt câu phức tạp
HUMAN
ƯU ĐIỂM
Linh hoạt nhưng có kiểm soát
flexible + controlled
Xử lý ngữ cảnh tốt hơn Rule tĩnh.
Lộ trình của hệ thống vẫn nằm trong tầm kiểm soát.
LƯU Ý THIẾT KẾ
Tránh chatbot phản hồi tự do
design discipline
Mỗi công đoạn phải định nghĩa rõ đầu vào và đầu ra.
Không thiết kế thành một chatbot phản hồi tự do.

## Slide 43

Cấp độ 3 — Giải pháp dựa trên Tác nhân tự chủ (Agent)
— Hệ thống tự động lập kế hoạch, phối hợp công cụ và linh hoạt thích ứng theo tình huống
Tác động của Agent mạnh mẽ hơn, nhưng đi kèm chi phí vận hành cao hơn, độ trễ lớn hơn, khó kiểm thử và phát sinh các dạng lỗi phức tạp.
RWA · MỨC 3: AGENT
DAY 02 ·  43 / 64
ĐIỀU KIỆN CÂN NHẮC
Khi nào dùng Agent
when to consider
Không thể xác định trước toàn bộ các bước thực thi.
Môi trường nhiều biến số đòi hỏi thay đổi kế hoạch
linh hoạt.
Cần tương tác với nhiều công cụ và truy xuất nhiều
nguồn dữ liệu.
Có thiết lập vòng phản hồi và chốt chặn giám sát từ
con người.
ỨNG DỤNG TRONG LAB
Ví dụ thực tế
in our context
Theo dõi hoạt động thảo luận và nộp bài trên các
kênh học tập.
Phát hiện các học viên hoặc nhóm học viên bị kẹt
quá lâu.
Tự động tổng hợp vấn đề họ gặp phải và gợi ý cách
hỗ trợ.
Trợ giảng chỉ cần duyệt và nhấn nút gửi phương án
hỗ trợ.

## Slide 44

Một tình huống, ba cấp độ giải pháp
— Ưu tiên giải pháp đơn giản nhất có thể giải quyết bài toán và mang lại cải tiến đo lường được
Không bắt buộc nâng cấp tuần tự từ Rule lên Agent →dừng ở cấp tối giản nhất nếu đã đáp ứng mục tiêu đề ra.
RWA · SO SÁNH
DAY 02 ·  44 / 64
CẤP ĐỘ 1
Rule
luật tĩnh
TRẢ LỜI TỰ ĐỘNG
Khi nào? Logic tường minh, kết quả
cố định.
Tự động trả lời FAQ, gửi link thời
khóa biểu.
—
Gửi tài liệu sửa lỗi cài đặt cơ bản.
—
Nhắc nhở checklist nộp bài.
—
CẤP ĐỘ 2
Workflow
quy trình
DUYỆT PROBLEM CARD
Khi nào? Có quy trình rõ, AI hỗ trợ
từng bước.
AI kiểm tra độ đầy đủ của Problem
Card.
—
Yêu cầu bổ sung nếu thiếu thông tin.
—
Chuyển cho Trợ giảng giải quyết.
—
CẤP ĐỘ 3
Agent
tác nhân
ĐỀ XUẤT CAN THIỆP CHỦ ĐỘNG
Khi nào? Tình huống động, đa công
cụ.
Tự động theo dõi tiến độ nộp bài.
—
Phát hiện nhóm học viên bị kẹt lâu.
—
Chuẩn bị câu trả lời, đề xuất TA
duyệt.
—

## Slide 45

Workflow Patterns theo Anthropic
— Khái quát các khái niệm cốt lõi phục vụ nghiên cứu và trao đổi
BASIC PATTERNS
Mô hình cơ bản
đáp ứng đa số tác vụ
ADVANCED PATTERNS
Mô hình nâng cao
khi nghiệp vụ đòi hỏi
AUTONOMOUS
Agent
tác nhân tự chủ
LLM tự lập kế hoạch, sử dụng
công cụ, quan sát phản hồi và
linh hoạt điều chỉnh bước tiếp
theo.
Nguyên tắc: Bắt đầu bằng giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi quy trình thực tế yêu
cầu.
NGUỒN Anthropic — Building effective agents
WORKFLOW · ANTHROPIC PATTERNS
DAY 02 ·  45 / 64
Prompt Chaining (Chuỗi liên kết)
Routing (Phân luồng)
Parallelization (Song song)
Orchestrator-Workers (Điều phối
– Thực thi)
Evaluator-Optimizer (Đánh giá –
Tối ưu)

## Slide 46

Workflow patterns — đủ cho hầu hết bài toán
Nguồn: Anthropic — Building Effective Agents (2024)
In
LLM Call 1
Output 1
Gate
Pass
Fail
LLM Call 2
Output 2
Exit
LLM Call 3
Out
1. Prompt Chaining
Chia task thành chuỗi bước tuần tự. Có gate kiểm tra giữa
các bước.
VD: Viết outline → check → viết bài
In
LLM Call
Router
LLM Call 1
LLM Call 2
LLM Call 3
Out
2. Routing
Phân loại input → đưa vào nhánh chuyên biệt. Tối ưu từng
loại riêng.
VD: CS query → FAQ / refund / kỹ thuật
In
LLM Call 1
LLM Call 2
LLM Call 3
Aggregator
Out
3. Parallelization
Chạy song song rồi tổng hợp (sectioning), hoặc chạy nhiều
lần lấy vote.
VD: Guardrail + response đồng thời
Nguyên tắc Anthropic:
➔ Luôn ưu tiên giải pháp đơn giản nhất; chỉ tăng độ phức tạp khi thực sự
cần thiết.
— 3 mô hình cơ bản trên đã đủ đáp ứng hầu hết bài toán thực tế.
WORKFLOW PATTERNS · BASIC
DAY 02 ·  46 / 64

## Slide 47

Khi nào cần phức tạp hơn?
— Orchestrator-Workers, Evaluator-Optimizer, và Agent
In
Orchestrator
LLM Call 1
LLM Call 2
LLM Call 3
Synthesizer
Out
4. Orchestrator-Workers
1 LLM phân việc động cho workers. Subtasks không biết
trước.
VD: Coding agent sửa nhiều file
In
LLM Call
Generator
Solution
LLM Call
Evaluator
Rejected + Feedback
Accepted
Out
5. Evaluator-Optimizer
1 LLM tạo, 1 LLM đánh giá → lặp cho đến khi đạt.
VD: Dịch văn học → review → sửa
Human
LLM Call
Action
Environment
Feedback
Stop
Agent
LLM tự lập kế hoạch + gọi tools + iterate. Autonomous loop.
VD: SWE-bench, computer use
"Agents' autonomy makes them ideal for scaling tasks in trusted
environments."
➔ Chi phí vận hành cao, dễ tích tụ sai số (lỗi cộng dồn)
WORKFLOW PATTERNS · ADVANCED
DAY 02 ·  47 / 64

## Slide 48

Thang câu hỏi lựa chọn cấp độ giải pháp
— Khung câu hỏi tuần tự giúp tránh bẫy "nhảy vọt" lên Agent phức tạp
01
tần suất & tác động
Tần suất & Tác động có đủ lớn? Nếu thấp → Xử lý thủ công hoặc hiệu chỉnh quy trình
nghiệp vụ trước.
02
logic
Logic xử lý có rành mạch? Nếu tường minh → Ưu tiên giải pháp Rule, kịch bản tự động,
danh mục kiểm tra.
03
quy trình
Quy trình thực hiện có cố định? Nếu có → Xây dựng Workflow tích hợp AI hỗ trợ từng công
đoạn.
04
tự thích ứng
Quy trình đòi hỏi khả năng tự thích ứng linh hoạt? Chỉ khi có nhiều biến số phức tạp → Mới
cân nhắc Agent.
05
giá trị vs rủi ro
Giá trị mang lại có vượt trội chi phí & rủi ro? Nếu không → Đặt chốt chặn phê duyệt
(Human-in-the-loop) hoặc chọn Not Yet / No-Go.
NGUỒN Anthropic — Building effective agents
WORKFLOW · THANG QUYẾT ĐỊNH
DAY 02 ·  48 / 64

## Slide 49

Cây quyết định: Lựa chọn cấp độ giải pháp
— Từ bài toán cốt lõi đến lựa chọn Rule, Workflow hay Agent
NGUỒN Anthropic — Building effective agents · Google — Rules of ML
WORKFLOW · DECISION TREE
DAY 02 ·  49 / 64

## Slide 50

Ví dụ thực tế ngoài lớp học
— Phân biệt cấp độ giải pháp Rule, Workflow và Agent trong các tình huống thực hành
Chăm sóc khách hàng
Nghiên cứu bán hàng
Kho tri thức nội bộ
WORKFLOW · VÍ DỤ THỰC TẾ
DAY 02 ·  50 / 64
Rule: Định tuyến phiếu hỗ trợ
theo từ khoá.
Workflow: Tự động soạn nháp
câu trả lời có trích dẫn nguồn.
Agent: Xử lý quy trình đa bước,
truy vấn CRM, tạo yêu cầu hoàn
tiền.
Rule: Lọc khách hàng tiềm năng
theo lĩnh vực, quy mô.
Workflow: Thu thập thông tin →
Tóm tắt → Soạn email tiếp cận.
Agent: Giám sát tín hiệu thị
trường, cập nhật CRM, đề xuất
bước tiếp theo.
Rule: Phân phối chính sách
theo nhu cầu tra cứu.
Workflow: Hỏi đáp dựa
trên tài liệu nội bộ kèm trích
dẫn nguồn.
Agent: Giám sát thay đổi
pháp lý, nhắc nhở cập nhật
tài liệu.

## Slide 51

Thiết kế UX và Human-in-the-loop
— Tối ưu hóa hiệu quả của AI thông qua thiết kế giao diện tương tác phù hợp
Làm rõ ý định
Yêu cầu bổ sung ngữ cảnh
hoặc làm rõ khi thông tin
chưa đủ.
Minh bạch thông
tin
Trích dẫn nguồn lực cụ thể
minh chứng cho câu trả lời.
Phê duyệt thủ
công
Con người kiểm duyệt
trước khi thực hiện tác vụ
rủi ro cao.
Thiết lập ranh
giới
Giới hạn phạm vi hoạt
động tự chủ của AI để
tránh hành vi ngoài kiểm
soát.
Dù mô hình tối ưu, thiết kế UX không phù hợp vẫn dẫn đến trải nghiệm người dùng kém hiệu quả.
WORKFLOW · UX + HITL
DAY 02 ·  51 / 64

## Slide 52

05
S E C T I O N
Problem Statement hoàn
chỉnh
Liên kết chặt chẽ giữa bài toán, workflow, metrics và quyết định
AI — thành đầu vào cho Eval Plan.

## Slide 53

Problem Statement cho hệ thống AI
— 6 yếu tố bài toán cốt lõi và 3 yếu tố quyết định AI
Actor
đối tượng ảnh hưởng
Đối tượng trực tiếp chịu ảnh hưởng bởi vấn đề.
Workflow
quy trình hiện tại
Quy trình vận hành hiện tại gồm các bước cụ thể nào?
Bottleneck
nút thắt
Khâu nào gặp tình trạng chậm trễ, sai sót, lặp lại?
Impact
tác động
Tổn thất lượng hóa bằng thời gian, chi phí, SLA hoặc chất lượng.
Success Metric
chỉ số thành công
Chỉ số đo lường cụ thể để xác định sự cải thiện.
Boundary
ranh giới
AI không được làm gì; khâu nào bắt buộc có con người.
Điểm AI can thiệp
decision · entry
AI hỗ trợ hoặc tự động hóa ở bước cụ thể nào?
Mức chọn
decision · level
Rule / Workflow / Agent?
Rủi ro & HITL
decision · safety
Phương án xử lý khi AI sai sót và quy trình phê duyệt thủ công.
PROBLEM STATEMENT · 9 TRƯỜNG
DAY 02 ·  53 / 64

## Slide 54

Ví dụ mẫu: Hỗ trợ Lab Coach/TA
— Một Problem Statement hoàn chỉnh làm căn cứ ra quyết định
Actor
Lab Coach hỗ trợ các nhóm học viên trong lớp 500 người.
Workflow
Học viên đặt câu hỏi → Lab Coach nghiên cứu ngữ cảnh → Phản hồi / yêu cầu làm rõ → Học viên cập nhật
bài.
Bottleneck
Câu hỏi trùng lặp hoặc thiếu thông tin nền tảng cao; Lab Coach mất thời gian phân loại thủ công.
Impact
Học viên chờ phản hồi lâu; Lab Coach quá tải, thiếu thời gian cho câu hỏi phức tạp.
Success Metric
Giảm tỷ lệ câu hỏi lặp duyệt thủ công; rút ngắn thời gian phản hồi trung bình; không tăng tỷ lệ định hướng sai.
Boundary
AI không tự đánh giá/chấm điểm bài; chỉ hỗ trợ gợi ý làm rõ và điều phối quy trình.
Điểm AI can thiệp
Ngay sau khi học viên gửi câu hỏi hoặc Problem Card thiếu thông tin ngữ cảnh.
Mức chọn
Workflow: AI phát hiện thông tin còn thiếu; Lab Coach phê duyệt câu hỏi chuyên sâu.
Rủi ro & HITL
AI định hướng sai → Lab Coach kiểm duyệt trước khi gửi phản hồi.
PROBLEM STATEMENT · VÍ DỤ
DAY 02 ·  54 / 64

## Slide 55

Từ Problem Statement đến Eval Plan
— Problem Statement rõ ràng giúp định hình cụ thể các tiêu chí kiểm thử
01 · INPUT
Problem Statement
9 trường đã hoàn chỉnh
02 · TEST CASES
Kịch bản kiểm thử
data + edge cases
Dữ liệu thực tế và các trường hợp biên
(Edge Cases).
03 · SUCCESS
Chỉ số hiệu năng
pass / fail / HITL
Đạt yêu cầu / Không đạt /
Chuyển tiếp kiểm duyệt thủ
công.
TÁC VỤ ĐƠN LẺ
Hệ thống có phân loại chính xác các
câu hỏi đầu vào không?
HIỆU NĂNG QUY TRÌNH
Nhóm học viên có hoàn thành bài lab
nhanh hơn và ít kẹt hơn không?
RỦI RO & SAI SỐ
Hệ thống có phản hồi sai lệch mà
không chuyển tiếp cho Lab
Coach phê duyệt không?
PROBLEM STATEMENT · EVAL PLAN
DAY 02 ·  55 / 64

## Slide 56

Chuyển dịch từ Problem Statement sang Eval Plan
— Phương pháp đánh giá, bộ dữ liệu mẫu và ngưỡng chấp nhận
PROBLEM STATEMENT · EVAL FLOW
DAY 02 ·  56 / 64

## Slide 57

Khung ra quyết định: Go / Not Yet / No-Go
— Lập luận dựa trên tính khả thi của Problem Statement, tránh thiên kiến công nghệ
Quyết định "Not Yet" thể hiện sự chín chắn trong tư duy thiết kế sản phẩm, không phải sự thất bại.
QUYẾT ĐỊNH · GO / NOT YET / NO-GO
DAY 02 ·  57 / 64
QUYẾT ĐỊNH
Go
thực hiện
ĐỦ ĐIỀU KIỆN
Bài toán rõ ràng.
—
Chỉ số đo lường khả thi.
—
Điểm can thiệp AI phù hợp.
—
Kiểm soát được rủi ro.
—
QUYẾT ĐỊNH
Not Yet
tạm hoãn
CÓ TRIỂN VỌNG
Cần bổ sung dữ liệu thực tế.
—
Chuẩn hóa quy trình.
—
Thiết lập chỉ số.
—
Xác định ranh giới.
—
QUYẾT ĐỊNH
No-Go
không triển khai
KHÔNG PHÙ HỢP
AI không mang giá trị vượt trội.
—
Rủi ro vận hành quá cao.
—
Giải pháp không dùng AI tối ưu hơn.
—

## Slide 58

06
S E C T I O N
Bài tập Lab ngày 02
Áp dụng khung lý thuyết đã học — Scan Problem (cá nhân) →
Tổng hợp & đánh giá (nhóm) → Quyết định. (40% cá nhân +
60% nhóm)
Hướng dẫn làm bài → github.com/VinUni-AI20k/Day02-AI-Product-Labs

## Slide 59

Tổng quan bài Lab: Deliverables
— Lộ trình 4 giờ: Cá nhân → Nhóm → Problem Statement → Quyết định AI
CÁ NHÂN · PROBLEM SCAN
PHASE 0 · 15 phút
Worked Example
Deliverable: hiểu một bài mẫu hoàn chỉnh
PHASE 1 · 25 phút
Individual Scan
Deliverable: 5+ problem candidates từ trải nghiệm
thật
PHASE 2 · 35 phút
Top 3 Problem Cards
Deliverable: 3 Problem Cards + draft workflow
trước/sau
NHÓM · DEEP DIVE
PHASE 3 · 30 phút
Group Convergence
Deliverable: 1 candidate problem được nhóm chọn
AI rule: không dùng AI để pitch/challenge thay mình
PHASE 4 · 30 phút
Validation + Research
Deliverable: tín hiệu kiểm chứng + research giải pháp đã có
PHASE 5 · 45 phút
Workflow + Problem Statement
Deliverable: workflow trước/sau + Problem Statement v0
PHASE 6 · 25 phút
Rule / Workflow / Agent + Decision
Deliverable: PS v1 + Go / Not Yet / No-Go
CÁ NHÂN · REFLECTION
PHASE 7 · 15 phút
Individual Reflection
Deliverable: reflection cá nhân về vai trò, cách dùng
AI, bài học
AI rule: không dùng AI viết thay reflection
DELIVERABLES
public repo Day02-MãHọcViên-HọVàTên
├── 01-individual-problem-scan/
├── 02-group-problem-statement/
└── 03-individual-reflection/
LAB · TỔNG QUAN
DAY 02 ·  59 / 64

## Slide 60

Giai đoạn 1 & 2: Phân kỳ và Hội tụ Cá nhân
— Khảo sát tối thiểu 5 bài toán thực tế, lựa chọn top 3 Problem Cards tối ưu
NGUỒN Design Council — Framework for Innovation
LAB · PHASE 1 & 2
DAY 02 ·  60 / 64

## Slide 61

Hướng dẫn xây dựng Workflow Diagram
— Phân tích chuyên sâu: Current-State và Future-State
LAB · WORKFLOW TEMPLATE
DAY 02 ·  61 / 64

## Slide 62

Worked Example: Báo cáo tuần trước và sau AI
— Current-State, Future-State, Ranh giới kiểm soát và Fallback
LAB · WORKED EXAMPLE
DAY 02 ·  62 / 64

## Slide 63

Sản phẩm bàn giao sau buổi Lab — Deliverables
public repo Day02-MãHọcViên-HọVàTên
├── 01-individual-problem-scan/
├── 02-group-problem-statement/
└── 03-individual-reflection/
01 · CÁ NHÂN
Individual Problem Scan
Khảo sát tối thiểu 5 bài toán thực tế,
chọn top 3 Problem Cards và phác thảo
quy trình trước/sau tối ưu cho cả 3 bài.
02 · NHÓM
Group Problem
Statement
Nhật ký hội tụ, kết quả khảo sát, sơ đồ
workflow trước/sau, Problem Statement
v0/v1, lập luận chọn cấp độ và quyết
định cuối.
03 · CÁ NHÂN
Individual Reflection
Vai trò cá nhân trong nhóm,
phương thức dùng AI hỗ trợ, bài
học kinh nghiệm và đề xuất cải
tiến.
HƯỚNG DẪN LÀM BÀI → GITHUB.COM/VINUNI-AI20K/DAY02-AI-PRODUCT-LABS
DAY 02 ·  63 / 64

## Slide 64

Năm nguyên tắc cốt lõi sau Day 02
— Kim chỉ nam để thẩm định mọi đề xuất ứng dụng AI
01
Brief mơ hồ không thay thế Problem Statement.
Một bản tóm tắt mơ hồ không thể thay thế cho một Problem Statement hoàn chỉnh.
02
Mô hình hóa workflow trước khi tích hợp AI.
Bắt buộc phải mô hình hóa quy trình trước khi xem xét tích hợp giải pháp AI.
03
Pain point phải được lượng hóa.
Mọi điểm đau cần được lượng hóa bằng baseline và chỉ số đo lường cụ thể.
04
Phức tạp không đồng nghĩa với hiệu quả.
Rule, Workflow và Agent là ba cấp độ khác nhau; độ phức tạp kỹ thuật không đồng nghĩa với hiệu quả
tối ưu.
05
Quyết định dựa trên lập luận thực tế.
Quyết định Go / Not Yet / No-Go phải được thiết lập dựa trên lập luận thực tế và số liệu kiểm thử rõ
ràng.
RECAP · 5 NGUYÊN TẮC
DAY 02 ·  64 / 64
