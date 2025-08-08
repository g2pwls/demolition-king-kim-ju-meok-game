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
import findIcon from '../assets/images/main/find.png';
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
import ConfirmModal from '../components/BuyConfirmModal';
import FriendNotification from '../components/FriendNotification';
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

import legendary1 from '../assets/images/building/legendary1.png';
import legendary2 from '../assets/images/building/legendary2.png';
import legendary3 from '../assets/images/building/legendary3.png';
import legendary4 from '../assets/images/building/legendary4.png';

import eventk1 from '../assets/images/building/eventk1.png';
import eventk2 from '../assets/images/building/eventk2.png';
import eventk3 from '../assets/images/building/eventk3.png';
import eventk4 from '../assets/images/building/eventk4.png';
import eventk5 from '../assets/images/building/eventk5.png';
import eventk6 from '../assets/images/building/eventk6.png';
import eventk7 from '../assets/images/building/eventk7.png';
import eventk8 from '../assets/images/building/eventk8.png';
import eventk9 from '../assets/images/building/eventk9.png';
import eventk10 from '../assets/images/building/eventk10.png';
import eventk11 from '../assets/images/building/eventk11.png';
import eventk12 from '../assets/images/building/eventk12.png';
import eventw1 from '../assets/images/building/eventw1.png';
import eventw2 from '../assets/images/building/eventw2.png';
import eventw3 from '../assets/images/building/eventw3.png';
import eventw4 from '../assets/images/building/eventw4.png';
import eventw5 from '../assets/images/building/eventw5.png';
import eventw6 from '../assets/images/building/eventw6.png';
import eventw7 from '../assets/images/building/eventw7.png';
import eventw8 from '../assets/images/building/eventw8.png';
import eventw9 from '../assets/images/building/eventw9.png';
import eventw10 from '../assets/images/building/eventw10.png';
import eventw11 from '../assets/images/building/eventw11.png';
import eventw12 from '../assets/images/building/eventw12.png';
import eventw13 from '../assets/images/building/eventw13.png';
import eventw14 from '../assets/images/building/eventw14.png';
import eventw15 from '../assets/images/building/eventw15.png';
import eventw16 from '../assets/images/building/eventw16.png';

import arrowLeft from "../assets/images/main/left.png";
import arrowRight from "../assets/images/main/right.png";
import selectButton from "../assets/images/main/select.png";
import buyButton from '../assets/images/main/buy.png';

import coinIcon from '../assets/images/main/coin.png';

