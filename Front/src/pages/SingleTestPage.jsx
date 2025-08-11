import React, { useEffect, useRef, useState } from 'react';
// import { Pose } from '@mediapipe/pose';
import * as mpPose from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import PixiCanvas from '../components/pixi/PixiCanvas';
import api from '../utils/api';
import "../styles/SingleTestPage.css";
import coinImg from '../assets/images/main/coin.png';
import AnimatedPage from '../components/AnimatedPage';
import timerIcon from '../assets/images/singlemode/timer.png';
/*
// 시간상 관계로 코드 하드코딩 세팅 이용해야함. Cntrl + F
- #TIMERSETTING : 타이머 값 수정 #TIMERSETTING
- #ONOFF        : 미디어 파이프 관절 ON/OFF
- #BGM          : 브금 세팅 ************ 이거 유빈이가 알아본다 해서 보류 여기다 해줘 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> (작업 필요)
- #BUILDINGCNT  : 빌딩 개수 세팅
- #ADDBUILDINGTIME : 건물 부쉈을때 빌딩 타이머 증가

#init
  0. 초기 세팅
    - 카메라 세팅 (완)       
    - mediaPipe 세팅 (완)   
#001
  1. 게임 시작 전
    - 건물 리스트 뽑아오기 (완)                        
    - AccessToken 으로 사용자 skin 가져오기 (완)       
      >> 캔버스에 할당[output] (완)                    
      >> 플레이어 스킨 하드 코딩 연동하기 (시간 부족으로 하드코딩 하기로 협의 함) (완)
    - 콤보 할당 받기 (완)

#002
  2. 게임 플레이
    - (캔버스에)기본 input 작업 (완)
    - 미디어 파이프 이식 (완) 
    - 건물 적용 (완) 
    - 건물 hp 적용 (완)
    - 스킨 적용  (userSkin은 가져왔지만 skin 적용 후 작업 해주기) 애니메이션 작업해주기 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> (작업 필요)
    - quit 버튼 경로 작업 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> (작업 필요)
    - combo 100개 다 끝나면 인덱스 초기화 (완)
    - 빌딩 부술때 마다 배열에 빌딩 키 추가 (완)
    - 플레이 시간 계산 추가 (완)
    
#003
  3. 게임 종료
    - 최신 화 정보 갱신
      - GAMEOVER 페이지에 뿌려주기 (싱글은 일단 초, 부순 건물수, 칼로리)(완) 멀티는 골드 , 순위 계산 로직 추가 필요 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> (작업 필요)
    - 사용자 리포트 최신화
      - singleTopBuilding : 싱글 넣어주기 (싱글)? : 0
      - multiTopBuilding  : 멀티 넣어주기 (멀티)? : 0
      - goldMedal         : 골드 메달     (멀티)? : 0
      - silverMedal       : 실버 메달    (멀티)? : 0
      - bronzeMedal       : 브론즈 메달  (멀티)? : 0
      - playTime          : 플레이 시간  (토탈)
    - 빌딩 키 배열 최신화
      - 빌딩 키 seq 배열 
    - 사용자 일일 리포트 최신화
      - kcal
      - playTimeDate      : 플레이 시간
    - 사용자 골드 정보 최신화
      - goldCnt           : 골드 갯수
*/


