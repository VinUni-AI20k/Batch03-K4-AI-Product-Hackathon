---
course: Workshop
generated: '2026-07-31T05:20:42+00:00'
lang: vi
lesson: Buổi giảng — QTDA (transcript đầy đủ)
maps:
- '[[MOC - Workshop]]'
module: ''
source_file: Workshop/Buổi giảng — QTDA (transcript đầy đủ).md
source_hash: sha256:89995849f07ee7f7507c436b505721c7f4329790bce89ae869ca6f076e50a34a
type: lesson-note
---

# Buổi giảng — Kinh nghiệm QTDA và Xử lý xung đột nhóm (transcript đầy đủ)

_Transcript nguyên văn (Whisper medium), chia mốc thời gian để RAG truy hồi chi tiết._
# Buổi giảng — Kinh nghiệm QTDA và Xử lý xung đột nhóm

_Transcript tự động từ ghi âm buổi workshop (Whisper medium, tiếng Việt). Có timestamp [phút:giây] để trích nguồn._



## [00:12] Phần 1
Xin chào mọi người, chào mừng các bạn đã quay trở lại với bộ workshop 3 của chúng ta ngày hôm nay. Chủ đề tổng lai của chúng ta sẽ cực kỳ thực tế và cần thiết cho giai đoạn phát triển sản phẩm của các team. Đó là kinh nghiệm quản lý dự án và dự trì năng suất phát triển sản phẩm. Ở bộ chia sẻ này thì chúng ta sẽ học được cách giải quyết được bài toán về lúc có ý tưởng đến lúc triển khai một sản phẩm AI thực tế. Đồng thời thì mọi người cũng sẽ học được cách chia việc, quản lý chiến độ và phối hợp với nhau trong team cho mình làm việc có thể chân chú vị hợp quả nhất. Và để gián giác chủ đề ngày hôm nay, mình xin giới thiệu diễn giả đồng hành cùng chúng ta. Đó là anh Đặng Hải Lộc, founder của MyMay và CTO của AIV Group.

[01:01]
Chắc em cũng không để anh và mọi người để lâu nữa. Thì em sẽ phép nhường mích lại cho Lộc để bắt đầu phần chia sẻ tối nay luôn. Ok. Cảm ơn Phúc. Xin chào tất cả các bạn. Đây là chương trình AI20k. Không biết là các bạn có nghe rõ tiếng của anh không? Nếu mà các bạn nghe rõ thì các bạn nhấn OK. Hòng sát giúp anh nhé. Ok. Ok. Ok. Anh sẽ chia sẻ màn hình. Ok. Thì anh giới thiệu nhanh qua một chút.

[01:49]
Anh là Lộc. Hiện tại anh cũng đang làm mentor trong chương trình AI20k. Anh tham gia từ cohort 1. Hiện nay thì là cohort 3. Ngày nay cũng đã trải qua 2 cohort. Và background của anh, trước đây anh học về báo chí. Sau đó là chuyển sang về khởi nhiệm công nghệ. Anh cũng trực tiếp có tham gia code sản phẩm cũng như là phụ trách nhiều vị trí khác trong team. Cả POVM và sales sản phẩm B2B, các kiểu chuyển khai danh nghiệp. Từ kinh nghiệm mà tham gia ở nhiều vị trí khác nhau trong quy trình phát triển sản phẩm thì có thể nói rằng là

[02:35]
kỹ năng chuyên môn cũng rất quan trọng về mặt kỹ thuật. Đấy là cái ưu tố bắt buộc mà các bạn nghĩ sư cần phải có. Khi mà các bạn tham gia lĩnh luật này nhưng mà ưu tố chuyên môn thì nó lòng góp khoảng đồ đấy tầm 50% thôi. Tối đa tầm 50% trong cái kết quả và sự thành công của sản phẩm cuối. Còn tối thiểu 50% có thể là tùy dự án đến 70-80%. Thì cái ưu tố thành công của sản phẩm nó lại phụ thuộc vào khâu quản trị dự án. Và thứ hai là phụ thuộc vào việc xử lý các mối quan hệ ở trong đội mũ.

[03:21]
Thế thì trong cái hữu dung workshop hôm nay dự kiến là chúng ta sẽ có 2 phần. Một phần thì anh sẽ chia sẻ tới các bạn đâu đấy trong khoảng tầm 30 đến 40 phút mang chất gợi mở các chủ đề tới các bạn. Anh sẽ chia sẻ với các bạn về một số những cái tạm gọi là bí kíp những cái về mặt tư duy. Và quan trọng với anh, kinh nghiệm của anh nó là quan trọng nhất. Đặc biệt là đối với các bạn tham gia cái chương trình này. Đây cũng là những cái thứ mà anh đã chọn lập. Và anh nghĩ là đây là những cái gọi là những cái tư duy gốc mà có lẽ là có thể nó sẽ đoán góp nhiều nhất vào trong cái sự thành công sản phẩm các bạn. Sau đó thì là chúng ta sẽ có cái phần


## [04:06] Phần 2
hỏi đáp và cũng như là phần thảo luận. Trong đó, đặc biệt là anh sẽ chia sẻ một số những cái vấn đề những cái tình huống thực tế mà các đội tham gia chương trình AIA20K mà anh cũng đã trải qua hoặc là cùng với bang tổ chức cũng tham gia rỡ rối cho các bạn thì anh cũng sẽ chia sẻ lại và chúng ta cùng thảo luận những cái tình huống đó để làm sao các bạn cũng có thể tránh ngược những cái vấn đề đương tự. Hoặc là nếu như những đội nhóm nào mà chúng ta đang thấy là có dấu hiệu tương tự thì các bạn cũng sẽ nằm bắt được là vậy thì có thể là nguồn gốc nguyên nhân đến từ đâu và làm thế nào để đội ngộ chúng ta vượt qua được những cái khó khăn, những cái thử thách đó.

[04:51]
Thế thì trong cái tóa trình anh chia sẻ phần đầu thì các bạn có câu hỏi các bạn cứ nhắn lên trên ngòng chat thì anh sẽ trình bày hết cái phần đối hiệu của anh trước. Rồi sau đó là chúng ta sẽ đề nghị phần thảo luận để phải đáp từng cái nội dung một. Thế thì nếu các bạn thống nhất cái cấu trúc như vậy cho buổi hôm nay thì các bạn có thể đồng ý trong nhóm chúc anh. Cũng nằm được là OK. Rồi OK. OK. Thế thì chúng ta bắt đầu nha. Cái yếu tố đầu tiên

[05:37]
là khi các bạn tham ra chương trình AR20K này thì anh nghĩ là cái quan trọng nhất các bạn cần nhớ đó là chúng ta sẽ có một khoảng thời gian tương đối là giới hạn và nguồn lực cũng tương đối là giới hạn. Chúng ta có 6 tuần và mỗi đội thì có tầm từ 3 đến 4 bạn. Chỉ có những đội, chỉ có từ 2 đến 3 bạn thôi. Nghĩa là về thời gian về nguồn lực thì chúng ta đều tương đối là hạn chế. Trong khi đó, cái mục tiêu của mỗi team tập ra là chúng ta phải xây dựng được một cái sản phẩm AR mà nó giải quyết được cái bài toán thật và nó có tiềm năng để được đi vào trong thực tế hoặc là cụ thể hơn thì là nó sẽ được tiếp nhận

[06:23]
bởi một cái đơn vị danh nghiệp thực tế tại Việt Nam. Có thể là bên Vingroup hoặc là các yên tập đoàn khác mà họ cũng có những cái vấn đề tương tự mà họ cần một cái nhóm phát triển cái sản phẩm như vậy. Và cũng chia sẻ cái thông tin với các bạn là cái tỷ lệ được tuyển dụng của các bạn mà tham gia chương trình EA20K CoHop 1 và 2 thì là mình nhận được thông tin từ ban đồng chức là đạt đến 100%, nghĩa là rất là cao. Và nếu mà so sánh với tỷ lệ được tuyển dụng của sinh viên ra trường năm nay thì cái hiệu quả của chương trình EA20K mình nghĩ là nó rất là lớn, rất là rõ. Tuy nhiên là cái tư duy đầu tiên khi các bạn tham gia chương trình này các bạn cần nhớ rằng là

[07:09]
mục tiêu của chúng ta rất là cao. Trong khi thời gian và nguồn lực của chúng ta thì nó tương đối là hẹn. Do đó là chúng ta sẽ cần phải có một cái phương pháp quản trị dự án để làm sao tối ưu hóa được cái phương trình này. Nếu không thì có thể là các bạn có những nhân sự rất là tốt, có background tốt, có nhiều kinh nghiệm. Các bạn ý tưởng sản phẩm của các bạn có thể là cũng rất là thực tế. Nhưng mà nếu các bạn không có cái khâu quản trị dự án tốt thì rất là có thể là cái sản phẩm của chúng ta nó sẽ không đạt được kỳ vọng. Thế thì cái đầu tiên trong cái khâu quản trị dự án tốt thì nó là cái gì? Đó là các bạn cần phải


## [07:55] Phần 3
có một cái tài liệu để khởi tạo dự án một cách chính thống. Thế thì cái tài liệu này trong quản trị dự án thì người ta gọi là Project Charter. Nó là một cái văn bản mà có thể gọi là hiến pháp của tạm mộ dự án. Trong cái văn bản này nó sẽ có cái gì? Nó sẽ có đưa ra mục tiêu một cách rõ ràng của sản phẩm. Nó sẽ có các cái magic đo đếm được để đánh giá thành công. Nó sẽ có một cái bảng đồ stakeholder. Các thành viên có tất cả những người có liên quan tới dự án này. Nghĩ dụ như ai là thành viên vắc triển đâu là những người có thể làm mentor cho bọn em. Mentor là cả trong chương trình hoặc là những

[08:41]
mentor ở bên ngoài mà bọn em có thể vi động hay là mời họ cùng tham gia. Đó là ai là những người có thể làm khách hàng mục tiêu cho bọn em để kiểm thử sản phẩm. Tất cả chúng ta cần nhật kê ra. Và có một cái phần rất là quan trọng nữa mà thông thường nếu mà không viết cái file này ra thì các đội rất là dễ bỏ qua. Đó là cái phần phạm vi. Chúng ta sẽ xác định cái gì sẽ làm và cái gì sẽ không làm trong sản phẩm của chúng ta. Trong cái buổi này anh cũng đã có chuẩn bị một cái folder. Folder có các cái template để giúp bọn em quản trị

[09:28]
trong này là nó có template project charter này thì ngay trong tuần này, trong tuần này tất cả các đội các bạn nên họp với nhau, chọn kỹ để bài và sau đó thì các bạn nên cùng nhau viết ra cái project charter này. Và cái project charter này có thể coi là cái bản hiến pháp bản hiến pháp của tạm bộ team. Các bạn có thể mở ra để các bạn xem. Cái này rất là quan trọng nhé. Cái này rất là quan trọng vì sao mình gọi nó là bản hiến pháp. Bởi vì là nó sẽ ảnh hưởng đến cái việc một cái vấn đề rất là lớn ở phía sau đó là

[10:15]
chúng ta phân chia vai trò, phân chia nhiệm vụ như thế nào và làm sao để xử lý những cái những cái sung luộc mà có thể xảy ra trong sản phẩm trong team về sau. Vậy thì bất kỳ lúc nào mà các bạn cần tìm lại về hướng đi về những thứ có nên làm ở sản phẩm hay không thì cái bản project charter này nó sẽ là cái cơ sở để các bạn quay trở lại các bạn xem. Đây mình vừa chia sẻ cái đường link này để gửi lại nhé. FILE PROJECT CHARTER thì đây là cái VKIT đầu tiên cái kinh nghiệm đầu tiên mà các bạn cần nó rất là đơn giản thôi template rất là đơn giản thôi

[11:01]
nhưng mà nó cung cấp ra một cái bản giống như kiểu hiến pháp ấy, khi mà các bạn mới làm việc cùng với nhau thì thông nhất ngay từ đầu là dự án này của chúng ta sẽ làm cái gì đo lường thành công như thế nào cái gì chúng ta sẽ làm, cái gì chúng ta sẽ không làm và ai là những người stakeholder, ai là người tham gia thế thì kinh nghiệm đầu tiên là các bạn cần chốt mục tiêu và đo lường dạch dòi, cái dự án của mình đấy là cái kinh nghiệm đầu tiên nha, và cái này mặc dù cực kỳ đơn giản thôi, nhưng mà từ thực tế mà mình cũng đã làm nhiều dự án thì mình thấy là đây là một cái bước cực kỳ quan trọng


## [11:47] Phần 4
mà nếu một đội vũ không làm rõ cái khâu này ngay từ đầu thì thế nào trong cái quá trình mà các bạn phát triển sản phẩm, các bạn cũng sẽ dễ tranh cãi nhau về những cái câu chuyện mà được liệt kê trong stakeholder này ví dụ như là cái vấn đề là cái sản phẩm của chúng ta được đo lường thành công như nào, mục tiêu cụ thể của chúng ta là gì tại vì rất là dễ vì tình trạng như này, các bạn bắt đầu với một cái dự án, và các bạn bắt đầu với một cái ý thích, hoặc là một cái ý tưởng nào đó và tại thời điểm ban đầu thì chúng ta đều hào hứng để chúng ta làm và chúng ta đều cảm thấy cái việc đấy là cái việc rất đáng để làm và chúng ta không suy nghĩ quá kỹ

[12:33]
về việc là vì sao chúng ta phải làm việc đấy làm cái công việc đấy thì thực sự là cái magic thành công ở đây là cái gì mục tiêu cuối là cái gì và cái nào chúng ta sẽ làm trong 6 tuần này cái nào chúng ta sẽ không làm thế thì từ cái project charter thì cái phần stakeholders nó có một cái cực kỳ quan trọng nữa đó là cái chuyện phân định rộng vai trò cái này là cái cực kỳ quan trọng này xong xong với cái việc mà các bạn làm project charter thì các bạn cần họp về nhau để phân định ra 3 vai trò ở trong team và 3 vai trò này là là những vai trò nạp

[13:19]
thì tối thiểu trong một đội ngũ các bạn sẽ cần 3 vai trò sau thứ nhất là project owner project owner thì là cái người mà sẽ gọi là chịu trách nhiệm thành bại trung của cái sản phẩm có thể gọi là đôi khi đây sẽ là cái người trưởng nhóm đây có thể đây sẽ là cái người trưởng nhóm nhưng mà cũng đôi khi có có thể là có những cái người trưởng nhóm người ta không phải là quá mạnh thì người ta không thích không thích định hướng về mặt sản phẩm mà người ta mạnh về cái mặt là liên kết con người, liên kết team liên kết đội ngũ thì cái vai trò PO này hoàn toàn có thể là để một bạn nào đó có kinh nghiệm làm sản phẩm các bạn phụ trách nhưng mà cái điều quan trọng nhất là gì

[14:05]
quan trọng nhất là PO sẽ là cái người quyết định là chúng ta sẽ làm cái gì quyết định sản phẩm sẽ đi theo hướng như thế nào và quyết định là tính năng nào sẽ cần lạc tất nhiên là team sẽ trao đổi cùng nhau nhưng mà chúng ta thông nhất là sẽ có một người phụ trách PO thì ai phụ trách vai trò nào người đấy sẽ có quyền quyết định cuối cùng ở các nhiệm vụ liên quan đến cái vai trò đó Trên thực tế là Cố 1, Cố 2 là cũng có một số các đội các bạn gặp phải mâu thuẫn với nhau và nguyên nhân gốc là bởi vì các bạn không xác định được rõ vai trò của các thành viên trong nhóm và đặc biệt là liên quan đến cái vai trò PO

