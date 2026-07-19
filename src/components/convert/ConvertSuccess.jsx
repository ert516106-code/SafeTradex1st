import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinLogo, computeQuote, useConvert, formatAmount } from "../../pages/Convert";

export default function ConvertSuccess() {
  const navigate = useNavigate();
  const { draft, resetDraft } = useConvert();
  const [mounted, setMounted] = useState(false);

  const quote = useMemo(
    () => computeQuote(draft.fromCoin, draft.toCoin, draft.amount),
    [draft.fromCoin, draft.toCoin, draft.amount]
  );
  const { from, to, amount, netReceive } = quote;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleDone = () => {
    resetDraft();
    navigate("/home");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 pb-10 text-center">
      <style>{`
        @keyframes cvSuccessPop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes cvSuccessRing {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/40"
          style={{ animation: mounted ? "cvSuccessRing 1.6s ease-out infinite" : "none" }}
        />
        <span
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_0_40px_rgba(124,58,237,0.55)]"
          style={{ animation: mounted ? "cvSuccessPop 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none" }}
        >
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <h1
        className="text-[22px] font-extrabold text-white transition-all duration-500"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
      >
        Conversion Successful
      </h1>

      {draft.amount && (
        <div
          className="mt-5 flex flex-col items-center gap-2 transition-all duration-500 delay-100"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
        >
          <span className="flex items-center gap-2 text-[18px] font-bold text-white">
            <CoinLogo coin={from} size={26} />
            {formatAmount(amount, 6)} {from.symbol}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M12 4v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex items-center gap-2 text-[18px] font-bold text-[#A78BFA]">
            <CoinLogo coin={to} size={26} />
            {formatAmount(netReceive, 6)} {to.symbol}
          </span>
        </div>
      )}

      <div
        className="mt-10 w-full transition-all duration-500 delay-200"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
      >
        <button
          onClick={handleDone}
          className="w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] py-5 text-[17px] font-bold text-white shadow-[0_12px_32px_-6px_rgba(124,58,237,0.65)] ring-1 ring-white/10 transition-all duration-150 hover:brightness-110 hover:shadow-[0_14px_38px_-4px_rgba(124,58,237,0.8)] active:scale-[0.97] active:shadow-[0_6px_18px_-4px_rgba(124,58,237,0.5)]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
