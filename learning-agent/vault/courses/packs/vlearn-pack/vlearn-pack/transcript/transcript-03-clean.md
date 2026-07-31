---
course: packs
generated: '2026-07-31T18:34:14+00:00'
lang: vi
lesson: transcript-03-clean
maps:
- '[[MOC - packs]]'
module: vlearn-pack
source_file: packs\vlearn-pack\vlearn-pack\transcript\transcript-03-clean.md
source_hash: sha256:deebaff7e8b8b9d0d63723de5e668e6115cff1a12de083f8b522e9a732f5a010
type: lesson-note
---

```markdown
## Giới thiệu giảng viên và định hướng khoá học

**[T03-001]** [Hoạt động lớp: ổn định lớp, bật ghi hình; chưa có điểm danh nên bắt đầu buổi học luôn.]

**[T03-002]** Mình tên đầy đủ là [giảng viên], hiện tại đang là [[AI Research Engineer]] tại một startup ở Mỹ, chuyên về một [[AI design platform]]. Công việc của mình là phát triển một AI assistant giúp người dùng không có kinh nghiệm về thiết kế có thể tạo ra các sản phẩm thiết kế phù hợp với thương hiệu của họ.

**[T03-003]** Xuất thân của mình là từ [[computer vision]] và đã làm nhiều dự án về [[xe tự hành]], hiện tại mình cũng tham gia vào các dự án như [[smart data]] và [[Generative AI]], cũng như là giảng viên thỉnh giảng tại một số trường.

**[T03-004]** [Hoạt động lớp: khảo sát nền tảng học viên.]

**[T03-005]** Trước khi bắt đầu bài giảng, mình sẽ nhấn mạnh rằng bên cạnh lý thuyết, khoá học này sẽ tập trung vào kỹ thuật thực hành và những kinh nghiệm thực tế mà các bạn sẽ gặp khi đi làm.

**[T03-006]** Những slide bài học được chuẩn bị bởi một nhóm nhiều người với kinh nghiệm đa dạng, như [[product manager]] từ FPT Long Châu. 

**[T03-007]** Thời đại hiện nay là [[AI]], việc sử dụng AI để hoàn thành nhiệm vụ không chỉ là một chọn lựa mà còn là một yêu cầu thực tế trong công việc.

**[T03-008]** Sự khác biệt giữa người sử dụng AI hiệu quả và không hiệu quả chủ yếu nằm trong khả năng đánh giá chất lượng sản phẩm được tạo ra.

**[T03-009]** Khoá học này dạy các bạn cách phát triển một [[agent system]], một khuôn mẫu quan trọng trong các công nghệ hiện nay, từ xe tự hành đến [[giám sát camera]].

**[T03-010]** Có những lo ngại về việc học sâu trong [[computer vision]] và [[robotics]], vì mảng này đang có xu hướng thu hẹp, và đòi hỏi sự đầu tư lớn từ các bạn để có thể thành công.

**[T03-011]** Tuy nhiên, với sự bùng nổ của [[AI system]], cơ hội vẫn còn rất lớn cho các bạn trong tương lai.

**[T03-012]** Việc sử dụng AI trong giáo dục theo hướng mới cho trẻ em đang trở thành xu hướng, và việc phát triển một sản phẩm AI cho lĩnh vực này cũng là một cơ hội lớn.

**[T03-013]** Việc phổ cập AI ở các quốc gia như Trung Quốc cũng nhấn mạnh tầm quan trọng của việc kỹ thuật hóa các sản phẩm AI để có thể phục vụ nhiều lĩnh vực khác nhau.

## Ba track nghề nghiệp: AI Engineer, MLOps và AI PM

**[T03-014]** Hôm nay chúng ta sẽ tập trung vào [[product management]].

**[T03-015]** Track AI Engineer sẽ đào tạo các kỹ thuật xử lý kết quả của [[AI system]].

**[T03-016]** Track MLOps sẽ mang đến khả năng [[deploy]] kết quả của [[AI engineer]] vào thực tế, cùng với việc quản lý hạ tầng công nghệ.

**[T03-017]** [[Product Manager]] sẽ là người hiểu yêu cầu của khách hàng và truyền đạt đến đội ngũ kỹ sư, đảm bảo sản phẩm đáp ứng được nhu cầu và ngân sách.

**[T03-018]** Những dự án AI có thể gặp rủi ro và yêu cầu người PM cần có khả năng nhìn nhận rủi ro trong tổng thể hệ thống.

**[T03-019]** Trong quá trình phát triển những [[AI agent]], cần xây dựng hệ thống chắc chắn có khả năng xử lý tình huống tốt hơn.

**[T03-020]** Kinh nghiệm xây dựng hệ thống an toàn từ những sai sót là quý giá, giúp các kỹ sư và PM có thể điều chỉnh sản phẩm hiệu quả hơn.

**[T03-021]** Bài hôm nay sẽ tìm hiểu về các vấn đề và cách thiết kế hệ thống AI cho những case sử dụng cụ thể.

**[T03-022]** Những nguồn tài liệu bổ sung và sách sẽ giúp hiểu rõ hơn về hướng này trong [[AI engineering]].

**[T03-023]** [Hoạt động lớp: hỏi về group Discord.]

## Bài toán nào dùng được LLM: case lập kế hoạch du lịch

**[T03-024]** Cách để xác định vấn đề có thể sử dụng [[LLM model]] là rất quan trọng.

**[T03-025]** Các bạn có thể giải thích một số bài toán mà đơn giản là không thể giải quyết chỉ với một [[LLM model]].

**[T03-026]** [Hoạt động lớp: học viên thảo luận về việc lựa chọn giải pháp].

**[T03-027]** Một số bạn đã đề xuất việc sử dụng [[knowledge base]] để quản lý dữ liệu cần thiết.

**[T03-028]** Cần phải kết hợp giữa [[database]] để sao lưu dữ liệu cố định và [[API]] để cập nhật thông tin dễ dàng.

**[T03-029]** Nói đến kỹ thuật cụ thể hơn như [[Markov Model]] sẽ giúp giải quyết những bài toán cần sự phân tích xác suất.

**[T03-030]** Các bạn cần lưu ý rằng [[LLM]] có thể gặp khó khăn trong việc biểu diễn các vấn đề phức tạp.

**[T03-031]** Bắt đầu từ những yêu cầu đơn giản hơn và dần dần mở rộng là cách tiếp cận hợp lý.

**[T03-032]** Trong việc thực hiện dự án, tập trung vào từng yêu cầu một cách tuần tự là rất quan trọng.

## Giới hạn của LLM, tool calling và RAG

**[T03-033]** Các bạn cần hiểu mà không phải lúc nào [[LLM]] cũng đưa ra được câu trả lời chính xác cho những câu hỏi cơ bản.

**[T03-034]** Giải pháp cần phải đưa ra những tool để giúp xử lý nhanh hơn và hiệu quả hơn.

**[T03-035]** Việc thực hiện [[RAG]] sẽ tối ưu hóa thêm một số khía cạnh cho bài toán mà bạn đang giải quyết.

**[T03-036]** Bài học này sẽ giúp các bạn đánh giá đúng khả năng của [[LLM]] trong từng bài toán cụ thể.

## Chọn dự án: giá trị cạnh tranh, metric và mindset đi làm

**[T03-037]** Trong việc chọn dự án, điều quan trọng là xác định giá trị cạnh tranh so với đối thủ.

**[T03-038]** Các bạn cần tìm hiểu liệu khách hàng có thể tự thực hiện công việc mà sản phẩm của bạn cung cấp hay không.

**[T03-039]** Công tác chia nhóm dự án sẽ diễn ra liên tục để đảm bảo rằng mọi người đều có thể giao lưu ý tưởng.

**[T03-040]** Những dự án nên tập trung vào những vấn đề cụ thể để tránh mơ hồ trong quá trình làm việc.

**[T03-041]** Khi làm bất kỳ dự án nào, hãy luôn có mindset của một người đi làm, chủ động trong mọi tình huống.

**[T03-042]** Các bạn cần xem xét liệu bài toán đó có thể sử dụng [[AI system]] hay không và có thể tối ưu hóa không.

**[T03-043]** PM có trách nhiệm xác định những tiêu chuẩn đánh giá để theo dõi tiến độ dự án.

**[T03-044]** Mỗi dự án phải rõ ràng về đầu ra và hướng đi để không mất thời gian vào những vấn đề không cần thiết.

**[T03-045]** Mỗi thành viên nên có khả năng tự lập kế hoạch và quản lý dự án cho riêng mình.

**[T03-046]** Trong trường hợp bạn vẫn gặp khó khăn, hãy liên hệ với mentor ngay lập tức để tìm giải pháp.

## Bài toán sinh đề toán tự động — ý tưởng từ các nhóm

**[T03-047]** Cách thức tạo đề toán có thể dựa vào dữ liệu có sẵn và phương pháp thông minh hơn.

**[T03-048]** Cần có cơ sở dữ liệu để quản lý những cách giải bài toán và thông tin liên quan.

**[T03-049]** Khi sử dụng bất kỳ phương pháp nào, các bạn cần đảm bảo rằng nó có thể hoạt động hiệu quả trong thực tế.

**[T03-050]** Các bạn nên lưu ý đến chuyện đảm bảo tính chính xác của đáp án sinh ra từ [[LLM]].

**[T03-051]** Kết hợp giữa việc thu thập thông tin và phân tích là cực kỳ quan trọng trong quá trình xây dựng sản phẩm.

**[T03-052]** Việc đặt ra những tiêu chuẩn về dữ liệu sẽ giúp các bạn quản lý tốt hơn quy trình hazırlık.

**[T03-053]** Các bạn cần có những cơ chế kiểm tra thủ công để đảm bảo chất lượng của đề toán sinh ra.

## Lời giải: tách phần deterministic ra khỏi LLM

**[T03-074]** Các bài toán có tính xác định phải được tách riêng và không để cho [[LLM]] tự xử lý.

## RAG và cách thuyết phục sếp

**[T03-119]** Fine-tuning hay [[RAG]] cũng sẽ phụ thuộc vào tình huống mà bạn đang ứng dụng và cách bạn thiết lập hệ thống.

## Hệ thống nhiều thành phần: khoanh vùng lỗi và UI/UX

**[T03-123]** Lỗi trong hệ thống cần được báo về cho người dùng ngay lập tức để đảm bảo trải nghiệm của họ không bị giảm sút.

## Test AI system — chuẩn bị kịch bản hỏng

**[T03-142]** Kết hợp tạo ra các kịch bản hỏng sẽ giúp các bạn hiểu rõ hơn và chuẩn bị cho những tình huống xấu nhất.

## Bảo mật dữ liệu nhạy cảm khi làm việc với khách hàng

**[T03-138]** Hệ thống AI phải luôn đảm bảo các thông tin bảo mật cho khách hàng và tuân thủ quy định nghiêm ngặt.
```