[14:51]
một số bạn muốn làm sản phẩm theo một hướng một số thì làm theo hướng khác và khi mà tranh cãi với nhau rồi nó không ra được quyết định thì là rất dễ dẫn đến cái chuyện là các bạn xảy ra mâu thuẫn các bạn khó làm việc với nhau thế thì để giải quyết thì ngay từ đầu khi chúng ta học team, chúng ta form team chúng ta xây dựng cái bản là chúng ta đã phải xác định luôn ai sẽ là làm vai trò nào tất nhiên là cái chuyện làm vai trò này nó sẽ có qua cái sự thảo luận qua cái sung phong người qua thuyết nghiệm chúng ta sẽ thông nhận về nhau nhưng nó giống như là khi chúng ta có bản hiền pháp chúng ta sẽ xây dựng một chính phủ và trong chính phủ phải có sự phân vai


## [15:37] Phần 5
ví dụ như là phân vai ra rồi tòa án rồi phủ tướng rồi người các làm đi công tác đảng thì ai làm nhiệm vụ ở cái vai nào thì người đấy sẽ có cái thẩm quyền quyết định cuối cùng các vấn đề liên quan đến cái việc đấy cái thứ 2 vệ trí thứ 2 là vị trí PM vị trí PM là cái người mà quyết định về việc là tiến độ chúng ta sẽ làm như nào, kế hoạch cụ thể ra làm sao PO là người mà đưa ra quyết định về việc và sản phẩm chúng ta sẽ làm những gì có làm tính năng này hay không PM thì là người mà sẽ đưa ra quyết định về mặt kế hoạch tuần này chúng ta sẽ làm cái gì chúng ta có cần đẩy nhanh tiến độ hay không

[16:25]
Thông thường đôi khi với những nhóm nhỏ PM và PO có thể là cùng một người và thường là thế thường là PM PO cùng một người hoặc là bọn em có thể phân ra phân ra thành trưởng nhóm và PO và cái này thì nó sẽ phù hợp với những trường hợp mà trưởng nhóm là những người có thể gọi là lớn tuổi nhất ở trong nhóm nhưng mà về background về mặt sản phẩm hay là về mặt kỹ thuật thì có thể là chưa có nhiều kinh nghiệm như các bạn ít tuổi hơn vì lớn tuổi hơn nhóm nhiều kinh nghiệm hơn thì đứng vào vai trò trưởng nhóm để điều phối về xác định tiến độ để phân công cho mọi người

[17:11]
thì vẫn là phù hợp nhưng mà cái việc PO thì chúng ta phải thống nhất rõ từ đâu PO quan trọng nhất là PO sẽ là người đưa ra ý kiến cuối cùng về cái việc là thành vật bạn Hưng có hỏi là nhóm 4 người phân như thế nào thì các bạn lưu ý là cái này là vai trò vai trò chứ không phải là người nghĩa là một người có thể làm nhiều vai trò hoặc là chia ra mỗi vai trò một người cái này thì hoàn toàn là tùy thuộc vào nhóm sẽ thảo luận với nhau điều quan trọng nhất là gì? Điều quan trọng nhất là bọn em phải xác định cái này ngay từ đâu xác định cái này ngay từ đầu và có sự thống nhất của đội ngũ ngay từ đầu ai sẽ làm cái vai gì và ghi cái này vào trong

[17:57]
project charter nó giống như hiến pháp khi mà chúng ta có tranh cãi, có mâu thuẫn có các thứ thì chúng ta sẽ cần phải quay trở lại cái bản hiến pháp ai là người có quyền ra quyết định cuối cùng và khi ra quyết định cuối cùng thì cả nhóm sẽ cần follow theo cái này tí đến cái đoạn làm việc nhóm anh sẽ nói thêm nhưng mà về cơ bản thì nó giống như hiến pháp thôi khi mà chúng ta đã phân vai ai ở vai trò nào cả nhóm đã được bầu lên thì người đấy là có quyền quyết định cuối cùng khi mà xảy ra trong cãi trong team hay như nào thì đấy là người có quyền gia thịn cuối cùng và khi người đấy ra quyết định cuối cùng thì nhóm sẽ cần phải tôn trọng cái

[18:43]
ý kiến của người đấy bởi vì chúng ta đã bầu chọn người đấy ra ngay từ đầu và thứ 2 là các bạn phải lưu ý này mục tiêu quan trọng nhất ở đây là gì? các bạn cần lưu ý là mục tiêu quan trọng nhất của chúng ta sau 6 tuần nó chưa phải là các bạn làm một sản phẩm startup kiểu xuất sắc hay là các bạn làm một cái dự án để đời của cá nhân mà các bạn phải xác định là mục tiêu lớn gọi là đại sự của 6 tuần này là các bạn hoàn thành được sản phẩm của mình hoàn thành được sản phẩm và làm sâu và anh có thể khẳng định rằng là nếu như các nhóm mà bọn em không giữ được sự đoàn kết trong nhóm thì


## [19:29] Phần 6
bọn em sẽ không làm được mục tiêu này cái này thì anh có thể dựa trên kinh nghiệm từ cohort 1, cohort 2 các đội mà xảy ra các sích bích không hòa giải được với nhau và dẫn đến tình trạng chê nhóm tách nhóm hay thậm chí trong một nhóm làm hai hướng xăm xăm với nhau thì có một cái khẳng định là sau 6 tuần là cái sản phẩm của đội ngũ đấy không thể nào đảm vào chất lượng được thậm chí là nấp nghé cái mức là không nộp được như thế thì gọi là cái đại sự của bọn em nó sẽ bị ảnh hưởng nên là bọn em phải ghi nhớ là khi tham gia vào cái chương trình này mục tiêu lớn nhất của bọn em

[20:15]
là giữ dìm được sự đoàn kết để chúng ta hoàn thành được cái sản phẩm một cách tốt nhất và dựa trên cái sản phẩm đấy thì nó sẽ là cái thứ mà mỗi bạn tham gia vào chương trình này sẽ có một mục tiêu khác nhau nhưng mà anh nghĩ là cái mục tiêu căn bản nhất là bọn em có một sản phẩm để từ đấy bọn em có tăng cơ hội tuyển dụng hoặc là tốt hơn là cái sản phẩm của chúng ta được chúng ta tham gia được một nhóm của các thập đoàn nào đấy để có cơ hội phát triển tiếp những cái sản phẩm đó cái này thì anh cũng chia sẻ vì anh làm sản phẩm AI khá năm rồi thì anh có thể chia sẻ với bọn em là và hiện nay bạn nào đang mật mic nhỉ ok

[21:03]
thì anh hãy chia sẻ bọn em là hiện nay về làm sản phẩm AI thì cái cơ hội để bọn em làm sản phẩm AI dưới dạng một cái startup là rất là khó bởi vì nó đòi họ phải có đầu tư nó phải có hạn tầng và ở giai đoạn này nó là giai đoạn mà AI bắt đầu đi thực tế vào trong cái nghiệp vụ của doanh nghiệp rồi nên là nếu bọn em muốn đi với AI và muốn làm cái sản phẩm về AI thì cơ hội lớn nhất là bọn em có thể join vào các cái team của các đơn vị lớn mà họ có cái chiến lược triển kha thế nên là cái quan trọng nhất là các bạn nhớ giữ gìn sự đoàn kết

[21:49]
để hoàn thành được sản phẩm và cái kinh nghiệm để đoàn kết được với nhau là ngay từ đầu, phân rõ vai ra và một khi đã phân vai cái này, có thể trong quá trình là ai cũng có điểm mạnh điểm yếu thôi, có thể là bạn PO bạn ấy cũng không phải hoàn hảo, bạn TX bạn không hoàn hảo, PM cũng không phải hoàn hảo nhưng mà một khi chúng ta đã đã thống nhất với nhau là bầu bạn này thì có nghĩa là ở giai đoạn chúng ta đã đặt tin thưởng vào bạn ấy và chúng ta nên giữ tối đa cái niềm tin đấy trong trong 6 tuần 6 tuần nó cũng trôi qua rất là nhanh thôi nó không phải là khoảng thời gian quá dài nên là cái sự đoàn kết là quan trọng nhất

[22:35]
còn đương nhiên là khi mà các bạn làm các bạn cũng nên thảo luận với nhau không phải là bạn PO, bạn làm kiểu cực đoan, bạn cứ ngồi nghĩa một mình, xong bạn chỉ đạo bạn bạn kia làm cái A với cái C, thì cũng không được nhưng mà trong trường hợp về một nguyên tắc là bạn nào làm vị trí nào bạn ấy sẽ có quyền quyết định thì sẽ có 3 vai trò này, PO vai trò PM, vai trò TX phần xoay tua thì anh sẽ đến phần nhóm anh sẽ nói thêm nhưng mà quan điểm cơ bản của anh là chúng ta chỉ có 6 tuần thôi và thứ 2 là mặt bằng chung mặt bằng chung cái


## [23:20] Phần 7
mặt bằng chung số lượng kinh nghiệm của các bạn trong những trình của chúng ta thì anh nghĩ là cũng ở dưới cũng mới, anh tạm gọi là mới và chúng ta cũng chưa có chưa có nhiều thời gian để các bạn làm với nhau đủ lâu để hiểu thì với cái bối cảnh như thế thì cái mô hình mà các bạn làm cố định vai trò thì là cái mô hình mà nó sẽ an toàn hơn thế còn cái việc mà xoay tua việc xoay tua thì nó sẽ phù hợp hơn với những đội ngũ mà có các thành viên là rất có kinh nghiệm ít nhất là đã có nhiều kinh nghiệm làm cái vị trí đấy trong quá khứ thì có thể là thực hiện xoay tua và cũng như là

[24:06]
cái kinh nghiệm mà làm quen biết nhau lâu rồi đấy thì hiểu cái cách làm việc của nhau rồi lúc đấy là xoay tua với nhau nó sẽ dễ thế còn một cái đội nhóm mới các bạn chưa quen nhau các bạn cũng chưa có ấy thì cái việc là có một cái sự ổn định nó sẽ tốt hơn, tốt hơn cho performance rồi, tiếp theo nhé tiếp theo là cái kinh nghiệm tiếp theo vậy thì khi mà các bạn đã form team rồi các bạn đã có vai trò rồi thì bây giờ chúng ta cần làm cái gì tiếp thì cái kinh nghiệm tiếp theo là các bạn nên có một file quản trị dự án, duy nhất thôi và đây này đây là anh cũng có cung cấp cho các bạn một cái thêm list đây này, các bạn chỉ nên

[24:52]
sử dụng một file để quản trị dự án thôi, đây cái này thì cũng là từ cái kinh nghiệm anh đã làm sản phẩm các thứ, thì có rất nhiều cái cách để quản trị dự án các bạn có thể dùng Isil các bạn dùng Zelo dùng Zira dùng rất nhiều thứ khác nhau nhưng mà cái kinh nghiệm của anh là khi mà làm sản phẩm thì cái sự đơn giản nó là quan trọng nhất thứ 2 là chúng ta làm cái sản phẩm này trong vòng 6 tuần thôi chứ không phải là đây là một sản phẩm các bạn có thể làm trong vài năm thế nên là các bạn cái phần quản trị dự án nó càng đơn giản nó càng dễ hiểu

[25:38]
nó càng dễ lạ thế thì các bạn nên áp dụng đúng một file quản trị dự án này thôi team nên có một file duy nhất và tất cả những cái tài liệu quan trọng thì đều nên update ở trong này thì đây là cái file quản trị dự án này trong này chúng ta có thể update tất cả những cái file quan trọng vào đây file quan trọng ở đây sơ đồ kiến trúc đặc tả rồi các thứ báo cáo họp tất cả mọi thứ để vào trong một file thôi nó sẽ tốt cho cả nhóm, tốt cho mentor, tốt cho những cái người khác mà khi mà muốn làm việc cùng bọn em thì sẽ có một cái file thống nhất để làm và trong cái file này thì nó có đủ mọi thứ cần để quản trị cho một cái dự án phẩm mẻ ví dụ như trong này nó sẽ có cái danh sách

[26:24]
user story này bọn em nên cấu trúc cái tính năng cái road map của sản phẩm dưới dạng user story và mình cũng quản trị và quản lý cái lộ trình dựa trên user story này rồi từ user story thì có thể phân task chi tiết hơn xuống thành backlog trong từ user story thì sẽ có từng task này mình phân, mình phân cho các bạn các bạn update ở đây rồi đây, cái file, cái này là cái folder anh gửi, anh gửi mọi người một lần rồi chắc là bị troll, mọi người nhắm tin nhiều quá cái folder này là cùng cái folder


## [27:09] Phần 8
chia sẻ slide một em tìm ở trong discord ấy chắc là có đấy cùng cái này thôi trong này là file để backlog đến share task đến share task này rồi có một cái sheet mà anh nghĩ là rất là cần và em nên làm là cái sheet đặc tả tính năng sheet đặc tả tính năng thì ví dụ như là chẳng hạn như là một bạn phụ trách làm một cái task gì đó thì các bạn nên nên thông nhất là bắt buộc phải viết cái đặc tả tính năng cho cái task đó để làm gì đây là một cái form đặc tả tính năng mà theo cái chuẩn

[27:55]
của google thì mỗi một tính năng các bạn chỉ cần mô tả 3 thứ thôi thứ nhất là cái động lực motivation để làm tính năng này là gì ví dụ các bạn cảm thấy là cần phải có bổ sung một con trợ lý ảo vào trong cái sản phẩm của mình để hỗ trợ cho người dùng thì mình sẽ bổ sung vào cái phần motivation này phần thứ 2 là cái thiết kế dự kiến như thế nào thì bổ sung vào cái phần này phần thứ 3 là kế hoạch thực hiện như thế nào, thì mình mô tả vào đây và bây giờ thì các bạn cũng có AI khi các bạn vi-coding các thứ thì các bạn cũng có thể nhờ con AI nó gen ra cho cái này thì vì sao cái đặc tả tính năng này nó quan trọng thứ nhất là bởi vì là bây giờ các bạn làm vi-code thì khi mà chúng ta chia việc

[28:41]
ra cho nhau, nếu mà chúng ta mỗi người tự làm và mọi người vi-code ở trên mạng nguồn thì chúng ta sẽ hơi khó để thảo luận thường là chúng ta rất khó để thảo luận về mặt kỹ thuật với nhau mà đặc biệt là để trao đổi giữa những người mạng về tách và những người năn tách chẳng hạn hay là khi trình độ trong nhóm nó trinh lệch nhau thì nếu mà các bạn chỉ đơn thuần các bạn code xong rồi các bạn bảo là thành viên của nhóm chúng ta đọc đi, thì sẽ rất là khó rất là khó cho các bạn và chúng ta cũng tận dụng được cái kiến thức của nhau ví dụ, trước khi các bạn làm một tính năng gì đấy, các bạn nên

[29:27]
viết ra thành cái đặc tảng như thế này thì khi mà các bạn có thể có họp với nhau định kì em định làm tính năng này, làm tính năng kia thì viết trước cái này này, ở cái dạng này thì chắc chắn là các thành viên trong team đều có thể đọc được thứ 2, một lý do nữa là ví dụ khi các bạn gặp phải những cái vướng viết mặt kỹ thuật các bạn hỏi mentor thì đấy cũng có nhiều bạn hỏi là anh cho em xin cái kinh nghiệm là thiết kế hệ thống rack như thế nào cho nó hiệu quả thì thực sự mà nói là, khi các bạn hỏi những câu hỏi như vậy, đặc biệt là những câu hỏi liên quan đến kỹ thuật thì các bạn hỏi những nội dung chung chung kiểu như vậy mentor sẽ cực kỳ khó trả lời cho các bạn, bởi vì mentor cũng không thể thật ra một mentor sẽ quản lý 10-12 đội

