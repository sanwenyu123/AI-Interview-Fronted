import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

// 评价服务
const evaluationService = {
  // 创建评价
  createEvaluation: async (evaluationData) => {
    try {
      const response = await request.post(API_ENDPOINTS.EVALUATIONS.CREATE, evaluationData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 生成 AI 评价
  generateEvaluation: async (generateData) => {
    try {
      const response = await request.post(API_ENDPOINTS.EVALUATIONS.GENERATE, generateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 按面试ID生成 AI 评价（与后端路由一致）
  generateEvaluationByInterview: async (interviewId) => {
    try {
      const response = await request.post(`${API_ENDPOINTS.EVALUATIONS.GENERATE}/${interviewId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 根据面试 ID 获取评价
  getEvaluationsByInterview: async (interviewId) => {
    try {
      const response = await request.get(
        API_ENDPOINTS.EVALUATIONS.GET_BY_INTERVIEW(interviewId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取评价详情
  getEvaluation: async (id) => {
    try {
      const response = await request.get(API_ENDPOINTS.EVALUATIONS.GET(id));
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default evaluationService;

