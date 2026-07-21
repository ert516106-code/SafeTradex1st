import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  X,
  Wallet,
  Percent,
  Clock,
  DollarSign,
  Activity,
  History as HistoryIcon,
} from 'lucide-react';
import { calculateFee, formatPrice, formatCurrency } from '../../lib/tradingEngine';

const PERIODS = [
  { label: '1m', seconds: 60, payout: 0.3 },
  { label: '2m', seconds: 120, payout: 0.45 },
  { label: '3m', seconds: 180, payout: 0.75 },
  { label: '5m', seconds: 300, payout: 1.0 },
];

const QUICK_AMOUNTS = [10, 100, 500, 1000, 5000, 10000, 50000];

const TICK_INTERVAL_MIN = 700;
const TICK_INTERVAL_MAX = 900;
const CHART_MAX_POINTS = 60;

function getRandomTickDelay() {
  return TICK_INTERVAL_MIN + Math.random() * (TICK_INTERVAL_MAX - TICK_INTERVAL_MIN);
}

function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Realistic-ish market simulator using a momentum/trend model.
 * State lives in a ref so it persists across ticks without re-renders.
 */
function createMarketEngine(startPrice) {
  return {
    price: startPrice,
    trend: 0, // slow-moving underlying bias (-1..1)
    momentum: 0, // short-term velocity
  };
}

function stepMarketEngine(engine) {
  // Slowly evolve the underlying trend (mean-reverting random walk)
  const trendDrift = (Math.random() - 0.5) * 0.02;
  engine.trend = Math.max(-1, Math.min(1, engine.trend * 0.985 + trendDrift));

  // Momentum responds to trend plus its own inertia
  const momentumPush = (Math.random() - 0.5) * 0.6 + engine.trend * 0.35;
  engine.momentum = engine.momentum * 0.82 + momentumPush * 0.18;

  // Occasional small pullback against current momentum
  let pullback = 0;
  if (Math.random() < 0.14) {
    pullback = -engine.momentum * (0.3 + Math.random() * 0.4);
  }

  // Occasional tiny spike in the direction of momentum
  let spike = 0;
  if (Math.random() < 0.08) {
    spike = (engine.momentum >= 0 ? 1 : -1) * (0.15 + Math.random() * 0.35);
  }

  // Base tick noise, kept small so moves never look unrealistic
  const noise = (Math.random() - 0.5) * 0.18;

  const changePct = (engine.momentum * 0.12 + pullback * 0.1 + spike * 0.1 + noise * 0.06) / 100;
  const nextPrice = engine.price * (1 + changePct);

  // Hard clamp on per-tick move so nothing ever "jumps"
  const maxMovePct = 0.0018;
  const clampedPrice = Math.max(
    engine.price * (1 - maxMovePct),
    Math.min(engine.price * (1 + maxMovePct), nextPrice)
  );

  engine.price = clampedPrice;
  return clampedPrice;
}

function LiveChart({ points, direction }) {
  const width = 320;
  const height = 88;

  const { path, areaPath, gradientId } = useMemo(() => {
    if (points.length < 2) {
      return { path: '', areaPath: '', gradientId: 'chart-grad' };
    }
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const stepX = width / (CHART_MAX_POINTS - 1);
    const offset = CHART_MAX_POINTS - points.length;

    const coords = points.map((p, i) => {
      const x = (offset + i) * stepX;
      const y = height - ((p - min) / range) * (height - 12) - 6;
      return [x, y];
    });

    const linePath = coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');

    const lastX = coords[coords.length - 1][0];
    const firstX = coords[0][0];
    const areaPathStr = `${linePath} L${lastX.toFixed(2)},${height} L${firstX.toFixed(2)},${height} Z`;

    return { path: linePath, areaPath: areaPathStr, gradientId: 'chart-grad' };
  }, [points]);

  const isUp = points.length > 1 ? points[points.length - 1] >= points[0] : true;
  const strokeColor = direction === 'short' ? '#f43f5e' : isUp ? '#a855f7' : '#f43f5e';

  return (
    <div className="relative w-full h-[88px] rounded-xl overflow-hidden bg-black/30 border border-white/10">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />}
        {path && (
          <path
            d={path}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            style={{ transition: 'd 0.15s linear' }}
          />
        )}
      </svg>
      <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40">
        <Activity size={11} />
        Live
      </div>
    </div>
  );
}

