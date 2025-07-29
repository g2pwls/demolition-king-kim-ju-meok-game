import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import googleIcon from '../assets/images/login/google.png';
import kakaoIcon from '../assets/images/login/kakao.png';
import loginBack from '../assets/images/login/loginbackf.png';
import backIcon from '../assets/images/back.png';
import { Link } from 'react-router-dom';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://192.168.30.201:8080/api/user/auth/login',
        null, // POST body 없음
        {
          params: {
            email,
            password,
          },
        }
      );

      console.log('로그인 성공:', response.data);
      alert('로그인 성공!');
      // 예: 토큰 저장 후 이동
      // localStorage.setItem('token', response.data.token);
      // navigate('/main');

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