[30:13]
thì cũng không có đủ thời gian để theo dõi đọc cốt từng của từng nhóm theo tất cả các buổi rồi thế nên là, trước khi các bạn làm một tính năng gì, các bạn làm tạc tả tính năng như thế này thì thứ nhất là trong team có thể trao đổi với nhau, hiểu nhau, thứ 2 là các bạn tính năng khó hoặc các bạn có thể mention mentor và khi mention mentor thì các bạn hỏi luôn và các bạn bảo là em đang định thiết kế như thế này các anh có góp ý thêm cho hay không trong này nó sẽ rất là rõ, ví dụ phần rap bọn em đang định dùng bm25 cộng với cái gì đó thì bọn em nên gửi câu hỏi cụ thể cho cái này và từ cohort 1, cohort 2 thì anh cũng thấy


## [30:59] Phần 9
có một cái đặc biệt là có vẻ như là các bạn vẫn chưa khai thác kinh nghiệm của các mentor được nhiều lắm bởi vì tương trình của chúng ta là toàn mentor xịn hơn, toàn các anh chị mà làm rất nhiều năm kinh nghiệm đã có rất là hiểu biết, nhiều anh chị có hiểu biết rất là sâu về mặt kỹ thuật thì các bạn nên làm sao huy động được kinh nghiệm của mentor và cách để huy động được tốt nhất là các bạn cần phải đặt những câu hỏi rất là cụ thể và nên có các file này hỏi mentor thì khi đấy sản phẩm của các bạn nó sẽ được chất lượng hơn và có

[31:45]
rất nhiều vấn đề kỹ thuật mà anh thấy lập đi lập lạ trong các team, chẳng hạn như là có rất nhiều team sẽ trục có chung một cái đề bài theo kiểu như là con trợ lý ảo, con chatbot thì thực ra mà nói là con chatbot nó có khoảng tầm về kiến trúc tổng thể của con chatbot chắc chắn nó cũng phải giống nhau đến 80% thật ra một con đặt chất lượng thì nó phải đặt đến tầm đấy 80% ví dụ đầu tiên mother nó cũng phải vào kiểm tra, rewrite lại câu hỏi của người dùng, xong rồi nó chống prompt injection, sau đó nó rút tinh sang các trường học khác nhau rồi bắt đầu nó đưa vào kiểm tra có cách hay không, thì thực ra là nó có một cái kiến trúc khác nhau nhưng mà anh thấy một cái điểm là

[32:30]
rất nhiều đội là khi các bạn làm các bạn hơi phát minh lại cái gánh xe các bạn cứ lặng lẽ các bạn làm và khi mentor hỏi các bạn có vấn đề gì không hay như nào thì các bạn cũng không nói được cụ thể là mình có vấn đề nào và đến khi mà làm cái sản phẩm mentor test hay là ban giám khảo test số bài test cơ bản thì phát hiện ra là các bạn không tính toán đến cái bài toán đấy ví dụ anh nói một cái bài test rất đơn giản như này là người dùng người ta mình chat một câu đầy đủ hoàn thiện theo đúng như cái dữ liệu test của mình đâu người dùng người ta có thể chat theo kiểu như là admin ơi, xong rồi xuống dòng

[33:16]
em hỏi cái này xong rồi chấm cái, xong rồi hỏi là ngày mai xong rồi chấm cái xuống dòng thì không biết là có thời gian học chưa, đấy kiểu thế thì khi mà ban tổ chức chấm thì đã thông thường là nếu mà làm nhiều trong mảng này thì sẽ biết là nó có một số những cái pattern một số những cái bài toán nhỏ mà một cái sản phẩm thực tế nó phải đáp ứng, thì ban tổ chức mang cái đấy ra để test thì thực sự mà nói là anh thấy là trong hai cái co-hop vừa qua thì số lượng các nhóm mà làm ra một con chatbot ở cái cấp độ production là vẫn còn tương đối thấp

[34:02]
và hay mắc phản những cái vấn đề giống nhau thì những cái đấy các bạn hoàn toàn có thể tránh được như các bạn khi các bạn thiết kế, các bạn thiết rõ đặc trả ra có thảo luận với nhau và có hỏi comment mental thế thì nguyên tắc thứ 3 này là nguyên tắc mà các bạn sử dụng một cái file duy nhất để quản trị dự án và một cái thách thức trong chương trình thông tin này là khối lượng thông tin nó sẽ rất là nhiều các bạn sẽ vừa học, các bạn vừa mental vừa làm sản phẩm, vừa thảo luận với nhau số lượng file nó sẽ cực kỳ nhiều thế nên khi dữ liệu nó càng nhiều thì chúng ta càng phải áp dụng cái nguyên tắc là giữ mọi thứ đơn giản và đơn giản nhất là


## [34:48] Phần 10
dùng một file thôi thì đây là cái nguyên tắc mà anh cũng đã áp dụng cho những cái dự án cộng đồng mà số lượng thành viên số lượng người tham gia hơn 2.000 người thì vẫn áp dụng được một cái nguyên tắc rất là cơ bản này thôi chỉ có một file duy nhất mà từ file đấy mọi người có thể tìm ra được tất cả những cái file khác dữ cái nguyên tắc như vậy thì nó sẽ dễ phối hợp rồi tiếp theo nguyên tắc tiếp theo là khi bọn em đã có kiếm học rồi đã có lụ trình rồi thì chúng ta sẽ cần làm gì tiếp thì các bạn sẽ cần áp dụng một cái

[35:34]
tư duy tư duy really often really regularly thì có một số đội như thế này có một số đội hay là có một số bạn thì anh thấy là có một cái pattern như thế này là các bạn hay thiết kế tư duy kiểu perfectism ấy các bạn muốn mọi thứ phải hoàn hạp bạn làm một dự án bạn phải tìm ra được đọc hết tất cả các paper sau đó là nghiên cứu xem giải pháp của mình chứng minh về một toán học ổn chưa sau đó thì muốn là phải làm được đến cái mức độ như thế này

[36:20]
có nghĩa là hơi bị over thinking và hơi bị lý tưởng hóa qua thế thì cái này kinh nghiệm của anh cho thấy là những cái nhóm mà càng lý tưởng hóa như thế sau 6 tuần thường lại là những cái nhóm hoàn thành sản phẩm chậm nhất kiểu last minute đến tầm thứ 5 rồi các bạn mới có sản phẩm MVP sản phẩm MVP có một đống những thứ khác chưa chạy ổn nữa thì thực ra là cái tư duy lý tưởng hóa nó không phải là không tốt nó sẽ phù hợp với những cái dự án nó sẽ có nhiều dự án mà các bạn sẽ phù hợp cần cái tư duy đấy thế nhưng các bạn

[37:06]
lưu ý là chúng ta đang cụ thể làm trong dự án AI20k này chúng ta chỉ có 6 tuần thôi và trong lĩnh vực về AI hiện nay nói chung nó là cái lĩnh vực mà đang nó là cái tình chất start up của nó rất là cao cái sản phẩm bên nào really nhanh hơn, bên nào cải tiến nhanh hơn, bên nào nhận được nhiều feedback hơn sẽ là bên mà nhận được sự tiến bộ nhiều hơn, thế nên là cái tư duy gọi là really often, really regularly nó sẽ là cái tư duy mà sẽ giúp các bạn anh nghĩ là sẽ giúp các bạn mà đi tốt hơn cái cuộc thi này và cái tư duy này có nghĩa là gì really often, really regularly

[37:52]
có nghĩa là thông thường giữ khoảng 2 ngày, cố gắng khoảng tầm 2 ngày, là các bạn nên có một cái bản relay mới chứ đừng để là cái này nó không chỉ là vấn đề về làm sản phẩm đâu, nó là vấn đề về mặt năng lượng của đội nhóm nó là vấn đề về cái chuyện tạo nhiệp điệu trong quá trình là kinh nghiệm là bọn em làm sao để cứ duy trì được một cái nhịp là cứ sau 2 đến 3 ngày thì mọi người tì tin thì sẽ tự đánh gia nhưng mà theo anh là khoảng tầm 2 ngày đến 3 ngày thì bọn em nên có một bản relay mới và relay ở đây có nghĩa là ví dụ như bọn em dùng cái nhánh main để bọn em


## [38:38] Phần 11
build các phiên bản ổn định của sản phẩm, thì cứ sau 2 đến 3 ngày bọn em có một cái bản build mới ở cái nhánh main và sau 2 đến 3 ngày đấy thì bọn em nếu như bọn em có các stakeholders người dùng thì bọn em nên cập nhật cái bản đấy cho cái cộng đồng người dùng của mình hoặc là gửi cho mentor hoặc là gửi cho AI nói chung là làm cái thủ tục release, viết bài đăng về nó gửi vào cái nhóm cộng đồng người dùng kiềm năng có thể là nhờ mentor trách thêm 1 số update 1 số tính năng mới thế thì cái này nha, kinh nghiệm là cái này sẽ giúp bọn em duy trì được cái nhiệp điệu nhiệp độ, nó còn là vấn đề năng lượng nữa

[39:24]
cả cái vấn đề về chuyện là bọn em gắn kết được cộng đồng với người dùng nếu bọn em tìm một nhóm người dùng mà 10 ngày bọn em mới gửi cho người ta một bản cập nhật mới thì về mặt tâm lý nó sẽ cảm giác là bọn em cũng không để tâm lắm với cái sản phẩm này mình cứ 2-3 ngày mình có một bản cập nhật thì tự nhiên là về mặt tâm lý người ta sẽ cảm thấy ah, team này đang đi khá là tốt, sản phẩm các bạn khá là thích, có tiềm năng và người ta sẽ đổ dồn các sự quan tâm, sự chú ý cho bọn em và bọn em để ý là color code của Anthropic họ có một chuỗi 56 ngày 56 ngày ngày nào họ cũng li tính năng mới là một cái sản phẩm lớn mà họ còn duy trì được cái nhiệp độ, cái tốc độ như vậy 2-3 ngày bọn em release

[40:10]
một cái phiên bản mới là chuyện hoàn toàn có thể đạt được và nên áp dụng cái tinh thần này trong mọi bước cái cái chương trình cohort này thì kinh nghiệm cho thấy là các độ càng release ra sản phẩm sớm thì càng đạt được cái kết quả cao hơn, bởi vì sao? thì thứ nhất là các bạn có sản phẩm MVP sớm thì các bạn trong bắc buổi Mentor Duty các bạn mà có sản phẩm MVP sớm các bạn sẽ gửi được ra nhóm người dùng thực tế sớm hơn các bạn sẽ thu thập được những cái feedback từ nhóm người dùng nhiều hơn

[40:56]
các bạn sẽ có thêm thời gian để các bạn làm các cái phần scoring về hệ tống AR tất cả những cái phần đấy là khi mà đi vào phần demo là nó đều tạo ra cái sự khác biệt rồi các bạn mà các bạn xong được sớm thì tuần cuối cùng của ban nổ chức là sẽ có một cái chương trình kiểu chương trình 1-1 Mentor thêm 1-1 cho các đội mà các bạn ấy muốn góp ý thêm bởi vì các bạn đã làm xong sản phẩm rồi các bạn làm xong sản phẩm từ tuần số 4 chẳng hạn thì các bạn ấy có thời gian thảnh thơi, các bạn ấy hỏi thêm, các bạn ấy suy nghĩ thêm rồi các bạn ấy cũng lại có thời gian để các bạn ấy làm slide cho nó đẹp, các bạn vẽ diagram thế thì cái bí quyết thành công của chương trình này

[41:42]
là bọn em nhớ cái câu này Really often, really regularly thả release sớm còn hơn là release muộn và chắc chắn là release sớm là có kết quả tốt hơn anh chưa thấy trường hợp nào mà release sớm lên mvp sớm, lên production sớm mà lại sản phẩm lại kém hơn cả chỉ có trường hợp ngược lại thôi các team làm bị chậm, mà sau đó là đến last minute mới bắt đầu bổ sung rồi cập nhật thì đến khi demo là mọi thứ nó bị kém rồi rồi có một cái kinh nghiệm nhỏ nữa là bọn em nên dùng user story để mô tả thuộc tính mô tả thuộc tính của sản phẩm


## [42:27] Phần 12
thì vì sao bọn em dùng user story bởi vì trong các nhóm của chúng ta có nhiều nhóm sẽ có thành phần có nhiều thành viên không phải là những anh em phần về học công nghệ thông tin mà đến từ các ngành khác chẳng hạn nếu bọn em dùng các ngôn ngữ như là Euskate hay là dùng Feature hay là dùng VHD hay là dùng các cách nào đó khác để bọn em mô tả tính năng cho những nhóm người đấy thì các anh chị em đấy sẽ rất là khó để tham gia thứ hai là bọn em cũng rất là khó để dùng một cái ngôn ngữ chung với lại mentor với lại các cái khách hàng tiềm năng hay là người dùng tiềm năng trong khi đấy thì user story là

[43:13]
thứ cực kỳ dễ hiểu nó có cái cấu trúc như này thôi mình sẽ mô tả tính năng dưới dạng một cái câu như thế này, ví dụ như là với vai trò là admin của sản phẩm tôi muốn có một cái dashboard để theo dõi được số lượng khách khách gửi issue nhập học ví dụ thế thì bọn em mô tả dưới dạng này thì trong nhóm ai cũng hiểu được hết thứ hai là user story nó còn có một cái rất là hay đó là nó bảo đảm rằng tính năng bọn em viết ra nó tạo value thực sự cho user nó tạo value thực sự cho user đây, anh mở lại cái form

[43:59]
quản trị dự án thì trong này bọn em sẽ có hôm nay em làm tiếp tính năng đăng nhập của back end ngày mai em đang sửa tiếp tính năng rack ngày kia em đang làm cái phần rack em đo cái vấn đề của cái việc là khi các bạn mô tả như thế là gì vấn đề khi mô tả như thế là ngày nào nó cũng sẽ lặp lại như nhau và mentor hay là PM hay là các thành viên khác trong nhóm không biết các bạn đang thực sự làm gì luôn hay là không nắm được

[44:45]
tiến độ của các bạn như nào có cải tiến gì hay không còn nếu mà các bạn mô tả dưới ngôn ngữ của user story ví dụ em đang làm chức năng cho phép admin có thể xem được xem được chất lượng của câu cho bot trả lời cái này là use case số 10 em đang làm được 75% rồi thì nó rất dễ hoặc là khi bọn em báo cáo bọn em đã làm xong use case đấy thì điều đấy có nghĩa là ở trên giao diện thì admin có thể đăng nhập được có dashboard có các thứ thì đo bằng user story là cái thứ mà nó cực kỳ chính xác dễ hiểu và bảo đảm rằng là

[45:31]
và cuối cùng một cái ý nữa là anh cũng có giới thiệu với các mentor là cái skill để test test sản phẩm của các độ để làm sao các buổi mentor duty có thể kiểm tra xem tính năng có hoạt động hay không từ đấy ta đưa ra cho bọn em những gợi ý sát hơn anh lấy ví dụ như là bọn em phải xác định là bọn em làm sản phẩm AI thì bây giờ sản phẩm AI chúng ta phải chú ý đến cả mặt dữ liệu cá nhân nhưng mà rất ít đội có cái chế độ mà hỏi người dùng xin quyền người dùng đồng ý để sử dụng dữ liệu cá nhân rất ít đội trên sản phẩm


