import React from "react";
import { GlassCard, CoinLogo, formatAmount } from "../../pages/Convert";

export default function ConvertPreview({ quote }) {
  const { from, to, amount, netReceive } = quote;

  return (
    <GlassCard className="flex flex-col items-center gap-1 !p-5 text-center">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-white/40">You Pay</span>
      <span className="flex items-center gap-2 text-[22px] font-extrabold text-white">
        <CoinLogo coin={from} size={26} />
        {formatAmount(amount, 6)} {from.symbol}
      </span>

      <span className="my-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#7C3AED]/15 text-[#A78BFA]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-white/40">You Receive</span>
      <span className="flex items-center gap-2 text-[22px] font-extrabold text-[#A78BFA]">
        <CoinLogo coin={to} size={26} />
        {formatAmount(netReceive, 6)} {to.symbol}
      </span>
    </GlassCard>
  );
}
