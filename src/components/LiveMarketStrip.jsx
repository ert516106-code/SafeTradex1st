import { useState, useEffect } from 'react';
import CoinLogo from './CoinLogo';
import { fetchLivePrices } from '@/lib/livePrices';

const STRIP_COINS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE'];
const FALLBACK = { BTC: 63638, ETH: 1673.64, SOL: 66.78, BNB: 605.07, XRP: 0.5124, DOGE: 0.1183 };

export default function LiveMarketStrip() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    let active = true;
    const load = () => fetchLivePrices(STRIP_COINS).then(data => { if (active) setPrices(data); });
    load();
    const interval = setInterval(load, 20000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 px-5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
        <span className="text-xs font-semibold text-muted-foreground">Live Market</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
        {STRIP_COINS.map(symbol => {
          const price = prices[symbol]?.price ?? FALLBACK[symbol];
          const change = prices[symbol]?.change ?? 0;
          const up = change >= 0;
          return (
            <div key={symbol} className="shrink-0 flex items-center gap-2 bg-secondary rounded-2xl px-3 py-2 min-w-[130px]">
              <CoinLogo symbol={symbol} size="sm" />
              <div>
                <p className="text-xs font-bold">{symbol}</p>
                <p className="text-xs font-semibold">
                  {price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
                </p>
                <p className={`text-[10px] font-medium ${up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {up ? '+' : ''}{change.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