## [46:17] Phần 13
có các file về privacy rồi một số đội thì phần API của mình không bảo vật bị lộ key chẳng hạn những cái phần phần như thế thì nếu như bọn em viết dưới dặng user story và mentor send được user story này mentor có thể là chủ động tạo ra các bài test để dùng AI test tự động giúp bọn em thì cũng sẽ tốt hơn cho bọn em đứng vào góc đội người dùng cuối test trên sản phẩm đó là kinh nghiệm user story rồi tiếp theo

[47:03]
về mặt tiến độ bọn em nên phân bổ như thế nào bọn em nên phân bổ theo các screen có nghĩa là bọn em nên lên kế hoạch để phát triển sản phẩm theo từng tuần một và mình nên làm rõ check list của từng tuần ở trong này ví dụ như trong file quản trị dự án có phần lộ trình trong phần lộ trình này có rất rõ các mốc quan trọng bọn em cần phải vượt qua và bọn em nên lập kế hoạch cho nhóm một cách phụ thể, thiết từng tuần mục tiêu gì trong đấy thì nó sẽ có các mốc quan trọng

[47:51]
bọn em nên phân bổ như thế này tuần một là tuần mà chúng ta nên làm quen nhóm, form nhóm làm rõ, đề tài xác định kiến trúc, giải pháp các thứ tuần hai và tuần ba là cái tuần mà bọn em sẽ phát triển sản phẩm và đến bọn em sẽ phát triển sản phẩm trong khoảng tậu 10 ngày đến mentor duty đầu tiên của tuần thứ 3 tầm buổi thứ 4 của tuần thứ 3 thì nên có sản phẩm MVP có nên có sản phẩm MVP để mình nhận được góp ý đầu tiên từ mentor sau đó là đến tuần thứ 5 thường là tuần thứ 3 là có MVP

[48:37]
rồi này, thì đến tuần thứ 4 thứ 4 là cái tuần mà bọn em đã phòng phòng sản phẩm rồi, thì đây là cái giai đoạn mà mình nên đi gặp những người dùng thực tế, người dùng tiềm năng cho họ dùng thử, lấy feedback về sản phẩm của mình rồi mình đo lường cái hiệu quả của sản phẩm đo lường thì bằng 2 cách, thứ nhất là đo lường dựa trên các cái phương pháp mà đo lường hệ thống AI ví dụ như là dùng các cái mô hình AI mạnh hơn để chấm điểm câu trả lời hoặc là chấm điểm cái hiệu quả hoặc là xây dựng những cái bộ dữ liệu test thứ 2 là mình đi gặp trực tiếp những người dùng thực tế và nhờ những cái người dùng đấy, họ đưa cho mình 1 cái benchmark so với cả con người, lại khi mà em lưu ý nhất là để đo lường nó có 2 cách

[49:23]
1 là mình tự đo thứ 2 là mình đi gặp cái người dùng thực tế để mình đo với lại cái benchmark các con người và làm sao để đến tuần thứ 5 này tuần thứ 5 này là xong xui hết tất cả sản phẩm thứ 5 này xong xui hết để bọn em sẽ có 1 tuần thứ 5 thì mình mentor 1 một thêm thứ 2 là mình tập trung vào mình làm sập tốt các cái tài liệu để cho demo ví dụ nên vẽ diagram này nên làm slide đẹp này nên có các cái video quay lạ các cái bước cái này thì có 1 cái kinh nghiệm thường cái đội nào mà làm slide đẹp là đội đấy là sản phẩm


## [50:09] Phần 14
cũng ok nói chung là đấy như anh nói là cái đội mà đã ok thì là mọi thứ nó sẽ ok các đội mà không ok thì thường là bị last minute và nó dẫn đến là mọi thứ không ok theo thế nên là cái tinh thần bao giờ bọn em phải làm rất chả về mốc thời gian và bao giờ cũng phải làm với 1 cái tinh thần là khẩn chương khẩn chương tài lia lia sớm còn hơn là lia lia muộn có thể nó chưa hoàn hảo bọn em lia lia sớm bọn em lấy góp ý sớm bọn em đưa ra người dùng bọn em test thì sản phẩm nó sẽ hoàn thảo lên còn đừng ôm kỳ vọng là phải nghiên cứu thật kỹ cái này xong rồi mới làm

[50:55]
có thể với những chương trình khác hay là bọn em làm thực tế bán dài hơn thì có thể ok nhưng mà cái đầu tiên mà em nhớ với chương trình này là chúng ta chỉ có 6 tuần thôi và với cái nguồn lực vào thời gian hạn chế thì cái việc mà làm nhanh sửa nhanh nó sẽ tốt hơn rồi cái đặc tản kỹ thuật này anh nói rồi rồi về tiếp theo nhé về cái việc giữ nhịp hàng ngày về việc giữ nhịp hàng ngày thì bọn em nên áp dụng 2 cái dạng 2 cái dạng cổ họp cái vấn đề họp thì mỗi người có 1 cái sở thích khác nhau hiện tại là CoHop 3 cũng đã bắt đầu có 1 số nhóm các bạn ý kiến có mâu thuận với thành viên trong nhóm của mình

[51:41]
bởi vì không thấy họp thì cả nhưng mà cũng có nhiều anh em thích tập trung, thích làm deep work thì cũng không muốn kiểu suốt ngày ngồi họp với nhau cái gì cũng phải họp thế thì anh nghĩ là một cách cân bằng thì chúng ta có tối thiểu bọn em có thể xây dựng 2 cái văn hóa họp như này thứ nhất là họp daily stand up hàng ngày nhớ là hàng ngày nhé nên họp daily stand up hàng ngày cái không khí khẩn trương và cái chuyện really often rồi cái chuyện làm sao để bảo đảm được tiến độ trong nhóm nó đến chủ yếu từ cái việc này đến chủ yếu từ việc này bọn em phải họp với nhau hàng ngày hàng sáng họp

[52:27]
và cái daily stand up của ban tổ chức trong Discord mình đừng làm nó mang dình chất là kiểu làm để báo cáo thôi mình đừng lên tư duy như vậy mình nên coi daily stand up chính là công cụ để hỗ trợ bọn em là một cách tốt nhất nghĩa là ban tổ chức đã đưa ra một cái quy định là phải có daily stand up để báo cáo, thì đấy là một cái khung để hỗ trợ cho bọn em Vì sao cái daily stand up là hiệu quả thứ nhất là nó yêu cầu tất cả các thành viên có sự cam kết tỏ giả các thành viên là phải nêu ra được là hôm nay tôi làm cái gì, hôm nay tôi sẽ

[53:13]
xong cái gì, có bị block ở đâu không và cái này là cũng thùng nhất với nhau nên thùng nhất với nhau từ đầu anh biết là có nhiều độ thì có một số thành viên là ngoài tham gia chương trình này thì các bạn cũng bận biểu các việc khác gì đó nữa, nhưng mà chắc chắn rằng là không bận đến mức độ là không thể dành một ngày khoảng tầm 15 phút chắc chắn là hoàn toàn là các bạn có thể dành được một ngày 15 phút, còn vào thời điểm nào thì tùy team thùng nhất với nhau có thể đầu giờ sáng hoặc là trước buổi tối bạn Nguyễn Nam Anh cứ tưởng là báo cáo hôm qua học gì, hôm nay học gì các bạn lưu ý ở đây nó có từ daily stand up cái góc của cái từ này


## [53:59] Phần 15
là một cái cổ họp mà tất cả mọi người đứng vòng tròn đứng vòng tròn và nhìn mặt nhau xong rồi nói, xong rồi có face to face và nó có lý do để người ta thiết kế cái kiểu vậy chứ không phải chỉ đơn giản là cái chuyện báo cáo đâu báo cáo thì các bạn gửi mail cũng được nhưng mà người ta thiết kế cái daily stand up này để nó tạo ra một cái nghi thức trong cái nghi thức này thì nó có cái chuyện là mọi người nhìn mặt nhau tí nữa anh sẽ nói về cái chuyện là xử lý mẫu thuận trong nhóm nhưng mà bản thân cái việc mà các bạn nhìn mặt nhau các bạn nghe lắng nghe nhau rồi chia sẻ, hôm nay làm cái gì ngày mai làm cái gì tôi bị vướng ở đâu bản thân cái việc đấy nó là cái việc cực kỳ quan trọng

[54:45]
về mặt năng lượng chứ không chỉ là thông tin đâu và duy trì về trách nhiệm nữa thế nên là cái này các bạn nên thực hiện thứ hai là daily stand up thì họp ngắn tầm 15 phút mỗi ngày thế còn khi mà có các vấn đề về technical thì các bạn cũng nên họp nhưng mà các bạn nên quen một cái văn hóa, nó gọi là văn hóa họp nhanh văn hóa họp nhanh họp nhanh 5 phút, 10 phút rồi cái này thì trước đây anh thấy ở Việt Nam mọi người hay bị một cái tình trạng là họp về kỹ thuật rất dài nếu mà đã họp về kỹ thuật họp rất dài xong rồi họp về vấn đề rất lớn, xong rồi anh em

[55:31]
có thể trong cái cuộc họp đấy là cãi nhau sau lời tự nhiên là bị rất dễ bị xa đà vào một cái cái cuộc tranh cãi gì đấy mà nó không liên quan đến chủ đề ban đầu nữa nhưng mà khi anh làm việc với, có một cái dự án anh làm việc, anh làm việc một số Facebook, Microsoft thì mặc dù là đã giao việc khá là rõ cho các bạn rồi các bạn ấy cũng đã có cái file đặc tả rất là rõ rồi, nhưng mà các bạn ấy vẫn xin phép họp 5 phút để các bạn ấy quick call thôi, các bạn ấy trao đổi lại nên là, đã đúng ý hiểu ý chưa và cuộc họp đấy là các bạn ấy có record lại về sau thì anh ấy thấy là đấy là một cái văn hóa cực kì hay

[56:19]
bởi vì sao, bởi vì là làm sản phẩm của chúng ta rất là dễ bị tan sao thất bản, nhất là trong một cái nhóm của chúng ta đến từ các bắc cao khác nhau, có thể là bạn này giao việc rồi, nhưng mà khi làm ra thì nó lại khác nhau rồi từ cái chuyện khác nhau nó dẫn đến cái chuyện là cảm giác như là không làm được với nhau hay là người ta không hiểu, hay là cái gì đấy thì thực ra đôi khi nó chỉ là cái chuyện mỗi người đến từ một cái background khác nhau và mỗi người hiểu khác nhau về cùng một cái nhiệm vụ, do đó là chúng ta, các bạn nên có một cái văn hóa, nó gọi văn hóa là quick meeting và họp chỉ trong 5 phút thôi họp mà ngắn thôi hướng dẫn em nhanh về cái này hay là

[57:05]
em đang làm tình năng mới này nó có liên quan đến một cái phần backend của bạn nạ thì xin phép họp 5 phút cái này thì nó không phải là daily scrum, cái daily scrum này thì nó giống như là cái phần daily stand up daily stand up thì nó là một cái nghi thức, một cái nghi thức ở trong scrum thực ra là những cái chia sẻ với các bạn là có scrum có phân thành chia việc theo user story này nhưng mà ở đây là chúng ta chọn lọc qua những cái dứt gọn thôi không lấy đầy đủ của scrum thì xong còn nhiều thứ nữa thế thì họp nhé liên quan họp này, họp này thì phải hàng ngày họp định kì với nhau 15 phút, 15 phút họp online, dễ mà


## [57:50] Phần 16
quan trọng là các bạn thống nhất với nhau và xây dựng thành văn hóa thôi thứ hai là các vấn đề về mặt kỹ thuật đừng ngầm hiểu là đã hiểu hết rồi các bạn nên duy trì văn hóa và thực hiện nhiều technical meeting kể cả với mentor xin họp 5 phút không cần họp nhiều hơn họp càng dài thì càng khó sắp xếp họp ngắn thì dễ sắp xếp mà nó đi vào một cái vấn đề rất cụ thể rồi, đấy thì là những cái phần mà liên quan đến quản trị dự án thì bọn em hình dung là quản trị dự án nó giống như là một cái khung ấy dung như là đội nhóm của chúng ta nó như là một cái con tàu nó là con tàu, thì các

[58:36]
kỹ năng quản trị dự án anh vừa chia sẻ ở trên thì nó cho bọn em một cái đường dài nó cho một cái đường dài và nếu bọn em tuân thủ theo những cái đấy, thì bọn em sẽ giống như mình có một cái đường dài mình sẽ giảm thiểu được các cái rủi do để chúng ta đi được đến đích nhưng mà cái chuyện quản trị dự án đấy nó mới chỉ là một nửa câu chuyện thôi câu chuyện thứ hai là cái câu chuyện mà thực sự là khi mà các bạn làm việc vối họp với nhau có thể là chúng ta đã làm chuẩn hết mọi thứ rồi đã có quy định rồi, có phân vai trò rồi, có chia việc rồi, có lộ trình rồi, đấy có họp với nhau hàng ngày, nhưng mà

[59:22]
con người con người làm việc với nhau nó vẫn sẽ có những cái vấn đề để phát sinh nó có thể xảy ra thế thì trước tiên có một cái mà anh muốn chia sẻ với bọn em đấy là bốn cái dạng tâm lý của nhóm, cái này là một cái nghiên cứu mà người ta cũng đã nghiên cứu và được sắc thực ở rất nhiều nơi rồi nói chung về mặt lý thuyết thì nó đúng nên là mình không tranh cãi về mặt lý thuyết á ta chỉ quan trọng người ta phân tích xem cái này nó nói về cái chuyện gì, thì nghiên cứu này nó nói rằng là một cái nhóm một cái đội vũ quan người khi mà làm việc với nhau bao giờ nó cũng phải đi qua bốn giai đoạn bốn giai đoạn giai đoạn đầu tiên là giai đoạn forming này

[60:08]
đây là cái giai đoạn tuần này các bạn vừa mới họp nhóm với nhau đúng không rất là hào hứng đúng không mọi người mới tham gia cuộc thi chụp ảnh tưng bừng chia sẻ lên Facebook dùng đồ anh em của tôi thế nó đấy kia các bạn cần nhớ các bạn cần nhớ này ngay sau giai đoạn forming chúng ta sẽ có một giai đoạn storming giai đoạn storming là giai đoạn sóng gió cái giai đoạn này nó là cái giai đoạn mà các bạn hình dung là mỗi người đến từ một cái background khác nhau, độ tuổi khác nhau rồi tham gia cái chương trình này với một cái mục tiêu khác nhau, rồi góc nhìn khác nhau nữa thậm chí là cái trải nghiệm của mọi người về AI nó cũng khác nhau thế thì khi mà có nhiều thứ khác nhau như thế

[60:54]
mà gom lại vào với nhau thì cái chuyện là nó va chạm, nó có ma sát nó là chuyện chắc chắn là nó sẽ xảy ra đúng không ạ nó đã nó sẽ có chuyện đấy là rất bình thường nhé cái chuyện mà xảy ra xung đột là chuyện rất bình thường chắc chắn là các bạn phải trải qua nếu như các bạn muốn trở thành một nhóm thành công và không có cái nhóm nào nó không trải qua cái giai đoạn này cả và đến hôm nay mới là ngày hôm nay là ngày thứ 5 thì CoHop 3 cũng đã nhận được vài cái issue của một số các bạn gửi lên rồi đã có một số các bạn đã gửi lên issue và từ cái kinh nghiệm anh tham gia giải quyết những issue của các nhóm trong


