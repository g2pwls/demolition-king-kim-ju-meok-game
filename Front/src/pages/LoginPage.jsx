import React, { useState } from "react";
import "../styles/LoginPage.css";
import googleIcon from "../assets/images/login/google.png";
import kakaoIcon from "../assets/images/login/kakao.png";
import loginBack from "../assets/images/login/loginbackf.png";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.length < 4) {
      setError("아이디는 최소 4자 이상 입력하세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상 입력하세요.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      setError("가입된 유저 정보가 없습니다.");
      return;
    }

    if (username !== savedUser.email && username !== savedUser.nickname) {
      setError("아이디(이메일 또는 닉네임)가 일치하지 않습니다.");
      return;
    }

    if (password !== savedUser.password) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setError("");

    // 자동 로그인 여부 저장
    if (autoLogin) {
      localStorage.setItem("autoLogin", "true");
    } else {
      localStorage.removeItem("autoLogin");
    }

    navigate("/story");
  };

  return (
    <div
      className="login-page-background"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      <div className="login-box">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-row1 with-button">
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <label style={{ width: "100px" }}>아이디</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ width: "100px" }}>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="login-button">
              로그인
            </button>
          </div>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
              />{" "}
              자동로그인
            </label>
          </div>

          <div className="social-login">
            <img src={googleIcon} alt="Google" />
            <img src={kakaoIcon} alt="Kakao" />
          </div>

          <div className="login-links">
            <Link to="/signup">회원가입</Link> |{" "}
            <Link to="/password">비밀번호 찾기</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
