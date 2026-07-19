function CoinOptionRow({ coin, isActive, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(coin.symbol)}
      className={
        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-white/5" +
        (isActive ? " bg-[#7C3AED]/10" : "")
      }
    >
      <span className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: coin.color }}
        >
          {coin.symbol.slice(0, 1)}
        </span>
        <span>
          <span className="block text-[13.5px] font-semibold text-white">{coin.symbol}</span>
          <span className="block text-[11.5px] text-white/40">{coin.name}</span>
        </span>
      </span>
      <span className="text-[12px] text-white/40">{coin.balance}</span>
    </button>
  );
}

export function CoinSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = getCoin(value);

  const handleSelect = (symbol) => {
    onChange(symbol);
    setOpen(false);
  };

  const dropdownClass = open
    ? "absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0f24] p-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)]"
    : "hidden";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-left transition active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: selected.color }}
          >
            {selected.symbol.slice(0, 1)}
          </span>
          <span>
            <span className="block text-[14.5px] font-semibold text-white">{selected.symbol}</span>
            <span className="block text-[12px] text-white/40">{selected.name}</span>
          </span>
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className={open ? "text-white/50 transition-transform duration-200 rotate-180" : "text-white/50 transition-transform duration-200"}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={dropdownClass}>
        {COINS.map((c) => (
          <CoinOptionRow key={c.symbol} coin={c} isActive={c.symbol === value} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
