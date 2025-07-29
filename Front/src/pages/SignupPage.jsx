import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";
import loginBack from "../assets/images/login/loginbackf.png";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 입력 중에도 실시간으로 비밀번호 길이 검사
    if (name === "password" && value.length >= 6) {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nickname, email, password, confirmPassword } = form;

    if (!nickname || !email || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ email, nickname, password }));
    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
    navigate("/login");
  };

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${loginBack})` }}
    >
      <div className="signup-box">
        <div className="character-select-box">{/* 캐릭터 선택 자리 */}</div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row2 with-button">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
            />
            <button type="button">중복확인</button>
          </div>

          <div className="form-row2 with-button">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <button type="button">중복확인</button>
          </div>

          <div className="form-row2">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* 비밀번호 길이 에러 메시지 */}
          {passwordError && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {passwordError}
            </div>
          )}

          <div className="form-row2">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-row2 button-row">
            <button type="submit" className="signup-button">
              회원가입 하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
