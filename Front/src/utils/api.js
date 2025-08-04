// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://i13e106.p.ssafy.io/api',
});

// 요청마다 최신 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
