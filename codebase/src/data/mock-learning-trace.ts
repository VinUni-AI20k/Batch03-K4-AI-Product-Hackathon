import type { LearningTrace } from "@/types/learning-trace";

export const mockLearningTrace: LearningTrace = {
  session: {
    eyebrow: "VLEARN · VINUNI AI THỰC CHIẾN",
    title: "Learning Trace của bạn",
    subtitle:
      "Tổng hợp những gì bạn đã tìm hiểu cùng VLearn Tutor theo từng ngày học.",
    course: "AI Thực Chiến · Khóa 3 + 4",
    collectionLabel: "Hành trình học tập · 3 ngày có dữ liệu",
  },
  days: [
    {
      id: "day-01",
      number: "01",
      label: "Day01",
      title: "AI & LLM Foundation",
      statusLabel: "Đã hoàn thành ngày học",
      slideCount: 29,
      interactionCount: 3,
      groundedSourceCount: 5,
      topics: [
        {
          id: "ai-ml-dl",
          title: "AI, Machine Learning và Deep Learning",
          summary:
            "Ba lớp khái niệm được phân biệt theo phạm vi và cách hệ thống học từ dữ liệu.",
          slide: "Slide 6",
          transcript: "[T04-021]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Quan hệ AI → ML → DL",
        },
        {
          id: "transformer-attention",
          title: "Transformer & Attention",
          summary:
            "Attention giúp mỗi token tập trung vào những phần ngữ cảnh liên quan thay vì chỉ đọc tuần tự.",
          slide: "Slide 15",
          transcript: "[T04-052]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Token · Context · Attention",
        },
        {
          id: "next-token",
          title: "Next-token prediction",
          summary:
            "LLM tạo câu trả lời bằng cách dự đoán token tiếp theo dựa trên context hiện có.",
          slide: "Slide 22",
          transcript: "[T04-067]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Context → xác suất → token",
        },
      ],
      reviewItems: [
        {
          id: "day01-ml-vs-dl",
          title: "Phân biệt Machine Learning và Deep Learning",
          confidence: "medium",
          confidenceLabel: "Cần xác nhận",
          reason:
            "Bạn đã hỏi lại về phần feature extraction sau câu trả lời đầu tiên.",
          evidenceTurnId: "T0457",
          slide: "Slide 18",
          transcript: "[T04-029]",
          relatedTopicId: "ai-ml-dl",
        },
      ],
      sources: [
        {
          id: "day01-slide-6",
          label: "Slide 6",
          title: "Bức tranh AI",
          excerpt:
            "AI là phạm vi rộng; Machine Learning và Deep Learning là các lớp kỹ thuật nằm bên trong.",
        },
        {
          id: "day01-slide-15",
          label: "Slide 15",
          title: "Attention",
          excerpt:
            "Mỗi token có thể chú ý đến các token quan trọng khác để khóa nghĩa theo ngữ cảnh.",
        },
        {
          id: "day01-transcript",
          label: "[T04-052]",
          title: "Giải thích Transformer",
          excerpt:
            "Transformer xử lý chuỗi bằng attention và trở thành nền tảng của các LLM hiện đại.",
        },
      ],
      interactions: [
        {
          turnId: "T0457",
          page: "Trang 18",
          question: "Deep Learning khác Machine Learning ở chỗ nào?",
          topicId: "ai-ml-dl",
        },
        {
          turnId: "T0882",
          page: "Trang 20",
          question: "AlphaGo có liên quan gì đến Deep Learning?",
          topicId: "ai-ml-dl",
        },
        {
          turnId: "T0911",
          page: "Trang 15",
          question: "Attention giúp model hiểu ngữ cảnh thế nào?",
          topicId: "transformer-attention",
        },
      ],
      unassessableNote:
        "Một câu hỏi về model nền của Tutor không phản ánh mức độ hiểu bài nên không được đưa vào gợi ý ôn tập.",
    },
    {
      id: "day-02",
      number: "02",
      label: "Day02",
      title: "Xác định bài toán kinh doanh cho AI",
      statusLabel: "Đã hoàn thành ngày học",
      slideCount: 29,
      interactionCount: 6,
      groundedSourceCount: 8,
      topics: [
        {
          id: "problem-statement",
          title: "Problem Statement",
          summary:
            "Chuyển một yêu cầu mơ hồ thành phát biểu rõ người dùng, nhu cầu, trở ngại và kết quả mong muốn.",
          slide: "Slide 25",
          transcript: "[T02-031]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "User · Pain · Outcome",
        },
        {
          id: "impact-effort",
          title: "Ma trận Impact–Effort",
          summary:
            "So sánh các ứng viên theo quy mô ảnh hưởng, tần suất và nỗ lực để ưu tiên đúng lát cắt.",
          slide: "Slide 16",
          transcript: "[T02-018]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Impact × Frequency × Cost",
        },
        {
          id: "automation",
          title: "Mức độ tự động hóa",
          summary:
            "Chọn augment, conditional hay automate dựa trên hậu quả khi hệ thống đưa ra quyết định sai.",
          slide: "Slide 18",
          transcript: "[T02-040]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Augment · Conditional · Automate",
        },
      ],
      reviewItems: [
        {
          id: "day02-augment-vs-automate",
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
          id: "day02-estimate-impact",
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
          id: "day02-slide-16",
          label: "Slide 16",
          title: "Ma trận Impact–Effort",
          excerpt:
            "Ưu tiên bài toán dựa trên mức tác động, tần suất, chi phí mỗi lần và khả năng triển khai.",
        },
        {
          id: "day02-slide-18",
          label: "Slide 18",
          title: "Mức độ tự động hóa",
          excerpt:
            "Augment để con người quyết định; automate khi chi phí của một lần sai đủ thấp.",
        },
        {
          id: "day02-slide-25",
          label: "Slide 25",
          title: "Problem Statement",
          excerpt:
            "Một problem statement tốt mô tả vấn đề của người dùng trước khi bàn đến giải pháp.",
        },
        {
          id: "day02-transcript",
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
    },
    {
      id: "day-03",
      number: "03",
      label: "Day03",
      title: "Prompt Engineering & AI Agent",
      statusLabel: "Đã hoàn thành ngày học",
      slideCount: 29,
      interactionCount: 4,
      groundedSourceCount: 6,
      topics: [
        {
          id: "prompt-structure",
          title: "Cấu trúc một prompt tốt",
          summary:
            "Prompt rõ vai trò, nhiệm vụ, bối cảnh và định dạng đầu ra giúp model hành xử ổn định hơn.",
          slide: "Slide 15",
          transcript: "[T03-041]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Role · Task · Context · Format",
        },
        {
          id: "tool-calling",
          title: "Tool Calling",
          summary:
            "Model chọn công cụ và tham số; ứng dụng thực thi để kết nối LLM với dữ liệu hoặc hành động bên ngoài.",
          slide: "Slide 30",
          transcript: "[T03-079]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Schema · Tool · Result",
        },
        {
          id: "react-pattern",
          title: "Vòng lặp ReAct",
          summary:
            "Agent luân phiên suy luận, hành động và quan sát kết quả cho đến khi hoàn thành nhiệm vụ.",
          slide: "Slide 20",
          transcript: "[T03-095]",
          learnedLabel: "Đã tìm hiểu",
          mindmapChild: "Thought · Action · Observation",
        },
      ],
      reviewItems: [
        {
          id: "day03-function-calling",
          title: "Function Calling và Text-based ReAct",
          confidence: "medium",
          confidenceLabel: "Cần xác nhận",
          reason:
            "Bạn đã hỏi thêm về tính ổn định của JSON Schema sau phần ví dụ.",
          evidenceTurnId: "T0299",
          slide: "Slide 30",
          transcript: "[T03-079]",
          relatedTopicId: "tool-calling",
        },
      ],
      sources: [
        {
          id: "day03-slide-15",
          label: "Slide 15",
          title: "Cấu trúc prompt",
          excerpt:
            "Role, task, context và output format giúp giảm mơ hồ trong yêu cầu.",
        },
        {
          id: "day03-slide-30",
          label: "Slide 30",
          title: "Function Calling",
          excerpt:
            "JSON Schema tạo hợp đồng rõ ràng giữa model và công cụ mà ứng dụng cung cấp.",
        },
        {
          id: "day03-transcript",
          label: "[T03-095]",
          title: "Vòng lặp ReAct",
          excerpt:
            "Agent quan sát kết quả của hành động rồi tiếp tục suy luận cho bước kế tiếp.",
        },
      ],
      interactions: [
        {
          turnId: "T0299",
          page: "Trang 30",
          question: "Function Calling khác Text-based ReAct thế nào?",
          topicId: "tool-calling",
        },
        {
          turnId: "T0196",
          page: "Trang 23",
          question: "Cho ví dụ về vòng lặp ReAct.",
          topicId: "react-pattern",
        },
        {
          turnId: "T0569",
          page: "Trang 15",
          question: "Viết prompt cần những thành phần gì?",
          topicId: "prompt-structure",
        },
      ],
      unassessableNote:
        "Một lượt yêu cầu tải file thuộc thao tác hệ thống, không được dùng để suy luận kiến thức.",
    },
  ],
};
