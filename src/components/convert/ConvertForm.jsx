import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ConvertHeader,
  GlassCard,
  PrimaryButton,
  getCoin,
  computeQuote,
  useConvert,
  formatAmount,
} from "../../pages/Convert";
import CoinSelector from "./CoinSelector";
import RateInfo from "./RateInfo";
import ConvertPreview from "./ConvertPreview";

export default function ConvertForm() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useConvert();

  const [fromCoin, setFromCoin] = useState(draft.fromCoin);
  const [toCoin, setToCoin] = useState(draft.toCoin);
  const [amount, setAmount] = useState(draft.amount || "");
  const [spinning, setSpinning] = useState(false);

  const fromBalance = getCoin(fromCoin).balance;
  const numericAmount = parseFloat(amount) || 0;

  const quote = useMemo(() => computeQuote(fromCoin, toCoin, amount), [fromCoin, toCoin, amount]);

  const isValid = fromCoin !== toCoin && numericAmount > 0 && numericAmount <= fromBalance;

  const handleSwap = () => {
    setSpinning(true);
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setTimeout(() => setSpinning(false), 420);
  };

  const handleContinue = () => {
    if (!isValid) return;
    updateDraft({ fromCoin, toCoin, amount });
    navigate("/convert/review");
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <ConvertHeader title="Convert" onClose={() => navigate(-1)} />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        <GlassCard className="flex flex-col gap-2 !p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white/45">From</span>
            <span className="text-[11.5px] text-white/40">
              Available: <span className="text-white/70">{fromBalance} {fromCoin}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CoinSelector label="Convert From" value={fromCoin} onChange={setFromCoin} exclude={toCoin} />
            <div className="flex flex-1 flex-col items-end">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-[24px] font-extrabold text-white outline-none placeholder-white/25"
              />
              <button
                type="button"
                onClick={() => setAmount(String(fromBalance))}
                className="mt-1 rounded-full bg-[#7C3AED]/15 px-2.5 py-1 text-[10.5px] font-bold text-[#A78BFA]"
              >
                MAX
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="-my-3 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap coins"
            className="z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_0_20px_rgba(124,58,237,0.55)] transition active:scale-90"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white transition-transform duration-500 ease-out"
              style={{ transform: spinning ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path
                d="M7 10l-3-3 3-3M4 7h11a4 4 0 014 4M17 14l3 3-3 3M20 17H9a4 4 0 01-4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <GlassCard className="flex flex-col gap-2 !p-4">
          <span className="text-[12px] font-semibold text-white/45">To</span>

          <div className="flex items-center gap-3">
            <CoinSelector label="Convert To" value={toCoin} onChange={setToCoin} exclude={fromCoin} />
            <div className="flex-1 text-right text-[24px] font-extrabold text-[#A78BFA]">
              {numericAmount > 0 ? formatAmount(quote.netReceive, 6) : "0.00"}
            </div>
          </div>

          <p className="text-right text-[11.5px] text-white/40">
            1 {fromCoin} = {formatAmount(quote.rate, 2)} {toCoin}
          </p>
        </GlassCard>

        <RateInfo quote={quote} />

        {numericAmount > 0 && <ConvertPreview quote={quote} />}

        <div className="mt-auto pt-2">
          <PrimaryButton onClick={handleContinue} disabled={!isValid}>
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
