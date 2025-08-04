// StartPage.jsx
import React, { useState } from 'react';
import { useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';
import '../styles/MainPage.css';
import myPageIcon from '../assets/images/main/mypageicon1.png';
import tutorialIcon from '../assets/images/main/tutorialicon1.png';
import lankingIcon from '../assets/images/main/lankingicon.png';
import modeEvent from '../assets/images/main/modee.png';
import modeSingle from '../assets/images/main/modes.png';
import modeMulti from '../assets/images/main/modem.png';
import myPageModal from '../assets/images/main/mypagemodal.png';
import tutorialModal from '../assets/images/main/tutorialback.png';
import fbottom from '../assets/images/main/fbottom.png';
import fcbottom from '../assets/images/main/fcbottom.png';
import roomParticipation from '../assets/images/main/roomi.png';
import roomMake from '../assets/images/main/roomm.png';
import avatarUrl from '../assets/images/avatar.png';
import pencilIcon from '../assets/images/mypage/pencil.png';
import newIcon from '../assets/images/main/new.png';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// 베이직 건물 이미지 import
import building1 from '../assets/images/building/building1.png';
import building2 from '../assets/images/building/building2.png';
import building3 from '../assets/images/building/building3.png';
import building4 from '../assets/images/building/building4.png';
import building5 from '../assets/images/building/building5.png';
import building6 from '../assets/images/building/building6.png';
import building7 from '../assets/images/building/building7.png';
import building8 from '../assets/images/building/building8.png';
import building9 from '../assets/images/building/building9.png';
import building10 from '../assets/images/building/building10.png';
import building11 from '../assets/images/building/building11.png';
import building12 from '../assets/images/building/building12.png';
import building13 from '../assets/images/building/building13.png';
import building14 from '../assets/images/building/building14.png';
import building15 from '../assets/images/building/building15.png';
import building16 from '../assets/images/building/building16.png';
import building17 from '../assets/images/building/building17.png';
import building18 from '../assets/images/building/building18.png';
import building19 from '../assets/images/building/building19.png';
import building20 from '../assets/images/building/building20.png';
import building21 from '../assets/images/building/building21.png';
import building22 from '../assets/images/building/building22.png';
import building23 from '../assets/images/building/building23.png';
import building24 from '../assets/images/building/building24.png';
import building25 from '../assets/images/building/building25.png';
import building26 from '../assets/images/building/building26.png';


// 레어 건물 이미지 import
import rare1 from '../assets/images/building/rare1.png';
import rare2 from '../assets/images/building/rare2.png';
import rare3 from '../assets/images/building/rare3.png';
import rare4 from '../assets/images/building/rare4.png';
import rare5 from '../assets/images/building/rare5.png';
import rare6 from '../assets/images/building/rare6.png';
import rare7 from '../assets/images/building/rare7.png';
import rare8 from '../assets/images/building/rare8.png';
import rare9 from '../assets/images/building/rare9.png';
import rare10 from '../assets/images/building/rare10.png';
import rare11 from '../assets/images/building/rare11.png';
import rare12 from '../assets/images/building/rare12.png';
import rare13 from '../assets/images/building/rare13.png';
import rare14 from '../assets/images/building/rare14.png';
import rare15 from '../assets/images/building/rare15.png';
import rare16 from '../assets/images/building/rare16.png';
import rare17 from '../assets/images/building/rare17.png';
import rare18 from '../assets/images/building/rare18.png';
import rare19 from '../assets/images/building/rare19.png';
import rare20 from '../assets/images/building/rare20.png';
import rare21 from '../assets/images/building/rare21.png';
import rare22 from '../assets/images/building/rare22.png';
import rare23 from '../assets/images/building/rare23.png';
import rare24 from '../assets/images/building/rare24.png';
import rare25 from '../assets/images/building/rare25.png';
import rare26 from '../assets/images/building/rare26.png';
import rare27 from '../assets/images/building/rare27.png';
import rare28 from '../assets/images/building/rare28.png';
import rare29 from '../assets/images/building/rare29.png';
import rare30 from '../assets/images/building/rare30.png';
import rare31 from '../assets/images/building/rare31.png';
import rare32 from '../assets/images/building/rare32.png';
import rare33 from '../assets/images/building/rare33.png';
import rare34 from '../assets/images/building/rare34.png';
import rare35 from '../assets/images/building/rare35.png';
import rare36 from '../assets/images/building/rare36.png';
import rare37 from '../assets/images/building/rare37.png';
import rare38 from '../assets/images/building/rare38.png';
import rare39 from '../assets/images/building/rare39.png';
import rare40 from '../assets/images/building/rare40.png';
import rare41 from '../assets/images/building/rare41.png';
import rare42 from '../assets/images/building/rare42.png';
import rare43 from '../assets/images/building/rare43.png';
import rare44 from '../assets/images/building/rare44.png';
import rare45 from '../assets/images/building/rare45.png';
import rare46 from '../assets/images/building/rare46.png';
import rare47 from '../assets/images/building/rare47.png';
import rare48 from '../assets/images/building/rare48.png';

import character1 from "../assets/images/main/character1.png";
import character2 from "../assets/images/main/character2.png";
import character3 from "../assets/images/main/character3.png";
import arrowLeft from "../assets/images/main/left.png";
import arrowRight from "../assets/images/main/right.png";
import selectButton from "../assets/images/main/select.png";

import girl1 from '../assets/images/character/girl1.png';
import girl2 from '../assets/images/character/girl2.png';
import girl3 from '../assets/images/character/girl3.png';
import boy1 from '../assets/images/character/boy1.png';
import boy2 from '../assets/images/character/boy2.png';
import boy3 from '../assets/images/character/boy3.png';

const profileImages = [girl1, boy1, girl2, boy2, girl3, boy3]; // 순서대로 profileSeq: 1~6

function MainPage() {
    const [userNickname, setUserNickname] = useState('');
    const [friendRequests, setFriendRequests] = useState([
    { id: 1, nickname: '유재석' },
    { id: 2, nickname: '복싱보이' },
    { id: 3, nickname: '다죽었음' },

  ]);
const acceptFriend = (requestId) => {
  const accepted = friendRequests.find(req => req.id === requestId);

  console.log('✅ 수락 요청된 ID:', requestId);
  console.log('✅ 수락할 친구:', accepted);
  if (accepted) {
    setFriends(prev => [...prev, { id: accepted.id, nickname: accepted.nickname, online: false }]);
    console.log('✅ 업데이트된 친구 목록:', updated);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  }
};

const rejectFriend = (requestId) => {
  setFriendRequests(prev => prev.filter(req => req.id !== requestId));
};

  const characterList = [character1, character2, character3];
  const [animationDirection, setAnimationDirection] = useState(null);
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.nickname) setNickname(user.nickname);

    const savedIndex = localStorage.getItem("selectedCharacter");
    if (savedIndex !== null) {
      setCurrentIndex(parseInt(savedIndex));
      setSelectedIndex(parseInt(savedIndex));
    }
  }, []);

  const handleLeft = () => {
    setAnimationDirection("left");
    setCurrentIndex(
      (prev) => (prev - 1 + characterList.length) % characterList.length
    );
  };

  const handleRight = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev + 1) % characterList.length);
  };

  const handleSelect = () => {
    localStorage.setItem("selectedCharacter", currentIndex);
    setSelectedIndex(currentIndex);
  };

  const friends = [
    { id: 1, nickname: 'GO성현', online: true},
    { id: 2, nickname: 'zl존예리', online: true},
    { id: 3, nickname: '조은사람조은', online: true},
    { id: 4, nickname: 'ID혜지니', online: true},
    { id: 5, nickname: '킹왕짱창현', online: false},
    { id: 6, nickname: '박민준민준', online: true},
    { id: 7, nickname: '지훈남', online: false},
    { id: 8, nickname: 'Ao준혁oA', online: true},
    { id: 9, nickname: 'U빈', online: true},


  ];
  const buildingImages = [
    building1, building2, building3, building4, building5, building6,
    building7, building8, building9, building10, building11, building12,
    building13, building14, building15, building16, building17, building18,
    building19, building20, building21, building22, building23, building24,
    building25, building26, 
  ];

  const rareImages = [
    rare1, rare2, rare3, rare4, rare5, rare6, rare7, rare8, rare9, rare10,
    rare11, rare12, rare13, rare14, rare15, rare16, rare17, rare18, rare19, rare20,
    rare21, rare22, rare23, rare24, rare25, rare26, rare27, rare28, rare29, rare30,
    rare31, rare32, rare33, rare34, rare35, rare36, rare37, rare38, rare39, rare40,
    rare41, rare42, rare43, rare44, rare45, rare46, rare47, rare48,
  ];
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null); // 'tutorial' 또는 'mypage' 또는 null
  const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false); // ✅ 반드시 함수 컴포넌트 내부에
  const [activeTab, setActiveTab] = useState('통계');

  const [userInfo, setUserInfo] = useState(null);

useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('⛔️ 토큰이 없습니다. 로그인 먼저 필요합니다.');
        return;
      }

      const res = await api.get('/user/auth/getUserInfo');

      console.log("✅ 받은 유저 정보:", res.data.result);
      if (res.data.result) {
        setUserInfo(res.data.result);
      }
    } catch (err) {
      console.error('유저 정보 가져오기 실패:', err);
    }
  };

  fetchUserInfo();
}, []);


// userInfo 바뀌면 nickname, email 같이 업데이트
useEffect(() => {
  if (userInfo) {
    setEditNickname(userInfo.nickname);
    setEditEmail(userInfo.email);
    setUserNickname(userInfo.nickname);  // 캐릭터 아래 닉네임 표기용
  }
}, [userInfo]);




  const [isEditing, setIsEditing] = useState(false);           // 수정 모드 진입 여부
  const [editNickname, setEditNickname] = useState(userInfo?.nickname); // 수정할 닉네임 임시 저장
  const [editEmail, setEditEmail] = useState(userInfo?.email);          // 수정할 이메일 임시 저장
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [playStats, setPlayStats] = useState({
    totalPlayTime: 157,       // 누적 (분 단위)
    todayPlayTime: 67,       // 오늘 (분 단위)
    weeklyPlayTime: [110, 220, 50, 60, 300, 270, 60], // 일~토, 분 단위
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedCalorieData, setSelectedCalorieData] = useState([]);
  const calorieData = {
    '2025-07-25': 220,
    '2025-07-26': 150,
    '2025-07-27': 180,
    '2025-07-28': 90,
    '2025-07-29': 270,
    '2025-07-30': 60,
    '2025-07-31': 300,
  };

  useEffect(() => {
  const userEmail = localStorage.getItem('userEmail');
  console.log('🔐 로그인한 유저 이메일:', userEmail);

  const userNickname = localStorage.getItem('userNickname');
  console.log('🔐 로그인한 유저 닉네임:', userNickname);
}, []);

//   useEffect(() => {
//   api.post('/user/auth/login', null, {
//     params: {
//       email: 'yhjyhw1004@naver.com',
//       password: '1234',
//     }
//   })
//     .then((res) => {
//       console.log('✅ 로그인 테스트 성공:', res.data);
//     })
//     .catch((err) => {
//       console.error('❌ 로그인 테스트 실패:', err);
//     });
// }, []);

    useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    const start = new Date(dateRange[0]);
    const end = new Date(dateRange[1]);
    const result = [];

    const current = new Date(start);
    while (current <= end) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      if (calorieData[key]) {
        result.push({
          date: key,
          calorie: calorieData[key],
        });
      }
      current.setDate(current.getDate() + 1);
    }

    setSelectedCalorieData(result);
  } else {
    setSelectedCalorieData([]);
  }
}, [dateRange]);
    const formatDate = (date) => {
      if (!date) return '';
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

  return (
    <div className="main-page-background">
      <div className="main-fixed-wrapper">
      <div className="top-right-buttons">
        <button className="top-icon-button" onClick={() => setModalType('lank')}>
          <img src={lankingIcon} alt="랭킹" />
        </button>
        <button className="top-icon-button" onClick={() => setModalType('tutorial')}>
          <img src={tutorialIcon} alt="튜토리얼" />
        </button>
        <button className="top-icon-button" onClick={() => setModalType('mypage')}>
          <img src={myPageIcon} alt="마이페이지" />
        </button>
      </div>

      <div className="bottom-right-buttons">
        <button className="bottom-icon-button" onClick={() => navigate('/event')}>
          <img src={modeEvent} alt="이벤트 모드" />
        </button>
        <button className="bottom-icon-button" onClick={() => navigate('/singletest')}>
          <img src={modeSingle} alt="싱글 모드" />
        </button>
        <button className="bottom-icon-button" onClick={() => setModalType('multi')}>
          <img src={modeMulti} alt="멀티 모드" />
        </button>
      </div>

      <div className="character-section">
          <div className="nickname-text">{userNickname}</div>
          <div className={`character-selector animate-${animationDirection}`}>
            <img src={arrowLeft} alt="왼쪽" className="arrow-button large" onClick={handleLeft} />
            <img src={characterList[currentIndex]} alt="캐릭터" className="main-character large" onAnimationEnd={() => setAnimationDirection(null)} />
            <img src={arrowRight} alt="오른쪽" className="arrow-button large" onClick={handleRight} />
          </div>
          <div className="select-button-wrapper">
            <img src={selectButton} alt="선택 버튼" className={`select-button ${selectedIndex === currentIndex ? 'selected' : ''}`} onClick={handleSelect} />
          </div>
      </div>

      {modalType && (
        <div className="modal-overlay" onClick={() => {setModalType(null);setActiveTab('통계'); setIsEditing(false); setIsEditingNickname(false); setEditNickname(userInfo?.nickname);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {modalType === 'tutorial' && <img src={tutorialModal} alt="튜토리얼 모달" className="tutorial-modal-image"/>}

            {modalType === 'mypage' && (
              <div className="mypage-modal-wrapper">
                <img src={myPageModal} alt="마이페이지 모달" className="mypage-modal-bg" />

                <div className="mypage-overlay">
                  {/* 왼쪽: 프로필 영역 */}
                  <div className="mypage-left">
                    <img
  className="mypage-avatar"
  src={userInfo?.avatarUrl || profileImages[(userInfo?.profileSeq || 1) - 1]}
  alt="프로필"
/>
                    <div className="mypage-name">{userInfo?.userNickname}</div>
                    <div className="mypage-email">{userInfo?.userEmail}</div>
                    <button
                      className={`mypage-edit-btn ${isEditing ? 'disabled' : ''}`}
                      onClick={() => setIsEditing(!isEditing)}>정보수정
                    </button>
                    <button
  className="mypage-logout-btn"
  onClick={() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user'); // 로그인 시 저장한 사용자 정보도 제거
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('selectedCharacter');
    navigate('/login'); // 로그인 페이지로 이동 (라우트 이름은 실제 프로젝트에 맞게 수정)
  }}
>
  로그아웃
</button>

                  </div>
                  
                  <div className="mypage-right">
                    {/* 탭 버튼 */}
                    <div className="mypage-tabs">
                      <button
                        className={`tab-button ${activeTab === '통계' ? 'active' : ''}`}
                        onClick={() => setActiveTab('통계')}
                      >
                        통계
                      </button>
                      <button
                        className={`tab-button ${activeTab === '도감' ? 'active' : ''}`}
                        onClick={() => setActiveTab('도감')}
                      >
                        도감
                      </button>
                    </div>

                    {/* ✅ 통계 탭 내용 */}
                    {activeTab === '통계' && !isEditing && (
                      <>
                        <div className="playtime-section">
                          {/* 총 플레이 시간 */}
                          <div className="playtime-row-vertical1">
                            <div className="play-label">누적 플레이 시간</div>
                            <div className="bar-with-text">
                              <span className="time-text">
                                {Math.floor(playStats.totalPlayTime / 60)}시간 {playStats.totalPlayTime % 60}분
                              </span>
                            </div>
                          </div>

                          {/* 오늘의 플레이 시간 */}
                          <div className="playtime-row-vertical">
                            <div className="play-label1">오늘의 플레이 시간</div>
                            <div className="bar-with-text">
                              <div className="bar-bg">
                                <div className="bar-fill red" style={{ width: `${(playStats.todayPlayTime / 240) * 100}%` }}></div>
                              </div>
                              <span className="time-text">{playStats.todayPlayTime}분</span>
                            </div>
                          </div>
                        </div>

                        {/* 주간 그래프 */}
                        <div className="weekly-chart-label">이번 주 게임 시간</div>
                        <div className="weekly-chart">
                          {playStats.weeklyPlayTime.map((minutes, i) => {
                            const maxMinutes = 300;
                            const maxHeight = 120;
                            const heightPx = Math.min((minutes / maxMinutes) * maxHeight, maxHeight);

                            const timeLabel =
                              minutes >= 60
                                ? `${Math.floor(minutes / 60)}시간 ${minutes % 60 > 0 ? minutes % 60 + '분' : ''}`
                                : `${minutes}분`;

                            const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

                            return (
                              <div key={i} className="bar-wrapper">
                                <div className="bar-column" style={{ height: `${heightPx}px` }}>
                                  <div className="bar-tooltip">{timeLabel}</div>
                                </div>
                                <div className="bar-day-label">{dayLabels[i]}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 캘린더 */}
                        <div className="calendar-section">
                          <Calendar
                            onChange={setDateRange}
                            value={dateRange}
                            selectRange={true}
                            tileDisabled={({ date, view }) =>
                              view === 'month' &&
                              dateRange[0] &&
                              Math.abs((date - dateRange[0]) / (1000 * 60 * 60 * 24)) > 7
                            }
                          />

                          <div className="calendar-summary-row">
                            <div className="calendar-summary-block">
                              <div className="summary-label">시작일</div>
                              <div className="summary-date">
                                {dateRange[0] ? formatDate(dateRange[0]) : '-'}
                              </div>
                            </div>
                            <div className="calendar-summary-block">
                              <div className="summary-label">종료일</div>
                              <div className="summary-date">
                                {dateRange[1] ? formatDate(dateRange[1]) : '-'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 칼로리 그래프 */}
                        {selectedCalorieData.length > 0 && (
                          <div className="calorie-graph-section">
                            <h3>소모 칼로리 기록</h3>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={selectedCalorieData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="calorie" stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </>
                    )}

                    {/* 정보 수정 화면 - 보기 모드 */}
                    {activeTab === '통계' && isEditing && !isEditingNickname && (
                      <>
                        <div className="profile-view">
                          <div className="info-row">
                            <label>닉네임:</label>
                            <div className="info-me">{editNickname}</div>
                            <button className="edit-icon-btn" onClick={() => setIsEditingNickname(true)}>
                              <img src={pencilIcon} alt="수정" className="edit-icon" />
                            </button>
                          </div>
                          <div className="info-row">
                            <label>이메일:</label>
                            <div className="info-me">{editEmail}</div>
                          </div>
                          <div className="info-row password-row">
                            <button className="change-password-btn">비밀번호 변경</button>
                          </div>
                        </div>

                        {/* ✅ 닫기 버튼: profile-view 밖에 둠 */}
                        <div className="edit-close-wrapper">
                          <button
                            className="close-edit-btn"
                            onClick={() => {
                              setIsEditing(false);
                              setIsEditingNickname(false);
                              setEditNickname(userInfo.nickname);
                            }}
                          >
                            닫기
                          </button>
                        </div>
                      </>
                    )}


                    {/* 닉네임 수정 모드 */}
                    {activeTab === '통계' && isEditing && isEditingNickname && (
                      <div className="nickname-edit-form">
                        <label>닉네임:</label>
                        <input
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          className="nickname-input"
                        />
                        <div className="nickname-edit-buttons">
                          <button className="check-btn">중복확인</button>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setEditNickname(userInfo.nickname);
                              setIsEditingNickname(false);
                            }}
                          >
                            취소
                          </button>
                          <button
                            className="save-btn"
                            onClick={() => {
                              // 저장 로직은 여기에
                              setIsEditingNickname(false);
                            }}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    )}


                    {/* ✅ 도감 탭 내용 */}
                    {activeTab === '도감' && (
                      <div className="collection-section">
                        <div className="buildingname">BASIC</div>
                        <div className="building-grid">
                          {buildingImages.map((src, i) => (
                            <div key={i} className="building-item">
                              <img src={src} alt={`베이직 건물 ${i + 1}`} className="building-image" />
                            </div>
                          ))}
                        </div>

                        <div className="buildingname1">RARE</div>
                        <div className="building-grid">
                          {rareImages.map((src, i) => (
                            <div key={i} className="building-item">
                              <img src={src} alt={`레어 건물 ${i + 1}`} className="building-image" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {modalType === 'multi' && (
              <div className="multi-mode-buttons">
                <button><img src={roomMake} alt="방 만들기" /></button>
                <button><img src={roomParticipation} alt="방 참가하기" /></button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="friend-buttons">
        <button
          className={`floating-button ${modalType ? 'disabled' : ''}`}
          onClick={() => {
            if (!modalType) setIsFriendPopupOpen(prev => !prev);
          }}
          disabled={!!modalType}
        >
          <img src={fbottom} alt="플로팅 버튼" />
        </button>
      </div>


      {isFriendPopupOpen && (
        <div className="friend-popup-overlay" onClick={() => setIsFriendPopupOpen(false)}>
          <div
            className="friend-popup"
            onClick={(e) => e.stopPropagation()} // 팝업 안 누르면 닫히지 않도록
          >
            <button className="friend-popup-close-btn" onClick={() => setIsFriendPopupOpen(false)}>
              <img src={fcbottom} alt="닫기 버튼" />
            </button>
            <div className="friend-popup-content">
              {/* 내 정보 */}
              <div className="my-profile">
                <img
  src={profileImages[(userInfo?.profileSeq || 1) - 1]}
  className="friend-avatar"
/>

                <div className="friend-nickname">{userInfo.userNickname} (나)</div>
              </div>

              <hr className="friend-divider" />


              {/* 친구 리스트 */}
              <div className="friend-title">친구목록
                <img src={newIcon} alt="새로고침" className="new-button" />
              </div>
              <div className="friend-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <div
                    className="friend-status-dot"
                    style={{ backgroundColor: friend.online ? '#00ff5f' : '#ffffff' }}
                  ></div>
                    <div className="friend-nickname">{friend.nickname}</div>
                  </div>
                ))}
              </div>
                {/* 친구 요청 알림 */}
                {friendRequests.length > 0 && (
                  <>
                    <hr className="friend-divider" />
                      <div className="friend-title">친구 요청</div>
                    <div className="friend-request-section">
                      {friendRequests.map((req) => (
                        <div key={req.id} className="friend-request-item">
                          <div className="friend-nickname">{req.nickname}</div>
                          <div className="friend-request-buttons">
                            <button onClick={() => acceptFriend(req.id)}>✅</button>
                            <button onClick={() => rejectFriend(req.id)}>❌</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

            </div>

          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default MainPage;
