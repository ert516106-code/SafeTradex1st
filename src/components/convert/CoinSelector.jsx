import React, { useEffect, useMemo, useState } from "react";
import { COINS, CoinLogo } from "../../pages/Convert";

export default function CoinSelector({ label, value, onChange, exclude = null }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [search, setSearch] = useState("");

  const selected = COINS.find((c) => c.symbol === value) || COINS[0];

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [open]);

  // Lock the page in place while the sheet is open, so only the sheet's own
  // list scrolls — this is what was letting rows bleed through the form.
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prevPosition = style.position;
    const prevTop = style.top;
    const prevWidth = style.width;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    return () => {
      style.position = prevPosition;
      style.top = prevTop;
      style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
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
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] py-2.5 pl-2.5 pr-4 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] transition"
        style={{ transform: pressed ? "scale(0.96)" : "scale(1)" }}
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[15px] font-extrabold text-white"
          style={{ background: selected.color, boxShadow: `0 0 20px ${selected.color}55` }}
        >
          {selected.symbol.slice(0, 1)}
        </span>
        <span className="text-left">
          <span className="block text-[17px] font-extrabold leading-tight text-white">{selected.symbol}</span>
          <span className="block text-[11.5px] leading-tight text-white/45">{selected.name}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1 shrink-0 text-white/40">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999] flex items-end justify-center transition-colors duration-200"
          style={{ background: visible ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSheet();
          }}
        >
          <div
            className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.75)]"
            style={{
              background: "#0b0f24",
              height: "min(85vh, 680px)",
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex shrink-0 items-center justify-center pt-3">
              <div className="h-1 w-9 rounded-full bg-white/15" />
            </div>

            <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
              <h2 className="text-[18px] font-bold text-white">{label || "Select Coin"}</h2>
              <button
                onClick={closeSheet}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60 transition active:scale-90"
                aria-label="Close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="shrink-0 px-5 pb-4">
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/35">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or symbol"
                  className="w-full bg-transparent text-[14px] text-white placeholder-white/30 outline-none"
                />
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto overscroll-contain px-3 pb-6"
              style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
            >
              {filtered.length === 0 && (
                <p className="px-2 py-10 text-center text-[13.5px] text-white/40">No coins found.</p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => handleSelect(c.symbol)}
                  className={`mb-1 flex w-full items-center justify-between rounded-2xl px-3 py-3.5 text-left transition active:scale-[0.98] ${
                    c.symbol === value ? "bg-[#7C3AED]/12" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white"
                      style={{ background: c.color, boxShadow: `0 0 14px ${c.color}44` }}
                    >
                      {c.symbol.slice(0, 1)}
                    </span>
                    <span>
                      <span className="block text-[14.5px] font-semibold text-white">{c.name}</span>
                      <span className="block text-[12px] text-white/40">{c.symbol}</span>
                    </span>
                  </span>
                  <span className="text-[12.5px] font-medium text-white/45">{c.balance}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
