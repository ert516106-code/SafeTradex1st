import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Info, CandlestickChart, AreaChart, Menu, ChevronLeft, TrendingUp, TrendingDown, Clock, History } from 'lucide-react';
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
  BTC: 65416.40,
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
  const [chartStyle, setChartStyle] = useState('1'); 
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
    <div className="min-h-screen text-slate-100 font-sans pb-32 relative bg-[#070a12] selection:bg-indigo-500/30">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-xl bg-slate-800/60 hover:bg-slate-800 active:scale-95 border border-slate-700/50 flex items-center justify-center transition-all cursor-pointer text-slate-300 hover:text-white"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setShowPairs(!showPairs)} 
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all group"
          >
            <Menu className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
            <span className="text-base font-bold tracking-tight text-white">{selected.symbol}</span>
          </button>
        </div>

        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/40 transition-all">
          <Info className="w-4 h-4" />
        </button>
      </header>

      {/* 2. ASSET DROPDOWN DRAWER */}
      {showPairs && (
        <div className="mx-4 my-2 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 absolute left-0 right-0 top-14 bg-[#0d1322]/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex justify-between items-center ${
                selected.symbol === p.symbol 
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <span className="text-sm">{p.symbol}</span>
              <span className="text-[10px] font-semibold opacity-75 uppercase tracking-wider">{p.coin}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. LIVE PRICE & STATS OVERVIEW */}
      <section className="px-4 py-3.5 border-b border-slate-800/50 bg-[#0b0f19]/40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
              ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mt-2">
              <TrendingUp className="w-3 h-3" />
              +1.55%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-[11px] font-medium">
            <span className="text-slate-500">High</span>
            <span className="font-semibold text-slate-200">65,416.77</span>
            <span className="text-slate-500">Low</span>
            <span className="font-semibold text-slate-200">64,341.99</span>
            <span className="text-slate-500">24h Vol</span>
            <span className="font-semibold text-slate-200">9.44K</span>
          </div>
        </div>
      </section>

      {/* 4. TIMEFRAME SELECTOR & CHART CONTROL */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/60 bg-[#070a12]">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                activeTimeframe === t
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={toggleChartStyle}
          className="ml-2 p-1.5 rounded-lg flex items-center justify-center border border-slate-800 bg-[#0d1322] hover:bg-slate-800/80 hover:border-slate-700 transition-all"
          title={chartStyle === '1' ? 'Switch to Area chart' : 'Switch to Candlestick chart'}
        >
          {chartStyle === '1' ? (
            <AreaChart className="w-4 h-4 text-slate-400" />
          ) : (
            <CandlestickChart className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>

      {/* 5. TRADINGVIEW CHART CONTAINER */}
      <div className="w-full border-b border-slate-800/80 bg-[#090d16] relative" style={{ height: 340 }}>
        <TradingViewWidget 
          symbol={selected.tv} 
          height={340} 
          interval={activeTimeframe} 
          chartStyle={chartStyle} 
          theme="dark" 
        />
      </div>

      {/* 6. TECHNICAL INDICATORS BAR */}
      <div className="px-4 py-2.5 flex items-center gap-5 text-xs text-slate-400 font-bold overflow-x-auto border-b border-slate-800/50 bg-[#0b0f19]/60 no-scrollbar">
        {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
          <button key={i} className="hover:text-indigo-400 transition-colors uppercase tracking-wider text-[11px]">
            {i}
          </button>
        ))}
      </div>

      {/* 7. ORDERS & HISTORY TABS */}
      <div className="px-4 flex gap-8 border-b border-slate-800/80 text-xs font-bold pt-3 bg-[#070a12]">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-3 transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'open' 
              ? 'text-indigo-400 border-indigo-500' 
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'history' 
              ? 'text-indigo-400 border-indigo-500' 
              : 'text-slate-500 border-transparent hover:text-slate-300'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Order History
        </button>
      </div>

      {/* 8. TAB CONTENT AREA */}
      <div className="px-4 py-4">{orderList}</div>

      {/* 9. FLOATING BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-slate-800/80 z-40 max-w-lg mx-auto backdrop-blur-2xl bg-[#0b0f19]/85 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)] flex gap-3">
        <button
          onClick={() => handleOpenModal('long')}
          className="flex-1 h-12 rounded-xl text-sm font-black bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wider"
        >
          <TrendingUp className="w-4 h-4" />
          BUY LONG
        </button>

        <button
          onClick={() => handleOpenModal('short')}
          className="flex-1 h-12 rounded-xl text-sm font-black bg-rose-500 hover:bg-rose-400 active:scale-[0.98] text-white shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer tracking-wider"
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
