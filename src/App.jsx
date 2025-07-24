// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import { AnimatePresence } from 'framer-motion';

import StartPage from './pages/StartPage';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/gamePage';
import StoryPage from './pages/StoryPage';
import MainPage from './pages/MainPage';

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
