import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConvertHeader,
  GlassCard,
  PrimaryButton,
  CoinLogo,
  getCoin,
  computeQuote,
  useConvert,
  formatAmount,
} from "../../pages/Convert";
import RateInfo from "./RateInfo";

function CoinPill({ coin, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-2.5 transition active:scale-95"
    >
      <CoinLogo coin={coin} size={22} />
      <span className="text-[13.5px] font-bold text-white">{coin.symbol}</span>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white/40">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function ConvertForm() {
  const navigate = useNavigate();
  const { 
    draft, 
    updateDraft, 
    getBalanceForCoin,
    prices,
    loadingBalances,
    loadingPrices
  } = useConvert();
  const [spinning, setSpinning] = useState(false);

  const fromData = getCoin(draft.fromCoin);
  const toData = getCoin(draft.toCoin);
  const numericAmount = parseFloat(draft.amount) || 0;
  
  // Get REAL balances from Supabase
  const fromBalance = getBalanceForCoin(draft.fromCoin);
  const toBalance = getBalanceForCoin(draft.toCoin);
  
  // Get REAL prices
  const fromPrice = prices[draft.fromCoin] || 0;
  const toPrice = prices[draft.toCoin] || 0;

  const quote = useMemo(
    () => computeQuote(draft.fromCoin, draft.toCoin, draft.amount, prices),
    [draft.fromCoin, draft.toCoin, draft.amount, prices]
  );
  
  const isValid = draft.fromCoin !== draft.toCoin && numericAmount > 0 && numericAmount <= fromBalance;

  const handleSwap = () => {
    setSpinning(true);
    updateDraft({ fromCoin: draft.toCoin, toCoin: draft.fromCoin });
    setTimeout(() => setSpinning(false), 420);
  };

  const handleContinue = () => {
    if (!isValid) return;
    navigate("/convert/review");
  };

  if (loadingBalances || loadingPrices) {
    return (
      <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-white/60">Loading your balances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <ConvertHeader title="Convert" onClose={() => navigate(-1)} />

      <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-6 sm:px-6">
        <GlassCard className="flex flex-col items-center gap-2 !py-6 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="text-[13px] font-medium text-white/45">You send</span>
            <CoinPill coin={fromData} onClick={() => navigate("/convert/select-from")} />
          </div>

          <input
            type="number"
            inputMode="decimal"
            value={draft.amount}
            onChange={(e) => updateDraft({ amount: e.target.value })}
            placeholder="0"
            className="w-full bg-transparent py-2 text-center text-[52px] font-extrabold leading-none text-white outline-none placeholder-white/20"
          />

          <div className="flex w-full items-center justify-between">
            <span className="text-[12px] text-white/40">1 {draft.fromCoin}: ${formatAmount(fromPrice, 2)}</span>
            <span className="flex items-center gap-2 text-[12px] text-white/40">
              Balance: {formatAmount(fromBalance)}
              <button
                type="button"
                onClick={() => updateDraft({ amount: String(fromBalance) })}
                className="rounded-full bg-[#7C3AED]/15 px-2 py-0.5 text-[10.5px] font-bold text-[#A78BFA] transition active:scale-90"
              >
                MAX
              </button>
            </span>
          </div>
        </GlassCard>

        <div className="-my-5 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap coins"
            className="z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#0a0e20] bg-[#161b33] text-white/70 shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition active:scale-90"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-500 ease-out"
              style={{ transform: spinning ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M7 11V4m0 0L4 7m3-3l3 3M17 13v7m0 0l3-3m-3 3l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <GlassCard className="flex flex-col items-center gap-2 !py-6 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="text-[13px] font-medium text-white/45">You receive</span>
            <CoinPill coin={toData} onClick={() => navigate("/convert/select-to")} />
          </div>

          <div className="w-full py-2 text-center text-[52px] font-extrabold leading-none text-[#A78BFA]">
            {numericAmount > 0 ? formatAmount(quote.netReceive, 6) : "0"}
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="text-[12px] text-white/40">1 {draft.toCoin}: ${formatAmount(toPrice, 2)}</span>
            <span className="text-[12px] text-white/40">Balance: {formatAmount(toBalance)}</span>
          </div>
        </GlassCard>

        <RateInfo quote={quote} />

        <div className="mt-auto pt-2">
          <PrimaryButton onClick={handleContinue} disabled={!isValid}>
            {numericAmount === 0
              ? "Enter an amount"
              : numericAmount > fromBalance
              ? "Insufficient balance"
              : "Convert"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
