import React, { useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { Pose } from '@mediapipe/pose';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawRectangle, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import PixiCanvas from '../components/pixi/PixiCanvas';
import "../styles/SingleTestPage.css";

const SingleTestPage = () => {
  const canvasRef = useRef(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [action, setAction] = useState('idle');
  const [health, setHealth] = useState(100);
  const OV = useRef(null);
  const localUserRef = useRef(null);
  const [buildingIndex, setBuildingIndex] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [kcal, setKcal] = useState(0);  // ✅ 이 줄이 있어야 함
  const audioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (action !== 'punch') {
        setHealth(prev => Math.max(prev - 1, 0));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [action]);

  const getToken = async () => {
    const response = await fetch('http://localhost:5000/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'TestSession' }),
    });
    const data = await response.json();
    return data.token;
  };

  const joinSession = async () => {
    OV.current = new OpenVidu();
    const newSession = OV.current.initSession();

    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) =>
        prev.filter((sub) => sub !== event.stream.streamManager)
      );
    });

    const token = await getToken();
    await newSession.connect(token, { clientData: 'User' });

    const newPublisher = OV.current.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 60,
      insertMode: 'APPEND',
      mirror: false,
    });

    newSession.publish(newPublisher);
    setPublisher(newPublisher);
    setSession(newSession);

    newPublisher.addVideoElement(localUserRef.current);
  };

  const leaveSession = () => {
    if (session) session.disconnect();
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    OV.current = null;
  };

  useEffect(() => {
    if (!session || !localUserRef.current || !canvasRef.current) return;

    const videoElement = localUserRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

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
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      const landmarks = results.poseLandmarks;
      if (!landmarks) {
        setAction('idle');
        return;
      }

      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', radius: 3 });

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
        console.log('잽 감지!');
        setAction('punch');
        motionCooldown = true;

        setTimeout(() => {
          motionCooldown = false;
          setAction('idle');
        }, 1000);
      }

      lastRightWrist = { ...rightWrist };
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        try {
          await pose.send({ image: videoElement });
        } catch (err) {
          console.error('MediaPipe 처리 중 에러', err);
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    return () => {
      camera.stop();
    };
  }, [session]);

  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, []);

  useEffect(() => {
    if (health === 0) {
      setIsGameOver(true);
      console.log("🛑 Game Over!");
    }
  }, [health]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // 볼륨 설정 (0.0 ~ 1.0)
      audioRef.current.loop = true; // 반복재생
      audioRef.current.play().catch((err) => {
        console.warn("자동재생 차단됨. 유저 상호작용 후 재생 필요", err);
      });
    }
  }, []);
  
  return (
    <div className="page-container">
      {/* 🔊 오디오 태그 추가 */}
      <audio ref={audioRef} src="/sounds/bgm.mp3" />
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>GAME OVER</h1>
          <button onClick={() => window.location.reload()}>다시 시작</button>
        </div>
      )}

      <div className="top-controls">
        <h1>OpenVidu + MediaPipe 얼굴 감지</h1>
        <div className="buttons">
          <button onClick={joinSession}>세션 참가</button>
          <button onClick={leaveSession}>세션 종료</button>
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
              setHealth(prev => Math.min(prev + 30, 100)); // 체력 회복
              setBuildingIndex(prev => (prev + 1) % 3);    // 다음 건물 (3개 순환)
            }}
            setKcal={setKcal}
          />
        </div>

        <div className="right-panel">
          <div className="kcal-display">{kcal} KCAL</div>

          {/* 🔽 여기 추가 🔽 */}
          <div className="building-status">🏢 부순 건물: {buildingIndex}</div>
          <div className="coin-status">💰 코인: {buildingIndex * 1}</div> {/* 예: 건물당 5코인 가정 */}

          <div className="pixel-character"></div>
          <button className="quit-button">QUIT</button>
          <div className="webcam-container">
            <video ref={localUserRef} autoPlay muted className="webcam-video" />
            <canvas ref={canvasRef} className="webcam-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestPage;