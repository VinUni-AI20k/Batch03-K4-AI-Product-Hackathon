import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getHistoryForStudent, saveHistoryForStudent } from '../services/api';

const demos = {
    case1: {
        student: 'U0367',
        tutor: 'Trong cơ chế Multi-head, thay vì chỉ có một cơ chế chú ý (attention) duy nhất, mô hình sử dụng nhiều con mắt song song để tập trung vào các khía cạnh khác nhau của câu cùng một lúc. ... [trang 35]',
        citation: '35',
        ref: 'Multi-head: mỗi head xử lý 1 khía cạnh (ví dụ đại từ, không gian, cú pháp). [trang 35]'
    },
    case2: {
        student: 'U0274',
        tutor: 'Đoạn này liệt kê 5 trụ cột chính nhằm đảm bảo việc phát triển và vận hành AI có trách nhiệm... [trang 13]',
        citation: '13',
        ref: 'Trụ Cột Responsible AI: 1) Không thiên lệch bất hợp lý; 2) Đủ ổn định; 3) Chỉ dùng dữ liệu cần thiết; 4) Phù hợp nhiều nhóm; 5) Minh bạch. [trang 13]'
    }
};

function CP2Prototype() {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [selectedDemo, setSelectedDemo] = useState('case1');
    const [refText, setRefText] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [studentAnswer, setStudentAnswer] = useState('');
    const [gradingResult, setGradingResult] = useState('Chưa có kết quả chấm.');
    const [explainText, setExplainText] = useState('');
    const [enableLogs, setEnableLogs] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const savedStudent = localStorage.getItem('vl_studentId');
        if (!savedStudent) {
            navigate('/login');
            return;
        }
        setStudentId(savedStudent);
        loadDemo(selectedDemo);
        loadHistory(savedStudent);
    }, [navigate, selectedDemo]);

    useEffect(() => {
        loadDemo(selectedDemo);
    }, [selectedDemo]);

    const loadHistory = async (student) => {
        const data = await getHistoryForStudent(student);
        setLogs(data || []);
    };

    const loadDemo = (key) => {
        const demo = demos[key];
        setRefText(demo.ref);
        setAiQuestion('');
        setStudentAnswer('');
        setGradingResult('Chưa có kết quả chấm.');
        setExplainText('');
    };

    const handleLogout = () => {
        localStorage.removeItem('vl_studentId');
        navigate('/login');
    };

    const handleGenerateQuestion = async () => {
        const question = `Dựa trên đoạn bạn vừa đọc, trang ${demos[selectedDemo].citation}: Hãy diễn giải lại bằng 1–2 câu.`;
        setAiQuestion(question);
    };

    const handleSubmitAnswer = async () => {
        if (!studentAnswer.trim()) {
            alert('Vui lòng nhập trả lời.');
            return;
        }
        const result = studentAnswer.toLowerCase().includes('attention') ? '✅ Hiểu đúng' : '⚠️ Chưa chắc/mơ hồ';
        setGradingResult(result);
        setExplainText('Câu trả lời được đánh giá dựa trên độ liên quan với nội dung tham chiếu.');

        if (enableLogs) {
            const item = {
                ts: new Date().toISOString(),
                demo: selectedDemo,
                ref: refText,
                question: aiQuestion,
                answer: studentAnswer,
                result,
            };
            const updatedLogs = [...logs, item];
            setLogs(updatedLogs);
            await saveHistoryForStudent(studentId, updatedLogs);
        }
    };

    const downloadLogs = () => {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vl_history.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <Header studentId={studentId} onLogout={handleLogout} />
            <main className="page-shell cp2-page">
                <div className="columns three-cols">
                    <div className="panel chat-panel">
                        <h2>Hội thoại (mô phỏng)</h2>
                        <label>Chọn conversation demo:</label>
                        <select value={selectedDemo} onChange={(e) => setSelectedDemo(e.target.value)}>
                            <option value="case1">C0025 T0708 — Happy path (có citations)</option>
                            <option value="case2">C0096 T0558 — Edge case (mơ hồ)</option>
                        </select>
                        <div className="chatArea">
                            <div className="chatMsg">
                                <div className="meta">Tutor — citation: {demos[selectedDemo].citation}</div>
                                <div className="text">{demos[selectedDemo].tutor}</div>
                            </div>
                        </div>
                        <div className="quick-check">
                            <button onClick={handleGenerateQuestion}>Kiểm tra nhanh xem bạn hiểu đúng chưa?</button>
                            <div className="small-note">Tuỳ chọn — có thể bỏ qua.</div>
                        </div>
                    </div>

                    <div className="panel student-panel">
                        <h2>Trả lời của học viên</h2>
                        <label>Đoạn tài liệu tham chiếu (tự động):</label>
                        <textarea value={refText} readOnly />

                        <label>Câu hỏi kiểm tra (AI sinh):</label>
                        <textarea value={aiQuestion} readOnly placeholder="Nhấn 'Kiểm tra nhanh' để sinh câu hỏi" />

                        <label>Trả lời của học viên (1-2 câu):</label>
                        <textarea value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)} placeholder="Viết câu trả lời bằng lời của bạn..." />

                        <div className="buttons">
                            <button onClick={handleSubmitAnswer}>Nộp trả lời</button>
                            <button onClick={() => {
                                setAiQuestion('');
                                setStudentAnswer('');
                                setGradingResult('Chưa có kết quả chấm.');
                                setExplainText('');
                            }}>Bỏ qua / Đặt lại</button>
                        </div>

                        <div className="settings">
                            <label><input type="checkbox" checked={enableLogs} onChange={(e) => setEnableLogs(e.target.checked)} /> Lưu log lần chạy (server)</label>
                        </div>
                    </div>

                    <div className="panel result-panel">
                        <h2>Kết quả chấm AI</h2>
                        <div className="result">{gradingResult}</div>
                        <div className="explain">{explainText}</div>
                        <div className="buttons">
                            <button onClick={downloadLogs} disabled={!logs.length}>Tải logs (JSON)</button>
                        </div>
                        <div className="history-panel">
                            <h3>Lịch sử phiên</h3>
                            {logs.length === 0 ? (
                                <div className="small-note">Chưa có lịch sử. Bật "Lưu log lần chạy" và gửi trả lời.</div>
                            ) : (
                                <ol className="history-list">
                                    {logs.map((item, index) => (
                                        <li key={index}>
                                            <strong>{new Date(item.ts).toLocaleString()}</strong>: {item.result}
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CP2Prototype;
