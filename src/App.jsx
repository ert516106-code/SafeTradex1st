import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import Markets from "./pages/Markets";
import CoinDetails from "./pages/CoinDetails";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Convert from "./pages/Convert";
import Financial from "./pages/Financial";
import Assets from "./pages/Assets";
import Notifications from "./pages/Notifications";

import SecurityCenter from "./pages/SecurityCenter";
import PersonalInformation from "./pages/PersonalInformation";
import NotificationSettings from "./pages/NotificationSettings";
import LanguageSettings from "./pages/LanguageSettings";
import AppearanceSettings from "./pages/AppearanceSettings";
import HelpCenter from "./pages/HelpCenter";
import TermsPrivacy from "./pages/TermsPrivacy";
import AboutSafeTrade from "./pages/AboutSafeTrade";
import RewardsCenter from "./pages/RewardsCenter";

import ProtectedRoute from "./routes/ProtectedRoute";
import { MarketProvider } from "./contexts/MarketContext";

export default function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
          <Route path="/coin/:id" element={<ProtectedRoute><CoinDetails /></ProtectedRoute>} />
          <Route path="/deposit/*" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/withdraw/*" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/transfer/*" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
          <Route path="/convert/*" element={<ProtectedRoute><Convert /></ProtectedRoute>} />
          <Route path="/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/security-center" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
          <Route path="/personal-information" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
          <Route path="/notification-settings" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
          <Route path="/language-settings" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
          <Route path="/appearance-settings" element={<ProtectedRoute><AppearanceSettings /></ProtectedRoute>} />
          <Route path="/help-center" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
          <Route path="/terms-privacy" element={<ProtectedRoute><TermsPrivacy /></ProtectedRoute>} />
          <Route path="/about-safetrade" element={<ProtectedRoute><AboutSafeTrade /></ProtectedRoute>} />
          <Route path="/rewards-center" element={<ProtectedRoute><RewardsCenter /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MarketProvider>
    </BrowserRouter>
  );
}
