// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import { AnimatePresence } from 'framer-motion';

import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import StoryPage from './pages/StoryPage';
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import EventPage from './pages/EventPage';
import PasswordPage from './pages/PasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AppLayout from './components/AppLayout'; // 경로는 상황에 맞게 조정


function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppLayout><StartPage /></AppLayout>} />
        <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
        <Route path="/game" element={<AppLayout><GamePage /></AppLayout>} />
        <Route path="/story" element={<AppLayout><StoryPage /></AppLayout>} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/signup" element={<AppLayout><SignupPage /></AppLayout>} />
        <Route path="/event" element={<AppLayout><EventPage /></AppLayout>} />
        <Route path="/password" element={<AppLayout><PasswordPage /></AppLayout>} />
        <Route path="/resetpassword" element={<AppLayout><ResetPasswordPage /></AppLayout>} />
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
