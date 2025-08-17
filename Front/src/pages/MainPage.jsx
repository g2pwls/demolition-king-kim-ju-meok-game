import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import closeIcon from '../assets/images/mypage/close.png';
import { useLocation } from "react-router-dom";
import mainBgm from '../assets/sounds/main_bgm.wav';

import karina_1 from '../assets/images/karina/karina_final_anim_01.png';
import karina_2 from '../assets/images/karina/karina_hair_2.png';  
import karina_dancing_1 from '../assets/images/karina/karina_dancing_final_1.png';
import karina_dancing_2 from '../assets/images/karina/karina_dancing_final_2.png';



import boxer_idle from '../assets/images/karina/boxer_idle.png';
import boxer_punch_1 from '../assets/images/karina/boxer_punch_1.png';
import boxer_punch_2 from '../assets/images/karina/boxer_punch_2.png';

import ronnie_1 from '../assets/images/karina/ronnie_01.png';
import ronnie_2 from '../assets/images/karina/ronnie_main_1.png';
import ronnie_3 from '../assets/images/karina/ronnie_main_2.png';

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
import RankingModal from '../components/RankingModal';
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

import arrowLeft from "../assets/images/main/left.png";
import arrowRight from "../assets/images/main/right.png";
import selectButton from "../assets/images/main/select.png";
import buyButton from '../assets/images/main/buy.png';
import coinIcon from '../assets/images/main/coin.png';
import goldImg from '../assets/images/mypage/gold.png';
import silverImg from '../assets/images/mypage/silver.png';
import bronzeImg from '../assets/images/mypage/bronze.png';
import firstTrophy from '../assets/images/main/first.png';
import secondTrophy from '../assets/images/main/second.png';
import thirdTrophy from '../assets/images/main/third.png';
import poseImg from '../assets/images/pose1.png';
// ✅ 추가: 스킨 프레임 매핑(지금은 안전 가드용 빈 객체)
//    나중에 필요하면 예시처럼 채워 사용하세요.
//    예: { 1: [boxer_idle, boxer_punch_1, boxer_punch_2], 2: [ronnie_1, ronnie_2, ronnie_3] }
const SKIN_SEQUENCES = {
  1: [boxer_idle, boxer_punch_1, boxer_punch_2],
  3: [ronnie_1, ronnie_2, ronnie_3],
  6: [karina_2, karina_dancing_1, karina_dancing_2],
};
function CharacterSequence({ images, durations = [3000, 500, 500], alt="character", className, style }) {
  const [idx, setIdx] = React.useState(0);
  const toRef = React.useRef(null);

  React.useEffect(() => {
    if (!images || images.length === 0) return;
    let mounted = true;

    const step = (i = 0) => {
      if (!mounted) return;
      setIdx(i);
      toRef.current = setTimeout(() => step((i + 1) % images.length), durations[i] || 500);
    };

    step(0);
    return () => { mounted = false; if (toRef.current) clearTimeout(toRef.current); };
  }, [images, durations]);

  return <img src={images?.[idx] || ""} alt={alt} className={className} style={style} />;
}

function MainPage() {

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
              // ✅ 선택된 캐릭터 정보 localStorage 저장
      localStorage.setItem('selectedCharacter', skinData[selectedIndex].image); 
      localStorage.setItem('selectedCharacternum', skinData[selectedIndex].playerSkinItemSeq);
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
    // 캐릭터 선택 후, localStorage에 선택된 캐릭터 저장
    localStorage.setItem('selectedCharacter', selectedSkin.image);
    localStorage.setItem('selectedCharacternum', selectedSkin.playerSkinItemSeq);

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
// 상태 추가
const [insufficientFundsMessage, setInsufficientFundsMessage] = useState(''); // 금액 부족 메시지 상태 추가

// 구매 버튼 클릭 시
const handleBuyClick = async () => {
  const currentSkin = skins[currentIndex];
  setPendingSkin(currentSkin);

  // 금액 확인 로직 추가
  const token = localStorage.getItem('accessToken');
  const userUuid = userInfo.userUuid; // userUuid를 가져옴

  try {
    // 사용자의 금액 확인 (위 API를 사용)
    const res = await api.get(`/users/games/${userUuid}/getGoldByUuid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userGold = res.data.result; // 사용자의 금액
    const skinPrice = currentSkin.price; // 스킨 가격

    // 금액이 부족하면 메시지 설정
    if (userGold < skinPrice) {
      setInsufficientFundsMessage('돈이 부족합니다!'); // 화면에 금액 부족 메시지 표시
      setShowBuyModal(false); // 금액 부족 시 모달 닫기
      return;
    }

    // 금액이 충분한 경우에만 모달 열기
    setShowBuyModal(true);
    setInsufficientFundsMessage(''); // 금액이 충분하면 메시지 초기화
  } catch (err) {
    console.error('금액 확인 실패:', err);
    setInsufficientFundsMessage('금액 확인 실패'); // 에러 발생 시 메시지 표시
    alert('금액 확인 실패');
    setShowBuyModal(false); // 에러 발생 시 모달 닫기
  }
};
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
  ];

  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const goToMultiLobby = () => {
  setModalType(null); // 모달 닫기
  navigate('/multilobby', {
    state: { autoJoin: true, action: 'create' }, // ⬅️ 로비에서 자동 입장 신호
  });
};

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openMulti) {
      setModalType('multi');                      // 네 모달 열기
      // 뒤로가기할 때 또 자동으로 열리는 문제 방지
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

// 방 만들기
  const goToCreate = () => {
    setModalType(null);
    navigate("/multilobby", { state: { action: "create" } });
  };

// 방 참가하기
  const goToJoin = () => {
    setModalType(null);
    navigate("/multilobby", { state: { action: "join" } });
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
      fetchTotalPlayTime();
      fetchTodayPlayTime();
      fetchWeeklyPlayTime();
    }
  }, [userInfo]);

  // ✅ 누적 플레이 시간(분) 조회
const fetchTotalPlayTime = async () => {
  try {
    if (!userInfo?.userUuid) return;

    const token = localStorage.getItem('accessToken');
    const res = await api.get(`/users/games/${userInfo.userUuid}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const payload = res.data?.result ?? res.data;

    let totalMinutes = 0;
    if (Array.isArray(payload)) {
      totalMinutes = payload.reduce((sum, r) => sum + (Number(r?.playTime) || 0), 0);
    } else if (typeof payload === 'number') {
      totalMinutes = payload;
    } else if (payload && typeof payload === 'object') {
      totalMinutes = Number(payload.playTime ?? payload.totalPlayTime ?? 0);
    }

    setPlayStats(prev => ({ ...prev, totalPlayTime: totalMinutes }));
    console.log('🧮 누적 플레이 시간(분):', totalMinutes);
  } catch (err) {
    console.error('❌ 누적 플레이 시간 조회 실패:', err);
  }
};


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
  // 이번 주 플레이 시간
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
    totalPlayTime: 0,             // 누적 (분 단위)
    todayPlayTime: 0,             // 오늘 플레이 시간
    weeklyPlayTime: Array(7).fill(0), // 일~토 기본값 0
  });
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
  const userEmail = localStorage.getItem('userEmail');
  console.log('🔐 로그인한 유저 이메일:', userEmail);

  const userNickname = localStorage.getItem('userNickname');
  console.log('🔐 로그인한 유저 닉네임:', userNickname);
}, []);