function MainPage() {

  // 메인 창 로그인 못하면 못 보게
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, []);
  // 세션 만료되면 다시 로그인하게
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  // 로그아웃
  const handleLogout = async () => {
  const token = localStorage.getItem('accessToken');

  try {
      await api.post('/user/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ 로그아웃 성공");
    } catch (err) {
      console.error("❌ 로그아웃 API 실패:", err);
    } finally {
      localStorage.clear();
      setShowLogoutModal(false);
      navigate('/login');
    }
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [animationDirection, setAnimationDirection] = useState(null);
  const [nickname, setNickname] = useState("");
  const [skins, setSkins] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
    
  // API로 스킨 가져오기
  const fetchSkins = async () => {
    try {
      const res = await api.get("/skins/getUserSkin");
      const skinData = res.data.result || [];

      setSkins(skinData);

      const selectedIndex = skinData.findIndex((skin) => skin.isSelect === 1);
      if (selectedIndex !== -1) {
        setCurrentIndex(selectedIndex);
        setSelectedIndex(selectedIndex);
      } else {
        setCurrentIndex(0); // 기본값
        setSelectedIndex(null); 
      }
    } catch (error) {
      console.error('캐릭터 스킨 불러오기 실패:', error);
    }
  };

  // 최초 한 번 실행
  useEffect(() => {
    fetchSkins();
  }, []);

  // 스킨 좌우 버튼
  const handleLeft = () => {
    setAnimationDirection("left");
    setCurrentIndex((prev) => (prev - 1 + skins.length) % skins.length);
  };

  const handleRight = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev + 1) % skins.length);
  };

  // 캐릭터 선택 API
  const handleSelect = async () => {
  const selectedSkin = skins[currentIndex];

  if (!selectedSkin?.playerSkinItemSeq || !userInfo?.userUuid) {
    console.error('❗ playerSkinItemSeq 또는 userUuid가 없습니다.');
    return;
  }

  const token = localStorage.getItem('accessToken');
  // 캐릭터 선택
  try {
    await api.get('/skins/selectSkin', {
      params: {
        userUuid: userInfo.userUuid,
        playerSkinItemSeq: selectedSkin.playerSkinItemSeq, // ✅ 필드명 주의!
      },
      headers: {
        Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 포함
      },
    });

    // 다시 불러오기
    const refreshed = await api.get('/skins/getUserSkin');
    const result = refreshed.data.result;

    setSkins(result);
    const selectedIndex = result.findIndex((skin) => skin.isSelect === 1);
    setSelectedIndex(selectedIndex);
    setCurrentIndex(selectedIndex !== -1 ? selectedIndex : 0);
    } catch (error) {
      console.error('❌ 캐릭터 선택 실패:', error);
    }
  };

  // 모달 상태 추가
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [pendingSkin, setPendingSkin] = useState(null);

  // 구매 버튼 클릭 시
  const handleBuyClick = () => {
    const currentSkin = skins[currentIndex];
    setPendingSkin(currentSkin);
    setShowBuyModal(true);
  };
  // console.log('✅ 현재 스킨:', skins[currentIndex]);
  // 실제 구매 처리
  const confirmBuy = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await api.patch('/skins/unLockUserSkin', {}, {
        params: {
          userUuid: userInfo.userUuid,
          playerSkinItemSeq: pendingSkin.playerSkinItemSeq,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchSkins();
      await fetchGold();
      alert(`"${pendingSkin.name}" 캐릭터를 구매했습니다!`);
    } catch (err) {
      alert('구매 실패');
    } finally {
      setShowBuyModal(false);
      setPendingSkin(null);
    }
  };

  // 건물 이미지
  const buildingImages = [
    { src: building1, filename: 'building1.png' },
    { src: building2, filename: 'building2.png' },
    { src: building3, filename: 'building3.png' },
    { src: building4, filename: 'building4.png' },
    { src: building5, filename: 'building5.png' },
    { src: building6, filename: 'building6.png' },
    { src: building7, filename: 'building7.png' },
    { src: building8, filename: 'building8.png' },
    { src: building9, filename: 'building9.png' },
    { src: building10, filename: 'building10.png' },
    { src: building11, filename: 'building11.png' },
    { src: building12, filename: 'building12.png' },
    { src: building13, filename: 'building13.png' },
    { src: building14, filename: 'building14.png' },
    { src: building15, filename: 'building15.png' },
    { src: building16, filename: 'building16.png' },
    { src: building17, filename: 'building17.png' },
    { src: building18, filename: 'building18.png' },
    { src: building19, filename: 'building19.png' },
    { src: building20, filename: 'building20.png' },
    { src: building21, filename: 'building21.png' },
    { src: building22, filename: 'building22.png' },
    { src: building23, filename: 'building23.png' },
    { src: building24, filename: 'building24.png' },
    { src: building25, filename: 'building25.png' },
    { src: building26, filename: 'building26.png' },
  ];

  const rareImages = [
    { src: rare1, filename: 'rare1.png' },
    { src: rare2, filename: 'rare2.png' },
    { src: rare3, filename: 'rare3.png' },
    { src: rare4, filename: 'rare4.png' },
    { src: rare5, filename: 'rare5.png' },
    { src: rare6, filename: 'rare6.png' },
    { src: rare7, filename: 'rare7.png' },
    { src: rare8, filename: 'rare8.png' },
    { src: rare9, filename: 'rare9.png' },
    { src: rare10, filename: 'rare10.png' },
    { src: rare11, filename: 'rare11.png' },
    { src: rare12, filename: 'rare12.png' },
    { src: rare13, filename: 'rare13.png' },
    { src: rare14, filename: 'rare14.png' },
    { src: rare15, filename: 'rare15.png' },
  ];

  const legendaryImages = [
    { src: legendary1, filename: 'legendary1.png' },
    { src: legendary2, filename: 'legendary2.png' },
    { src: legendary3, filename: 'legendary3.png' },
    { src: legendary4, filename: 'legendary4.png' },
  ];

  const eventImages = [
    { src: eventk1, filename: 'eventk1.png' },
    { src: eventk2, filename: 'eventk2.png' },
    { src: eventk3, filename: 'eventk3.png' },
    { src: eventk4, filename: 'eventk4.png' },
    { src: eventk5, filename: 'eventk5.png' },
    { src: eventk6, filename: 'eventk6.png' },
    { src: eventk7, filename: 'eventk7.png' },
    { src: eventk8, filename: 'eventk8.png' },
    { src: eventk9, filename: 'eventk9.png' },
    { src: eventk10, filename: 'eventk10.png' },
    { src: eventk11, filename: 'eventk11.png' },
    { src: eventk12, filename: 'eventk12.png' },
    { src: eventw1, filename: 'eventw1.png' },
    { src: eventw2, filename: 'eventw2.png' },
    { src: eventw3, filename: 'eventw3.png' },
    { src: eventw4, filename: 'eventw4.png' },
    { src: eventw5, filename: 'eventw5.png' },
    { src: eventw6, filename: 'eventw6.png' },
    { src: eventw7, filename: 'eventw7.png' },
    { src: eventw8, filename: 'eventw8.png' },
    { src: eventw9, filename: 'eventw9.png' },
    { src: eventw10, filename: 'eventw10.png' },
    { src: eventw11, filename: 'eventw11.png' },
    { src: eventw12, filename: 'eventw12.png' },
    { src: eventw13, filename: 'eventw13.png' },
    { src: eventw14, filename: 'eventw14.png' },
    { src: eventw15, filename: 'eventw15.png' },
    { src: eventw16, filename: 'eventw16.png' },
  ];

  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const goToMultiLobby = () => {
  setModalType(null); // 모달 닫기
  navigate('/multilobby', {
    state: { autoJoin: true, action: 'create' }, // ⬅️ 로비에서 자동 입장 신호
  });
};

   // 'tutorial' 또는 'mypage' 또는 null
  const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false); // ✅ 반드시 함수 컴포넌트 내부에
  const [activeTab, setActiveTab] = useState('통계');
  const [userInfo, setUserInfo] = useState(null);
  
  // 유저 정보 불러오기
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
      fetchTodayPlayTime();
      fetchWeeklyPlayTime();
    }
  }, [userInfo]);

  // 오늘 플레이 시간
  const fetchTodayPlayTime = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await api.get('/users/games/today/playtime', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ playTimeDate가 곧 플레이 시간 (분)
      const todayMinutes = res.data.result?.playTimeDate ?? 0;

      setPlayStats(prev => ({
        ...prev,
        todayPlayTime: todayMinutes,
      }));

      console.log("🎮 오늘 플레이 시간:", todayMinutes, "분");
    } catch (err) {
      console.error('❌ 오늘의 플레이 시간 조회 실패:', err);
    }
  };

  const fetchWeeklyPlayTime = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await api.get('/users/games/weekly', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const rawData = res.data ?? [];

    // [일, 월, 화, 수, 목, 금, 토] → 기본값 0으로 초기화
    const weeklyPlay = Array(7).fill(0);

    // 📌 날짜 문자열(ex. 20250805)을 요일 인덱스로 변환하는 함수
    const getDayIndex = (dateStr) => {
      const year = parseInt(dateStr.slice(0, 4));
      const month = parseInt(dateStr.slice(4, 6)) - 1; // JS는 0월부터 시작
      const day = parseInt(dateStr.slice(6, 8));
      const dateObj = new Date(year, month, day);
      return dateObj.getDay(); // 일(0) ~ 토(6)
    };

    // 📌 데이터를 요일별로 매핑
    rawData.forEach((item) => {
      const dayIndex = getDayIndex(item.playDate); // 0~6
      weeklyPlay[dayIndex] = item.playTimeDate ?? 0; // null 대비
    });

    setPlayStats(prev => ({
      ...prev,
      weeklyPlayTime: weeklyPlay,
    }));

    console.log("📊 이번 주 요일별 플레이 시간:", weeklyPlay);
  } catch (err) {
    console.error('❌ 주간 플레이 시간 조회 실패:', err);
  }
};

  const [isEditing, setIsEditing] = useState(false);           // 수정 모드 진입 여부
  const [editNickname, setEditNickname] = useState(userInfo?.nickname); // 수정할 닉네임 임시 저장
  const [editEmail, setEditEmail] = useState(userInfo?.email);          // 수정할 이메일 임시 저장
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [playStats, setPlayStats] = useState({
    totalPlayTime: 157,       // 누적 (분 단위)
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

  // 유저 골드 조회
  const [gold, setGold] = useState(0);
  const fetchGold = async () => {
    try {
      if (!userInfo?.userUuid) return;

      const res = await api.get(`/users/games/${userInfo.userUuid}/getGoldByUuid`);
      setGold(res.data.result);
      console.log('💰 유저 골드:', res.data.result);
    } catch (error) {
      console.error('❌ 골드 조회 실패:', error);
    }
  };
  useEffect(() => {
    if (userInfo?.userUuid) {
      fetchGold();
    }
  }, [userInfo]);

  // 친구 요청
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // 친구 요청 목록 불러오기
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const res = await api.get('/users/friends/requests');
        const requestList = res.data.result || [];

        console.log('✅ 친구 요청 목록:', requestList);
        requestList.forEach((req, i) => {
          console.log(`👉 요청자 ${i + 1}:`, req);
        });

        setFriendRequests(requestList);
      } catch (error) {
        console.error('❌ 친구 요청 목록 불러오기 실패:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  // 친구 수락
  const acceptFriend = async (requestId) => {
    const accepted = friendRequests.find(req => req.id === requestId);
    if (!accepted) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await api.patch('/users/friends/accept', null, {
        params: {
          friendUuid: accepted.userUuid,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFriends(prev => [
        ...prev,
        {
          id: accepted.id,
          nickname: accepted.friendNickname,
          online: false,
        },
      ]);

      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      console.log('✅ 친구 요청 수락 성공');
    } catch (error) {
      console.error('❌ 친구 수락 실패:', error);
      alert('친구 수락에 실패했습니다.');
    }
  };

  // 친구 거절
  const rejectFriend = async (requestId) => {
    const rejected = friendRequests.find(req => req.id === requestId);
    if (!rejected) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      await api.delete('/users/friends/reject', {
        params: {
          friendUuid: rejected.userUuid,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      console.log('✅ 친구 요청 거절 성공');
    } catch (error) {
      console.error('❌ 친구 거절 실패:', error);
      alert('친구 거절에 실패했습니다.');
    }
  };

  // 친구 목록 불러오기
  useEffect(() => {
    const fetchFriendStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn('⛔️ 액세스 토큰 없음');
          return;
        }

        const res = await api.get('/users/friends/status', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const friendList = res.data.result || [];
        console.log('✅ 친구 목록 불러오기 성공:', friendList);

        // friends 상태 업데이트
        setFriends(friendList);
      } catch (error) {
        console.error('❌ 친구 목록 불러오기 실패:', error);
      }
    };

    if (userInfo?.userUuid) {
      fetchFriendStatus(); // userInfo 세팅 이후 실행
    }
  }, [userInfo]);

  // 해금된 건물 ID
  const [unlockedBuildings, setUnlockedBuildings] = useState([]);
  // 해금된 건물 가져오기
  useEffect(() => {
    const fetchUnlockedBuildings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await api.get('/constructures/getConstructure', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = res.data.result || [];

        // open 이 false인 건물만 수집
        const unlocked = result
          .filter(b => b.open === true)
          .map(b => b.imageUrl?.split('/').pop()); // 'rare10.png'처럼 추출

        setUnlockedBuildings(unlocked);
        console.log("✅ 해금된 건물 파일명 목록:", unlocked);
      } catch (err) {
        console.error('❌ 건물 조회 실패:', err);
      }
    };

    if (userInfo?.userUuid) {
      fetchUnlockedBuildings();
    }
  }, [userInfo]);

  // 닉네임 변경
  const [nicknameCheckResult, setNicknameCheckResult] = useState(null);
  const [checkedNickname, setCheckedNickname] = useState('');

  useEffect(() => {
    setNicknameCheckResult('');
    setCheckedNickname('');
  }, [editNickname]);

  const handleCheckNickname = async () => {
    if (!editNickname || editNickname.trim() === '') {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await api.post('/user/auth/signup/nickname/check', {
        nickname: editNickname,
      });
      console.log('✅ 닉네임 중복확인 응답:', res.data);

      if (res.data.result.available === true) {
        setNicknameCheckResult('available');
        setCheckedNickname(editNickname);
        alert('✅ 사용 가능한 닉네임입니다.');
      } else {
        setNicknameCheckResult('duplicate');
        alert('❌ 이미 사용 중인 닉네임입니다.');
      }
    } catch (err) {
      console.error('닉네임 중복확인 실패:', err);
      alert('중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSaveNickname = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      await api.put('/user/auth/nickname',
        { nickname: editNickname }, // 👈 여기 data로 바꿈
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // 👈 필수
          },
        }
      );

      alert('닉네임이 성공적으로 변경되었습니다!');
      setUserInfo(prev => ({
        ...prev,
        nickname: editNickname,
        userNickname: editNickname,
      }));
      setUserNickname(editNickname);
      setIsEditingNickname(false);
      setNicknameCheckResult('');
    } catch (error) {
      console.error('❌ 닉네임 변경 실패:', error);
      alert('닉네임 변경에 실패했습니다.');
    }
  };

  // 비밀번호 변경
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const verifyPassword = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const res = await api.post(
        '/user/auth/password/verify',
        { currentPassword }, // ✅ key 수정됨!
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.isSuccess === true) {
        alert('✅ 비밀번호 확인 성공!');
        setPasswordVerified(true);
      } else {
        alert('❌ 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error('비밀번호 확인 실패:', err);
      alert('⚠️ 서버 오류 또는 비밀번호 확인 실패');
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('❌ 새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const email = userInfo?.useremail;
  console.log("📧 이메일:", userInfo?.userEmail);

      await api.post('/user/auth/password/reset', {
        email: userInfo.userEmail,
        newPassword,
        confirmPassword: confirmNewPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('✅ 비밀번호가 성공적으로 변경되었습니다!');
      setIsChangingPassword(false);
      setPasswordVerified(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      alert('❌ 비밀번호 변경에 실패했습니다.');
    }
  };

  // 친구 검색, 있는 친구 요청 친구 구분
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchNickname, setSearchNickname] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
  const [hasReceivedRequest, setHasReceivedRequest] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  // 친구 검색
  const handleSearchFriend = async () => {
    setHasSearched(true);
    setIsAlreadyFriend(false);
    setHasReceivedRequest(false);
    try {
      const res = await api.get(`/users/friends/search`, {
        params: { nickname: searchNickname },
      });

      const result = res.data.result;
      setSearchResult(result);

      const token = localStorage.getItem('accessToken');

      // 현재 친구인지 확인
      const statusRes = await api.get('/users/friends/status', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myFriendList = statusRes.data.result || [];
      const isFriend = myFriendList.some(friend => friend.friendUuid === result.userUuid);
      if (isFriend) {
        setIsAlreadyFriend(true);
        // alert('✅ 이미 친구인 사용자입니다.');
        return;
      }

      // 받은 친구 요청 확인
      const receivedRes = await api.get('/users/friends/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const receivedRequests = receivedRes.data.result || [];
      const hasReceivedRequest = receivedRequests.some(
        (req) => req.userUuid === result.userUuid
      );

      if (hasReceivedRequest) {
        setHasReceivedRequest(true);
        return;
      }

      // 여기까지 걸리지 않으면 친구 아님 + 친구 요청도 없음 → 요청 가능

    } catch (err) {
      console.error('❌ 친구 검색 실패:', err);
      setSearchResult(null);
    }
  };

  // 친구 요청
  const handleSendFriendRequest = async (friendUuid) => {
  const token = localStorage.getItem('accessToken');

  try {
    // 1. 현재 친구 목록 조회
    const statusRes = await api.get('/users/friends/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const myFriendList = statusRes.data.result; // ✅ 응답 구조에 따라 조정 필요

    // 2. 친구 목록에 있는지 확인
    const isAlreadyFriend = myFriendList.some(friend => friend.friendUuid === friendUuid);


    if (isAlreadyFriend) {
      // alert('⚠️ 이미 친구인 사용자입니다.');
      return;
    }

    // 3. 친구가 아니라면 요청
    const inviteRes = await api.post('/users/friends/invite', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        friendUuid,
      },
    });

      // ✅ 요청 성공 시 상태 업데이트
      setHasSentRequest(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || '서버 오류가 발생했습니다.';
      alert(`❌ 친구 요청 실패: ${errorMsg}`);
      console.error('❌ 친구 요청 실패:', err.response || err);
    }
  };

  // 친구 삭제
  const handleDeleteFriend = async (friendUuid) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  const confirmDelete = window.confirm('정말 이 친구를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await api.delete('/users/friends', {
        params: { friendUuid },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriends(prev => prev.filter(friend => friend.friendUuid !== friendUuid));
      alert('✅ 친구가 삭제되었습니다.');
    } catch (error) {
      console.error('❌ 친구 삭제 실패:', error);
      alert('❌ 친구 삭제에 실패했습니다.');
    }
  };

  // 친구 새로고침
  const refreshFriendData = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      const [friendRes, requestRes] = await Promise.all([
        api.get('/users/friends/status', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get('/users/friends/requests'),
      ]);

      setFriends(friendRes.data.result || []);
      setFriendRequests(requestRes.data.result || []);
      console.log('🔄 친구 목록 & 요청 새로고침 완료');
    } catch (err) {
      console.error('❌ 친구 새로고침 실패:', err);
    }
  };


  return (
    <div className="main-page-background">
      {/* <FriendNotification token={token} /> */}
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
        <div className="gold-display">
          <img src={coinIcon} alt="코인" className="coin-icon" />
          <span className="gold-amount">{gold.toLocaleString()} G</span>
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
          <div className="nickname-text">{userInfo?.userNickname}</div>
          <div className={`character-selector animate-${animationDirection}`}>
            <img src={arrowLeft} alt="왼쪽" className="arrow-button large" onClick={handleLeft} />
            {skins.length > 0 && (
              <img
                src={skins[currentIndex]?.image}
                alt="캐릭터"
                className="main-character large"
                style={{ opacity: skins[currentIndex]?.isUnlock === 0 ? 0.6 : 1 }} // ⭐ 추가
                onAnimationEnd={() => setAnimationDirection(null)}/>
            )}
            <img src={arrowRight} alt="오른쪽" className="arrow-button large" onClick={handleRight} />
          </div>

          <div className="select-button-wrapper">
            {skins[currentIndex]?.isUnlock === 1 ? (
              selectedIndex !== currentIndex ? (
                <img
                  src={selectButton}
                  alt="선택 버튼"
                  className="select-button"
                  onClick={handleSelect}
                />
              ) : null // ✅ 이미 선택된 캐릭터는 아무 버튼도 안 보이게 함
            ) : (
              <img
                src={buyButton}
                alt="구매 버튼"
                className="select-button"
                onClick={handleBuyClick}
              />
            )}
          </div>
          {showBuyModal && (
            <ConfirmModal
              message={`"${pendingSkin?.name}" 캐릭터를 ${pendingSkin?.price}G에 구매하시겠습니까?`}
              onConfirm={confirmBuy}
              onCancel={() => setShowBuyModal(false)}
            />
          )}
        </div>

      {/* 모달들 */}
      {modalType && (
        <div className="modal-overlay" onClick={() => {setModalType(null);setActiveTab('통계'); setIsEditing(false); setIsEditingNickname(false); setEditNickname(userInfo?.nickname);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalType === 'tutorial' && (
              <div className="tutorial-modal-wrapper">
                <img src={tutorialModal} alt="튜토리얼 모달" className="tutorial-modal-image" />
                <div className="tutorial-modal-text">
                  🥊 모션을 따라 건물을 파괴하라!<br /><br />
                  화면 상단에 뜨는 <strong style={{ color: 'black' }}>콤보 스택(잽, 어퍼컷, 회피)</strong>에 맞춰<br />
                  정확한 모션을 취하세요.<br /><br />
                  올바른 동작을 하면 건물 HP가 깎이고,<br />
                  💥HP가 0이 되면 건물이 철거됩니다!<br /><br />
                  ⏱ 건물을 철거하면 추가 시간이 주어집니다.<br /><br />
                  제한 시간이 모두 끝나기 전에 더 많은 건물을 철거해보세요!</div>
              </div>
            )}

            {modalType === 'mypage' && (
              <div className="mypage-modal-wrapper">
                <img src={myPageModal} alt="마이페이지 모달" className="mypage-modal-bg" />

                <div className="mypage-overlay">
                  {/* 왼쪽: 프로필 영역 */}
                  <div className="mypage-left">
                    <img className="mypage-avatar" src={userInfo?.profile?.image} alt="프로필" />
                    <div className="mypage-name">{userInfo?.userNickname}</div>
                    <div className="mypage-email">{userInfo?.userEmail}</div>
                    <button
                      className={`mypage-edit-btn ${isEditing ? 'disabled' : ''}`}
                      onClick={() => setIsEditing(!isEditing)}>정보수정
                    </button>
                    <button
                      className="mypage-logout-btn"
                      onClick={() => setShowLogoutModal(true)}>
                      로그아웃
                    </button>
                  </div>
                  {showLogoutModal && (
                    <div className="modal-overlay">
                      <div className="modal">
                        <p>정말 로그아웃 하시겠습니까?</p>
                        <div className="modal-buttons">
                          <button onClick={handleLogout}>네, 로그아웃</button>
                          <button onClick={() => setShowLogoutModal(false)}>아니요</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mypage-right">
                    {/* 탭 버튼 */}
                    <div className="mypage-tabs">
                      <button
                        className={`tab-button ${activeTab === '통계' ? 'active' : ''}`}
                        onClick={() => setActiveTab('통계')}>
                        통계
                      </button>
                      <button
                        className={`tab-button ${activeTab === '도감' ? 'active' : ''}`}
                        onClick={() => setActiveTab('도감')}>
                        도감
                      </button>
                    </div>

                    {/* ✅ 통계 탭 내용 */}
                    {activeTab === '통계' && !isEditing && (
                      <>
                        {/* 플레이 시간 부분 */}
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
                            const maxHeight = 500;
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
                            <div className="info-me">{userInfo?.userNickname}</div>
                            <button className="edit-icon-btn" onClick={() => setIsEditingNickname(true)}>
                              <img src={pencilIcon} alt="수정" className="edit-icon" />
                            </button>
                          </div>
                          <div className="info-row">
                            <label>이메일:</label>
                            <div className="info-me">{userInfo?.userEmail}</div>
                          </div>
                          <div className="info-row password-row">
                            <button
                              className="change-password-btn"
                              onClick={() => {
                                setIsChangingPassword(true);
                                setPasswordVerified(false);
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmNewPassword('');
                              }}>비밀번호 변경
                            </button>
                          </div>

                          {/* ✅ 비밀번호 변경 폼 표시 조건 */}
                          {isChangingPassword && (
                            <div className="password-change-form">
                              {/* 닫기 버튼 상단에 배치 */}
                              <div className="password-form-header">
                                <button
                                  className="close-password-btn"
                                  onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordVerified(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmNewPassword('');
                                  }}>닫기 ❌
                                </button>
                              </div>

                              {!passwordVerified ? (
                                <>
                                  <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="현재 비밀번호 입력"
                                  />
                                  <button className="verify-btn" onClick={verifyPassword}>확인</button>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 입력"
                                  />
                                  <input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 재입력"
                                  />
                                  <div className="password-change-buttons">
                                    <button className="cancel-btn" onClick={() => setIsChangingPassword(false)}>취소</button>
                                    <button className="save-btn" onClick={changePassword}>저장</button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 닫기 버튼: profile-view 밖에 둠 */}
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
                        {/* 중복 확인 메시지 */}
                        {nicknameCheckResult === 'available' && (
                          <div className="nickname-check-success">✅ 사용 가능한 닉네임입니다.</div>
                        )}
                        {nicknameCheckResult === 'duplicate' && (
                          <div className="nickname-check-error">❌ 이미 사용 중인 닉네임입니다.</div>
                        )}
                        <div className="nickname-edit-buttons">
                          <button className="check-btn" onClick={handleCheckNickname}>중복확인</button>
                          <button
                            className="cancel-btn"
                            onClick={() => {
                              setEditNickname(userInfo.nickname);
                              setIsEditingNickname(false);
                            }}>
                            취소
                          </button>

                          <button
                            className="save-btn"
                            onClick={handleSaveNickname}
                            disabled={
                              nicknameCheckResult !== 'available' ||  // 중복확인 결과가 사용 가능이 아니면 비활성화
                              editNickname !== checkedNickname       // 중복확인 후 닉네임이 바뀌었으면 비활성화
                            }>
                            저장
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 도감 탭 내용 */}
                    {activeTab === '도감' && (
                      <div className="collection-section">
                        <div className="buildingname">COMMON</div>
                        <div className="building-grid">
                          {buildingImages.map(({ src, filename }, i) => {
                            const isUnlocked = unlockedBuildings.includes(filename);
                            return (
                              <div key={i} className="building-item">
                                <img
                                  src={src}
                                  alt={`건물 ${filename}`}
                                  className={`building-image ${isUnlocked ? 'unlocked' : ''}`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className="buildingname1">RARE</div>
                        <div className="building-grid">
                          {rareImages.map(({ src, filename }, i) => {
                            const isUnlocked = unlockedBuildings.includes(filename);
                            return (
                              <div key={i} className="building-item">
                                <img
                                  src={src}
                                  alt={`건물 ${filename}`}
                                  className={`building-image ${isUnlocked ? 'unlocked' : ''}`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className="buildingname1">LEGENDARY</div>
                        <div className="building-grid">
                          {legendaryImages.map(({ src, filename }, i) => {
                            const isUnlocked = unlockedBuildings.includes(filename);
                            return (
                              <div key={i} className="building-item">
                                <img
                                  src={src}
                                  alt={`건물 ${filename}`}
                                  className={`building-image ${isUnlocked ? 'unlocked' : ''}`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        <div className="buildingname1">EVENT</div>
                        <div className="building-grid">
                          {eventImages.map(({ src, filename }, i) => {
                            const isUnlocked = unlockedBuildings.includes(filename);
                            return (
                              <div key={i} className="building-item">
                                <img
                                  src={src}
                                  alt={`건물 ${filename}`}
                                  className={`building-image ${isUnlocked ? 'unlocked' : ''}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {modalType === 'multi' && (
            <div className="multi-mode-buttons">
              <button onClick={goToMultiLobby}>
                <img src={roomMake} alt="방 만들기" />
              </button>
              <button>
                <img src={roomParticipation} alt="방 참가하기" />
              </button>
            </div>
          )}

          </div>
        </div>
      )}

      {/* 친구 팝업 버튼 표시 */}
      <div className="friend-buttons">
        <button
          className={`floating-button ${modalType ? 'disabled' : ''}`}
          onClick={() => {
            if (!modalType) setIsFriendPopupOpen(prev => !prev);
          }}
          disabled={!!modalType}>
          <img src={fbottom} alt="플로팅 버튼" />

          {/* 친구 요청 배지 표시 */}
          {friendRequests.length > 0 && (
            <div className="friend-request-badge">
              {friendRequests.length}
            </div>
          )}
        </button>
      </div>
      {/* 친구 팝업 내용 표시 */}
      {isFriendPopupOpen && (
        <div
          className="friend-popup-overlay"
          onClick={() => {
            setIsFriendPopupOpen(false);
            setIsSearchOpen(false);
            setSearchNickname('');
            setSearchResult(null);
            setHasSearched(false);
            setIsAlreadyFriend(false);
          }}>

          <div className="friend-popup" onClick={(e) => e.stopPropagation()}> {/* 팝업 안 누르면 닫히지 않도록 */}
            <button className="friend-popup-close-btn" onClick={() => setIsFriendPopupOpen(false)}>
              <img src={fcbottom} alt="닫기 버튼" />
            </button>
            <div className="friend-popup-content">
              {/* 내 정보 */}
              <div className="my-profile">
                <img className="friend-avatar" src={userInfo?.profile?.image} alt="프로필" />
                <div className="friend-nickname">{userInfo.userNickname} (나)</div>
              </div>
              <hr className="friend-divider" />
              {/* 친구 리스트 */}
              <div className="friend-title">친구목록
                <img src={findIcon} alt="친구 찾기" className="find-button" onClick={() => setIsSearchOpen(true)}/>
                {isSearchOpen && (
                  <div className="friend-search-popup" onClick={() => setIsSearchOpen(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                      <h3 className="search-title">친구 찾기</h3>

                      <div className="search-row">
                        <input
                          type="text"
                          value={searchNickname}
                          onChange={(e) => setSearchNickname(e.target.value)}
                          placeholder="닉네임 입력"
                          className="search-input"
                        />
                        <button className="search-btn" onClick={handleSearchFriend}>검색</button>
                      </div>

                      {hasSearched ? (searchResult ? (
                          <div className="search-result">
                            <div className="search-result-row">
                              <div className="nickname-label">닉네임: {searchResult.uerNickname}</div>

                              {isAlreadyFriend ? (
                                <div className="already-friend-text">✅ 이미 친구입니다</div>
                              ) : hasReceivedRequest ? (
                                <div className="already-friend-text">📩 이 사용자가 당신에게 친구 요청을 보냈습니다. 수락해주세요!</div>
                              ) : hasSentRequest ? (
                                <div className="already-friend-text">✅ 친구 요청을 보냈습니다!</div>
                              ) : (
                                <button
                                  className="friend-request-btn"
                                  onClick={() => handleSendFriendRequest(searchResult.userUuid)}>
                                  친구 요청
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="search-result">
                            <div className="search-result-empty">닉네임을 찾을 수 없습니다.</div>
                          </div>
                        )
                      ) : null}

                      <button className="close-button" onClick={() => {
                        setIsSearchOpen(false);
                        setSearchNickname('');
                        setSearchResult(null);
                        setHasSearched(false);
                        setIsAlreadyFriend(false);}}>
                        ❌닫기
                      </button>
                    </div>
                  </div>
                )}

                <img src={newIcon} alt="새로고침" className="new-button" onClick={refreshFriendData}/>
              </div>
              
              {/* 친구 목록 리스트 */}
              <div className="friend-list">
                {friends.map(friend => (
                  <div key={friend.id} className="friend-item">
                    {/* 왼쪽: 상태 점 + 닉네임 묶기 */}
                    <div className="friend-info-wrapper">
                      <div className="friend-status-dot"
                        style={{ backgroundColor: friend.status === 'online' ? '#00ff5f' : '#ffffff', border: '1px solid gray',}}></div>
                      <div className="friend-nickname">{friend.friendNickname}</div>
                    </div>

                    {/* 오른쪽: 삭제 버튼 */}
                    <button className="friend-delete-btn" onClick={() => handleDeleteFriend(friend.friendUuid)}> 삭제</button>
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
                            <div className="friend-nickname">{req.friendNickname}</div>
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