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
        background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)",
        boxSizing: "border-box",
      }}
      className="text-slate-100 font-sans pb-28 relative flex flex-col items-center"
    >
      <div className="w-full max-w-[520px] px-4 pt-4 flex flex-col relative">
        
        {/* 1. TOP HEADER BAR (STAR, BELL, SHARE REMOVED) */}
        <header className="py-3 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-slate-200 hover:text-white p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-2.5 group">
              <Menu className="w-6 h-6 text-slate-200" />
              <div className="w-7 h-7 rounded-full bg-[#f7931a] text-black font-black text-xs flex items-center justify-center shadow-md">
                ₿
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">{selected.symbol}</span>
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </header>

        {/* 2. PAIR SELECTION DROPDOWN */}
        {showPairs && (
          <div className="mx-2 my-1 border border-slate-700/80 rounded-2xl shadow-2xl p-2 space-y-1 z-50 absolute left-4 right-4 top-16 bg-[#0c132c]/95 backdrop-blur-md">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                onClick={() => handleSelectPair(p)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${
                  selected.symbol === p.symbol ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <span className="text-base font-extrabold">{p.symbol}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase">{p.ticker}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. COINGECKO LIVE PRICE & MARKET STATS */}
        <section className="py-4 flex items-center justify-between border-b border-slate-700/40">
          <div>
            <div className="text-3xl font-black text-white tracking-tight leading-none">
              {marketData.loading 
                ? "..." 
                : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className={`text-xs font-extrabold mt-1.5 flex items-center gap-1.5 ${marketData.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              <span>{marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%</span>
              <span className="text-slate-400 font-medium">24H</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-xs font-semibold">
            <span className="text-slate-400">High</span>
            <span className="text-emerald-400 font-extrabold">
              {marketData.loading ? "..." : `$${marketData.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </span>
            
            <span className="text-slate-400">Low</span>
            <span className="text-rose-500 font-extrabold">
              {marketData.loading ? "..." : `$${marketData.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </span>
            
            <span className="text-slate-400">24H Vol</span>
            <span className="text-white font-extrabold">
              {marketData.loading ? "..." : `$${(marketData.volume24h / 1e6).toFixed(2)}M`}
            </span>
          </div>
        </section>

        {/* 4. TIMEFRAME SELECTOR */}
        <div className="py-2.5 flex items-center justify-between border-b border-slate-700/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {timeframes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  activeTimeframe === t 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="text-slate-400 hover:text-white pl-2">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* 5. TRADINGVIEW CHART CONTAINER */}
        <div className="w-full my-2 rounded-2xl overflow-hidden border border-slate-700/50 bg-[#070b19] shadow-xl relative" style={{ height: 340 }}>
          <TradingViewWidget 
            symbol={selected.tv} 
            height={340} 
            interval={activeTimeframe} 
            theme="dark" 
          />
        </div>

        {/* 6. TECHNICAL INDICATORS */}
        <div className="py-2 flex items-center justify-between text-xs font-bold border-b border-slate-700/40">
          <div className="flex items-center gap-3 text-slate-400">
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndicator(i)}
                className={`px-2 py-1 rounded-md transition-colors ${activeIndicator === i ? 'bg-blue-600 text-white font-black' : 'hover:text-white'}`}
              >
                {i}
              </button>
            ))}
          </div>
          <button className="text-slate-400 hover:text-white p-1"><Sliders className="w-4 h-4" /></button>
        </div>

        {/* 7. ORDERS & HISTORY TABS */}
        <div className="flex gap-8 border-b border-slate-700/50 text-sm font-extrabold pt-4">
          <button
            onClick={() => setActiveTab('open')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'open' 
                ? 'text-blue-400 border-blue-500' 
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Open Orders (0)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'history' 
                ? 'text-blue-400 border-blue-500' 
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Order History
          </button>
        </div>

        {/* 8. TAB CONTENT / EMPTY STATE */}
        <div className="py-10 flex-1 flex flex-col justify-center">
          {activeTab === 'open' ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="relative mb-3 text-slate-400">
                <FileText className="w-12 h-12 stroke-1" />
                <Search className="w-5 h-5 absolute -bottom-1 -right-1 stroke-2 text-slate-300" />
              </div>
              <p className="text-sm font-extrabold text-slate-200">No open orders</p>
              <p className="text-xs text-slate-400 mt-1">Place a trade to see it here</p>
            </div>
          ) : (
            orderList
          )}
        </div>
      </div>

      {/* 9. FLOATING ACTION BUTTONS AT THE BOTTOM (POSITIONED FOR CLEAN DISPLAY WITHOUT NAV BAR) */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-[520px] flex gap-3 pointer-events-auto">
          <button
            onClick={() => setModal({ open: true, type: 'long' })}
            className="flex-1 py-3.5 rounded-2xl bg-[#10b981] hover:bg-emerald-500 active:scale-[0.98] text-white flex flex-col items-center justify-center transition-all shadow-xl shadow-emerald-950/50 cursor-pointer"
          >
            <span className="text-sm font-black tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 stroke-[3]" /> BUY LONG
            </span>
            <span className="text-xs font-bold opacity-90 mt-0.5">
              {marketData.loading ? "..." : marketData.price.toFixed(2)}
            </span>
          </button>

          <button
            onClick={() => setModal({ open: true, type: 'short' })}
            className="flex-1 py-3.5 rounded-2xl bg-[#f43f5e] hover:bg-rose-500 active:scale-[0.98] text-white flex flex-col items-center justify-center transition-all shadow-xl shadow-rose-950/50 cursor-pointer"
          >
            <span className="text-sm font-black tracking-wide flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 stroke-[3]" /> SELL SHORT
            </span>
            <span className="text-xs font-bold opacity-90 mt-0.5">
              {marketData.loading ? "..." : marketData.price.toFixed(2)}
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
