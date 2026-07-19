import React from "react";
import { GlassCard, formatAmount } from "../../pages/Convert";

export default function RateInfo({ quote }) {
  const { from, to, rate, feeRate, priceImpact, slippage } = quote;

  return (
    <GlassCard className="flex flex-col gap-3">
      <Row label="Current Rate" value={`1 ${from.symbol} = ${formatAmount(rate, 2)} ${to.symbol}`} />
      <Row label="Network Fee" value={`${(feeRate * 100).toFixed(2)}%`} />
      <Row label="Price Impact" value={`${priceImpact < 0.01 ? "< 0.01" : priceImpact.toFixed(2)}%`} />
      <Row label="Estimated Time" value="Instant" />
      <Row label="Slippage" value={`${slippage.toFixed(1)}%`} />
    </GlassCard>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] text-white/45">{label}</span>
      <span className="text-[13px] font-semibold text-white/85">{value}</span>
    </div>
  );
}
