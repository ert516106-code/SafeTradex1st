import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Wallet, CandlestickChart, LineChart, PiggyBank } from "lucide-react";
import { GlassCard, PrimaryButton, CoinLogo, COINS, getCoin, formatAmount } from "./Convert";
import TransferForm from "../components/transfer/TransferForm";
import TransferCoinSelector from "../components/transfer/TransferCoinSelector";
import TransferSuccess from "../components/transfer/TransferSuccess";
import TransferHistory from "../components/transfer/TransferHistory";

/* ------------------------------------------------------------------ */
/*  Internal account-to-account transfer (Funding / Spot / Futures /   */
/*  Earn). Not a blockchain transfer — no address, network, or fee.    */
/*  Mount as: <Route path="/transfer/*" element={<Transfer />} />      */
/*  Future-ready to be wired to real account balances/backend.          */
/* ------------------------------------------------------------------ */

export const ACCOUNTS = [
  { id: "funding", name: "Funding", description: "Deposits & external funds", color: "#2563EB", icon: Wallet },
  { id: "spot", name: "Spot", description: "Trade on the spot market", color: "#7C3AED", icon: CandlestickChart },
  { id: "futures", name: "Futures", description: "Derivatives trading", color: "#F97316", icon: LineChart },
  { id: "earn", name: "Earn", description: "Staking & savings", color: "#22C55E", icon: PiggyBank },
];

export function getAccount(id) {
  return ACCOUNTS.find((a) => a.id === id) || ACCOUNTS[0];
}

/* Deterministic mock balance per account + coin, so numbers stay stable  */
/* across re-renders without needing a backend yet.                       */
export function getMockBalance(accountId, coinSymbol) {
  const seed = `${accountId}-${coinSymbol}`
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const base = ((seed * 37) % 5000) / 100; // 0 - 50.00 range
  return Math.round(base * 10000) / 10000;
}

/* Mock transfer history. Future-ready to be replaced with real data      */
/* from the backend / Admin Dashboard.                                     */
export const MOCK_TRANSFER_HISTORY = [
  { id: "t1", coinSymbol: "USDT", fromAccount: "funding", toAccount: "spot", amount: "250.00", date: "2026-07-19T16:42:00Z", status: "Completed" },
  { id: "t2", coinSymbol: "BTC", fromAccount: "spot", toAccount: "futures", amount: "0.0350", date: "2026-07-18T09:15:00Z", status: "Completed" },
  { id: "t3", coinSymbol: "ETH", fromAccount: "futures", toAccount: "funding", amount: "1.1200", date: "2026-07-16T21:03:00Z", status: "Completed" },
  { id: "t4", coinSymbol: "USDT", fromAccount: "earn", toAccount: "spot", amount: "500.00", date: "2026-07-14T12:27:00Z", status: "Completed" },
  { id: "t5", coinSymbol: "SOL", fromAccount: "spot", toAccount: "earn", amount: "6.4000", date: "2026-07-11T07:58:00Z", status: "Pending" },
  { id: "t6", coinSymbol: "USDC", fromAccount: "funding", toAccount: "futures", amount: "120.00", date: "2026-07-08T18:34:00Z", status: "Completed" },
];

const initialDraft = {
  fromAccount: "funding",
  toAccount: "spot",
  coinSymbol: "USDT",
  amount: "",
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

        {/* FIXED: Added inline style for centering */}
        <div className="relative z-10 mx-auto w-full max-w-[520px]" style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "520px", width: "100%" }}>
          <Routes>
            <Route index element={<TransferForm />} />
            <Route path="select-coin" element={<TransferCoinSelector />} />
            <Route path="history" element={<TransferHistory />} />
            <Route path="success" element={<TransferSuccess />} />
            <Route path="*" element={<Navigate to="/transfer" replace />} />
          </Routes>
        </div>
      </div>
    </TransferContext.Provider>
  );
}

export function TransferHeader({ title, onBack, right = null }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#050816]/60 px-4 py-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onBack ? onBack : () => navigate(-1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-150 active:scale-90"
        aria-label="Back"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 className="text-[17px] font-bold text-white">{title}</h1>

      {right ? right : <div className="h-10 w-10" />}
    </div>
  );
}

export function AccountBadge({ account, size = 44 }) {
  const Icon = account.icon;
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${account.color}33, ${account.color}14)`,
        border: `1px solid ${account.color}40`,
      }}
    >
      {Icon ? (
        <Icon size={Math.round(size * 0.46)} color={account.color} strokeWidth={2.25} />
      ) : (
        <span className="font-extrabold text-white" style={{ fontSize: size * 0.34 }}>
          {account.name.slice(0, 1)}
        </span>
      )}
    </button>
  );
}

export { GlassCard, PrimaryButton, CoinLogo, COINS, getCoin, formatAmount };
