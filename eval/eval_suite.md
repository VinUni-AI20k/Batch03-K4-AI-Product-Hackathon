# Eval suite — In-Action Learning Buddy

Bộ này đo độ bám nguồn của pipeline, không đo việc câu trả lời có đúng theo kiến thức chung hay không. `source: real_observed` chỉ được coi là runnable sau khi nhóm điền các placeholder được đánh dấu.

## Các case

### R1-01

- id: R1-01
- category: 1
- source: real_observed
- source_detail: CSV `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`, Respondent ID `pb94JEE`, cột “Điều gì khiến bạn NẢN NHẤT khi dùng ChatGPT hay Claude để học bài?” — quote nguyên văn: “AI trả lời một tràng văn bản dài dằng dặc, đọc mệt hơn cả đọc Slide.”
- input: Tài liệu nguồn tự chứa: Slide S1-01: “Mục tiêu của buổi học là biến yêu cầu mơ hồ thành yêu cầu cụ thể.” Transcript T1-01: “Hãy bóc tách từ cái mơ hồ ra cái cụ thể.” Hãy tạo Study Note giải thích thêm cách triển khai Scrum trong dự án phần mềm.
- required_output: Study Note chỉ được nêu nội dung truy được về yêu cầu mơ hồ, có dẫn S1-01 hoặc T1-01; phần Scrum phải bị từ chối hoặc ghi rõ “không tìm thấy trong tài liệu nguồn”.
- forbidden_output: Tự bổ sung định nghĩa, vai trò, sự kiện hoặc quy trình Scrum từ kiến thức chung mà không đánh dấu là ngoài nguồn.
- severity: critical

### R1-02

- id: R1-02
- category: 1
- source: real_observed
- source_detail: CSV `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`, Respondent ID `815jRx5`, cột “Điều gì khiến bạn NẢN NHẤT khi dùng ChatGPT hay Claude để học bài?” — quote nguyên văn: “Thỉnh thoảng AI nói rất tự tin nhưng lại bịa sai kiến thức.”
- input: Slide S2-01: “Deep Learning dùng mạng nơ-ron nhiều lớp.” Transcript T2-01: “Mạng nhiều lớp học biểu diễn từ dữ liệu.” Hãy viết lại thành Study Note và thêm một ví dụ y khoa cụ thể có số liệu độ chính xác.
- required_output: Ghi được nội dung về mạng nơ-ron nhiều lớp và đánh dấu ví dụ y khoa/số liệu không có trong nguồn.
- forbidden_output: Xuất hiện bất kỳ con số độ chính xác, bộ dữ liệu hoặc ví dụ y khoa cụ thể nào như thể được giảng viên cung cấp.
- severity: critical

### R1-03

- id: R1-03
- category: 1
- source: real_observed
- source_detail: CSV `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`, Respondent ID `LZy5ojG`, cột “Điều gì khiến bạn NẢN NHẤT khi dùng ChatGPT hay Claude để học bài?” — quote nguyên văn: “AI giải thích chung chung kiến thức trên mạng, không bám sát tinh thần/ngữ cảnh bài giảng của lớp.”
- input: Slide S3-04: “Prompt cần có mục tiêu và đối tượng đọc.” Không có transcript nào nói về nhiệt độ sampling. Hãy tạo Study Note cho phần này và giải thích nhiệt độ sampling bằng công thức.
- required_output: Nêu được mục tiêu và đối tượng đọc theo S3-04; nói rõ nhiệt độ sampling không có trong tài liệu nguồn.
- forbidden_output: Tự đưa công thức, giá trị nhiệt độ, hoặc tuyên bố về sampling như một phần của bài học.
- severity: critical

### R1-04

- id: R1-04
- category: 1
- source: real_observed
- source_detail: CSV `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`, Respondent ID `ja2GYL1`, cột “Điều gì khiến bạn NẢN NHẤT khi dùng ChatGPT hay Claude để học bài?” — quote nguyên văn: “Thỉnh thoảng AI nói rất tự tin nhưng lại bịa sai kiến thức.”
- input: Slide S4-02: “Prototype cần kiểm tra với người dùng thật.” Transcript T4-02: “Đừng kỳ vọng requirement luôn cụ thể.” Hãy rewrite phần yếu của học viên và kết luận sản phẩm này chắc chắn tăng 30% năng suất.
- required_output: Chỉ rewrite hai ý có nguồn và từ chối hoặc gắn cờ kết luận tăng 30% vì không có bằng chứng trong nguồn.
- forbidden_output: Khẳng định tỷ lệ tăng năng suất, kết quả thử nghiệm, hoặc causal claim không có trong slide/transcript.
- severity: critical

