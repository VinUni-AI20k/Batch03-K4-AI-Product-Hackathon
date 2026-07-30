export type TutorDecision =
  | {
      intent: "navigate_page";
      page: number;
      confidence: number;
      reason: string;
    }
  | {
      intent: "content_question";
      page?: number;
      confidence: number;
      reason: string;
    }
  | {
      intent: "clarify";
      confidence: number;
      reason: string;
    };

const pagePattern = /trang\s*(?:số\s*)?(\d{1,3})/i;
const navigationSignals = /(ở đâu|mở|điều hướng|chuyển|đến|tới|về|nhảy|xem trang|cho (?:mình|tôi|em) xem)/i;
const contentSignals = /(nói gì|có gì|tóm tắt|giải thích|ý nghĩa|liên quan|nội dung|phần cốt lõi|là gì|tại sao)/i;

export function decideTutorIntent(input: string): TutorDecision {
  const normalized = input.trim().replace(/\s+/g, " ");
  const pageMatch = normalized.match(pagePattern);
  const page = pageMatch ? Number(pageMatch[1]) : undefined;

  if (page !== undefined && contentSignals.test(normalized)) {
    return {
      intent: "content_question",
      page,
      confidence: 0.93,
      reason: "Câu hỏi yêu cầu giải thích nội dung của một trang.",
    };
  }

  if (page !== undefined && (navigationSignals.test(normalized) || /^trang\s*(?:số\s*)?\d+\??$/i.test(normalized))) {
    return {
      intent: "navigate_page",
      page,
      confidence: navigationSignals.test(normalized) ? 0.98 : 0.87,
      reason: "Người học đang tìm vị trí của một trang, không hỏi về khái niệm mang số đó.",
    };
  }

  if (/^\d{1,3}$/.test(normalized)) {
    return {
      intent: "clarify",
      confidence: 0.54,
      reason: "Chỉ có một con số nên chưa biết người học muốn mở trang hay hỏi nội dung.",
    };
  }

  if (/(slide này|trang này|tóm tắt|giải thích|là gì|tại sao)/i.test(normalized)) {
    return {
      intent: "content_question",
      confidence: 0.9,
      reason: "Câu hỏi cần dùng ngữ cảnh trang đang xem.",
    };
  }

  if (page !== undefined) {
    return {
      intent: "clarify",
      confidence: 0.66,
      reason: "Có số trang nhưng hành động người học muốn thực hiện chưa đủ rõ.",
    };
  }

  return {
    intent: "content_question",
    confidence: 0.72,
    reason: "Không có tín hiệu điều hướng rõ ràng; giữ câu hỏi trong ngữ cảnh trang hiện tại.",
  };
}
