const MODES = [
  { key: 'spot', label: 'Spot Trading' },
  { key: 'futures', label: 'Futures Trading' },
  { key: 'options', label: 'Options Trading' },
];

export default function TradingModeSelector({ mode, onChange }) {
  return (
    <div className="flex gap-1 px-4 overflow-x-auto border-b border-border">
      {MODES.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            mode === m.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
