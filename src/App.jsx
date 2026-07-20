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

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/markets"
            element={
              <ProtectedRoute>
                <Markets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coin/:id"
            element={
              <ProtectedRoute>
                <CoinDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit/*"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdraw/*"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transfer/*"
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/convert/*"
            element={
              <ProtectedRoute>
                <Convert />
              </ProtectedRoute>
            }
          />

          <Route
            path="/financial"
            element={
              <ProtectedRoute>
                <Financial />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </MarketProvider>
    </BrowserRouter>
  );
}
