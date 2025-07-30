import React, { useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';

const SingleTestPage = () => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(null);
  const localUserRef = useRef(null); // 내 영상 태그

  // const APPLICATION_SERVER_URL = 'https://YOUR_SERVER:4443'; // OpenVidu 서버 주소
  const APPLICATION_SERVER_URL = 'http://localhost:4443';
  const OPENVIDU_SECRET = 'MY_SECRET';


  // 토큰 받아오는 함수 (자체 백엔드 또는 openvidu-server 직접 요청)
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

    newPublisher.addVideoElement(localUserRef.current); // 내 영상 태그에 연결
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    OV.current = null;
  };

  useEffect(() => {
    return () => {
      leaveSession(); // 컴포넌트 언마운트 시 종료
    };
  }, []);

  return (
    <div>
      <h1>OpenVidu 영상 통화 테스트</h1>
      <button onClick={joinSession}>세션 참가</button>
      <button onClick={leaveSession}>세션 종료</button>

      <div>
        <video autoPlay={true} ref={localUserRef} style={{ width: '400px' }}></video>
      </div>

      <div>
        {subscribers.map((sub, index) => {
          const videoRef = useRef(null);
          useEffect(() => {
            sub.addVideoElement(videoRef.current);
          }, [sub]);
          return <video key={index} autoPlay={true} ref={videoRef} style={{ width: '400px' }}></video>;
        })}
      </div>
    </div>
  );
};

export default SingleTestPage;