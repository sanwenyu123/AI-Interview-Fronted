import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

// 答案服务
const answerService = {
  // 创建答案
  createAnswer: async (answerData) => {
    try {
      const response = await request.post(API_ENDPOINTS.ANSWERS.CREATE, answerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 根据问题 ID 获取答案
  getAnswersByQuestion: async (questionId) => {
    try {
      const response = await request.get(
        API_ENDPOINTS.ANSWERS.GET_BY_QUESTION(questionId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取答案详情
  getAnswer: async (id) => {
    try {
      const response = await request.get(API_ENDPOINTS.ANSWERS.GET(id));
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default answerService;

