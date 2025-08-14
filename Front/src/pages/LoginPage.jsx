import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // ✅ axios 인스턴스 기반
import '../styles/LoginPage.css';
import googleIcon from '../assets/images/login/google.png';
import kakaoIcon from '../assets/images/login/kakao.png';
import loginBack from '../assets/images/login/loginbackf.png';
import backIcon from '../assets/images/back.png';
import AnimatedPage from '../components/AnimatedPage';
import { useAudio } from "../context/AudioContext"; // AudioContext import
import startBgm from "../assets/sounds/start_bgm.wav";

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
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ 로그인 요청 (axios 대신 api 사용)
      const response = await api.post('/user/auth/login', null, {
        params: { email, password },
      });

      const result = response?.data?.result;
      const accessToken = result?.accessToken;
      const refreshToken = result?.refreshToken;

      // ✅ 토큰에서 userUuid 추출
      const decoded = parseJwt(accessToken);
      const userUuid = decoded?.sub || decoded?.userUuid || decoded?.id;

      if (!userUuid) {
        alert('userUuid를 토큰에서 추출하지 못했습니다.');
        return;
      }

      // ✅ localStorage 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userUuid', userUuid);
      localStorage.setItem('userEmail', email);

      // ✅ 유저 정보 조회
      const userInfo = await api.get(`/user/auth/getUserInfo?userUuid=${userUuid}`);
      const nickname = userInfo.data.result.userNickname;

      localStorage.setItem('userNickname', nickname);
      localStorage.setItem('user', JSON.stringify(userInfo.data.result));

      // ✅ 이동
      navigate('/story');
    } catch (error) {
      const message =
        error.response?.data?.message || '아이디 또는 비밀번호가 잘못되었습니다.';
      alert(`❌ 로그인 실패: ${message}`);
    }
  };

  return (
    <AnimatedPage>
    <div
      className="login-page-background"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row1 with-button">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ width: '100px' }}>이메일</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ width: '100px' }}>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="login-button">로그인</button>
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> 자동로그인
            </label>
          </div>

          <div className="social-login">
            <img
              src={googleIcon}
              alt="Google"
              onClick={() => {
                window.location.href = "/api/oauth2/authorization/google";
              }}
            />
            <img
              src={kakaoIcon}
              alt="Kakao"
              onClick={() => {
                window.location.href = "/api/oauth2/authorization/kakao";
              }}
            />
          </div>

          <div className="login-links">
            <Link to="/signup">회원가입</Link> | <Link to="/password">비밀번호 찾기</Link>
          </div>
        </form>
      </div>
    </div>
    {/* 배경 음악 */}
      <audio ref={audioRef} src={startBgm} loop />
    </AnimatedPage>
  );
}

export default LoginPage;