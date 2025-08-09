import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import PixiCanvas from '../components/pixi/PixiCanvas';
import api from '../utils/api';
import "../styles/SingleTestPage.css";

/*
  소주 땡기노 인생 별거 있나.. 해보자
  2025.08.09 : 콤보 깨는거 협업필요해서 일단 보류 일요일 진행

#init
  0. 초기 세팅
    - 카메라 세팅 (완)       
    - mediaPipe 세팅 (완)   
    - 브금 세팅            ************ 이거 유빈이가 알아본다 해서 보류 여기다 해줘 Cntrl + F #init01
#001
  1. 게임 시작 전
    - 건물 리스트 뽑아오기 (완)                        
    - AccessToken 으로 사용자 skin 가져오기 (완)       
      >> 캔버스에 할당[output] (완)                    
      >> 플레이어 스킨 하드 코딩 연동하기 (시간 부족으로 하드코딩 하기로 협의 함) (완)
    - 콤보 할당 받기 (완)
      >> 백개가 들어오는데 순환 하기
    
      

#002
  2. 게임 플레이
    - 미디어 파이프 이식 (완) 
    - 건물 적용 (완) 
    - 건물 hp 적용 
    - 스킨 적용
    - quit 만들기 해줘.. 
    - 흠..
    - (캔버스에)[input] { action, buildingIndex, buildingList, playerSkin, onBuildingDestroyed, kcal, setKcal, combo }
    - combo 100개 다 끝나면 인덱스 초기화 
    - 빌딩 부술때 마다 배열에 빌딩 키 추가 
    - 플레이 시간 계산 추가
    
  
#003
  3. 게임 종료
    - 최신 화 정보 갱신
      - GAMEOVER 페이지에 뿌려주기
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
  const [timeover, setTimeover] = useState(100);            // 시간이였음
  const [kcal, setKcal] = useState(0);                      // 칼로리
  const [coinCount, setCoinCount] = useState(0);            // 코인 수
  const [destroyedCount, setDestroyedCount] = useState(0);  // 부순 건물 수

  // 빌딩
  const [buildingIndex, setBuildingIndex] = useState(0);    // 빌딩 인덱스
  const [combo, setCombo] = useState([]);                   // 유저 콤보
  const [isGameOver, setIsGameOver] = useState(false);      // 게임오버 트리거
  // 추가: 부순 건물 seq 리스트
  const [destroyedSeqs, setDestroyedSeqs] = useState([]);
  // const currentBuilding = buildingList[buildingIndex] ?? null;

  const COIN_PER_BUILDING = 1;

  // 콤보(패턴)
  const [patternIdx, setPatternIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const advanceLockRef = useRef(false);

  /* ================== [ADDED] 미디어파이프 감지용 공용 ref/상수 ================== */
  const audioRef = useRef(null);                 // [ADDED] 상단으로 이동 (startCamera 전에 필요)
  const mediaStreamRef = useRef(null);           // [ADDED]
  const mediapipeCameraRef = useRef(null);       // [ADDED]

  const fsmStateRef = useRef('get_ready');       // [ADDED] 'get_ready' | 'action' | 'cooldown'
  const startPosRef = useRef({ left: null, right: null });            // [ADDED] 손목 시작 좌표
  const startShoulderRef = useRef({ left: null, right: null });       // [ADDED] 어깨 기준 좌표
  const lastActionAtRef = useRef(0);                                    // [ADDED]

  // 속도/안정화 필터
  const lPrevRef = useRef({ x: 0, y: 0, init: false });    // [ADDED]
  const rPrevRef = useRef({ x: 0, y: 0, init: false });    // [ADDED]
  const lFiltRef = useRef({ x: 0, y: 0, init: false });    // [ADDED]
  const rFiltRef = useRef({ x: 0, y: 0, init: false });    // [ADDED]
  const lOverCntRef = useRef(0);                           // [ADDED]
  const rOverCntRef = useRef(0);                           // [ADDED]
  const lastTsRef = useRef(0);                             // [ADDED]

  // 튜닝 포인트
  const EMA_ALPHA = 0.5;       // [ADDED] 0.5~0.7 추천
  const HIT_MIN_FRAMES = 3;    // [ADDED] 연속 프레임 확증
  const COOLDOWN_SEC = 0.6;    // [ADDED] 감지 후 쿨다운

  // Mediapipe 인덱스 (정규화 좌표)
  const NOSE = 0, LS = 11, RS = 12, LE = 13, RE = 14, LW = 15, RW = 16; // [ADDED]

  // 가드 자세 판정(정규화 y)
  function isReadyPoseNorm(lm) {                                   // [ADDED]
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
    if (mediapipeCameraRef.current || (videoRef.current && videoRef.current.srcObject)) { // [ADDED] 중복 가드
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
    await new Promise(res => videoEl.onloadedmetadata = res);                // [MOD] 메타 로드 보장
    const canvasEl = canvasRef.current;                                      // [MOD]
    if (canvasEl) {
      canvasEl.width = videoEl.videoWidth || 640;                            // [MOD]
      canvasEl.height = videoEl.videoHeight || 480;                          // [MOD]
    }
    await videoEl.play().catch(() => { /* 자동재생 차단 시 버튼 한번 더 눌러야 할 수 있음 */ });

    // 2) MediaPipe Pose 설정
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    /* =================== [MOD] 감지 로직 전면 교체 (안정화 + 잽/어퍼) =================== */
    pose.onResults((results) => {
      const videoEl = videoRef.current;
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const lm = results.poseLandmarks;
      if (!lm) {
        fsmStateRef.current = 'get_ready';
        setAction('idle');
        return;
      }

      // (원하면 켜기) drawLandmarks(ctx, lm, { color: '#FF0000', radius: 3 }); // [KEPT OFF]

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
          setAction('punch');                       // [MOD] 기존 로직과 호환 유지 (자세히 쓰려면 여기서 매핑)
          setTimeout(() => setAction('idle'), 0);

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
        try {
          await pose.send({ image: videoEl });
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

  // #init01 BGM
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }
  }, []);

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

  // const audioRef = useRef(null);            // [REMOVED] 중복 선언 방지 (상단으로 이동)
  // const mediaStreamRef = useRef(null);      // [REMOVED]
  // const mediapipeCameraRef = useRef(null);  // [REMOVED]

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const { data, status } = await api.get('/constructures/generate', {
          params: { count: 50 },
        });
        if (status !== 200 || !data.isSuccess) {
          throw new Error(data.message || `HTTP ${status}`);
        }
        setBuildingList(data.result);
      } catch (err) {
        console.error('건물 리스트 로드 실패:', err);
      }
    };
    fetchBuildings();
  }, []);

  useEffect(() => {
    const fetchSkin = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data: skinData } = await api.get('/skins/getSkin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayerSkin(skinData.result);
      } catch (err) {
        console.error('플레이어스킨 로드 실패:', err);
      }
    };
    fetchSkin();
  }, []);

  useEffect(() => {
    const fetchGameCombo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data, status } = await api.get('users/games/generate/numeric', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (status === 200) {
          setCombo(Array.isArray(data?.patterns) ? data.patterns : []);
        } else {
          console.warn('응답 상태 비정상:', status);
        }
      } catch (error) {
        console.error('게임 패턴 로드 실패:', error);
      }
    };
    fetchGameCombo();
  }, []);

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
          setUserUuid(data.result.userUuid);
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
    const interval = setInterval(() => {
      if (action !== 'punch') {
        setTimeover((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [action]);

  useEffect(() => {
    if (Array.isArray(combo) && combo.length > 0) {
      setPatternIdx(0);
      setStepIdx(0);
    }
  }, [combo]);

  const lastActionRef = useRef('idle');
  useEffect(() => {
    if (action === 'punch' && lastActionRef.current !== 'punch') {
      advanceStepOnce();
    }
    lastActionRef.current = action;
  }, [action]);

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
    if (!Array.isArray(combo) || combo.length === 0) return;
    if (advanceLockRef.current) return;

    advanceLockRef.current = true;

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

  /*=====================================================================================
    #003 게임 종료 END
  =====================================================================================*/

  return (
    <div className="page-container">
      <audio ref={audioRef} src="/sounds/bgm.mp3" />
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>GAME OVER</h1>
          <button onClick={() => window.location.reload()}>다시 시작</button>
        </div>
      )}

      <div className="game-layout">
        <div className="left-game">
          <div className="overlay-ui">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${timeover}%` }}></div>
            </div>
            <div className="overlay-ui">
              {renderCommandSequence()}
            </div>
          </div>

          <PixiCanvas
            action={action}
            building={currentBuilding}
            playerSkin={playerSkin}
            combo={combo}
            onBuildingDestroyed={(seq) => {
              if (seq) setDestroyedSeqs(prev => [...prev, seq]);  // seq 저장
              setBuildingIndex((prev) =>
                buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
              );
              setDestroyedCount((c) => c + 1);
              setCoinCount((c) => c + COIN_PER_BUILDING);
            }}
            setKcal={setKcal}
            showBuildingHp={false}
          />
        </div>

        <div className="right-panel">
          <div className="kcal-display">{kcal} KCAL</div>
          <div className="building-status">🏢 부순 건물: {destroyedCount}</div>
          <div className="coin-status">💰 코인: {coinCount}</div>

          <button className="quit-button">QUIT</button>

          <div className="webcam-container">
            <video ref={videoRef} autoPlay muted className="webcam-video" />
            <canvas ref={canvasRef} className="webcam-canvas" width="640" height="480"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestPage;
