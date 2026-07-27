import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Info, CandlestickChart, AreaChart, Menu, ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const handleTradeComplete = useCallback(() => {}, []);

  const toggleChartStyle = useCallback(() => {
    setChartStyle((s) => (s === '1' ? '3' : '1'));
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div className="pb-28 min-h-screen text-slate-100 relative font-sans" style={{ backgroundColor: '#090d16' }}>
      
      {/* 1. TOP HEADER WITH ROUNDED BACK BUTTON */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-50 bg-[#0d1322]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-full bg-[#161f33] hover:bg-[#1e2a45] active:scale-95 border border-slate-700/50 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-200" />
          </button>
          
          <button 
            onClick={() => setShowPairs(!showPairs)} 
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
          >
            <Menu className="w-5 h-5 text-slate-300" />
            <span className="text-base font-extrabold tracking-tight text-white">{selected.symbol}</span>
          </button>
        </div>

        <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* 2. PAIR SELECTION DROPDOWN */}
      {showPairs && (
        <div className="mx-4 my-2 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 space-y-1 z-50 absolute left-0 right-0 top-12" style={{ backgroundColor: '#111827' }}>
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${
                selected.symbol === p.symbol ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <span>{p.symbol}</span>
              <span className="text-[10px] opacity-75">{p.coin}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. COMPACT PRICE & STATS ROW */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-800/40">
        <div>
          <div className="text-2xl font-black text-white tracking-tight leading-none">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +1.55%
          </div>
        </div>

        <div className="text-[11px] space-y-0.5 text-slate-400 font-medium text-right">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">High</span>
            <span className="font-semibold text-slate-200">65,416.77</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Low</span>
            <span className="font-semibold text-slate-200">64,341.99</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">24h Vol</span>
            <span className="font-semibold text-slate-200">9.44K</span>
          </div>
        </div>
      </div>

      {/* 4. TIMEFRAMES & CHART TOGGLE */}
      <div className="px-4 py-1.5 flex items-center justify-between border-b border-slate-800/50 bg-[#0b0f19]">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`font-semibold text-xs py-1 transition-all ${
                activeTimeframe === t
                  ? 'text-indigo-400 font-extrabold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={toggleChartStyle}
          className="ml-2 p-1 rounded-md flex items-center justify-center border border-slate-800 bg-[#131b2e] hover:border-slate-700 transition-colors"
          title={chartStyle === '1' ? 'Switch to Area chart' : 'Switch to Candlestick chart'}
        >
          {chartStyle === '1' ? (
            <AreaChart className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <CandlestickChart className="w-3.5 h-3.5 text-indigo-400" />
          )}
        </button>
      </div>

      {/* 5. TRADINGVIEW CHART CONTAINER */}
      <div className="w-full border-b border-slate-800/80 bg-[#0d1322]" style={{ height: 320 }}>
        <TradingViewWidget 
          symbol={selected.tv} 
          height={320} 
          interval={activeTimeframe} 
          chartStyle={chartStyle} 
          theme="dark" 
        />
      </div>

      {/* 6. TECHNICAL INDICATORS */}
      <div className="px-4 py-2 flex gap-4 text-[11px] text-slate-400 font-semibold overflow-x-auto border-b border-slate-800/50 bg-[#090d16]">
        {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
          <span key={i} className="hover:text-indigo-400 cursor-pointer transition-colors">
            {i}
          </span>
        ))}
      </div>

      {/* 7. ORDER TABS */}
      <div className="px-4 flex gap-6 border-b border-slate-800/80 text-xs font-bold pt-3 bg-[#090d16]">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2.5 transition-all border-b-2 ${
            activeTab === 'open' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 transition-all border-b-2 ${
            activeTab === 'history' ? 'text-indigo-400 border-indigo-500' : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          Order History
        </button>
      </div>

      {/* 8. ORDER CONTENT CONTAINER */}
      <div className="px-4 py-3">{orderList}</div>

      {/* 9. FLOATING ACTION BUTTON BAR */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-4 py-3 border-t border-slate-800/80 flex gap-3 z-40 max-w-md mx-auto backdrop-blur-xl bg-[#0d1322]/90 shadow-2xl"
      >
        <button
          onClick={() => handleOpenModal('long')}
          className="flex-1 h-12 rounded-xl text-sm font-extrabold bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <TrendingUp className="w-4 h-4" />
          BUY LONG
        </button>
        <button
          onClick={() => handleOpenModal('short')}
          className="flex-1 h-12 rounded-xl text-sm font-extrabold bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <TrendingDown className="w-4 h-4" />
          SELL SHORT
        </button>
      </div>

      {/* 10. TRADING MODAL */}
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
