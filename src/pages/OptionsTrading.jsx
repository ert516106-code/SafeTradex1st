import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Droplet,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import TradeModal from '../components/trading/TradeModal';
import { formatPrice, formatCurrency } from '../lib/tradingEngine';

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67000 },
  { symbol: 'ETH', name: 'Ethereum', price: 3450 },
  { symbol: 'SOL', name: 'Solana', price: 168 },
  { symbol: 'BNB', name: 'BNB', price: 592 },
];

const TICK_INTERVAL_MIN = 700;
const TICK_INTERVAL_MAX = 900;
const CHART_MAX_POINTS = 50;
const SLIDE_MS = 780;
const ORDER_BOOK_ROWS = 6;

function getRandomTickDelay() {
  return TICK_INTERVAL_MIN + Math.random() * (TICK_INTERVAL_MAX - TICK_INTERVAL_MIN);
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
    dayOpen: startPrice,
    high: startPrice,
    low: startPrice,
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
  engine.high = Math.max(engine.high, clampedPrice);
  engine.low = Math.min(engine.low, clampedPrice);
  return clampedPrice;
}

function formatClockTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '';
  }
}

const MainChart = React.memo(function MainChart({ price, isUpDay }) {
  const width = 400;
  const height = 240;

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
      const y = height - ((p - min) / range) * (height - 32) - 16;
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

  const strokeColor = isUp ? '#22c55e' : '#f43f5e';
  const groupTransform = `translate(${sliding ? -stepX : 0}, 0)`;

  return (
    <div className="relative w-full h-[240px] rounded-2xl overflow-hidden bg-[#0a0a12] border border-white/[0.06]">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="main-chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35">
              <animate attributeName="stop-opacity" values="0.35;0.12;0.35" dur="3.4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
          <filter id="main-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line key={f} x1="0" y1={height * f} x2={width} y2={height * f} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        ))}
        {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((f) => (
          <line key={f} x1={width * f} y1="0" x2={width * f} y2={height} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
        ))}

        <g style={{ transform: groupTransform, transition: sliding ? `transform ${SLIDE_MS}ms linear` : 'none' }}>
          {areaPath && <path d={areaPath} fill="url(#main-chart-grad)" stroke="none" />}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#main-glow)"
            />
          )}
          {lastPoint && (
            <>
              <circle cx={lastPoint[0]} cy={lastPoint[1]} r="7" fill={strokeColor} opacity="0.2">
                <animate attributeName="r" values="7;12;7" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.04;0.2" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={lastPoint[0]}
                cy={lastPoint[1]}
                r="3.4"
                fill={strokeColor}
                filter="url(#main-glow)"
                stroke="#0a0a12"
                strokeWidth="1.4"
              />
              <line x1={lastPoint[0]} y1="0" x2={lastPoint[0]} y2={height} stroke={strokeColor} strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}
        </g>
      </svg>
      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/35 font-medium">
        <Activity size={12} />
        Live Chart
      </div>
      <div
        className={`absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${
          isUpDay ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20'
        }`}
      >
        {isUpDay ? 'Bullish' : 'Bearish'}
      </div>
    </div>
  );
});

const StatCard = React.memo(function StatCard({ icon: Icon, label, value, valueClass }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center gap-1.5 text-white/35 text-[10px] uppercase tracking-wider mb-1.5 font-medium">
        <Icon size={11} />
        {label}
      </div>
      <p className={`text-sm font-bold tabular-nums ${valueClass || 'text-white'}`}>{value}</p>
    </div>
  );
});

const OrderBookRow = React.memo(function OrderBookRow({ price, amount, side, depthPct }) {
  const isSell = side === 'sell';
  return (
    <div className="relative flex items-center justify-between px-3 py-1 text-xs">
      <div
        className={`absolute inset-y-0 right-0 ${isSell ? 'bg-rose-500/[0.07]' : 'bg-emerald-500/[0.07]'}`}
        style={{ width: `${depthPct}%` }}
      />
      <span className={`relative z-10 font-semibold tabular-nums ${isSell ? 'text-rose-400' : 'text-emerald-400'}`}>
        {formatPrice(price)}
      </span>
      <span className="relative z-10 text-white/35 tabular-nums">{amount.toFixed(4)}</span>
    </div>
  );
});

