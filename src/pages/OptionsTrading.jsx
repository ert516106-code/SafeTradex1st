import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, Menu, ChevronDown, 
  Maximize2, Sliders, TrendingUp, TrendingDown, FileText, Search 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TradingViewWidget from "../components/trading/TradingViewWidget";
import TradingModal from "../components/trading/TradingModal";
import OpenOrders from "../components/trading/Openorders";
import OrderHistory from "../components/trading/Orderhistory";

const pairs = [
  { symbol: 'BTC/USDT', tv: 'BINANCE:BTCUSDT', coinId: 'bitcoin', ticker: 'BTC' },
  { symbol: 'ETH/USDT', tv: 'BINANCE:ETHUSDT', coinId: 'ethereum', ticker: 'ETH' },
  { symbol: 'XRP/USDT', tv: 'BINANCE:XRPUSDT', coinId: 'ripple', ticker: 'XRP' },
  { symbol: 'SOL/USDT', tv: 'BINANCE:SOLUSDT', coinId: 'solana', ticker: 'SOL' },
  { symbol: 'BNB/USDT', tv: 'BINANCE:BNBUSDT', coinId: 'binancecoin', ticker: 'BNB' },
  { symbol: 'DOGE/USDT', tv: 'BINANCE:DOGEUSDT', coinId: 'dogecoin', ticker: 'DOGE' },
];

const timeframes = ['1m', '5m', '15m', '30m', '1h', '2h', '6h', '12h', '1D'];

