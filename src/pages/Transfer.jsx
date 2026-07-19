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
        className={`fixed inset-0 z-50 overflow-y-auto bg-[#050816] transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
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
    </TransferContext.Provider>
  );
}

export function TransferHeader({ title, onBack, onClose, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#050816]/90 px-4 py-4 backdrop-blur-md sm:px-6">
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

export function GlowCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[#7C3AED]/15 bg-gradient-to-b from-[#0b0f24] to-[#0a0e20] p-4 shadow-[0_0_30px_-10px_rgba(124,58,237,0.35)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled = false, type = "button" }) {
  const cls = disabled
    ? "w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] py-4 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition active:scale-[0.98] cursor-not-allowed opacity-40"
    : "w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] py-4 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition active:scale-[0.98] hover:brightness-110";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function FieldLabel({ children }) {
  return <label className="mb-2 block text-[12.5px] font-medium text-white/50">{children}</label>;
}

function CoinOptionRow({ coin, isActive, onSelect }) {
  const cls = isActive
    ? "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 bg-[#7C3AED]/10"
    : "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5";

  return (
    <button type="button" onClick={() => onSelect(coin.symbol)} className={cls}>
      <span className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: coin.color }}
        >
          {coin.symbol.slice(0, 1)}
        </span>
        <span>
          <span className="block text-[13.5px] font-semibold text-white">{coin.symbol}</span>
          <span className="block text-[11.5px] text-white/40">{coin.name}</span>
        </span>
      </span>
      <span className="text-[12px] text-white/40">{coin.balance}</span>
    </button>
  );
}

export function CoinSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = getCoin(value);

  const handleSelect = (symbol) => {
    onChange(symbol);
    setOpen(false);
  };

  const dropdownClass = open
    ? "absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0f24] p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
    : "hidden";

  const arrowClass = open
    ? "text-white/50 transition-transform duration-200 rotate-180"
    : "text-white/50 transition-transform duration-200";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-left transition active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: selected.color }}
          >
            {selected.symbol.slice(0, 1)}
          </span>
          <span>
            <span className="block text-[14.5px] font-semibold text-white">{selected.symbol}</span>
            <span className="block text-[12px] text-white/40">{selected.name}</span>
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={arrowClass}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={dropdownClass}>
        {COINS.map((c) => (
          <CoinOptionRow key={c.symbol} coin={c} isActive={c.symbol === value} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