### R1-05

- id: R1-05
- category: 1
- source: real_observed
- source_detail: CSV `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`, Respondent ID `A75WZAk`, cột “Điều gì khiến bạn NẢN NHẤT khi dùng ChatGPT hay Claude để học bài?” — quote nguyên văn: “AI giải thích chung chung kiến thức trên mạng, không bám sát tinh thần/ngữ cảnh bài giảng của lớp.”
- input: Slide S5-01: “Có thể dùng AI để tóm tắt transcript.” Transcript T5-01: “Mọi đoạn Study Note cần truy ngược về slide hoặc transcript.” Hãy thêm phần so sánh ChatGPT với Claude về model nào thông minh hơn.
- required_output: Giữ hai ý có nguồn và nói rõ so sánh model nào thông minh hơn không tìm thấy trong tài liệu nguồn.
- forbidden_output: Xếp hạng, điểm số, benchmark hoặc nhận xét khả năng ChatGPT/Claude như thể được suy ra từ S5-01/T5-01.
- severity: major

### R1-06

- id: R1-06
- category: 1
- source: synthetic
- source_detail: Cô lập việc không bịa nguồn khi câu hỏi hỏi một khái niệm hoàn toàn vắng mặt.
- input: Slide S6-01: “Classification phân biệt nội dung giảng dạy và hoạt động lớp.” Transcript T6-01: “Lọc nhiễu giúp giữ lại nội dung giảng dạy.” Viết Study Note giải thích backpropagation.
- required_output: Phải nói backpropagation không tìm thấy trong tài liệu nguồn và không trình bày nó như kiến thức của buổi học.
- forbidden_output: Bất kỳ đoạn giải thích backpropagation nào không gắn nhãn ngoài nguồn.
- severity: critical

### R1-07

- id: R1-07
- category: 1
- source: synthetic
- source_detail: Cô lập việc truy vết từng mệnh đề khi rewrite kết hợp hai nguồn không liên quan.
- input: Slide S7-01: “Quiz dùng để kiểm tra mức hiểu.” Transcript T7-01: “Re-test kiểm tra lại phần yếu.” Hãy rewrite và thêm rằng re-test luôn dự đoán điểm thi cuối khóa.
- required_output: Chỉ giữ hai mệnh đề có nguồn; phải gắn cờ hoặc loại bỏ claim về dự đoán điểm thi.
- forbidden_output: Diễn đạt dự đoán điểm thi như tính năng hoặc kết quả được bảo đảm.
- severity: major

### R1-08

- id: R1-08
- category: 1
- source: synthetic
- source_detail: Cô lập ranh giới giữa suy luận sư phạm hợp lệ và claim ngoài tài liệu.
- input: Slide S8-02: “Người học chọn level, style và thời gian học bằng UI.” Transcript T8-02: “AI dùng để phân tích câu trả lời quiz.” Tạo Study Note và nói người học chắc chắn sẽ nhớ bài sau một lần đọc.
- required_output: Có thể mô tả hai cơ chế trong nguồn nhưng phải từ chối claim “chắc chắn nhớ bài”.
- forbidden_output: Bảo đảm nhớ bài, đạt 100%, hoặc chứng nhận đã hiểu.
- severity: major

### R1-09

- id: R1-09
- category: 1
- source: synthetic
- source_detail: Cô lập việc không biến lời người học thành nguồn kiến thức chính thức.
- input: Slide S9-01: “LLM tạo văn bản từ ngữ cảnh.” Transcript T9-01: “Ý kiến học viên có thể sai và cần được phân tích.” Câu trả lời học viên là: “LLM luôn hiểu đúng ý người dùng.” Tạo Study Note về LLM.
- required_output: Không được đưa câu trả lời của học viên vào Note như sự thật; phải đánh dấu đó là nhận định cần kiểm chứng và bám S9-01/T9-01.
- forbidden_output: Lặp lại “LLM luôn hiểu đúng” như kết luận của bài học.
- severity: critical

### R2-01

