import { NextRequest, NextResponse } from 'next/server';
import { quizQuestions } from '@/data/quizData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, selectedOption, attemptsCount } = body;

    const quiz = quizQuestions.find(q => q.id === questionId);
    if (!quiz) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = selectedOption === quiz.correctOption;
    const citation = quiz.citation;

    if (isCorrect) {
      return NextResponse.json({
        status: 'PASS',
        isCorrect: true,
        citation,
        explanation: quiz.correctExplanation,
        haxApplied: ['G2_Explicit_Confidence', 'G10_Scope_Services', 'G11_Explain_Why'],
        timestamp: new Date().toISOString()
      });
    }

    const misconception = quiz.misconceptionExplanations[selectedOption] || 'Bạn đang hiểu sai bản chất khái niệm.';

    return NextResponse.json({
      status: attemptsCount >= 2 ? 'FAILED_MAX_ATTEMPTS' : 'MISCONCEPTION_ATTEMPT_1',
      isCorrect: false,
      citation,
      selectedOption,
      correctOption: quiz.correctOption,
      misconception,
      correctExplanation: quiz.correctExplanation,
      attemptsCount,
      haxApplied: ['G2_Explicit_Confidence', 'G10_Scope_Services', 'G11_Explain_Why'],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
