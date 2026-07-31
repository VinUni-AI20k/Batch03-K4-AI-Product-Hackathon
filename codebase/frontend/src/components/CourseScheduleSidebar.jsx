import React from 'react';
import { Calendar, Clock, MapPin, FileText, BookOpen, Building, Award, ExternalLink } from 'lucide-react';

export default function CourseScheduleSidebar() {
  const events = [
    {
      id: 1,
      date: '20/08/2024 - 19:00',
      location: 'Hội trường A, Tòa VinUni / Online',
      title: 'Lễ Khai Giảng Khóa AI K4',
      description:
        'Phổ biến quy chế học tập, giới thiệu lộ trình đào tạo 3 tháng và tiến hành chia nhóm dự án. Khách mời: Ban Lãnh đạo Vingroup & Giảng viên VinUni.',
      buttonText: 'Thông tin Tuyển sinh & Lộ trình',
      buttonIcon: <FileText size={14} />,
      buttonAction: () => alert('Khóa học AI Thực Chiến - Lộ trình 3 tháng với 80% thời lượng thực hành trên các dự án thực tế tại Vingroup & VinUni.'),
      accentColor: '#10b981', // green
    },
    {
      id: 2,
      date: '25/08/2024 - 19:00',
      location: 'Online (Google Meet)',
      title: 'Workshop: Nghệ thuật viết Prompt',
      description:
        'Hướng dẫn kỹ thuật viết prompt (Prompt Engineering) nâng cao để khai thác tối đa sức mạnh của mô hình ngôn ngữ lớn (LLMs).',
      buttonText: 'Vào phòng Meet',
      buttonIcon: <ExternalLink size={14} />,
      buttonAction: () => alert('Link tham dự Meet sẽ được gửi qua email học viên trước 24 giờ.'),
      accentColor: '#f59e0b', // orange
    },
    {
      id: 3,
      date: 'Hàng ngày (07:30 - 21:00)',
      location: 'Căng tin & Hội trường VinUni',
      title: 'Khu vực Học tập & Tiện ích Cá nhân',
      description:
        'Căng tin VinUni phục vụ ăn sáng/trưa/tối; hệ thống wifi tốc độ cao "VinUni-Guest"; bãi đỗ xe miễn phí cho học viên khóa AI Thực Chiến.',
      buttonText: 'Sổ tay Cơ sở vật chất VinUni',
      buttonIcon: <Building size={14} />,
      buttonAction: () => alert('Cơ sở vật chất: Học viên xuất trình thẻ tại cổng Tòa VinUni, sử dụng căng tin tầng 1 và phòng tự học tầng 2-3.'),
      accentColor: '#3b82f6', // blue
    },
    {
      id: 4,
      date: '15/09 - 30/10/2024',
      location: 'Nền tảng E-Learning (VLearn)',
      title: 'Checkpoints & Thực hành Dự án AI',
      description:
        'Học viên tham gia thực hành 80% thời lượng trên các dự án AI thực tế, nhận hỗ trợ 1:1 từ Mentor và TA qua nền tảng VLearn & Discord.',
      buttonText: 'Truy cập VLearn KB',
      buttonIcon: <Award size={14} />,
      buttonAction: () => alert('Truy cập hệ thống VLearn và Facebook Group QA để tra cứu bài giảng & hỏi đáp kỹ thuật.'),
      accentColor: '#8b5cf6', // purple
    },
  ];

  return (
    <aside className="schedule-sidebar-card">
      <div className="schedule-header">
        <div className="schedule-header-icon">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="schedule-title">Lịch Trình Khóa AI Thực Chiến</h3>
          <p className="schedule-subtitle">Lộ trình đào tạo, sự kiện & thông tin tuyển sinh</p>
        </div>
      </div>

      <div className="schedule-events-list">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="schedule-event-card"
            style={{ borderLeft: `4px solid ${ev.accentColor}` }}
          >
            <div className="event-meta-row">
              <span className="event-time">
                <Clock size={13} />
                {ev.date}
              </span>
              <span className="event-location">
                <MapPin size={13} />
                {ev.location}
              </span>
            </div>

            <h4 className="event-title">{ev.title}</h4>
            <p className="event-desc">{ev.description}</p>

            {ev.buttonText && (
              <button
                type="button"
                className="event-action-btn"
                onClick={ev.buttonAction}
              >
                {ev.buttonIcon}
                <span>{ev.buttonText}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
