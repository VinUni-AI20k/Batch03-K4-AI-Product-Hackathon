import React from 'react';
import { Zap } from 'lucide-react';

export default function Header({ kbStatusText, user, onLogout }) {
  return (
    <header className="glass-header">
      <div className="brand">
        <div className="logo-badge">
          <Zap className="logo-icon" size={26} />
        </div>
        <div className="brand-text">
          <h1>AI AGENT QA — KHÓA AI THỰC CHIẾN VIN</h1>
          <p>Cộng đồng AI Thực Chiến Vingroup - VinUni · Hỗ trợ Tuyển sinh & Giải đáp Khóa học</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="status-pill">
          <span className="pulse-dot"></span>
          <span>{kbStatusText}</span>
        </div>

        {user && (
          <div className="header-user-badge">
            <div className="user-badge-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="user-badge-info">
              <span className="user-badge-name">{user.name}</span>
              <span className="user-badge-email">{user.email}</span>
            </div>
            <button
              className="logout-btn"
              onClick={onLogout}
              title="Đăng xuất khỏi tài khoản Google"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
