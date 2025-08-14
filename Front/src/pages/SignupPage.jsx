import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SignupPage.css';
import loginBack from '../assets/images/login/loginbackf.png';
import profileBack from '../assets/images/login/profileback.png';
import girl1 from '../assets/images/character/girl1.png';
import girl2 from '../assets/images/character/girl2.png';
import girl3 from '../assets/images/character/girl3.png';
import boy1 from '../assets/images/character/boy1.png';
import boy2 from '../assets/images/character/boy2.png';
import boy3 from '../assets/images/character/boy3.png';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // ✅ axios 인스턴스 기반

function SignUp() {
  const navigate = useNavigate();

  const profileList = [
    { image: girl1 },
    { image: boy1 },
    { image: girl2 },
    { image: boy2 },
    { image: girl3 },
    { image: boy3 }
  ];

  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [profileSeq, setProfileSeq] = useState(1); // 기본 캐릭터 번호
  const [nicknameStatus, setNicknameStatus] = useState(null); // 닉네임 상태

  // 닉네임 중복검사
  const checkNicknameDuplication = async () => {
    try {
      const res = await api.post('/user/auth/signup/nickname/check', {
        nickname: userNickname,
      });

      if (res.data.result.available) {
        setNicknameStatus('available');
      } else {
        setNicknameStatus('unavailable');
      }
    } catch (err) {
      console.error(err);
      setNicknameStatus('error');
    }
  };

  // 이메일 인증코드 요청
  const requestAuthCode = async () => {
    try {
      await api.post('/v1/user/email/signup/send', { email });

      alert('인증번호가 이메일로 전송되었습니다.');
    } catch (err) {
      console.error(err);
      alert('이메일 인증 요청 실패');
    }
  };

  // 인증번호 확인
  const verifyAuthCode = async () => {
    try {
      const res = await api.post('/v1/user/email/signup/verify', {
        email,
        code: authCode,
      });

      if (res.data.result.available === true) {
        alert('이메일 인증 성공!');
        setIsVerified(true);
      } else {
        alert('인증번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('인증 확인 실패');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await api.post(
        '/user/auth/signup',
        null,
        {
          params: {
            email,
            password,
            userNickname,
            profileSeq,
          },
        }
      );
      
      console.log('회원가입 성공:', response.data);
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${loginBack})` }}>
      <div className="signup-box">
        <div
          className="character-select-box"
          style={{ backgroundImage: `url(${profileBack})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="character-grid1">
            {profileList.map((profile, index) => (
              <div
                key={index}
                className={`character-item ${profileSeq === index + 1 ? 'selected' : ''}`}
                onClick={() => setProfileSeq(index + 1)}
              >
                <img src={profile.image} alt={`Character ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          {/* 닉네임 */}
          <div className="form-row2 with-button">
            <label>닉네임</label>
            <input
              type="text"
              value={userNickname}
              onChange={(e) => {
                setUserNickname(e.target.value);
                setNicknameStatus(null); // 닉네임 변경 시 상태 초기화
              }}
            />
            <div className="nickname-check-container">
              <button type="button" onClick={checkNicknameDuplication}>
                중복확인
              </button>
              {/* 상태 표시 */}
              <div className="nickname-status">
                {nicknameStatus === 'available' && (
                  <span style={{ color: 'green' }}>사용 가능</span>
                )}
                {nicknameStatus === 'unavailable' && (
                  <span style={{ color: 'red' }}>이미 사용 중</span>
                )}
                {nicknameStatus === 'error' && (
                  <span style={{ color: 'orange' }}>확인 실패</span>
                )}
              </div>
            </div>
          </div>

          {/* 이메일 + 인증요청 버튼 */}
          <div className="form-row2 with-button">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isVerified}
            />
            <button type="button" onClick={requestAuthCode} disabled={!email || isVerified}>
              인증요청
            </button>
          </div>

          {/* 인증번호 입력 + 확인 버튼 */}
          <div className="form-row2 with-button">
            <label>인증번호</label>
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              disabled={isVerified}
            />
            <button type="button" onClick={verifyAuthCode} disabled={!authCode || isVerified}>
              확인
            </button>
          </div>

          {/* 비밀번호 */}
          <div className="form-row2">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row2">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {/* 회원가입 */}
          <div className="form-row2 button-row">
            <button type="submit" className="signup-button">회원가입 하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
