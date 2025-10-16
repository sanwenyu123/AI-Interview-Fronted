// API 配置
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  API_PREFIX: '/api/v1',
  TIMEOUT: 30000, // 30 秒超时
};

// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // 面试相关
  INTERVIEWS: {
    LIST: '/interviews',
    CREATE: '/interviews',
    GET: (id) => `/interviews/${id}`,
    UPDATE: (id) => `/interviews/${id}`,
    DELETE: (id) => `/interviews/${id}`,
    START: (id) => `/interviews/${id}/start`,
    COMPLETE: (id) => `/interviews/${id}/complete`,
    CANCEL: (id) => `/interviews/${id}/cancel`,
    STATISTICS: '/interviews/statistics',
  },

  // 问题相关
  QUESTIONS: {
    GENERATE: '/questions/generate',
    LIST: '/questions',
    GET_BY_INTERVIEW: (interviewId) => `/questions/interview/${interviewId}`,
    GET: (id) => `/questions/${id}`,
  },

  // 答案相关
  ANSWERS: {
    CREATE: '/answers',
    GET_BY_QUESTION: (questionId) => `/answers/question/${questionId}`,
    GET: (id) => `/answers/${id}`,
  },

  // 评价相关
  EVALUATIONS: {
    CREATE: '/evaluations',
    GENERATE: '/evaluations/generate',
    GET_BY_INTERVIEW: (interviewId) => `/evaluations/interview/${interviewId}`,
    GET: (id) => `/evaluations/${id}`,
  },
};

// 获取完整的 API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

