import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import PixiCanvas from '../components/pixi/PixiCanvas';
import punchImg from '../assets/images/singlemode/punch.png';
import upperImg from '../assets/images/singlemode/upper.png';
import dodgeImg from '../assets/images/singlemode/dodge.png';
import combobImg from '../assets/images/singlemode/combob.png';
import "../styles/SingleTestPage.css";

const SingleTestPage = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [action, setAction] = useState('idle');
  const [health, setHealth] = useState(100);
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [kcal, setKcal] = useState(0);
  const [destroyedCount, setDestroyedCount] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const COIN_PER_BUILDING = 1;

  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediapipeCameraRef = useRef(null);
  
// === 추가: 속도·시작어깨 기록용 ===
  const lPrevRef = useRef({ x: 0, y: 0, init: false });
  const rPrevRef = useRef({ x: 0, y: 0, init: false });
  const lastTsRef = useRef(0);


  const fsmStateRef = useRef('get_ready');
  const startPosRef = useRef({ left: null, right: null });
  // 시작 시점 어깨 좌표(가드 기준) 저장
  const startShoulderRef = useRef({ left: null, right: null });

  const lastActionAtRef = useRef(0);
  // === 감지 안정화용 추가 ===
  const lFiltRef = useRef({ x: 0, y: 0, init: false }); // 왼손 EMA
  const rFiltRef = useRef({ x: 0, y: 0, init: false }); // 오른손 EMA
  const lOverCntRef = useRef(0); // 왼손 연속 프레임 카운터
  const rOverCntRef = useRef(0); // 오른손 연속 프레임 카운터

