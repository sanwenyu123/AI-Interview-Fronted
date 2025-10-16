import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

// 问题服务
const questionService = {
  // 生成面试问题
  generateQuestions: async (generateData) => {
    try {
      const response = await request.post(API_ENDPOINTS.QUESTIONS.GENERATE, generateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取问题列表
  getQuestions: async (params = {}) => {
    try {
      const response = await request.get(API_ENDPOINTS.QUESTIONS.LIST, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 根据面试 ID 获取问题
  getQuestionsByInterview: async (interviewId) => {
    try {
      const response = await request.get(
        API_ENDPOINTS.QUESTIONS.GET_BY_INTERVIEW(interviewId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取问题详情
  getQuestion: async (id) => {
    try {
      const response = await request.get(API_ENDPOINTS.QUESTIONS.GET(id));
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default questionService;

