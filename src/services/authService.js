import request from '../utils/request';
import { API_ENDPOINTS } from '../config/api';

// 认证服务
const authService = {
  // 用户注册
  register: async (userData) => {
    try {
      const response = await request.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 用户登录
  login: async (credentials) => {
    try {
      const response = await request.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // 保存 token 和用户信息
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // 用户登出
  logout: async () => {
    try {
      await request.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      // 清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // 刷新 token
  refreshToken: async (refreshToken) => {
    try {
      const response = await request.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken,
      });

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const response = await request.get(API_ENDPOINTS.AUTH.ME);

      // 更新本地用户信息
      if (response) {
        localStorage.setItem('user', JSON.stringify(response));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // 获取存储的用户信息
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;

