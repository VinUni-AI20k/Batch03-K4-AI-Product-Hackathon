import type { LearningTrace } from "@/types/learning-trace";

export const mockLearningTrace: LearningTrace = {
  session: {
    eyebrow: "VLEARN · VINUNI AI THỰC CHIẾN",
    title: "Learning Trace của bạn",
    subtitle:
      "Tổng hợp những gì bạn đã tìm hiểu cùng VLearn Tutor trong buổi học hôm nay.",
    course: "AI Thực Chiến · Khóa 3 + 4",
    sessionLabel: "Day 2 · Xác định bài toán kinh doanh cho AI",
    interactionCount: 6,
    groundedSourceCount: 8,
  },
  topics: [
    {
      id: "problem-statement",
      title: "Problem Statement",
      summary:
        "Chuyển một yêu cầu mơ hồ thành phát biểu rõ người dùng, nhu cầu, trở ngại và kết quả mong muốn.",
      slide: "Slide 25",
      transcript: "[T02-031]",
      learnedLabel: "Đã tìm hiểu",
    },
    {
      id: "impact-effort",
      title: "Ma trận Impact–Effort",
      summary:
        "So sánh các ứng viên theo quy mô ảnh hưởng, tần suất và nỗ lực để ưu tiên đúng lát cắt.",
      slide: "Slide 16",
      transcript: "[T02-018]",
      learnedLabel: "Đã tìm hiểu",
    },
    {
      id: "automation",
      title: "Mức độ tự động hóa",
      summary:
        "Chọn augment, conditional hay automate dựa trên hậu quả khi hệ thống đưa ra quyết định sai.",
      slide: "Slide 18",
      transcript: "[T02-040]",
      learnedLabel: "Đã tìm hiểu",
    },
  ],
  reviewItems: [
    {
      id: "augment-vs-automate",
      title: "Phân biệt Augment và Automate",
      confidence: "medium",
      confidenceLabel: "Cần xác nhận",
      reason:
        "Bạn đã hỏi lại về mức tự động hóa sau phần giải thích của Tutor.",
      evidenceTurnId: "T0241",
      slide: "Slide 18",
      transcript: "[T02-040]",
      relatedTopicId: "automation",
    },
    {
      id: "estimate-impact",
      title: "Ước lượng impact trước khi chọn giải pháp",
      confidence: "low",
      confidenceLabel: "Tín hiệu yếu",
      reason:
        "Bạn hỏi cách tính impact một lần; chưa có thêm tương tác để kết luận.",
      evidenceTurnId: "T0234",
      slide: "Slide 16",
      transcript: "[T02-018]",
      relatedTopicId: "impact-effort",
    },
  ],
  sources: [
    {
      id: "slide-16",
      label: "Slide 16",
      title: "Ma trận Impact–Effort",
      excerpt:
        "Ưu tiên bài toán dựa trên mức tác động, tần suất, chi phí mỗi lần và khả năng triển khai.",
    },
    {
      id: "slide-18",
      label: "Slide 18",
      title: "Mức độ tự động hóa",
      excerpt:
        "Augment để con người quyết định; automate khi chi phí của một lần sai đủ thấp.",
    },
    {
      id: "slide-25",
      label: "Slide 25",
      title: "Problem Statement",
      excerpt:
        "Một problem statement tốt mô tả vấn đề của người dùng trước khi bàn đến giải pháp.",
    },
    {
      id: "transcript-18",
      label: "[T02-018]",
      title: "Bằng chứng từ transcript",
      excerpt:
        "Giảng viên hướng dẫn cách lượng hóa impact và chọn ứng viên có bằng chứng mạnh hơn.",
    },
  ],
  interactions: [
    {
      turnId: "T0241",
      page: "Trang 18",
      question: "Augment khác automate ở đâu?",
      topicId: "automation",
    },
    {
      turnId: "T0234",
      page: "Trang 16",
      question: "Ma trận impact–effort dùng khi nào?",
      topicId: "impact-effort",
    },
    {
      turnId: "T0229",
      page: "Trang 25",
      question: "Problem Statement cần có những phần gì?",
      topicId: "problem-statement",
    },
  ],
  unassessableNote:
    "Một lượt hỏi ngắn chưa đủ ngữ cảnh đã được giữ ngoài phần gợi ý ôn tập.",
};
