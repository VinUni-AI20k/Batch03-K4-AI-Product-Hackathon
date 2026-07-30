export type Section = "S1" | "S2" | "S3" | "S4" | "S5";

export const ALL_SECTIONS: Section[] = ["S1", "S2", "S3", "S4", "S5"];

export const SECTION_TITLES: Record<Section, string> = {
  S1: "Supervised Learning",
  S2: "Unsupervised Learning",
  S3: "Neural Network cơ bản",
  S4: "Overfitting & Regularization",
  S5: "Evaluation Metrics",
};

export const MASTERY_THRESHOLD = 0.8;

export type McqQuestion = {
  id: string;
  section: Section;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type StudyContent = {
  section: Section;
  title: string;
  summary: string;
  example: string;
  practice: { question: string; options: string[]; answer: string };
  citation: string;
};

export type SectionStat = { section: Section; title: string; correct: number; total: number };

export type GradeResult = {
  correctCount: number;
  total: number;
  accuracy: number;
  bySection: SectionStat[];
  weakSections: Section[];
  goodSections: Section[];
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadSlide(file: File): Promise<{ textContent: string }> {
  await delay(600);
  return {
    textContent: `Đã chuyển nội dung từ ${file.name} sang text.md — trích xuất 5 chủ đề: ${Object.values(
      SECTION_TITLES,
    ).join(", ")}.`,
  };
}

const ROUND1_BANK: McqQuestion[] = [
  { id: "q1", section: "S1", question: "Trong Supervised Learning, dữ liệu huấn luyện cần có gì?",
    options: ["Không cần nhãn", "Có nhãn (label) đầu ra", "Chỉ cần đặc trưng ngẫu nhiên", "Không cần dữ liệu"],
    answer: "Có nhãn (label) đầu ra", explanation: "Supervised học từ cặp input-output đã có nhãn." },
  { id: "q2", section: "S1", question: "Bài toán nào sau đây là Supervised Learning?",
    options: ["Phân cụm khách hàng", "Dự đoán giá nhà từ dữ liệu có giá thực tế", "Giảm chiều dữ liệu", "Học không có nhãn"],
    answer: "Dự đoán giá nhà từ dữ liệu có giá thực tế", explanation: "Có nhãn (giá thực tế) để học theo." },
  { id: "q3", section: "S1", question: "Linear Regression thường dùng để giải bài toán gì?",
    options: ["Phân loại nhị phân", "Dự đoán giá trị liên tục", "Phân cụm", "Sinh ảnh"],
    answer: "Dự đoán giá trị liên tục", explanation: "Regression dự đoán giá trị số liên tục." },
  { id: "q4", section: "S1", question: "Classification khác Regression ở điểm nào?",
    options: ["Classification dự đoán nhãn rời rạc, Regression dự đoán giá trị liên tục", "Ngược lại hoàn toàn", "Không khác gì nhau", "Chỉ dùng cho dữ liệu ảnh"],
    answer: "Classification dự đoán nhãn rời rạc, Regression dự đoán giá trị liên tục", explanation: "Đây là khác biệt cốt lõi giữa hai loại bài toán." },

  { id: "q5", section: "S2", question: "Unsupervised Learning khác Supervised ở điểm nào?",
    options: ["Không có nhãn đầu ra", "Luôn cần nhãn", "Không dùng dữ liệu", "Chỉ dùng cho ảnh"],
    answer: "Không có nhãn đầu ra", explanation: "Unsupervised tự tìm cấu trúc, không cần nhãn." },
  { id: "q6", section: "S2", question: "K-Means là thuật toán thuộc nhóm nào?",
    options: ["Supervised", "Clustering (Unsupervised)", "Reinforcement", "Regression"],
    answer: "Clustering (Unsupervised)", explanation: "K-Means là thuật toán clustering kinh điển." },
  { id: "q7", section: "S2", question: "Mục tiêu chính của Clustering là gì?",
    options: ["Dự đoán nhãn có sẵn", "Nhóm các điểm dữ liệu giống nhau lại", "Tối ưu hàm mất mát có giám sát", "Sinh dữ liệu mới"],
    answer: "Nhóm các điểm dữ liệu giống nhau lại", explanation: "Clustering nhóm dữ liệu tương tự nhau." },
  { id: "q8", section: "S2", question: "PCA thường dùng để làm gì?",
    options: ["Giảm chiều dữ liệu", "Tăng số lượng nhãn", "Sinh ảnh mới", "Phân loại nhị phân"],
    answer: "Giảm chiều dữ liệu", explanation: "PCA là kỹ thuật giảm chiều phổ biến." },

  { id: "q9", section: "S3", question: "Một Neural Network cơ bản gồm các thành phần nào?",
    options: ["Chỉ có input layer", "Input – Hidden – Output layer", "Chỉ có output layer", "Không có layer nào"],
    answer: "Input – Hidden – Output layer", explanation: "3 phần cơ bản của một mạng nơ-ron." },
  { id: "q10", section: "S3", question: "Hàm kích hoạt (activation function) dùng để làm gì?",
    options: ["Giảm số lượng layer", "Thêm tính phi tuyến cho mạng", "Xoá dữ liệu nhiễu", "Tăng tốc độ GPU"],
    answer: "Thêm tính phi tuyến cho mạng", explanation: "Không có activation, mạng chỉ là phép biến đổi tuyến tính." },
  { id: "q11", section: "S3", question: "ReLU là hàm kích hoạt phổ biến vì lý do gì?",
    options: ["Tính toán đơn giản, tránh vanishing gradient", "Luôn trả về giá trị âm", "Không thể đạo hàm", "Chỉ dùng cho ảnh"],
    answer: "Tính toán đơn giản, tránh vanishing gradient", explanation: "ReLU giúp gradient lan truyền tốt hơn." },
  { id: "q12", section: "S3", question: "Backpropagation dùng để làm gì?",
    options: ["Cập nhật trọng số dựa trên gradient lỗi", "Tăng tốc độ GPU", "Xoá layer dư thừa", "Sinh dữ liệu mới"],
    answer: "Cập nhật trọng số dựa trên gradient lỗi", explanation: "Đây là cơ chế học của mạng nơ-ron." },

  { id: "q13", section: "S4", question: "Overfitting xảy ra khi nào?",
    options: ["Model học quá tốt trên train nhưng kém trên test", "Model học kém cả train và test", "Model không học gì cả", "Dữ liệu quá ít nên không train được"],
    answer: "Model học quá tốt trên train nhưng kém trên test", explanation: "Dấu hiệu kinh điển của overfitting." },
  { id: "q14", section: "S4", question: "Regularization giúp gì cho model?",
    options: ["Tăng độ phức tạp model", "Giảm overfitting bằng cách phạt trọng số lớn", "Xoá bớt dữ liệu train", "Tăng tốc độ inference"],
    answer: "Giảm overfitting bằng cách phạt trọng số lớn", explanation: "Regularization phạt trọng số lớn để model đơn giản hơn." },
  { id: "q15", section: "S4", question: "Dropout hoạt động bằng cách nào?",
    options: ["Ngẫu nhiên tắt một số neuron khi train", "Xoá hẳn 1 layer vĩnh viễn", "Tăng learning rate", "Giảm số lớp output"],
    answer: "Ngẫu nhiên tắt một số neuron khi train", explanation: "Dropout giúp tránh phụ thuộc quá mức vào 1 neuron." },
  { id: "q16", section: "S4", question: "Early stopping là kỹ thuật gì?",
    options: ["Dừng train khi validation loss không giảm nữa", "Dừng train ngay từ epoch đầu", "Tăng learning rate đột ngột", "Xoá dữ liệu validation"],
    answer: "Dừng train khi validation loss không giảm nữa", explanation: "Early stopping tránh overfitting khi train quá lâu." },

  { id: "q17", section: "S5", question: "Accuracy đo lường điều gì?",
    options: ["Tỷ lệ dự đoán đúng trên tổng số mẫu", "Số lượng layer trong model", "Tốc độ train", "Kích thước dữ liệu"],
    answer: "Tỷ lệ dự đoán đúng trên tổng số mẫu", explanation: "Định nghĩa cơ bản của Accuracy." },
  { id: "q18", section: "S5", question: "Khi dữ liệu mất cân bằng (imbalanced), metric nào đáng tin hơn Accuracy?",
    options: ["F1-score", "Số epoch", "Learning rate", "Batch size"],
    answer: "F1-score", explanation: "F1-score kết hợp Precision/Recall, phù hợp dữ liệu mất cân bằng." },
  { id: "q19", section: "S5", question: "Precision đo lường điều gì?",
    options: ["Trong các dự đoán positive, bao nhiêu % đúng thật", "Tốc độ train", "Số lượng layer", "Kích thước dữ liệu"],
    answer: "Trong các dự đoán positive, bao nhiêu % đúng thật", explanation: "Định nghĩa của Precision." },
  { id: "q20", section: "S5", question: "Recall đo lường điều gì?",
    options: ["Trong các mẫu positive thật, model tìm đúng được bao nhiêu %", "Tốc độ inference", "Batch size", "Learning rate"],
    answer: "Trong các mẫu positive thật, model tìm đúng được bao nhiêu %", explanation: "Định nghĩa của Recall." },
];

const RETEST_BANK: Record<Section, McqQuestion[]> = {
  S1: [
    { id: "r1a", section: "S1", question: "Trong Supervised Learning, nhãn (label) đóng vai trò gì khi huấn luyện?",
      options: ["Là đáp án đúng để model học theo", "Không ảnh hưởng gì", "Dùng để xoá dữ liệu nhiễu", "Chỉ dùng khi test"],
      answer: "Là đáp án đúng để model học theo", explanation: "Nhãn là ground truth để model so sánh và học." },
    { id: "r1b", section: "S1", question: "Nếu bài toán không có nhãn đầu ra, đó có phải Supervised Learning không?",
      options: ["Có", "Không — đó là Unsupervised Learning", "Có, miễn đủ dữ liệu", "Tuỳ model"],
      answer: "Không — đó là Unsupervised Learning", explanation: "Không có nhãn thì không thể là Supervised." },
  ],
  S2: [
    { id: "r2a", section: "S2", question: "Muốn nhóm khách hàng theo hành vi mà không có nhãn sẵn, nên dùng cách nào?",
      options: ["Supervised Learning", "Unsupervised Learning (Clustering)", "Regression", "Backpropagation"],
      answer: "Unsupervised Learning (Clustering)", explanation: "Không có nhãn sẵn thì dùng Clustering." },
    { id: "r2b", section: "S2", question: "K trong K-Means đại diện cho điều gì?",
      options: ["Số cụm cần chia", "Số layer mạng", "Tốc độ học", "Số nhãn dữ liệu"],
      answer: "Số cụm cần chia", explanation: "K là số cụm mong muốn." },
  ],
  S3: [
    { id: "r3a", section: "S3", question: "Vì sao Neural Network cần hàm kích hoạt phi tuyến?",
      options: ["Để mạng học được quan hệ phức tạp, phi tuyến", "Để tính nhanh hơn", "Để giảm số layer", "Không có lý do đặc biệt"],
      answer: "Để mạng học được quan hệ phức tạp, phi tuyến", explanation: "Không có phi tuyến, mạng chỉ tương đương 1 phép tuyến tính." },
    { id: "r3b", section: "S3", question: "Input layer trong Neural Network có vai trò gì?",
      options: ["Nhận dữ liệu đầu vào", "Trả kết quả cuối cùng", "Tính hàm mất mát", "Lưu trọng số đã học"],
      answer: "Nhận dữ liệu đầu vào", explanation: "Input layer là nơi dữ liệu đi vào mạng." },
  ],
  S4: [
    { id: "r4a", section: "S4", question: "Dấu hiệu nào cho thấy model đang overfitting?",
      options: ["Accuracy train cao nhưng test thấp hẳn", "Accuracy train và test đều thấp", "Model chạy nhanh hơn", "Không có dấu hiệu nào"],
      answer: "Accuracy train cao nhưng test thấp hẳn", explanation: "Chênh lệch lớn train/test là dấu hiệu overfitting." },
    { id: "r4b", section: "S4", question: "Weight decay là một dạng của kỹ thuật nào?",
      options: ["Regularization", "Data Augmentation", "Clustering", "Backpropagation"],
      answer: "Regularization", explanation: "Weight decay phạt trọng số lớn, thuộc nhóm regularization." },
  ],
  S5: [
    { id: "r5a", section: "S5", question: "Model dự đoán tất cả là 'không bệnh' trong tập 95% người không bệnh — Accuracy sẽ ra sao?",
      options: ["Rất cao dù model vô dụng", "Rất thấp", "Bằng 0", "Không tính được"],
      answer: "Rất cao dù model vô dụng", explanation: "Đây là lý do Accuracy gây ảo tưởng với dữ liệu mất cân bằng." },
    { id: "r5b", section: "S5", question: "F1-score được tính từ hai đại lượng nào?",
      options: ["Precision và Recall", "Learning rate và Batch size", "Train time và Test time", "Số layer và số neuron"],
      answer: "Precision và Recall", explanation: "F1 là trung bình điều hoà của Precision và Recall." },
  ],
};

const STUDY_CONTENT: Record<Section, StudyContent> = {
  S1: { section: "S1", title: SECTION_TITLES.S1, citation: "T3-014",
    summary: "Supervised Learning học từ dữ liệu đã có nhãn đúng — model học ánh xạ input → output dựa trên các cặp ví dụ có sẵn đáp án.",
    example: "Ví dụ thực tế: dự đoán giá nhà dựa trên diện tích, vị trí — vì đã có sẵn lịch sử giá nhà thật (nhãn) để model học theo.",
    practice: { question: "Dự đoán khách hàng có rời bỏ dịch vụ hay không (dựa trên lịch sử có nhãn rời/ở lại) là bài toán gì?",
      options: ["Supervised Learning", "Unsupervised Learning", "Clustering", "Không phải Machine Learning"], answer: "Supervised Learning" } },
  S2: { section: "S2", title: SECTION_TITLES.S2, citation: "T3-021",
    summary: "Unsupervised Learning không có nhãn — model tự tìm cấu trúc/nhóm ẩn trong dữ liệu.",
    example: "Ví dụ: nhóm khách hàng thành các phân khúc dựa trên hành vi mua sắm mà không cần biết trước nhãn phân khúc nào.",
    practice: { question: "Nếu dữ liệu hoàn toàn không có nhãn, nên nghĩ tới nhóm thuật toán nào trước?",
      options: ["Supervised Learning", "Unsupervised Learning", "Regression có nhãn", "Không thể học được"], answer: "Unsupervised Learning" } },
  S3: { section: "S3", title: SECTION_TITLES.S3, citation: "T3-033",
    summary: "Neural Network gồm Input – Hidden – Output layer, mỗi layer biến đổi dữ liệu qua trọng số + hàm kích hoạt phi tuyến.",
    example: "Ví dụ: nhận diện chữ viết tay — ảnh đi qua các hidden layer để trích xuất đặc trưng, output layer trả về chữ số dự đoán.",
    practice: { question: "Nếu bỏ hết hàm kích hoạt phi tuyến khỏi Neural Network, điều gì xảy ra?",
      options: ["Mạng chỉ còn tương đương phép biến đổi tuyến tính, mất khả năng học quan hệ phức tạp", "Mạng chạy nhanh hơn nhưng vẫn học tốt", "Không ảnh hưởng gì", "Mạng sẽ tự thêm layer mới"],
      answer: "Mạng chỉ còn tương đương phép biến đổi tuyến tính, mất khả năng học quan hệ phức tạp" } },
  S4: { section: "S4", title: SECTION_TITLES.S4, citation: "T3-041",
    summary: "Overfitting là khi model học 'thuộc lòng' dữ liệu train, dự đoán kém trên dữ liệu mới. Regularization (Dropout, weight decay, early stopping) giúp giảm hiện tượng này.",
    example: "Ví dụ: model đạt 99% accuracy trên train nhưng chỉ 60% trên test — dấu hiệu overfitting rõ ràng.",
    practice: { question: "Model đạt 98% accuracy trên train nhưng 55% trên test. Đây là dấu hiệu của điều gì?",
      options: ["Overfitting", "Underfitting", "Model đang hoạt động tốt", "Dữ liệu bị thiếu nhãn"], answer: "Overfitting" } },
  S5: { section: "S5", title: SECTION_TITLES.S5, citation: "T3-050",
    summary: "Ngoài Accuracy, khi dữ liệu mất cân bằng nên dùng thêm Precision, Recall, F1-score để đánh giá đúng hơn.",
    example: "Ví dụ: phát hiện gian lận thẻ tín dụng — dữ liệu gian lận rất ít, Accuracy cao dễ gây ảo tưởng, cần nhìn Recall để biết model có bỏ sót gian lận không.",
    practice: { question: "Trong bài toán phát hiện gian lận (dữ liệu rất mất cân bằng), metric nào quan trọng hơn Accuracy?",
      options: ["F1-score / Recall", "Chỉ cần Accuracy là đủ", "Batch size", "Learning rate"], answer: "F1-score / Recall" } },
};

export async function generateQuiz(): Promise<McqQuestion[]> {
  await delay(900);
  return ROUND1_BANK;
}

export async function gradeQuiz(questions: McqQuestion[], answers: string[]): Promise<GradeResult> {
  await delay(300);
  const bySectionMap = new Map<Section, SectionStat>();
  questions.forEach((q, i) => {
    const stat = bySectionMap.get(q.section) ?? { section: q.section, title: SECTION_TITLES[q.section], correct: 0, total: 0 };
    stat.total += 1;
    if (answers[i] === q.answer) stat.correct += 1;
    bySectionMap.set(q.section, stat);
  });
  const bySection = Array.from(bySectionMap.values());
  const weakSections = bySection.filter((s) => s.correct < s.total).map((s) => s.section);
  const goodSections = bySection.filter((s) => s.correct === s.total).map((s) => s.section);
  const correctCount = bySection.reduce((sum, s) => sum + s.correct, 0);
  return {
    correctCount,
    total: questions.length,
    accuracy: correctCount / questions.length,
    bySection,
    weakSections,
    goodSections,
  };
}

export async function getStudyContent(sections: Section[]): Promise<StudyContent[]> {
  await delay(500);
  return sections.map((s) => STUDY_CONTENT[s]);
}

export async function generateRetest(sections: Section[], perSection: number): Promise<McqQuestion[]> {
  await delay(700);
  return sections.flatMap((s) => RETEST_BANK[s].slice(0, perSection));
}