const RecentTradeRow = React.memo(function RecentTradeRow({ trade }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2">
        {trade.win ? (
          <CheckCircle2 size={14} className="text-emerald-400" />
        ) : (
          <XCircle size={14} className="text-rose-400" />
        )}
        <span className="text-white/70 font-medium">{trade.coin}</span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
            trade.direction === 'long' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {trade.direction === 'long' ? 'LONG' : 'SHORT'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-white/35 tabular-nums">{formatCurrency(trade.amount)}</span>
        <span className={`font-bold tabular-nums ${trade.win ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trade.win ? `+${formatCurrency(trade.profit)}` : `-${formatCurrency(trade.amount)}`}
        </span>
        <span className="text-white/25">{formatClockTime(trade.timestamp)}</span>
      </div>
    </div>
  );
});

export default function OptionsTrading({ onBack }) {
  const [selectedCoinIndex, setSelectedCoinIndex] = useState(0);
  const [coinPickerOpen, setCoinPickerOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(COINS[0].price);
  const [dayOpen] = useState(COINS[0].price);
  const [high, setHigh] = useState(COINS[0].price);
  const [low, setLow] = useState(COINS[0].price);
  const [balance, setBalance] = useState(10000);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [pendingDirection, setPendingDirection] = useState('long');
  const [recentTrades, setRecentTrades] = useState([]);
  const [orderBook, setOrderBook] = useState({ sells: [], buys: [] });

  const selectedCoin = COINS[selectedCoinIndex];

  const priceTickTimeoutRef = useRef(null);
  const orderBookIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const marketEngineRef = useRef(createMarketEngine(selectedCoin.price));
  const currentPriceRef = useRef(selectedCoin.price);

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

  const clearOrderBookInterval = useCallback(() => {
    if (orderBookIntervalRef.current) {
      clearInterval(orderBookIntervalRef.current);
      orderBookIntervalRef.current = null;
    }
  }, []);

  const scheduleNextTick = useCallback(() => {
    clearPriceTick();
    priceTickTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      const engine = marketEngineRef.current;
      const nextPrice = stepMarketEngine(engine);
      setCurrentPrice(nextPrice);
      setHigh(engine.high);
      setLow(engine.low);
      scheduleNextTick();
    }, getRandomTickDelay());
  }, [clearPriceTick]);

  const generateOrderBook = useCallback((price) => {
    const sells = [];
    const buys = [];
    for (let i = 1; i <= ORDER_BOOK_ROWS; i++) {
      const spreadStep = price * 0.0002 * i;
      sells.push({
        price: price + spreadStep + Math.random() * price * 0.0001,
        amount: 0.05 + Math.random() * 2.5,
      });
      buys.push({
        price: price - spreadStep - Math.random() * price * 0.0001,
        amount: 0.05 + Math.random() * 2.5,
      });
    }
    return { sells: sells.reverse(), buys };
  }, []);

  useEffect(() => {
    marketEngineRef.current = createMarketEngine(selectedCoin.price);
    setCurrentPrice(selectedCoin.price);
    setHigh(selectedCoin.price);
    setLow(selectedCoin.price);
    scheduleNextTick();
    return () => {
      clearPriceTick();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoinIndex]);

  useEffect(() => {
    setOrderBook(generateOrderBook(currentPriceRef.current));
    clearOrderBookInterval();
    orderBookIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      setOrderBook(generateOrderBook(currentPriceRef.current));
    }, 1600);
    return () => {
      clearOrderBookInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoinIndex, generateOrderBook, clearOrderBookInterval]);

  useEffect(() => {
    return () => {
      clearPriceTick();
      clearOrderBookInterval();
    };
  }, [clearPriceTick, clearOrderBookInterval]);

  const changePct = useMemo(() => {
    if (!dayOpen) return 0;
    return ((currentPrice - dayOpen) / dayOpen) * 100;
  }, [currentPrice, dayOpen]);

  const isUpDay = changePct >= 0;

  const spread = useMemo(() => {
    if (!orderBook.sells.length || !orderBook.buys.length) return 0;
    const bestSell = orderBook.sells[orderBook.sells.length - 1]?.price;
    const bestBuy = orderBook.buys[0]?.price;
    return bestSell && bestBuy ? bestSell - bestBuy : 0;
  }, [orderBook]);

  const volume24h = useMemo(() => {
    return selectedCoin.price * (1200 + Math.random() * 400) * 1000;
  }, [selectedCoin]);

  const maxDepthAmount = useMemo(() => {
    const all = [...orderBook.sells, ...orderBook.buys];
    return all.reduce((max, o) => Math.max(max, o.amount), 1);
  }, [orderBook]);

  const handleCoinSelect = useCallback((index) => {
    setSelectedCoinIndex(index);
    setCoinPickerOpen(false);
  }, []);

  const openTradeModal = useCallback((dir) => {
    setPendingDirection(dir);
    setIsTradeModalOpen(true);
  }, []);

  const handleCloseTradeModal = useCallback(() => {
    setIsTradeModalOpen(false);
  }, []);

  const handleBalanceChange = useCallback((delta) => {
    setBalance((prev) => prev + delta);
  }, []);

  const handleTradeComplete = useCallback((trade) => {
    setRecentTrades((prev) =>
      [
        {
          id: trade.id,
          coin: trade.coin,
          direction: trade.direction,
          amount: trade.stake,
          profit: trade.profit,
          win: trade.win,
          timestamp: trade.timestamp,
        },
        ...prev,
      ].slice(0, 8)
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#08070d] pb-24">
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0d0c15]/80 border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-white/60 hover:text-white active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setCoinPickerOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[10px] shadow-md shadow-indigo-500/20">
                {selectedCoin.symbol.slice(0, 3)}
              </div>
              <span className="text-white font-semibold text-sm">{selectedCoin.symbol}/USDT</span>
              <ChevronDown size={14} className="text-white/40" />
            </button>

            {coinPickerOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 rounded-xl border border-white/[0.08] bg-[#14121f]/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-40">
                {COINS.map((c, i) => (
                  <button
                    key={c.symbol}
                    onClick={() => handleCoinSelect(i)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/[0.06] transition-colors ${
                      i === selectedCoinIndex ? 'bg-white/[0.04] text-white' : 'text-white/55'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-[9px]">
                      {c.symbol.slice(0, 3)}
                    </div>
                    <span className="font-medium">{c.symbol}/USDT</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-white font-bold text-sm tabular-nums">${formatPrice(currentPrice)}</p>
            <p className={`text-[10px] font-bold tabular-nums ${isUpDay ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUpDay ? '+' : ''}
              {changePct.toFixed(2)}% 24H
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
        <MainChart price={currentPrice} isUpDay={isUpDay} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatCard icon={TrendingUp} label="24H High" value={`$${formatPrice(high)}`} valueClass="text-emerald-400" />
          <StatCard icon={TrendingDown} label="24H Low" value={`$${formatPrice(low)}`} valueClass="text-rose-400" />
          <StatCard icon={BarChart3} label="Volume" value={formatCurrency(volume24h)} />
          <StatCard icon={Droplet} label="Spread" value={`$${spread.toFixed(2)}`} />
        </div>

        <div className="flex items-center gap-2 px-1 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold">Market Open</span>
          <span className="text-white/25 text-xs">· Simulated prices for education only — no real funds</span>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-white/45 text-xs uppercase tracking-wider font-semibold">Order Book</span>
            <span className="text-white/25 text-[10px]">{selectedCoin.symbol}/USDT</span>
          </div>
          <div className="flex items-center justify-between px-3 pt-2 text-[10px] text-white/25 uppercase tracking-wider">
            <span>Price</span>
            <span>Amount</span>
          </div>
          <div className="py-1">
            {orderBook.sells.map((o, i) => (
              <OrderBookRow
                key={`sell-${i}`}
                price={o.price}
                amount={o.amount}
                side="sell"
                depthPct={(o.amount / maxDepthAmount) * 100}
              />
            ))}
          </div>
          <div className="px-3 py-2.5 border-y border-white/[0.06] bg-white/[0.03] flex items-center justify-center">
            <span
              className="text-lg font-bold tabular-nums text-white"
              style={{ textShadow: '0 0 16px rgba(99,102,241,0.35)' }}
            >
              ${formatPrice(currentPrice)}
            </span>
          </div>
          <div className="py-1">
            {orderBook.buys.map((o, i) => (
              <OrderBookRow
                key={`buy-${i}`}
                price={o.price}
                amount={o.amount}
                side="buy"
                depthPct={(o.amount / maxDepthAmount) * 100}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-indigo-500/[0.07] to-violet-600/[0.07] p-4">
          <p className="text-white/45 text-xs uppercase tracking-wider font-semibold mb-3">Quick Trading</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => openTradeModal('long')}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all"
            >
              <TrendingUp size={16} />
              Buy Long
            </button>
            <button
              onClick={() => openTradeModal('short')}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-400 active:scale-[0.98] transition-all"
            >
              <TrendingDown size={16} />
              Sell Short
            </button>
          </div>
          <button
            onClick={() => openTradeModal(pendingDirection)}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Trade
          </button>
          <p className="text-white/25 text-[10px] mt-2 text-center">
            Balance: {formatCurrency(balance)}
          </p>
        </div>

        {recentTrades.length > 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <span className="text-white/45 text-xs uppercase tracking-wider font-semibold">Recent Trades</span>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto">
              {recentTrades.map((t) => (
                <RecentTradeRow key={t.id} trade={t} />
              ))}
            </div>
          </div>
        )}

        {/* Reserved space for existing BottomNav component */}
        <div className="h-16" />
      </div>

      <TradeModal
        isOpen={isTradeModalOpen}
        onClose={handleCloseTradeModal}
        coin={selectedCoin}
        initialPrice={currentPrice}
        balance={balance}
        onBalanceChange={handleBalanceChange}
        onTradeComplete={handleTradeComplete}
      />
    </div>
  );
}