export default function TradeModal({
  isOpen,
  onClose,
  coin = { symbol: 'BTC', name: 'Bitcoin' },
  initialPrice = 67000,
  balance = 10000,
  onBalanceChange,
  onTradeComplete,
}) {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [chartPoints, setChartPoints] = useState([initialPrice]);
  const [direction, setDirection] = useState('long');
  const [period, setPeriod] = useState(PERIODS[0]);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const [tradeState, setTradeState] = useState('idle'); // idle | active | resolved
  const [entryPrice, setEntryPrice] = useState(null);
  const [exitPrice, setExitPrice] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [result, setResult] = useState(null); // { win: bool, profit: number, stake: number }
  const [tradeDirection, setTradeDirection] = useState('long');
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradePeriod, setTradePeriod] = useState(PERIODS[0]);
  const [tradeHistory, setTradeHistory] = useState([]);

  const priceTickTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const marketEngineRef = useRef(createMarketEngine(initialPrice));
  const currentPriceRef = useRef(initialPrice);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  const clearPriceTick = useCallback(() => {
    if (priceTickTimeoutRef.current) {
      clearTimeout(priceTickTimeoutRef.current);
      priceTickTimeoutRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const scheduleNextTick = useCallback(() => {
    clearPriceTick();
    priceTickTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      const nextPrice = stepMarketEngine(marketEngineRef.current);
      setCurrentPrice(nextPrice);
      setChartPoints((prev) => {
        const next = [...prev, nextPrice];
        if (next.length > CHART_MAX_POINTS) {
          return next.slice(next.length - CHART_MAX_POINTS);
        }
        return next;
      });
      scheduleNextTick();
    }, getRandomTickDelay());
  }, [clearPriceTick]);

  useEffect(() => {
    if (!isOpen) return;
    marketEngineRef.current = createMarketEngine(currentPriceRef.current || initialPrice);
    scheduleNextTick();
    return () => {
      clearPriceTick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scheduleNextTick, clearPriceTick]);

  useEffect(() => {
    if (!isOpen) {
      clearPriceTick();
      clearCountdown();
      setTradeState('idle');
      setResult(null);
      setEntryPrice(null);
      setExitPrice(null);
      setAmount('');
      setAmountError('');
      setDirection('long');
      setPeriod(PERIODS[0]);
    }
  }, [isOpen, clearPriceTick, clearCountdown]);

  useEffect(() => {
    return () => {
      clearPriceTick();
      clearCountdown();
    };
  }, [clearPriceTick, clearCountdown]);

  const parsedAmount = useMemo(() => {
    const n = parseFloat(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const fee = useMemo(() => {
    if (parsedAmount <= 0) return 0;
    return calculateFee(parsedAmount);
  }, [parsedAmount]);

  const estimatedProfit = useMemo(() => {
    if (parsedAmount <= 0) return 0;
    return parsedAmount * period.payout;
  }, [parsedAmount, period]);

  const validateAmount = useCallback(
    (value) => {
      const n = parseFloat(value);
      if (!value || Number.isNaN(n)) {
        return 'Enter an amount';
      }
      if (n <= 0) {
        return 'Amount must be greater than zero';
      }
      if (n > balance) {
        return 'Amount exceeds available balance';
      }
      return '';
    },
    [balance]
  );

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setAmountError(validateAmount(value));
    }
  };

  const handleQuickAmount = (value) => {
    const str = String(value);
    setAmount(str);
    setAmountError(validateAmount(str));
  };

  const canConfirm = useMemo(() => {
    if (tradeState !== 'idle') return false;
    if (!period || !period.seconds) return false;
    if (direction !== 'long' && direction !== 'short') return false;
    return validateAmount(amount) === '';
  }, [tradeState, period, direction, amount, validateAmount]);

  const handleConfirmTrade = () => {
    const err = validateAmount(amount);
    if (err) {
      setAmountError(err);
      return;
    }
    if (!period || !period.seconds) {
      return;
    }

    const stake = parsedAmount;
    const startPrice = currentPrice;
    const dir = direction;
    const activePeriod = period;

    setEntryPrice(startPrice);
    setTradeDirection(dir);
    setTradeAmount(stake);
    setTradePeriod(activePeriod);
    setResult(null);
    setExitPrice(null);

    if (onBalanceChange) {
      onBalanceChange(-stake);
    }

    const duration = activePeriod.seconds;
    setTotalSeconds(duration);
    setSecondsLeft(duration);
    setTradeState('active');

    clearCountdown();
    countdownIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearCountdown();
          resolveTrade(startPrice, dir, stake, activePeriod);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resolveTrade = (startPrice, dir, stake, resolvedPeriod) => {
    const finalPrice = currentPriceRef.current;
    const win = dir === 'long' ? finalPrice > startPrice : finalPrice < startPrice;
    const profit = win ? stake * resolvedPeriod.payout : 0;

    if (win && onBalanceChange) {
      onBalanceChange(stake + profit);
    }

    setExitPrice(finalPrice);
    setResult({ win, profit, stake });
    setTradeState('resolved');

    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      coin: coin.symbol,
      direction: dir,
      stake,
      entryPrice: startPrice,
      exitPrice: finalPrice,
      win,
      profit,
      timestamp: Date.now(),
    };

    setTradeHistory((prev) => [historyEntry, ...prev].slice(0, 5));

    if (onTradeComplete) {
      onTradeComplete(historyEntry);
    }
  };

  const handleReset = () => {
    setTradeState('idle');
    setResult(null);
    setEntryPrice(null);
    setExitPrice(null);
    setAmount('');
    setAmountError('');
  };

  const handleClose = () => {
    clearCountdown();
    if (onClose) onClose();
  };

  const circleProgress = useMemo(() => {
    if (totalSeconds <= 0) return 0;
    return secondsLeft / totalSeconds;
  }, [secondsLeft, totalSeconds]);

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - circleProgress);

  const openOrderPotentialProfit = useMemo(() => {
    if (tradeState !== 'active') return 0;
    return tradeAmount * tradePeriod.payout;
  }, [tradeState, tradeAmount, tradePeriod]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md flex flex-col gap-3 max-h-[94vh]">
        <div className="relative w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#161227]/95 to-[#0d0b18]/95 backdrop-blur-xl shadow-2xl shadow-purple-900/40">
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/20">
                {coin.symbol?.slice(0, 3)}
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">
                  {coin.name}
                </p>
                <p className="text-white/50 text-xs mt-1">{coin.symbol}/USDT</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pt-5">
            <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs uppercase tracking-wide">
                  Simulated Price
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                    direction === 'long'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {direction === 'long' ? 'LONG' : 'SHORT'}
                </span>
              </div>
              <p
                className="text-3xl font-bold text-white tabular-nums transition-all duration-300"
                style={{ textShadow: '0 0 18px rgba(168,85,247,0.45)' }}
              >
                ${formatPrice(currentPrice)}
              </p>
              <LiveChart points={chartPoints} direction={direction} />
              {entryPrice !== null && (
                <p className="text-xs text-white/40">
                  Entry: ${formatPrice(entryPrice)}
                </p>
              )}
            </div>
          </div>

          {tradeState === 'active' && (
            <div className="px-5 pt-4">
              <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs uppercase tracking-wide font-semibold">
                    Open Order
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tradeDirection === 'long'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {tradeDirection === 'long' ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-white/40">Coin</span>
                  <span className="text-white text-right font-medium">{coin.symbol}</span>
                  <span className="text-white/40">Stake</span>
                  <span className="text-white text-right font-medium">
                    {formatCurrency(tradeAmount)}
                  </span>
                  <span className="text-white/40">Entry Price</span>
                  <span className="text-white text-right font-medium">
                    ${formatPrice(entryPrice)}
                  </span>
                  <span className="text-white/40">Current Price</span>
                  <span className="text-white text-right font-medium tabular-nums">
                    ${formatPrice(currentPrice)}
                  </span>
                  <span className="text-white/40">Potential Profit</span>
                  <span className="text-emerald-400 text-right font-semibold">
                    +{formatCurrency(openOrderPotentialProfit)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {tradeState === 'active' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'stroke-dashoffset 1s linear',
                      filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.6))',
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl font-bold tabular-nums">
                    {formatCountdown(secondsLeft)}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wide mt-0.5">
                    Time Left
                  </span>
                </div>
              </div>
              <p className="text-white/50 text-xs mt-4">
                Trade in progress — hold tight...
              </p>
            </div>
          )}

          {tradeState === 'resolved' && result && (
            <div className="px-5 py-6 flex flex-col items-center">
              <div
                className={`w-full rounded-2xl border p-5 text-center transition-all ${
                  result.win
                    ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : 'bg-rose-500/10 border-rose-500/30 shadow-lg shadow-rose-500/10'
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    result.win ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.win ? 'You Won!' : 'You Lost'}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Entry ${formatPrice(entryPrice)} → Exit ${formatPrice(exitPrice)}
                </p>
                <p
                  className={`text-xl font-bold mt-3 ${
                    result.win ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.win
                    ? `+${formatCurrency(result.profit)}`
                    : `-${formatCurrency(result.stake)}`}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/20"
              >
                Trade Again
              </button>
            </div>
          )}

          {tradeState === 'idle' && (
            <div className="px-5 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDirection('long')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border active:scale-[0.98] ${
                    direction === 'long'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <TrendingUp size={16} />
                  Buy Long
                </button>
                <button
                  onClick={() => setDirection('short')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border active:scale-[0.98] ${
                    direction === 'short'
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400 text-white shadow-lg shadow-rose-500/30'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <TrendingDown size={16} />
                  Sell Short
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-white/40" />
                  <span className="text-white/50 text-xs uppercase tracking-wide">
                    Period
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPeriod(p)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all border active:scale-[0.97] ${
                        period.label === p.label
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-md shadow-purple-500/30'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[10px] opacity-70">
                        {Math.round(p.payout * 100)}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} className="text-white/40" />
                  <span className="text-white/50 text-xs uppercase tracking-wide">
                    Purchase Amount
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-lg font-semibold placeholder-white/20 outline-none transition-colors ${
                    amountError
                      ? 'border-rose-500/60 focus:border-rose-500'
                      : 'border-white/10 focus:border-purple-500/60'
                  }`}
                />
                {amountError && (
                  <p className="text-rose-400 text-xs mt-1.5">{amountError}</p>
                )}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {QUICK_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleQuickAmount(val)}
                      className="py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors active:scale-95"
                    >
                      {val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/50">
                    <Wallet size={14} />
                    Available Balance
                  </span>
                  <span className="text-white font-medium">
                    {formatCurrency(balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/50">
                    <Percent size={14} />
                    Trading Fee
                  </span>
                  <span className="text-white/70 font-medium">
                    {formatCurrency(fee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-white/50">
                    Estimated Profit ({Math.round(period.payout * 100)}%)
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    +{formatCurrency(estimatedProfit)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmTrade}
                disabled={!canConfirm}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                  canConfirm
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:opacity-90 active:scale-[0.98]'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Confirm Trade
              </button>
            </div>
          )}
        </div>

        {tradeHistory.length > 0 && (
          <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#161227]/90 to-[#0d0b18]/90 backdrop-blur-xl shadow-xl shadow-black/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <HistoryIcon size={14} className="text-white/40" />
              <span className="text-white/50 text-xs uppercase tracking-wide font-semibold">
                Recent Trades
              </span>
            </div>
            <div className="divide-y divide-white/5 max-h-48 overflow-y-auto">
              {tradeHistory.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-4 py-2.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.win ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-white/70 font-medium">{t.coin}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        t.direction === 'long'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {t.direction === 'long' ? 'LONG' : 'SHORT'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 tabular-nums">
                      {formatCurrency(t.stake)}
                    </span>
                    <span
                      className={`font-semibold tabular-nums ${
                        t.win ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.win ? `+${formatCurrency(t.profit)}` : `-${formatCurrency(t.stake)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
