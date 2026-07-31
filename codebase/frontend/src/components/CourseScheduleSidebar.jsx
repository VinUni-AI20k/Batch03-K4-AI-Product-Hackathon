import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, FileText, BookOpen, Building, Award, ExternalLink } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function CourseScheduleSidebar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/schedules`)
      .then(res => res.json())
      .then(data => {
        if (data.schedules) {
          setEvents(data.schedules);
        }
      })
      .catch(err => console.error("Failed to load schedules:", err));
  }, []);

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'FileText': return <FileText size={14} />;
      case 'ExternalLink': return <ExternalLink size={14} />;
      case 'Building': return <Building size={14} />;
      case 'Award': return <Award size={14} />;
      default: return <BookOpen size={14} />;
    }
  };

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
                onClick={() => alert(ev.buttonActionAlert)}
              >
                {getIcon(ev.iconType)}
                <span>{ev.buttonText}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
