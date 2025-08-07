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

// 페이지 import
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import StoryPage from "./pages/StoryPage";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import EventPage from "./pages/EventPage";
import PasswordPage from "./pages/PasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SingleTestPage from "./pages/SingleTestPage";
import MultiLobbyPage from "./pages/MultiLobbyPage";         // ✅ 추가
import MultiModeEntryPage from "./pages/MultiModeEntryPage"; // ✅ 추가

// 컴포넌트 import
import AppLayout from "./components/AppLayout";
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout><StartPage /></AppLayout>} />
        <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
        <Route path="/signup" element={<AppLayout><SignupPage /></AppLayout>} />
        <Route path="/password" element={<AppLayout><PasswordPage /></AppLayout>} />
        <Route path="/resetpassword" element={<AppLayout><ResetPasswordPage /></AppLayout>} />

        {/* Protected Routes */}
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game"
          element={
            <ProtectedRoute>
              <AppLayout><GamePage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/story"
          element={
            <ProtectedRoute>
              <AppLayout><StoryPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event"
          element={
            <ProtectedRoute>
              <AppLayout><EventPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/singletest"
          element={
            <ProtectedRoute>
              <SingleTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/multimode"
          element={
            <ProtectedRoute>
              <AppLayout><MultiModeEntryPage /></AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/multilobby"
          element={
            <ProtectedRoute>
              <AppLayout><MultiLobbyPage /></AppLayout>
            </ProtectedRoute>
          }
        />
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
