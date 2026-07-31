'use client';

import React from 'react';
import { Terminal, X } from 'lucide-react';

interface TraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  qNum: number;
  selectedOptionText: string;
  evalStatus: string;
  citation: string;
}

export const TraceModal: React.FC<TraceModalProps> = ({
  isOpen,
  onClose,
  qNum,
  selectedOptionText,
  evalStatus,
  citation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-sm font-bold">
            <Terminal className="w-4 h-4" />
            <span>AI Execution Trace Log (Eval Endpoint)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto max-h-[75vh] space-y-4">
          <div>
            <div className="text-sky-400 font-bold mb-1">[REQUEST METADATA]</div>
            <div>- Timestamp: {new Date().toISOString()}</div>
            <div>- Endpoint: /v1/chat/completions (Model: gemini-1.5-flash-evaluator)</div>
            <div>
              - System Prompt: &quot;You are VLearn Active Recall Evaluator. Dynamically evaluate selected Multiple Choice Option, detect misconceptions, output exact transcript citation [Txx-xxx], or track 2-attempt limit.&quot;
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="text-amber-400 font-bold mb-1">[USER INPUT EVALUATED]</div>
            <div>- Question ID: Q{qNum}</div>
            <div>- Selected MC Option: &quot;{selectedOptionText}&quot;</div>
            <div>- Target Citation: {citation}</div>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="text-emerald-400 font-bold mb-1">[SEMANTIC EVALUATION RESULT]</div>
            <div>- Evaluation Status: <span className="text-white font-bold">{evalStatus}</span></div>
            <div>- Grounding Citation: <span className="text-sky-300">{citation}</span></div>
            <div>
              - HAX Guidelines Applied: <span className="text-indigo-300">[&quot;G2_Explicit_Confidence&quot;, &quot;G10_Scope_Services&quot;, &quot;G11_Explain_Why&quot;]</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-lg transition"
          >
            Đóng Trace Log
          </button>
        </div>
      </div>
    </div>
  );
};
