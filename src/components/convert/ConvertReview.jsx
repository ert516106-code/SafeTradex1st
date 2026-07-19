import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConvertHeader, GlassCard, PrimaryButton, CoinLogo, computeQuote, useConvert, formatAmount } from "../../pages/Convert";

export default function ConvertReview() {
  const navigate = useNavigate();
  const { draft } = useConvert();
  const [confirming, setConfirming] = useState(false);

  const quote = useMemo(
    () => computeQuote(draft.fromCoin, draft.toCoin, draft.amount),
    [draft.fromCoin, draft.toCoin, draft.amount]
  );

  const { from, to, amount, rate, fee, netReceive } = quote;

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      navigate("/convert/success");
    }, 900);
  };

  if (!draft.amount) {
    return (
      <div className="mx-auto flex min-h-full max-w-lg flex-col">
        <ConvertHeader title="Review Convert" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-[14px] text-white/50">No conversion details found.</p>
          <button onClick={() => navigate("/convert")} className="text-[13px] font-semibold text-[#A78BFA]">
            Start a new conversion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <ConvertHeader title="Review Convert" />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex items-center gap-2">
            <CoinLogo coin={from} size={40} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <CoinLogo coin={to} size={40} />
          </div>
          <p className="text-[26px] font-extrabold text-white">
            {formatAmount(amount, 6)} <span className="text-white/40">{from.symbol}</span>
          </p>
          <span className="rounded-full bg-white/5 px-3 py-1 text-[11.5px] font-semibold text-white/50">
            {from.symbol} → {to.symbol}
          </span>
        </div>

        <GlassCard className="flex flex-col gap-3 !p-4">
          <Row label="From" value={`${from.name} (${from.symbol})`} />
          <Row label="To" value={`${to.name} (${to.symbol})`} />
          <Row label="Amount" value={`${formatAmount(amount, 6)} ${from.symbol}`} />
          <Row label="Exchange Rate" value={`1 ${from.symbol} = ${formatAmount(rate, 2)} ${to.symbol}`} />
          <Row label="Fee" value={`${formatAmount(fee, 6)} ${to.symbol}`} />
          <Row label="Estimated Receive" value={`${formatAmount(netReceive, 6)} ${to.symbol}`} highlight />
        </GlassCard>

        <div className="mt-auto pt-2">
          <PrimaryButton onClick={handleConfirm} disabled={confirming}>
            {confirming ? "Processing..." : "Confirm Convert"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="shrink-0 text-[12.5px] text-white/45">{label}</span>
      <span className={`text-right text-[13px] font-semibold ${highlight ? "text-[#A78BFA]" : "text-white/85"}`}>
        {value}
      </span>
    </div>
  );
}
