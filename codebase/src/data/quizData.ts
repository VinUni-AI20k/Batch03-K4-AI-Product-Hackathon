export interface QuizQuestion {
  id: number;
  title: string;
  options: { [key: string]: string };
  correctOption: string;
  citation: string;
  correctExplanation: string;
  misconceptionExplanations: { [key: string]: string };
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Câu 1 (Day 01 — Cơ chế Attention): Trong kiến trúc Transformer, cơ chế Attention giải quyết điểm nghẽn lớn nhất nào của các mô hình truyền thống (RNN/LSTM)?",
    options: {
      A: 'A. Giúp mô hình tự động gán trọng số liên quan giữa các token trong câu mà không bị giới hạn bởi khoảng cách vị trí hay chuỗi tuần tự.',
      B: 'B. Giúp mô hình đọc toàn bộ tài liệu theo trình tự thời gian giống hệt cách con người đọc sách.',
      C: 'C. Giúp mô hình nén dữ liệu văn bản xuống 0 token để giảm chi phí API.',
      D: 'D. Giúp mô hình hiểu chính xác 100% ngữ nghĩa đời thực như trí tuệ con người.'
    },
    correctOption: 'A',
    citation: '[T01-015]',
    correctExplanation: 'Attention cho phép mỗi token chủ động "quay đầu" nhìn lại các token trước, chấm điểm mức độ liên quan rồi khóa nghĩa theo ngữ cảnh — đây là lý do model hiểu ngữ cảnh tốt hơn hẳn các thế hệ trước (slide "Attention", d1 trang 15).',
    misconceptionExplanations: {
      B: 'Slide nói rõ: "Thay vì đọc tuần tự từng chữ" — attention không xử lý theo trình tự đọc như con người.',
      C: 'Attention không dựa vào khoảng cách vị trí giữa các từ hay nén về 0 token mà dựa trên trọng số liên quan được tính toán qua ngữ cảnh.',
      D: 'Model không "hiểu" thực tế đời thực như người; nó tính điểm mức độ liên quan giữa các token dựa trên dữ liệu training.'
    }
  },
  {
    id: 2,
    title: "Câu 2 (Day 01 — Kiến trúc MoE vs Dense): Vì sao Kimi K3 có 2.800 tỷ tham số nhưng chi phí mỗi ca inference lại không tăng tuyến tính gấp 16 lần so với GPT-3 (175 tỷ tham số)?",
    options: {
      A: 'A. Kimi K3 dùng kiến trúc MoE ("bệnh viện đa khoa") — mỗi token chỉ gọi vài chuyên gia thay vì đi qua toàn bộ mạng như model dense (GPT-3), nên chi phí mỗi lần suy luận gần như không đổi dù tổng tham số lớn hơn nhiều.',
      B: 'B. Vì Kimi K3 nén dữ liệu thông minh hơn nên luôn chạy nhanh hơn bất kể kiến trúc.',
      C: 'C. Vì phần lớn 2.800 tỷ tham số của Kimi K3 không thực sự được dùng, chỉ để "trưng bày" quy mô.',
      D: 'D. Vì Kimi K3 chạy trên phần cứng mạnh hơn hẳn nên bù lại số tham số lớn.'
    },
    correctOption: 'A',
    citation: '[T01-017]',
    correctExplanation: 'Kimi K3 dùng kiến trúc MoE — "một bệnh viện đa khoa" — mỗi token chỉ gọi vài chuyên gia, khác với GPT-3 dense ("một bác sĩ đa năng") nơi mọi token đều đi qua toàn bộ khớp nối. Nhờ vậy "bệnh viện" lớn gấp 16 lần mà chi phí mỗi ca khám gần như không đổi (slide "Tham số", d1 trang 17).',
    misconceptionExplanations: {
      B: 'Slide không nói về nén dữ liệu; khác biệt cốt lõi nằm ở kiến trúc MoE so với dense.',
      C: 'Tham số trong MoE vẫn được dùng — chỉ khác là mỗi token chỉ đi qua một phần nhỏ (vài chuyên gia) thay vì toàn bộ mạng.',
      D: 'Slide không đề cập đến phần cứng; lý do chi phí không tăng tương ứng nằm ở kiến trúc MoE.'
    }
  },
  {
    id: 3,
    title: "Câu 3 (Day 02 — PAIR Automate vs Augment): Khi thiết kế tính năng AI chấm điểm bài tập lớn cho học viên khóa AI, nhóm nên chọn cấp độ Automate (tự động 100%) hay Augment (hỗ trợ con người)?",
    options: {
      A: 'A. Chọn Automate hoàn toàn vì AI luôn khách quan và nhanh hơn con người.',
      B: 'B. Chấm bài tập lớn là việc stakes cao (điểm số, trách nhiệm cá nhân) — theo PAIR nên chọn Augment: AI soạn nháp, con người (giảng viên/TA) duyệt trước khi trả kết quả.',
      C: 'C. Tuyệt đối không ứng dụng AI vì AI luôn luôn chấm sai bài tập.',
      D: 'D. Chuyển cho các học viên tự chấm chéo lẫn nhau thay vì dùng AI.'
    },
    correctOption: 'B',
    citation: '[T02-017]',
    correctExplanation: 'Theo PAIR (d2 trang 17): Augment được chọn khi stakes cao (tiền bạc, pháp lý, sức khỏe — ở đây là điểm số/trách nhiệm cá nhân) và kết quả cần trách nhiệm cá nhân. Việc automate hoàn toàn vẫn cần human oversight (preview, edit, undo).',
    misconceptionExplanations: {
      A: 'PAIR chỉ ra Automate phù hợp khi có "đáp án đúng" mọi người đồng thuận và rủi ro thấp — chấm bài tập lớn không thỏa điều kiện này.',
      C: 'AI hoàn toàn có thể hỗ trợ ở vai trò Augment (soạn nháp), chỉ là không nên Automate hoàn toàn khi chưa có người duyệt.',
      D: 'Học viên chấm chéo không giải quyết được vấn đề thiếu chuẩn mực đánh giá chuyên môn và trách nhiệm cá nhân.'
    }
  }
];