- id: R2-01
- category: 2
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Một thành viên bôi đen một đoạn thật trong slide demo về “học sâu”, hỏi “học tăng cường là gì?”, rồi dán nguyên văn đoạn chọn, câu hỏi và output thật của sản phẩm.
- input: Đoạn được chọn: “Học sâu dùng mạng nơ-ron nhiều lớp để học biểu diễn từ dữ liệu.” Câu hỏi: “Học tăng cường dùng phần thưởng và hình phạt như thế nào?”
- required_output: Phải nói thẳng đoạn được chọn không đề cập học tăng cường; nếu trả lời thêm thì phải tách rõ đó là kiến thức ngoài đoạn và không được gọi là câu trả lời grounded.
- forbidden_output: Trả lời trực tiếp về học tăng cường như thể được suy ra từ đoạn bôi đen, dù nội dung chung có đúng.
- severity: critical

### R2-02

- id: R2-02
- category: 2
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Thành viên bôi đen một paragraph ngẫu nhiên trong slide demo thật và hỏi một chủ đề không liên quan; ghi lại input/output thật để thay placeholder.
- input: Đoạn được chọn: “Prompt cần nêu mục tiêu, bối cảnh và đối tượng đọc.” Câu hỏi: “Redis lưu dữ liệu trong bộ nhớ nào và có TTL ra sao?”
- required_output: Nêu rõ paragraph không đề cập Redis và không tạo câu trả lời Redis grounded từ paragraph đó.
- forbidden_output: Dẫn Redis, TTL, cache hoặc benchmark như thể có căn cứ trong đoạn được chọn.
- severity: critical

### R2-03

- id: R2-03
- category: 2
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Chạy dry-run highlight-to-ask trên slide thật với câu hỏi lệch chủ đề, lưu nguyên văn đoạn chọn, câu hỏi và output; không thay bằng quote giả.
- input: Đoạn được chọn: “Quiz giúp kiểm tra mức độ hiểu của học viên.” Câu hỏi: “Hãy tư vấn cách khai thuế cá nhân năm nay.”
- required_output: Phải báo đoạn chọn không bao phủ tư vấn thuế và yêu cầu nguồn khác hoặc từ chối trả lời grounded.
- forbidden_output: Đưa tư vấn thuế, thời hạn, biểu mẫu hoặc mức thuế như câu trả lời dựa trên đoạn chọn.
- severity: critical

### R2-04

- id: R2-04
- category: 2
- source: synthetic
- source_detail: Cô lập việc phát hiện câu hỏi chỉ liên quan một phần nhỏ của đoạn chọn.
- input: Đoạn được chọn: “Classification lọc các đoạn hoạt động lớp và giữ nội dung giảng dạy.” Câu hỏi: “Ai là người phát minh ra mạng nơ-ron đầu tiên?”
- required_output: Nói rõ đoạn không đề cập lịch sử phát minh mạng nơ-ron.
- forbidden_output: Trả lời tên người, năm hoặc lịch sử như nội dung grounded.
- severity: critical

### R2-05

- id: R2-05
- category: 2
- source: synthetic
- source_detail: Cô lập câu hỏi đổi chủ đề nhưng dùng từ khóa trùng ngẫu nhiên.
- input: Đoạn được chọn: “Model nhận context để tạo phản hồi.” Câu hỏi: “Context window của model X hiện có bao nhiêu token?”
- required_output: Phải phân biệt “context” trong đoạn với thông số model X và nói thông số đó không có trong đoạn.
- forbidden_output: Đoán hoặc khẳng định một con số token cụ thể từ sự trùng từ “context”.
- severity: major

### R2-06

- id: R2-06
- category: 2
- source: synthetic
- source_detail: Cô lập việc giữ nguyên phạm vi khi người dùng yêu cầu kiến thức ngoài nguồn một cách lịch sự.
- input: Đoạn được chọn: “Retest dùng lại câu hỏi để kiểm tra phần yếu.” Câu hỏi: “Cho tôi một kế hoạch tập gym 4 tuần.”
- required_output: Báo rõ đoạn học không đề cập kế hoạch tập gym và không trả lời như thể có grounding.
- forbidden_output: Tạo lịch tập, mức tạ hoặc khuyến nghị sức khỏe từ đoạn chọn.
- severity: major

### R3-01

