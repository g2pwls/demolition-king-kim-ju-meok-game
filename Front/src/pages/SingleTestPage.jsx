import React, { useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { Pose } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import '../styles/SingleTestPage.css';
import ComboSequence from '../components/ui/ComboSequence';
import comboBg from '../assets/images/singlemode/combob.png';
import characterImg from '../assets/images/character/character.png';
import buildingImg from '../assets/images/building/building1.png';
import PixiGame from '../components/PixiGame';

const poseList = ['잽', '회피', '어퍼'];

// const ComboSequence = ({ comboList, matched }) => {
//   const getColor = (index) => {
//     if (index < matched) return 'matched';
//     if (index === matched) return 'current';
//     return 'remaining';
//   };

//   return (
//     <div className="combo-sequence">
//       {comboList.map((pose, i) => (
//         <div key={i} className={`combo-circle ${getColor(i)}`}>{pose}</div>
//       ))}
//     </div>
//   );
// };

const BoxingGame = () => {
  const pixiRef = useRef();
  const canvasRef = useRef(null);
  const localUserRef = useRef(null);
  const OV = useRef(null);

  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [comboIndex, setComboIndex] = useState(0);
  const [motion, setMotion] = useState('');
  const [calories, setCalories] = useState(0);
  const [comboList, setComboList] = useState(() => {
    return Array.from({ length: 8 }, () => poseList[Math.floor(Math.random() * 3)]);
  });
  
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
    const token = await getToken();

    await newSession.connect(token, { clientData: 'User' });

    const newPublisher = OV.current.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false,
    });

    newSession.publish(newPublisher);
    setPublisher(newPublisher);
    setSession(newSession);
    newPublisher.addVideoElement(localUserRef.current);
  };

  useEffect(() => {
    joinSession();

    return () => {
      if (session) session.disconnect();
      setSession(null);
      setPublisher(null);
      OV.current = null;
    };
  }, []);

  useEffect(() => {
    const videoElement = localUserRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    let lastRightHand = null;
    let lastLeftHand = null;
    let lastNose = null;
    let motionCooldown = false;

    pose.onResults((results) => {
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      const poseLms = results.poseLandmarks;
      if (!poseLms) return;

      const mirroredLms = poseLms.map((lm) => ({ ...lm, x: 1 - lm.x }));
      drawConnectors(canvasCtx, mirroredLms, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
      drawLandmarks(canvasCtx, mirroredLms, { color: '#FF0000', radius: 2 });

      const [rWrist, rShoulder, lWrist, lShoulder, nose] = [
        mirroredLms[16], mirroredLms[12], mirroredLms[15], mirroredLms[11], mirroredLms[0]
      ];

      if (!lastRightHand || !lastLeftHand || !lastNose || motionCooldown) {
        lastRightHand = { ...rWrist };
        lastLeftHand = { ...lWrist };
        lastNose = { ...nose };
        return;
      }

      const punchRight = rWrist.x < rShoulder.x - 0.05 && Math.abs(rWrist.x - lastRightHand.x) > 0.05;
      const punchLeft = lWrist.x > lShoulder.x + 0.05 && Math.abs(lWrist.x - lastLeftHand.x) > 0.05;
      const uppercutRight = lastRightHand.y - rWrist.y > 0.07;
      const uppercutLeft = lastLeftHand.y - lWrist.y > 0.07;
      const dodgeRight = lastNose.x - nose.x > 0.05;
      const dodgeLeft = nose.x - lastNose.x > 0.05;

      let detectedPose = null;
      if (punchRight || punchLeft) detectedPose = '잽';
      else if (uppercutRight || uppercutLeft) detectedPose = '어퍼';
      else if (dodgeLeft || dodgeRight) detectedPose = '회피';

      const expectedPose = comboList[comboIndex];

      if (detectedPose && detectedPose === expectedPose) {
        setMotion(detectedPose);
        setCalories((prev) => prev + 10);
        setComboIndex((prev) => prev + 1);

        if (detectedPose === '잽') {
    pixiRef.current?.punch(); // ✅ 캐릭터 애니메이션 트리거
  }

        if (detectedPose && detectedPose === expectedPose) {
  setMotion(detectedPose);
  setCalories((prev) => prev + 10);

  // 상태 업데이트 이전의 comboIndex 값을 이용해 조건 체크
  const nextIndex = comboIndex + 1;

  if (detectedPose === '잽') {
    pixiRef.current?.punch();
  }

  if (nextIndex >= comboList.length) {
    pixiRef.current?.destroyBuilding();

    setTimeout(() => {
      setComboIndex(0);
      setComboList(Array.from({ length: 8 }, () => poseList[Math.floor(Math.random() * 3)]));
    }, 1000);
  } else {
    setComboIndex(nextIndex);
  }

  motionCooldown = true;
  setTimeout(() => {
    motionCooldown = false;
    setMotion('');
  }, 1000);
}


        motionCooldown = true;
        setTimeout(() => {
          motionCooldown = false;
          setMotion('');
        }, 1000);
      }

      lastRightHand = { ...rWrist };
      lastLeftHand = { ...lWrist };
      lastNose = { ...nose };
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => await pose.send({ image: videoElement }),
      width: 640,
      height: 480,
    });

    camera.start();
    return () => camera.stop();
  }, [comboIndex]);

  return (
    <div className="container">
      <div className="left-game-area">
        {/* <PixiGame ref={pixiRef} /> */}
        <div className="combo-wrapper">
          <img src={comboBg} alt="콤보백" className="combo-background"/>
          <div className="combo-overlay">
            <ComboSequence comboList={comboList} matched={comboIndex} />
          </div>
        </div>
        <div className="character-building">
          <img src={characterImg} alt="캐릭터" className="character-img" />
          <img src={buildingImg} alt="건물" className="building-img" />
        </div>
      </div>

      <div className="right-ui">
        <div className="top-ui">
          <div className="calories">{calories} KCAL</div>
          <button className="quit-button">QUIT</button>
        </div>
        <div className="camera-container">
          <video ref={localUserRef} autoPlay className="video-feed" />
          <canvas ref={canvasRef} width={640} height={480} className="pose-canvas" />
          <div className="motion-indicator">{motion}</div>
        </div>
      </div>
    </div>
  );
};

export default BoxingGame;