## Khái niệm chính
- [[AI Research Engineer]]: Kỹ sư nghiên cứu về trí tuệ nhân tạo, tập trung vào phát triển và ứng dụng các công nghệ AI trong thực tế.
- [[product manager]]: Người quản lý sản phẩm, đảm bảo sản phẩm phát triển phù hợp với nhu cầu của khách hàng và mục tiêu kinh doanh.
- [[computer vision]]: Ngành nghiên cứu và phát triển công nghệ giúp máy tính "nhìn" và hiểu hình ảnh từ thế giới thực.
- [[Generative AI]]: Loại AI có khả năng tạo ra nội dung mới như văn bản, hình ảnh, âm thanh từ dữ liệu đã học.
- [[AI system]]: Hệ thống bao gồm các công nghệ AI được tích hợp để thực hiện các nhiệm vụ tự động.
- [[knowledge base]]: Hệ thống lưu trữ thông tin và dữ liệu, hỗ trợ trong việc truy cập thông tin khi cần thiết.
- [[RAG]]: Kỹ thuật tích hợp các nguồn dữ liệu từ nhiều nguồn khác nhau để nâng cao hiệu quả của các hệ thống AI.
- [[deploy]]: Quá trình đưa một hệ thống hoặc ứng dụng vào hoạt động thực tế và sử dụng bởi người dùng.
- [[LLM model]]: Mô hình ngôn ngữ lớn, một dạng AI có khả năng hiểu và sinh ngôn ngữ tự nhiên.
- [[Markov Model]]: Mô hình xác suất thường được sử dụng trong các vấn đề phân tích và dự đoán.
- [[AI design platform]]: Nền tảng thiết kế sử dụng AI nhằm hỗ trợ người dùng tạo ra các sản phẩm thiết kế dễ dàng hơn.
- [[MLOps]]: Quá trình tích hợp các phương thức phát triển và vận hành AI, đảm bảo hiệu suất cao cho hệ thống AI.
