import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ReaderPage from './pages/ReaderPage';

function Layout() {
  const location = useLocation();
  const isReader = location.pathname.includes('/reader');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflow: isReader ? 'hidden' : 'auto',
      backgroundColor: '#f0f4f8'
    }}>
      {/* Main Header (Hide default header on Reader page as Reader has its own dedicated top bar) */}
      {!isReader && <Header />}

      {/* Main Content View */}
      <main style={{ flex: 1, height: isReader ? '100%' : 'auto', overflow: isReader ? 'hidden' : 'visible' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/course/comp2010" element={<CourseDetailPage />} />
          <Route path="/course/comp2010/reader" element={<ReaderPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
