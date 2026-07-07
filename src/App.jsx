import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { queryClientInstance } from "./lib/query-client";
import { LanguageProvider } from "./lib/LanguageContext";
import { AuthProvider, useAuth } from "./lib/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";

// Pages
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Coins from "./pages/Coins";
import Trading from "./pages/Trading";
import Financial from "./pages/Financial";
import Assets from "./pages/Assets";
import Staking from "./pages/Staking";
import Profile from "./pages/Profile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import PageNotFound from "./lib/PageNotFound";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-lg mx-auto relative">
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Redirect */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/coins" element={<Coins />} />
          <Route path="/trade" element={<Trading />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>

      {isAuthenticated && <BottomNav />}
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem("splash_shown")
  );

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem("splash_shown", "1");
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <LanguageProvider>
          <Router>
            <AppRoutes />
          </Router>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
