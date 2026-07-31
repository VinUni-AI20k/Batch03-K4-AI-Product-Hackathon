// Module quản lý trace log gọi LLM & sự kiện người dùng (đảm bảo Rubric R5: 3đ)
const LOG_KEY = 'vlearn_ai_bridge_traces';

const sendLogToServer = (level, ...args) => {
  if (import.meta.env.DEV) { // Only in dev mode with the vite server
    try {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, data: args })
      }).catch(() => { /* ignore fetch errors to avoid infinite loops */ });
    } catch(e) {}
  }
};

export const logger = {
  // Ghi lại một đợt gọi AI thực tế
  logLLMCall: (requestData, responseData, executionTimeMs) => {
    const traceItem = {
      id: 'trace_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      type: 'LLM_CALL',
      prompt: requestData.prompt,
      model: requestData.model || 'gemini-1.5-flash',
      isRealAPI: requestData.isRealAPI,
      pathMode: requestData.pathMode,
      executionTimeMs,
      response: responseData,
    };

    const currentLogs = logger.getLogs();
    currentLogs.unshift(traceItem);
    // Giữ tối đa 50 trace gần nhất
    if (currentLogs.length > 50) currentLogs.pop();
    
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(currentLogs));
    } catch (e) {
      console.warn('Không thể lưu trace log vào localStorage:', e);
    }
    
    console.log('[AI TRACE LOGGED]', traceItem);
    return traceItem;
  },

  // Ghi lại sự kiện Feedback của người dùng (G15 / Class ④)
  logUserFeedback: (feedbackData) => {
    const feedbackItem = {
      id: 'fb_' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'USER_FEEDBACK',
      rating: feedbackData.rating, // 'up' | 'down'
      comment: feedbackData.comment,
      section: feedbackData.section,
      citationId: feedbackData.citationId
    };

    const currentLogs = logger.getLogs();
    currentLogs.unshift(feedbackItem);
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(currentLogs));
    } catch (e) {
      console.warn('Không thể lưu feedback log:', e);
    }
    console.log('[USER FEEDBACK LOGGED]', feedbackItem);
    return feedbackItem;
  },

  // Lấy toàn bộ danh sách logs
  getLogs: () => {
    try {
      const data = localStorage.getItem(LOG_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Xóa sạch logs
  clearLogs: () => {
    localStorage.removeItem(LOG_KEY);
  },

  // Thiết lập global logging để chặn tất cả console output và gửi lên server
  setupGlobalLogging: () => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      sendLogToServer('info', ...args);
      originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      sendLogToServer('warn', ...args);
      originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      sendLogToServer('error', ...args);
      originalError.apply(console, args);
    };
  }
};