//     useEffect(() => {
//   if (dateRange[0] && dateRange[1]) {
//     const start = new Date(dateRange[0]);
//     const end = new Date(dateRange[1]);
//     const result = [];

//     const current = new Date(start);
//     while (current <= end) {
//       const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
//       if (calorieData[key]) {
//         result.push({
//           date: key,
//           calorie: calorieData[key],
//         });
//       }
//       current.setDate(current.getDate() + 1);
//     }

//     setSelectedCalorieData(result);
//   } else {
//     setSelectedCalorieData([]);
//   }
// }, [dateRange]);
//     const formatDate = (date) => {
//       if (!date) return '';
//       return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
//     };

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
  // 현재 선택된 스킨
  const currentSkin = skins[currentIndex] ?? null;

  const seq = React.useMemo(() => {
    if (!currentSkin) return [];
    // 1) ID 매핑 우선
    const byId = SKIN_SEQUENCES[currentSkin.playerSkinItemSeq];
    if (byId && byId.length) return byId;

    // 2) 매핑이 없으면 서버 이미지 1장(정지)
    return currentSkin.image ? [currentSkin.image] : [];
  }, [currentSkin]);

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
        // alert('✅ 사용 가능한 닉네임입니다.');
      } else {
        setNicknameCheckResult('duplicate');
        // alert('❌ 이미 사용 중인 닉네임입니다.');
      }
    } catch (err) {
      console.error('닉네임 중복확인 실패:', err);
      // alert('중복 확인 중 오류가 발생했습니다.');
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

      // alert('닉네임이 성공적으로 변경되었습니다!');
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
// 비밀번호 확인 상태
const [verifyStatus, setVerifyStatus] = useState(null); // 'loading' | 'success' | 'mismatch' | 'error' | null
const [verifyMsg, setVerifyMsg] = useState('');

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
      setPasswordVerified(true);
      setVerifyStatus('success');
      setVerifyMsg('비밀번호가 확인되었습니다.');
    } else {
      setVerifyStatus('mismatch');
      setVerifyMsg('비밀번호가 일치하지 않습니다.');
    }
  } catch (err) {
    console.error('비밀번호 확인 실패:', err);
    setVerifyStatus('error');
    setVerifyMsg('비밀번호 확인에 실패했습니다.');
  }
};
useEffect(() => {
  // 현재 비밀번호가 바뀌면 확인 상태/메시지 초기화
  setVerifyStatus(null);
  setVerifyMsg('');
}, [currentPassword]);

const [changePwStatus, setChangePwStatus] = useState(null); // 'mismatch' | 'success' | 'error' | null
const [changePwMsg, setChangePwMsg] = useState('');

