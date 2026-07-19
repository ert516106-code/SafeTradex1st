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
import CoinSelector from "./CoinSelector";
import RateInfo from "./RateInfo";

export default function ConvertForm() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useConvert();

  const [fromCoin, setFromCoin] = useState(draft.fromCoin);
  const [toCoin, setToCoin] = useState(draft.toCoin);
  const [amount, setAmount] = useState(draft.amount || "");
  const [spinning, setSpinning] = useState(false);
  const [focused, setFocused] = useState(false);

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

      <div className="flex flex-1 flex-col gap-5 px-4 pb-8 pt-6 sm:px-6">
        {/* Hero pair strip */}
        <div className="flex items-center justify-center gap-3 py-1">
          <div className="flex flex-col items-center gap-1.5">
            <CoinLogo coin={fromData} size={40} />
            <span className="text-[11.5px] font-semibold text-white/50">{fromData.symbol}</span>
          </div>
          <div
            className="mb-4 h-px w-10"
            style={{ background: `linear-gradient(90deg, ${fromData.color}, ${toData.color})` }}
          />
          <div className="flex flex-col items-center gap-1.5">
            <CoinLogo coin={toData} size={40} />
            <span className="text-[11.5px] font-semibold text-white/50">{toData.symbol}</span>
          </div>
        </div>

        <GlassCard className="!p-0 overflow-visible">
          <div
            className="h-1 w-full rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${fromData.color}, ${toData.color})` }}
          />

          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-bold uppercase tracking-wide text-white/40">You Pay</span>
              <span className="text-[11.5px] text-white/40">
                Available: <span className="font-semibold text-white/70">{fromData.balance} {fromCoin}</span>
              </span>
            </div>

            <div
              className={`mt-1 flex items-center gap-3 rounded-2xl border px-1 py-1 transition-colors ${
                focused === "amount" ? "border-[#7C3AED]/60" : "border-transparent"
              }`}
            >
              <CoinSelector label="Convert From" value={fromCoin} onChange={setFromCoin} exclude={toCoin} />
              <div className="flex flex-1 flex-col items-end">
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setFocused("amount")}
                  onBlur={() => setFocused(null)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-right text-[26px] font-extrabold text-white outline-none placeholder-white/25"
                />
                <button
                  type="button"
                  onClick={() => setAmount(String(fromData.balance))}
                  className="mt-1 rounded-full bg-[#7C3AED]/15 px-2.5 py-1 text-[10.5px] font-bold text-[#A78BFA] transition active:scale-90"
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center border-t border-white/5">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap coins"
              className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#0a0e20] bg-gradient-to-br from-[#7C3AED] to-[#2563EB] shadow-[0_0_24px_rgba(124,58,237,0.6)] transition active:scale-90"
            >
              <svg
                width="19"
                height="19"
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

          <div className="flex flex-col gap-1 p-4 pt-7">
            <span className="text-[11.5px] font-bold uppercase tracking-wide text-white/40">You Receive</span>

            <div className="flex items-center gap-3">
              <CoinSelector label="Convert To" value={toCoin} onChange={setToCoin} exclude={fromCoin} />
              <div className="flex-1 text-right text-[26px] font-extrabold text-[#A78BFA]">
                {numericAmount > 0 ? formatAmount(quote.netReceive, 6) : "0.00"}
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 rounded-b-2xl border-t border-white/5 py-2.5"
            style={{ background: "rgba(124,58,237,0.05)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-[#A78BFA]">
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] font-semibold text-white/60">
              1 {fromCoin} = {formatAmount(quote.rate, 2)} {toCoin}
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
              : "Continue"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
