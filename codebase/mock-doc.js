/* ============================================================================
   mock-doc.js — Tài liệu giả lập "day05-ai-product-thinking-requirements.pdf"
   44 trang, dùng làm nguồn retrieval (mock) cho VLearn Tutor trong prototype.
   Nội dung tự soạn (không lấy nguyên văn từ data pack thật của khoá) —
   đúng luật "chỉ dùng data trong data/ hoặc data giả tự sinh".
   Mỗi mục: {page, section, key[] (từ khoá để mock-retrieval match), text}
   ============================================================================ */
window.MOCK_CORPUS = [

  {page:2, section:"Mở đầu", key:["product thinking","tư duy sản phẩm","dog food","user không dùng","agent không ai dùng"],
   text:"Câu hỏi mở đầu buổi: một agent AI được xây rất đẹp về mặt kỹ thuật — code sạch, latency thấp, benchmark cao — nhưng ra mắt xong không ai dùng. Tại sao? Kinh nghiệm thực tế cho thấy lý do hiếm khi nằm ở kỹ thuật. Nó nằm ở việc agent có thực sự giải quyết một công việc (job) có thật của người dùng hay không, và trải nghiệm tương tác có phù hợp với cách người dùng nghĩ hay không. Đây là điểm chuyển từ tư duy kỹ thuật thuần túy (model có chạy đúng không) sang tư duy sản phẩm (người dùng có quay lại dùng lần hai không)."},

  {page:3, section:"Nội dung bài học", key:["nội dung bài học","8 phần","product thinking","responsible ai","requirements engineering"],
   text:"Nội dung Ngày 5 gồm 8 phần: (1) Product Thinking cho AI, (2) Responsible AI Fundamentals, (3) User Research cho AI products, (4) Requirements Engineering, (5) PRD anatomy cho AI products, (6) User stories cho AI, (7) Risk register và go/no-go, (8) Lab 5 và deliverable cuối buổi."},

  {page:4, section:"Mục tiêu", key:["mục tiêu","kiểm chứng được","4 lớp chỗ khó","phân biệt tư duy"],
   text:"Ba mục tiêu học tập của buổi: phân biệt được tư duy kỹ thuật thuần túy với tư duy sản phẩm; viết được một requirement kiểm chứng được cho một tính năng AI cụ thể; nhận diện được 4 lớp chỗ khó (nguồn sự thật, mơ hồ, ngoài phạm vi, đặc thù domain) trước khi bắt tay build, thay vì phát hiện ra chúng sau khi đã ship."},

  {page:8, section:"Product Thinking", key:["job to be done","jtbd","công việc cần làm","verb object"],
   text:"Product Thinking bắt đầu từ câu hỏi: người dùng đang cố hoàn thành công việc gì (Job To Be Done), không phải sản phẩm của mình có tính năng gì. Một job statement viết đúng có dạng verb + object + bối cảnh, và không được nhắc tên sản phẩm hay AI trong câu. Phép kiểm tra nhanh: bỏ chữ AI ra khỏi câu, nếu công việc đó vẫn còn tồn tại và có người làm bằng cách khác (thủ công, hỏi bạn, tra Google) thì đó là job thật; nếu công việc biến mất khi bỏ AI đi thì đang tìm chỗ nhét AI chứ chưa tìm ra pain thật."},

  {page:11, section:"Product Thinking", key:["alternative","giải pháp thay thế","đang làm gì hôm nay","tại sao chưa bỏ"],
   text:"Trước khi đề xuất AI, phải trả lời được: hôm nay người dùng đang giải quyết job đó bằng cách nào (tua lại video, hỏi bạn học, dùng ChatGPT cá nhân, bỏ qua luôn), giải pháp đó fail ở đâu cụ thể, và vì sao đến giờ họ vẫn chưa bỏ giải pháp đó. Nếu không trả lời được câu cuối, nghĩa là chưa hiểu đủ sâu về pain — rất dễ build nhầm sang một pain khác nhẹ hơn."},

  {page:14, section:"Product Thinking", key:["impact","bảng impact","bao nhiêu người","tần suất","tốn gì"],
   text:"Khi có nhiều hơn một ứng viên bài toán, dùng bảng impact để chọn: mỗi ứng viên một dòng, ghi rõ bao nhiêu người gặp (lấy từ bằng chứng, không phải cảm giác), tần suất gặp (mỗi ngày, mỗi tuần, mỗi khóa), mỗi lần gặp tốn gì (bao nhiêu phút, mất điểm hay mất niềm tin), và có build nổi trong thời gian sự kiện không. Ứng viên bị loại phải được giữ lại kèm lý do — người chấm cần thấy quá trình cân nhắc, không chỉ kết quả cuối."},

  {page:20, section:"Responsible AI", key:["responsible ai","có trách nhiệm","4 trụ cột","fairness","minh bạch","transparency","quyền kiểm soát","trách nhiệm giải trình"],
   text:"Responsible AI Fundamentals xoay quanh bốn trụ cột. Một, minh bạch (transparency): người dùng phải biết mình đang tương tác với AI, và biết rõ giới hạn năng lực của nó — câu đầu tiên user thấy nên nói đúng phạm vi hệ thống làm được gì. Hai, công bằng (fairness): hệ thống không được thiên lệch theo bất kỳ nhóm người dùng nào, dù nhóm đó là thiểu số trong dữ liệu huấn luyện. Ba, quyền kiểm soát (control): người dùng luôn bỏ qua được gợi ý của AI, và sửa được kết quả một cách dễ dàng, không bị AI ép phải chấp nhận. Bốn, trách nhiệm giải trình (accountability): mọi quyết định của hệ thống phải truy ngược được về lý do — vì sao nó trả lời như vậy, dựa trên căn cứ nào."},

  {page:23, section:"Responsible AI", key:["cost of error","chi phí sai","sai thì ai chịu","sửa đắt hay rẻ","augment","conditional","automate"],
   text:"Mức độ tự động hóa (automation level) của một tính năng AI phải được chọn theo nguyên tắc cost-of-error — sai thì ai chịu hậu quả, và sửa lỗi đó đắt hay rẻ — chứ không phải chọn theo mức độ tiện lợi. Có ba mức: Augment (AI chỉ gợi ý, con người ra quyết định cuối) dùng khi sai thì đắt, ví dụ kiến thức sai đến tay học viên hoặc ảnh hưởng điểm số. Conditional (AI tự làm ở case chắc chắn, chuyển người ở case mơ hồ) dùng khi phần lớn case lành nhưng số ít case rất hiểm. Automate (AI tự làm toàn bộ) chỉ dùng khi sai thì rẻ và người dùng tự phát hiện, tự sửa được ngay."},

  {page:24, section:"User Research", key:["user research","phỏng vấn","khảo sát","jtbd","job","lần gần nhất","hỏi ý kiến"],
   text:"User Research cho AI products nên hỏi về lần gần nhất thay vì hỏi ý kiến chung chung. Ví dụ câu hỏi tốt: 'lần gần nhất bạn muốn xem lại một đoạn bài giảng, bạn đã làm gì và mất bao lâu?'. Câu hỏi cần tránh: 'bạn có cần tính năng X không?' — vì gần như ai cũng trả lời có, và dữ liệu thu được từ dạng câu hỏi này không dùng làm bằng chứng được, do nó đo mong muốn giả định chứ không đo hành vi thật."},

  {page:27, section:"User Research", key:["mining","chatlog","đếm được","ví dụ nguyên văn","phương pháp đếm"],
   text:"Có hai đường thu bằng chứng. Đường A là khảo sát: cần ít nhất 20 người ngoài nhóm, ít nhất 50% xác nhận pain, và log đầy đủ câu hỏi cùng từng câu trả lời nguyên văn. Đường B là mining dữ liệu có sẵn (chatlog, log hệ thống): cần một con số đếm được cụ thể, kèm ít nhất 5 ví dụ nguyên văn minh họa, và một phương pháp đếm mà người khác kiểm tra lại được — nghĩa là phải nói rõ đếm cái gì, trên bao nhiêu mẫu, và quy tắc xếp loại một trường hợp là 'đạt tiêu chí' hay không."},

  {page:31, section:"Requirements Engineering", key:["requirements engineering","requirement","yêu cầu","kiểm chứng","acceptance","đo được"],
   text:"Requirements Engineering cho một AI feature nghĩa là biến một ý tưởng mơ hồ thành một phát biểu kiểm chứng được (verifiable). Một requirement đạt chuẩn phải nêu rõ: ai là người dùng, trong tình huống cụ thể nào, hệ thống phải làm gì, và điều kiện nghiệm thu đo lường được là gì. Phát biểu 'AI trả lời tốt hơn' không phải là một requirement vì không đo được. Phát biểu '100% câu trả lời phải trace được về đúng trang tài liệu nguồn' là một requirement, vì có thể kiểm tra pass/fail trên từng case cụ thể."},

  {page:33, section:"Requirements Engineering", key:["4 lớp chỗ khó","nguồn sự thật","mơ hồ","ngoài phạm vi","đặc thù domain","taxonomy"],
   text:"Bốn lớp chỗ khó (taxonomy) cần soi kỹ trước khi build bất kỳ tính năng AI nào. Lớp một, nguồn sự thật: chỗ nào AI có thể bịa ra thông tin không có căn cứ, và khi không có căn cứ thì hệ thống phải làm gì thay vì đoán liều. Lớp hai, mơ hồ hoặc thiếu thông tin: khi input của người dùng không đủ rõ ràng, hệ thống nên hỏi lại một câu, đoán kèm cảnh báo, hay từ chối trả lời. Lớp ba, ngoài phạm vi hoặc thẩm quyền: khi người dùng đòi hỏi một việc hệ thống không được phép làm, cách từ chối thế nào để vẫn hữu ích chứ không cụt lủn. Lớp bốn, đặc thù domain: sai ở điểm nào thì người dùng mất điểm, mất niềm tin, hoặc học sai kiến thức ngay lập tức, không có cơ hội tự phát hiện."},

  {page:36, section:"PRD Anatomy", key:["prd","anatomy","spec","non-goal","lát cắt một câu"],
   text:"Cấu trúc (anatomy) của một PRD cho AI feature gồm: lát cắt một câu (một người dùng, một công việc, một quyết định AI, một kết quả); danh sách non-goals — ít nhất ba việc chủ động không làm trong phạm vi này; mức automation kèm lý do theo cost-of-error; và hành vi cụ thể của hệ thống khi nó không chắc chắn về câu trả lời của chính mình."},

  {page:39, section:"User Stories", key:["user story","story","as a","4 đường đi","happy path","low-confidence","correction"],
   text:"User story cho một AI feature khác với user story thông thường ở chỗ phải mô tả đủ bốn đường đi trải nghiệm, không chỉ đường thành công. Bốn đường đó là: happy path (mọi thứ diễn ra suôn sẻ), low-confidence (hệ thống không chắc và phải xử lý phù hợp thay vì trả lời liều), failure hoặc không có căn cứ (hệ thống phải nói rõ giới hạn thay vì bịa), và correction (người dùng phát hiện sai và cần sửa lại dễ dàng, không bị chặn flow)."},

  {page:42, section:"Risk Register", key:["risk register","risk","go/no-go","rủi ro","mức nghiêm trọng"],
   text:"Risk register (sổ rủi ro) liệt kê từng kịch bản lỗi có thể xảy ra, gán cho mỗi kịch bản một mức độ nghiêm trọng và một hành vi mong muốn cụ thể (nói gì, hiển thị gì, cho người dùng làm gì tiếp theo). Trước khi go-live, nhóm cần chốt điều kiện go/no-go dựa trên risk register này — không phải dựa trên cảm giác 'chắc ổn'."},

  {page:44, section:"Lab 5", key:["lab 5","deliverable","cuối buổi","bài tập"],
   text:"Lab 5 và deliverable cuối buổi: mỗi nhóm áp dụng toàn bộ framework (job statement, bảng impact, 4 lớp chỗ khó, PRD một trang) vào chính bài toán mà nhóm đang chọn cho hackathon, và trình bày lại trong 5 phút cuối giờ."},

  /* --- Nội dung tham chiếu kỹ thuật, dùng để test lớp ① nguồn sự thật & câu hỏi ngoài phạm vi bài học --- */
  {page:65, section:"Phụ lục kỹ thuật (buổi khác)", key:["memory","bộ nhớ","history","lịch sử","stateless","liền mạch","context window"],
   text:"(Ghi chú tham khảo từ buổi kỹ thuật khác — không thuộc nội dung chính Ngày 5): Một mô hình ngôn ngữ (LLM) tự thân là stateless, tức không lưu trạng thái giữa các lần gọi. Một chatbot duy trì được sự liền mạch trong hội thoại là nhờ lớp ứng dụng bao quanh tự lưu giữ lịch sử (history): mỗi lượt mới được nối vào lịch sử hiện có, toàn bộ lịch sử đó được gửi lại cho model, và phản hồi mới lại được nối tiếp vào lịch sử để chuẩn bị cho lượt sau."},

  {page:68, section:"Phụ lục kỹ thuật (buổi khác)", key:["lstm","long short-term memory","rnn","transformer"],
   text:"(Ngoài phạm vi nội dung Ngày 5 — chủ đề này thuộc học phần Deep Learning, không nằm trong tài liệu buổi học hiện tại của lớp AI Product Thinking & Requirements.)"}
];
