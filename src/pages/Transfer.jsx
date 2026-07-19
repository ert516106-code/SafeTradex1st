import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TransferHome from "../components/transfer/TransferHome";
import InternalTransfer from "../components/transfer/InternalTransfer";
import ExternalTransfer from "../components/transfer/ExternalTransfer";
import NetworkSelector from "../components/transfer/NetworkSelector";
import TransferReview from "../components/transfer/TransferReview";
import TransferSuccess from "../components/transfer/TransferSuccess";

export const COINS = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.0842, color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", balance: 1.2451, color: "#627EEA" },
  { symbol: "USDT", name: "Tether", balance: 4820.55, color: "#26A17B" },
  { symbol: "BNB", name: "BNB", balance: 3.114, color: "#F3BA2F" },
  { symbol: "SOL", name: "Solana", balance: 12.87, color: "#9945FF" },
  { symbol: "XRP", name: "XRP", balance: 940.2, color: "#00A4E4" },
];

export const NETWORKS = [
  { id: "trc20", label: "TRC20", chain: "TRON", fee: 1, feeUnit: "USDT", min: 5, eta: "~2 minutes" },
  { id: "erc20", label: "ERC20", chain: "Ethereum", fee: 8.5, feeUnit: "USDT", min: 20, eta: "~10 minutes" },
  { id: "bep20", label: "BEP20", chain: "BNB Smart Chain", fee: 0.5, feeUnit: "USDT", min: 5, eta: "~1 minute" },
  { id: "polygon", label: "Polygon", chain: "Polygon PoS", fee: 0.4, feeUnit: "USDT", min: 5, eta: "~2 minutes" },
  { id: "solana", label: "Solana", chain: "Solana", fee: 0.3, feeUnit: "USDT", min: 2, eta: "~30 seconds" },
];

export function getCoin(symbol) {
  return COINS.find((c) => c.symbol === symbol) || COINS[0];
}

export function getNetwork(id) {
  return NETWORKS.find((n) => n.id === id) || null;
}

const initialDraft = {
  type: null,
  coin: COINS[0].symbol,
  recipient: "",
  note: "",
  amount: "",
  networkId: null,
  walletAddress: "",
};

const TransferContext = createContext(null);

export function useTransfer() {
  const ctx = useContext(TransferContext);
  if (!ctx) throw new Error("useTransfer must be used inside the Transfer flow");
  return ctx;
}

export default function Transfer() {
  const [draft, setDraft] = useState(initialDraft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraft(initialDraft);

  return (
    <TransferContext.Provider value={{ draft, updateDraft, resetDraft }}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          overflowY: "auto",
          background: "radial-gradient(circle at top, #1b2a5e 0%, #0a0f24 55%, #050816 100%)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "-10%",
            left: "-12%",
            width: "60vmax",
            height: "60vmax",
            borderRadius: "50%",
            background: "#7C3AED",
            opacity: 0.16,
            filter: "blur(110px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-15%",
            right: "-12%",
            width: "55vmax",
            height: "55vmax",
            borderRadius: "50%",
            background: "#2563EB",
            opacity: 0.14,
            filter: "blur(110px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route index element={<TransferHome />} />
            <Route path="internal" element={<InternalTransfer />} />
            <Route path="external" element={<ExternalTransfer />} />
            <Route path="external/network" element={<NetworkSelector />} />
            <Route path="review" element={<TransferReview />} />
            <Route path="success" element={<TransferSuccess />} />
            <Route path="*" element={<Navigate to="/transfer" replace />} />
          </Routes>
        </div>
      </div>
    </TransferContext.Provider>
  );
}

export function TransferHeader({ title, onBack, onClose, right = null }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 18px",
        background: "rgba(5,8,22,0.55)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(124,58,237,0.14)",
      }}
    >
      <button
        onClick={onBack ? onBack : () => navigate(-1)}
        aria-label="Back"
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>{title}</h1>

      {right ? (
        right
      ) : onClose ? (
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 40, height: 40 }} />
      )}
    </div>
  );
}

export function GlowCard({ children, style = {} }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        border: "1px solid rgba(124,58,237,0.18)",
        background: "linear-gradient(180deg, rgba(124,58,237,0.06), rgba(11,15,36,0.9))",
        boxShadow: "0 0 40px -14px rgba(124,58,237,0.35)",
        padding: 18,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 18,
          right: 18,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
        }}
      />
      {children}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled = false, type = "button" }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: "100%",
        padding: "16px 0",
        borderRadius: 18,
        border: "none",
        background: disabled
          ? "linear-gradient(90deg, #7C3AED, #2563EB)"
          : "linear-gradient(90deg, #8B5CF6, #3B82F6)",
        color: "#fff",
        fontSize: 15.5,
        fontWeight: 700,
        letterSpacing: 0.2,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        boxShadow: disabled ? "none" : "0 14px 34px -10px rgba(124,58,237,0.65)",
        transform: pressed && !disabled ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.15s ease, opacity 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children, right = null }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 0.3 }}>
        {children}
      </label>
      {right}
    </div>
  );
}

export function CoinSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = getCoin(value);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
          padding: "14px 16px",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              background: selected.color,
              boxShadow: `0 0 16px ${selected.color}66`,
            }}
          >
            {selected.symbol.slice(0, 1)}
          </span>
          <span>
            <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "#fff" }}>{selected.symbol}</span>
            <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{selected.name}</span>
          </span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            color: "rgba(255,255,255,0.5)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "calc(100% + 8px)",
          zIndex: 20,
          maxHeight: open ? 260 : 0,
          overflowY: "auto",
          opacity: open ? 1 : 0,
          transition: "max-height 0.25s ease, opacity 0.2s ease",
          borderRadius: 18,
          border: open ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
          background: "#0b0f24",
          boxShadow: open ? "0 24px 60px -14px rgba(0,0,0,0.65)" : "none",
          padding: open ? 8 : 0,
        }}
      >
        {COINS.map((c) => (
          <button
            key={c.symbol}
            type="button"
            onClick={() => {
              onChange(c.symbol);
              setOpen(false);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 14,
              border: "none",
              background: c.symbol === value ? "rgba(124,58,237,0.12)" : "transparent",
              padding: "10px 12px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "#fff",
                  background: c.color,
                }}
              >
                {c.symbol.slice(0, 1)}
              </span>
              <span>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{c.symbol}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>{c.name}</span>
              </span>
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{c.balance}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
