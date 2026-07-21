import React from "react";
import { useNavigate } from "react-router-dom";
import { WithdrawHeader, GlassCard, IconBadge } from "../../pages/Withdraw";

export default function WithdrawHome() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <WithdrawHeader title="Withdraw" onClose={() => navigate(-1)} showFlowSwitch />

      <div className="px-4 pt-6 sm:px-6">
        <h2 className="text-[20px] font-extrabold text-white">Where to?</h2>
        <p className="mt-1.5 text-[13px] text-white/45">
          Choose how you'd like to move your assets.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-4 pb-10 pt-6 sm:px-6">
        <button type="button" onClick={() => navigate("/withdraw/internal")} className="text-left">
          <GlassCard
            accent="purple"
            className="flex items-center gap-4 !p-5 transition-all duration-150 active:scale-[0.98] hover:bg-white/[0.06]"
          >
            <IconBadge accent="purple" size={56}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 7h10m0 0l-3-3m3 3l-3 3M17 17H7m0 0l3 3m-3-3l3-3"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconBadge>

            <span className="flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-white">Internal Withdraw</span>
                <span className="rounded-full bg-[#8B5CF6]/20 px-2 py-0.5 text-[10.5px] font-bold text-[#C4B5FD]">
                  Instant · Free
                </span>
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-white/50">
                Send crypto instantly to another SafeTrade user.
              </span>
            </span>

            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GlassCard>
        </button>

        <button type="button" onClick={() => navigate("/withdraw/external")} className="text-left">
          <GlassCard
            accent="blue"
            className="flex items-center gap-4 !p-5 transition-all duration-150 active:scale-[0.98] hover:bg-white/[0.06]"
          >
            <IconBadge accent="blue" size={56}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8.5" stroke="#fff" strokeWidth="2" />
                <path
                  d="M3.5 12h17M12 3.5c2.2 2.3 3.4 5.2 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.2-3.4-8.5S9.8 5.8 12 3.5z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </IconBadge>

            <span className="flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-white">External Withdraw</span>
                <span className="rounded-full bg-[#3B82F6]/20 px-2 py-0.5 text-[10.5px] font-bold text-[#93C5FD]">
                  Network fee
                </span>
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-white/50">
                Send crypto to another exchange or blockchain wallet.
              </span>
              <span className="mt-1.5 block text-[12px] text-white/35">
                Estimated fee: ~$0.50–2.00 depending on network
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
