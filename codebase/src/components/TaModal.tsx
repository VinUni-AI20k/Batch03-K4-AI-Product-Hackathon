'use client';

import React from 'react';
import { Send, X, ShieldAlert } from 'lucide-react';

interface TaModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: string;
}

export const TaModal: React.FC<TaModalProps> = ({ isOpen, onClose, citation }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    alert(`✅ [PAIR Control] Đã gửi thành công vị trí slide ${citation} tới TA trực ban! TA sẽ phản hồi bạn trong 15 phút.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
        <div className="p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Xác nhận Chuyển thông tin cho TA (PAIR Control)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-xs text-slate-700 leading-relaxed">
          <p>
            Bạn có đồng ý gửi câu hỏi và vị trí trích dẫn slide{' '}
            <strong className="text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
              {citation}
            </strong>{' '}
            này cho đội ngũ Giảng viên / TA trực ban hỗ trợ giải thích trực tiếp không?
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[11px] text-slate-600">
            <strong>🔒 Quyền kiểm soát thuộc về bạn:</strong> Theo nguyên tắc PAIR (Feedback & Control), hệ thống sẽ không tự động làm phiền TA khi chưa có xác nhận từ bạn.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200 transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Đồng ý gửi cho TA 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