const SingleTestPage = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [userUuid, setUserUuid] = useState("");             // 사용자 UUID

  // 게임
  const [action, setAction] = useState('idle');             // ?
  const [timeover, setTimeover] = useState(100);            // 상단 타이머(카운트다운) 남은 시간(초)
  const [kcal, setKcal] = useState(0);                      // 칼로리
  const [coinCount, setCoinCount] = useState(0);            // 코인 수
  const [destroyedCount, setDestroyedCount] = useState(0);  // 부순 건물 수

  // 빌딩
  const [buildingIndex, setBuildingIndex] = useState(0);    // 빌딩 인덱스
  const [combo, setCombo] = useState([]);                   // 유저 콤보
  const [isGameOver, setIsGameOver] = useState(false);      // 게임오버 트리거
  // 추가: 부순 건물 seq 리스트
  const [destroyedSeqs, setDestroyedSeqs] = useState([]);
  // 시간
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef(null);
  const [playTime, setPlayTime] = useState(0);
  const [addTime, setAddTime] = useState(3000); // #ADDBUILDINGTIME
  // const currentBuilding = buildingList[buildingIndex] ?? null;

  const COIN_PER_BUILDING = 1;

  // 콤보(패턴)
  const [patternIdx, setPatternIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const advanceLockRef = useRef(false);

  // 게임 시작 시각 및 제한시간(초)
  const TIME_LIMIT_SEC = 100;                                         // 필요 시 값만 바꾸면 됨 
  const gameStartAtRef = useRef(null);                                // Date.now() 저장 
  const [finalTimeover, setFinalTimeover] = useState(null);           // 게임 종료 시 남은 시간 기록 

  /* ================== 미디어파이프 감지용 공용 ref/상수 ================== */
  const audioRef = useRef(null);                                      // 상단으로 이동 (startCamera 전에 필요)
  const mediaStreamRef = useRef(null);           
  const mediapipeCameraRef = useRef(null);       
  const poseRef = useRef(null);                       // [ADDED][MP] Pose 인스턴스 보관(중복생성/정리)

  const fsmStateRef = useRef('get_ready');                            // 'get_ready' | 'action' | 'cooldown'
  const startPosRef = useRef({ left: null, right: null });            //  손목 시작 좌표
  const startShoulderRef = useRef({ left: null, right: null });       //  어깨 기준 좌표
  const lastActionAtRef = useRef(0);                                    

  // 속도/안정화 필터
  const lPrevRef = useRef({ x: 0, y: 0, init: false });    
  const rPrevRef = useRef({ x: 0, y: 0, init: false });    
  const lFiltRef = useRef({ x: 0, y: 0, init: false });    
  const rFiltRef = useRef({ x: 0, y: 0, init: false });    
  const lOverCntRef = useRef(0);                           
  const rOverCntRef = useRef(0);                           
  const lastTsRef = useRef(0);                             

  // [GAMEOVER] 현재 게임오버 상태를 비동기 콜백에서 안전하게 확인하기 위한 ref
  const isGameOverRef = useRef(false); // [GAMEOVER]
  useEffect(() => {                    // [GAMEOVER]
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);

  // 게임 종료 리포트 중복 방지
  const didReportRef = useRef(false);
  const didDailyReportRef = useRef(false);
  const didGoldReportRef = useRef(false);
  const didConstructureSaveRef = useRef(false);
  // 튜닝 포인트
  const EMA_ALPHA = 0.5;       // 0.5~0.7 추천
  const HIT_MIN_FRAMES = 3;    // 연속 프레임 확증
  const COOLDOWN_SEC = 0.6;    //  감지 후 쿨다운

  // Mediapipe 인덱스 (정규화 좌표)
  const NOSE = 0, LS = 11, RS = 12, LE = 13, RE = 14, LW = 15, RW = 16; 

  // 가드 자세 판정(정규화 y)
  function isReadyPoseNorm(lm) {                                   
    const noseY = lm[NOSE].y;
    const LwY = lm[LW].y;
    const RwY = lm[RW].y;
    const LeY = lm[LE].y;
    const ReY = lm[RE].y;
    const LsY = lm[LS].y;
    const RsY = lm[RS].y;

    const shoulderBand = 0.08;
    const handInGuard =
      noseY < LwY && LwY < (LsY + shoulderBand) &&
      noseY < RwY && RwY < (RsY + shoulderBand);
    const elbowsDown = LeY > LsY && ReY > RsY;

    return handInGuard && elbowsDown;
  }
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);  // [ADDED]
  /* ================================================================================ */

  /*=====================================================================================
    #init 게임 시작 초기 세팅
  =====================================================================================*/

  // 카메라 시작
  const startCamera = async () => {
    // [GAMEOVER] 게임오버 시 카메라 시작 방지
    if (isGameOverRef.current) return; 

    if (mediapipeCameraRef.current || (videoRef.current && videoRef.current.srcObject)) { // 중복 가드
      return;
    }
    // 1) 로컬 카메라 열기
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
      audio: false,
    });
    mediaStreamRef.current = stream;

    const videoEl = videoRef.current;
    videoEl.srcObject = stream;
    videoEl.muted = true;
    videoEl.playsInline = true;
    await new Promise(res => videoEl.onloadedmetadata = res);                //  메타 로드 보장
    const canvasEl = canvasRef.current;                                      // 
    if (canvasEl) {
      canvasEl.width = videoEl.videoWidth || 640;                           
      canvasEl.height = videoEl.videoHeight || 480;                          
    }
    await videoEl.play().catch(() => { /* 자동재생 차단 시 버튼 한번 더 눌러야 할 수 있음 */ });

    // 2) MediaPipe Pose 설정
    // ======= [CHANGED][MP] Pose 인스턴스 생성부 시작 =======
    if (!poseRef.current) {
      //const cdnBase = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404'; // [PINNED][MP]
      // const localBase = '/mediapipe/pose'; // [OPTIONAL][MP] public/mediapipe/pose/* 로 복사 시 사용
      //const assetBase = cdnBase; // 필요시 localBase 로 전환
      const assetBase = `${import.meta.env.BASE_URL}mediapipe/pose`;

      const pose = new mpPose.Pose({
        locateFile: (file) => `${assetBase}/${file}`,                      // [CHANGED][MP]
      });

      pose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: true,                                                  // [ADDED][MP] 전면카메라 좌우 일관성
      });

      poseRef.current = pose;                                              // [ADDED][MP]
    }
    // ======= [CHANGED][MP] Pose 인스턴스 생성부 끝 =======

    /* =================== 감지 로직 전면 교체 (안정화 + 잽/어퍼) =================== */
    poseRef.current.onResults((results) => {                               // [CHANGED][MP] poseRef 사용
      // [GAMEOVER] 게임오버면 더 이상 프레임 처리/상태 업데이트 하지 않음
      if (!isPlayingRef.current || isGameOverRef.current) return; 

      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const lm = results.poseLandmarks;
      if (!lm) {
        fsmStateRef.current = 'get_ready';
        // [GAMEOVER] 게임오버 중 setState 금지 가드
        if (!isGameOverRef.current) setAction('idle'); 
        return;
      }
      
      // #ONOFF 미디어 파이프 관절 ON/OFF
      drawLandmarks(ctx, lm, { color: '#FF0000', radius: 3 }); 

      const nowSec = performance.now() / 1000;

      // 1) 준비 상태: 가드가 되면 시작점 캡쳐
      if (fsmStateRef.current === 'get_ready') {
        if (isReadyPoseNorm(lm)) {
          const left  = { x: lm[LW].x, y: lm[LW].y };
          const right = { x: lm[RW].x, y: lm[RW].y };
          const lSh   = { x: lm[LS].x, y: lm[LS].y };
          const rSh   = { x: lm[RS].x, y: lm[RS].y };

          startPosRef.current = { left, right };
          startShoulderRef.current = { left: lSh, right: rSh };

          // EMA/속도 초기화
          lFiltRef.current = { ...left,  init: true };
          rFiltRef.current = { ...right, init: true };
          lPrevRef.current = { ...left,  init: true };
          rPrevRef.current = { ...right, init: true };
          lastTsRef.current = nowSec;

          // 카운터 리셋
          lOverCntRef.current = 0;
          rOverCntRef.current = 0;

          fsmStateRef.current = 'action';
        }
        return;
      }

      // 2) 액션 상태: 잽/어퍼 후보 판정
      if (fsmStateRef.current === 'action') {
        // 시간보정
        let dt = nowSec - (lastTsRef.current || nowSec);
        if (dt <= 0 || dt > 0.2) dt = 0.016;
        lastTsRef.current = nowSec;

        // 사람 크기 기준(어깨폭)
        const shoulderDist = Math.abs(lm[LS].x - lm[RS].x);

        // 임계값(튜닝)
        const JAB_X_TH       = 0.22 * shoulderDist;
        const JAB_FLAT_Y_MAX = 0.22 * shoulderDist;
        const JAB_DIST_GAIN  = 0.18 * shoulderDist;
        const VEL_X_TH       = 0.04 * shoulderDist / Math.max(dt, 1e-3);

        const UPP_Y_TH      = 0.33 * shoulderDist;
        const UPP_DOM_RATIO = 1.70;
        const VEL_Y_TH      = 0.06 * shoulderDist / Math.max(dt, 1e-3);

        // 현재 좌표 + EMA
        const lNowRaw = { x: lm[LW].x, y: lm[LW].y };
        const rNowRaw = { x: lm[RW].x, y: lm[RW].y };
        if (!lFiltRef.current.init) {
          lFiltRef.current = { ...lNowRaw, init: true };
          rFiltRef.current = { ...rNowRaw, init: true };
        }
        const a = EMA_ALPHA;
        lFiltRef.current.x = a * lNowRaw.x + (1 - a) * lFiltRef.current.x;
        lFiltRef.current.y = a * lNowRaw.y + (1 - a) * lFiltRef.current.y;
        rFiltRef.current.x = a * rNowRaw.x + (1 - a) * rFiltRef.current.x;
        rFiltRef.current.y = a * rNowRaw.y + (1 - a) * rFiltRef.current.y;

        const lNow = lFiltRef.current;
        const rNow = rFiltRef.current;

        const lStart = startPosRef.current.left;
        const rStart = startPosRef.current.right;
        const lSh0   = startShoulderRef.current.left;
        const rSh0   = startShoulderRef.current.right;
        if (!lStart || !rStart || !lSh0 || !rSh0) return;

        // 변위
        const ldx = lNow.x - lStart.x, ldy = lNow.y - lStart.y;
        const rdx = rNow.x - rStart.x, rdy = rNow.y - rStart.y;

        // 속도
        if (!lPrevRef.current.init) lPrevRef.current = { ...lNow, init: true };
        if (!rPrevRef.current.init) rPrevRef.current = { ...rNow, init: true };
        const lvx = (lNow.x - lPrevRef.current.x) / dt;
        const lvy = (lNow.y - lPrevRef.current.y) / dt;
        const rvx = (rNow.x - rPrevRef.current.x) / dt;
        const rvy = (rNow.y - rPrevRef.current.y) / dt;
        lPrevRef.current = { ...lNow, init: true };
        rPrevRef.current = { ...rNow, init: true };

        // 손목-어깨 거리 증가(잽 보조)
        const lWS0 = dist(lStart, lSh0);
        const rWS0 = dist(rStart, rSh0);
        const lWS  = dist(lNow,   lSh0);
        const rWS  = dist(rNow,   rSh0);

        // 왼손 판정
        let lHit = false;
        const lJabCand   = (Math.abs(ldx) > JAB_X_TH || (lWS - lWS0) > JAB_DIST_GAIN)
                            && Math.abs(ldy) < JAB_FLAT_Y_MAX
                            && Math.abs(lvx) > VEL_X_TH;
        const lUpperCand = (-ldy) > UPP_Y_TH
                            && Math.abs(ldy) > Math.abs(ldx) * UPP_DOM_RATIO
                            && (-lvy) > VEL_Y_TH;
        if (lJabCand || lUpperCand) {
          lOverCntRef.current++;
          if (lOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) lHit = true;
        } else {
          lOverCntRef.current = Math.max(0, lOverCntRef.current - 1);
        }

        // 오른손 판정
        let rHit = false;
        const rJabCand   = (Math.abs(rdx) > JAB_X_TH || (rWS - rWS0) > JAB_DIST_GAIN)
                            && Math.abs(rdy) < JAB_FLAT_Y_MAX
                            && Math.abs(rvx) > VEL_X_TH;
        const rUpperCand = (-rdy) > UPP_Y_TH
                            && Math.abs(rdy) > Math.abs(rdx) * UPP_DOM_RATIO
                            && (-rvy) > VEL_Y_TH;
        if (rJabCand || rUpperCand) {
          rOverCntRef.current++;
          if (rOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) rHit = true;
        } else {
          rOverCntRef.current = Math.max(0, rOverCntRef.current - 1);
        }

        // 트리거
        if (lHit || rHit) {
          // [GAMEOVER] 게임오버 중 setState 금지
          if (!isGameOverRef.current) { // [GAMEOVER]
            setAction('punch');                       
            setTimeout(() => setAction('idle'), 0);
          }

          lastActionAtRef.current = nowSec;
          fsmStateRef.current = 'cooldown';

          lOverCntRef.current = 0;
          rOverCntRef.current = 0;
          return;
        }
        return;
      }

      // 3) 쿨다운
      if (fsmStateRef.current === 'cooldown') {
        if (nowSec - lastActionAtRef.current > COOLDOWN_SEC) {
          fsmStateRef.current = 'get_ready';
        }
        return;
      }
    });
    /* =================== 감지 로직 전면 교체 끝 =================== */

    // 3) MediaPipe Camera로 비디오 프레임 처리
    const cam = new Camera(videoEl, {
      onFrame: async () => {
        // [GAMEOVER] 게임오버면 더 이상 pose 처리 안 함
        if (!isPlayingRef.current || isGameOverRef.current) return; 
        try {
          if (poseRef.current) {                                      // [CHANGED][MP]
            await poseRef.current.send({ image: videoEl });           // [CHANGED][MP]
          }
        } catch (e) {
          // 처리 에러 무시
        }
      },
      width: 640,
      height: 480,
    });
    mediapipeCameraRef.current = cam;
    cam.start();
  };

  // 카메라 종료
  const stopCamera = () => {
    mediapipeCameraRef.current?.stop();
    mediapipeCameraRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Pose 정리
    if (poseRef.current) {                                           // [ADDED][MP]
      try { poseRef.current.close(); } catch {}                      // [ADDED][MP]
      poseRef.current = null;                                        // [ADDED][MP]
    }
  };

  // 화면 들어오면 카메라 켜기
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await startCamera();
      } catch (e) {
        console.error('카메라 시작 실패:', e);
      }
    })();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // #BGM
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }
  }, []);

  // [GAMEOVER] 게임오버 시 모든 진행 중인 요소 정지 (카메라/음악)
  useEffect(() => {                     // [GAMEOVER]
    if (!isGameOver) return;
    stopCamera();                       // 카메라/미디어파이프 정지
    if (audioRef.current) {             // BGM 정지
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // 종료 시 남은 시간 기록
    setFinalTimeover(timeover);        
  }, [isGameOver]);                     // [GAMEOVER]

  /*=====================================================================================
    #init 게임 시작 초기 세팅 END
  =====================================================================================*/
 
  /*=====================================================================================
    #001 게임 시작 전
  =====================================================================================*/

  //  빌딩 리스트 가져오기
  const [buildingList, setBuildingList] = useState([]);
  const currentBuilding = buildingList[buildingIndex] ?? null;
  const [playerSkin, setPlayerSkin] = useState("");
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const { data, status } = await api.get('/constructures/generate', {
          params: { count: 50 }, // #BUILDINGCNT
        });
        if (status !== 200 || !data.isSuccess) {
          throw new Error(data.message || `HTTP ${status}`);
        }
        // [GAMEOVER] 게임오버 중 상태 업데이트 가드
        if (!isGameOverRef.current) setBuildingList(data.result); // [GAMEOVER]
      } catch (err) {
        console.error('건물 리스트 로드 실패:', err);
      }
    };
    fetchBuildings();
  }, []);
  
  // SKIN 정보 가져오기
  useEffect(() => {
    const fetchSkin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data: skinData } = await api.get('/skins/getSkin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // [GAMEOVER] 게임오버 중 상태 업데이트 가드
        if (!isGameOverRef.current) setPlayerSkin(skinData.result); // [GAMEOVER]
      } catch (err) {
        console.error('플레이어스킨 로드 실패:', err);
      }
    };
    fetchSkin();
  }, []);
  
  // 게임 콤보 패턴 가져오기
  useEffect(() => {
    const fetchGameCombo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data, status } = await api.get('users/games/generate/numeric', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (status === 200) {
          // [GAMEOVER] 게임오버 중 상태 업데이트 가드
          if (!isGameOverRef.current) setCombo(Array.isArray(data?.patterns) ? data.patterns : []); // [GAMEOVER]
        } else {
          console.warn('응답 상태 비정상:', status);
        }
      } catch (error) {
        console.error('게임 패턴 로드 실패:', error);
      }
    };
    fetchGameCombo();
  }, []);
  
  // 회원 정보 가져오기( UUID 가져오기 위해서 )
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("응답 오류" + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ userInfo 결과", data);
        if (data?.result?.userUuid && data?.result?.userNickname) {
          // [GAMEOVER] 게임오버 중 상태 업데이트 가드
          if (!isGameOverRef.current) setUserUuid(data.result.userUuid); // [GAMEOVER]
        } else {
          throw new Error("데이터 형식 오류");
        }
      })
      .catch((err) => {
        console.error("❌ 유저 정보 조회 실패", err);
        alert("유저 정보를 가져오는 데 실패했습니다.");
      });
  }, []);

  useEffect(() => {
    console.log('buildingList updated:', buildingList);
  }, [buildingList]);

  /*=====================================================================================
    #001 게임 시작 전 END
  =====================================================================================*/

  /*=====================================================================================
    #002 게임 중 
  =====================================================================================*/

  useEffect(() => {
    // 기존 액션 기반 감소 타이머는 제거(상단 타이머는 벽시계 기반) — 별도 플레이 시간과 분리됨
  }, [action, isGameOver]);

  useEffect(() => {
    if (Array.isArray(combo) && combo.length > 0) {
      // [GAMEOVER] 게임오버 중 리셋 금지
      if (isGameOverRef.current) return; // [GAMEOVER]
      setPatternIdx(0);
      setStepIdx(0);
    }
  }, [combo]);

  const lastActionRef = useRef('idle');
  useEffect(() => {
    // [GAMEOVER] 게임오버면 스텝 진행 금지
    if (isGameOver) return; // [GAMEOVER]
    if (action === 'punch' && lastActionRef.current !== 'punch') {
      advanceStepOnce();
    }
    lastActionRef.current = action;
  }, [action, isGameOver]); // [GAMEOVER]

  const MOVE_META = {
    0: { label: '왼잽', color: 'red' },
    1: { label: '오잽', color: 'red' },
    2: { label: '왼어퍼', color: 'black' },
    3: { label: '오어퍼', color: 'black' },
  };

  function renderCommandSequence() {
    const current = combo[patternIdx];
    const moves = current?.moves || [];

    return (
      <div className="command-sequence">
        {moves.map((m, i) => {
          const meta = MOVE_META[m] || { label: '?', color: 'black' };
          const stateClass =
            i < stepIdx ? 'done' : i === stepIdx ? 'current' : '';
          const colorClass =
            meta.color === 'red' ? 'red' :
              meta.color === 'green' ? 'green' : 'black';
          return (
            <div key={i} className={`command-circle ${colorClass} ${stateClass}`}>
              {meta.label}
            </div>
          );
        })}
      </div>
    );
  }

  // === 기존 상태/함수 (그대로 유지) ===
  const STATE = useRef('get_ready');
  const lastActionTime = useRef(0);
  const cooldownSec = 1.0;
  const startPositions = useRef({ left: null, right: null });
  const motionTextRef = useRef(null);

  function getLandmarkXY(lm, idx, width, height) {
    const p = lm[idx];
    return [Math.round(p.x * width), Math.round(p.y * height)];
  }

  function isReadyPose(lm, width, height, mpPose) {
    const [, , , , , , , , , , , , R_SHOULDER, , , , R_WRIST] = Object.values(mpPose.PoseLandmark);
    const L_WRIST = mpPose.PoseLandmark.LEFT_WRIST;
    const R_WRIST_IDX = mpPose.PoseLandmark.RIGHT_WRIST;
    const L_ELBOW = mpPose.PoseLandmark.LEFT_ELBOW;
    const R_ELBOW = mpPose.PoseLandmark.RIGHT_ELBOW;
    const L_SHOULDER = mpPose.PoseLandmark.LEFT_SHOULDER;
    const R_SHOULDER_IDX = mpPose.PoseLandmark.RIGHT_SHOULDER;
    const NOSE = mpPose.PoseLandmark.NOSE;

    const [, noseY] = getLandmarkXY(lm, NOSE, width, height);
    const [, lwY] = getLandmarkXY(lm, L_WRIST, width, height);
    const [, rwY] = getLandmarkXY(lm, R_WRIST_IDX, width, height);
    const [, leY] = getLandmarkXY(lm, L_ELBOW, width, height);
    const [, reY] = getLandmarkXY(lm, R_ELBOW, width, height);
    const [, lsY] = getLandmarkXY(lm, L_SHOULDER, width, height);
    const [, rsY] = getLandmarkXY(lm, R_SHOULDER_IDX, width, height);

    const hand_in_guard_range =
      (noseY < lwY && lwY < lsY + 40) &&
      (noseY < rwY && rwY < rsY + 40);

    const elbows_down = (leY > lsY) && (reY > rsY);

    return hand_in_guard_range && elbows_down;
  }

  function detectMotion(startXY, nowXY, axis = 'x', threshold = 60) {
    if (!startXY || !nowXY) return [0, false];
    const diff = axis === 'x' ? (nowXY[0] - startXY[0]) : (nowXY[1] - startXY[1]);
    return [diff, Math.abs(diff) > threshold];
  }

  function classifyMotion(startXY, nowXY, hand = 'left') {
    const dx = nowXY[0] - startXY[0];
    const dy = nowXY[1] - startXY[1];
    return Math.abs(dy) > Math.abs(dx) ? `${hand} uppercut` : `${hand} jab`;
  }

  function handleUserMove(moveCode) {
    // [GAMEOVER] 게임오버 중 입력 무시
    if (isGameOverRef.current) return; // [GAMEOVER]

    const current = combo[patternIdx];
    if (!current || !Array.isArray(current.moves)) return;

    const expected = current.moves[stepIdx];

    if (moveCode === expected) {
      setStepIdx(prev => prev + 1);

      if (stepIdx + 1 >= current.moves.length) {
        setDestroyedCount(c => c + 1);
        setCoinCount(c => c + COIN_PER_BUILDING);
        setPatternIdx(prev => (prev + 1) % combo.length);
        setStepIdx(0);
      }
    } else {
      // 페널티 원하면 여기서 처리
    }
  }

  function advanceStepOnce() {
    // [GAMEOVER] 게임오버 중 스텝 진행 금지
    if (isGameOverRef.current) return; // [GAMEOVER]
    if (!Array.isArray(combo) || combo.length === 0) return;
    if (advanceLockRef.current) return;

    advanceStepOnce.lock = true;

    const current = combo[patternIdx];
    const total = (current?.moves || []).length;

    setStepIdx(prev => {
      const next = prev + 1;
      if (next >= total) {
        setPatternIdx(p => (p + 1) % combo.length);
        return 0;
      }
      return next;
    });

    setTimeout(() => { advanceLockRef.current = false; }, 250);
  }