## [61:40] Phần 17
CoHop 1 và 2 thì anh có thể khẳng định là chắc là phải đến trên 90% vấn đề của các nhóm nó là vấn đề quan người nhưng không phải vấn đề về mặt kỹ thuật đấy, thế là hầu như là hầu như là không có cái nhóm anh không nhớ là có cái nhóm nào mà đưa gửi issue về ban tổ chức liên quan đến cái vấn đề kỹ thuật như kiểu là để bài này khó quá bọn em không làm được hay là bọn em làm nó thất bại xong hay hoặc là cái này bọn em không tìm được server hay gì thì hầu như hầu như là kiểu đối lại không thấy có các thiếu nại hay là các câu hỏi hay là vấn đề liên quan đến chuyện về mặt technical mà tỉnh lệ chiếm đến trên 80%

[62:26]
các issue là do nội bộ trong nhóm các bạn xung đột kể nhau thế thì nó có một cái như thế này nó có một cái các bạn cần ghi nhớ này là nói chung là trong cái trạng thái mà khi các bạn xung đột về nhau thì các bạn sẽ cảm thấy rất là khó chịu và các bạn rất dễ nhảy đến kết luận cái này chúng ta nhớ lại về cái câu chuyện Thầy Bòi xem Void đúng không thì khi mà chúng ta đến từ các cái background khác nhau chúng ta nhìn cùng một cái sự vật lớn mà chúng ta có bị ảnh hưởng bởi các cái trải nghiệm cá nhân và cá nhân nữa thì nó rất dễ dẫn đến tình trạng

[63:12]
mỗi người nhìn cái sự việc đấy ở một cái góc hoàn toàn khác nhau có người nhìn thấy voi, chân voi nhưng cái nguy hiểm ở đây là gì cái nguy hiểm ở đây là các bạn thấy rất là chắc chắn về cái mình nhìn thấy với ông Thầy Bói mù ông sờ vào chân voi, ông ấy khẳng định chắc chắn luôn là cái này là chân voi rồi thằng nào mà bảo là đây là cái voi voi là thằng ấy là sai, hòi láo ông mà sờ vào voi voi cũng thế ông ấy cũng rất chắc chắn vào cái góc nhìn của mình và thông thường thông thường thì trong cái trong cái lúc mà mọi người đang cảm thấy, cảm xúc nó đang rất là cảm thấy negative và mọi người rất là chắc chắn về cái góc nhìn của mình là cái lúc mà mọi người dễ bị

[63:58]
một cái hiện tượng mọi người nhảy đến kết luận nhảy đến conclusion ví dụ như là mình họp mình thấy cái ý kiến của cái ông này nó hơi lý thuyết quá hay là chắc là ông ấy chưa làm, bép nhiều ông ấy chọn cái công nghệ không được thực tế cho làm nha ngay lập tức là chúng ta cảm thấy khó chịu chúng ta nghĩ là nếu mà làm với cả cái ông này lưỡi thì chắc là sản phẩm nó sẽ không được ok đâu, xong rồi kết quả nó sẽ không được tốt, nó đánh mất cơ hội của bản thân nghĩa là cái tư duy của bộ nã hoang người là rất dễ khi mà chúng ta khó chịu thì chúng ta rất dễ nhảy đến kết luận và chúng ta suy diễn ra thành các hệ quả

[64:44]
nó cực kỳ tệ và có một câu lập đi lập lại trong các issue của các đội mà gửi lên ban lột trước là thường có một issue là nếu cứ như tiếp tục như thế này thì em cảm thấy em sẽ không thể làm việc được với anh ABC và cái sản phẩm nó sẽ không được tốt bao giờ nó sẽ có một conclusion kiểu như vậy thế thì chúng ta cần phải vượt qua giai đoạn này như thế nào cái đầu tiên là các bạn cần phải nhớ đến cái anh vừa nói ở trên chúng ta chỉ có 6 tuần thôi và gọi là cái đại sự ở đây là các bạn


## [65:30] Phần 18
phải ra được sản phẩm trong 6 tuần đấy và tất cả các team mà gãy giữa trừng hoặc là xảy ra sự cố sung đột dẫn đến chia tách team ở giữa trừng thì đều không có kết quả tốt đấy là một cái cái kết luận từ data thế nên là cái đầu tiên để các bạn vượt qua nhé nó gọi là đầu tiên là phải vì đại sự vì chính các bạn đầu tiên các bạn thành phần trong nhóm mà không giữ được đoàn kết là ảnh hưởng đến bản thân các bạn đầu tiên chứ không phải là các bạn nhảy sang nhóm khác hay là cái đâu các bạn nhảy sang nhóm khác thì nó cũng không chắc chắn là các bạn không gặp lại những vấn đề đấy thứ 2 là cái quá trình mà các bạn nhảy sang là các bạn làm quen các thứ thì có khi là các bạn

[66:16]
vừa sang thì cũng đã hết hết thời gian rồi và cái thứ 2 chúng ta cần nhớ rằng là chúng ta cần bình tĩnh, chúng ta chậm lại một chút bao giờ các bạn phải có nguyên tác là các bạn chậm lại một chút, các bạn đừng ra quyết định, không bao giờ ra quyết định trong lúc mà cạp xúc nó đang không ổn định đấy ngay đầu co hotbar có một số bạn cũng gửi issue, gửi ticket lên rồi đến khi mà ban tổ chức tìm hiểu kỹ hơn thì các bạn lại chủ động các bạn đóng cái ticket lại có nghĩa là các bạn cũng gửi cái ticket lên trong một cái tâm trạng cạp xúc các bạn này cũng chưa suy nghĩ thấu đáo rồi có thể là nóng giận bực mình đâu

[67:02]
cái thứ 2 là các bạn luôn cần ghi nhớ, nhớ cái câu chuyện Thầy Bói xem Void nhớ rằng là cái dạng storming này nó là chuyện bình thường nếu mà trong nhóm các bạn mà nó không xảy ra cái chuyện này hoặc là các bạn rất là may mắn, hoặc là nó đang ổn định mà nó chưa xảy ra rồi thôi thế thì chúng ta phải coi cái chuyện này nó là cái bình thường mà bình thường thì nó giống như kiểu trời nắng thì có ngày trời mưa không phải là cái ngày trời mưa thì các bạn chúng ta không tham gia nữa chẳng hạn chúng ta biết rằng trời mưa rồi nó sẽ là nắng thôi nó là một cái quá trình tự nhiên thế thì chúng ta sẽ làm sao để chịu đựng qua cái ngày mưa đi và thông thường

[67:48]
không chỉ trong làm việc nhóm trong rất nhiều những cái mặt động khác về sau của các bạn thì cái nguyên tắc chung là bao giờ không bao giờ các bạn nên quyết định trong cái lúc mà các bạn đang cảm xúc nó đang nóng giận hay là nó đang đang trong một cái sự tiêu cực bởi vì trong cái trạng thái đấy là các bạn rất dễ biến thành kiểu tẩy bói sờ voi và các bạn nên để tối thiểu là sau 2 ngày tường là phải tầm sau 2 ngày sau 2 ngày và các bạn nên thu thập các cái evidence các cái proof rồi có đủ thông tin nếu mà thực sự đến lúc sau 2 ngày mà các bạn vẫn thấy là không được rồi có các các cái thông tin cho thấy là nó không ổn

[68:33]
có các cái bằng chứng cho thấy không ổn thì lúc đấy các bạn có thể ra quyết định thứ 2 nữa là có một cái kinh nghiệm nữa là các bạn cần có sự đối thoại với nhau phải phân lớn những cái những cái sự cố mà trong các cơ hoạch trước được giải quyết và một cách tương đối là đơn giản thôi thật ra là ban thổ trước cũng không không tham gia giải quyết bất kỳ cái gì cả mà ban thổ trước khi mà các bạn nhóm có xung đột mà gửi ECU lên thì thường là lúc đấy là do bản thân các tạ trong nhóm không nói chuyện được với nhau nữa và nó giống như kiểu tẩy bói sờ voi, mỗi ông đang bảo vệ một cái mỗi ông ở góc nhìn của mình đều thấy là mình rất đúng


## [69:19] Phần 19
không thể nào nó không đúng được vì rõ ràng là sờ thấy như thế mà nhưng mà thực sự là góc nhìn của mỗi người nó hoàn toàn có thể khác nhau được như câu chuyện thầy bói sờ voi thôi cho dù mình cảm thấy là cái mình đang cảm nhận nó đúng đắn đến mức độ nào thì thật ra nó cũng chỉ là một góc thôi thì cái xử lý của ban tổ chức thì phần lớn, phần lớn là họp cùng các bạn và cho mỗi bạn là tự nói ra câu chuyện ở góc nhìn của mình, thế là các bạn có một cái cuộc đối thoại thẳng thắn nói ra cái góc nhìn của mình khi mỗi bạn nói ra góc nhìn của mình thì thực ra là là rất ít trường hợp

[70:05]
rất ít trường hợp là các thành viên trong nhóm thực sự là kiểu vô trách nhiệm hoặc là không làm thế nào đấy, còn đại đa số trường hợp thì đều là các thành viên trong nhóm đều đã tham gia đều hướng đến mục tiêu chung là vì sản phẩm thôi nhưng mà cái cách tiếp cận nó khác nhau và nó dẫn đến cái chuyện là kiểu như là không có người đứng ra hòa giải không có người đứng ra giải thích khi mỗi người nhìn ở một góc khác nhau thì mọi người đều cho là đúng cảm thấy khó chị thế thì khi mà các bạn đi qua giai đoạn này rồi các bạn duy trì được cái chuyện là kiên nhận và các bạn duy trì được sự đối thoại ở trong team thì vì sao mà anh nói câu chuyện là hợp daily stand up và hợp technical ngắn

[70:51]
là cực kì quan trọng, nó không phải là chuyện báo cáo thông tin đâu nó là cái chuyện mà các bạn duy trì sự đối thoại trong nhóm và khi mà các bạn đối thoại face to face thì các bạn sẽ sẽ cảm nhận được intention, sự nhiệt tình, viewpoint của người khác đó là con người được thiết kế để làm việc đấy khi mà chúng ta chỉ nhắm tin chúng ta gửi email chúng ta chat qua Discord thì rất dễ diễn giải sai cái ngự cảnh và diễn giải sai góc nhìn dẫn đến mâu thuận các bạn sẽ lưu ý khi mà xảy ra những sự cố thì thứ nhất là chúng ta nên nói ra chúng ta nên nói ra nên có cái

[71:37]
lắng nghe góc nhìn từ những người khác và sau khi mà lắng nghe xong các thứ rồi thì bắt đầu chúng ta sẽ có một cái góc nhìn rộng hơn nhìn rộng hơn để chúng ta xem là cái vấn đề đấy nó chỉ là hiểu rầm hay là nó có khúc mắt thật sự, khi mà có vấn đề khúc mắt thì các bạn cũng nên kiên nhẫn, như anh nói vì đại sự có những cái nào mà bỏ qua được mà không thể chấp vặt được thì nên bỏ qua thì chúng ta tập trung vào cái mục tiêu chung và anh nghĩ là cái này nó cũng là một cái bài tập cho các bạn trên trình này nó không chỉ là trên trình cho các bạn về làm việc AI nó cũng là một cái cơ hội để các bạn được thực hành

[72:23]
về về làm việc với nhóm bởi vì ví dụ như là trong trong cái chương trình này các bạn có thể rèn luyện cái việc là khi mà xảy ra một cái sự cố nếu bạn kiên nhẫn, bạn tình nhau để cùng giải quyết thì nó sẽ như thế nào còn giả sử, như là sau này các bạn vào môi trường công việc rồi thì nó sẽ rất khó ví dụ như là lúc này sau này cái người mâu thẫn với bạn là xếp của bạn, hay là đồng nghiệp của bạn hay là cái người ở bộ phận khác thì lúc đấy các bạn rất là khó các bạn thực hành được cái chuyện này rất khó thực hành cái chuyện nêu thẳng vấn đề ra, trao đổi thẳng thẳng với nhau rồi đi qua hết cái quá trình này


## [73:09] Phần 20
trong các môi trường khi các bạn làm việc cực tế thì nó có nhiều lợi ích khác gắn bó với nhau hoặc là các bạn sẽ không dám nêu vấn đề ra nữa thì có thể là bạn sẽ luôn ở trong cái tình trạng này và chẳng qua là không nói ra mà thôi không có trải nghiệm đi đến giai đoạn này thế thì, cái phần thưởng khi các bạn đi qua giai đoạn này là cái gì là đội nhóm bắt đầu hiểu nhau và nó sẽ đến giai đoạn performing là giai đoạn thăng hoa và những đội nhóm làm việc sốt không phải là những đội nhóm ngay từ đầu không có cãi nhau gì cả mà là những đội nhóm có cãi nhau thậm chí cãi nhau nhiều nhưng họ tìm ra được cách giàn xếp

[73:55]
với nhau đây, anh lấy ví dụ nó có hai dạng xung đột nhé nó có hai dạng xung đột đó là cái xung đột cá nhân và xung đột kỹ thuật xung đột cá nhân là gì xung đột cá nhân là xung đột về cái tôi, cái thái độ xung đột về hoặc cái lưu còn xung đột về kỹ thuật là gì xung đột kỹ thuật là mỗi người thấy cái giải pháp này tốt hơn hay là làm tính năng sản phẩm nên làm cái kia thế thì chúng ta nên phiên khích cái xung đột kỹ thuật này cái nhóm performance hiệu quả là cái nhóm mà các thành viên có thể discard về nhau

[74:41]
về những cái vấn đề giải pháp về mặt kỹ thuật những cái xung đột về phương chọn sản phẩm, nhưng mà đây là discard trên cái tinh thần tốt cho sản phẩm và discard một cách nó có tính chất tính chất trưởng thành các bạn discard dựa trên bằng chứng dựa trên các lập luận và chúng ta sẽ có cái người ra quyết định cuối cùng ví dụ như là thảo luận về ấy thì có cái vai trò teclis bao giờ cũng phải có một cái nguyên tắc là phải có một cái người ra quyết định cuối cùng và khi mà người đấy đã ra quyết định rồi thì là các thành viên khác là tuân thủ còn hạn chế cái xung đột cá nhân hạn chế xung đột cá nhân thì bằng cách là

[75:27]
bằng sự chuyên nghiệp này bằng cách làm việc dựa trên cam kết này và bằng cái việc và hướng đến cái mục tiêu chung đấy và not một cái cuối nếu mà các bạn cảm thấy cái chuyện nói ra nó khó quá bởi vì nghĩa là nhiều bạn mạnh về công nghệ thì các bạn là dân bạn sẽ cảm thấy rất là ngại nếu mà phải nói trong một cái cuộc Daily Standup ngại nổi ra các vấn đề thì nó có một cái bài tập như thế này bài tập rất là đơn giản thôi là bài tập quan sát xét, net, collect ví dụ như là cuối hoạt động Daily Standup mỗi ngày thì có thể là

[76:13]
bạn trưởng nhóm sẽ cho một cái form ẩn danh thì các thành viên nhóm có thể là điền một cái quan sát điền một cái quan sát từ góc độ của mình điền một quan sát góc độ của mình điều gì khiến các bạn cảm thấy buồn điều gì mà cảm thấy các bạn đang kiểu rất là tức giận điều gì ở tim mà thấy các bạn thấy hạnh phúc, vui, cần phát huy và các bạn lưu ý là thứ nhất là cái này chúng ta sẽ nhận xét ẩn danh với hai là chúng ta chỉ nói ra từ góc độ quan sát của chúng ta thôi chúng ta sẽ không chỉ trích chúng ta quan sát là ví dụ tôi muốn là nhóm họp nhiều hơn nhưng mà nhóm họp ít quá và mỗi khi thông báo nhóm thì mọi người


