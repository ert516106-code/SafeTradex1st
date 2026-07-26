import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DepositHome from "../components/deposit/DepositHome";
import CoinSelector from "../components/deposit/CoinSelector";
import NetworkSelector from "../components/deposit/NetworkSelector";
import DepositDetails from "../components/deposit/DepositDetails";
import BuyCryptoProviders from "../components/deposit/BuyCryptoProviders";
import DepositHistory from "../components/deposit/DepositHistory";

export const DEPOSIT_COINS = [
  { symbol: "USDT", name: "Tether", color: "#26A17B" },
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", color: "#627EEA" },
  { symbol: "SOL", name: "Solana", color: "#9945FF" },
  { symbol: "BNB", name: "BNB", color: "#F3BA2F" },
  { symbol: "XRP", name: "XRP", color: "#00A4E4" },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA" },
  { symbol: "DOGE", name: "Dogecoin", color: "#C2A633" },
  { symbol: "ADA", name: "Cardano", color: "#0033AD" },
  { symbol: "TRX", name: "TRON", color: "#EF0027" },
];

export function getDepositCoin(symbol) {
  return DEPOSIT_COINS.find((c) => c.symbol === symbol) || DEPOSIT_COINS[0];
}

export const NETWORKS_BY_COIN = {
  USDT: [
    { id: "trc20", name: "TRC20", subtitle: "TRON Network" },
    { id: "erc20", name: "ERC20", subtitle: "Ethereum Network" },
    { id: "bep20", name: "BEP20", subtitle: "BNB Smart Chain" },
    { id: "polygon", name: "Polygon", subtitle: "Polygon Network" },
    { id: "solana", name: "Solana", subtitle: "Solana Network" },
  ],
  USDC: [
    { id: "erc20", name: "ERC20", subtitle: "Ethereum Network" },
    { id: "trc20", name: "TRC20", subtitle: "TRON Network" },
    { id: "bep20", name: "BEP20", subtitle: "BNB Smart Chain" },
    { id: "polygon", name: "Polygon", subtitle: "Polygon Network" },
    { id: "solana", name: "Solana", subtitle: "Solana Network" },
  ],
  BTC: [{ id: "bitcoin", name: "Bitcoin", subtitle: "BTC Network" }],
  ETH: [{ id: "erc20", name: "ERC20", subtitle: "Ethereum Network" }],
  SOL: [{ id: "solana", name: "Solana", subtitle: "Solana Network" }],
  BNB: [
    { id: "bep20", name: "BEP20", subtitle: "BNB Smart Chain" },
    { id: "bep2", name: "BEP2", subtitle: "BNB Beacon Chain" },
  ],
  XRP: [{ id: "xrpl", name: "XRP Ledger", subtitle: "Native Network" }],
  DOGE: [{ id: "dogecoin", name: "Dogecoin", subtitle: "DOGE Network" }],
  ADA: [{ id: "cardano", name: "Cardano", subtitle: "ADA Network" }],
  TRX: [{ id: "trc20", name: "TRC20", subtitle: "TRON Network" }],
};

export function getNetworksForCoin(symbol) {
  return NETWORKS_BY_COIN[symbol] || [{ id: "mainnet", name: "Mainnet", subtitle: "Default Network" }];
}

export function getMockWalletAddress(coinSymbol, networkId) {
  const seed = `${coinSymbol}${networkId}`.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const hex = (n) => n.toString(16).padStart(4, "0");
  const chunk = `${hex(seed)}${hex(seed * 7)}${hex(seed * 13)}${hex(seed * 19)}`.repeat(2).slice(0, 34);

  switch (networkId) {
    case "trc20":
      return `T${chunk.slice(0, 33).toUpperCase()}`;
    case "erc20":
    case "bep20":
    case "polygon":
      return `0x${chunk.slice(0, 40)}`;
    case "bitcoin":
      return `bc1q${chunk.slice(0, 38)}`;
    case "solana":
      return `${chunk.slice(0, 44)}`;
    case "xrpl":
      return `r${chunk.slice(0, 33)}`;
    case "dogecoin":
      return `D${chunk.slice(0, 33)}`;
    case "cardano":
      return `addr1${chunk.slice(0, 50)}`;
    default:
      return `${coinSymbol.toLowerCase()}-${networkId}-${chunk.slice(0, 30)}`;
  }
}

export const BUY_PROVIDERS = [
  { id: "moonpay", name: "MoonPay", url: "https://www.moonpay.com", color: "#7B2FF7" },
  { id: "banxa", name: "Banxa", url: "https://banxa.com", color: "#00D6A4" },
  { id: "ramp", name: "Ramp Network", url: "https://ramp.network", color: "#2F80ED" },
  { id: "transak", name: "Transak", url: "https://transak.com", color: "#1F4CDB" },
  { id: "mercuryo", name: "Mercuryo", url: "https://mercuryo.io", color: "#FF4C6A" },
  { id: "guardarian", name: "Guardarian", url: "https://guardarian.com", color: "#2CC97C" },
];