// === [PRESTART] 10초 준비 카운트다운 ===
const READY_SECONDS = 10;                   // 준비 시간(초)
const [isPlaying, setIsPlaying] = useState(false);   // 본 게임 진행 여부
const isPlayingRef = useRef(false);                  // 콜백용 ref
const [readyLeft, setReadyLeft] = useState(READY_SECONDS);
// === [PRESTART] 카운트다운 시작 ===
useEffect(() => {
  setReadyLeft(READY_SECONDS);
  const t = setInterval(() => {
    setReadyLeft(prev => {
      if (prev <= 1) {
        clearInterval(t);
        setIsPlaying(true);
        isPlayingRef.current = true;
        // 본 게임 타이머 기준 시각 시작
        startTimeRef.current = Date.now();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(t);
}, []);
// === [PRESTART] 본 게임 타이머: isPlaying 동안만 틱 ===
useEffect(() => {
  if (!isPlaying || isGameOver) return;

  const interval = setInterval(() => {
    const now = Date.now();
    setElapsedTime(Math.floor((now - startTimeRef.current) / 1000)); // #TIMERSETTING
  }, 100);

  return () => clearInterval(interval);
}, [isPlaying, isGameOver]);




useEffect(() => {
  const remaining = Math.max(TIME_LIMIT_SEC - elapsedTime, 0);
  setTimeover(remaining);
  if (remaining === 0 && !isGameOverRef.current) {
    setIsGameOver(true);
  }
}, [elapsedTime]);

useEffect(() => {
  console.log("부서진 빌딩 배열 : " ,destroyedSeqs);
}, [destroyedSeqs]);


  /*=====================================================================================
    #002 게임 중 END
  =====================================================================================*/

  /*=====================================================================================
    #003 게임 종료
  =====================================================================================*/

  useEffect(() => {
    if (timeover === 0) {
      setIsGameOver(true);
    }
  }, [timeover]);

// 게임 종료 시 경과 시간 확인 #TIMERSETTING
useEffect(() => {
  if (isGameOver && startTimeRef.current) {
    setPlayTime(Math.floor((Date.now() - startTimeRef.current + (addTime * destroyedCount))/1000));
    console.log("최종 플레이 시간(초):", playTime);
  }
}, [isGameOver]);


/* 
  업데이트 부문 api 최신화
  1. 회원 리포트 api
  2. 회원 일별 리포트 api
  3. 골드 업데이트 api
  4. 건물 리포트 업데이트 api
*/ 

// 게임 종료 시 리포트 업데이트
useEffect(() => {
  if (!isGameOver) return;
  if (playTime == null || playTime === 0) return;     // 아직 안 계산되는거 방지
  if (didReportRef.current) return; // 중복 전송 방지
  didReportRef.current = true;

  // // 플레이 시간 계산 (초 단위)
  // const seconds =
  //   startTimeRef.current
  //     ? Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000))
  //     : 0;

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('액세스 토큰 없음 → 리포트 전송 생략');
    return;
  }

  console.log("playtime",  playTime);
  console.log("playtime",  Number((playTime / 60).toFixed(2)))


  // ReportUpdateRequestVo 구조에 맞춰 JSON body 생성
  const params = {
    singleTopBuilding: destroyedCount,
    multiTopBuilding: 0,
    goldMedal: 0,
    silverMedal: 0,
    bronzeMedal: 0,
    playCnt: 1,
    playTime: Number((playTime / 60).toFixed(2)),         
  };

  api.patch('/users/games/reportUpdates', null, {
    params,                     // ← body 대신 params
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type' 굳이 지정 안 해도 됨(쿼리스트링)
    },
  })
    .then((res) => {
      if (res.status === 200 && res.data?.isSuccess) {
        console.log('✅ 리포트 업데이트 성공', res.data);
      } else {
        console.warn('⚠️ 서버 응답 비정상', res.status, res.data);
      }
    })
    .catch((err) => {
      console.error('❌ 리포트 업데이트 실패', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
    });
}, [isGameOver, destroyedCount, playTime]);

// 일일 리포트 업데이트
useEffect(() => {
  if (!isGameOver) return;
  if (playTime == null || playTime === 0) return;     // 아직 안 계산되는거 방지
  if (didDailyReportRef.current) return;   // 중복 전송 방지
  didDailyReportRef.current = true;

  const playTimeDate = Number((playTime / 60).toFixed(2));

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('액세스 토큰 없음 → 일일 리포트 전송 생략');
    return;
  }

  api.patch(
    '/users/games/reportPerDateUpdates',
    null, 
    {
      params: {
        kcal: Math.round(kcal) ?? 0,
        playTimeDate, // number
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    },
  )
    .then((res) => {
      if (res.status === 200 && res.data?.isSuccess) {
        console.log('✅ 일일 리포트 업데이트 성공', res.data);
      } else {
        console.warn('⚠️ 일일 리포트 응답 비정상', res.status, res.data);
      }
    })
    .catch((err) => {
      console.error('❌ 일일 리포트 업데이트 실패', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
    });
}, [isGameOver, kcal, playTime]);

// 골드 업데이트
useEffect(() => {
  if (!isGameOver) return;
  if (didGoldReportRef.current) return;   // 중복 호출 방지
  didGoldReportRef.current = true;

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('액세스 토큰 없음 → 골드 업데이트 생략');
    return;
  }

  api.patch(
    '/users/games/addGoldCnt',
    null,  
    {
      params: { goldCnt: coinCount },   
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    }
  )
    .then((res) => {
      if (res.status === 200 && res.data?.isSuccess) {
        console.log('✅ 골드 업데이트 성공', res.data);
      } else {
        console.warn('⚠️ 골드 업데이트 응답 비정상', res.status, res.data);
      }
    })
    .catch((err) => {
      console.error('❌ 골드 업데이트 실패', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
    });
}, [isGameOver, coinCount]);

// 파괴한 건물 업데이트
useEffect(() => {
  if (!isGameOver) return;
  if (didConstructureSaveRef.current) return; // 중복 호출 방지
  didConstructureSaveRef.current = true;

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.warn('액세스 토큰 없음 → 건물 저장 생략');
    return;
  }

  api.post(
    '/constructures/save',
    {
      userUuid: userUuid,               // 토큰에서 꺼내는 경우엔 생략 가능
      constructureSeqList: destroyedSeqs // 부순 건물 seq 배열
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  )
    .then((res) => {
      if (res.status === 200 && res.data?.isSuccess) {
        console.log('✅ 파괴 건물 저장 성공', res.data);
      } else {
        console.warn('⚠️ 파괴 건물 저장 응답 비정상', res.status, res.data);
      }
    })
    .catch((err) => {
      console.error('❌ 파괴 건물 저장 실패', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
    });
}, [isGameOver, destroyedSeqs]);


  /*=====================================================================================
    #003 게임 종료 END
  =====================================================================================*/

  return (
    <AnimatedPage>
{/* [PRESTART] 준비 카운트다운 오버레이 */}
{!isGameOver && !isPlaying && (
  <div className="prestart-overlay">
    <div className="countdown">{readyLeft}</div>
  </div>
)}

    <div className="page-container">
      <audio ref={audioRef} src="/sounds/bgm.mp3" />
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="gameover">
          <h1>GAME OVER</h1>
          {/* [PLAYTIME] 별도 플레이 시간 표기 */}
          <div className="gamediv">
          {playTime !== null && <div className="gameovertext">플레이 시간: {playTime}초</div>}
          {destroyedCount !== null && <div className="gameovertext">부순 건물 수: {destroyedCount}개</div>}
          {kcal !== null && <div className="gameovertext">소모 칼로리: {kcal}KCAL</div>}
          {coinCount !== null && <div className="gameovertext">오늘의 일당: <img 
      src={coinImg} 
      alt="coin" 
      style={{ height: '20px', margin: '0 5px', verticalAlign: 'middle' }} 
    />{coinCount}개</div>}
          </div>
          <div className="playbutton">
          <button className="playagain" onClick={() => window.location.reload()}>다시 시작</button>
          <button className="playagain" onClick={() => window.location.href = '/main'}>나가기</button>
          </div>
          </div>
        </div>
      )}

      <div className="game-layout">
        <div className="left-game">
          <div className="overlay-ui">
            <img src={timerIcon} alt="Timer" className="timer-icon" />
            <div className="progress-bar">
              {/* [TIMER SEP] TIME_LIMIT_SEC를 기준으로 % 계산 (임의 변경에 안전) */}
              <div className="progress-fill" style={{ width: `${(timeover / TIME_LIMIT_SEC) * 100}%` }}></div>
            </div>
            <div className="overlay-ui1">
              {renderCommandSequence()}
            </div>
          </div>

          <PixiCanvas
            action={action}
            building={currentBuilding}
            playerSkin={playerSkin}
            combo={combo}
            onBuildingDestroyed={(seq) => {
              // [GAMEOVER] 게임오버 중 파괴 처리/카운트 증가 금지
              if (isGameOverRef.current) return; // [GAMEOVER]
              if (seq) setDestroyedSeqs(prev => [...prev, seq]);  // seq 저장
              setBuildingIndex((prev) =>
                buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
              );
              setDestroyedCount((c) => c + 1);
              setCoinCount((c) => c + COIN_PER_BUILDING);
              // 보너스 addTime 에 따라 증가
              if (startTimeRef.current) {
                startTimeRef.current += addTime; //#TIMERSETTING
              }
            }}
            setKcal={(val) => {
              // [GAMEOVER] 게임오버 중 칼로리 업데이트 금지
              if (isGameOverRef.current) return; // [GAMEOVER]
              setKcal(val);
            }}
            showBuildingHp={true}
          />
        </div>

        <div className="right-panel">
          <div className="kcal-display">{kcal} KCAL</div>
          <div className="building-status">🏢 부순 건물: {destroyedCount}</div>
          <div className="coin-status">💰 코인: {coinCount}</div>

          {/* [GAMEOVER] QUIT 버튼으로 즉시 종료 */}
          <button className="quit-button" onClick={() => setIsGameOver(true)}>QUIT</button> {/* [GAMEOVER] */}

          <div className="webcam-container mirror">
            <video ref={videoRef} autoPlay muted className="webcam-video" />
            <canvas ref={canvasRef} className="webcam-canvas" width="640" height="480"></canvas>
          </div>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default SingleTestPage;