export default function OptionsTrading() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(pairs[0]);
  const [modal, setModal] = useState({ open: false, type: 'long' });
  const [showPairs, setShowPairs] = useState(false);
  const [activeTab, setActiveTab] = useState('open');
  const [activeTimeframe, setActiveTimeframe] = useState('1m');
  const [activeIndicator, setActiveIndicator] = useState('MA');
  const [balance, setBalance] = useState(10000);

  // Live market stats state sourced from CoinGecko
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    loading: true
  });

  // Fetch Live CoinGecko Market Data
  const fetchCoinGeckoData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selected.coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      if (!response.ok) throw new Error('CoinGecko API rate limit or error');
      
      const data = await response.json();
      
      if (data && data.market_data) {
        setMarketData({
          price: data.market_data.current_price.usd,
          change24h: data.market_data.price_change_percentage_24h ?? 0,
          high24h: data.market_data.high_24h.usd ?? 0,
          low24h: data.market_data.low_24h.usd ?? 0,
          volume24h: data.market_data.total_volume.usd ?? 0,
          loading: false
        });
      }
    } catch (error) {
      console.warn("CoinGecko fetch failed, retrying on next tick:", error);
    }
  }, [selected.coinId]);

  // Initial fetch and 1-minute (60,000ms) polling interval for CoinGecko
  useEffect(() => {
    setMarketData((prev) => ({ ...prev, loading: true }));
    fetchCoinGeckoData();

    const ONE_MINUTE = 60000;
    const interval = setInterval(fetchCoinGeckoData, ONE_MINUTE);

    return () => clearInterval(interval);
  }, [fetchCoinGeckoData]);

  const handleSelectPair = useCallback((pair) => {
    setSelected(pair);
    setShowPairs(false);
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div 
      style={{
        minHeight: "100vh",
        // Slightly softer gradient for better contrast with text
        background: "radial-gradient(circle at 50% 0%, #1a2744 0%, #0b1026 100%)",
        boxSizing: "border-box",
      }}
      // Added 'select-none' to prevent accidental text highlighting while tapping
      className="text-slate-100 font-sans pb-32 relative flex flex-col items-center select-none"
    >
      {/* Container with extra padding for professional breathing room */}
      <div className="w-full max-w-[520px] px-5 pt-4 flex flex-col relative">
        
        {/* 1. TOP HEADER BAR */}
        <header className="py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="text-slate-400 hover:text-white transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setShowPairs(!showPairs)} 
              className="flex items-center gap-3 group relative"
            >
              <Menu className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f7931a] text-black font-black text-xs flex items-center justify-center shadow-lg shadow-orange-900/20">
                  ₿
                </div>
                <span className="text-xl font-bold text-white tracking-tight">{selected.symbol}</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </header>

        {/* 2. PAIR SELECTION DROPDOWN */}
        {showPairs && (
          <div className="mx-0 mt-3 border border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 z-50 absolute left-5 right-5 top-16 bg-[#131b36]/95 backdrop-blur-xl">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                onClick={() => handleSelectPair(p)}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${
                  selected.symbol === p.symbol 
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                    : 'hover:bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base font-extrabold">{p.symbol}</span>
                <span className="text-xs text-slate-500 font-semibold uppercase">{p.ticker}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. COINGECKO LIVE PRICE & MARKET STATS */}
        <section className="py-6 flex items-start justify-between border-b border-white/5">
          <div>
            <div className="text-4xl font-black text-white tracking-tight leading-none">
              {marketData.loading 
                ? "---" 
                : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className={`text-sm font-bold mt-2 flex items-center gap-2 ${marketData.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-xs">
                {marketData.change24h >= 0 ? '▲' : '▼'} {Math.abs(marketData.change24h).toFixed(2)}%
              </span>
              <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">24h</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-right text-xs font-semibold">
            <div className="flex flex-col">
              <span className="text-slate-500 mb-0.5">High</span>
              <span className="text-emerald-400 font-bold">
                {marketData.loading ? "---" : `$${marketData.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-slate-500 mb-0.5">Low</span>
              <span className="text-rose-400 font-bold">
                {marketData.loading ? "---" : `$${marketData.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-slate-500 mb-0.5">Vol</span>
              <span className="text-white font-bold">
                {marketData.loading ? "---" : `$${(marketData.volume24h / 1e6).toFixed(2)}M`}
              </span>
            </div>
          </div>
        </section>

        {/* 4. TIMEFRAME SELECTOR */}
        <div className="py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {timeframes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTimeframe === t 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="text-slate-500 hover:text-white p-1.5 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 5. TRADINGVIEW CHART CONTAINER */}
        {/* Increased height slightly for better data visibility */}
        <div className="w-full my-3 rounded-2xl overflow-hidden border border-white/5 bg-[#070b19] shadow-xl relative" style={{ height: 360 }}>
          <TradingViewWidget 
            symbol={selected.tv} 
            height={360} 
            interval={activeTimeframe} 
            theme="dark" 
          />
        </div>

        {/* 6. TECHNICAL INDICATORS */}
        <div className="py-2.5 flex items-center justify-between text-xs font-bold border-b border-white/5">
          <div className="flex items-center gap-1.5 text-slate-500">
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndicator(i)}
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  activeIndicator === i 
                    ? 'bg-blue-600/20 text-blue-300' 
                    : 'hover:text-white'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <button className="text-slate-500 hover:text-white p-1.5 transition-colors">
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* 7. ORDERS & HISTORY TABS */}
        <div className="flex gap-8 border-b border-white/5 text-sm font-bold pt-6">
          <button
            onClick={() => setActiveTab('open')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'open' 
                ? 'text-white border-white' 
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Open Orders
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'history' 
                ? 'text-white border-white' 
                : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Order History
          </button>
        </div>

        {/* 8. TAB CONTENT / EMPTY STATE WITH GLASSMORPHISM */}
        <div className="py-8 flex-1 flex flex-col justify-center min-h-[180px]">
          {activeTab === 'open' ? (
            // Created a professional glassmorphism card for empty state
            <div className="flex flex-col items-center justify-center text-center py-10 px-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <div className="relative mb-4 text-slate-600">
                <FileText className="w-14 h-14 stroke-1" />
                <Search className="w-5 h-5 absolute -bottom-1 -right-1 stroke-2 text-slate-500" />
              </div>
              <p className="text-base font-bold text-slate-300">No Open Orders</p>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Your active positions will appear here.</p>
            </div>
          ) : (
            orderList
          )}
        </div>
      </div>

      {/* 9. FLOATING ACTION BUTTONS AT THE BOTTOM */}
      {/* Increased bottom padding and added an inner container for separation */}
      <div className="fixed bottom-8 left-0 right-0 z-40 px-5 flex justify-center pointer-events-none">
        <div className="w-full max-w-[520px] flex gap-3 pointer-events-auto">
          <button
            onClick={() => setModal({ open: true, type: 'long' })}
            className="flex-1 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-white flex flex-col items-center justify-center transition-all shadow-xl shadow-emerald-900/60 cursor-pointer"
          >
            <span className="text-sm font-black tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" /> Buy Long
            </span>
            <span className="text-[11px] font-bold opacity-90 mt-1">
              {marketData.loading ? "---" : `$${marketData.price.toFixed(2)}`}
            </span>
          </button>

          <button
            onClick={() => setModal({ open: true, type: 'short' })}
            className="flex-1 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-[0.97] text-white flex flex-col items-center justify-center transition-all shadow-xl shadow-rose-900/60 cursor-pointer"
          >
            <span className="text-sm font-black tracking-wide flex items-center gap-2">
              <TrendingDown className="w-4 h-4 stroke-[2.5]" /> Sell Short
            </span>
            <span className="text-[11px] font-bold opacity-90 mt-1">
              {marketData.loading ? "---" : `$${marketData.price.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>

      {/* 10. TRADING MODAL */}
      <TradingModal
        open={modal.open}
        type={modal.type}
        coin={selected.ticker}
        balance={balance}
        currentPrice={marketData.price}
        onClose={() => setModal({ open: false, type: 'long' })}
        onBalanceChange={setBalance}
      />
    </div>
  );
}
