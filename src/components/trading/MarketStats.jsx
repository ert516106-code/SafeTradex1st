import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Activity,
} from 'lucide-react';
import { formatPrice, formatCurrency } from '../../lib/tradingEngine';

const VOLUME_UPDATE_INTERVAL_MS = 1800;

const StatCard = React.memo(function StatCard({ icon: Icon, label, value, valueClass, sub, subClass }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-3.5 backdrop-blur-xl shadow-md shadow-black/10 transition-all hover:border-white/20">
      <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase tracking-wide mb-1.5">
        <Icon size={12} />
        {label}
      </div>
      <p className={`text-sm sm:text-base font-bold tabular-nums transition-colors duration-300 ${valueClass || 'text-white'}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-[10px] mt-0.5 font-medium tabular-nums ${subClass || 'text-white/30'}`}>
          {sub}
        </p>
      )}
    </div>
  );
});

const MarketStats = React.memo(function MarketStats({ currentPrice, previousPrice, coin = { symbol: 'BTC', name: 'Bitcoin' } }) {
  const dayOpenRef = useRef(previousPrice ?? currentPrice ?? 0);
  const [high, setHigh] = useState(currentPrice ?? 0);
  const [low, setLow] = useState(currentPrice ?? 0);
  const [volume, setVolume] = useState(() => (currentPrice || 0) * (900 + Math.random() * 500));
  const [flash, setFlash] = useState(null); // 'up' | 'down' | null

  const isMountedRef = useRef(true);
  const volumeIntervalRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const lastPriceRef = useRef(currentPrice);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset baseline stats whenever the coin changes
  useEffect(() => {
    dayOpenRef.current = previousPrice ?? currentPrice ?? 0;
    setHigh(currentPrice ?? 0);
    setLow(currentPrice ?? 0);
    setVolume((currentPrice || 0) * (900 + Math.random() * 500));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin?.symbol]);

  // Track high/low and flash direction as price changes
  useEffect(() => {
    if (currentPrice === undefined || currentPrice === null || Number.isNaN(currentPrice)) return;

    setHigh((prev) => (prev === 0 ? currentPrice : Math.max(prev, currentPrice)));
    setLow((prev) => (prev === 0 ? currentPrice : Math.min(prev, currentPrice)));

    if (lastPriceRef.current !== undefined) {
      if (currentPrice > lastPriceRef.current) {
        setFlash('up');
      } else if (currentPrice < lastPriceRef.current) {
        setFlash('down');
      }
    }
    lastPriceRef.current = currentPrice;

    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) setFlash(null);
    }, 900);

    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
        flashTimeoutRef.current = null;
      }
    };
  }, [currentPrice]);

  // Smoothly fluctuate volume over time
  useEffect(() => {
    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setVolume((prev) => {
        const drift = (Math.random() - 0.5) * 0.02;
        const next = prev * (1 + drift);
        return next > 0 ? next : prev;
      });
    }, VOLUME_UPDATE_INTERVAL_MS);

    return () => {
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    };
  }, []);

  const changePct = useMemo(() => {
    const open = dayOpenRef.current;
    if (!open) return 0;
    return (((currentPrice ?? 0) - open) / open) * 100;
  }, [currentPrice]);

  const isPositive = changePct >= 0;

  const priceColor =
    flash === 'up' ? 'text-emerald-400' : flash === 'down' ? 'text-rose-400' : 'text-white';

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 p-3.5 shadow-lg shadow-purple-900/10">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase tracking-wide mb-1.5">
            <Activity size={12} />
            {coin.symbol}/USDT Price
          </div>
          <p
            className={`text-xl sm:text-2xl font-bold tabular-nums transition-colors duration-300 ${priceColor}`}
            style={{
              textShadow:
                flash === 'up'
                  ? '0 0 16px rgba(16,185,129,0.4)'
                  : flash === 'down'
                  ? '0 0 16px rgba(244,63,94,0.4)'
                  : '0 0 16px rgba(168,85,247,0.3)',
            }}
          >
            ${formatPrice(currentPrice)}
          </p>
          <div
            className={`flex items-center gap-1 text-xs font-semibold mt-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {isPositive ? '+' : ''}
            {changePct.toFixed(2)}% 24H
          </div>
        </div>

        <StatCard
          icon={TrendingUp}
          label="24H High"
          value={`$${formatPrice(high)}`}
          valueClass="text-emerald-400"
        />
        <StatCard
          icon={TrendingDown}
          label="24H Low"
          value={`$${formatPrice(low)}`}
          valueClass="text-rose-400"
        />
        <StatCard
          icon={isPositive ? ArrowUp : ArrowDown}
          label="24H Change"
          value={`${isPositive ? '+' : ''}${changePct.toFixed(2)}%`}
          valueClass={isPositive ? 'text-emerald-400' : 'text-rose-400'}
        />
        <StatCard icon={BarChart3} label="Volume" value={formatCurrency(volume)} />
        <StatCard
          icon={Activity}
          label="Market Status"
          value="Open"
          valueClass="text-emerald-400"
          sub="Simulated market"
        />
      </div>
    </div>
  );
});

export default MarketStats;
