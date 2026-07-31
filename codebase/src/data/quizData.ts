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
    title: 'Câu 1 (Cơ chế Attention — Trang 22): Trong câu "Lan bỏ quyển sách vào túi vì nó quá dày", tại sao từ "nó" lại tự động chú ý (Attention) tới "quyển sách" chứ không phải "cái túi"?',
    options: {
      A: 'A. Self-Attention tính toán trọng số tương quan xác suất giữa các vector token; cụm "sách quá dày" có trọng số (0.32) cao hơn hẳn "túi quá dày" (0.09).',
      B: 'B. Do từ "túi" đứng sát từ "nó" hơn trong câu nên mô hình luôn chọn từ đứng gần nhất.',
      C: 'C. Do AI hiểu được ý nghĩa thực tế bên ngoài đời thực là chỉ có sách mới dày còn túi thì không.',
      D: 'D. Do trọng số Attention được khởi tạo ngẫu nhiên mỗi lần chạy mô hình.'
    },
    correctOption: 'A',
    citation: '[T01-022]',
    correctExplanation: 'Self-Attention tính toán trọng số tương quan xác suất giữa các vector token ("nó" & "quyển sách" = 0.32) chứ không phụ thuộc vào vị trí đứng gần (0.09).',
    misconceptionExplanations: {
      B: 'Self-Attention không chọn từ dựa vào vị trí đứng sát nhau mà dựa trên trọng số xác suất toán học của ngữ cảnh.',
      C: 'AI không "hiểu" thực tế đời thực như người; nó tính toán xác suất thống kê vector token dựa trên dữ liệu training.',
      D: 'Trọng số Attention được tính toán cố định thông qua Ma trận Query, Key, Value chứ không phải ngẫu nhiên.'
    }
  },
  {
    id: 2,
    title: 'Câu 2 (3 Trục Scaling Model — Trang 23): Tại sao mô hình Chinchilla 70B lại chiến thắng mô hình Gopher 280B dù số lượng tham số nhỏ hơn tới 4 lần?',
    options: {
      A: 'A. Do Chinchilla 70B có số lượng tham số được nén lại thông minh hơn nên luôn mạnh hơn.',
      B: 'B. Do Chinchilla được huấn luyện trên lượng dữ liệu (Tokens) gấp 4 lần, đạt tỷ lệ tối ưu giữa Data và Parameters (Chinchilla Scaling Law).',
      C: 'C. Do Gopher 280B chạy quá chậm nên bị tính điểm phạt khi chấm benchmark.',
      D: 'D. Do Chinchilla được áp dụng RLHF còn Gopher thì không.'
    },
    correctOption: 'B',
    citation: '[T01-023]',
    correctExplanation: 'Chinchilla 70B thắng Gopher 280B nhờ tỷ lệ tối ưu giữa Data (Tokens) và Parameters (Chinchilla Scaling Law). Lượng Tokens huấn luyện gấp 4 lần mới là yếu tố quyết định.',
    misconceptionExplanations: {
      A: 'Số lượng tham số lớn không đồng nghĩa với thông minh hơn nếu thiếu Data huấn luyện tương ứng.',
      C: 'Benchmark đánh giá chất lượng đầu ra chứ không phạt điểm tốc độ chạy.',
      D: 'Cả hai mô hình đều là pretraining model, sự khác biệt cốt lõi ở Slide 23 nằm ở Pretraining Data Scaling.'
    }
  },
  {
    id: 3,
    title: 'Câu 3 (Cost of Error & Automation Level — Trang 14): Một nhóm định thiết kế AI tự động chấm bài tập lớn của học viên mà không cần giảng viên duyệt. Hãy đánh giá Cost-of-Error và đề xuất mức Automation phù hợp.',
    options: {
      A: 'A. Chọn Full Automate 100% để tiết kiệm tối đa thời gian cho giảng viên.',
      B: 'B. Chấm bài tập lớn có Cost-of-Error rất cao (AI chấm sai gây bức xúc/mất điểm); bắt buộc dùng Conditional Automation / Augment (AI chấm nháp + Giảng viên/TA duyệt).',
      C: 'C. Tuyệt đối không ứng dụng AI vì AI luôn luôn chấm sai bài tập.',
      D: 'D. Chuyển cho các học viên tự chấm chéo lẫn nhau.'
    },
    correctOption: 'B',
    citation: '[T02-014]',
    correctExplanation: 'Chấm bài tập lớn có Cost-of-Error rất cao (AI chấm sai làm học viên bức xúc). Bắt buộc phải áp dụng Conditional Automation hoặc Augment (AI chấm nháp + Giảng viên/TA duyệt cuối).',
    misconceptionExplanations: {
      A: 'Bài toán Cost-of-Error cao không thể tự động hóa 100% khi chưa có con người kiểm duyệt.',
      C: 'AI hoàn toàn có thể hỗ trợ chấm nháp (Augment) giúp giảng viên tiết kiệm 70% thời gian.',
      D: 'Học viên chấm chéo không đảm bảo được chuẩn mực đánh giá chuyên môn.'
    }
  }
];
