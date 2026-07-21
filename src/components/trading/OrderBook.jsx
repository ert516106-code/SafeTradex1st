import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';
import { formatPrice, formatCurrency } from '../../lib/tradingEngine';

const ORDER_ROWS = 8;
const UPDATE_INTERVAL_MS = 1400;

function generateSide(basePrice, side, rows) {
  const orders = [];
  let runningTotal = 0;
  for (let i = 1; i <= rows; i++) {
    const spreadStep = basePrice * 0.00015 * i;
    const jitter = (Math.random() - 0.5) * basePrice * 0.00008;
    const price =
      side === 'sell' ? basePrice + spreadStep + jitter : basePrice - spreadStep - jitter;
    const quantity = 0.02 + Math.random() * 2.8 * (1 - i / (rows * 2.2));
    runningTotal += quantity;
    orders.push({
      id: `${side}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      price: Math.max(price, 0.01),
      quantity,
      total: runningTotal,
    });
  }
  return side === 'sell' ? orders.reverse() : orders;
}

const OrderRow = React.memo(function OrderRow({ order, side, maxTotal, symbol }) {
  const isSell = side === 'sell';
  const depthPct = maxTotal > 0 ? (order.total / maxTotal) * 100 : 0;

  return (
    <div className="relative grid grid-cols-3 gap-2 px-3 py-1.5 text-[11px] sm:text-xs overflow-hidden transition-colors hover:bg-white/[0.04]">
      <div
        className={`absolute inset-y-0 right-0 transition-all duration-500 ease-out ${
          isSell ? 'bg-rose-500/10' : 'bg-emerald-500/10'
        }`}
        style={{ width: `${depthPct}%` }}
      />
      <span
        className={`relative z-10 font-semibold tabular-nums transition-colors duration-300 ${
          isSell ? 'text-rose-400' : 'text-emerald-400'
        }`}
      >
        {formatPrice(order.price)}
      </span>
      <span className="relative z-10 text-white/50 text-right tabular-nums">
        {order.quantity.toFixed(4)}
      </span>
      <span className="relative z-10 text-white/30 text-right tabular-nums">
        {order.total.toFixed(3)}
      </span>
    </div>
  );
});

const OrderBook = React.memo(function OrderBook({ currentPrice, coin = { symbol: 'BTC', name: 'Bitcoin' } }) {
  const [sellOrders, setSellOrders] = useState(() => generateSide(currentPrice || 0, 'sell', ORDER_ROWS));
  const [buyOrders, setBuyOrders] = useState(() => generateSide(currentPrice || 0, 'buy', ORDER_ROWS));
  const [priceFlash, setPriceFlash] = useState('up');

  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastPriceRef = useRef(currentPrice);
  const currentPriceRef = useRef(currentPrice);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    currentPriceRef.current = currentPrice;
    if (currentPrice !== undefined && lastPriceRef.current !== undefined) {
      if (currentPrice > lastPriceRef.current) setPriceFlash('up');
      else if (currentPrice < lastPriceRef.current) setPriceFlash('down');
    }
    lastPriceRef.current = currentPrice;
  }, [currentPrice]);

  const refreshOrderBook = () => {
    const base = currentPriceRef.current;
    if (!base || Number.isNaN(base)) return;
    setSellOrders(generateSide(base, 'sell', ORDER_ROWS));
    setBuyOrders(generateSide(base, 'buy', ORDER_ROWS));
  };

  // Regenerate whenever price changes meaningfully (smooth periodic refresh, not every tick)
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    refreshOrderBook();
    intervalRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
      refreshOrderBook();
    }, UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin?.symbol]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const bestSell = sellOrders.length ? sellOrders[sellOrders.length - 1].price : currentPrice;
  const bestBuy = buyOrders.length ? buyOrders[0].price : currentPrice;

  const spread = useMemo(() => {
    if (!bestSell || !bestBuy) return 0;
    return bestSell - bestBuy;
  }, [bestSell, bestBuy]);

  const spreadPct = useMemo(() => {
    if (!currentPrice) return 0;
    return (spread / currentPrice) * 100;
  }, [spread, currentPrice]);

  const maxTotal = useMemo(() => {
    const sellMax = sellOrders.length ? sellOrders[0].total : 0;
    const buyMax = buyOrders.length ? buyOrders[buyOrders.length - 1].total : 0;
    return Math.max(sellMax, buyMax, 1);
  }, [sellOrders, buyOrders]);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl overflow-hidden shadow-lg shadow-black/20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-white/40" />
          <span className="text-white/50 text-xs uppercase tracking-wide font-semibold">
            Order Book
          </span>
        </div>
        <span className="text-white/30 text-[10px]">{coin.symbol}/USDT</span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-3 pt-2.5 pb-1 text-[10px] text-white/30 uppercase tracking-wide">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      <div className="py-1">
        {sellOrders.map((order) => (
          <OrderRow key={order.id} order={order} side="sell" maxTotal={maxTotal} symbol={coin.symbol} />
        ))}
      </div>

      <div className="px-4 py-3 border-y border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {priceFlash === 'up' ? (
            <TrendingUp size={16} className="text-emerald-400" />
          ) : (
            <TrendingDown size={16} className="text-rose-400" />
          )}
          <span
            className={`text-lg font-bold tabular-nums transition-colors duration-300 ${
              priceFlash === 'up' ? 'text-emerald-400' : 'text-rose-400'
            }`}
            style={{
              textShadow:
                priceFlash === 'up'
                  ? '0 0 14px rgba(16,185,129,0.35)'
                  : '0 0 14px rgba(244,63,94,0.35)',
            }}
          >
            ${formatPrice(currentPrice)}
          </span>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[10px] uppercase tracking-wide">Spread</p>
          <p className="text-white/70 text-xs font-medium tabular-nums">
            ${spread.toFixed(2)} ({spreadPct.toFixed(3)}%)
          </p>
        </div>
      </div>

      <div className="py-1">
        {buyOrders.map((order) => (
          <OrderRow key={order.id} order={order} side="buy" maxTotal={maxTotal} symbol={coin.symbol} />
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Buy: {formatCurrency(buyOrders.reduce((sum, o) => sum + o.quantity * o.price, 0))}
        </span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Sell: {formatCurrency(sellOrders.reduce((sum, o) => sum + o.quantity * o.price, 0))}
        </span>
      </div>
    </div>
  );
});

export default OrderBook;