## [76:59] Phần 21
không phạt hồi gì cả thấy thở ơ thì tôi cảm thấy tức giận với cả cái này thì các bạn nên làm cái này nếu mà cảm thấy cái việc nói thẳng ra trong Daily Standup nó khó thì có thể là làm cái này gửi vào ẩn danh và khi mà các buổi Daily Standup thì các bạn lôi cái này ra các bạn coi nó là data thôi là dữ liệu để cùng nhau phân tích và cải tiến thôi, thì đấy là một cái cách để làm sao chúng ta lại bỏ sự bất mãn và hiểu nhầm không để nó âm ỉ, nó bủ với khi nó bùng ra thì nó rất là khó xử lý thế thì sau buổi hôm nay sau buổi hôm nay

[77:44]
tôi tổng kết lại các bạn nên làm gì, nên lập project charter này thứ 2 là nên phân định vai trò trong team này thứ 3 là tạo cái form quản đí dự án của team và gắn mọi cái đường link, mọi cái tành liệu thứ 4 là chốt user story tuần 1 để có thể làm luôn OK, thì đây là một số những cái chia sẻ của anh quan đến công tác quản trị dự án và quản lý nhóm thì hy vọng là cũng mang lại cái giá trị cho các bạn bây giờ là các bạn có những câu hỏi cụ thể gì nhé, các bạn có thể gửi thì anh sẽ giải đáp thêm

[78:32]
có bạn nào có câu hỏi nào không anh gửi lại cái file cái folder này, có ở trong Discord cũng đã chia sẻ rồi đấy, nếu bạn nào mà cần các bạn có thể lấy thêm ở đây nhé có bạn nào có câu hỏi không nhỉ

[79:20]
cái file anh gửi ở trên ấy rồi nhé rồi anh mời bạn Đức nhé bạn Đức team 65 bạn Đức có câu hỏi thì bạn Đức bật link lên nhé anh trả lời trước câu hỏi của bạn Tiến bạn Tiến có hỏi là đề tài của mình có thể đem cho các thầy cô được đợi đại học phản nhận được không cái này là hoàn toàn được Tiến nhé cái này hoàn toàn được và khuyến khích nhé

[80:05]
các bạn nên tìm kiếm các stakeholder mục tiêu của chương trình này của chúng ta thứ nhất là để các bạn làm ra được kiếm cái sản phẩm thứ hai là trong các kỹ năng làm sản phẩm AI bây giờ thì càng ngày nó càng thiên về kỹ năng có tính chất tổng hợp không chỉ là kỹ năng về mặt kỹ thuật nữa vì các bạn làm với file coding các bạn biết rồi AI ngày càng cốt tốt nếu mà các bạn kỹ sư chỉ tập trung vào kỹ năng cốt thì nó sẽ không đủ và kỹ năng mà các bạn tìm kiếm được các nguồn lực đặc biệt là nguồn lực chuyên gia góp ý cho sản phẩm của mình và dùng thử sản phẩm của mình


## [80:51] Phần 22
rồi đưa ra các đánh giá là cực kỳ tốt và cái đấy thì sẽ luôn được đánh giá cao trong tổng điểm cuối cùng rồi mời các bạn các bạn nâng rưa tay nha mời Mai Hồng Sơn Hồng Sơn bật tích lên nha Hello ạ Dạ chào anh Em muốn hỏi là

[81:36]
trong trường hợp là cái mentor của nhóm mình mà trả đời không thả đáng thì bọn em có được hỏi các mentor của các nhóm khác đúng không ạ? Anh nghĩ là là nên hỏi chắc có thể hỏi Vậy là mình không nên vội tàn kết luận là mentor đó mình trả lời không thả đáng Ý là không phảm án được cái câu hỏi của mình Ừ thì bọn em hoàn toàn có thể hỏi nhưng mà như anh vừa nói khi mà team hỏi nên đặt câu hỏi rất cụ thể và nên có đặc tạng tính năng nhé Vâng

[82:22]
Với cả có một cái nữa Vậy là trong chương trình này cái vai trò của mentor là hỗ trợ bọn em và hỗ trợ về mặt phúc ý chứ mentor không làm thay Thế nên là trong câu hỏi và cách hỏi mentor bọn em đừng hỏi những câu kiểu để mentor làm thay theo kiểu bọn em làm đề tài này bọn em không biết bắt đầu từ đâu Bây giờ cái phần này có cái model nào không ánh kiểu vậy, nghĩa là đừng hỏi những câu hỏi mà kiểu bắt mentor làm thay bọn em, bọn em nên chủ động trước và khi hỏi mentor ấy, bọn em báo cáo lại là bọn em đang gặp vấn đề như thế này, bọn em đã tìm hiểu như thế này như này, nhưng mà chưa được, bọn lại đang vướng ở chỗ này.

[83:16]
Vâng, em cảm ơn ạ. Rồi, anh mời bạn đào bước mạnh nhé. Chào anh ạ, anh nghe thấy em nói không? Rồi, anh nghe được. Trong buổi mentor duty hồi hôm qua, bọn em có được mentor phổ biến là sau khi kết thúc giai đoạn build, mentor sẽ chọn ra 3-4 dự án tốt trong nhóm để đề xuất lên đoàn thủ chức, chọn ra tốt mời cuối cùng. Thì em có câu hỏi muốn hỏi là 6 đến 7 tim còn lại, trong trường hợp đó 6-7 tim còn lại có cơ hội để thực tập ở các doanh nghiệp không ạ? Cái điều này là do mentor quyết định hay là do phiên bản tổ chức quyết định? Cái này thì bọn em yên tâm là tất cả các nhóm đều có phần demo sau 6 tuần, tất cả các nhóm đều có vào danh sách demo và sẽ được ban tổ chức chấm đánh giá riêng theo bộ tiêu chí của ban tổ chức.

[84:19]
Và bộ tiêu chí này thì anh cũng tiết thể luôn với bọn em là nó sẽ có 2 nhóm, nhóm A là đánh giá về các điều tố về kỹ thuật, bao gồm là bọn em có làm clean code hay không, có kiến trúc rõ ràng hay không, dùng AI như thế nào, đánh có bộ tiêu chí đánh giá AI hay không. Và nhóm thứ 2 là nhóm liên quan đến về mặt sản phẩm, sản phẩm có giải quyết được vấn đề người dùng hay không, UIOX có đẹp hay không, có mang lại giá trị hiệu quả hay không, có khả năng scale thị trường hay không. Bạn tổ chức sẽ nghe và chấm cho tất cả các bạn và có bảng đánh giá riêng. Thế còn phần đề xuất của Mentor chọn ra 3 đội lớn nhất thì đó là một cái trọng số để tham gia vào trong cái vòng vòng demo day trực tiếp với lại ban hiệu trưởng thôi, với lại VUNI thôi.


## [85:18] Phần 23
Cái này là 2 vòng tác riêng nhé, 1 cái là chấm demo day online là tất cả đội đều tham gia, sau 6 tuần. Còn cái thứ 2 là từ cái đấy sẽ chọn lọc ra nữa các đội mà sẽ demo trực tiếp với lại bên VUNI. Thế còn ngoài ra là từ tuần thứ 5 là tất cả các đội mà có sản phẩm MVP hình như cohort 2 là các bạn sẽ được ban tổ chức giới gửi giới thiệu tới các doanh nghiệp có quan tâm. Thứ nhất là các bạn nên làm sớm sản phẩm, làm xong sớm sản phẩm để làm sao đến tuần thứ 5 là các bạn được join vào cái nhóm gửi đi. Thứ 2 là cái cơ hội được nhận và các thứ của các bạn thì anh nghĩ là cơ hội rất là lớn, bởi vì hiện nay trên thị trường số lượng kỹ sư biết làm về AI rất là ít, cái này anh có thể khẳng định là rất là ít.

[86:25]
Thứ 2 là bọn em nên trong cái phần chọn đề tài này mình nên chọn đề tài thật là kỹ và trong cái tuần đầu tiên là cái tuần điều chỉnh đề tài, xác định mô hình kinh doanh, nghiên cứu hướng đi của sản phẩm thì bọn em rất nên làm cái khảo sát thị trường và nghiên cứu những sản phẩm hiện có đã có trên thế giới và ở Việt Nam. Nếu mà sản phẩm đã có trên thế giới thì mình khảo sát các tính năng của họ và mình làm sao mình chọn ra những tính năng cốt lõi xong rồi mình clone lại làm thành tiên bản Việt Nam là cũng ok. Ví dụ như anh nói gọi ý cụ thể như Google nói con notebook LL đúng không? Bây giờ nhóm nào mà làm clone lại được cái con đấy có thể không đủ hết tính năng nhưng mà làm được đến khoảng độ 80% 90% của nó là khá ok rồi.

[87:20]
Còn nếu mà sản phẩm ở Việt Nam đã có mặt rồi ví dụ một số bạn làm đề bài liên quan đến quản lí tung cư hay là bài toán triển sinh trường đại học các thứ thì các bạn cần phải nghiên cứu rất kỹ sản phẩm ở Việt Nam và các bạn phải tìm ra một cái ngách nào đấy, một cái đề xuất giá trị rất là sắc đen. Bởi vì là cái chuyện các bạn có được nhận hay không nó phụ thuộc rất nhiều vào chuyện là doanh nghiệp người ta có đang phát triển cái sản phẩm đấy không và đương nhiên là doanh nghiệp người ta phát triển cái sản phẩm đấy là người ta phải nhìn ra cái cơ hội ở trong đấy người ta mới làm đúng không, người ta mới đi vào cái mảng đấy nên là các bạn cần phải nghiên cứu thị trường.

[88:06]
Ok, rồi anh mời kia bạn, vừa rồi là bạn Nguyễn Minh Đức đúng không? Vừa rồi là em là Đào Đứng Bệ. À rồi ok. Em giáo anh thì em có một câu hỏi về cái phần định vai trò trong nhóm ấy thì theo anh, anh có nói là sẽ có những cái vai trò và phải đưa ra quyết định cuối cùng ấy. Thì em có một câu hỏi là mình có nên thông nhận cái ý hiệu của nhóm trước khi đưa ra quyết định cuối cùng không hay là cứ ai làm, ai làm cái có cái vai trò quyết định thì mình cứ quyết định thôi ạ? À, cái này nó không mâu thuẫn về nhau nhé.

[88:52]
Thứ nhất là chúng ta nên dân chủ, có nghĩa là team nên họp về nhau để quyết định là The Story sẽ làm những gì, có những cái thảo luận về nhau. Nhưng cái nguyên tắc cuối cùng để không bị rơi vào cái chuyện là tranh cãi, không hồi kết và không tìm ra được ai là người phân sử, người quyết định ấy thì nguyên tắc cuối cùng sẽ luôn phải trong nhóm phải có một cái người có vai trò. Và cái người đấy sẽ đồng cái vai trò là đưa ra quyết định và khi mà người đó đưa ra quyết định rồi thì là cả nhóm sẽ cần phải tân thủ theo. Tất nhiên là sẽ có cái sắc xuất là người đấy đưa ra quyết định nhưng mà cái quyết định của người đấy vì nhiều lý do, nó có thể là nó mâu thuẫn với cả các thành viên của team.


## [89:38] Phần 24
Nhưng mà cái rủi ro đấy nó thấp hơn rất nhiều so với cái rủi ro là không có vai trò rõ ràng và khi mà xảy ra tranh cãi là cái vấn đề tranh cãi nhỏ nó không được giải quyết, nó trở thành tranh cãi lớn rồi sau đó không làm gì được với nhau nữa. Nói chung là bọn em cứ xác định là anh không nghĩ là có một cái quyết định gì về mặt technical hay thậm chí về mặt feature của sản phẩm mà nó quá lớn đến mức độ là mình phải khăng khăng làm theo cái hướng đấy, thực sự mà nói là thế. Anh chia sẻ cái bảng điểm của Ban Hổ chức, nếu có một cái gì đó bọn em nhất định phải làm đúng thì đó là tiệp chọn nách tận tập thách hàng và đề xuất tá trị.

[90:34]
Có nghĩa là trong tuần này này, cái đấy bọn em phải làm, chắc chắn là bọn em phải làm phải đúng và cái file, file project charter, cái file đấy là file nên làm đúng. Còn tất cả những cái thứ còn lại về sau thì không có cái gì mà quyết định sai mà nó dẫn đến sụp đổ cả dự án đâu. Chỉ có chọn tập khách hàng sai và chọn cái đề xuất tá trị sai là sản phẩm dự án nó dễ đi lạc hẳn hướng thôi. Còn lại sau đấy thì dùng ngôn ngữ gì, có làm tính năng này hay không, đấy thì nó không quá quan trọng đâu. Ok, anh mời bạn Khôi nhé.

[91:21]
Em chào anh ạ, thì em có một câu hỏi về các cái phần đề mô trong giai đoạn ban đầu. Thì nếu như mình đề mô trong giai đoạn ban đầu khi mình release bản đầu tiên, thì anh nghĩ mình sẽ nên triển khai ở một mức độ nào cho nó hợp lý về có vừa có thể vừa cân đối giữa việc thu tập đủ đánh giá cũng như là chi phí của team ạ. Cái này thì như anh vừa chia sẻ cho bọn em cái form, bọn em nên dùng user story để bọn em lên lộ trình sản phẩm. Và bọn em nên làm cái roadmap đấy ngay từ đầu. Để bọn em xem ở trong cái file phản trị dự án, nó có cái phần danh sách user story và lộ trình.

[92:11]
Khi bọn em đã estimate được là user story này dự kiến sẽ làm trong bao lâu, thì khi đấy bọn em sẽ biết là đến tuần thứ 3 mình có sản phẩm, thì tối đa bọn em làm và bắt buộc là cần những user story này. Cái này thì nó liên quan rất là mật thiết từ cái chuyện giá trị đề xuất mang lại cho người dùng là gì. Và nó chính là cái project charter đấy. Bọn em phải xem là trong project charter bọn em phải định nghĩa thật rõ là thành công của sản phẩm là gì. Ví dụ như là một sản phẩm làm phân tích CV của các bạn sinh viên

[92:57]
và xác định những cái điểm mà các bạn ấy cần bổ sung để được chuyển dụng. Đấy thì giả sử làm một cái sản phẩm đấy, thì bọn em phải xác định được là cái metric đo lương tỷ đại thành công ở đây là gì. Ví dụ như là chúng ta xác định là metric to tỷ địa thành công ở đây, nó là cái điểm đánh giá CV do AI đưa ra trước và sau khi bạn ấy đã sửa sinh lại CV. Nếu mà mình xác định cái metric là như thế, thì cái sản phẩm MVP nó phải giải quyết được cái chức năng cốt lõi như vậy. Và mình kinh nghiệm là bao giờ bọn em phải bám vào cái đề xuất giá trị và cái metric to thành công, thì bọn em sẽ biết là tính năng nào là tính năng cốt lõi, làm đến đâu là vừa phải.


## [93:46] Phần 25
Còn nếu mà không có cái đấy thì đôi khi là có thể làm rất nhiều, nhưng mà sản phẩm nó vẫn công ra được cái chức năng lõi. Rồi, ok, anh mời bạn Minh nhé. Em chào anh ạ. Anh cho em hỏi là kiểu với mentor ấy thì mình có thể chủ động hỏi mentor để mà họp thường xuyên được không ạ? Hay là kiểu mình cứ phải đợi đến mentor tàu duty mới có thể họp ạ? Cái này thì bọn em có thể đề xuất bọn em nên chủ động trao đổi với mentor trên Discord.

