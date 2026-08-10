import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import CustomerServiceWidget from "./components/support/CustomerServiceWidget";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordWithCode from "./pages/ResetPasswordWithCode";

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
import KycVerification from "./pages/KycVerification";

import OptionsTrading from "./pages/OptionsTrading";

import ProtectedRoute from "./routes/ProtectedRoute";
import { MarketProvider } from "./contexts/MarketContext";
import { SystemSettingsProvider, useSystemSettings } from "./contexts/SystemSettingsContext";
import MaintenanceScreen from "./components/MaintenanceScreen";

// OptionsTrading expects an onBack callback rather than being router-aware,
// so this thin wrapper hooks it up to the router.
function TradeRoute() {
  const navigate = useNavigate();
  return <OptionsTrading onBack={() => navigate(-1)} />;
}

function MaintenanceGate({ children }) {
  const { settings, loading } = useSystemSettings();
  if (loading) return null;
  if (settings.maintenanceMode) return <MaintenanceScreen />;
  return children;
}

// Routes where the floating customer service bubble should be hidden
// (it overlaps the trade panel buttons / bottom nav on these screens).
const HIDE_SUPPORT_WIDGET_PREFIXES = ["/trade", "/assets"];

function SupportWidgetGate() {
  const location = useLocation();
  const shouldHide = HIDE_SUPPORT_WIDGET_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  if (shouldHide) return null;
  return <CustomerServiceWidget />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SystemSettingsProvider>
        <MarketProvider>
          <MaintenanceGate>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password-code" element={<ResetPasswordWithCode />} />

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

              <Route path="/trade" element={<ProtectedRoute><TradeRoute /></ProtectedRoute>} />
              <Route path="/trade/:coinSymbol" element={<ProtectedRoute><TradeRoute /></ProtectedRoute>} />

              <Route path="/security-center" element={<ProtectedRoute><SecurityCenter /></ProtectedRoute>} />
              <Route path="/personal-information" element={<ProtectedRoute><PersonalInformation /></ProtectedRoute>} />
              <Route path="/notification-settings" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
              <Route path="/language-settings" element={<ProtectedRoute><LanguageSettings /></ProtectedRoute>} />
              <Route path="/appearance-settings" element={<ProtectedRoute><AppearanceSettings /></ProtectedRoute>} />
              <Route path="/help-center" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
              <Route path="/terms-privacy" element={<ProtectedRoute><TermsPrivacy /></ProtectedRoute>} />
              <Route path="/about-safetrade" element={<ProtectedRoute><AboutSafeTrade /></ProtectedRoute>} />
              <Route path="/rewards-center" element={<ProtectedRoute><RewardsCenter /></ProtectedRoute>} />
              <Route path="/kyc-verification" element={<ProtectedRoute><KycVerification /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* ✅ Customer Service Widget – hidden on Trade (OptionsTrading) and Assets pages */}
            <SupportWidgetGate />
          </MaintenanceGate>
        </MarketProvider>
      </SystemSettingsProvider>
    </BrowserRouter>
  );
}
