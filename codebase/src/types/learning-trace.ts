export type ReviewStatus = "suggested" | "confirmed" | "review";

export type ConfidenceLevel = "medium" | "low";

export interface Topic {
  id: string;
  title: string;
  summary: string;
  slide: string;
  transcript: string;
  learnedLabel: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  confidence: ConfidenceLevel;
  confidenceLabel: string;
  reason: string;
  evidenceTurnId: string;
  slide: string;
  transcript?: string;
  relatedTopicId: string;
}

export interface SourceReference {
  id: string;
  label: string;
  title: string;
  excerpt: string;
}

export interface TutorInteraction {
  turnId: string;
  page: string;
  question: string;
  topicId: string;
}

export interface LearningTrace {
  session: {
    eyebrow: string;
    title: string;
    subtitle: string;
    course: string;
    sessionLabel: string;
    interactionCount: number;
    groundedSourceCount: number;
  };
  topics: Topic[];
  reviewItems: ReviewItem[];
  sources: SourceReference[];
  interactions: TutorInteraction[];
  unassessableNote: string;
}
