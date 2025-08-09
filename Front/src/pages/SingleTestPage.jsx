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
*/

const SingleTestPage = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [userUuid, setUserUuid] = useState("");

  // 게임
  const [action, setAction] = useState('idle');
  const [timeover, setTimeover] = useState(100);
  const [kcal, setKcal] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [destroyedCount, setDestroyedCount] = useState(0);

  // 빌딩/콤보
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [combo, setCombo] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [destroyedSeqs, setDestroyedSeqs] = useState([]);
  const COIN_PER_BUILDING = 1;

  // 콤보(패턴)
  const [patternIdx, setPatternIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const advanceLockRef = useRef(false);

  // === 미디어/포즈 공용 ref ===
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediapipeCameraRef = useRef(null);

  // FSM & 좌표/필터
  const fsmStateRef = useRef('get_ready');          // 'get_ready' | 'action' | 'cooldown'
  const startPosRef = useRef({ left: null, right: null });
  const startShoulderRef = useRef({ left: null, right: null });
  const lastActionAtRef = useRef(0);

  const lPrevRef = useRef({ x: 0, y: 0, init: false });
  const rPrevRef = useRef({ x: 0, y: 0, init: false });
  const lFiltRef = useRef({ x: 0, y: 0, init: false });
  const rFiltRef = useRef({ x: 0, y: 0, init: false });
  const lOverCntRef = useRef(0);
  const rOverCntRef = useRef(0);
  const lastTsRef = useRef(0);

  // 튜닝 포인트
  const EMA_ALPHA = 0.5;
  const HIT_MIN_FRAMES = 3;
  const COOLDOWN_SEC = 0.6;

  // Mediapipe 인덱스
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
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  /* ================================ #init ================================ */

  // 카메라 시작
  const startCamera = async () => {
    if (mediapipeCameraRef.current || (videoRef.current && videoRef.current.srcObject)) {
      return;
    }
    // 1) 로컬 카메라
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
      audio: false,
    });
    mediaStreamRef.current = stream;

    const videoEl = videoRef.current;
    videoEl.srcObject = stream;
    videoEl.muted = true;
    videoEl.playsInline = true;
    await new Promise(res => videoEl.onloadedmetadata = res);
    const canvasEl = canvasRef.current;
    if (canvasEl) {
      canvasEl.width = videoEl.videoWidth || 640;
      canvasEl.height = videoEl.videoHeight || 480;
    }
    await videoEl.play().catch(() => {});

    // 2) MediaPipe Pose
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

    // ── 감지 로직: 잽/어퍼 구분 → action = 'left_jab' | 'right_uppercut' 등 ──
    pose.onResults((results) => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const lm = results.poseLandmarks;
      if (!lm) {
        fsmStateRef.current = 'get_ready';
        setAction('idle');
        return;
      }

      // (원하면 시각화) 
      // drawLandmarks(ctx, lm, { color: '#FF0000', radius: 3 });

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
        let lHitKind = null;
        const lJabCand   = (Math.abs(ldx) > JAB_X_TH || (lWS - lWS0) > JAB_DIST_GAIN)
                            && Math.abs(ldy) < JAB_FLAT_Y_MAX
                            && Math.abs(lvx) > VEL_X_TH;
        const lUpperCand = (-ldy) > UPP_Y_TH
                            && Math.abs(ldy) > Math.abs(ldx) * UPP_DOM_RATIO
                            && (-lvy) > VEL_Y_TH;
        if (lJabCand || lUpperCand) {
          lOverCntRef.current++;
          if (lOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
            lHitKind = lJabCand ? 'left_jab' : (lUpperCand ? 'left_uppercut' : null);
          }
        } else {
          lOverCntRef.current = Math.max(0, lOverCntRef.current - 1);
        }

        // 오른손 판정
        let rHitKind = null;
        const rJabCand   = (Math.abs(rdx) > JAB_X_TH || (rWS - rWS0) > JAB_DIST_GAIN)
                            && Math.abs(rdy) < JAB_FLAT_Y_MAX
                            && Math.abs(rvx) > VEL_X_TH;
        const rUpperCand = (-rdy) > UPP_Y_TH
                            && Math.abs(rdy) > Math.abs(rdx) * UPP_DOM_RATIO
                            && (-rvy) > VEL_Y_TH;
        if (rJabCand || rUpperCand) {
          rOverCntRef.current++;
          if (rOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
            rHitKind = rJabCand ? 'right_jab' : (rUpperCand ? 'right_uppercut' : null);
          }
        } else {
          rOverCntRef.current = Math.max(0, rOverCntRef.current - 1);
        }

        // 트리거
        if (lHitKind || rHitKind) {
          const motion = lHitKind || rHitKind;
          setAction(motion);
          // 다음 프레임에 idle로 복귀 (PixiCanvas 내부 애니메 재생 후 종료용)
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

    // 3) MediaPipe Camera
    const cam = new Camera(videoEl, {
      onFrame: async () => {
        try {
          await pose.send({ image: videoEl });
        } catch {}
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
    (async () => {
      try { await startCamera(); } catch (e) { console.error('카메라 시작 실패:', e); }
    })();
    return () => { stopCamera(); };
  }, []);

  // #init01 BGM
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  /* ============================ #001 게임 시작 전 ============================ */

  const [buildingList, setBuildingList] = useState([]);
  const currentBuilding = buildingList[buildingIndex] ?? null;
  const [playerSkin, setPlayerSkin] = useState("");

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const { data, status } = await api.get('/constructures/generate', {
          params: { count: 50 },
        });
        if (status !== 200 || !data.isSuccess) throw new Error(data.message || `HTTP ${status}`);
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
        if (data?.result?.userUuid) {
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

  /* ============================ #002 게임 중 ============================ */

  // 타이머(펀치 중이 아닐 때 감소) — action이 *_jab/*_uppercut이어도 감소시킬 거면 아래 조건 유지
  useEffect(() => {
    const interval = setInterval(() => {
      if (action !== 'punch') {
        setTimeover((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [action]);

  // 콤보 새로 불러오면 인덱스 초기화
  useEffect(() => {
    if (Array.isArray(combo) && combo.length > 0) {
      setPatternIdx(0);
      setStepIdx(0);
    }
  }, [combo]);

  // 액션에 따라 스텝 진행: punch 뿐 아니라 *_jab/*_uppercut도 허용
  const lastActionRef = useRef('idle');
  useEffect(() => {
    const isHit =
      action === 'punch' ||
      (typeof action === 'string' && (action.endsWith('_jab') || action.endsWith('_uppercut')));

    if (isHit && lastActionRef.current !== action) {
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

  function advanceStepOnce() {
    if (!Array.isArray(combo) || combo.length === 0) return;
    if (advanceLockRef.current) return;
    advanceLockRef.current = true;

    const current = combo[patternIdx];
    const total = (current?.moves || []).length;

    setStepIdx(prev => {
      const next = prev + 1;
      if (next >= total) {
        setDestroyedCount(c => c + 1);
        setCoinCount(c => c + COIN_PER_BUILDING);
        setPatternIdx(p => (p + 1) % combo.length);
        return 0;
      }
      return next;
    });

    setTimeout(() => { advanceLockRef.current = false; }, 250);
  }

  /* ============================ #003 게임 종료 ============================ */

  useEffect(() => {
    if (timeover === 0) setIsGameOver(true);
  }, [timeover]);

  /* ============================ Render ============================ */

  const [buildingListState] = [buildingList]; // (디버깅 로깅 원하면 사용)

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

            {/* 동적 콤보 시퀀스 표시 */}
            {renderCommandSequence()}
          </div>

          <PixiCanvas
            action={action}
            building={currentBuilding}
            playerSkin={playerSkin}
            combo={combo}
            onBuildingDestroyed={(seq) => {
              if (seq) setDestroyedSeqs(prev => [...prev, seq]);
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
