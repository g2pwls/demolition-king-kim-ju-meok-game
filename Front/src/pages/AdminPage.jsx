// src/pages/AdminPage.jsx
import React, { useState } from "react";
import AnimatedPage from "../components/AnimatedPage";
import AdminPanelModal from "../components/AdminPanelModal";
import "../styles/AdminPage.css";
import loginBack from "../assets/images/login/loginbackf.png";

export default function AdminPage() {
  const [open, setOpen] = useState(false);
  return (
      <AnimatedPage>
        <div className="login-page-background" style={{ backgroundImage: `url(${loginBack})` }}>
          <div className="admin-buttons-container">
            <button className="admin-button" onClick={() => setOpen(true)}>관리 패널 열기</button>
          </div>
          <AdminPanelModal open={open} onClose={() => setOpen(false)} />
        </div>
      </AnimatedPage>
  );
}
