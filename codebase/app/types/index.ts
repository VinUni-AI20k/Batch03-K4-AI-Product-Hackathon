export type LectureStatus = "ready" | "processing" | "error" | "uploading";

export interface Lecture {
  id: string;
  name: string;
  uploadedAt: string;
  pageCount?: number;
  status: LectureStatus;
  fileType: "pdf" | "pptx";
  progress?: number;
  file?: File;
  fileUrl?: string;
}

export interface Citation { page: number; label: string; }

export interface TutorAnswer {
  text: string;
  citations: Citation[];
  confidence: number;
  confidenceLabel: string;
  clarificationOptions?: string[];
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  text: string;
  answer?: TutorAnswer;
  feedback?: "up" | "down";
  feedbackNote?: string;
}
