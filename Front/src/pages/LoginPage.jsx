import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import googleIcon from '../assets/images/login/google.png';
import kakaoIcon from '../assets/images/login/kakao.png';
import loginBack from '../assets/images/login/loginbackf.png';
import backIcon from '../assets/images/back.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
// import * as jwt_decode from 'jwt-decode';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('❌ JWT 파싱 실패:', e);
    return null;
  }
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
   // 꼭 위에 import 추가하세요

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      'http://54.180.226.214:8080/api/user/auth/login',
      null,
      {
        params: { email, password },
      }
    );

    const result = response?.data?.result;
    const accessToken = result?.accessToken;
    const refreshToken = result?.refreshToken;

    // accessToken으로부터 userUuid 추출
    let userUuid = null;
    try {
      const decoded = parseJwt(accessToken);
      console.log('✅ JWT Payload:', decoded);
      userUuid = decoded?.sub || decoded?.userUuid || decoded?.id;
    } catch (decodeError) {
      console.error('❌ JWT decode 실패:', decodeError);
    }

    if (!userUuid) {
      alert('userUuid를 토큰에서 추출하지 못했습니다.');
      return;
    }

    // 로컬스토리지 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userUuid', userUuid);

    // getUserInfo API 호출
    const userInfo = await api.get(`/user/auth/getUserInfo?userUuid=${userUuid}`);
    const nickname = userInfo.data.result.userNickname;

    localStorage.setItem('userNickname', nickname);
    localStorage.setItem('user', JSON.stringify(userInfo.data.result));

    console.log('✅ 로그인 후 최종 유저 정보:', userInfo.data.result);
    navigate('/story');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('아이디 또는 비밀번호가 잘못되었습니다.');
  }
};


  return (
    <div
      className="login-page-background"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      {/* 왼쪽 상단 뒤로가기 버튼 */}
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <img src={backIcon} alt="뒤로가기" />
      </button>

      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row1 with-button">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ width: '100px' }}>아이디</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '100px' }}>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="login-button">로그인</button>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" /> 자동로그인
            </label>
          </div>

          <div className="social-login">
            <img src={googleIcon} alt="Google" />
            <img src={kakaoIcon} alt="Kakao" />
          </div>

          <div className="login-links">
            <Link to="/signup">회원가입</Link> | <Link to="/password">비밀번호 찾기</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;