import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPOSIT_COINS, DepositCoinLogo, DepositHeader, useDeposit } from "../../pages/Deposit";

export default function CoinSelector() {
  const navigate = useNavigate();
  const { updateSelection } = useDeposit();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DEPOSIT_COINS;
    return DEPOSIT_COINS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (coin) => {
    updateSelection({ coin, networkId: null });
    navigate("/deposit/select-network");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <DepositHeader title="Select Coin" />

      <div className="px-5 pb-4 pt-6 sm:px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 transition focus-within:border-[#7C3AED]/50 focus-within:bg-white/[0.07]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/35">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or symbol"
            className="w-full bg-transparent text-[14.5px] text-white placeholder-white/30 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 sm:px-5">
        {filtered.length === 0 && (
          <p className="px-2 py-14 text-center text-[13.5px] text-white/40">No coins found.</p>
        )}

        <div className="flex flex-col gap-1.5">
          {filtered.map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => handleSelect(coin)}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-all duration-150 hover:bg-white/[0.05] active:scale-[0.98]"
            >
              <span className="flex items-center gap-4">
                <DepositCoinLogo coin={coin} size={42} />
                <span>
                  <span className="block text-[15px] font-semibold text-white">{coin.symbol}</span>
                  <span className="block text-[12.5px] text-white/40">{coin.name}</span>
                </span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/30">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