[94:31]
Họp thì anh nghĩ là sẽ tùy từng mentor, nhưng mà nhìn chung các mentor thì cũng sẽ đều tương đối bận. Và thứ hai là số lượng hỗ trách của mỗi mentor là cũng khá là lớn. Thế nên tích tinh thần thì bọn em phải xác định mentor gọi là team mình phải chủ động đầu tiên. Mentor đóng vai trò như là hoa tiêu, các điểm mốc thôi. Ví dụ như mình chạy đến đây mà có dấu hiệu sai hướng thì mentor hỗ trợ bọn em chỉ lại đúng hướng đi. Chứ mentor không phải là một phần trong giải pháp của mình. Team phải chủ động trên team tìm kiếm, team động não, team suy nghĩ xem cách để làm như thế nào. Và nên tăng thường hỏi mentor trên Discord qua channel Mentor Duty.

[95:20]
Và đến tuần cuối cùng, là tuần thứ 6. Bắt đầu trước cũng sẽ khuyến kích các mentor sẽ có các meeting một một với lại mentor để hoàn thiện góp ý những phần cuối. Còn lại thì bọn em cứ chủ động đề xuất thôi. Tùy từng mentor, anh cân đối thời gian. Nếu bọn anh chị nào mà họp được riêng bọn em thì thì sẽ họp. Nói chung là bọn em cứ chủ động. Dạ, em hiểu ạ. Cảm ơn anh. Cảm ơn bản chia sẻ của anh. Chắc là anh sẽ giải giác thêm cho hai bạn nha. Với sau đó chúng ta sẽ chơi một cái trò chơi nhỏ để các bạn ghi nhớ được cái thông điệp côn loại của buổi hôm nay.

[96:10]
Giờ anh mời gặp Minh nhé. Em quên chữ bỏ tay. Em vừa trả lời. Giờ anh mời gặp Hưng. Chào anh ạ. Ok. Bữa nay trong bài giảng của anh thì anh có nói là một sản phẩm tốt thì mình nên luôn liên tục release và đưa sản phẩm cho người dùng với những feedback và tiếp tục cải thiện. Em định hỏi anh là với những cái sản phẩm mà với những cái đối tượng sử dụng rất đặc thù. Ví dụ như là ở trong cái đề tài của chúng em là

[96:56]
một cái agent hỗ trợ về QA cho reviewer khi mà cho cái lĩnh vực là data, label, link thì liệu chúng em có được gửi cái sản phẩm đấy ra ngoài khuôn khổ chương trình để mà những cái đối tượng sử dụng chính sử dụng không ạ? Thì để bọn em có một cái insight và nhận được những cái feedback thực tế nhất của... Cái đấy là rất khuyến khích nhé. Rất không? Cái đấy là rất là khuyến khích để cho các bạn... Các team được khuyến khích là go in public trong quá trình các bạn làm.


## [97:42] Phần 26
Mà nói chung là bây giờ làm sản phẩm thì các bạn phải go in public. Chứ không thể im im làm sản phẩm xong rồi đến khi nó xong xuôi mới release ra được. Cái cách làm sản phẩm đấy là cái cũ rồi. Bây giờ là tất cả các sản phẩm mà chúng ta phải vừa làm vừa build cộng đồng, vừa tìm kiếm những cái người dùng và thông qua cái đánh giá cái feedback kể góp ý của những người dùng đấy để nhanh chóng điều chỉnh sản phẩm. Tất cả những cái sản phẩm lớn nhất về AI bây giờ các bạn thấy đều như vậy thôi. Tất cả những cái sản phẩm đấy là họ đều tương tác rất là mạnh. Và take lead của team đấy họ cũng tương tác rất mạnh trên mạng xã hội. Dạ vâng, em cảm ơn. Tại vì trong cái buổi đầu tiên workshop thì có nói qua về cái việc là

[98:32]
bọn em ở trong cộng đồng phải đến một cái level nó đấy thì mới được public cái... Cái đấy là mình share cái sản phẩm của mình cho các team khác trong cohort nhé. Vâng. Chứ còn bọn em chủ động của em đi tìm người dùng tiềm năng ở bên ngoài là khải mái mà. Vâng, vâng, vâng. Ok, anh mời bạn Ngữ Thanh Tùng nhé. Dạ vâng, em chào anh ạ. Em đang có một câu hỏi mà muốn nhờ anh góp ý một chút về cái đề tài của bọn em này hả? Về bọn em đang làm cái đề tài là quản lý lực khách vào cho chung cư hay là các cái khu nhà ở.

[99:25]
thì khi mà là cư dân thì khi mà có khách đến chẳng hạn thì khách đến hay là shipper giao hay giúp việc đến chẳng hạn thì mọi người thường là phải qua một phía cổng bảo an để làm việc với bảo an xong rồi confirm với chủ nhà để khi mà vào được nhà thì bọn em đang giải quyết cái bài toán là khi mà khách có chủ nhà có khách đến chơi thì chủ nhà sẽ tự động sẽ tự sử dụng AI Agent để tạo mạng QR Code và lấy các thông tin của khách để điện vào trong cái hoặc là có thể là ra lệnh bằng giọng nói cho AI Agent xử lý các thông tin của khách đấy và sinh ra một cái mã thì cái mã đấy thì sẽ đưa cho khách hoặc là ship hoặc giúp việc hoặc là một ai đấy chẳng hạn thì người ta sẽ lấy cái mã đấy và người ta đến bảo an

[100:11]
và người ta quest người ta vào thôi thì với cái đề tài này thì anh mentor bọn em có góp ý là anh mentor bọn em có góp ý là anh có bảo là anh chưa có nhiều kinh nghiệm ở trên cái mạng này và cũng nên là bọn em đang muốn tham khảo bọn em đang muốn tham khảo thêm những cái ý kiến của các mentor khác cũng như là để bọn em có thể hoàn thiện và phát triển thêm về cái sản phẩm ấy ok cái này thì anh nghĩ ra trước tiên là là cái chuyện này nó cũng khá bình thường đúng không bởi vì một mentor phụ trách 12 team và mỗi mentor thì đương nhiên là sẽ có cái mạng mạnh mạnh yếu và cái mạng mà mình chưa làm bao giờ

[100:59]
ví dụ như là trong trường hợp mà mentor của mình không góp ý được cho mình về cái góc độ chuyên môn của ngành thì mình hoàn toàn là mình có thể là bọn em nên chủ động bọn em đi tìm những cái người dùng tiềm năng cái này bọn em phải xác định là vai trò của mentor ở đây thì vai trò cốt lõi là mentor là cái người giúp bọn em giữ nhịp và mentor là cầu nối giữa ban tổ chức và từng team để bọn em bảo đảm được là giữ nhịp rồi đưa bọn em góp ý về hướng đi, góp ý về tiến độ và về các trình bày thế còn cái thần chức năng liên quan đến góp ý về mặt định hướng sản phẩm

[101:46]
thì mentor, thứ nhất là không phải mentor nào cũng sẽ mạnh về cái background thứ hai là kể cả mentor có mạnh về background thì người mà góp ý tốt nhất về mặt hướng đi sản phẩm cho bọn em nó vẫn nên là nhóm người dùng tiềm năng và mình phải có kỹ năng mình tìm kiếm và mình tìm kiếm và mình phỏng vấn sâu với nhóm người dùng đó thế còn anh cũng chia sẻ bọn em như thế này là nếu như mà cái đề tài và mình chọn ấy mà mình cảm thấy là mình không có một cái hình dung được rõ ràng về người dùng cuối thì mình đã thử rồi nên thử ngay trong tuần đầu tiên này nha

[102:33]
nên thử ngay trong tuần đầu tiên này nếu mà mình thử và mình cũng không tìm được ai là cái nhóm người dùng tiềm năng cho cái sản phẩm đấy thì bọn em nên đổi đề tả đấy là cái anh khuyên bọn em bởi vì cái tiêu trí, một trong những cái tiêu trí cực kỳ quan trọng để bọn em làm sản phẩm nó có ổn ấy không là bọn em hình dung được rõ ràng về người dùng ở trong đầu nếu mà bọn em không giác định được sản phẩm của mình người dùng là ai và không có cách nào để tìm ra được một cái người thực tế một người dùng ở trên đời mà khớp với cái chân dung đấy thì khả năng rất cao là khi bọn em build sản phẩm ra là nó sẽ bị lạch cướng

[103:18]
ví dụ như là nó cũng có một số đề tài nó sẽ rất là khó để tìm người dùng chẳng hạn như là cái đề tài liên quan đến hệ thống anh nói một số những cái khó nhất chẳng hạn như là cái hệ thống Lost and Found dành cho xe taxi hoặc là hệ thống dự đoán, hệ thống dự đoán thời tiết để liên quan để thuật toán điều phối xe taxi Ví dụ như thế, đấy là những cái bài toán mà nó... thời gian nó cũng rất là hay nhưng mà để mà bọn em làm thì bọn em phải có các đối tác B2B kiểu như số lượng đơn vị xe taxi này những cái đơn vị đấy thì cũng hơi khó để tiếp cận

[104:08]
tất nhiên là phải cố thôi thì làm một sản phẩm thực tế thì bao giờ nó cũng phải cố gắng để tìm ra được người dùng và thông qua các mối quan hệ để tìm còn nếu mà cố mà vẫn không được thì nên chọn một cái đề tài mà mình có sự an hiểm Cảm ơn anh ạ Rồi, anh mời bạn Đông nhé Em chào anh ạ Anh sẽ giải đáp nốt cho 3 bạn thôi nha Bạn Đông, bạn Bích và bạn Hoàng nhé Vâng, thì tài liệu về Project Charter lúc nãy thì em mới được ban tổ chức cung cấp trước đấy thì nhóm em thì em cũng đang làm trên kỹ GRA còn ý dự án trên đó rồi

[104:53]
thì em hỏi là không biết là mình làm 2 trái xông xông hay là mình chỉ cần làm một cái thôi ạ Cái này thì tùy vào từng team nha nếu mà team đã quen thuộc làm với GRA và mọi người đều thấy ổn với việc đấy thì có thể cứ làm với GRA còn nếu mà cảm thấy nó bị overskill quá thì có thể làm trên cái form của anh Form của anh thì nó sẽ đặc biệt là phù hợp với những bạn mà 1 là chưa hiểu nhau từ trước chưa thống nhắc được cách làm việc và cần một cái cách làm việc đơn giản dễ dàng và đã chứng minh hiệu quả thì có thể dùng cái của anh Nếu mà team mình đã toàn, anh em rep đã toàn quen với GRA rồi

[105:39]
thì cứ làm theo GRA Vâng ạ, em có một câu hỏi nữa là theo kinh nghiệm và góc nhìn của anh Khi mà trong một team làn sản phẩm khi mà có mâu thuẫn xảy ra thì người PM, người đầu tàu dự án thì sẽ phải xử lý những tình huống khi mà các thành viên trong team xảy ra những mâu thuẫn như thế nào và anh anh có thể đưa anh một số use case thực bế mà anh đã xử lý trước đây không ạ? Thì anh nghĩ là đầu tiên là chúng ta phải phát hiện được vấn đề Đầu tiên là phải có một cái cách nào đấy để nhận diện ra được vấn đề

[106:24]
Chẳng hạn như là một bạn nào đấy thấy in-in không thấy nói đăng gì cả Người Việt Nam rất hay, rất hay có cái kiểu là có vấn đề bức xúc nhưng mà không nói ra mà mình sẽ kiểu như là passive aggressive mình sẽ lười trả lời của nhóm anh em Pink không phản thồi kiểu kiểu thế thì mình sẽ giấu hiệu về đấy Đầu tiên là người trưởng nhóm hay ai trong nhóm phải nhận ra vấn đề đấy Bước thứ hai thì sẽ cần lắng nghe khốc độ cá nhân mình sẽ phải hỏi, đây inbox cá nhân hỏi xem là đang có vấn đề gì không hay là do người ta đang bận thôi hay là có vấn đề gì khác Nếu vấn đề đó thường sự là có conflict ở trong nhóm

[107:14]
thì nên có một buổi gặp trực tiếp, buổi họp trực tiếp trong buổi họp đó cũng mang tình chất là lắng nghe, không phải cãi nhau mà buổi họp trực tiếp thì để cho mỗi người nói ra vấn đề từ cái góc nhìn của mình để mọi người chia sẻ cái góc nhìn Nói chung là quan điểm là nên có sự đối thoại và thẳng thắn Nếu kiểu cãi nhau xong một trận thì anh em thấy cảm xúc nó đi qua rồi Cái quan trọng nhất vẫn là làm sao cùng nhau giải quyết được bài toán này và làm cho sản phẩm thành công Cãi nhau một trận xong anh em lại làm lành với nhau Nhưng mà quan trọng là phải có sự đối xúc Các anh em nên tìm hiểu sâu về từng thành viên trong team của mình

[108:02]
Cái này rất quan trọng Anh thấy là có một số đội Các bạn chỉ làm việc với nhau, hoàn toàn có online Và các bạn hoàn toàn chỉ làm việc Các bạn có một số đội Các bạn có một số đội Các bạn có một số đội Các bạn có một số đội Các bạn có một số đội Các bạn có một số đội Các bạn có một số bulun Đó là trí làm việc Các bạn giao việc – inbox Sau đó là pension Thế đấy nó… Rất dễ thể hiểu lầm Các bạn nên Có những cái buổi get up riêng G mermaidqen riêng kia nhau Mọi người chia sẻ xem là background như thế nào Từ đâu đến, làm ở đâu, quá trình Học tập như thế nào, vì sao tham ra chương trình này, ký phòng cái gì

[108:49]
Sắp tới tỵ tận thiragep ở đâu Chúng ta nên hiểu nhau vår khuôn ngpresented Chúng 1 cái nix ở trên Discord Đó là một cái xai được Ban thổ chức cắn cho. Tôi nghĩ là giải pháp chính vẫn là câu chuyện mà lắng nghe, thẳng thắn và hướng đến mục tiêu chung. Nó là 3 cái kê vuốt để bọn em xử lý các mâu thuận. Còn hãm hiệu nếu đã cố gắng mà vẫn không giải quyết được thì lúc đấy mình escalate lên Ban thổ chức. Ban thổ chức có thể nhiều tuổi hơn thì có những góc nhìn nó rộng mở hơn. Thì hỗ trợ thêm cho bọn em. Ok, anh mời bạn Bích nhé. Anh trả lời lốt cho Bích và Hoàng. Sao hôm nay lại chơi một cái thừa chơi nhỏ thôi.

[109:38]
Em cho anh. Em đang gặp một cái vấn đề làm việc nhóm. Em thì cũng làm, cũng breakout của em thì cũng đang làm công ty và kiểu làm các sản phẩm cũng nhiều năm rồi. Nhưng mà khi mà làm cái nhóm ở công ty thì thường là hầu hết là mình đã biết được background của ít nhất là những thành viên trong đấy. Ít nhất đã xem được CV, ít nhất đã từng làm việc với nhau. Hoặc là cũng sẽ dễ trao đổi hơn bởi vì ít nhất còn 8 tiếng một ngày để mà nói chuyện với nhau. Chứ còn khi mà em tham gia chương trình thì em cũng tiếp cận mọi người như những gì anh mới chia sẻ.

[110:24]
Khi mà tuyển team thì em cũng sẽ đi chia sẻ. Em đi nói chuyện mọi người, xem background mọi người là ở đâu, làm công việc gì, định hướng thương live, làm các thứ như thế nào để có thể tìm đúng rôn. Và khi mà làm việc với nhau thì có thể connect với nhau tốt hơn. Nhưng mà thực sự thời gian nó quá ngắn. Tức là em nhận ra một vấn đề là thời gian gặp nhau hiện tại tính đến ngày hôm nay thì chắc chỉ khoảng một tuần mà gặp nhau mới được có 5 buổi rồi kiểu mỗi buổi. Nếu mà ví dụ có ngồi cạnh nhau cũng chỉ nói chuyện với nhau vài câu là nếu có ngồi cạnh nhau nhá. Còn nếu không ngồi cạnh nhau thì không biết cái người kia người ta làm gì hay là người ta làm việc ra sao.

