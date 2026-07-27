import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Info, CandlestickChart, AreaChart } from 'lucide-react';
import TradingViewWidget from "../components/trading/TradingViewWidget";
import TradeModal from "../components/trading/TradingModal";
import OpenOrders from "../components/trading/Openorders";
import OrderHistory from "../components/trading/Orderhistory";

const pairs = [
  { symbol: 'BTC/USDT', tv: 'BINANCE:BTCUSDT', coin: 'BTC' },
  { symbol: 'ETH/USDT', tv: 'BINANCE:ETHUSDT', coin: 'ETH' },
  { symbol: 'XRP/USDT', tv: 'BINANCE:XRPUSDT', coin: 'XRP' },
  { symbol: 'SOL/USDT', tv: 'BINANCE:SOLUSDT', coin: 'SOL' },
  { symbol: 'BNB/USDT', tv: 'BINANCE:BNBUSDT', coin: 'BNB' },
  { symbol: 'DOGE/USDT', tv: 'BINANCE:DOGEUSDT', coin: 'DOGE' },
];

const timeframes = ['1m', '15m', '30m', '1h', '2h', '6h'];

const BASE_PRICES = {
  BTC: 68400,
  ETH: 3850,
  XRP: 0.62,
  SOL: 185,
  BNB: 590,
  DOGE: 0.14,
};

const INITIAL_BALANCE = 10000;

export default function OptionsTrading() {
  const [selected, setSelected] = useState(pairs[0]);
  const [modal, setModal] = useState({ open: false, type: 'long' });
  const [showPairs, setShowPairs] = useState(false);
  const [activeTab, setActiveTab] = useState('open');
  const [activeTimeframe, setActiveTimeframe] = useState('15m');
  const [chartStyle, setChartStyle] = useState('1'); // '1'=candles, '3'=area
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [currentPrice, setCurrentPrice] = useState(BASE_PRICES[pairs[0].coin]);

  const priceTickRef = useRef(null);

  useEffect(() => {
    setCurrentPrice(BASE_PRICES[selected.coin] ?? 1000);
  }, [selected.coin]);

  useEffect(() => {
    if (modal.open) return;
    priceTickRef.current = setInterval(() => {
      setCurrentPrice((prev) => {
        const pct = (Math.random() - 0.5) * 0.001;
        return +(prev * (1 + pct)).toFixed(4);
      });
    }, 2000);
    return () => clearInterval(priceTickRef.current);
  }, [modal.open, selected.coin]);

  const handleSelectPair = useCallback((pair) => {
    setSelected(pair);
    setShowPairs(false);
  }, []);

  const handleOpenModal = useCallback((type) => {
    setModal({ open: true, type });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }));
  }, []);

  const handleBalanceChange = useCallback((nextBalance) => {
    setBalance(nextBalance);
  }, []);

  const handleTradeComplete = useCallback(() => {
    // Open Orders / Order History components manage their own data sources;
    // this hook is available for any future local bookkeeping.
  }, []);

  const toggleChartStyle = useCallback(() => {
    setChartStyle((s) => (s === '1' ? '3' : '1'));
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div className="pb-24">
      <div className="px-4 pt-3 flex items-center justify-between mb-2">
        <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-1">
          <span className="text-lg font-bold">{selected.symbol}</span>
        </button>
        <Info className="w-5 h-5 text-muted-foreground" />
      </div>

      {showPairs && (
        <div className="mx-4 mb-3 bg-white border rounded-xl shadow-lg p-2 space-y-1">
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                selected.symbol === p.symbol ? 'bg-primary text-white' : 'hover:bg-secondary'
              }`}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex gap-3 overflow-x-auto text-sm">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`font-medium whitespace-nowrap transition-colors ${
                activeTimeframe === t
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={toggleChartStyle}
          className="ml-3 w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border"
          title={chartStyle === '1' ? 'Switch to Area chart' : 'Switch to Candlestick chart'}
        >
          {chartStyle === '1' ? (
            <AreaChart className="w-4 h-4 text-muted-foreground" />
          ) : (
            <CandlestickChart className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>

      <div className="mx-4 rounded-xl overflow-hidden border mb-4" style={{ height: 350 }}>
        <TradingViewWidget symbol={selected.tv} height={350} interval={activeTimeframe} chartStyle={chartStyle} />
      </div>

      <div className="px-4 flex gap-3 text-xs text-muted-foreground mb-4 overflow-x-auto">
        {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
          <span key={i} className="font-medium">
            {i}
          </span>
        ))}
      </div>

      <div className="px-4 flex gap-4 border-b border-border pb-3 mb-0 text-sm">
        <button
          onClick={() => setActiveTab('open')}
          className={`font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === 'open' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === 'history' ? 'text-primary border-primary' : 'text-muted-foreground border-transparent'
          }`}
        >
          Order History
        </button>
      </div>

      <div className="mb-24">{orderList}</div>

      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white border-t flex gap-3 z-40 max-w-lg mx-auto">
        <button
          onClick={() => handleOpenModal('long')}
          className="flex-1 h-12 rounded-xl text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          BUY LONG
        </button>
        <button
          onClick={() => handleOpenModal('short')}
          className="flex-1 h-12 rounded-xl text-base font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          SELL SHORT
        </button>
      </div>

      {modal.open && (
        <TradeModal
          balance={balance}
          currentPrice={currentPrice}
          coin={selected.coin}
          type={modal.type}
          onClose={handleCloseModal}
          onTradeComplete={handleTradeComplete}
          onBalanceChange={handleBalanceChange}
        />
      )}
    </div>
  );
}
