import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import WithdrawHome from "../components/withdraw/WithdrawHome";
import InternalWithdraw from "../components/withdraw/InternalWithdraw";
import ExternalWithdraw from "../components/withdraw/ExternalWithdraw";
import NetworkSelector from "../components/withdraw/NetworkSelector";
import WithdrawReview from "../components/withdraw/WithdrawReview";
import WithdrawSuccess from "../components/withdraw/WithdrawSuccess";
import { useSystemSettings } from "../contexts/SystemSettingsContext";

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

const WithdrawContext = createContext(null);

export function useWithdraw() {
  const ctx = useContext(WithdrawContext);
  if (!ctx) throw new Error("useWithdraw must be used inside the Withdraw flow");
  return ctx;
}

// ---- Shared design tokens (kept identical in Deposit.jsx — update both together) ----
export const FLOW_THEME = {
  purple: "#8B5CF6",
  purpleDeep: "#7C3AED",
  blue: "#3B82F6",
  blueDeep: "#2563EB",
};

function WithdrawDisabledScreen() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🚫</div>
      <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        Withdrawals are temporarily disabled
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 320, marginBottom: 24 }}>
        The platform has paused new withdrawals. Please try again later.
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "#fff", padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        Go back
      </button>
    </div>
  );
}

export default function Withdraw() {
  const [draft, setDraft] = useState(initialDraft);
  const [mounted, setMounted] = useState(false);
  const { settings, loading: settingsLoading } = useSystemSettings();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraft(initialDraft);

  return (
    <WithdrawContext.Provider value={{ draft, updateDraft, resetDraft }}>
      <div
        className={`fixed inset-0 z-50 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)" }}
      >
        <div
          className="pointer-events-none fixed -left-[12%] -top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: FLOW_THEME.blueDeep }}
        />
        <div
          className="pointer-events-none fixed -right-[12%] -bottom-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: FLOW_THEME.purpleDeep }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[520px]">
          {!settingsLoading && !settings.withdrawals ? (
            <WithdrawDisabledScreen />
          ) : (
            <Routes>
              <Route index element={<WithdrawHome />} />
              <Route path="internal" element={<InternalWithdraw />} />
              <Route path="external" element={<ExternalWithdraw />} />
              <Route path="external/network" element={<NetworkSelector />} />
              <Route path="review" element={<WithdrawReview />} />
              <Route path="success" element={<WithdrawSuccess />} />
              <Route path="*" element={<Navigate to="/withdraw" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </WithdrawContext.Provider>
  );
}

// Shared pill switcher between Deposit / Withdraw — the signature glow element.
// Duplicated (not imported) from Deposit.jsx so each route file has zero cross-deps.
export function FlowTabs({ active = "withdraw" }) {
  const navigate = useNavigate();
  const isDeposit = active === "deposit";
  return (
    <div className="px-4 pb-4 sm:px-6">
      <div className="relative flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
        <div
          className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-all duration-300 ease-out"
          style={{
            left: isDeposit ? 4 : "calc(50% + 0px)",
            background: isDeposit
              ? `linear-gradient(135deg, ${FLOW_THEME.purple}, ${FLOW_THEME.purpleDeep})`
              : `linear-gradient(135deg, ${FLOW_THEME.blue}, ${FLOW_THEME.blueDeep})`,
            boxShadow: isDeposit
              ? "0 0 20px rgba(139,92,246,0.55)"
              : "0 0 20px rgba(59,130,246,0.55)",
          }}
        />
        <button
          type="button"
          onClick={() => navigate("/deposit")}
          className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            isDeposit ? "text-white" : "text-white/50"
          }`}
        >
          Deposit
        </button>
        <button
          type="button"
          onClick={() => navigate("/withdraw")}
          className={`relative z-10 flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
            !isDeposit ? "text-white" : "text-white/50"
          }`}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
}

export function WithdrawHeader({ title, onBack, onClose, right = null, showFlowSwitch = false }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 border-b border-[#8B5CF6]/[0.14] bg-[#050816]/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <button
          onClick={onBack ? onBack : () => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="text-[17px] font-bold text-white">{title}</h1>

        {right ? right : <div className="h-10 w-10" />}
      </div>

      {showFlowSwitch && <FlowTabs active="withdraw" />}
    </div>
  );
}

export function GlassCard({ children, className = "", accent = "purple" }) {
  const glow =
    accent === "blue"
      ? "shadow-[0_0_36px_-14px_rgba(59,130,246,0.45)]"
      : "shadow-[0_0_36px_-14px_rgba(139,92,246,0.45)]";
  const line = accent === "blue" ? "via-[#60A5FA]/50" : "via-[#A78BFA]/50";

  return (
    <div
      className={`relative rounded-[20px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl ${glow} ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent ${line} to-transparent`}
      />
      {children}
    </div>
  );
}

// Kept as an alias so any component still importing `GlowCard` from here doesn't break.
export const GlowCard = GlassCard;

// Gradient icon square used inside action cards (Internal / External withdraw, etc.)
export function IconBadge({ children, accent = "purple", size = 52 }) {
  const bg =
    accent === "blue"
      ? `linear-gradient(135deg, ${FLOW_THEME.blue}, ${FLOW_THEME.blueDeep})`
      : `linear-gradient(135deg, ${FLOW_THEME.purple}, ${FLOW_THEME.purpleDeep})`;
  const shadow = accent === "blue" ? "rgba(59,130,246,0.55)" : "rgba(139,92,246,0.55)";

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl text-white"
      style={{ width: size, height: size, background: bg, boxShadow: `0 8px 22px -6px ${shadow}` }}
    >
      {children}
    </span>
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
      className={`w-full rounded-[20px] py-4 text-[15.5px] font-bold tracking-wide text-white transition-transform duration-150 ${
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      } ${pressed && !disabled ? "scale-[0.97]" : "scale-100"}`}
      style={{
        background: `linear-gradient(90deg, ${FLOW_THEME.purple}, ${FLOW_THEME.blue})`,
        boxShadow: disabled ? "none" : "0 14px 34px -10px rgba(139,92,246,0.65)",
      }}
    >
      {children}
    </button>
  );
}

export function FieldLabel({ children, right = null }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <label className="text-[12.5px] font-semibold tracking-wide text-white/50">{children}</label>
      {right}
    </div>
  );
}

export function CoinSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = getCoin(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-[14px] text-left"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: selected.color, boxShadow: `0 0 16px ${selected.color}66` }}
          >
            {selected.symbol.slice(0, 1)}
          </span>
          <span>
            <span className="block text-[14.5px] font-bold text-white">{selected.symbol}</span>
            <span className="block text-xs text-white/40">{selected.name}</span>
          </span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-white/50 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-y-auto rounded-[20px] bg-[#0b0f24] transition-all duration-200 ${
          open ? "max-h-[260px] border border-[#8B5CF6]/25 p-2 opacity-100 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.65)]" : "max-h-0 border border-transparent p-0 opacity-0"
        }`}
      >
        {COINS.map((c) => (
          <button
            key={c.symbol}
            type="button"
            onClick={() => {
              onChange(c.symbol);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-[10px] text-left ${
              c.symbol === value ? "bg-[#8B5CF6]/[0.12]" : "bg-transparent"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10.5px] font-bold text-white"
                style={{ background: c.color }}
              >
                {c.symbol.slice(0, 1)}
              </span>
              <span>
                <span className="block text-[13.5px] font-bold text-white">{c.symbol}</span>
                <span className="block text-[11.5px] text-white/40">{c.name}</span>
              </span>
            </span>
            <span className="text-xs text-white/40">{c.balance}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