// 튜닝 포인트
  const EMA_ALPHA = 0.5;        // 0.5~0.7 추천 (클수록 더 부드러움 = 반응은 살짝 느려짐)
  const HIT_MIN_FRAMES = 3;     // 2~5 추천 (연속 프레임 개수)
  const COOLDOWN_SEC = 0.6;     // 기존 1.0에서 살짝 줄여 반응성 ↑



  const NOSE = 0, LS = 11, RS = 12, LE = 13, RE = 14, LW = 15, RW = 16;
  
  function isReadyPose(lm) {
  const noseY = lm[NOSE].y;
  const LwY = lm[LW].y;
  const RwY = lm[RW].y;
  const LeY = lm[LE].y;
  const ReY = lm[RE].y;
  const LsY = lm[LS].y;
  const RsY = lm[RS].y;

  // 코~어깨 사이에 손목 / 팔꿈치는 어깨보다 아래
  const shoulderBand = 0.08; // 어깨 위 여유
  const handInGuard =
    noseY < LwY && LwY < (LsY + shoulderBand) &&
    noseY < RwY && RwY < (RsY + shoulderBand);
  const elbowsDown = LeY > LsY && ReY > RsY;
  return handInGuard && elbowsDown;
}



  function classifyMotion(start, now, hand /* 'left' | 'right' */) {
    const dx = now.x - start.x;
    const dy = now.y - start.y;
  // 파이썬 로직 그대로: 수직 성분이 더 크면 어퍼컷, 아니면 잽
    const isUppercut = Math.abs(dy) > Math.abs(dx) && dy < -0.06; // 위로 6% 이상
    const kind = isUppercut ? 'uppercut' : 'jab';
    return `${hand}_${kind}`; // e.g. 'left_jab', 'right_uppercut'
}

  // 체력 자연 감소
  useEffect(() => {
    const interval = setInterval(() => {
      if (action !== 'punch') {
        setHealth((prev) => Math.max(prev - 1, 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [action]);

  // 카메라 시작
  const startCamera = async () => {
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

   

   pose.onResults((results) => {
  const canvasEl = canvasRef.current;
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  const lm = results.poseLandmarks;
  if (!lm) {
    // 포즈 끊기면 초기화
    fsmStateRef.current = 'get_ready';
    setAction('idle');
    return;
  }

  // (선택) 시각화 유지
  drawLandmarks(ctx, lm, { color: '#FF0000', radius: 3 });

  const now = performance.now() / 1000; // 초 단위

  // 1) 준비 상태: 가드 자세가 되면 손목 시작점 저장 후 action으로
  if (fsmStateRef.current === 'get_ready') {
    if (isReadyPose(lm)) {
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
      lastTsRef.current = performance.now() / 1000;

    // 카운터 리셋
      lOverCntRef.current = 0;
      rOverCntRef.current = 0;

      fsmStateRef.current = 'action';
  }
  return;
}


  // 2) 액션 상태: 왼손/오른손 각각 이동량 체크
  if (fsmStateRef.current === 'action') {
  // 시간/속도 계산
  const nowSec = performance.now() / 1000;
  let dt = nowSec - (lastTsRef.current || nowSec);
  if (dt <= 0 || dt > 0.2) dt = 0.016; // 프레임 끊김 보호
  lastTsRef.current = nowSec;

  // 1) 사람 크기 기준 (어깨폭)
  const shoulderDist = Math.abs(lm[LS].x - lm[RS].x);

  // === 임계값 (조정됨) ===
  // 잽: 수평 강하게 + 수직 흔들림은 작게 + 수평 속도 존재
  const JAB_X_TH       = 0.22 * shoulderDist;
  const JAB_FLAT_Y_MAX = 0.22 * shoulderDist;
  const JAB_DIST_GAIN  = 0.18 * shoulderDist;
  const VEL_X_TH       = 0.04 * shoulderDist / Math.max(dt, 1e-3);


  // 어퍼: 위로 크게 + 수직 우세 + 수직 속도 존재
  const UPP_Y_TH      = 0.33 * shoulderDist;
  const UPP_DOM_RATIO = 1.70;
  const VEL_Y_TH      = 0.06 * shoulderDist / Math.max(dt, 1e-3);
  // 2) 현재값 + EMA
  const lNowRaw = { x: lm[LW].x, y: lm[LW].y };
  const rNowRaw = { x: lm[RW].x, y: lm[RW].y };
  if (!lFiltRef.current.init) {
    lFiltRef.current = { ...lNowRaw, init: true };
    rFiltRef.current = { ...rNowRaw, init: true };
  }
  const alpha = EMA_ALPHA;
  lFiltRef.current.x = alpha * lNowRaw.x + (1 - alpha) * lFiltRef.current.x;
  lFiltRef.current.y = alpha * lNowRaw.y + (1 - alpha) * lFiltRef.current.y;
  rFiltRef.current.x = alpha * rNowRaw.x + (1 - alpha) * rFiltRef.current.x;
  rFiltRef.current.y = alpha * rNowRaw.y + (1 - alpha) * rFiltRef.current.y;

  const lNow = lFiltRef.current;
  const rNow = rFiltRef.current;

  const lStart = startPosRef.current.left;
  const rStart = startPosRef.current.right;
  const lSh0   = startShoulderRef.current.left;
  const rSh0   = startShoulderRef.current.right;
  if (!lStart || !rStart || !lSh0 || !rSh0) return; // 안전장치

  // 3) 변위
  const ldx = lNow.x - lStart.x, ldy = lNow.y - lStart.y;
  const rdx = rNow.x - rStart.x, rdy = rNow.y - rStart.y;

  // 4) 속도 (직전 EMA 좌표와의 차이)
  if (!lPrevRef.current.init) lPrevRef.current = { ...lNow, init: true };
  if (!rPrevRef.current.init) rPrevRef.current = { ...rNow, init: true };
  const lvx = (lNow.x - lPrevRef.current.x) / dt;
  const lvy = (lNow.y - lPrevRef.current.y) / dt;
  const rvx = (rNow.x - rPrevRef.current.x) / dt;
  const rvy = (rNow.y - rPrevRef.current.y) / dt;
  // 업데이트
  lPrevRef.current = { ...lNow, init: true };
  rPrevRef.current = { ...rNow, init: true };

  // 5) 손목-어깨 거리 증가(잽 보조)
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const lWS0 = dist(lStart, lSh0);
  const rWS0 = dist(rStart, rSh0);
  const lWS  = dist(lNow,   lSh0);
  const rWS  = dist(rNow,   rSh0);

  // 6) 후보 조건
  // 왼손
  let lHitKind = null;
  const lJabCand   = (Math.abs(ldx) > JAB_X_TH || (lWS - lWS0) > JAB_DIST_GAIN)
                      && Math.abs(ldy) < JAB_FLAT_Y_MAX
                      && Math.abs(lvx) > VEL_X_TH;
  const lUpperCand = (-ldy) > UPP_Y_TH
                      && Math.abs(ldy) > Math.abs(ldx) * UPP_DOM_RATIO
                      && (-lvy) > VEL_Y_TH;

  const lMovedAny = lJabCand || lUpperCand;
  if (lMovedAny) {
    lOverCntRef.current++;
    if (lOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
      // 동시충족 시 잽 우선
      lHitKind = lJabCand ? 'left_jab' : (lUpperCand ? 'left_uppercut' : null);
    }
  } else {
    lOverCntRef.current = Math.max(0, lOverCntRef.current - 1);
  }

  // 오른손
  let rHitKind = null;
  const rJabCand   = (Math.abs(rdx) > JAB_X_TH || (rWS - rWS0) > JAB_DIST_GAIN)
                      && Math.abs(rdy) < JAB_FLAT_Y_MAX
                      && Math.abs(rvx) > VEL_X_TH;
  const rUpperCand = (-rdy) > UPP_Y_TH
                      && Math.abs(rdy) > Math.abs(rdx) * UPP_DOM_RATIO
                      && (-rvy) > VEL_Y_TH;

  const rMovedAny = rJabCand || rUpperCand;
  if (rMovedAny) {
    rOverCntRef.current++;
    if (rOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
      rHitKind = rJabCand ? 'right_jab' : (rUpperCand ? 'right_uppercut' : null);
    }
  } else {
    rOverCntRef.current = Math.max(0, rOverCntRef.current - 1);
  }

  // 7) 트리거
  if (lHitKind || rHitKind) {
    const motion = lHitKind || rHitKind;
    console.log('DETECTED:', motion);

    setAction(motion);
    setTimeout(() => setAction('idle'), 0);

    lastActionAtRef.current = nowSec;
    fsmStateRef.current = 'cooldown';

    // 리셋
    lOverCntRef.current = 0;
    rOverCntRef.current = 0;
    return;
  }

  return; // 아직 미확정
}




  // 3) 쿨다운
  if (fsmStateRef.current === 'cooldown') {
    if (now - lastActionAtRef.current > COOLDOWN_SEC) {
      fsmStateRef.current = 'get_ready';
    }
    return;
  }
});


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

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 게임오버 체크
  useEffect(() => {
    if (health === 0) {
      setIsGameOver(true);
      // console.log("🛑 Game Over!");
    }
  }, [health]);

  // BGM
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="page-container">
      <audio ref={audioRef} src="/sounds/bgm.mp3" />
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>GAME OVER</h1>
          <button onClick={() => window.location.reload()}>다시 시작</button>
        </div>
      )}

      <div className="top-controls">
        <h1>싱글모드: 로컬 카메라 + MediaPipe</h1>
        <div className="buttons">
          <button onClick={startCamera}>카메라 시작</button>
          <button onClick={stopCamera}>카메라 종료</button>
        </div>
      </div>

      <div className="game-layout">
        <div className="left-game">
          <div className="overlay-ui">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${health}%` }}></div>
            </div>
            <div className="combob-bg" style={{ backgroundImage: `url(${combobImg})` }}>
            <div className="command-sequence">
              <div className="command-circle red" style={{ backgroundImage: `url(${punchImg})` }} />
              <div className="command-circle green" style={{ backgroundImage: `url(${dodgeImg})` }} />
              <div className="command-circle black" style={{ backgroundImage: `url(${upperImg})` }} />
              <div className="command-circle red" style={{ backgroundImage: `url(${punchImg})` }} />
              <div className="command-circle red" style={{ backgroundImage: `url(${punchImg})` }} />
              <div className="command-circle red" style={{ backgroundImage: `url(${punchImg})` }} />
              <div className="command-circle green" style={{ backgroundImage: `url(${dodgeImg})` }} />
              <div className="command-circle black" style={{ backgroundImage: `url(${upperImg})` }} />
            </div>
            </div>
          </div>

          <PixiCanvas
            action={action}
            buildingIndex={buildingIndex}
            onBuildingDestroyed={() => {
              setHealth((prev) => Math.min(prev + 30, 100)); // 체력 회복
              setBuildingIndex((prev) => (prev + 1) % 3);
              setDestroyedCount((c) => c + 1); 
              setCoinCount((c) => c + COIN_PER_BUILDING);   // 다음 건물 (3개 순환)
            }}
            setKcal={setKcal}
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
