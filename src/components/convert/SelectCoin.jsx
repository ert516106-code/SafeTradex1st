import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COINS, CoinLogo, ConvertHeader, useConvert } from "../../pages/Convert";

export default function SelectCoin({ field }) {
  const navigate = useNavigate();
  const { draft, updateDraft } = useConvert();
  const [search, setSearch] = useState("");

  const excludeSymbol = field === "from" ? draft.toCoin : draft.fromCoin;
  const currentValue = field === "from" ? draft.fromCoin : draft.toCoin;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COINS.filter((c) => {
      if (c.symbol === excludeSymbol) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
    });
  }, [search, excludeSymbol]);

  const handleSelect = (symbol) => {
    updateDraft(field === "from" ? { fromCoin: symbol } : { toCoin: symbol });
    navigate(-1);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col">
      <ConvertHeader title="Select Token" />

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
          {filtered.map((c) => (
            <button
              key={c.symbol}
              onClick={() => handleSelect(c.symbol)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-all duration-150 active:scale-[0.98] ${
                c.symbol === currentValue
                  ? "bg-[#7C3AED]/12 ring-1 ring-[#7C3AED]/30"
                  : "hover:bg-white/[0.05]"
              }`}
            >
              <span className="flex items-center gap-4">
                <CoinLogo coin={c} size={42} />
                <span>
                  <span className="block text-[15px] font-semibold text-white">{c.name}</span>
                  <span className="block text-[12.5px] text-white/40">{c.symbol}</span>
                </span>
              </span>
              <span className="text-[13px] font-medium text-white/45">{c.balance}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
