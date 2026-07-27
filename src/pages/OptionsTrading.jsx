import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Info, CandlestickChart, AreaChart, Menu } from 'lucide-react';
import TradingViewWidget from "../components/trading/TradingViewWidget";
import TradingModal from "../components/trading/TradingModal";
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
  BTC: 65382.00,
  ETH: 1967.95,
  XRP: 1.11,
  SOL: 76.69,
  BNB: 574.64,
  DOGE: 0.14,
};

const INITIAL_BALANCE = 10000;

export default function OptionsTrading() {
  const [selected, setSelected] = useState(pairs[0]);
  const [modal, setModal] = useState({ open: false, type: 'long' });
  const [showPairs, setShowPairs] = useState(false);
  const [activeTab, setActiveTab] = useState('open');
  const [activeTimeframe, setActiveTimeframe] = useState('1m');
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
        return +(prev * (1 + pct)).toFixed(2);
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
    // Open Orders / Order History manage their own state
  }, []);

  const toggleChartStyle = useCallback(() => {
    setChartStyle((s) => (s === '1' ? '3' : '1'));
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div className="pb-28 min-h-screen text-slate-100" style={{ backgroundColor: '#0b0f19' }}>
      {/* Header */}
      <div className="px-4 pt-3 flex items-center justify-between border-b border-slate-800/60 pb-2">
        <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-slate-300" />
          <span className="text-lg font-bold tracking-tight text-white">{selected.symbol}</span>
        </button>
        <Info className="w-5 h-5 text-slate-400 cursor-pointer" />
      </div>

      {/* Pair Dropdown */}
      {showPairs && (
        <div className="mx-4 my-2 border border-slate-700/60 rounded-xl shadow-xl p-2 space-y-1 z-50 relative" style={{ backgroundColor: '#131b2e' }}>
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selected.symbol === p.symbol ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-200'
              }`}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      )}

      {/* Live Price Statistics */}
      <div className="px-4 py-3 flex items-start justify-between">
        <div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            +1.55%
          </div>
        </div>
        <div className="text-right text-[11px] space-y-0.5 text-slate-400 font-medium">
          <div className="flex justify-between gap-3">
            <span>High</span>
            <span className="font-bold text-slate-200">65,416.77</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Low</span>
            <span className="font-bold text-slate-200">64,341.99</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Vol</span>
            <span className="font-bold text-slate-200">9.44K</span>
          </div>
        </div>
      </div>

      {/* Timeframes & Chart Type Toggle */}
      <div className="px-4 mb-2 flex items-center justify-between border-t border-slate-800/60 pt-2">
        <div className="flex gap-4 overflow-x-auto text-sm">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`font-medium text-xs whitespace-nowrap transition-colors pb-1 ${
                activeTimeframe === t
                  ? 'text-indigo-400 font-bold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={toggleChartStyle}
          className="ml-2 p-1.5 rounded-lg flex items-center justify-center shrink-0 border border-slate-800"
          style={{ backgroundColor: '#131b2e' }}
          title={chartStyle === '1' ? 'Switch to Area chart' : 'Switch to Candlestick chart'}
        >
          {chartStyle === '1' ? (
            <AreaChart className="w-4 h-4 text-slate-400" />
          ) : (
            <CandlestickChart className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>

      {/* Chart Box */}
      <div className="mx-4 rounded-xl overflow-hidden border border-slate-800/80 mb-3" style={{ height: 320, backgroundColor: '#0d1322' }}>
        <TradingViewWidget 
          symbol={selected.tv} 
          height={320} 
          interval={activeTimeframe} 
          chartStyle={chartStyle} 
          theme="dark" 
        />
      </div>

      {/* Indicator Bar */}
      <div className="px-4 flex gap-4 text-[11px] text-slate-400 font-semibold mb-3 overflow-x-auto border-b border-slate-800/60 pb-2">
        {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
          <span key={i} className="hover:text-slate-200 cursor-pointer">
            {i}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-6 border-b border-slate-800/60 text-xs font-bold mb-3">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'open' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'history' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent'
          }`}
        >
          Order History
        </button>
      </div>

      {/* Orders Component */}
      <div className="px-4 mb-20">{orderList}</div>

      {/* Bottom Floating Action Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-4 py-3 border-t border-slate-800 flex gap-3 z-40 max-w-lg mx-auto backdrop-blur-md" 
        style={{ backgroundColor: 'rgba(11, 15, 25, 0.95)' }}
      >
        <button
          onClick={() => handleOpenModal('long')}
          className="flex-1 h-12 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white shadow-lg shadow-emerald-950/20 transition-all"
        >
          BUY LONG
        </button>
        <button
          onClick={() => handleOpenModal('short')}
          className="flex-1 h-12 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white shadow-lg shadow-rose-950/20 transition-all"
        >
          SELL SHORT
        </button>
      </div>

      {/* Trading Modal Integration */}
      <TradingModal
        open={modal.open}
        type={modal.type}
        coin={selected.coin}
        balance={balance}
        currentPrice={currentPrice}
        onClose={handleCloseModal}
        onTradeComplete={handleTradeComplete}
        onBalanceChange={handleBalanceChange}
      />
    </div>
  );
}
