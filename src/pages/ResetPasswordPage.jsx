import React from 'react';
import '../styles/ResetPasswordPage.css';
import loginBack from '../assets/images/login/loginbackf.png';

export default function ChangePassword2() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('비밀번호가 변경되었습니다!');
    // 나중에 navigate('/') 또는 로그인 페이지로 이동 로직 추가 가능
  };

  return (
    <div className="changepw-page" style={{ backgroundImage: `url(${loginBack})` }}>
      <div className="changepw-box">
        <form className="changepw-form" onSubmit={handleSubmit}>
          {/* 비밀번호 */}
          <div className="form-row4">
            <label>비밀번호</label>
            <input type="password" required />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row4">
            <label>비밀번호 확인</label>
            <input type="password" required />
          </div>

          {/* 확인 버튼 */}
          <div className="form-row4 button-row">
            <button type="submit" className="next-button">확인</button>
          </div>
        </form>
      </div>
    </div>
  );
}