export const MOCK_DEPOSIT_HISTORY = [
  { id: "d1", coin: "USDT", network: "TRC20", amount: "500.00", status: "Completed", date: "2026-07-18T14:32:00Z" },
  { id: "d2", coin: "BTC", network: "Bitcoin", amount: "0.0125", status: "Completed", date: "2026-07-16T09:10:00Z" },
  { id: "d3", coin: "ETH", network: "ERC20", amount: "1.2400", status: "Pending", date: "2026-07-15T20:47:00Z" },
  { id: "d4", coin: "USDC", network: "Polygon", amount: "250.00", status: "Completed", date: "2026-07-12T11:05:00Z" },
  { id: "d5", coin: "SOL", network: "Solana", amount: "8.5000", status: "Failed", date: "2026-07-09T17:22:00Z" },
  { id: "d6", coin: "XRP", network: "XRP Ledger", amount: "1200.00", status: "Completed", date: "2026-07-03T06:58:00Z" },
];

const initialSelection = {
  coin: null,
  networkId: null,
};

const DepositContext = createContext(null);

export function useDeposit() {
  const ctx = useContext(DepositContext);
  if (!ctx) throw new Error("useDeposit must be used inside the Deposit flow");
  return ctx;
}

// ---- Shared design tokens (kept identical in Withdraw.jsx — update both together) ----
export const FLOW_THEME = {
  purple: "#8B5CF6",
  purpleDeep: "#7C3AED",
  blue: "#3B82F6",
  blueDeep: "#2563EB",
};

export default function Deposit() {
  const [selection, setSelection] = useState(initialSelection);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateSelection = (patch) => setSelection((prev) => ({ ...prev, ...patch }));
  const resetSelection = () => setSelection(initialSelection);

  return (
    <DepositContext.Provider value={{ selection, updateSelection, resetSelection }}>
      <div
        className={`fixed inset-0 z-50 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)" }}
      >
        <div
          className="pointer-events-none fixed -left-[12%] -top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: FLOW_THEME.purpleDeep }}
        />
        <div
          className="pointer-events-none fixed -right-[12%] -bottom-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: FLOW_THEME.blueDeep }}
        />

        <div className="relative z-10">
          <Routes>
            <Route index element={<DepositHome />} />
            <Route path="select-coin" element={<CoinSelector />} />
            <Route path="select-network" element={<NetworkSelector />} />
            <Route path="details" element={<DepositDetails />} />
            <Route path="buy" element={<BuyCryptoProviders />} />
            <Route path="history" element={<DepositHistory />} />
            <Route path="*" element={<Navigate to="/deposit" replace />} />
          </Routes>
        </div>
      </div>
    </DepositContext.Provider>
  );
}

// Shared pill switcher between Deposit / Withdraw — the signature glow element.
// Duplicated (not imported) in Withdraw.jsx so each route file has zero cross-deps.
export function FlowTabs({ active = "deposit" }) {
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

export function DepositHeader({
  title,
  onBack,
  right = null,
  showBack = true,
  showFlowSwitch = false,
}) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 border-b border-[#8B5CF6]/[0.14] bg-[#050816]/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        {showBack ? (
          <button
            onClick={onBack ? onBack : () => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}

        <h1 className="text-[17px] font-bold text-white">{title}</h1>

        {right ? right : <div className="h-10 w-10" />}
      </div>

      {showFlowSwitch && <FlowTabs active="deposit" />}
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

// Gradient icon square used inside action cards (Deposit crypto / Buy crypto, etc.)
export function IconBadge({ children, accent = "purple", size = 52, className = "" }) {
  const bg =
    accent === "blue"
      ? `linear-gradient(135deg, ${FLOW_THEME.blue}, ${FLOW_THEME.blueDeep})`
      : `linear-gradient(135deg, ${FLOW_THEME.purple}, ${FLOW_THEME.purpleDeep})`;
  const shadow = accent === "blue" ? "rgba(59,130,246,0.55)" : "rgba(139,92,246,0.55)";

  return (
    <span
      className={`flex items-center justify-center rounded-2xl text-white ${className}`}
      style={{ width: size, height: size, background: bg, boxShadow: `0 8px 22px -6px ${shadow}` }}
    >
      {children}
    </span>
  );
}

const ICON_ID_OVERRIDES = {
  MATIC: "polygon",
};

export function DepositCoinLogo({ coin, size = 36 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const iconId = ICON_ID_OVERRIDES[coin.symbol] || coin.symbol.toLowerCase();
  const iconUrl = `https://assets.coincap.io/assets/icons/${iconId}@2x.png`;

  if (imgFailed) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
        style={{ width: size, height: size, background: coin.color, fontSize: size * 0.32 }}
      >
        {coin.symbol.slice(0, 1)}
      </span>
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/5"
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrl}
        alt={coin.symbol}
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </span>
  );
}

export function formatAmount(value, maxDecimals = 6) {
  if (!isFinite(value)) return "0";
  const rounded = Number(value.toFixed(maxDecimals));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: maxDecimals });
}
