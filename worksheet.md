
# Worksheet B1 — Chân dung user & Jobs To Be Done

**Nhóm:** Venture Arena Team B · **Hướng:** [ ] A — VLearn [x] B — Trợ lý Học viên [ ] C — Làn mở  
> Quy tắc xuyên suốt: **không rõ job thì đừng bàn feature.**
> File này điền trực tiếp và nộp kèm trong repo — nó là phần đầu vào của Phiếu nghiệm thu CP1.  

## 1. Chọn job executor *(5')*  
Job executor = người **trực tiếp** dùng giải pháp để hoàn thành job. Không phải "học viên nói chung" — chọn một vai cụ thể.  
**Job executor của nhóm:** Học viên đang tham gia chuỗi bài giảng/chương trình đào tạo dài hạn
**Vì sao là người này:** Đây là nhóm người dùng chịu áp lực lớn nhất về mặt thời gian, phải tiếp nhận thông tin học tập, bài tập, lịch học dồn dập từ nhiều kênh phân mảnh (Email, Discord, Zalo) đồng thời có nhu cầu cao trong việc xem lại các tài liệu/đoạn video bài giảng cũ để thực hành prototype.

## 2. Vẽ workflow thật của họ *(10')*  
Hành trình của job executor xoay quanh luồng thông tin học tập:  

| Chặng | Họ đang cố làm gì? | Hôm nay họ dùng gì? | Kẹt ở đâu? | Mức đau |
|---|---|---|---|---|
| **Trước buổi** | Kiểm tra xem hôm nay có lịch học đột xuất, thay đổi phòng học, hay link Zoom mới không. | Mở Discord lướt kênh chung, mở Gmail kiểm tra hộp thư đến. | Tin nhắn thông báo khẩn cấp bị trôi do spam chat; email dễ rơi vào mục Quảng cáo/Spam. | **H** |
| **Ngay sau buổi** | Xác định lại các thời hạn (deadline) nộp bài tập lớn và yêu cầu kỹ thuật đi kèm. | Mở LMS hệ thống riêng, mở nhóm chat Zalo để dò lại lời dặn của giảng viên. | Thông tin deadline nằm rải rác: yêu cầu ở mail, thông báo đổi ngày ở Discord, link nộp ở LMS. | **H** |
| **Khi ôn lại** | Mở link Drive tổng hợp, tua video qua lại thủ công hoặc hỏi bạn cùng nhóm. | Mất 15-30 phút tua video mò mẫm, dễ nản và bỏ cuộc nếu không tìm thấy đoạn giải thích. | **H** |  

**Hai chỗ đau nhất trong workflow:** 
1. `#1` Quá tải và sót thông báo/deadline do luồng thông tin bị phân mảnh cực nặng trên 3-4 nền tảng (Email, Discord, Zalo, LMS).  
2. `#2` Mất quá nhiều thời gian tra cứu, lội ngược dòng chat hoặc tua video bài giảng cũ chỉ để tìm lại một mốc kiến thức/link nguồn cụ thể.  

**Bằng chứng ban đầu cho 2 chỗ này:** Từ số liệu mining thực tế trên `n = 35` học viên và log khảo sát nguyên văn:
- 82.8% học viên mất từ 15-30 phút/ngày để đảo qua các nền tảng check thông tin.
- Quote bằng chứng: *"Lần gần nhất tìm link video record là phải lướt ngược tin nhắn ghim trên Discord, tua qua tua lại trong Drive mất hơn 20 phút."*

## 3. Viết core JTBD *(7')*  
**Core JTBD bản nháp:** ~~Dùng AI Agent để quét tự động thông báo Discord và Gmail giúp học viên không bị lỡ deadline.~~  
**Từ solution lỡ nhét vào (gạch bỏ):** ~~AI Agent, quét tự động, Discord, Gmail~~  
**Core JTBD bản chốt:** Bao quát và nắm bắt kịp thời toàn bộ dòng thời gian, thời hạn công việc và biến động lịch trình học tập từ nhiều nguồn phân mảnh để tối ưu hóa thời gian chuẩn bị bài.  

## 4. Ba job stories *(7')*  

