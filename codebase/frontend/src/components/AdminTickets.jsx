import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      console.error('Lỗi tải danh sách tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, text) => {
    setReplyText(prev => ({ ...prev, [id]: text }));
  };

  const handleResolve = async (ticket) => {
    const text = replyText[ticket.id];
    if (!text?.trim()) {
      alert("Vui lòng nhập câu trả lời trước khi chuyển trạng thái Resolved.");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: text, status: 'resolved' })
      });
      if (res.ok) {
        alert("Đã cập nhật trạng thái thành công!");
        fetchTickets();
      } else {
        alert("Lỗi khi cập nhật trạng thái.");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối.");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải danh sách Tickets...</div>;

  return (
    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '16px', flex: 1, border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ShieldAlert className="text-violet-600" />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Quản lý Support Tickets (Admin)</h2>
      </div>

      {tickets.length === 0 ? (
        <p>Không có ticket nào trong hệ thống.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tickets.map(t => (
            <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{t.user_email}</strong>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    ID: {t.id} • AI Ghi chú: {t.reason || 'N/A'}
                  </div>
                </div>
                <div>
                  {t.status === 'resolved' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <CheckCircle size={14} /> Đã giải quyết
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <Clock size={14} /> Chờ xử lý
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px', border: '1px solid #e2e8f0' }}>
                <strong>Yêu cầu của HV: </strong> {t.question}
              </div>

              {t.status === 'pending' ? (
                <div>
                  <textarea
                    placeholder="Nhập câu trả lời phản hồi cho học viên..."
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', minHeight: '80px', marginBottom: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                    value={replyText[t.id] || ''}
                    onChange={(e) => handleReplyChange(t.id, e.target.value)}
                  />
                  <button
                    onClick={() => handleResolve(t)}
                    style={{ background: 'var(--primary-indigo)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: '0.2s', width: '100%' }}
                    onMouseOver={e => e.currentTarget.style.opacity = 0.9}
                    onMouseOut={e => e.currentTarget.style.opacity = 1}
                  >
                    Gửi phản hồi & Đóng Ticket
                  </button>
                </div>
              ) : (
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #22c55e', fontSize: '14px' }}>
                  <strong>Phản hồi từ Admin: </strong> {t.response}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
