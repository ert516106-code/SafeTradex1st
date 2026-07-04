import { useState, useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from "./lib/query-client";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import { LanguageProvider } from "./lib/LanguageContext";
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from "./lib/AuthContext";
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import CountryPromptModal from "./components/CountryPromptModal";
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Coins from './pages/Coins';
import Trading from './pages/Trading';
import Financial from './pages/Financial';
import Assets from './pages/Assets';
import AdminDashboard from './pages/AdminDashboard';
import Staking from './pages/Staking';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const AuthenticatedApp = () => {
  const {
    user,
    isAuthenticated,
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin
  } = useAuth();

  const [needsCountry, setNeedsCountry] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.country) {
      setNeedsCountry(true);
    }
  }, [isAuthenticated, user]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    } else if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <div className="max-w-lg mx-auto relative">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute
              unauthenticatedElement={<Navigate to="/login" replace />}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/coins" element={<Coins />} />
          <Route path="/trade" element={<Trading />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staking" element={<Staking />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <BottomNav />

      {needsCountry && (
        <CountryPromptModal
          onSaved={() => setNeedsCountry(false)}
        />
      )}
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('splash_shown')
  );

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          sessionStorage.setItem('splash_shown', '1');
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
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