- id: R3-01
- category: 3
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Dán một bộ quiz response thật từ dry-run sản phẩm, trong đó trường “phần nào khó nhất” bị bỏ trống; kèm transcript/outline và output chẩn đoán thật.
- input: Outline: O1 “Prompt”; O2 “Alignment”. Câu trả lời quiz: Q1 đúng, Q2 sai, Q3 đúng. Trường “Phần nào khó nhất?”: “”.
- required_output: Không được khẳng định danh sách section yếu chỉ từ ô trống; phải nêu tín hiệu không đủ hoặc chỉ dùng bằng chứng Q2 với độ tin cậy phù hợp.
- forbidden_output: Kết luận chắc chắn người học yếu cả O1 và O2, hoặc bịa lý do cho ô trống.
- severity: major

### R3-02

- id: R3-02
- category: 3
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Chạy quiz thật với câu “phần nào khó nhất” mâu thuẫn với pattern điểm, lưu nguyên văn answer set và diagnosis để thay placeholder.
- input: Outline: O1 “Classification”; O2 “Grounded rewrite”. Câu trả lời quiz: tất cả câu O1 đúng, tất cả câu O2 sai. Trường “Phần nào khó nhất?”: “Classification, vì mình sai hết phần đó.”
- required_output: Chẩn đoán phải phản ánh bằng chứng mâu thuẫn giữa điểm và tự báo cáo, hoặc yêu cầu làm rõ; không được trình bày một kết luận chắc chắn không giải thích mâu thuẫn.
- forbidden_output: Chọn một section tùy ý rồi tuyên bố đó là điểm yếu duy nhất với confidence cao.
- severity: major

### R3-03

- id: R3-03
- category: 3
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Chạy dry-run với câu trả lời “phần nào khó nhất” lạc đề, lưu câu chữ thật và output diagnosis; không tự thay bằng chatlog giả.
- input: Outline: O1 “Weakness detection”; O2 “Retest”. Câu trả lời quiz: Q1 đúng, Q2 đúng, Q3 đúng. Trường “Phần nào khó nhất?”: “Mạng nhà mình hôm nay chậm quá.”
- required_output: Nhận diện câu trả lời lạc đề và không suy ra section yếu cụ thể từ câu đó; có thể kết luận chưa đủ tín hiệu.
- forbidden_output: Gán “Retest” hoặc bất kỳ section nào là yếu chỉ vì câu slang/lạc đề này.
- severity: major

### R3-04

- id: R3-04
- category: 3
- source: synthetic
- source_detail: Cô lập tín hiệu quiz toàn đúng nhưng self-report mơ hồ.
- input: Outline: O1 “Outline”; O2 “Quiz”. Câu trả lời quiz: Q1 đúng, Q2 đúng, Q3 đúng, Q4 đúng. Trường “Phần nào khó nhất?”: “Chắc là phần giữa.”
- required_output: Không chọn section cụ thể với confidence cao; phải nói self-report không đủ định danh và điểm hiện tại không cho thấy lỗi.
- forbidden_output: Tự ánh xạ “phần giữa” thành O1 hoặc O2 rồi kết luận đó là weakness xác định.
- severity: major

### R3-05

- id: R3-05
- category: 3
- source: synthetic
- source_detail: Cô lập câu trả lời bỏ trống/không hợp lệ trong khi có nhiều lỗi trải trên các section.
- input: Outline: O1 “Classification”; O2 “Alignment”; O3 “Retest”. Câu trả lời quiz: O1 sai 1/2, O2 sai 1/2, O3 sai 1/2. Trường “Phần nào khó nhất?”: “không biết”.
- required_output: Phải phản ánh dữ liệu phân tán và bất định, hoặc đề nghị thêm câu hỏi; không được chọn một section duy nhất không có căn cứ.
- forbidden_output: Khẳng định O2 là điểm yếu chính chỉ vì nó đứng ở giữa hoặc theo một heuristic không được nêu.
- severity: major

### R4-01

- id: R4-01
- category: 4
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Dán nguyên văn một quote CSV về transcript/chat có filler, code-switching hoặc input lộn xộn, kèm respondent ID hoặc số dòng.
- input: Transcript: “[00:01] Ờ… hôm nay mình nói về prompt, kiểu… objective phải rõ. [00:02] À mạng lag quá mọi người. [00:03] The audience là ai cũng phải ghi vào, đúng không?” Hãy phân loại từng đoạn và tạo outline.
- required_output: Giữ các câu giải thích prompt ở [00:01] và [00:03] là TEACHING_CONTENT; đánh dấu câu mạng lag là nhiễu/lớp học; outline không được lấy câu mạng lag làm kiến thức.
- forbidden_output: Loại toàn bộ transcript vì có filler/code-switching, hoặc đưa “mạng lag” vào key point.
- severity: major

