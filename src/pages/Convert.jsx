import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ConvertForm from "../components/convert/ConvertForm";
import SelectCoin from "../components/convert/SelectCoin";
import ConvertReview from "../components/convert/ConvertReview";
import ConvertLoading from "../components/convert/ConvertLoading";
import ConvertSuccess from "../components/convert/ConvertSuccess";

export const COINS = [
  { symbol: "BTC", name: "Bitcoin", price: 118250, balance: 0.5842, color: "#F7931A" },
  { symbol: "ETH", name: "Ethereum", price: 4200, balance: 3.221, color: "#627EEA" },
  { symbol: "SOL", name: "Solana", price: 210, balance: 42.5, color: "#9945FF" },
  { symbol: "BNB", name: "BNB", price: 680, balance: 6.8, color: "#F3BA2F" },
  { symbol: "USDT", name: "Tether", price: 1, balance: 12500, color: "#26A17B" },
  { symbol: "USDC", name: "USD Coin", price: 1, balance: 8000, color: "#2775CA" },
  { symbol: "XRP", name: "XRP", price: 2.1, balance: 4200, color: "#00A4E4" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.35, balance: 15000, color: "#C2A633" },
  { symbol: "ADA", name: "Cardano", price: 0.85, balance: 3200, color: "#0033AD" },
  { symbol: "TRX", name: "TRON", price: 0.28, balance: 9000, color: "#EF0027" },
  { symbol: "AVAX", name: "Avalanche", price: 42, balance: 85, color: "#E84142" },
  { symbol: "LINK", name: "Chainlink", price: 24, balance: 210, color: "#2A5ADA" },
  { symbol: "DOT", name: "Polkadot", price: 8.5, balance: 340, color: "#E6007A" },
  { symbol: "MATIC", name: "Polygon", price: 0.75, balance: 5200, color: "#8247E5" },
  { symbol: "LTC", name: "Litecoin", price: 115, balance: 22, color: "#345D9D" },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.000025, balance: 500000000, color: "#FFA409" },
  { symbol: "UNI", name: "Uniswap", price: 9.5, balance: 150, color: "#FF007A" },
  { symbol: "ATOM", name: "Cosmos", price: 7.8, balance: 220, color: "#5064FB" },
  { symbol: "NEAR", name: "NEAR Protocol", price: 5.2, balance: 400, color: "#00EC97" },
  { symbol: "APT", name: "Aptos", price: 9.8, balance: 180, color: "#2DD8A7" },
  { symbol: "ARB", name: "Arbitrum", price: 0.85, balance: 3000, color: "#28A0F0" },
  { symbol: "OP", name: "Optimism", price: 2.1, balance: 1200, color: "#FF0420" },
  { symbol: "FIL", name: "Filecoin", price: 5.4, balance: 300, color: "#0090FF" },
  { symbol: "ICP", name: "Internet Computer", price: 10.2, balance: 150, color: "#29ABE2" },
  { symbol: "ETC", name: "Ethereum Classic", price: 26, balance: 90, color: "#328332" },
  { symbol: "BCH", name: "Bitcoin Cash", price: 480, balance: 12, color: "#8DC351" },
  { symbol: "ALGO", name: "Algorand", price: 0.18, balance: 8000, color: "#00C2A8" },
  { symbol: "VET", name: "VeChain", price: 0.045, balance: 40000, color: "#15BDFF" },
  { symbol: "SAND", name: "The Sandbox", price: 0.42, balance: 6000, color: "#00ADEF" },
  { symbol: "MANA", name: "Decentraland", price: 0.38, balance: 5000, color: "#FF2D55" },
];

export function getCoin(symbol) {
  return COINS.find((c) => c.symbol === symbol) || COINS[0];
}

const FEE_RATE = 0.001;
const SLIPPAGE = 0.5;

export function computeQuote(fromSymbol, toSymbol, amountInput) {
  const from = getCoin(fromSymbol);
  const to = getCoin(toSymbol);
  const amount = parseFloat(amountInput) || 0;

  const rate = to.price > 0 ? from.price / to.price : 0;
  const grossReceive = amount * rate;
  const fee = grossReceive * FEE_RATE;
  const netReceive = grossReceive - fee > 0 ? grossReceive - fee : 0;

  const notional = amount * from.price;
  const priceImpact = Math.min(0.35, notional / 4_000_000);

  return {
    from,
    to,
    amount,
    rate,
    fee,
    feeRate: FEE_RATE,
    slippage: SLIPPAGE,
    priceImpact,
    grossReceive,
    netReceive,
  };
}

const initialDraft = {
  fromCoin: "BTC",
  toCoin: "USDT",
  amount: "",
};

const ConvertContext = createContext(null);

export function useConvert() {
  const ctx = useContext(ConvertContext);
  if (!ctx) throw new Error("useConvert must be used inside the Convert flow");
  return ctx;
}

export default function Convert() {
  const [draft, setDraft] = useState(initialDraft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const updateDraft = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const resetDraft = () => setDraft(initialDraft);

  return (
    <ConvertContext.Provider value={{ draft, updateDraft, resetDraft }}>
      <div
        className={`fixed inset-0 z-50 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)" }}
      >
        <div
          className="pointer-events-none absolute -left-[12%] -top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: "#7C3AED" }}
        />
        <div
          className="pointer-events-none absolute -right-[12%] -bottom-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.14] blur-[110px]"
          style={{ background: "#2563EB" }}
        />

        <div className="relative z-10">
          <Routes>
            <Route index element={<ConvertForm />} />
            <Route path="select-from" element={<SelectCoin field="from" />} />
            <Route path="select-to" element={<SelectCoin field="to" />} />
            <Route path="review" element={<ConvertReview />} />
            <Route path="processing" element={<ConvertLoading />} />
            <Route path="success" element={<ConvertSuccess />} />
            <Route path="*" element={<Navigate to="/convert" replace />} />
          </Routes>
        </div>
      </div>
    </ConvertContext.Provider>
  );
}

export function ConvertHeader({ title, onBack, onClose, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#050816]/60 px-4 py-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onBack ? onBack : () => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
        aria-label="Back"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="text-[17px] font-bold text-white">{title}</h1>

      {right ? (
        right
      ) : onClose ? (
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <div className="h-10 w-10" />
      )}
    </div>
  );
}

export function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_30px_-14px_rgba(124,58,237,0.4)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/50 to-transparent" />
      {children}
    </div>
  );
}

/* Thick, pill-shaped primary button — matches the Transfer button style */
export function PrimaryButton({ children, onClick, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-6 text-[18px] font-extrabold text-white shadow-[0_14px_36px_-6px_rgba(124,58,237,0.65)] ring-1 ring-white/10 transition-all duration-150 active:scale-[0.97] active:shadow-[0_6px_18px_-4px_rgba(124,58,237,0.5)] ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:brightness-110 hover:shadow-[0_16px_42px_-4px_rgba(124,58,237,0.8)]"
      }`}
      style={{ height: 64, minHeight: 64 }}
    >
      {children}
    </button>
  );
}

const ICON_ID_OVERRIDES = {
  MATIC: "polygon",
};

export function CoinLogo({ coin, size = 36 }) {
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
