import React from 'react';

function LoginPage() {
  return (
    <div className="login-container">
      <h2>로그인</h2>
      <input type="text" placeholder="아이디" />
      <input type="password" placeholder="비밀번호" />
      <button>로그인</button>
    </div>
  );
}

export default LoginPage;
