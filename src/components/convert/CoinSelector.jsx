import React, { useEffect, useMemo, useState } from "react";
import { COINS, CoinLogo } from "../../pages/Convert";

export default function CoinSelector({ label, value, onChange, exclude = null }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const selected = COINS.find((c) => c.symbol === value) || COINS[0];

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COINS.filter((c) => {
      if (exclude && c.symbol === exclude) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
    });
  }, [search, exclude]);

  const handleSelect = (symbol) => {
    onChange(symbol);
    closeSheet();
  };

  const closeSheet = () => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      setSearch("");
    }, 200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] py-2 pl-2 pr-3 transition active:scale-[0.97]"
      >
        <CoinLogo coin={selected} size={30} />
        <span className="text-left">
          <span className="block text-[14.5px] font-bold leading-tight text-white">{selected.symbol}</span>
          <span className="block text-[10.5px] leading-tight text-white/40">{selected.name}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-0.5 text-white/40">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center transition-colors duration-200"
          style={{ background: visible ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSheet();
          }}
        >
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.7)]"
            style={{
              background: "#0b0f24",
              height: "min(80vh, 620px)",
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-center justify-center pt-3">
              <div className="h-1 w-9 rounded-full bg-white/15" />
            </div>

            <div className="flex items-center justify-between px-5 pb-3 pt-3">
              <h2 className="text-[16px] font-bold text-white">{label || "Select Coin"}</h2>
              <button
                onClick={closeSheet}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coin"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13.5px] text-white placeholder-white/30 outline-none focus:border-[#7C3AED]/60"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-6">
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center text-[13px] text-white/40">No coins found.</p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => handleSelect(c.symbol)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5 active:scale-[0.98] ${
                    c.symbol === value ? "bg-[#7C3AED]/10" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <CoinLogo coin={c} size={34} />
                    <span>
                      <span className="block text-[13.5px] font-semibold text-white">{c.name}</span>
                      <span className="block text-[11.5px] text-white/40">{c.symbol}</span>
                    </span>
                  </span>
                  <span className="text-[12px] text-white/40">{c.balance}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
