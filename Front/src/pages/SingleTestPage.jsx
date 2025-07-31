import React, { useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { FaceDetection } from '@mediapipe/face_detection';
import { drawRectangle, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';

const SingleTestPage = () => {
  const canvasRef = useRef(null); // 얼굴 감지 결과 캔버스
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(null);
  const localUserRef = useRef(null); // 내 영상 태그

  // 토큰 받아오는 함수
  const getToken = async () => {
    const response = await fetch('http://localhost:5000/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: 'TestSession' }),
    });

    const data = await response.json();
    return data.token;
  };

  // 세션 참가
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
      frameRate: 30,
      insertMode: 'APPEND',
      mirror: false,
    });

    newSession.publish(newPublisher);
    setPublisher(newPublisher);
    setSession(newSession);

    newPublisher.addVideoElement(localUserRef.current); // 내 영상 출력
  };

  // 세션 종료
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    OV.current = null;
  };

  // MediaPipe 얼굴 감지 연결
  useEffect(() => {
    if (!session || !localUserRef.current || !canvasRef.current) return;

    const videoElement = localUserRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      modelSelection: 0,
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.detections && results.detections.length > 0) {
        for (const detection of results.detections) {
          drawRectangle(canvasCtx, detection.boundingBox, {
            color: 'green',
            lineWidth: 2,
          });
          drawLandmarks(canvasCtx, detection.landmarks, {
            color: 'red',
            radius: 3,
          });
        }
      }

      canvasCtx.restore();
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceDetection.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, [session]);

  // 언마운트 시 세션 종료
  useEffect(() => {
    return () => {
      leaveSession();
    };
  }, []);

  return (
    <div>
      <h1>OpenVidu + MediaPipe 얼굴 감지</h1>
      <button onClick={joinSession}>세션 참가</button>
      <button onClick={leaveSession}>세션 종료</button>

      {/* 내 영상 + 얼굴 감지 캔버스 */}
      <div style={{ position: 'relative', width: '640px', height: '480px' }}>
        <video
          autoPlay
          ref={localUserRef}
          style={{ width: '640px', height: '480px', position: 'absolute' }}
        ></video>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: 'absolute', top: 0, left: 0 }}
        ></canvas>
      </div>

      {/* 상대방들 영상 */}
      <div>
        {subscribers.map((sub, index) => {
          const videoRef = useRef(null);
          useEffect(() => {
            sub.addVideoElement(videoRef.current);
          }, [sub]);
          return (
            <video
              key={index}
              autoPlay
              ref={videoRef}
              style={{ width: '400px', marginTop: '10px' }}
            ></video>
          );
        })}
      </div>
    </div>
  );
};

export default SingleTestPage;
