import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PasswordPage.css';
import loginBack from '../assets/images/login/loginbackf.png';
import { useNavigate } from 'react-router-dom';

export default function PasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // 인증번호 발송
  const handleSendCode = async () => {
    try {
      await axios.post('https://i13e106.p.ssafy.io/api/v1/user/email/reset/send', {
        email,
      });
      alert('인증번호가 전송되었습니다.');
    } catch (error) {
      console.error(error);
      alert('인증번호 전송 실패');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const res = await axios.post('https://i13e106.p.ssafy.io/api/v1/user/email/reset/verify', {
        email,
        code: authCode,
      });

      if (res.data.result.available === true) {
        alert('이메일 인증 성공!');
        setIsVerified(true);
      } else {
        alert('인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('인증번호 확인 실패');
    }
  };

  // 다음 단계 (비밀번호 재설정 화면 이동)
  const handleNext = (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    // ✅ 이메일을 state로 같이 전달
    navigate('/resetpassword', { state: { email } });
  };

  return (
    <div className="changepw-page" style={{ backgroundImage: `url(${loginBack})` }}>
      <div className="changepw-box">
        <form className="changepw-form" onSubmit={handleNext}>
          {/* 이메일 입력 + 인증번호 발송 */}
          <div className="form-row3 with-button">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isVerified}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!email || isVerified}
            >
              인증번호 발송
            </button>
          </div>

          {/* 인증번호 입력 + 확인 */}
          <div className="form-row3 with-button">
            <label>인증번호</label>
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              required
              disabled={isVerified}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={!authCode || isVerified}
            >
              확인
            </button>
          </div>

          {/* 다음 버튼 */}
          <div className="form-row3 button-row">
            <button type="submit" className="next-button">
              다음 →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}