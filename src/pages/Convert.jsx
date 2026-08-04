import React from "react";
import { useNavigate } from "react-router-dom";
import { useConvert, ConvertHeader, GlassCard, PrimaryButton, formatAmount, getCoin } from "../../pages/Convert";

const toast = {
  success: (message) => { console.log('✅', message); alert(message); },
  error: (message) => { console.error('❌', message); alert(message); }
};

export default function ConvertReview() {
  const navigate = useNavigate();
  const { 
    draft, 
    convert, 
    conversionLoading, 
    getBalanceForCoin,
    prices,
    userId
  } = useConvert();
  
  const { fromCoin, toCoin, amount } = draft;

  const numAmount = parseFloat(amount) || 0;
  const fromCoinData = getCoin(fromCoin);
  const toCoinData = getCoin(toCoin);
  const availableBalance = getBalanceForCoin(fromCoin);
  const fromPrice = prices[fromCoin] || 0;
  const toPrice = prices[toCoin] || 0;

  const rate = toPrice > 0 ? fromPrice / toPrice : 0;
  const grossReceive = numAmount * rate;
  const fee = grossReceive * 0.001;
  const netReceive = grossReceive - fee > 0 ? grossReceive - fee : 0;

  const handleConfirm = async () => {
    if (!userId) {
      toast.error("You must be logged in to convert");
      return;
    }

    if (numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numAmount > availableBalance) {
      toast.error(`Insufficient ${fromCoin} balance. Available: ${formatAmount(availableBalance)} ${fromCoin}`);
      return;
    }

    if (netReceive <= 0) {
      toast.error("Conversion amount too low. Please try a larger amount.");
      return;
    }

    const success = await convert();
    if (success) {
      navigate("/convert/success");
    }
  };

  const handleBack = () => {
    navigate("/convert");
  };

  if (!prices || Object.keys(prices).length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-white">Loading prices...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ConvertHeader title="Review Conversion" onBack={handleBack} />

      <div className="flex-1 px-4 py-6">
        <GlassCard className="mb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-slate-400">From</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{formatAmount(numAmount)}</span>
                <span className="text-sm font-semibold text-slate-300">{fromCoin}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-slate-400">To</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400">{formatAmount(netReceive)}</span>
                <span className="text-sm font-semibold text-slate-300">{toCoin}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-slate-400">Rate</span>
              <span className="font-semibold text-white">
                1 {fromCoin} ≈ {formatAmount(rate)} {toCoin}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-slate-400">Price</span>
              <span className="font-semibold text-white">
                1 {fromCoin} = ${formatAmount(fromPrice, 2)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm text-slate-400">Fee (0.1%)</span>
              <span className="font-semibold text-rose-400">{formatAmount(fee)} {toCoin}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Available Balance</span>
              <span className="font-semibold text-white">
                {formatAmount(availableBalance)} {fromCoin}
              </span>
            </div>
          </div>
        </GlassCard>

        <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 mb-6">
          <p className="text-sm text-yellow-400">
            ⚠️ Please review the details carefully. This conversion cannot be undone.
          </p>
        </div>

        <PrimaryButton
          onClick={handleConfirm}
          disabled={conversionLoading || numAmount <= 0 || netReceive <= 0 || !userId}
        >
          {conversionLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Confirm Conversion`
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}
