import React, { useState } from 'react';
import { ThumbsDown, Send, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { logger } from '../services/logger';

export default function FeedbackModal({ isOpen, onClose, targetItem }) {
  const [feedbackType, setFeedbackType] = useState('citation_wrong');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.logUserFeedback({
      rating: 'down',
      type: feedbackType,
      comment: comment,
      section: targetItem?.section || 'recap',
      citationId: targetItem?.citation || ''
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="glass-panel w-full max-w-md p-6 relative animate-fade-in" style={{ background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px' }}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="mx-auto text-emerald-400" size={40} style={{ color: 'var(--accent-emerald)', margin: '0 auto' }} />
            <h4 className="text-lg font-semibold text-white">Cảm ơn bạn đã phản hồi!</h4>
            <p className="text-sm text-slate-400">Đội ngũ VLearn sẽ rà soát lại prompt & citation để nâng cao chất lượng.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 mb-2" style={{ color: 'var(--accent-rose)' }}>
              <ThumbsDown size={20} />
              <h3 className="font-semibold text-lg" style={{ color: '#fff' }}>Báo lỗi / Phản hồi nội dung AI</h3>
            </div>

            <p className="text-xs text-slate-400" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Áp dụng Nguyên tắc <strong>G15 (PAIR)</strong>: Giúp hệ thống cải thiện độ chính xác nguồn sự thật.
            </p>

            {targetItem && (
              <div className="p-3 rounded bg-slate-800/80 border border-slate-700 text-xs text-slate-300" style={{ background: 'rgba(30, 41, 59, 0.8)', fontSize: '0.8rem' }}>
                <span className="font-bold text-indigo-400">Mục đang phản hồi:</span> "{targetItem.text || targetItem.explanation}"
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Vấn đề bạn gặp phải:</label>
              <select 
                value={feedbackType} 
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }}
              >
                <option value="citation_wrong">Trích dẫn sai trang slide / transcript</option>
                <option value="concept_confused">Nhầm lẫn khái niệm kỹ thuật (Đặc thù domain)</option>
                <option value="hallucination">AI bịa thông tin không có trong bài giảng</option>
                <option value="other">Ý kiến đóng góp khác</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Mô tả chi tiết (tùy chọn):</label>
              <textarea 
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ví dụ: Slide 20 nói về Hallucination chứ không phải Context window..."
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px' }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-secondary"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, var(--accent-rose), #e11d48)' }}
              >
                <Send size={14} /> Gửi Phản hồi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
