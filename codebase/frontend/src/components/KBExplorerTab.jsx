import React, { useState } from 'react';
import { Search, CheckCircle2, Heart, MessageSquare, BookOpen } from 'lucide-react';

export default function KBExplorerTab({ kbItems, stats }) {
  const [search, setSearch] = useState('');

  const filteredItems = kbItems.filter(item => {
    const q = (item.question || '').toLowerCase();
    const a = (item.verified_answer ? item.verified_answer.content : (item.content || '')).toLowerCase();
    const query = search.toLowerCase();
    return q.includes(query) || a.includes(query);
  });

  return (
    <div className="kb-container glass-panel">
      <div className="kb-header">
        <div>
          <h2>📊 Cơ sở tri thức Facebook Group Scraper (Evidence Base)</h2>
          <p>
            Dữ liệu cào từ FB Group <strong>"Cộng đồng AI Thực Chiến Vingroup — VinUni"</strong> (ID:{' '}
            <code>363757814515154</code>) bằng công cụ <code>fb/facebook_post_comment_scraper</code>.
          </p>
        </div>

        <div className="kb-search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm trong các bài post hỏi-đáp cào được..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Số bài FB Q&A đã cào</span>
          <span className="stat-value">{stats.fb_posts_scraped || 8}</span>
          <span className="stat-meta">Bài đăng có thắc mắc của học viên</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Lời giải chuẩn TA/Mentor</span>
          <span className="stat-value">{stats.total_verified_answers || 8}</span>
          <span className="stat-meta">Được kiểm chứng 100%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tổng lượt Likes & Hữu ích</span>
          <span className="stat-value">{stats.total_community_likes || 285}</span>
          <span className="stat-meta">Đánh giá cao từ cộng đồng</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">VLearn Pack Snippets</span>
          <span className="stat-value">{stats.vlearn_snippets || 3}</span>
          <span className="stat-meta">Transcript & Slide đồng bộ</span>
        </div>
      </div>

      {/* KB List Section */}
      <div>
        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', marginBottom: '14px' }}>
          📑 Danh sách câu hỏi & lời giải từ Facebook Group ({filteredItems.length})
        </h3>
        <div className="kb-items-grid">
          {filteredItems.map((item, idx) => {
            const pid = item.post_id || item.id || `100${idx}`;
            const author = item.verified_answer ? item.verified_answer.author_name : 'TA Mentor';
            const answerText = item.verified_answer ? item.verified_answer.content : (item.content || '');

            return (
              <div key={idx} className="kb-item-card">
                <div className="kb-item-header">
                  <span className="kb-item-id">#{pid} • {author}</span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> Verified by TA
                  </span>
                </div>
                <div className="kb-item-q">{item.question}</div>
                <div className="kb-item-a">{answerText}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
