// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://i13e106.p.ssafy.io/api',
  // withCredentials: true  // refreshToken을 httpOnly 쿠키로 쓴다면 켜주세요
});

// 유틸: JWT exp 파싱
function getTokenExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;  // ms 단위
  } catch {
    return 0;
  }
}

// 1) 요청 인터셉터: 만료 임박 시 미리 refresh
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const expTime = getTokenExp(accessToken);
      const now = Date.now();

      // 만료 1분(60,000ms) 이내라면 갱신
      if (expTime - now < 60_000) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const { data } = await axios.post(
            `${api.defaults.baseURL}/user/auth/tokenrefresh`,
            { refreshToken }  // 서버가 body로 받을 경우
            // 만약 header로 받을 경우:
            // null,
            // { headers: { Authorization: `Bearer ${refreshToken}` } }
          );
          const newAccess = data.result.accessToken;
          localStorage.setItem('accessToken', newAccess);
        } catch (err) {
          // 갱신 실패 시 강제 로그아웃
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      // 최종적으로 최신 accessToken 헤더에 세팅
      config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2) 응답 인터셉터: 401 Unauthorized 잡아서 refresh & retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;  // 무한루프 방지
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${api.defaults.baseURL}/user/auth/tokenrefresh`,
          { refreshToken }
        );
        const newAccess = data.result.accessToken;
        localStorage.setItem('accessToken', newAccess);

        // 실패한 원래 요청에 새 토큰 세팅 후 재시도
        config.headers.Authorization = `Bearer ${newAccess}`;
        return api.request(config);
      } catch (refreshErr) {
        // refresh도 실패하면 로그인 페이지로
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;