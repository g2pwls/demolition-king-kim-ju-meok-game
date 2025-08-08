import React, { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import PixiCanvas from '../components/pixi/PixiCanvas';
import "../styles/SingleTestPage.css";

const SingleTestPage = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [action, setAction] = useState('idle');
  const [health, setHealth] = useState(100);
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [kcal, setKcal] = useState(0);

  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediapipeCameraRef = useRef(null);

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

    let lastRightWrist = null;
    let motionCooldown = false;

    pose.onResults((results) => {
      const canvasEl = canvasRef.current;
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      const landmarks = results.poseLandmarks;
      if (!landmarks) {
        setAction('idle');
        return;
      }

      drawLandmarks(ctx, landmarks, { color: '#FF0000', radius: 3 });

      const rightWrist = landmarks[16];
      const rightShoulder = landmarks[12];
      if (!rightWrist || !rightShoulder) return;

      if (!lastRightWrist) {
        lastRightWrist = { ...rightWrist };
        return;
      }

      const movedForward = lastRightWrist.x - rightWrist.x > 0.07;
      const aboveShoulder = rightWrist.y < rightShoulder.y;

      if (movedForward && aboveShoulder && !motionCooldown) {
        setAction('punch');
        motionCooldown = true;
        setTimeout(() => {
          motionCooldown = false;
          setAction('idle');
        }, 1000);
      }

      lastRightWrist = { ...rightWrist };
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
            <div className="command-sequence">
              <div className="command-circle red">잽</div>
              <div className="command-circle green">회피</div>
              <div className="command-circle black">어퍼</div>
              <div className="command-circle red">잽</div>
              <div className="command-circle red">잽</div>
              <div className="command-circle red">잽</div>
              <div className="command-circle green">회피</div>
              <div className="command-circle black">어퍼</div>
            </div>
          </div>

          <PixiCanvas
            action={action}
            buildingIndex={buildingIndex}
            onBuildingDestroyed={() => {
              setHealth((prev) => Math.min(prev + 30, 100)); // 체력 회복
              setBuildingIndex((prev) => (prev + 1) % 3);    // 다음 건물 (3개 순환)
            }}
            setKcal={setKcal}
          />
        </div>

        <div className="right-panel">
          <div className="kcal-display">{kcal} KCAL</div>
          <div className="building-status">🏢 부순 건물: {buildingIndex}</div>
          <div className="coin-status">💰 코인: {buildingIndex * 1}</div>

          <div className="pixel-character"></div>
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
