'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const initialUser = {
  name: 'VŨ HỮU TRƯỜNG',
  email: '26ai.truongvh@vinuni.edu.vn',
  shortEmail: '26ai.truongvh@vinun...',
  role: 'student',
  cohort: 'Khóa 3 + 4 Phase 1',
  studentId: '26AI042',
  avatarChar: '2',
  submissions: [
    {
      id: 1,
      title: 'Day 01 - Phân tích Dữ liệu và Prompt Engineering',
      code: 'DAY01_LAB',
      submittedAt: '28/07/2026 14:30',
      status: 'graded', // 'graded' | 'pending'
      score: '9.5/10',
      fileName: 'day01_302_submission.pdf',
      fileSize: '1.4 MB',
      feedback: 'Bài làm xuất sắc, trả lời đầy đủ các câu hỏi phân tích prompt.'
    },
    {
      id: 2,
      title: 'Day 02 - Xây dựng Pipeline Retrieval-Augmented Generation (RAG)',
      code: 'DAY02_RAG',
      submittedAt: '29/07/2026 09:15',
      status: 'graded',
      score: '10/10',
      fileName: 'day02_rag_pipeline_truongvh.ipynb',
      fileSize: '3.8 MB',
      feedback: 'Cấu hình vector database chuẩn xác, xử lý câu hỏi ngữ cảnh rất tốt.'
    },
    {
      id: 3,
      title: 'Day 03 - Fine-tuning LLaMA 3 & Đánh giá mô hình',
      code: 'DAY03_FINETUNE',
      submittedAt: '30/07/2026 16:45',
      status: 'pending',
      score: 'Đang chấm',
      fileName: 'day03_finetuning_notebook.ipynb',
      fileSize: '5.2 MB',
      feedback: 'Đang trong tiến trình chấm bài tự động.'
    }
  ]
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState('VI');
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Initialize dark mode from localStorage if available
  useEffect(() => {
    try {
      const savedDark = localStorage.getItem('vlearn_dark');
      if (savedDark !== null) {
        setDark(JSON.parse(savedDark));
      }
      const savedLang = localStorage.getItem('vlearn_lang');
      if (savedLang) {
        setLang(savedLang);
      }
    } catch (e) {}
  }, []);

  // Update dark mode class on html tag
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('vlearn_dark', JSON.stringify(dark));
    } catch (e) {}
  }, [dark]);

  useEffect(() => {
    try {
      localStorage.setItem('vlearn_lang', lang);
    } catch (e) {}
  }, [lang]);

  const toggleDark = () => setDark(prev => !prev);
  const toggleLang = () => setLang(prev => (prev === 'VI' ? 'EN' : 'VI'));

  const logout = () => {
    setIsLoggedIn(false);
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        dark,
        setDark,
        toggleDark,
        user,
        setUser,
        isLoggedIn,
        logout,
        login
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
