import React, { useEffect, useState } from "react";
import { ACCOUNTS, AccountBadge, formatAmount } from "../../pages/Transfer";

export default function AccountSheet({ open, field, currentValue, excludeId, coinSymbol, onSelect, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [open]);
  if (!open) return null;
  const title = field === "from" ? "Select From Account" : "Select To Account";
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative mx-auto w-full max-w-lg overflow-hidden rounded-t-[28px] border-t border-white/10 bg-[#0c1226] shadow-[0_-24px_60px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/50 to-transparent" />
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-white/15" />
        </div>
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[16px] font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-150 active:scale-90"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-8 pt-2">
          {ACCOUNTS.map((account, i) => {
            const isSelected = account.id === currentValue;
            const isDisabled = account.id === excludeId;
            const balance = 0;
            return (
              <button
                key={account.id}
                disabled={isDisabled}
                onClick={() => onSelect(account.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${
                  isDisabled
                    ? "cursor-not-allowed opacity-35"
                    : "active:scale-[0.98] hover:bg-white/[0.05]"
                } ${isSelected ? "bg-[#7C3AED]/12 ring-1 ring-[#7C3AED]/30" : ""}`}
                style={{
                  transitionDelay: visible ? `${i * 40}ms` : "0ms",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                }}
              >
                <span className="flex items-center gap-3.5">
                  <AccountBadge account={account} size={44} />
                  <span>
                    <span className="block text-[15px] font-semibold text-white">{account.name}</span>
                    <span className="block text-[12px] text-white/40">{account.description}</span>
                  </span>
                </span>
                <span className="text-right text-[12.5px] font-medium text-white/45">
                  {formatAmount(balance, 4)} {coinSymbol}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
