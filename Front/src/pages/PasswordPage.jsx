import React from 'react';
import '../styles/PasswordPage.css';
import loginBack from '../assets/images/login/loginbackf.png';
import { useNavigate } from 'react-router-dom';

export default function PasswordPage() {
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    navigate('/PasswordPage');
  };

  return (
    <div className="changepw-page" style={{ backgroundImage: `url(${loginBack})` }}>
      <div className="changepw-box">
        <form className="changepw-form" onSubmit={handleNext}>
          {/* 이메일 입력 + 인증번호 발송 */}
          <div className="form-row3 with-button">
            <label>이메일</label>
            <input type="email" required />
            <button type="button">인증번호 발송</button>
          </div>

          {/* 인증번호 입력 + 확인 */}
          <div className="form-row3 with-button">
            <label>인증번호</label>
            <input type="text" required />
            <button type="button">확인</button>
          </div>

          {/* 다음 버튼 */}
          <div className="form-row3 button-row">
            <button type="submit" className="next-button">다음 →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
