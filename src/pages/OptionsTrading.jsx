import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, Menu, ChevronDown, Star, Bell, Share2, 
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
  const [isFavorite, setIsFavorite] = useState(false);

  // Live market stats from CoinGecko
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

  // Initial fetch and 1-minute (60,000ms) polling interval
  useEffect(() => {
    setMarketData((prev) => ({ ...prev, loading: true }));
    fetchCoinGeckoData();

    // 1-minute live price update
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
    <div className="bg-[#030508] min-h-screen flex justify-center text-slate-100 font-sans selection:bg-blue-600">
      
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] bg-[#080b11] border-x border-slate-800/50 min-h-screen flex flex-col relative pb-28">
        
        {/* 1. TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-50 px-3 py-2 flex items-center justify-between border-b border-slate-800/80 bg-[#080b11]">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(-1)} className="text-slate-300 hover:text-white p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-2">
              <Menu className="w-5 h-5 text-slate-300" />
              <div className="w-5 h-5 rounded-full bg-[#f7931a] text-black font-extrabold text-[11px] flex items-center justify-center">
                ₿
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">{selected.symbol}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3.5 text-slate-300">
            <button onClick={() => setIsFavorite(!isFavorite)}>
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button><Bell className="w-4 h-4" /></button>
            <button><Share2 className="w-4 h-4" /></button>
          </div>
        </header>

        {/* 2. PAIR SELECTION DROPDOWN */}
        {showPairs && (
          <div className="mx-3 my-1 border border-slate-800 rounded-xl shadow-2xl p-1.5 space-y-1 z-50 absolute left-0 right-0 top-11 bg-[#0f1420]">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                onClick={() => handleSelectPair(p)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${
                  selected.symbol === p.symbol ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <span className="text-sm font-extrabold">{p.symbol}</span>
                <span className="text-[10px] text-slate-400 uppercase">{p.ticker}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. LIVE COINGECKO PRICE & MARKET STATS */}
        <section className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/40 bg-[#080b11]">
          <div>
            <div className="text-[26px] font-black leading-none text-white tracking-tight">
              {marketData.loading 
                ? "..." 
                : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            <div className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${marketData.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              <span>{marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%</span>
              <span className="text-slate-500 font-normal">24H</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-right text-[11px] font-semibold leading-tight">
            <span className="text-slate-500">High</span>
            <span className="text-emerald-400 font-bold">
              {marketData.loading ? "..." : `$${marketData.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </span>
            
            <span className="text-slate-500">Low</span>
            <span className="text-rose-500 font-bold">
              {marketData.loading ? "..." : `$${marketData.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </span>
            
            <span className="text-slate-500">24H Vol</span>
            <span className="text-white font-bold">
              {marketData.loading ? "..." : `$${(marketData.volume24h / 1e6).toFixed(2)}M`}
            </span>
          </div>
        </section>

        {/* 4. TIMEFRAME SELECTOR */}
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-800/60 bg-[#080b11]">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {timeframes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  activeTimeframe === t 
                    ? 'bg-[#2563eb] text-white' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="text-slate-400 hover:text-white pl-2">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5. LIVE TRADINGVIEW CHART CONTAINER */}
        <div className="w-full border-b border-slate-800/80 bg-[#080b11] relative" style={{ height: 350 }}>
          <TradingViewWidget 
            symbol={selected.tv} 
            height={350} 
            interval={activeTimeframe} 
            theme="dark" 
          />
        </div>

        {/* 6. TECHNICAL INDICATORS */}
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold border-b border-slate-800/60 bg-[#080b11]">
          <div className="flex items-center gap-3 text-slate-400">
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndicator(i)}
                className={`px-1.5 py-0.5 rounded ${activeIndicator === i ? 'bg-[#2563eb] text-white' : 'hover:text-white'}`}
              >
                {i}
              </button>
            ))}
          </div>
          <button className="text-slate-400 hover:text-white"><Sliders className="w-3.5 h-3.5" /></button>
        </div>

        {/* 7. OPEN ORDERS & ORDER HISTORY TABS */}
        <div className="px-4 flex gap-6 border-b border-slate-800/80 text-xs font-extrabold pt-2.5 bg-[#080b11]">
          <button
            onClick={() => setActiveTab('open')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'open' 
                ? 'text-[#3b82f6] border-[#3b82f6]' 
                : 'text-slate-400 border-transparent'
            }`}
          >
            Open Orders (0)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === 'history' 
                ? 'text-[#3b82f6] border-[#3b82f6]' 
                : 'text-slate-400 border-transparent'
            }`}
          >
            Order History
          </button>
        </div>

        {/* 8. TAB CONTENT / EMPTY STATE */}
        <div className="px-4 py-8 flex-1 flex flex-col justify-center">
          {activeTab === 'open' ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="relative mb-2 text-slate-500">
                <FileText className="w-10 h-10 stroke-1" />
                <Search className="w-4 h-4 absolute -bottom-1 -right-1 stroke-2 text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-200">No open orders</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Place a trade to see it here</p>
            </div>
          ) : (
            orderList
          )}
        </div>

        {/* 9. FIXED BOTTOM ACTION BUTTONS WITH COINGECKO LIVE PRICES */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-2.5 bg-[#080b11] border-t border-slate-800/80 z-40 flex gap-2.5">
          <button
            onClick={() => setModal({ open: true, type: 'long' })}
            className="flex-1 py-2 rounded-xl bg-[#10b981] active:bg-emerald-600 text-white flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
          >
            <span className="text-xs font-black tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 stroke-[3]" /> BUY LONG
            </span>
            <span className="text-[10px] font-bold opacity-90 mt-0.5">
              {marketData.loading ? "..." : marketData.price.toFixed(2)}
            </span>
          </button>

          <button
            onClick={() => setModal({ open: true, type: 'short' })}
            className="flex-1 py-2 rounded-xl bg-[#f43f5e] active:bg-rose-600 text-white flex flex-col items-center justify-center active:scale-[0.98] transition-transform"
          >
            <span className="text-xs font-black tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 stroke-[3]" /> SELL SHORT
            </span>
            <span className="text-[10px] font-bold opacity-90 mt-0.5">
              {marketData.loading ? "..." : marketData.price.toFixed(2)}
            </span>
          </button>
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
    </div>
  );
}