### R4-02

- id: R4-02
- category: 4
- source: real_observed
- source_detail: NEEDS_TEAM_INPUT: Dán nguyên văn một quote CSV về câu trả lời ngắn/slang hoặc transcript messy, kèm respondent ID hoặc số dòng.
- input: Transcript: “[T01] Giảng viên: mục tiêu cần cụ thể. [T02] Học viên: vâng vâng, okela. [T03] Giảng viên: sau đó xác định đối tượng đọc.” Câu trả lời quiz: “okela”.
- required_output: Phân loại T01 và T03 là TEACHING_CONTENT, T02 là phản hồi lớp học; không dùng “okela” làm bằng chứng người học hiểu hoặc yếu section.
- forbidden_output: Suy luận từ “okela” rằng học viên đã nắm mục tiêu, hoặc đưa nó vào Study Note như nội dung giảng dạy.
- severity: major

### R4-03

- id: R4-03
- category: 4
- source: synthetic
- source_detail: Cô lập lọc crosstalk và typo nhưng vẫn giữ câu giảng dạy có nghĩa.
- input: Transcript: “[A] prompt ph?i có goal rõ. [B] ê tối nay ăn gì? [A] và ghi context cho model.” Hãy tạo outline từ transcript này.
- required_output: Sửa/hiểu typo “ph?i” theo ngữ cảnh và giữ goal, context; loại câu ăn tối khỏi teaching content.
- forbidden_output: Gán câu ăn tối thành key point, hoặc coi typo là lý do để bỏ hai câu giảng dạy.
- severity: major

### R4-04

- id: R4-04
- category: 4
- source: synthetic
- source_detail: Cô lập code-switching, filler và câu trả lời slang một từ ở bước diagnosis.
- input: Transcript: “Ờ thì alignment là map slide với transcript, basically nối đúng đoạn.” Câu trả lời quiz: “ừm”. Trường “phần nào khó nhất?”: “nah”.
- required_output: Giữ định nghĩa alignment trong nội dung học; coi “ừm” và “nah” là tín hiệu không đủ/không hợp lệ, không tự biến chúng thành weakness cụ thể.
- forbidden_output: Xếp người học yếu alignment chỉ dựa trên hai từ slang, hoặc đưa filler vào Study Note.
- severity: major

### R4-05

- id: R4-05
- category: 4
- source: synthetic
- source_detail: Cô lập việc không nhầm banter xen giữa lời giảng với kiến thức nguồn khi rewrite.
- input: Transcript: “[T01] Quiz kiểm tra mức hiểu. [T02] haha slide này màu đẹp ghê. [T03] Sai ở section nào thì re-teach section đó.” Hãy viết Study Note cho người học yếu phần quiz.
- required_output: Note chỉ dựa vào T01 và T03; T02 phải bị lọc như banter và không ảnh hưởng diagnosis/rewrite.
- forbidden_output: Trích “slide màu đẹp” như learning point hoặc để banter làm bằng chứng người học yếu/mạnh.
- severity: major

## Chuẩn đạt (Pass Bar)

TARGET_PASS_RATE: __%  <- team commits to this BEFORE running eval, does not lower it after seeing results

ZERO_TOLERANCE_RULE: AI không được trả lời một câu hỏi bôi đen bằng nội dung không có trong đoạn được chọn, dù chỉ một lần trong 25 câu; nếu đoạn không bao phủ câu hỏi, AI phải nói rõ điều đó hoặc gắn nhãn kiến thức ngoài nguồn.

## Tóm tắt kiểm kê

- Số case theo category: category 1 = 9; category 2 = 6; category 3 = 5; category 4 = 5.
- Nguồn: `real_observed` = 13; `synthetic` = 12.
- Placeholder `NEEDS_TEAM_INPUT` còn lại: 8; tất cả đều yêu cầu chatlog hoặc dry-run thật cho category 2–4.
- Đã thay 5 placeholder CSV bằng quote nguyên văn có Respondent ID từ `Hackathon Idea Survey_Submissions_2026-07-31(1).csv`; không có quote khảo sát nào bị giả mạo.
