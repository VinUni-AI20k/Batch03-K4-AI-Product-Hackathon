import React, { useEffect, useState } from 'react';
import { Ticket, Clock, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function MyTickets({ userEmail }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      fetchUserTickets();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchUserTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tickets/user/${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (e) {
      console.error('Lỗi tải danh sách tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) return <div style={{ padding: 20 }}>Vui lòng đăng nhập để xem Ticket.</div>;
  if (loading) return <div style={{ padding: 20 }}>Đang tải danh sách Tickets của bạn...</div>;

  return (
    <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(12px)', borderRadius: '16px', flex: 1, border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Ticket className="text-violet-600" />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Support Tickets Của Tôi</h2>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Bạn chưa tạo ticket hỗ trợ nào. Khi AI không thể trả lời câu hỏi, AI sẽ tự động ghi nhận ticket cho bạn.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tickets.map(t => (
            <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>Mã Ticket: #{t.id}</strong>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Tạo lúc: {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  {t.status === 'resolved' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <CheckCircle size={14} /> Đã có phản hồi
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      <Clock size={14} /> Đang xử lý
                    </span>
                  )}
                </div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px', border: '1px solid #e2e8f0' }}>
                <strong>Bạn đã hỏi: </strong> {t.question}
              </div>

              {t.status === 'resolved' && t.response && (
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #22c55e', fontSize: '14px' }}>
                  <strong>Admin Trả lời: </strong> {t.response}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
