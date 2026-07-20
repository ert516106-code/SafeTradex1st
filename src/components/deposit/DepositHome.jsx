import React from "react";
import { useNavigate } from "react-router-dom";
import { DepositHeader, GlassCard } from "../../pages/Deposit";

export default function DepositHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader
        title="Deposit"
        showBack={true}
        right={
          <button
            onClick={() => navigate("/deposit/history")}
            aria-label="Deposit History"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition active:scale-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-4 pb-10 pt-6 sm:px-6">
        <button type="button" onClick={() => navigate("/deposit/select-coin")} className="text-left">
          <GlassCard className="flex items-center gap-4 !p-5 transition-all duration-150 active:scale-[0.98] hover:bg-white/[0.06]">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_10px_28px_-8px_rgba(124,58,237,0.7)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-bold text-white">Deposit Cryptocurrency</span>
              <span className="mt-1 block text-[13px] leading-snug text-white/50">
                Transfer crypto from an external wallet.
              </span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GlassCard>
        </button>

        <button type="button" onClick={() => navigate("/deposit/buy")} className="text-left">
          <GlassCard className="flex items-center gap-4 !p-5 transition-all duration-150 active:scale-[0.98] hover:bg-white/[0.06]">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] shadow-[0_10px_28px_-8px_rgba(37,99,235,0.7)]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 7h18M3 7l2-4h14l2 4M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M9 12h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-bold text-white">Buy Cryptocurrency</span>
              <span className="mt-1 block text-[13px] leading-snug text-white/50">
                Purchase crypto using trusted third-party providers.
              </span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GlassCard>
        </button>
      </div>
    </div>
  );
}
