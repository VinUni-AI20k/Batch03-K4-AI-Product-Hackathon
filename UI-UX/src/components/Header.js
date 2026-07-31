import { Link } from 'react-router-dom';

export default function Header({ studentId, onLogout }) {
    return (
        <header className="site-header">
            <div className="header-brand-nav">
                <Link to="/home" className="brand" aria-label="VLearn trang chủ">
                    <img className="brand-mark" src="/vinuni-mark.svg" alt="VLearn logo" />
                    <span>VLearn</span>
                </Link>
                <nav className="main-nav" aria-label="Điều hướng chính">
                    <button type="button" className="link-button nav-link" onClick={() => window.location.hash = '#why'}>
                        Vấn đề
                    </button>
                    <button type="button" className="link-button nav-link" onClick={() => window.location.hash = '#how'}>
                        Cách hoạt động
                    </button>
                    <button type="button" className="link-button nav-link" onClick={() => window.location.hash = '#safety'}>
                        An toàn
                    </button>
                    <a href="https://github.com/donglam1824/K4-hackathon-TACGIAM-E403" target="_blank" rel="noopener noreferrer">
                        Docs
                    </a>
                </nav>
            </div>
            <div className="header-actions">
                <div className="student-badge">👤 {studentId || 'Khách'}</div>
                <button onClick={onLogout} className="header-cta">Đăng xuất</button>
            </div>
        </header>
    );
}