| # | When (Trigger) | I want to (Motivation) | So I can (Outcome) | Story này cho thấy gì |
|---|---|---|---|---|
| **JS1** | Khi Ban tổ chức đột xuất đẩy sớm thời hạn nộp bài tập lớn lên 2 ngày trên kênh Discord. | Tôi muốn nhận được một thông báo xác nhận lịch điều chỉnh tức thì ở một nơi tập trung. | Tránh việc bị trừ điểm oan uổng do không kịp check tin nhắn trôi. | Nỗi đau về tính kịp thời của thông báo khẩn cấp. |
| **JS2** | Khi chuẩn bị bước vào giai đoạn làm Prototype cuối khóa. | Tôi muốn tìm lại đúng đường link chứa file template Spec hoặc đoạn video giải thích công cụ mà giảng viên đã gửi tuần trước. | Tiến hành làm bài ngay lập tức mà không mất 20 phút lội ngược dòng chat. | Nỗi đau về sự phân mảnh và tốn thời gian tra cứu thủ công dữ liệu cũ. |
| **JS3** | Khi mở máy tính lên bắt đầu ngày học mới. | Tôi muốn xem nhanh một bảng dòng thời gian tổng hợp các task phải hoàn thành trong ngày từ tất cả các môn. | Lập lộ trình học tập hiệu quả, không cần mở cùng lúc 4 tab ứng dụng khác nhau. | Nhu cầu cấu trúc hóa thông tin thay vì đọc văn bản thô. |

## 5. Current alternatives *(5')*  

| Alternative (Đối thủ) | Làm tốt gì? | Fail ở đâu? | Vì sao user chưa bỏ nó? |
|---|---|---|---|
| **Tua video thủ công trên Drive** | Đảm bảo tính chính xác tuyệt đối của nội dung gốc vì là video record. | Cực kỳ tốn thời gian (tua đi tua lại), gây ức chế vì không có thanh tìm kiếm văn bản. | Là nguồn lưu trữ chính thức duy nhất được cung cấp. |
| **Lướt ngược tin nhắn ghim/Thanh search Discord** | Tìm kiếm được từ khóa nếu giảng viên có gõ từ khóa đó. | Bị nhiễu bởi các đoạn hội thoại spam chat khác; thanh search Discord tìm kiếm theo cụm từ chính xác khá kém. | Có sẵn, không mất phí, thói quen dùng cộng đồng. |
| **Tự ghi tay ra sổ/Ghi chú Notion** | Chủ động theo bộ lọc cá nhân. | Phụ thuộc hoàn toàn vào tính tự giác; nếu quên không ghi nhận lúc đọc thông báo thì hệ thống ghi chú này coi như vô hiệu. | Giúp tạo cảm giác an tâm tạm thời cho học viên. |

**Nếu sản phẩm nhóm không ra đời, user sẽ tiếp tục:** Chấp nhận mất từ 15-30 phút mỗi ngày đảo quanh các app, tiếp tục đối mặt với rủi ro bị trễ deadline và mất nhiều thời gian lội chat tìm tài liệu cũ.

## 6. AI leverage point *(nộp vào CP1)*  
**AI nên vào bước nào của workflow, vai trò gì:** Vào bước **Quét thông tin đầu vào & Trích xuất thực thể ngữ nghĩa**. Vai trò là bộ lọc thông minh chạy ngầm tự động phân loại, bóc tách chính xác các trường dữ liệu (Ngày, Giờ, Môn học, Link hành động) từ các đoạn chat/email thô.  
**Vì sao không phải bước khác:** AI không nên can thiệp vào bước "Nộp bài thay" hay "Ra quyết định" vì chi phí lỗi rất cao. Bước trích xuất và gom dữ liệu thô là bước tốn nhiều sức lao động thủ công nhất của học viên nhưng lại là điểm mạnh tối ưu của LLM.  

**Product hypothesis:** Nếu giúp *học viên Khóa 4* làm *việc bao quát thông báo học tập* tốt hơn ở *bước quét và tổng hợp dữ liệu đầu vào*, bằng *AI trích xuất thực thể tự động ngữ nghĩa*, họ sẽ chuyển từ *việc check thủ công từng app* sang *sử dụng Dashboard tập trung của StudyPulse AI*, vì *tiết kiệm được 90% thời gian tra cứu và triệt tiêu hoàn toàn tỷ lệ sót deadline*.  

**Assumption nguy hiểm nhất nếu nhóm đang sai:** Người dùng không tin tưởng vào kết quả tổng hợp của AI nên sau khi xem Dashboard, họ vẫn duy trì thói quen mở lại từng app để kiểm tra chéo lần nữa (Làm phá sản hoàn toàn giá trị cốt lõi giúp tiết kiệm thời gian của sản phẩm).

