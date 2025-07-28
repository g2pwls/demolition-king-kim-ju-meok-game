import React from 'react';
import '../styles/SignupPage.css';
import loginBack from '../assets/images/login/loginbackf.png';

function SignUp() {
  return (
    <div className="signup-page" style={{ backgroundImage: `url(${loginBack})` }}>
      <div className="signup-box">
        
        {/* 좌측: 캐릭터 선택 */}
        <div className="character-select-box">
          {/* 추후 캐릭터 넣을 영역 */}
        </div>

        {/* 우측: 입력 폼 */}
        <form className="signup-form">
          
          {/* 닉네임 */}
          <div className="form-row2 with-button">
            <label>닉네임</label>
            <input type="text" />
            <button type="button">중복확인</button>
          </div>

          {/* 이메일 */}
          <div className="form-row2 with-button">
            <label>이메일</label>
            <input type="email" />
            <button type="button">중복확인</button>
          </div>

          {/* 비밀번호 */}
          <div className="form-row2">
            <label>비밀번호</label>
            <input type="password" />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row2">
            <label>비밀번호 확인</label>
            <input type="password" />
          </div>

          {/* 회원가입 버튼 */}
          <div className="form-row2 button-row">
            <button type="submit" className="signup-button">회원가입 하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
