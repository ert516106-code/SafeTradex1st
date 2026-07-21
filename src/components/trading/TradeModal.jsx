import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, X, Wallet, Percent, Clock, DollarSign } from 'lucide-react';
import {
  generateNextPrice,
  calculateFee,
  calculateProfit,
  formatPrice,
  formatCurrency,
  PAYOUT_RATIO,
} from '../../lib/tradingEngine';

const PERIODS = [
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
];

const QUICK_AMOUNTS = [10, 100, 500, 1000, 5000, 10000, 50000];

const TICK_INTERVAL_MIN = 700;
const TICK_INTERVAL_MAX = 900;

function getRandomTickDelay() {
  return TICK_INTERVAL_MIN + Math.random() * (TICK_INTERVAL_MAX - TICK_INTERVAL_MIN);
}

function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

  const priceTickTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
      setCurrentPrice((prev) => generateNextPrice(prev));
      scheduleNextTick();
    }, getRandomTickDelay());
  }, [clearPriceTick]);

  useEffect(() => {
    if (!isOpen) return;
    scheduleNextTick();
    return () => {
      clearPriceTick();
    };
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
    return calculateProfit(parsedAmount, PAYOUT_RATIO);
  }, [parsedAmount]);

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

    setEntryPrice(startPrice);
    setTradeDirection(dir);
    setTradeAmount(stake);
    setResult(null);
    setExitPrice(null);

    if (onBalanceChange) {
      onBalanceChange(-stake);
    }

    const duration = period.seconds;
    setTotalSeconds(duration);
    setSecondsLeft(duration);
    setTradeState('active');

    clearCountdown();
    countdownIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearCountdown();
          resolveTrade(startPrice, dir, stake);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resolveTrade = (startPrice, dir, stake) => {
    setCurrentPrice((livePrice) => {
      const finalPrice = livePrice;
      const win =
        dir === 'long' ? finalPrice > startPrice : finalPrice < startPrice;
      const profit = win ? calculateProfit(stake, PAYOUT_RATIO) : 0;

      if (win && onBalanceChange) {
        onBalanceChange(stake + profit);
      }

      setExitPrice(finalPrice);
      setResult({ win, profit, stake });
      setTradeState('resolved');

      if (onTradeComplete) {
        onTradeComplete({
          coin: coin.symbol,
          direction: dir,
          stake,
          entryPrice: startPrice,
          exitPrice: finalPrice,
          win,
          profit,
        });
      }

      return finalPrice;
    });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#161227]/95 to-[#0d0b18]/95 backdrop-blur-xl shadow-2xl shadow-purple-900/40">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/30">
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
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pt-5">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs uppercase tracking-wide">
                Simulated Price
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  direction === 'long'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {direction === 'long' ? 'LONG' : 'SHORT'}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mt-1 tabular-nums transition-all duration-300">
              ${formatPrice(currentPrice)}
            </p>
            {entryPrice !== null && (
              <p className="text-xs text-white/40 mt-1">
                Entry: ${formatPrice(entryPrice)}
              </p>
            )}
          </div>
        </div>

        {tradeState === 'active' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-36 h-36">
              <svg
                className="w-36 h-36 -rotate-90"
                viewBox="0 0 120 120"
              >
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
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
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
              className={`w-full rounded-2xl border p-5 text-center ${
                result.win
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-rose-500/10 border-rose-500/30'
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
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
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
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border ${
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
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border ${
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
                    className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                      period.label === p.label
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400 text-white shadow-md shadow-purple-500/30'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
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
                    className="py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
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
                <span className="text-white/50">Estimated Profit</span>
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
    </div>
  );
}
