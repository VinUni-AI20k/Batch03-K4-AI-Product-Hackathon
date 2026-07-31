import React, { useState } from 'react';
import { Network, Sparkles } from 'lucide-react';

export default function KnowledgeMap({ bridgeLinks, fromDayCode, toDayCode }) {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 animate-fade-in text-xs" style={{ backgroundColor: '#ffffff' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Network size={16} className="text-indigo-600 shrink-0" />
          <h3 className="text-xs font-bold text-slate-900 truncate">
            Sơ đồ Cầu nối Tri thức
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0 whitespace-nowrap">
          {fromDayCode} ➔ {toDayCode}
        </span>
      </div>

      <p className="text-[11px] text-slate-600 leading-snug">
        Trực quan hóa cách các khái niệm ở <strong>{fromDayCode}</strong> chuyển giao làm nền tảng cho <strong>{toDayCode}</strong>:
      </p>

      {/* Visual Map Grid */}
      <div className="rounded-xl p-2.5 bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="grid grid-cols-1 gap-2.5">
          
          {/* Day From Concepts */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
              Nền tảng {fromDayCode}
            </div>
            {bridgeLinks && bridgeLinks.length > 0 ? (
              bridgeLinks.map((link, idx) => (
                <div 
                  key={'src_' + idx}
                  onClick={() => setSelectedNode(link)}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${
                    selectedNode?.id === link.id ? 'bg-indigo-50 border-indigo-500 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    border: selectedNode?.id === link.id ? '1.5px solid #0f2b5c' : '1px solid #cbd5e1'
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-slate-900 font-semibold gap-1">
                    <span className="truncate">{link.sourceConcept}</span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-bold shrink-0 whitespace-nowrap">
                      {link.sourceRef}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic">Không có khái niệm nối</div>
            )}
          </div>

          {/* Day To Concepts */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Ứng dụng ở {toDayCode}
            </div>
            {bridgeLinks && bridgeLinks.length > 0 ? (
              bridgeLinks.map((link, idx) => (
                <div 
                  key={'tgt_' + idx}
                  onClick={() => setSelectedNode(link)}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${
                    selectedNode?.id === link.id ? 'bg-emerald-50 border-emerald-500 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  style={{
                    border: selectedNode?.id === link.id ? '1.5px solid #00a884' : '1px solid #cbd5e1'
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-slate-900 font-semibold gap-1">
                    <span className="truncate">{link.targetConcept}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold shrink-0 whitespace-nowrap">
                      {link.targetRef}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic">Không có liên kết</div>
            )}
          </div>

        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200 animate-fade-in space-y-1">
          <div className="flex items-center gap-1 text-indigo-900 text-xs font-bold">
            <Sparkles size={13} className="text-amber-500 shrink-0" />
            <span>Chi tiết Cầu nối Cốt lõi:</span>
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {selectedNode.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
