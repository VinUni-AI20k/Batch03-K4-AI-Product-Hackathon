import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function GoogleLoginModal({ onLogin }) {
  const [activeTab, setActiveTab] = useState('real_oauth'); // 'real_oauth' | 'demo_quick'
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthError, setOauthError] = useState(null);

  const sampleAccounts = [
    {
      email: 'nguyen.van.a@gmail.com',
      name: 'Nguyễn Văn A',
      roleText: 'Học viên mới đang tìm hiểu khóa học',
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      google_id: 'google_personal_1001'
    },
    {
      email: 'tran.thu.ha@gmail.com',
      name: 'Trần Thu Hà',
      roleText: 'Ứng viên tiềm năng Batch 03',
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      google_id: 'google_personal_1002'
    },
    {
      email: 'le.hoang.minh@gmail.com',
      name: 'Lê Hoàng Minh',
      roleText: 'Tân sinh viên VinUni',
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      google_id: 'google_personal_1003'
    }
  ];

  // Xử lý khi Đăng nhập Google OAuth chính chủ thành công
  const handleRealGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setOauthError(null);
    try {
      if (!credentialResponse.credential) {
        throw new Error("Không nhận được credential từ Google");
      }
      const decoded = jwtDecode(credentialResponse.credential);
      const userProfile = {
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        picture: decoded.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        google_id: decoded.sub,
        auth_provider: 'google_real'
      };
      await onLogin(userProfile);
    } catch (err) {
      console.error("Google OAuth decode error:", err);
      setOauthError("Không thể đọc hồ sơ từ Google. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRealGoogleError = () => {
    setOauthError("Đăng nhập Google OAuth thất bại. Hãy chắc chắn link 'http://localhost:5173' đã được thêm vào Authorized JavaScript Origins của Client ID trong Google Cloud Console.");
  };

  const handleSelectAccount = async (account) => {
    setLoading(true);
    try {
      await onLogin(account);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const name = customName.trim() || customEmail.split('@')[0];
    const account = {
      email: customEmail.trim(),
      name: name,
      picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      google_id: 'google_personal_' + Date.now(),
      auth_provider: 'google_custom'
    };
    setLoading(true);
    try {
      await onLogin(account);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-auth-overlay">
      <div className="google-auth-card">
        {/* Top Branding Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">🎓 Vingroup - VinUni</div>
          <h1 className="auth-title">Cổng Tư vấn Khóa học AI Thực Chiến</h1>
          <p className="auth-subtitle">
            Vui lòng đăng nhập bằng tài khoản <strong>Google cá nhân (Gmail)</strong> để trò chuyện với Trợ lý AI và tra cứu thông tin tuyển sinh & cơ sở vật chất.
          </p>
        </div>

        {/* Auth Mode Tabs: Real Google OAuth vs Quick Demo */}
        <div className="auth-mode-tabs">
          <button
            className={`auth-tab-btn ${activeTab === 'real_oauth' ? 'active' : ''}`}
            onClick={() => { setActiveTab('real_oauth'); setOauthError(null); }}
          >
            🔑 Đăng nhập Google thật (OAuth 2.0)
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'demo_quick' ? 'active' : ''}`}
            onClick={() => { setActiveTab('demo_quick'); setOauthError(null); }}
          >
            ⚡ Chọn tài khoản mẫu
          </button>
        </div>

        {activeTab === 'real_oauth' ? (
          <div className="real-oauth-container">
            <div className="real-oauth-box">
              <p className="real-oauth-hint">
                Bấm nút bên dưới để mở cửa sổ xác thực chính chủ từ Google Identity Services và đăng nhập bằng tài khoản Gmail thật của bạn:
              </p>
              <div className="google-official-btn-wrapper">
                <GoogleLogin
                  onSuccess={handleRealGoogleSuccess}
                  onError={handleRealGoogleError}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                  width="320"
                />
              </div>
              {loading && <div className="auth-loading-text">Đang đồng bộ hồ sơ Google thật vào MongoDB...</div>}
              {oauthError && (
                <div className="oauth-error-box">
                  <span>⚠️ {oauthError}</span>
                </div>
              )}
            </div>

            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="feature-icon">✅</span>
                <span>Lấy email, họ tên & ảnh đại diện thực tế từ Google profile</span>
              </div>
              <div className="auth-feature-item">
                <span className="feature-icon">🛡️</span>
                <span>Bảo mật chuẩn JWT Google Identity Services 2.0</span>
              </div>
              <div className="auth-feature-item">
                <span className="feature-icon">💾</span>
                <span>Tự động tạo/cập nhật bản ghi trong MongoDB (`users` table)</span>
              </div>
            </div>
          </div>
        ) : (
          /* QUICK DEMO & CUSTOM GMAIL TAB */
          !showAccountSelector ? (
            <div className="auth-body">
              <button
                className="google-signin-btn"
                onClick={() => setShowAccountSelector(true)}
              >
                <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                <span>Chọn từ danh sách 3 tài khoản Gmail mẫu →</span>
              </button>

              <div className="auth-features">
                <div className="auth-feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Đăng nhập tức thì không cần xác thực ngoài</span>
                </div>
                <div className="auth-feature-item">
                  <span className="feature-icon">👤</span>
                  <span>Đại diện các nhóm: Ứng viên mới & Tân sinh viên VinUni</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="account-selector-modal">
              <div className="selector-header">
                <button className="back-btn" onClick={() => { setShowAccountSelector(false); setShowCustomForm(false); }}>
                  ← Quay lại
                </button>
                <h2>Chọn một tài khoản Google mẫu</h2>
                <p>để tiếp tục đến AI Thực Chiến VinUni</p>
              </div>

              {!showCustomForm ? (
                <div className="account-list">
                  {sampleAccounts.map((acc, idx) => (
                    <div
                      key={idx}
                      className="account-item"
                      onClick={() => !loading && handleSelectAccount(acc)}
                    >
                      <div className="account-avatar">
                        {acc.name.charAt(0)}
                      </div>
                      <div className="account-info">
                        <div className="account-name">{acc.name}</div>
                        <div className="account-email">{acc.email}</div>
                        <div className="account-role">{acc.roleText}</div>
                      </div>
                      <div className="account-arrow">→</div>
                    </div>
                  ))}

                  <div
                    className="account-item custom-account-btn"
                    onClick={() => setShowCustomForm(true)}
                  >
                    <div className="account-avatar plus-avatar">+</div>
                    <div className="account-info">
                      <div className="account-name">Sử dụng tài khoản Google khác</div>
                      <div className="account-email">Đăng nhập bằng Gmail cá nhân khác</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="custom-google-form" onSubmit={handleCustomSubmit}>
                  <div className="form-group">
                    <label>Địa chỉ Email Google (Gmail):</label>
                    <input
                      type="email"
                      required
                      placeholder="vidu.nguyen@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Họ và tên hiển thị:</label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn X..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowCustomForm(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn-submit-google"
                      disabled={loading}
                    >
                      {loading ? 'Đang xác thực...' : 'Đăng nhập Google →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )
        )}

        <div className="auth-footer">
          Bằng việc tiếp tục, bạn đồng ý với Quy chế sử dụng Cổng tri thức AI Thực Chiến (Vingroup - VinUni).
        </div>
      </div>
    </div>
  );
}