const changePassword = async (e) => {
  e?.preventDefault?.();

  // 새 비밀번호 불일치
  if (newPassword !== confirmNewPassword) {
    setChangePwStatus('mismatch');
    setChangePwMsg('❌ 새 비밀번호가 일치하지 않습니다.');
    return;
  }

    try {
      const token = localStorage.getItem('accessToken');
      const email = userInfo?.useremail;
  // console.log("📧 이메일:", userInfo?.userEmail);

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

    setChangePwStatus('success');
    setChangePwMsg('✅ 비밀번호가 성공적으로 변경되었습니다!');
      setIsChangingPassword(false);
      setPasswordVerified(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setChangePwStatus(null);
      setChangePwMsg('');
    } catch (err) {
      console.error('비밀번호 변경 실패:', err);
      setChangePwStatus('error');
      setChangePwMsg('❌ 비밀번호 변경에 실패했습니다.');
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
  const [isMyself, setIsMyself] = useState(false);

  // 친구 검색
  const handleSearchFriend = async () => {
    setHasSearched(true);
    setIsAlreadyFriend(false);
    setHasReceivedRequest(false);
    setIsMyself(false);
    try {
      const res = await api.get(`/users/friends/search`, {
        params: { nickname: searchNickname },
      });

      const result = res.data.result;
      setSearchResult(result);

      const token = localStorage.getItem('accessToken');
      const myUuid = localStorage.getItem('userUuid');

       // ✅ 본인일 경우
      if (result.userUuid === myUuid) {
        setIsMyself(true);
        return;
      }

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

    console.log(isAlreadyFriend,"친구목록에 있냐?")
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
    console.log(inviteRes,"친구가 맞냐? - 요청")
      // ✅ 요청 성공 시 상태 업데이트
      setHasSentRequest(true);
    } catch (err) {
      const errorMsg = err.response?.data?.message || '서버 오류가 발생했습니다.';
      alert(`❌ 친구 요청 실패: ${errorMsg}`);
      console.error('❌ 친구 요청 실패:', err.response || err);
    }
  };

  // 친구 삭제
  const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 친구 UUID
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(""); // 성공/실패 메시지

// 삭제 버튼 클릭 시 실행 → confirm div 띄움
const handleDeleteClick = (friendUuid) => {
  setDeleteTarget(friendUuid);
  setShowDeleteConfirm(true);
  setDeleteMessage(""); // 이전 메시지 초기화
};

// 실제 삭제 실행
const confirmDeleteFriend = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    setDeleteMessage("❌ 로그인이 필요합니다.");
    return;
  }

  try {
    await api.delete('/users/friends', {
      params: { friendUuid: deleteTarget },
      headers: { Authorization: `Bearer ${token}` },
    });

    setFriends(prev => prev.filter(friend => friend.friendUuid !== deleteTarget));
    setDeleteMessage("✅ 친구가 삭제되었습니다.");
  } catch (error) {
    console.error("❌ 친구 삭제 실패:", error);
    setDeleteMessage("❌ 친구 삭제에 실패했습니다.");
  } finally {
    setShowDeleteConfirm(false); // 확인창 닫기
    setDeleteTarget(null);
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

  // MainPage 컴포넌트 내부 최상단 근처
const [toastMsg, setToastMsg] = useState(null);
const showToast = (msg) => {
  setToastMsg(msg);
  // 3초 후 사라짐 (원하면 시간 조절)
  setTimeout(() => setToastMsg(null), 3000);
};

// 🔔 SSE에서 '친구 요청' 이벤트가 오면 실행
const onIncomingFriendRequest = (payload) => {
  // 실시간 갱신: 서버에서 친구목록/요청목록 다시 받아오기
  refreshFriendData();

  // 원하면 친구 팝업 자동으로 열기
  // setIsFriendPopupOpen(true);
};

// (선택) 모든 SSE 이벤트 로깅하고 싶으면
const onAnyEvent = (evt) => {
  console.log('[SSE EVENT]', evt);
};

  // 상단 state 모음에 추가
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  // 탈퇴 관련 state 모음 옆에 추가
  const [withdrawError, setWithdrawError] = useState('');

  const isGoogle = !!userInfo?.googleSub;
  const isKakao  = !!userInfo?.kakaoId;
  const isSocial = isGoogle || isKakao;

  const handleGoogleDelete = () => {
    if (!confirm("구글 재인증 후 탈퇴가 진행됩니다. 계속할까요?")) return;
    window.location.href = "/api/oauth2/authorization/google?purpose=delete";
  };

  const handleKakaoDelete = () => {
    if (!confirm("카카오 재인증 후 탈퇴가 진행됩니다. 계속할까요?")) return;
    window.location.href = "/api/oauth2/authorization/kakao?purpose=delete";
  };

  // 탈퇴 시 비밀번호 검증
  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      setWithdrawError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      // ✅ 비밀번호 먼저 검증
      const res = await api.post(
        '/user/auth/password/verify',
        { currentPassword: withdrawPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data?.isSuccess === true) {
        setWithdrawError('');
        setShowWithdrawConfirm(true); // 확인 모달 오픈
      } else {
        setWithdrawError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setWithdrawError('비밀번호가 일치하지 않습니다.');
      console.error('❌ 비밀번호 검증 실패:', err);
    }
  };

  // 실제 탈퇴 실행
  const confirmWithdrawNow = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete('/user/auth/withdraw', {
        params: { password: withdrawPassword },
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message || '비밀번호가 올바르지 않거나 서버 오류가 발생했습니다.';
      setWithdrawError(msg); // ⬅️ 에러 문구를 위에 보여주기
      console.error('❌ 회원탈퇴 실패:', err);
    } finally {
      setShowWithdrawConfirm(false);
      setIsDeletingAccount(false);
      setWithdrawPassword('');
    }
  };


   // 프로필(아바타) 선택용 상태
  const [isPickingProfile, setIsPickingProfile] = useState(false);
  const [profileOptions, setProfileOptions] = useState([]);  // [{profileSeq, imageUrl}, ...]
  const [tempProfileSeq, setTempProfileSeq] = useState(null); // 임시 선택값
  const [savingProfile, setSavingProfile] = useState(false);

  // 프로필 목록 조회 (마이페이지 열고 "프로필 변경" 버튼 눌렀을 때 호출)
const fetchProfileOptions = async () => {
  try {
    const res = await api.get('/users/games/profiles'); // 예: 목록 반환
    const list = res.data ?? [];
    setProfileOptions(list);
    setTempProfileSeq(userInfo?.profile?.profileSeq ?? null);
  } catch (err) {
    console.error('❌ 프로필 목록 불러오기 실패:', err);
    alert('프로필 목록을 불러오지 못했습니다.');
  }
};
const saveProfileSelection = async () => {
  // 0도 유효할 수 있으므로 null/undefined만 차단
  if (tempProfileSeq === null || tempProfileSeq === undefined) return;

  try {
    setSavingProfile(true);

    const token = localStorage.getItem('accessToken');

    await api.patch(
      '/users/games/profile/change',                // ✅ PATCH + 올바른 경로
      { profileSeq: tempProfileSeq },        // ✅ Request body
      {
        headers: {
          Authorization: `Bearer ${token}`,  // ✅ 필수 헤더
          'Content-Type': 'application/json'
        }
      }
    );

    // 성공 시 유저정보 리프레시
    const refreshed = await api.get('/user/auth/getUserInfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserInfo(refreshed.data.result);

    setIsPickingProfile(false);
  } catch (err) {
    console.error('❌ 프로필 변경 실패:', {
      status: err.response?.status,
      data: err.response?.data
    });
    alert(err.response?.data?.message ?? '프로필 변경에 실패했습니다.');
  } finally {
    setSavingProfile(false);
  }
};


  // 메달 상태
const [medals, setMedals] = useState({ gold: 0, silver: 0, bronze: 0 });

const fetchMedals = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await api.get(`/users/games/${userInfo.userUuid}/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 응답이 배열(리스트)이라면 합산, 객체 하나라면 그대로 반영
    const payload = res.data?.result ?? res.data ?? [];
    let totals = { gold: 0, silver: 0, bronze: 0 };

    if (Array.isArray(payload)) {
      totals = payload.reduce(
        (acc, r) => ({
          gold: acc.gold + (r.goldMedal ?? 0),
          silver: acc.silver + (r.silverMedal ?? 0),
          bronze: acc.bronze + (r.bronzeMedal ?? 0),
        }),
        totals
      );
    } else {
      totals = {
        gold: payload.goldMedal ?? 0,
        silver: payload.silverMedal ?? 0,
        bronze: payload.bronzeMedal ?? 0,
      };
    }

    setMedals(totals);
  } catch (err) {
    console.error('❌ 메달 조회 실패:', {
      status: err.response?.status,
      data: err.response?.data,
    });
  }
};

useEffect(() => {
  if (userInfo?.userUuid) {
    fetchMedals();
  }
}, [userInfo]);

const [top3, setTop3] = useState([]);
const [top3Loading, setTop3Loading] = useState(false);
const [top3Err, setTop3Err] = useState(null);

const fetchTop3 = async () => {
  try {
    setTop3Loading(true);
    setTop3Err(null);

    const { data } = await api.get('/statistics/leaderboard/top');
    // 응답이 정렬되어 있지 않을 수도 있으니 rank 오름차순 정렬 후 3명만
    const list = Array.isArray(data) ? data.slice() : [];
    list.sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
    const only3 = list.slice(0, 3);

    setTop3(only3);
  } catch (e) {
    console.error('TOP3 조회 실패:', e);
    setTop3([]);
    setTop3Err('랭킹을 불러오지 못했어요.');
  } finally {
    setTop3Loading(false);
  }
};
useEffect(() => {
  fetchTop3();
}, []);

// ====== 칼로리 조회 상태 ======
const [selectedCalorieData, setSelectedCalorieData] = useState([]);
const [kcalLoading, setKcalLoading] = useState(false);
const [kcalErr, setKcalErr] = useState(null);
const resetCaloriesView = () => {
  setDateRange([null, null]);
  setSelectedCalorieData([]);
  setKcalErr(null);
  setKcalLoading(false);
};


// 화면 표기를 위한 날짜 포맷 (예: 2025.08.02)
const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// ---- 날짜 유틸 ----
// 서버 1차 요청용: YYYYMMDD
const toYYYYMMDD = (d) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;

// 서버 2차 폴백용: YYYY-MM-DD
const toDash = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// 키 통일: YYYY-MM-DD
const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// start~end 사이 날짜 모두 생성
const eachDay = (start, end) => {
  const out = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cur <= last) {
    out.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
};

// ---- API 호출 ----
const fetchCalories = async (startDate, endDate) => {
  if (!startDate || !endDate) return;

  try {
    setKcalLoading(true);
    setKcalErr(null);

    const token = localStorage.getItem('accessToken');

    // 1차: YYYYMMDD
    const params1 = { start: toYYYYMMDD(startDate), end: toYYYYMMDD(endDate) };
    let res;
    try {
      res = await api.get('/users/games/kcal', {
        headers: { Authorization: `Bearer ${token}` },
        params: params1,
      });
    } catch (e) {
      // 2차: YYYY-MM-DD
      const params2 = { start: toDash(startDate), end: toDash(endDate) };
      res = await api.get('/users/games/kcal', {
        headers: { Authorization: `Bearer ${token}` },
        params: params2,
      });
    }

    // Swagger: result: [{ playDate: "string", kcal: number }]
    const list = res.data?.result ?? [];

    // 응답을 Map으로: key=YYYY-MM-DD, value=kcal
    const dataMap = new Map(
      list.map(row => {
        const raw = String(row.playDate ?? '');
        const key = raw.includes('-')
          ? raw
          : (raw.length === 8 ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}` : raw);
        return [key, Number(row.kcal) || 0];
      })
    );

    // 선택한 기간 전체 채우기(없으면 0)
    const filled = eachDay(startDate, endDate).map(d => {
      const key = toKey(d);
      return { date: key, calorie: dataMap.get(key) ?? 0 };
    });

    setSelectedCalorieData(filled);
  } catch (err) {
    console.error('❌ 칼로리 조회 실패:', err.response?.status, err.response?.data);

    // 실패해도 0으로 채워서 보여주기
    if (startDate && endDate) {
      const fallback = eachDay(startDate, endDate).map(d => ({ date: toKey(d), calorie: 0 }));
      setSelectedCalorieData(fallback);
    } else {
      setSelectedCalorieData([]);
    }

    setKcalErr('칼로리 정보를 불러오지 못했어요.');
  } finally {
    setKcalLoading(false);
  }
};

