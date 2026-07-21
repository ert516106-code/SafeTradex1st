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
  CheckCircle2,
  XCircle,
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
const CHART_MAX_POINTS = 40;
const SLIDE_MS = 780;

function getRandomTickDelay() {
  return TICK_INTERVAL_MIN + Math.random() * (TICK_INTERVAL_MAX - TICK_INTERVAL_MIN);
}

function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDuration(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${seconds}s`;
}

function formatClockTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

function createMarketEngine(startPrice) {
  return {
    price: startPrice,
    trend: 0,
    momentum: 0,
    phase: 'sideways',
    phaseTicksLeft: 12 + Math.floor(Math.random() * 10),
    volatility: 'quiet',
    volatilityTicksLeft: 6 + Math.floor(Math.random() * 6),
  };
}

const PHASE_BIAS = { bullish: 0.55, bearish: -0.55, sideways: 0 };
const PHASES = ['sideways', 'bullish', 'bearish', 'sideways', 'bullish', 'bearish'];

function pickNextPhase(current) {
  const options = PHASES.filter((p) => p !== current);
  return options[Math.floor(Math.random() * options.length)];
}

function stepMarketEngine(engine) {
  engine.phaseTicksLeft -= 1;
  if (engine.phaseTicksLeft <= 0) {
    engine.phase = pickNextPhase(engine.phase);
    engine.phaseTicksLeft = 10 + Math.floor(Math.random() * 16);
  }

  engine.volatilityTicksLeft -= 1;
  if (engine.volatilityTicksLeft <= 0) {
    engine.volatility = engine.volatility === 'quiet' ? 'active' : 'quiet';
    engine.volatilityTicksLeft =
      engine.volatility === 'quiet' ? 8 + Math.floor(Math.random() * 8) : 5 + Math.floor(Math.random() * 6);
  }
  const volMult = engine.volatility === 'active' ? 1.35 : 0.55;

  const bias = PHASE_BIAS[engine.phase] ?? 0;

  engine.trend = engine.trend * 0.975 + bias * 0.025 + (Math.random() - 0.5) * 0.008;
  engine.trend = Math.max(-1, Math.min(1, engine.trend));

  const momentumPush = (Math.random() - 0.5) * 0.35 + engine.trend * 0.45;
  engine.momentum = engine.momentum * 0.86 + momentumPush * 0.14;

  let pullback = 0;
  if (Math.random() < 0.12) {
    pullback = -engine.momentum * (0.25 + Math.random() * 0.35);
  }

  let spike = 0;
  if (Math.random() < 0.07) {
    spike = (engine.momentum >= 0 ? 1 : -1) * (0.12 + Math.random() * 0.28);
  }

  const noise = (Math.random() - 0.5) * 0.1;

  const changePct =
    ((engine.momentum * 0.11 + pullback * 0.09 + spike * 0.09 + noise * 0.05) * volMult) / 100;

  const nextPrice = engine.price * (1 + changePct);

  const maxMovePct = 0.0016 * volMult;
  const clampedPrice = Math.max(
    engine.price * (1 - maxMovePct),
    Math.min(engine.price * (1 + maxMovePct), nextPrice)
  );

  engine.price = clampedPrice;
  return clampedPrice;
}

const LiveChart = React.memo(function LiveChart({ price, direction }) {
  const width = 320;
  const height = 120;

  const [points, setPoints] = useState([price]);
  const [sliding, setSliding] = useState(false);
  const slideTimeoutRef = useRef(null);

  useEffect(() => {
    setPoints((prev) => [...prev, price]);
  }, [price]);

  useEffect(() => {
    if (points.length <= CHART_MAX_POINTS) return undefined;
    setSliding(true);
    slideTimeoutRef.current = setTimeout(() => {
      setPoints((prev) => (prev.length > CHART_MAX_POINTS ? prev.slice(prev.length - CHART_MAX_POINTS) : prev));
      setSliding(false);
    }, SLIDE_MS);
    return () => {
      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    };
  }, [points]);

  useEffect(() => {
    return () => {
      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
    };
  }, []);

  const stepX = width / CHART_MAX_POINTS;

  const { path, areaPath, lastPoint, isUp } = useMemo(() => {
    if (points.length < 2) {
      return { path: '', areaPath: '', lastPoint: null, isUp: true };
    }
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / range) * (height - 18) - 9;
      return [x, y];
    });

    const linePath = coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(' ');

    const lastX = coords[coords.length - 1][0];
    const firstX = coords[0][0];
    const areaPathStr = `${linePath} L${lastX.toFixed(2)},${height} L${firstX.toFixed(2)},${height} Z`;

    return {
      path: linePath,
      areaPath: areaPathStr,
      lastPoint: coords[coords.length - 1],
      isUp: points[points.length - 1] >= points[0],
    };
  }, [points, stepX]);

  const strokeColor = direction === 'short' ? '#f43f5e' : isUp ? '#22c55e' : '#f43f5e';
  const groupTransform = `translate(${sliding ? -stepX : 0}, 0)`;

  return (
    <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-[#0a0a12] border border-white/[0.06]">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35">
              <animate attributeName="stop-opacity" values="0.35;0.14;0.35" dur="3.2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            y1={height * f}
            x2={width}
            y2={height * f}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line
            key={f}
            x1={width * f}
            y1="0"
            x2={width * f}
            y2={height}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        <g style={{ transform: groupTransform, transition: sliding ? `transform ${SLIDE_MS}ms linear` : 'none' }}>
          {areaPath && <path d={areaPath} fill="url(#chart-grad)" stroke="none" />}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}
          {lastPoint && (
            <>
              <circle cx={lastPoint[0]} cy={lastPoint[1]} r="6.5" fill={strokeColor} opacity="0.2">
                <animate attributeName="r" values="6.5;10.5;6.5" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.04;0.2" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={lastPoint[0]}
                cy={lastPoint[1]}
                r="3"
                fill={strokeColor}
                filter="url(#glow)"
                stroke="#0a0a12"
                strokeWidth="1.2"
              />
            </>
          )}
        </g>
      </svg>
      <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/35 font-medium">
        <Activity size={11} />
        Live
      </div>
    </div>
  );
});

const OpenOrderCard = React.memo(function OpenOrderCard({
  coinSymbol,
  tradeDirection,
  tradeAmount,
  entryPrice,
  currentPrice,
  potentialProfit,
  floatingPct,
  inTheMoney,
}) {
  return (
    <div className="px-5 pt-4">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-violet-600/[0.08] border border-white/[0.08] p-4 space-y-3 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">Open Order</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              tradeDirection === 'long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {tradeDirection === 'long' ? 'LONG' : 'SHORT'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <span className="text-white/35">Coin</span>
          <span className="text-white text-right font-semibold">{coinSymbol}</span>
          <span className="text-white/35">Stake</span>
          <span className="text-white text-right font-semibold">{formatCurrency(tradeAmount)}</span>
          <span className="text-white/35">Entry Price</span>
          <span className="text-white text-right font-semibold">${formatPrice(entryPrice)}</span>
          <span className="text-white/35">Current Price</span>
          <span className="text-white text-right font-semibold tabular-nums">${formatPrice(currentPrice)}</span>
        </div>
        <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-y-2 text-xs">
          <span className="text-white/35">Floating P/L</span>
          <span className={`text-right font-bold tabular-nums ${inTheMoney ? 'text-emerald-400' : 'text-rose-400'}`}>
            {inTheMoney ? `+${formatCurrency(potentialProfit)}` : `-${formatCurrency(tradeAmount)}`}
          </span>
          <span className="text-white/35">Move</span>
          <span className={`text-right font-semibold tabular-nums ${inTheMoney ? 'text-emerald-400' : 'text-rose-400'}`}>
            {inTheMoney ? '+' : ''}
            {floatingPct.toFixed(3)}%
          </span>
        </div>
      </div>
    </div>
  );
});

const ResultCard = React.memo(function ResultCard({ result, entryPrice, exitPrice, periodSeconds }) {
  if (!result) return null;
  const pctMove = entryPrice ? ((exitPrice - entryPrice) / entryPrice) * 100 : 0;
  return (
    <div
      className={`w-full rounded-2xl border p-5 transition-all ${
        result.win
          ? 'bg-emerald-500/[0.08] border-emerald-500/25 shadow-lg shadow-emerald-500/5'
          : 'bg-rose-500/[0.08] border-rose-500/25 shadow-lg shadow-rose-500/5'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {result.win ? (
          <CheckCircle2 size={22} className="text-emerald-400" />
        ) : (
          <XCircle size={22} className="text-rose-400" />
        )}
        <p className={`text-2xl font-bold ${result.win ? 'text-emerald-400' : 'text-rose-400'}`}>
          {result.win ? 'You Won!' : 'You Lost'}
        </p>
      </div>

      <p
        className={`text-xl font-bold mt-3 text-center tabular-nums ${
          result.win ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {result.win ? `+${formatCurrency(result.profit)}` : `-${formatCurrency(result.stake)}`}
      </p>

      <div className="grid grid-cols-2 gap-y-2 text-xs mt-4 pt-4 border-t border-white/[0.08]">
        <span className="text-white/35">Entry Price</span>
        <span className="text-white text-right font-semibold">${formatPrice(entryPrice)}</span>
        <span className="text-white/35">Exit Price</span>
        <span className="text-white text-right font-semibold">${formatPrice(exitPrice)}</span>
        <span className="text-white/35">Price Move</span>
        <span className={`text-right font-semibold ${pctMove >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {pctMove >= 0 ? '+' : ''}
          {pctMove.toFixed(3)}%
        </span>
        <span className="text-white/35">Duration</span>
        <span className="text-white text-right font-semibold">{formatDuration(periodSeconds)}</span>
        <span className="text-white/35">Completed</span>
        <span className="text-white text-right font-semibold">{formatClockTime(result.completedAt)}</span>
      </div>
    </div>
  );
});

const HistoryRow = React.memo(function HistoryRow({ trade }) {
  const pctMove = trade.entryPrice ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 : 0;
  return (
    <div className="px-4 py-2.5 text-xs space-y-1.5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${trade.win ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span className="text-white/70 font-medium">{trade.coin}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              trade.direction === 'long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {trade.direction === 'long' ? 'LONG' : 'SHORT'}
          </span>
        </div>
        <span className={`font-bold tabular-nums ${trade.win ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trade.win ? `+${formatCurrency(trade.profit)}` : `-${formatCurrency(trade.stake)}`}
        </span>
      </div>
      <div className="flex items-center justify-between text-white/30 text-[10px]">
        <span>
          ${formatPrice(trade.entryPrice)} → ${formatPrice(trade.exitPrice)}
          <span className={pctMove >= 0 ? 'text-emerald-400/80 ml-1' : 'text-rose-400/80 ml-1'}>
            ({pctMove >= 0 ? '+' : ''}
            {pctMove.toFixed(2)}%)
          </span>
        </span>
        <span>
          {formatDuration(trade.durationSeconds)} · {formatClockTime(trade.timestamp)}
        </span>
      </div>
    </div>
  );
});

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
  const [direction, setDirection] = useState('long');
  const [period, setPeriod] = useState(PERIODS[0]);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const [tradeState, setTradeState] = useState('idle');
  const [entryPrice, setEntryPrice] = useState(null);
  const [exitPrice, setExitPrice] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [tradeDirection, setTradeDirection] = useState('long');
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradePeriod, setTradePeriod] = useState(PERIODS[0]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');

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
      scheduleNextTick();
    }, getRandomTickDelay());
  }, [clearPriceTick]);

  useEffect(() => {
    if (!isOpen) return undefined;
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
      if (!value || Number.isNaN(n)) return 'Enter an amount';
      if (n <= 0) return 'Amount must be greater than zero';
      if (n > balance) return 'Amount exceeds available balance';
      return '';
    },
    [balance]
  );

  const handleAmountChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setAmount(value);
        setAmountError(validateAmount(value));
      }
    },
    [validateAmount]
  );

  const handleQuickAmount = useCallback(
    (value) => {
      const str = String(value);
      setAmount(str);
      setAmountError(validateAmount(str));
    },
    [validateAmount]
  );

  const canConfirm = useMemo(() => {
    if (tradeState !== 'idle') return false;
    if (!period || !period.seconds) return false;
    if (direction !== 'long' && direction !== 'short') return false;
    return validateAmount(amount) === '';
  }, [tradeState, period, direction, amount, validateAmount]);

  const resolveTrade = useCallback(
    (startPrice, dir, stake, resolvedPeriod, durationSeconds) => {
      const finalPrice = currentPriceRef.current;
      const win = dir === 'long' ? finalPrice > startPrice : finalPrice < startPrice;
      const profit = win ? stake * resolvedPeriod.payout : 0;
      const completedAt = Date.now();

      if (win && onBalanceChange) {
        onBalanceChange(stake + profit);
      }

      setExitPrice(finalPrice);
      setResult({ win, profit, stake, completedAt });
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
        durationSeconds,
        timestamp: completedAt,
      };

      setTradeHistory((prev) => [historyEntry, ...prev].slice(0, 5));

      if (onTradeComplete) {
        onTradeComplete(historyEntry);
      }
    },
    [coin.symbol, onBalanceChange, onTradeComplete]
  );

  const handleConfirmTrade = useCallback(() => {
    const err = validateAmount(amount);
    if (err) {
      setAmountError(err);
      return;
    }
    if (!period || !period.seconds) return;

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
          resolveTrade(startPrice, dir, stake, activePeriod, duration);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [amount, validateAmount, period, parsedAmount, currentPrice, direction, onBalanceChange, clearCountdown, resolveTrade]);

  const handleReset = useCallback(() => {
    setTradeState('idle');
    setResult(null);
    setEntryPrice(null);
    setExitPrice(null);
    setAmount('');
    setAmountError('');
  }, []);

  const handleClose = useCallback(() => {
    clearCountdown();
    if (onClose) onClose();
  }, [clearCountdown, onClose]);

  const circleProgress = useMemo(() => {
    if (totalSeconds <= 0) return 0;
    return secondsLeft / totalSeconds;
  }, [secondsLeft, totalSeconds]);

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - circleProgress);

  const floating = useMemo(() => {
    if (tradeState !== 'active' || entryPrice === null) {
      return { inTheMoney: false, pct: 0, potentialProfit: 0 };
    }
    const diff = tradeDirection === 'long' ? currentPrice - entryPrice : entryPrice - currentPrice;
    const pct = entryPrice ? (diff / entryPrice) * 100 : 0;
    return {
      inTheMoney: diff > 0,
      pct,
      potentialProfit: tradeAmount * tradePeriod.payout,
    };
  }, [tradeState, entryPrice, currentPrice, tradeDirection, tradeAmount, tradePeriod]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === 'wins') return tradeHistory.filter((t) => t.win);
    if (historyFilter === 'losses') return tradeHistory.filter((t) => !t.win);
    return tradeHistory;
  }, [tradeHistory, historyFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md flex flex-col gap-3 max-h-[94vh]">
        <div className="relative w-full overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/[0.08] bg-[#0d0c15]/95 backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-[#0d0c15]/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30 ring-2 ring-white/[0.06]">
                {coin.symbol?.slice(0, 3)}
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">{coin.name}</p>
                <p className="text-white/45 text-xs mt-1">{coin.symbol}/USDT</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-white/60 hover:text-white active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 pt-5">
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs uppercase tracking-wider">Simulated Price</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    direction === 'long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {direction === 'long' ? 'LONG' : 'SHORT'}
                </span>
              </div>
              <p
                className="text-3xl font-bold text-white tabular-nums transition-all duration-300"
                style={{ textShadow: '0 0 18px rgba(99,102,241,0.4)' }}
              >
                ${formatPrice(currentPrice)}
              </p>
              <LiveChart price={currentPrice} direction={direction} />
              {entryPrice !== null && (
                <p className="text-xs text-white/35">Entry: ${formatPrice(entryPrice)}</p>
              )}
            </div>
          </div>

          {tradeState === 'active' && (
            <OpenOrderCard
              coinSymbol={coin.symbol}
              tradeDirection={tradeDirection}
              tradeAmount={tradeAmount}
              entryPrice={entryPrice}
              currentPrice={currentPrice}
              potentialProfit={floating.potentialProfit}
              floatingPct={floating.pct}
              inTheMoney={floating.inTheMoney}
            />
          )}

          {tradeState === 'active' && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={RADIUS} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    stroke="url(#countdown-gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                      transition: 'stroke-dashoffset 1s linear',
                      filter: 'drop-shadow(0 0 6px rgba(99,102,241,0.5))',
                    }}
                  />
                  <defs>
                    <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white text-2xl font-bold tabular-nums">{formatCountdown(secondsLeft)}</span>
                  <span className="text-white/35 text-[10px] uppercase tracking-wider mt-0.5">Time Left</span>
                </div>
              </div>
              <p className="text-white/45 text-xs mt-4">Trade in progress — hold tight...</p>
            </div>
          )}

          {tradeState === 'resolved' && result && (
            <div className="px-5 py-6 flex flex-col items-center">
              <ResultCard result={result} entryPrice={entryPrice} exitPrice={exitPrice} periodSeconds={tradePeriod.seconds} />
              <button
                onClick={handleReset}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20"
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
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border active:scale-[0.98] ${
                    direction === 'long'
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                  }`}
                >
                  <TrendingUp size={16} />
                  Buy Long
                </button>
                <button
                  onClick={() => setDirection('short')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border active:scale-[0.98] ${
                    direction === 'short'
                      ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                  }`}
                >
                  <TrendingDown size={16} />
                  Sell Short
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-white/35" />
                  <span className="text-white/45 text-xs uppercase tracking-wider">Period</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PERIODS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPeriod(p)}
                      className={`py-2 rounded-lg text-sm font-semibold transition-all border active:scale-[0.97] ${
                        period.label === p.label
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div>{p.label}</div>
                      <div className="text-[10px] opacity-70">{Math.round(p.payout * 100)}%</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} className="text-white/35" />
                  <span className="text-white/45 text-xs uppercase tracking-wider">Purchase Amount</span>
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white text-lg font-semibold placeholder-white/15 outline-none transition-colors ${
                    amountError ? 'border-rose-500/50 focus:border-rose-500' : 'border-white/[0.08] focus:border-indigo-500/50'
                  }`}
                />
                {amountError && <p className="text-rose-400 text-xs mt-1.5">{amountError}</p>}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {QUICK_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleQuickAmount(val)}
                      className="py-1.5 rounded-lg text-xs font-semibold bg-white/[0.03] border border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white transition-colors active:scale-95"
                    >
                      {val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/45">
                    <Wallet size={14} />
                    Available Balance
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(balance)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-white/45">
                    <Percent size={14} />
                    Trading Fee
                  </span>
                  <span className="text-white/65 font-semibold">{formatCurrency(fee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/[0.06]">
                  <span className="text-white/45">Estimated Profit ({Math.round(period.payout * 100)}%)</span>
                  <span className="text-emerald-400 font-bold">+{formatCurrency(estimatedProfit)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmTrade}
                disabled={!canConfirm}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                  canConfirm
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98]'
                    : 'bg-white/[0.03] text-white/25 cursor-not-allowed'
                }`}
              >
                Confirm Trade
              </button>
            </div>
          )}
        </div>

        {tradeHistory.length > 0 && (
          <div className="w-full rounded-2xl border border-white/[0.08] bg-[#0d0c15]/90 backdrop-blur-xl shadow-xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <HistoryIcon size={14} className="text-white/35" />
                <span className="text-white/45 text-xs uppercase tracking-wider font-semibold">Recent Trades</span>
              </div>
              <div className="flex items-center gap-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'wins', label: 'Wins' },
                  { key: 'losses', label: 'Losses' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setHistoryFilter(f.key)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                      historyFilter === f.key
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                        : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-56 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <p className="text-white/25 text-xs text-center py-4">No trades in this filter.</p>
              ) : (
                filteredHistory.map((t) => <HistoryRow key={t.id} trade={t} />)
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
