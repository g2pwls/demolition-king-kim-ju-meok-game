import React from 'react';
import '../styles/LoginPage.css';
import googleIcon from '../assets/images/login/google.png';
import kakaoIcon from '../assets/images/login/kakao.png';
import loginBack from '../assets/images/login/loginbackf.png';
import { Link } from 'react-router-dom';
function LoginPage() {
  return (
    <div
      className="login-page-background"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      <div className="login-box">
        <form className="login-form">
          {/* 아이디 + 비밀번호 + 로그인 버튼 같은 줄 */}
          <div className="form-row1 with-button">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ width: '100px' }}>아이디</label>
                <input type="text" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '100px' }}>비밀번호</label>
                <input type="password" />
              </div>
            </div>
            <button className="login-button">로그인</button>
          </div>


          {/* 자동로그인 오른쪽 정렬 */}
          <div className="login-options">
            <label>
              <input type="checkbox" /> 자동로그인
            </label>
          </div>

          {/* 소셜 로그인 */}
          <div className="social-login">
            <img src={googleIcon} alt="Google" />
            <img src={kakaoIcon} alt="Kakao" />
          </div>

          {/* 하단 링크 */}
          <div className="login-links">
            <Link to="/signup">회원가입</Link> | <Link to="/password">비밀번호 찾기</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