[111:09]
Em cảm thấy có một vấn đề nảy sinh trong em về việc là sẽ hơi wonder được năng lực của người trong team. Tức là bởi vì khi mà em lên kế hoạch chẳng hạn là em bắt đầu phân tích về bài toán, bắt đầu phân tích những cái sâu hơn, bắt đầu phải đi connect những cái bên làm các công ty, làm về cái đề tài đấy. Thì khi mà như thế, khi bắt đầu connect với mọi người thì mọi người sẽ hỏi background nhóm mày như thế nào, định làm ra sao, các thứ thì thực sự kiểu mình chỉ biết những cái người ta đang nói thôi. Còn thực tế thức lực người ta như thế nào, nhiều khi mình cũng chưa để rõ được hoàn toàn. Với cả em lại gặp thêm một con flix nữa về việc là khi mà em phân tích bài toán dựa trên cái góc nhìn là business và em đi nói chuyện với mọi người,

[111:55]
thì nó sẽ khác với bài toán mà bên đẹp tuyết cận. Ví dụ như đã làm việc với nhau ở công ty thì sẽ hiểu nhau cách làm việc, các thứ thì sẽ dễ nói hơn. Còn đến khi mà bây giờ mới lập nhau có mấy ngày, em nghĩ là mình không tin người ta thì người ta cũng sẽ có những phần không tin mình. Bởi vì người ta cũng không biết là hẳn rõ là, à thì ông này, ông ấy đã làm những cái gì, kinh nghiệm của ông ấy ra sao mà ông ấy đi hỏi cho mình những câu này. Ví dụ như ở công ty mình có khi không ai thèm hỏi những câu này, nhưng mà em ở vị trí PO thì em là người phải đi hỏi những câu mà không ai muốn hỏi, và tìm những câu trả lời mà không ai muốn trả lời. Nên là khi em vào cái môi trường mà thời gian tìm hiểu nhau rất là ngắn như thế này thì em đang gặp cái vấn đề là không biết phải giải quyết cái vấn đề ở đâu.

[112:40]
Tức là bởi vì có họp hay không thì gặp nhau cũng chỉ được chắc 5 phút hoặc là 10 phút ở trường nữa. Thì anh nghĩ là câu hỏi của em rất là hay. Anh nghĩ là cái giải pháp đầu tiên là em cần phải rây ra những cái vấn đề mà em vừa nói với lại team của em. Nói chung là chỉ có cách là team gặp nhau nhiều hơn. Ví dụ mình là trưởng nhóm mình phải chủ động mình rây ra những cái buổi có thể là họp nói chuyện, họp tìm hiểu, hoặc là nếu mà có điều kiện các bạn nên họp offline với nhau, đi ăn trưa với nhau, ngồi cà phê riêng với nhau. Những cái đấy là những cái mà rất là cần thiết, tập biệt là trong giai đoạn ban đầu để mọi người cảm nhận được năng lượng của nhau và hiểu được cách làm việc của nhau.

[113:32]
Còn cái đấy thì cũng rất là khó để chúng ta phải có sự kiên nhẫn con người. Em không thể tập ngay một người và tin tưởng ngay người ta và hiểu ngay cách làm việc người ta được mà nó phải qua rất nhiều điểm chạm. Anh nghĩ là 6 tuần thì thực ra nó cũng không phải quá ngắn để có những điểm chạm liên quan thân thiết với nhau đâu. Chẳng qua bây giờ bọn em, team, bọn em phải có tăng thời gian lên. Ví dụ như là có điều kiện gặp nhau ở trên trường rồi nhưng mà mình gặp nhau có 15 phút và mình không có một cái session riêng, đi ăn trưa với nhau, chủ động như thế thì nó sẽ rất là khó để mọi người tìm hiểu sâu hơn về nhau. Thứ hai là những cái chính những vấn đề mà em vừa rây ra ở đây thì em nên rây ra trong cái cuộc họp cùng với cả team để nghe mọi người cùng chia sẻ.

[114:23]
Sau khi chia sẻ xong thì có thể dựa vào có cái khung anh gửi luôn ở trong cái file project chapter này. Nó có một cái mẫu quy định nội bộ của team. Rây với nhau các cái vấn đề, chẳng hạn như là vai trò trong nhóm mặt gì, quy tắc giao việc như thế nào, phương thức điên lạc và làm sao. Đây là một cái khung để bọn em có những cái topic để trao đổi với nhau. Và trong quá trình trao đổi thì cả nhóm thông nhận được với nhau về cái phần nào thì mình sẽ ghi lại ở đây. Và từ đấy dần dần sẽ xây dựng lên cái văn hóa làm việc của nhóm. Còn anh nghĩ là cái này, những cái thứ mà anh chia sẻ được thì anh chia sẻ rồi. Còn nhiều khi là nó cũng thuộc về kiểu phong cách cá nhân.

[115:08]
Có những người cẩy mở người ta rất dễ làm quen với những người khác, rất dễ có năng lượng để khuấy động. Nhưng mà có những người thì sẽ rụt rẻ hơn, hướng nội hơn, người ta sẽ cần sự quen thuộc rồi sau đó người ta mới chia sẻ xấu với các vấn đề khác chẳng hạn. Thì những cái đấy nó thuộc về kiểu mặt nó, hơi nghệ thuật một tí. Nhưng mà tinh thần trung là tăng cường cái sự gặp cỡ ở trong tim. Tăng cường lên, họp daily stand up với nhau, họp nhiều với nhau thì sẽ hiểu được hơn. Daily stand up, nhưng mà em không biết phải... Daily stand up với mọi người bởi vì kiểu dạng lịch học cũng khá là gắt. Ví dụ kiểu dạng là mọi người đi học từ 9 giờ xong rồi. Ví dụ em thấy kiểu có thể gặp nhau ăn trưa, nhưng mà thực sự ăn trưa cũng quá ngắn.

[115:58]
Ví dụ bọn em ngồi với nhau ăn trưa thì thời gian ăn không, thôi lên đã hết sư rồi. Hôm nay còn phải dếp hàng. Ví dụ không phải bọn em không ăn trưa cùng với nhau, ăn trưa cùng với nhau không nói gì mấy. Ví dụ đến khi người ta lên gác, ví dụ nếu muốn họp nhóm sau giờ họp chẳng hạn, sau giờ họp thì có những bạn nhà rất xa, bạn đi xe máy, thì đúng là bạn phải về nhà, bạn còn phải chuẩn bị để workshop chẳng hạn. Thì đúng là bạn không thể có thời gian để lại được. Thế xong cái là em sẽ chuyển sang là ok, vậy thì học online. Học online. Khi học online thì cũng có hợp với online được với nhau một buổi. Thế nhưng mà xong đến khi là cái là hợp một buổi xong có vẻ ok,

[116:47]
xong đến đến gọi là đến đến khi mà bắt đầu phân tích bài toán kỹ hơn chút. Thì đấy xong bắt đầu có những vô thuẫn kiểu dạ tư duy đép, tư duy PO, rồi các thứ. Các đây là xong người là... Nó tức là... Em hiểu là ai cũng sẽ phải cần thời gian để làm quen. Và thực ra một phần của cái việc em nói ở đây cũng chia sẻ cả kinh nghiệm của bản thân lẫn để cho mọi người cùng nghe luôn. Bởi vì em biết chắc chắn là 200 cái team ở đây chắc chắn là phải có vấn đề này hết. Không thể nó không có được. Bởi vì kể cả khi đã làm việc lâu năm hay là kiểu làm việc ngắn hay gì đó đều có vấn đề cả. Thế nhưng mà kiểu tức là... Em nghĩ rằng là...

[117:32]
Tức là cái khó ở đấy là kiểu niềm tin. Em nghĩ cái việc em hỏi này cũng là để củng cố lại niềm tin của em vào team của mình. Bởi vì kiểu dù sao thì em cũng là người chọn team. Từng người một vài em đã đi nói chuyện với mọi người và em hiểu rằng là mọi người đều có những cái giỏi riêng rồi. Nhưng mà đúng thật là khi làm việc và thỉnh thoảng nó sẽ kiểu... Kiểu sẽ bị hơi... Hơi không mang một chút. Bởi vì nó hơi gió nhanh quá. Ừ. Ok. Cái này em nghĩ là một góp ý rất là hiệu ức ấy. Cái này là những thứ mà các bạn nên rây tích ít lên ban hội trước đây này. Ok. Thì em nghĩ là... Anh cũng không nắm rõ được cái... Cái phần sắp lịch trên trường của các bạn như thế nào.

[118:20]
Nhưng mà em nghĩ là đây cũng là một vấn đề mà... Ban hội trước cũng sẽ phải giúp kinh nghiệm để tính toán. Bởi vì bản dân như anh, anh làm mentor cộng hợp 1 ấy. Thế là đến tận buổi mentor cuối có thời gian dành gian hơn. Hỏi, nói chuyện với các bạn thì biết là... Hóa ra là chương trình này là không chỉ dành cho các bạn sinh viên. Nhưng mà có rất nhiều các bạn là... Cũng đã đi làm rồi, hoặc là từ tâm vị khác. Rồi... Có những bạn từ Hồ Chí Minh, Cần Thơ ra. Đấy, có nghĩa là... Anh nghĩ là cái phần... Phần thông tin, rồi phần làm sao để on-boarding. Để các bạn on-bonding lại với nhau. Đúng là một vấn đề mà ban hội trước cũng sẽ phải tính toán thêm. Và cũng rất là mong là các bạn nhận được... Những cái feedback nhiều hơn.

[119:05]
Và đấy là những thứ mà các bạn nên gửi tích kít thêm vào ban hội trước. Đấy, anh nghĩ là cái việc đầu tiên để chúng ta giải quyết vấn đề là... Chúng ta phát hiện ra vấn đề. Và chúng ta rơi lên. Khi mà chúng ta rơi lên thì chúng ta sẽ phát hiện ra là... Hóa ra là... Có rất là nhiều người cũng có vấn đề chung như thế. Tại sao không có ai nói ra cả. Và khi mà chúng ta nói ra thì... Lúc đấy là chúng ta sẽ có... Bắt đầu là có của cái việc là... Để giải quyết nó. Vâng. Em nghĩ khó nạnh. Rồi, ok. Thôi bây giờ, bây giờ thì thời gian cũng hết rồi. Thì bây giờ chúng ta chỉ chơi một cái chó chơi nhỏ thôi. Chúng ta sẽ chơi một chó chơi nhỏ để... Các bạn có cái thông điệp. Nhớ lại được cái thông điệp của buổi hôm nay. Thì bây giờ mỗi bạn này, mỗi bạn suy nghĩ trong một phút.

[119:51]
Là các bạn hãy nghĩ ra một cái keyword. Mà bạn cho rằng nó là bí quyết. Để tham gia cái chương trình này thành công. Một từ đấy. Mỗi bạn chỉ chọn đúng một từ thôi. Một cái từ khóa. Một cái từ gì đấy mà các bạn... Nghĩ rằng đấy là bí quyết. Để các bạn sẽ tham gia cái chương trình này thành công. Rồi. Nghĩ nhanh vậy. Rồi, ok. Các bạn cứ viết đi. Các bạn viết đi. Rồi, có bạn nào chưa nhắn không nhỉ?

[121:54]
Ok. Qua câu trả lời của các bạn ở trong chat. Các bạn có nhận ra điều gì không? Các bạn có nhận ra điều gì không qua câu trả lời của các bạn đang nhắn vào nhóm không? Các bạn nhắn nhanh quá. Đúng rồi. Có bạn Lê Văn Tuệ có nói một ý. Đa dạng cái tôi đúng không ạ? Chỉ có một cái vấn đề là...

[122:40]
Cái... Bí quyết để các bạn nghĩ rằng nó là... Bí quyết để các bạn vượt qua được cuộc thi này. Đúng không ạ? Thì đấy là một cái vấn đề thôi. Nhưng mà chúng ta đã có ở đây... Rất là nhiều những cái ngóc nhìn khác nhau. Các bạn thì nói rằng nó là data. Các bạn thì là quota. Các bạn là đoàn kết. Các bạn là vui. Các bạn là token. Các bạn là chill. Các bạn là tư duy, cố gắng, lì, chủ động. Nếu mà thống kê ở đây... Chắc là chúng ta phải có khoảng tầm... Chắc anh nghĩ là không tới... Không dưới 30. 30 đến 50 cái phương án khác nhau. Đấy rồi. All in, release, ai. Hợp. Tìm quốc đại đần kết. Đấy.

[123:25]
Thì thì chỉ có một cái vấn đề. Vấn đề đó là cái bí quyết. Đang để... Các bạn vượt qua được cuộc thi này thôi. Chúng ta đã có số lượng góc nhìn nó rộng lớn như thế này rồi. Đấy. Các bạn có một cái điều các bạn nên ghi nhớ là... Mỗi người sẽ chỉ cầm một cái bảnh ghét thôi. Mỗi người cũng chỉ giống như một ông Thầy Voice of Void thôi. Cho dù chúng ta nhìn thấy cái chúng ta đang nhìn nó... Có vẻ là... Chắc chắn đáng tin cậy như thế nào. Các bạn chậm bạn một chút. Các bạn nhớ là... Có rất có thể là chúng ta chỉ cầm một bảnh ghét thôi. Và người khác thì người ta cũng đang cầm một bảnh ghét khác. Và hai cái bảnh đấy... Bởi vì nó khác nhau, thì nên là... Mỗi người lại có một cái hình dung riêng...

[124:12]
Trong đầu mình về cái bức tranh tổng thể. Đấy. Nhưng mà cái bức tranh tổng thể đấy của mỗi người nó có thể là nó... Nó không đúng. Và chỉ khi nào chúng ta ngồi lại, chúng ta trao đổi, chúng ta ghép lại với nhau. Thì lúc đấy thì chúng ta mới có một cái nhìn chuẩn. Đấy. Thế thì... Đây là một cái bài tập thường thành nó nhỏ thôi. Nhưng mà anh nghĩ là nó truyền tạt được cái thông điệp cốt lõi của cái buổi hôm nay. Đấy là mỗi khi mà các bạn trong team các bạn có vấn đề... Thì các bạn đừng vội đưa ra cái kết luận. Các bạn đừng đừng nhảy luôn xuống cái kết luận của mình. Và nghĩ rằng là của người khác là xa. Các bạn nên chậm lại một chút. Các bạn tạo một cái cơ hội để chúng ta ngồi lại với nhau. Và sau đó là mỗi người, giống như các bạn đã gửi cái câu hỏi vào trong chat...

[124:57]
Mỗi người nói ra cái góc nhìn, cái quan điểm của mình. Từ đấy là chúng ta nhìn thấy được là... Góc nhìn của mỗi người có thể rất là khác nhau. Và từ đấy thì chúng ta tìm ra được một cái giải pháp... Giải pháp hợp lý hơn. Trong đạo Phật người ta gọi là tìm ra con đường trung đạo, middle path. Thì... Cái con đường middle path đấy... Nó luôn là con đường mà nó sẽ tốt hơn. Là những con đường cực đoan. Ok. Ok. Thì đấy là cái thông điệp cuối mà anh muốn... Tổng kết lại cái buổi hôm nay. Chúc cho tất cả các đội chúng ta sẽ... Có được một cái mùa... Tham gia AI thực chiến rất là thành công. Và chúc cho tất cả các bạn đều... Hoàn thành được cái sản phẩm của mình.

[125:42]
Và đạt được cái mục tiêu khi mà chúng ta tham gia cái... Chương trình này. Ok. Chúc mọi người ngủ ngon nhé.
