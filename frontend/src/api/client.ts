export type McqQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function uploadSlide(file: File): Promise<{ textContent: string }> {
  await delay(600);
  return {
    textContent: `Đã chuyển nội dung từ ${file.name} sang text.md.\n\n- Giới thiệu chủ đề chính\n- Các định nghĩa cốt lõi\n- Bài học và ví dụ thực tế\n- Tóm tắt cuối cùng cho ôn tập nhanh`,
  };
}

export async function generateQuiz(slideText: string): Promise<McqQuestion[]> {
  await delay(900);
  const base = [
    {
      question: "Slide giới thiệu chủ đề nào?",
      options: ["Tối ưu hoá học tập", "Công nghệ AI", "Thiết kế bài giảng", "Quản lý thời gian"],
      answer: "Công nghệ AI",
      explanation: "Nội dung slide tập trung vào việc ứng dụng trí tuệ nhân tạo trong học tập.",
    },
    {
      question: "Mục tiêu chính của buổi học là gì?",
      options: ["Nắm khái niệm", "Luyện tiếng Anh", "Giải toán nâng cao", "Lập trình web"],
      answer: "Nắm khái niệm",
      explanation: "AI giúp người học nắm rõ khái niệm cốt lõi dễ nhớ hơn.",
    },
  ];

  const questions = Array.from({ length: 20 }, (_, index) => {
    const template = randomItem(base);
    return {
      question: `${template.question} (Câu ${index + 1})`,
      options: template.options,
      answer: template.answer,
      explanation: template.explanation,
    };
  });

  return questions;
}

export async function summarizeResults(questions: McqQuestion[], answers: string[]): Promise<{ good: string; improve: string }> {
  await delay(400);
  const correctCount = questions.reduce((count, question, index) => {
    return count + (question.answer === answers[index] ? 1 : 0);
  }, 0);

  return {
    good: `Bạn đã hoàn thành ${correctCount} / ${questions.length} câu đúng. Phần kiến thức bạn nắm vững là ôn tập chủ đề chính của slide và phân biệt các khái niệm cơ bản.`,
    improve: `Bạn nên cải thiện phần câu hỏi liên quan đến chi tiết nhỏ và ví dụ thực tế. Hãy chú ý vào những điểm nhấn quan trọng để tránh chọn đáp án sai.`,
  };
}

export async function generateReviewTopics(slideText: string): Promise<{ title: string; content: string }[]> {
  await delay(500);
  return [
    {
      title: "Khái niệm chính",
      content: "Tóm tắt ngắn gọn về các định nghĩa quan trọng cần nhớ: cốt lõi, mục tiêu và cách sử dụng AI trong học tập.",
    },
    {
      title: "Mẹo nhớ nhanh",
      content: "Sử dụng ví dụ cụ thể và hình ảnh để gợi nhớ. Chia nội dung thành 3 bước: nhận diện, liên hệ, lặp lại.",
    },
    {
      title: "Điểm cần cải thiện",
      content: "Những phần dễ nhầm lẫn thường là chi tiết phụ, số liệu, hoặc thuật ngữ gần giống. Hãy đọc kỹ và đối chiếu với ví dụ.",
    },
  ];
}

export async function buildFollowupQuiz(
  slideText: string,
  questions: McqQuestion[],
  answers: string[],
): Promise<McqQuestion[]> {
  await delay(700);
  const wrongIndices = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => question.answer !== answers[index])
    .map(({ index }) => index);

  return questions.map((question, index) => ({
    question: `Ôn lại: ${question.question}`,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
  })).slice(0, 20);
}