// 날짜 선택될 때마다 호출
useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    fetchCalories(dateRange[0], dateRange[1]);
  } else {
    setSelectedCalorieData([]);
  }
}, [dateRange]);

// ▶ 프리스타트 안내 모달 (카운트다운/건너뛰기 제거)
const [prestartOpen, setPrestartOpen] = useState(false);
const [dontShowAgain, setDontShowAgain] = useState(false);
const PRESTART_KEY = 'single_prestart_dismissed';

// 싱글 버튼 클릭 시 (로컬스토리지 체크)
const openPrestart = () => {
  if (localStorage.getItem(PRESTART_KEY) === '1') {
    navigate('/singletest');
    return;
  }
  setPrestartOpen(true);
  setDontShowAgain(false);
};

// 준비 완료 → 즉시 시작
const startNow = () => {
  if (dontShowAgain) localStorage.setItem(PRESTART_KEY, '1');
  setPrestartOpen(false);
  navigate('/singletest');
};

// 취소
const cancelPrestart = () => setPrestartOpen(false);

const [token, setToken] = useState(null);

  useEffect(() => {
    // 실제 앱에서 쓰는 키로 교체하세요: 'accessToken' 또는 'token' 등
    const t =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('accessToken');
    setToken(t);
  }, []);
  // --- BGM 제어용 ---
  const audioRef = useRef(null);
  const [soundLocked, setSoundLocked] = useState(false);

  // 최초 진입 시 자동재생 시도 + 사용자 제스처로 해제
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;
    audio.loop = true;

    const tryPlay = () =>
      audio.play()
        .then(() => {
          setSoundLocked(false);
          removeListeners();
        })
        .catch(() => {
          // 자동재생 차단 → 버튼 또는 다음 사용자 제스처로 재시도
          setSoundLocked(true);
        });

    const removeListeners = () => {
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
    };

    const onUserGesture = () => {
      tryPlay();
    };

    // 1) 즉시 시도
    tryPlay();

    // 2) 막히면 다음 사용자 제스처에서 재시도
    document.addEventListener('click', onUserGesture, { once: true });
    document.addEventListener('keydown', onUserGesture, { once: true });

    // 언마운트/라우팅 이탈 시 정리
    return () => {
      removeListeners();
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    };
  }, []);


  return (
    <div className="main-page-background">
      <FriendNotification
  token={token}
  onFriendRequest={onIncomingFriendRequest}
  onAnyEvent={onAnyEvent}   // ← 선택사항(빼도 됨)
  onToast={(msg) => {                    // ✅ FriendNotification → 메인으로 메시지 전달
          setToastMsg(msg);
          setTimeout(() => setToastMsg(""), 5000);
        }}
/>
<div className="inpage-toast-layer">
  {toastMsg && (
    <div className={`inpage-toast ${typeof toastMsg === 'object' ? (toastMsg.variant || 'info') : 'info'}`}>
      {typeof toastMsg === 'string' ? toastMsg : (toastMsg.text ?? '')}
  </div>
)}
</div>

      <audio ref={audioRef} src={mainBgm} preload="auto" />
      {/* (옵션) 자동재생 차단 시 노출되는 작은 버튼 */}
      {soundLocked && (
        <button
          onClick={() => {
            audioRef.current?.play().then(() => setSoundLocked(false)).catch(() => {});
          }}
          style={{
            position: 'fixed', top: 16, right: 16, zIndex: 9999,
            padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc',
            background: '#111', color: '#fff', cursor: 'pointer'
          }}
        >
          🔊 사운드 켜기
        </button>
      )}
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
        {/* 좌측 TOP3 위젯 */}
<div className="left-top3-card">
  <div className="left-top3-title">싱글모드 랭킹 TOP 3</div>

  {top3Loading && <div className="left-top3-status">불러오는 중…</div>}
  {top3Err && <div className="left-top3-status error">{top3Err}</div>}

  {!top3Loading && !top3Err && (
    <ul className="left-top3-list">
      {top3.map((u, idx) => {
        const rank = u.rank ?? idx + 1;
        const trophy =
          rank === 1 ? firstTrophy :
          rank === 2 ? secondTrophy :
          thirdTrophy;

        return (
          <li key={u.nickname + '_' + rank} className="left-top3-item">
            <img className="left-top3-trophy" src={trophy} alt={`${rank}등 트로피`} />
            <span className="left-top3-nick" title={u.nickname}>{u.nickname}</span>
          </li>
        );
      })}
    </ul>
  )}
</div>

        <div className="gold-display">
          <img src={coinIcon} alt="코인" className="coin-icon" />
          <span className="gold-amount">{gold.toLocaleString()} G</span>
        </div>

        <div className="bottom-right-buttons">
          <button className="bottom-icon-button" onClick={() => navigate('/event')}>
            <img src={modeEvent} alt="이벤트 모드" />
          </button>
          <button className="bottom-icon-button" onClick={openPrestart}>
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
            {Array.isArray(seq) && seq.length > 0 && (
              <CharacterSequence
                key={currentSkin?.playerSkinItemSeq || currentIndex} // 스킨 바뀔 때 타이머 리셋
                images={seq}
                durations={[900, 500, 500]} // 프레임별 시간(ms): 1프레임=3초, 나머지=0.5초
                className="main-character large"
                style={{ opacity: skins[currentIndex]?.isUnlock === 0 ? 0.6 : 1 }}
              />
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
          {/* 금액 부족 메시지 출력 */}
          {insufficientFundsMessage && (
              <div className="insufficient-funds-modal">
                <p>{insufficientFundsMessage}</p>
                <button className="close-button" onClick={() => setInsufficientFundsMessage('')}>닫기</button>
              </div>
          )}

        </div>

      {/* 모달들 */}
      {modalType && (
        <div className="modal-overlay" onClick={() => {if (modalType === 'mypage') {
        resetCaloriesView();
      }setModalType(null);setActiveTab('통계'); setIsEditing(false); setIsEditingNickname(false); setEditNickname(userInfo?.nickname);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalType === 'lank' && (
              <RankingModal onClose={() => setModalType(null)} />
            )}
            
            {modalType === 'tutorial' && (
                <div className="tutorial-modal-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                  {/* 닫기 버튼 */}
                  <img
                      src={closeIcon}
                      alt="닫기"
                      onClick={() => setModalType(null)}
                      className="tuclose"
                      style={{
                        position: 'absolute',
                        top: '15%',
                        right: '16%',
                        width: '50px',
                        height: '50px',
                        zIndex: 10
                      }}
                  />
                  {/* 모달 이미지 */}
                  <img src={tutorialModal} alt="튜토리얼 모달" className="tutorial-modal-image" />
                  {/* 텍스트 */}
                  <div className="tutorial-modal-text">
                    🥊 모션을 따라 건물을 파괴하라!<br /><br />
                    화면 상단에 뜨는 <strong style={{ color: 'black' }}>콤보 스택(잽, 어퍼컷)</strong>에 맞춰<br />
                    정확한 모션을 취하세요.<br /><br />
                    올바른 동작을 하면 건물 HP가 깎이고,<br />
                    💥HP가 0이 되면 건물이 철거됩니다!<br /><br />
                    ⏱ 건물을 철거하면 추가 시간이 주어집니다.<br /><br />
                    제한 시간이 모두 끝나기 전에 더 많은 건물을 철거해보세요!
                  </div>
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
                    {isEditing && (
                      <button
                        className="mypage-edit-btn"
                        onClick={async () => {
                          await fetchProfileOptions();
                          setIsPickingProfile(true);
                        }}
                      >
                        프로필 변경
                      </button>
                    )}
                    {/* 프로필 선택 팝업 */}
                    {isPickingProfile && (
                      <div className="modal-overlay" onClick={() => setIsPickingProfile(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                          <h3>프로필 선택</h3>

                          <div className="character-grid1">
                            {profileOptions.map((p) => (
                              <div
                                key={p.profileSeq}
                                className={`character-item ${tempProfileSeq === p.profileSeq ? 'selected' : ''}`}
                                onClick={() => setTempProfileSeq(p.profileSeq)}
                              >
                                <img src={p.image} alt={`profile-${p.profileSeq}`} />
                              </div>
                            ))}
                          </div>

                          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="cancel-btn" onClick={() => setIsPickingProfile(false)}>취소</button>
                            <button className="save-btn" onClick={saveProfileSelection} disabled={!tempProfileSeq || savingProfile}>
                              {savingProfile ? '저장 중...' : '저장'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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

                    {/* 통계 탭 내용 */}
                    {activeTab === '통계' && !isEditing && (
                      <>
                        <div className="medal-section">
                          <div className="play-label">나의 메달</div>

                          {/* 메달 표시 영역 */}
                          <div className="medal-row-section">
                            <div className="medal-item">
                              <img src={goldImg} alt="금메달" />
                              <span className="medal-count">{medals.gold}</span>
                            </div>
                            <div className="medal-item">
                              <img src={silverImg} alt="은메달" />
                              <span className="medal-count">{medals.silver}</span>
                            </div>
                            <div className="medal-item">
                              <img src={bronzeImg} alt="동메달" />
                              <span className="medal-count">{medals.bronze}</span>
                            </div>
                          </div>
                        </div>

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
                                <div className="bar-fill red" style={{ width: `${(playStats.todayPlayTime / 120) * 100}%` }}></div>
                              </div>
                              <span className="time-text">{playStats.todayPlayTime}분 / 권장 2시간 기준</span>
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
                        <div className="weekly-chart-label">칼로리를 조회해보세요!</div>
                        <div className="weekly-chart-label1">시작일과 종료일을 선택하세요</div>
                        <div className="calendar-section">
                          <Calendar
                            onChange={setDateRange}
                            value={dateRange}
                            selectRange={true}
                            locale="ko-KR"
                            calendarType="US"
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

{/* 상태 표시 */}
{kcalLoading && <div className="calorie-status">불러오는 중…</div>}
{kcalErr && <div className="calorie-status error">{kcalErr}</div>}

{/* 칼로리 그래프 */}
{!kcalLoading && !kcalErr && selectedCalorieData.length > 0 && (
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
                          <div className="delete-account-wrapper">
                            <button
                              className="delete-account-btn"
                              onClick={() => {
                                if (isGoogle) return handleGoogleDelete();
                                if (isKakao)  return handleKakaoDelete();
                                //일반 계정이면 기존 비밀번호 폼 열기
                                setIsDeletingAccount(true);  // ❗ 폼 열기
                                setWithdrawPassword('');     // 입력 초기화
                              }}
                            >
                              회원탈퇴
                            </button>
                          </div>

                          {/* ✅ 회원탈퇴 폼 */}
{isDeletingAccount && (
  <div className="withdraw-form">
    <div className="password-form-header">
      <button
        className="close-password-btn"
        onClick={() => {
          setIsDeletingAccount(false);
          setWithdrawPassword('');
        }}
      >
        닫기 ❌
      </button>
    </div>

                              {/* 에러 메시지 */}
{withdrawError && (
  <p className="withdraw-error-text">
    {withdrawError}
  </p>
)}

    <input
  type="password"
  value={withdrawPassword}
  onChange={(e) => {
    setWithdrawPassword(e.target.value);
    if (withdrawError) setWithdrawError(''); // ⬅️ 타이핑 하면 에러 제거
  }}
  placeholder="본인 확인용 비밀번호 입력"
/>


    <div className="password-change-buttons">
      <button className="cancel-btn" onClick={() => setIsDeletingAccount(false)}>취소</button>
      <button className="save-btn" onClick={handleWithdraw} disabled={!withdrawPassword}>
        회원탈퇴
      </button>
    </div>

    {/* ✅ 커스텀 확인 모달 */}
    {showWithdrawConfirm && (
      <div className="modal-overlay" onClick={() => setShowWithdrawConfirm(false)}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
          <p>정말 탈퇴하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.</p>
          <div className="modal-buttons">
            <button onClick={confirmWithdrawNow}>확인</button>
            <button onClick={() => setShowWithdrawConfirm(false)}>취소</button>
          </div>
        </div>
      </div>
    )}
  </div>
)}



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
                                    setVerifyStatus(null);
                                    setVerifyMsg('');
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
                                  {/* ✅ 상태 문구: 현재 비밀번호 입력 바로 아래 */}
                                  {verifyStatus && (
                                    <div className={`status-line ${verifyStatus}`}>
                                      <span>{verifyMsg}</span>
                                    </div>
                                  )}
                                  <button className="verify-btn" onClick={verifyPassword}>확인</button>
                                </>
                              ) : (
                                <>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 입력 영문, 숫자 포함 8~20자, 공백 불가"
                                  />
                                  <input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="새 비밀번호 재입력"
                                  />
                                  {/* ✅ 상태 문구: 새 비밀번호 확인 입력칸 바로 밑 */}
{changePwStatus && (
  <div className={`status-line ${changePwStatus}`}>
    <span>{changePwMsg}</span>
  </div>
)}
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
                        <label class="nickname-label">닉네임을 변경해보세요</label>
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
                    {activeTab === '도감' && !isEditing && (
                      <div className="collection-section">
                        <span>건물을 철거하고 도감을 채워보세요!</span>
                        <div className="buildingname">COMMON</div>
                        <div className="building-grid">
                          {buildingImages.map(({ src, filename }, i) => {
                            const isUnlocked = unlockedBuildings.includes(filename);
                            return (
                              <div key={i} className="building-item">
                                <img
                                  src={src}
                                  alt={`건물 ${filename}`}
                                  loading="lazy"
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

                                        {/* 정보 수정 화면 - 보기 모드 */}
                    {activeTab === '도감' && isEditing && !isEditingNickname && (
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
                          <div className="delete-account-wrapper">
                            <button
                              className="delete-account-btn"
                              onClick={() => {
                                if (isGoogle) return handleGoogleDelete();
                                if (isKakao)  return handleKakaoDelete();
                                //일반 계정이면 기존 비밀번호 폼 열기
                                setIsDeletingAccount(true);  // ❗ 폼 열기
                                setWithdrawPassword('');     // 입력 초기화
                              }}
                            >
                              회원탈퇴
                            </button>
                          </div>

                          {/* ✅ 회원탈퇴 폼 */}
{isDeletingAccount && (
  <div className="withdraw-form">
    <div className="password-form-header">
      <button
        className="close-password-btn"
        onClick={() => {
          setIsDeletingAccount(false);
          setWithdrawPassword('');
        }}
      >
        닫기 ❌
      </button>
    </div>

                              {/* 에러 메시지 */}
{withdrawError && (
  <p className="withdraw-error-text">
    {withdrawError}
  </p>
)}

    <input
  type="password"
  value={withdrawPassword}
  onChange={(e) => {
    setWithdrawPassword(e.target.value);
    if (withdrawError) setWithdrawError(''); // ⬅️ 타이핑 하면 에러 제거
  }}
  placeholder="본인 확인용 비밀번호 입력"
/>


    <div className="password-change-buttons">
      <button className="cancel-btn" onClick={() => setIsDeletingAccount(false)}>취소</button>
      <button className="save-btn" onClick={handleWithdraw} disabled={!withdrawPassword}>
        회원탈퇴
      </button>
    </div>

    {/* ✅ 커스텀 확인 모달 */}
    {showWithdrawConfirm && (
      <div className="modal-overlay" onClick={() => setShowWithdrawConfirm(false)}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
          <p>정말 탈퇴하시겠습니까? <br />이 작업은 되돌릴 수 없습니다.</p>
          <div className="modal-buttons">
            <button onClick={confirmWithdrawNow}>확인</button>
            <button onClick={() => setShowWithdrawConfirm(false)}>취소</button>
          </div>
        </div>
      </div>
    )}
  </div>
)}



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
                    {activeTab === '도감' && isEditing && isEditingNickname && (
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
                  </div>
                </div>
              </div>
            )}

            {modalType === 'multi' && (
                <div className="multi-mode-buttons">
                  <button onClick={goToCreate}>
                    <img src={roomMake} alt="방 만들기" />
                  </button>
                  <button onClick={goToJoin}>
                    <img src={roomParticipation} alt="방 참가하기" />
                  </button>
                </div>
            )}


          </div>
        </div>
      )}
                  {prestartOpen && (
            <div className="modal-overlay">
              <div className="prestart-modal" onClick={(e) => e.stopPropagation()}>
                <div className="prestart-title">시작 전, 가드 자세를 취해 주세요</div>
                <ul className="prestart-tips">
                  <li>카메라가 상체를 잘 인식하도록 <b>정면</b>에 서세요.</li>
                  <li>양손을 볼 근처로 올리고 <b>가드 자세</b>를 유지하세요.</li>
                  <li>배경이 어둡거나 복잡하면 인식률이 떨어질 수 있어요.</li>
                </ul>
                
                 {/* 포즈 이미지 추가 */}
                <div className="prestart-pose-img">
                  <img src={poseImg} alt="포즈 이미지" />
                </div>
                <ul className="prestart-tips">
                  <li><span style={{ color: 'red' }}>빨간색</span> 글러브가 표시되면 <span style={{ color: 'red' }}>왼손</span>으로 잽 또는 어퍼를 날리세요.</li>
                  <li><span style={{ color: 'blue' }}>파란색</span> 글러브가 표시되면 <span style={{ color: 'blue' }}>오른손</span>으로 잽 또는 어퍼를 날리세요.</li>
                </ul>
                <div className="prestart-actions">
                  <label className="prestart-checkbox">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                    />
                    다시 보지 않기
                  </label>
                  <div className="prestart-buttons">
                    <button className="ps-btn ghost" onClick={cancelPrestart}>취소</button>
                    <button className="ps-btn primary" onClick={startNow}>숙지 완료</button>
                  </div>
                </div>
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

                              {isMyself ? (
                                <div className="already-friend-text">🙋‍♂️ 본인입니다</div>
                              ) : isAlreadyFriend ? (
                                <div className="already-friend-text">✅ 이미 친구입니다</div>
                              ) : hasReceivedRequest ? (
                                <div className="already-friend-text">📩 이 사용자가 당신에게 친구 요청을 보냈습니다. 수락해주세요!</div>
                              ) : hasSentRequest ? (
                                <div className="already-friend-text">✅ 친구 요청을<br />보냈습니다!</div>
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
                    <button className="friend-delete-btn" onClick={() => {
    setDeleteTarget(friend.friendUuid);   // ✅ 대상 저장
    setShowDeleteConfirm(true);           // 모달 오픈
  }}> 삭제</button>
                  </div>
                ))}
              </div>
              {/* ✅ 삭제 확인 모달 */}
{showDeleteConfirm && (
  <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h3 className="modal-title">⚠️ 친구 삭제</h3>
      <p className="modal-message">정말 이 친구를 삭제하시겠습니까?</p>
      <div className="modal-actions">
        <button
          className="confirm-btn"
          onClick={() => confirmDeleteFriend(deleteTarget)}
        >
          삭제
        </button>
        <button
          className="cancel-btn"
          onClick={() => setShowDeleteConfirm(false)}
        >
          취소
        </button>
      </div>
    </div>
  </div>
)}

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