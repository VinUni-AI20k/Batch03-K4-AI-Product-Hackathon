import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function Home() {
    const navigate = useNavigate();
    const studentId = localStorage.getItem('vl_studentId') || '';

    useEffect(() => {
        if (!studentId) {
            navigate('/login');
        }
    }, [navigate, studentId]);

    const handleLogout = () => {
        localStorage.removeItem('vl_studentId');
        navigate('/login');
    };

    const openPrototype = () => {
        navigate('/cp2');
    };

    return (
        <div>
            <Header studentId={studentId} onLogout={handleLogout} />

            <main className="page-shell home-page">
                <section className="hero section-shell" id="top">
                    <div className="hero-copy">
                        <p className="eyebrow">
                            <span className="pulse-dot" /> Một tính năng mới cho VLearn
                        </p>
                        <h1>Đọc xong chưa chắc là <em>hiểu thật.</em></h1>
                        <p className="hero-lead">
                            Quick-check đặt một câu hỏi ngắn ngay sau lời giải thích của tutor —
                            để học viên tự diễn giải, phát hiện chỗ hổng và tự tin đi tiếp.
                        </p>
                        <div className="hero-actions">
                            <button className="button button-primary" onClick={() => window.location.hash = '#how'}>
                                Khám phá flow ↓
                            </button>
                            <button className="button button-secondary" onClick={openPrototype}>
                                Mở prototype ↗
                            </button>
                        </div>
                        <div className="hero-note">
                            <span className="note-icon">✦</span>
                            <span>Không tính điểm. Không làm gián đoạn việc học.</span>
                        </div>
                    </div>

                    <div className="hero-visual" aria-label="Minh hoạ Quick-check">
                        <div className="chat-window">
                            <div className="window-bar">
                                <div className="window-dots"><i></i><i></i><i></i></div>
                                <span>VLearn · Buổi học hôm nay</span>
                                <span className="window-status">● live</span>
                            </div>
                            <div className="chat-content">
                                <div className="chat-label">TUTOR <span>10:42</span></div>
                                <div className="bubble tutor-bubble">
                                    Multi-head attention cho phép mô hình tập trung vào nhiều phần khác nhau
                                    của chuỗi cùng lúc.
                                    <small>[trang 35]</small>
                                </div>
                                <div className="chat-label student-label">BẠN <span>10:43</span></div>
                                <div className="bubble student-bubble">Em đã hiểu rồi ạ.</div>
                                <div className="quick-card">
                                    <div className="quick-card-top">
                                        <span className="spark">✦</span>
                                        <strong>Kiểm tra nhanh</strong>
                                        <span className="optional">tuỳ chọn</span>
                                    </div>
                                    <p>Thử diễn giải bằng lời của bạn: multi-head attention giúp ích gì?</p>
                                    <div className="quick-input">Viết câu trả lời của bạn... <span>→</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="visual-caption"><span></span> Một câu hỏi · Một tín hiệu hiểu</div>
                    </div>
                </section>

                <section className="proof-strip section-shell" id="why">
                    <div className="section-kicker">Từ dữ liệu VLearn</div>
                    <div className="proof-intro">
                        <h2>Khoảng trống nằm ở <span>điểm kết thúc.</span></h2>
                        <p>Tutor trả lời đúng không đồng nghĩa với việc học viên đã tiếp thu đúng.</p>
                    </div>
                    <div className="metric-grid">
                        <article className="metric-card">
                            <strong>52,8<span>%</span></strong>
                            <p>hội thoại chỉ có 1 lượt hỏi – đáp rồi kết thúc</p>
                            <small>309 / 585 hội thoại</small>
                        </article>
                        <article className="metric-card">
                            <strong>0,24<span>%</span></strong>
                            <p>lượt tutor chủ động hỏi lại để kiểm tra hiểu</p>
                            <small>3 / 1.261 lượt tutor</small>
                        </article>
                        <article className="metric-card">
                            <strong>0</strong>
                            <p>lượt ghi nhận misconception trong dữ liệu</p>
                            <small>Khoảng trống chưa được nhìn thấy</small>
                        </article>
                    </div>
                </section>

                <section className="flow-section section-shell" id="how">
                    <div className="section-heading">
                        <div>
                            <div className="section-kicker">Một lát cắt thật nhỏ</div>
                            <h2>Từ “em hiểu rồi” đến <span>hiểu thật.</span></h2>
                        </div>
                        <p className="heading-aside">Một người dùng<br />· một công việc<br />· một quyết định<br />· một kết quả</p>
                    </div>
                    <div className="flow-line" aria-label="Flow 4 bước của Quick-check">
                        <article className="flow-step">
                            <div className="step-number">01</div>
                            <div className="step-icon icon-trigger">↗</div>
                            <h3>Trigger</h3>
                            <p>Khối kiểm tra xuất hiện sau câu trả lời có nguồn trích dẫn.</p>
                            <span className="step-tag">Không ép buộc</span>
                        </article>
                        <div className="flow-arrow" aria-hidden="true">→</div>
                        <article className="flow-step active-step">
                            <div className="step-number">02</div>
                            <div className="step-icon icon-question">?</div>
                            <h3>Hỏi đúng chỗ</h3>
                            <p>AI sinh một câu hỏi mở, bám đúng đoạn tài liệu vừa đọc.</p>
                            <span className="step-tag">Có căn cứ</span>
                        </article>
                        <div className="flow-arrow" aria-hidden="true">→</div>
                        <article className="flow-step">
                            <div className="step-number">03</div>
                            <div className="step-icon icon-answer">✎</div>
                            <h3>Tự diễn giải</h3>
                            <p>Học viên trả lời bằng lời của mình trong 1–2 câu.</p>
                            <span className="step-tag">Chủ động nhớ</span>
                        </article>
                        <div className="flow-arrow" aria-hidden="true">→</div>
                        <article className="flow-step result-step">
                            <div className="step-number">04</div>
                            <div className="step-icon icon-result">✓</div>
                            <h3>Nhận tín hiệu</h3>
                            <p>AI đối chiếu và phản hồi với giải thích, không chỉ một nhãn điểm.</p>
                            <span className="step-tag">Hiểu · Chưa chắc · Thiếu căn cứ</span>
                        </article>
                    </div>
                </section>

                <section className="safety-section section-shell" id="safety">
                    <div className="safety-copy">
                        <div className="section-kicker">Thiết kế có chủ đích</div>
                        <h2>AI không chắc thì <span>không đoán.</span></h2>
                        <p>Với một công cụ học tập, báo “đã hiểu” sai còn nguy hiểm hơn việc yêu cầu học viên đọc lại.
                            Quick-check luôn ưu tiên sự trung thực của tín hiệu.</p>
                        <button className="text-link" type="button" onClick={openPrototype}>
                            Thử các case khó trong prototype ↗
                        </button>
                    </div>
                    <div className="guardrail-list">
                        <div className="guardrail">
                            <span className="guardrail-icon">⌁</span>
                            <div>
                                <strong>Grounded trước, hỏi sau</strong>
                                <p>Không có citation rõ ràng → không sinh câu hỏi.</p>
                            </div>
                            <b>01</b>
                        </div>
                        <div className="guardrail">
                            <span className="guardrail-icon">◌</span>
                            <div>
                                <strong>Chưa chắc không phải là sai</strong>
                                <p>Câu trả lời mơ hồ → hỏi lại, không kết luận vội.</p>
                            </div>
                            <b>02</b>
                        </div>
                        <div className="guardrail">
                            <span className="guardrail-icon">↺</span>
                            <div>
                                <strong>Sai thì sửa ngay</strong>
                                <p>Học viên được trả lời lại trong cùng một khung.</p>
                            </div>
                            <b>03</b>
                        </div>
                    </div>
                </section>

                <section className="closing-section section-shell">
                    <div className="closing-card">
                        <div>
                            <p className="eyebrow">Sẵn sàng kiểm tra hiểu thật?</p>
                            <h2>Đừng chỉ hỏi “đã hiểu chưa”.<br /><em>Hãy để người học cho bạn thấy.</em></h2>
                        </div>
                        <button className="button button-light" onClick={openPrototype}>
                            Mở prototype ↗
                        </button>
                    </div>
                </section>
            </main>

            <footer className="site-footer section-shell">
                <div className="brand"><span className="brand-mark">Q</span><span>quick<span>-check</span></span></div>
                <p>AI cho khoá AI Thực Chiến · Nhóm TACGIAM · Zone A2</p>
                <p className="footer-meta">VLearn / 2026</p>
            </footer>
        </div>
    );
}

export default Home;
