import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmed = studentId.trim();
        if (!trimmed) {
            setError('Vui lòng nhập tên hoặc mã học viên.');
            return;
        }
        localStorage.setItem('vl_studentId', trimmed);
        navigate('/home');
    };

    return (
        <main className="page-shell login-page">
            <div className="login-card">
                <h1>Đăng nhập VLearn</h1>
                <p>Nhập tên hoặc mã học viên để bắt đầu.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="studentIdInput">Mã/Tên học viên</label>
                    <input
                        id="studentIdInput"
                        type="text"
                        value={studentId}
                        onChange={(e) => {
                            setStudentId(e.target.value);
                            setError('');
                        }}
                        placeholder="VD: U0367 hoặc Nguyen Van A"
                    />
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="button button-primary">
                        Bắt đầu
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Login;
