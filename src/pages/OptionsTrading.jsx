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
  BTC: 65380.00,
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
    // Open Orders / Order History components handle their own data persistence
  }, []);

  const toggleChartStyle = useCallback(() => {
    setChartStyle((s) => (s === '1' ? '3' : '1'));
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div className="pb-28 bg-white min-h-screen text-slate-900">
      {/* Top Header Bar */}
      <div className="px-4 pt-3 flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-gray-700" />
            <span className="text-lg font-bold tracking-tight">{selected.symbol}</span>
          </button>
        </div>
        <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Pair Selector Dropdown */}
      {showPairs && (
        <div className="mx-4 my-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-1 z-50 relative">
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selected.symbol === p.symbol ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {p.symbol}
            </button>
          ))}
        </div>
      )}

      {/* Live Price Statistics Bar (Matched to Reference Image 3) */}
      <div className="px-4 py-3 flex items-start justify-between">
        <div>
          <div className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs font-semibold text-emerald-500 mt-0.5">
            +6.21%
          </div>
        </div>
        <div className="text-right text-[11px] space-y-0.5 text-gray-500 font-medium">
          <div className="flex justify-between gap-3">
            <span>High</span>
            <span className="font-bold text-slate-800">65416.77</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Low</span>
            <span className="font-bold text-slate-800">64341.99</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Vol</span>
            <span className="font-bold text-slate-800">9.44K</span>
          </div>
        </div>
      </div>

      {/* Timeframe & Chart Style Toolbar */}
      <div className="px-4 mb-2 flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="flex gap-4 overflow-x-auto text-sm">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`font-medium text-xs whitespace-nowrap transition-colors pb-1 ${
                activeTimeframe === t
                  ? 'text-blue-600 font-bold border-b-2 border-blue-600'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={toggleChartStyle}
          className="ml-2 p-1.5 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
          title={chartStyle === '1' ? 'Switch to Area chart' : 'Switch to Candlestick chart'}
        >
          {chartStyle === '1' ? (
            <AreaChart className="w-4 h-4 text-gray-500" />
          ) : (
            <CandlestickChart className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>

      {/* Main Graph Box (Sized compact with light theme styling) */}
      <div className="mx-4 rounded-xl overflow-hidden border border-gray-200 mb-3" style={{ height: 280 }}>
        <TradingViewWidget 
          symbol={selected.tv} 
          height={280} 
          interval={activeTimeframe} 
          chartStyle={chartStyle} 
          theme="light" 
        />
      </div>

      {/* Technical Indicators Bar */}
      <div className="px-4 flex gap-4 text-[11px] text-gray-400 font-semibold mb-3 overflow-x-auto border-b border-gray-100 pb-2">
        {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
          <span key={i} className="hover:text-gray-700 cursor-pointer">
            {i}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-6 border-b border-gray-200 text-xs font-bold mb-3">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'open' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'history' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent'
          }`}
        >
          Order History (201)
        </button>
      </div>

      {/* Orders List Container */}
      <div className="px-4 mb-20">{orderList}</div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200 flex gap-3 z-40 max-w-lg mx-auto shadow-lg">
        <button
          onClick={() => handleOpenModal('long')}
          className="flex-1 h-12 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
        >
          BUY LONG
        </button>
        <button
          onClick={() => handleOpenModal('short')}
          className="flex-1 h-12 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
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
