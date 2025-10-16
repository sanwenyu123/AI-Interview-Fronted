import axios from 'axios';
import { message } from 'antd';
import { API_CONFIG } from '../config/api';

// 创建 axios 实例
const request = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { response, config } = error;

    if (!response) {
      message.error('网络错误，请检查您的网络连接');
      return Promise.reject(error);
    }

    const { status, data } = response;

    switch (status) {
      case 400:
        message.error(data.detail || '请求参数错误');
        break;

      case 401:
        // Token 过期或无效
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken && !config._retry) {
          config._retry = true;

          try {
            // 尝试刷新 token
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/auth/refresh`,
              { refresh_token: refreshToken }
            );

            const { access_token, refresh_token, user } = response.data;
            localStorage.setItem('token', access_token);
            if (refresh_token) {
              localStorage.setItem('refreshToken', refresh_token);
            }
            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }

            // 重新发起原请求
            config.headers.Authorization = `Bearer ${access_token}`;
            return request(config);
          } catch (refreshError) {
            // 刷新 token 失败，清除登录信息并跳转到登录页
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // 只有不在登录页时才跳转
            if (!window.location.pathname.includes('/login')) {
              message.error('登录已过期，请重新登录');
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          // 只有不在登录页时才跳转
          if (!window.location.pathname.includes('/login')) {
            message.error('请先登录');
            window.location.href = '/login';
          }
        }
        break;

      case 403:
        message.error('没有权限访问该资源');
        break;

      case 404:
        message.error('请求的资源不存在');
        break;

      case 422:
        // 验证错误
        if (data.detail && Array.isArray(data.detail)) {
          const errorMsg = data.detail.map(err => err.msg).join('; ');
          message.error(errorMsg);
        } else {
          message.error(data.detail || '数据验证失败');
        }
        break;

      case 500:
        message.error('服务器错误，请稍后重试');
        break;

      default:
        message.error(data.detail || `请求失败: ${status}`);
    }

    return Promise.reject(error);
  }
);

export default request;

