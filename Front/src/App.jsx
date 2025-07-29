// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./styles/App.css";
import { AnimatePresence } from "framer-motion";

import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import StoryPage from "./pages/StoryPage";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import EventPage from "./pages/EventPage";
import PasswordPage from "./pages/PasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SingleGame from "./pages/SingleGamePage"; // 싱글 게임 컴포넌트 import
import SingleTestPage from './pages/SingleTestPage'; 
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/password" element={<PasswordPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/single" element={<SingleGame />} />
        <Route path="/singletest" element={<SingleTestPage />} />
        
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
