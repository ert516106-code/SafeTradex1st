import React from "react";
import { BUY_PROVIDERS, DepositHeader, GlassCard } from "../../pages/Deposit";

export default function BuyCryptoProviders() {
  const handleOpenProvider = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader title="Buy Cryptocurrency" />

      <div className="flex flex-1 flex-col gap-3 px-4 pb-10 pt-6 sm:px-6">
        {BUY_PROVIDERS.map((provider) => (
          <button key={provider.id} type="button" onClick={() => handleOpenProvider(provider.url)} className="text-left">
            <GlassCard className="flex items-center gap-4 !p-4 transition-all duration-150 hover:bg-white/[0.06] active:scale-[0.98]">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[16px] font-extrabold text-white"
                style={{ background: provider.color }}
              >
                {provider.name.slice(0, 1)}
              </span>
              <span className="flex-1 text-[15.5px] font-bold text-white">{provider.name}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/40">
                <path
                  d="M14 5h5v5M19 5l-8 8M9 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </GlassCard>
          </button>
        ))}
      </div>
    </div>
  );
}
