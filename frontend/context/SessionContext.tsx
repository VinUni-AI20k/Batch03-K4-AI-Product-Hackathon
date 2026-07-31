import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Diagnosis, KnowledgePackage, QuizQuestion, RetestResult, Roadmap } from '../api/client';

export type Phase =
  | 'upload'
  | 'quiz'
  | 'diagnosis'
  | 'style-time'
  | 'reteach'
  | 'retest'
  | 'report';

interface SessionState {
  phase: Phase;
  knowledgePackage: KnowledgePackage | null;
  diagnosis: Diagnosis | null;
  style: 'intuitive' | 'mathematical' | 'both' | null;
  minutesPerDay: number | null;
  roadmap: Roadmap | null;
  retestQuiz: QuizQuestion[] | null;
  retestResult: RetestResult | null;
}

type Action =
  | { type: 'GO_TO'; phase: Phase }
  | { type: 'SET_KNOWLEDGE_PACKAGE'; payload: KnowledgePackage }
  | { type: 'SET_DIAGNOSIS'; payload: Diagnosis }
  | { type: 'SET_STYLE_TIME'; style: SessionState['style']; minutesPerDay: number }
  | { type: 'SET_ROADMAP'; payload: Roadmap }
  | { type: 'SET_RETEST_QUIZ'; payload: QuizQuestion[] }
  | { type: 'SET_RETEST_RESULT'; payload: RetestResult }
  | { type: 'RESET' };

const initialState: SessionState = {
  phase: 'upload',
  knowledgePackage: null,
  diagnosis: null,
  style: null,
  minutesPerDay: null,
  roadmap: null,
  retestQuiz: null,
  retestResult: null,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'GO_TO':
      return { ...state, phase: action.phase };
    case 'SET_KNOWLEDGE_PACKAGE':
      return { ...state, knowledgePackage: action.payload, phase: 'quiz' };
    case 'SET_DIAGNOSIS':
      return {
        ...state,
        diagnosis: action.payload,
        phase: 'diagnosis',
      };
    case 'SET_STYLE_TIME':
      return { ...state, style: action.style, minutesPerDay: action.minutesPerDay };
    case 'SET_ROADMAP':
      return { ...state, roadmap: action.payload, phase: 'reteach' };
    case 'SET_RETEST_QUIZ':
      return { ...state, retestQuiz: action.payload, phase: 'retest' };
    case 'SET_RETEST_RESULT':
      return {
        ...state,
        retestResult: action.payload,
        phase: action.payload.masteryAchieved ? 'report' : 'style-time',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const SessionContext = createContext<{ state: SessionState; dispatch: React.Dispatch<Action> } | null>(
  null
);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}
