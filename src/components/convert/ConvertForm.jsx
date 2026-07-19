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

export default function ConvertForm() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useConvert();

  const [fromCoin, setFromCoin] = useState(draft.fromCoin);
  const [toCoin, setToCoin] = useState(draft.toCoin);
  const [amount, setAmount] = useState(draft.amount || "");
  const [spinning, setSpinning] = useState(false);

  const fromData = getCoin(fromCoin);
  const toData = getCoin(toCoin);
  const numericAmount = parseFloat(amount) || 0;

  const quote = useMemo(() => computeQuote(fromCoin, toCoin, amount), [fromCoin, toCoin, amount]);
  const isValid = fromCoin !== toCoin && numericAmount > 0 && numericAmount <= fromData.balance;

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

      <div className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-6 sm:px-6">
        <GlassCard className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-white/45">You send</span>
            <CoinSelector label="Convert From" value={fromCoin} onChange={setFromCoin} exclude={toCoin} />
          </div>

          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent py-1 text-[30px] font-extrabold text-white outline-none placeholder-white/25"
          />

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/40">
              1 {fromCoin}: ${formatAmount(fromData.price, 2)}
            </span>
            <span className="flex items-center gap-2 text-[12px] text-white/40">
              Balance: {fromData.balance} {fromCoin}
              <button
                type="button"
                onClick={() => setAmount(String(fromData.balance))}
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

        <GlassCard className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-white/45">You receive</span>
            <CoinSelector label="Convert To" value={toCoin} onChange={setToCoin} exclude={fromCoin} />
          </div>

          <div className="w-full py-1 text-[30px] font-extrabold text-[#A78BFA]">
            {numericAmount > 0 ? formatAmount(quote.netReceive, 6) : "0.00"}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/40">
              1 {toCoin}: ${formatAmount(toData.price, 2)}
            </span>
            <span className="text-[12px] text-white/40">
              Balance: {toData.balance} {toCoin}
            </span>
          </div>
        </GlassCard>

        <RateInfo quote={quote} />

        <div className="mt-auto pt-2">
          <PrimaryButton onClick={handleContinue} disabled={!isValid}>
            {numericAmount === 0
              ? "Enter an amount"
              : numericAmount > fromData.balance
              ? "Insufficient balance"
              : "Convert"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
