import React from "react";
import { useNavigate } from "react-router-dom";
import { DepositHeader, GlassCard, IconBadge } from "../../pages/Deposit";

export default function DepositHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-[#0f0e1d]">
      <DepositHeader
        title="Deposit"
        showBack={true}
        showFlowSwitch
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

      <div className="flex flex-1 flex-col px-4 pt-8 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Deposit</h1>
          <p className="mt-2 text-gray-400">Add funds to your SafeTradex wallet.</p>
          <p className="text-sm font-medium text-purple-400 mt-1">Choose your preferred deposit method.</p>
        </div>

        <div className="flex flex-col gap-5">
          <button type="button" onClick={() => navigate("/deposit/select-coin")} className="text-left group">
            <GlassCard
              accent="purple"
              className="flex items-center gap-5 !p-6 rounded-[28px] border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
              <IconBadge accent="purple" size={56} className="shrink-0 shadow-lg shadow-purple-500/20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </IconBadge>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[17px] font-bold text-white">Deposit Cryptocurrency</span>
                </div>
                <p className="text-[13px] leading-snug text-gray-400 mb-2">Transfer crypto from an external wallet securely.</p>
                <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full font-medium text-white/70 tracking-wide uppercase">Supported Networks</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </GlassCard>
          </button>

          <button type="button" onClick={() => navigate("/deposit/buy")} className="text-left group">
            <GlassCard
              accent="blue"
              className="flex items-center gap-5 !p-6 rounded-[28px] border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            >
              <IconBadge accent="blue" size={56} className="shrink-0 shadow-lg shadow-blue-500/20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h18M3 7l2-4h14l2 4M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M9 12h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </IconBadge>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[17px] font-bold text-white">Buy Cryptocurrency</span>
                </div>
                <p className="text-[13px] leading-snug text-gray-400 mb-2">Purchase crypto using trusted third-party providers.</p>
                <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full font-medium text-white/70 tracking-wide">VISA • MASTERCARD • APPLE PAY</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </GlassCard>
          </button>
        </div>

        <div className="mt-16">
          <h2 className="text-lg font-semibold text-white mb-5">Recent Deposits</h2>
          <div className="border border-white/5 bg-white/[0.02] rounded-[24px] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="font-medium text-white">No deposits yet</h3>
            <p className="text-gray-500 text-sm mt-1">Your completed deposits will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
