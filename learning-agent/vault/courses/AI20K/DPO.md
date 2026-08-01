---
course: AI20K
generated: '2026-07-30T17:32:37+00:00'
lang: vi
lesson: DPO
maps:
- '[[MOC - AI20K]]'
module: ''
source_file: AI20K/DPO.pdf
source_hash: sha256:add51057853de10b6cfd669162394217df763985134f3cea80ca4d689055af2c
type: lesson-note
---

```markdown
## Slide 1 — Giới thiệu về Tối ưu hóa sở thích trực tiếp

Trong khi các mô hình ngôn ngữ lớn không giám sát (LMs) học được kiến thức rộng và một số kỹ năng suy luận, việc đạt được sự kiểm soát chính xác hành vi của chúng là khó khăn do bản chất hoàn toàn không giám sát trong quá trình đào tạo. Các phương pháp hiện có thường thu thập nhãn người dùng về chất lượng tương đối của các kết quả tạo ra từ mô hình và điều chỉnh mô hình không giám sát để phù hợp với các sở thích này, thường với việc học tăng cường từ phản hồi của con người (RLHF). Tuy nhiên, RLHF là một quá trình phức tạp và thường không ổn định [...] Rồi từ đó, chúng tôi giới thiệu một phân phối mới của mô hình thưởng trong RLHF, cho phép trích xuất chính sách tối ưu tương ứng một cách dễ dàng. 

<!-- src: ... -->

## Slide 2 — Các bước chính trong quy trình RLHF

Quy trình RLHF thường bao gồm ba giai đoạn chính:

1. Tinh chỉnh giám sát (SFT)
2. Mô hình hóa phần thưởng và thu thập sở thích
3. Tối ưu hóa RL

Giai đoạn SFT bắt đầu bằng việc điều chỉnh mô hình đã được đào tạo trước với phương pháp học giám sát từ dữ liệu chất lượng cao cho các nhiệm vụ hạ nguồn, nhằm thu được mô hình $\pi_{\text{SFT}}$.[...] Tại giai đoạn thứ hai, mô hình SFT được kích hoạt với các đầu vào để tạo ra các cặp câu trả lời.

<!-- src: ... -->

## Slide 3 — Tối ưu hóa Sở thích Trực tiếp (DPO)

DPO là một thuật toán tối ưu hóa chính sách đơn giản mà không cần sử dụng RL, cho phép điều chỉnh trực tiếp mô hình ngôn ngữ để phù hợp với sở thích của con người mà không cần mô hình hóa phần thưởng rõ ràng hoặc RL. Chúng tôi đã chứng minh rằng DPO đạt được ít nhất hiệu quả tương đương với các phương pháp hiện có, bao gồm cả các phương pháp dựa trên PPO, trong việc thu học từ sở thích trong các nhiệm vụ như điều chỉnh cảm xúc, tóm tắt và hội thoại,[...] DPO là một phương pháp có thể mở rộng và hiệu quả cho việc điều chỉnh các mô hình ngôn ngữ để đáp ứng đúng mong đợi của con người.

<!-- src: ... -->

## Slide 4 — Kết quả thí nghiệm

DPO cho thấy khả năng tốt trong việc tối ưu hóa từ sở thích. Chúng tôi đã tiến hành các thí nghiệm trên nhiều mô hình và nhiệm vụ phức tạp như tóm tắt và hội thoại một-lượt. Kết quả cho thấy, với hầu như không tinh chỉnh tham số, DPO có thể hoạt động tốt hơn hoặc tương đương với các phương pháp RLHF mạnh mẽ như PPO và các phương pháp khác. 

<!-- src: ... -->

## Khái niệm chính

- [[tinh-chinh-giam-sat]]: thuật toán để cải thiện mô hình đã được đào tạo trước thông qua dữ liệu chất lượng cao.
- [[mo-hinh-phan-thuong]]: mô hình để định lượng sở thích hoặc định hướng hành vi của mô hình ngôn ngữ.
- [[toi-uu-hoa-so-thich]]: phương pháp tối ưu hóa chính sách mà không cần dùng đến mô hình hóa phần thưởng phức tạp.
- [[hoc-tang-cuong]]: kỹ thuật học máy cho phép mô hình học từ phản hồi và cải thiện qua thời gian.
```
