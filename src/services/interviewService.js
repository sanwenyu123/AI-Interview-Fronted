import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

// 面试服务
const interviewService = {
  // 获取面试列表
  getInterviews: async (params = {}) => {
    try {
      const response = await request.get(API_ENDPOINTS.INTERVIEWS.LIST, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 创建面试
  createInterview: async (interviewData) => {
    try {
      const response = await request.post(API_ENDPOINTS.INTERVIEWS.CREATE, interviewData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取面试详情
  getInterview: async (id) => {
    try {
      const response = await request.get(API_ENDPOINTS.INTERVIEWS.GET(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 更新面试
  updateInterview: async (id, interviewData) => {
    try {
      const response = await request.put(API_ENDPOINTS.INTERVIEWS.UPDATE(id), interviewData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 删除面试
  deleteInterview: async (id) => {
    try {
      await request.delete(API_ENDPOINTS.INTERVIEWS.DELETE(id));
    } catch (error) {
      throw error;
    }
  },

  // 开始面试
  startInterview: async (id) => {
    try {
      const response = await request.post(API_ENDPOINTS.INTERVIEWS.START(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 完成面试
  completeInterview: async (id, completionData = {}) => {
    try {
      const response = await request.post(
        API_ENDPOINTS.INTERVIEWS.COMPLETE(id),
        completionData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 取消面试
  cancelInterview: async (id) => {
    try {
      const response = await request.post(API_ENDPOINTS.INTERVIEWS.CANCEL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取面试统计
  getStatistics: async () => {
    try {
      const response = await request.get(API_ENDPOINTS.INTERVIEWS.STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default interviewService;

