import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TransferHeader,
  GlassCard,
  PrimaryButton,
  CoinLogo,
  getCoin,
  getAccount,
  formatAmount,
  useTransfer,
  AccountBadge,
} from "../../pages/Transfer";
import AccountSheet from "./AccountSheet";

function AccountPill({ label, accountId, onClick, delay }) {
  const account = getAccount(accountId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition-all duration-200 hover:bg-white/[0.07] active:scale-[0.98]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.4s ease, transform 0.4s ease, background-color 0.2s ease",
      }}
    >
      <span className="flex items-center gap-3.5">
        <AccountBadge account={account} size={40} />
        <span>
          <span className="block text-[11.5px] font-semibold uppercase tracking-wide text-white/40">
            {label}
          </span>
          <span className="block text-[15.5px] font-bold text-white">{account.name}</span>
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function TransferForm() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTransfer();
  const [sheetField, setSheetField] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const coin = getCoin(draft.coinSymbol);
  const fromAccount = getAccount(draft.fromAccount);
  const toAccount = getAccount(draft.toAccount);
  const numericAmount = parseFloat(draft.amount) || 0;

  // Balances are not yet wired to a backend.
  const availableBalance = 0;

  const sameAccount = draft.fromAccount === draft.toAccount;
  const isValid = !sameAccount && numericAmount > 0 && numericAmount <= availableBalance;

  const handleSwap = () => {
    setSwapping(true);
    updateDraft({ fromAccount: draft.toAccount, toAccount: draft.fromAccount });
    setTimeout(() => setSwapping(false), 420);
  };

  const handleMax = () => {
    updateDraft({ amount: String(availableBalance) });
  };

  const handleConfirm = () => {
    if (!isValid) return;
    navigate("/transfer/success");
  };

  const handleSheetSelect = (accountId) => {
    if (sheetField === "from") updateDraft({ fromAccount: accountId });
    else if (sheetField === "to") updateDraft({ toAccount: accountId });
    setSheetField(null);
  };

  let buttonLabel = "Confirm Transfer";
  if (sameAccount) buttonLabel = "Select different accounts";
  else if (numericAmount === 0) buttonLabel = "Enter an amount";
  else if (numericAmount > availableBalance) buttonLabel = "Insufficient balance";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <TransferHeader
        title="Transfer"
        right={
          <button
            onClick={() => navigate("/transfer/history")}
            aria-label="Transfer History"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-150 active:scale-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
        <div className="relative flex flex-col gap-3">
          <AccountPill label="From" accountId={draft.fromAccount} onClick={() => setSheetField("from")} delay={40} />

          <div className="-my-4 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap accounts"
              className="z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#0a0e20] bg-[#161b33] text-white/70 shadow-[0_4px_14px_rgba(0,0,0,0.4)] transition-all duration-200 active:scale-90"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform duration-500 ease-out"
                style={{ transform: swapping ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path
                  d="M7 11V4m0 0L4 7m3-3l3 3M17 13v7m0 0l3-3m-3 3l-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <AccountPill label="To" accountId={draft.toAccount} onClick={() => setSheetField("to")} delay={90} />
        </div>

        {sameAccount && (
          <p className="-mt-2 px-1 text-[12px] font-medium text-[#FF5C7A]">
            From and To accounts must be different.
          </p>
        )}

        <GlassCard
          className="flex flex-col items-center gap-2 !py-6 text-center transition-all duration-500"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)" }}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-[13px] font-medium text-white/45">Amount</span>
            <button
              type="button"
              onClick={() => navigate("/transfer/select-coin")}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] py-1.5 pl-1.5 pr-2.5 transition-all duration-150 active:scale-95"
            >
              <CoinLogo coin={coin} size={22} />
              <span className="text-[13.5px] font-bold text-white">{coin.symbol}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white/40">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
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
            <span className="text-[12px] text-white/40">
              Available: {formatAmount(availableBalance, 6)} {coin.symbol}
            </span>
            <button
              type="button"
              onClick={handleMax}
              className="rounded-full bg-[#7C3AED]/15 px-2.5 py-1 text-[10.5px] font-bold text-[#A78BFA] transition-all duration-150 active:scale-90"
            >
              MAX
            </button>
          </div>
        </GlassCard>

        <GlassCard
          className="flex flex-col gap-2.5 !p-4 transition-all duration-500 delay-100"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)" }}
        >
          <Row label="From" value={fromAccount.name} />
          <Row label="To" value={toAccount.name} />
          <Row label="Network Fee" value="None" />
        </GlassCard>

        <div
          className="mt-auto pt-2 transition-all duration-500 delay-150"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)" }}
        >
          <PrimaryButton onClick={handleConfirm} disabled={!isValid}>
            {buttonLabel}
          </PrimaryButton>
        </div>
      </div>

      <AccountSheet
        open={sheetField !== null}
        field={sheetField}
        currentValue={sheetField === "from" ? draft.fromAccount : draft.toAccount}
        excludeId={sheetField === "from" ? draft.toAccount : draft.fromAccount}
        coinSymbol={draft.coinSymbol}
        onSelect={handleSheetSelect}
        onClose={() => setSheetField(null)}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
      <span className="text-[12.5px] text-white/45">{label}</span>
      <span className="text-[13px] font-semibold text-white/85">{value}</span>
    </div>
  );
}
