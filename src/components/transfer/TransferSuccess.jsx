import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransfer, getCoin } from "../../pages/Transfer";

export default function TransferSuccess() {
  const navigate = useNavigate();
  const { draft, resetDraft } = useTransfer();
  const [mounted, setMounted] = useState(false);

  const coin = getCoin(draft.coin);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleDone = () => {
    resetDraft();
    navigate("/home");
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center px-6 pb-10 text-center">
      <style>{`
        @keyframes stSuccessPop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes stSuccessRing {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-[#7C3AED]/40"
          style={{ animation: mounted ? "stSuccessRing 1.6s ease-out infinite" : "none" }}
        />
        <span
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_0_40px_rgba(124,58,237,0.55)]"
          style={{
            animation: mounted ? "stSuccessPop 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none",
          }}
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
        Transfer Successful
      </h1>

      {draft.amount && (
        <p
          className="mt-2 text-[14.5px] text-white/50 transition-all duration-500 delay-100"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
        >
          {draft.amount} {coin.symbol} has been sent successfully.
        </p>
      )}

      <div
        className="mt-10 w-full transition-all duration-500 delay-200"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(8px)" }}
      >
        <button
          onClick={handleDone}
          className="w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] py-4 text-[15px] font-bold text-white shadow-[0_10px_30px_-8px_rgba(124,58,237,0.6)] transition active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
