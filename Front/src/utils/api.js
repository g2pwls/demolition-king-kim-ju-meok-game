// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // API 서버 주소
});

// 요청 전에 accessToken을 자동으로 헤더에 붙임
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
