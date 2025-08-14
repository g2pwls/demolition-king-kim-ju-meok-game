import React, { useState, useMemo,useEffect } from 'react';
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
import { useAudio } from "../context/AudioContext";
import startBgm from "../assets/sounds/start_bgm.wav";
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

  // --- 비밀번호 유효성 규칙: 8~20자, 공백 불가 ---
  const lenOK = password.length >= 8 && password.length <= 20;
  const noSpace = !/\s/.test(password);
  const hasNumber = /\d/.test(password); // 숫자 포함
  const hasLetter = /[a-zA-Z]/.test(password); // 영문 포함
  const pwValid = lenOK && noSpace && hasNumber && hasLetter;

  // 비밀번호 일치 여부
  const pwMatch = password.length > 0 && password === passwordConfirm;

  // 모든 조건
  const canSubmit = useMemo(() => {
    return isVerified && pwValid && pwMatch && userNickname && email;
  }, [isVerified, pwValid, pwMatch, userNickname, email]);


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
    if (!pwValid) {
      alert('비밀번호는 영문, 숫자 포함 8~20자이며 공백을 포함할 수 없습니다.');
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

    const { audioRef, playAudio } = useAudio();  // 오디오 상태 가져오기
  
    useEffect(() => {
      // 페이지 로딩 시, 저장된 오디오 시간으로 설정
      if (audioRef.current) {
        const savedTime = localStorage.getItem('audioTime');
        const parsedTime = parseFloat(savedTime);
  
        // 값이 유효한 숫자인지 확인하고, 아니면 기본값(0) 설정
        if (!isNaN(parsedTime) && isFinite(parsedTime)) {
          audioRef.current.currentTime = parsedTime; // 유효한 값일 경우에만 설정
        } else {
          audioRef.current.currentTime = 0; // 기본값 0으로 설정
        }
        
        playAudio();  // 음악을 이어서 재생
      }
  
      // 페이지 전환 시 현재 시간을 로컬스토리지에 저장
      const saveAudioTime = () => {
        if (audioRef.current) {
          localStorage.setItem('audioTime', audioRef.current.currentTime);
        }
      };
  
      // `audioRef.current`가 HTMLAudioElement인 경우에만 addEventListener 사용
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.addEventListener('play', saveAudioTime);
      }
  
      return () => {
        // clean up
        if (audioElement) {
          audioElement.removeEventListener('play', saveAudioTime);
          localStorage.setItem('audioTime', audioElement.currentTime);
        }
      };
    }, [audioRef, playAudio]);

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
              placeholder="영문, 숫자 포함 8~20자, 공백 불가"
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
            <button type="submit" className="signup-button" disabled={!canSubmit}>회원가입 하기</button>
          </div>
        </form>
      </div>
      {/* 배경 음악 */}
            <audio ref={audioRef} src={startBgm} loop />
    </div>
  );
}

export default SignUp;
