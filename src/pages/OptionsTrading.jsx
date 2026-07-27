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
  { symbol: 'BTC/USDT', tv: 'BINANCE:BTCUSDT', coin: 'bitcoin', ticker: 'BTC' },
  { symbol: 'ETH/USDT', tv: 'BINANCE:ETHUSDT', coin: 'ethereum', ticker: 'ETH' },
  { symbol: 'XRP/USDT', tv: 'BINANCE:XRPUSDT', coin: 'ripple', ticker: 'XRP' },
  { symbol: 'SOL/USDT', tv: 'BINANCE:SOLUSDT', coin: 'solana', ticker: 'SOL' },
  { symbol: 'BNB/USDT', tv: 'BINANCE:BNBUSDT', coin: 'binancecoin', ticker: 'BNB' },
  { symbol: 'DOGE/USDT', tv: 'BINANCE:DOGEUSDT', coin: 'dogecoin', ticker: 'DOGE' },
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

  // Live market stats state from CoinGecko
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    loading: true
  });

  // Fetch Live CoinGecko Market Data
  const fetchLiveMarketData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${selected.coin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
      );
      const data = await response.json();
      
      if (data && data.market_data) {
        setMarketData({
          price: data.market_data.current_price.usd,
          change24h: data.market_data.price_change_percentage_24h,
          high24h: data.market_data.high_24h.usd,
          low24h: data.market_data.low_24h.usd,
          volume24h: data.market_data.total_volume.usd,
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching live CoinGecko price:", error);
    }
  }, [selected.coin]);

  useEffect(() => {
    fetchLiveMarketData();
    // Poll live price every 10 seconds
    const interval = setInterval(fetchLiveMarketData, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveMarketData]);

  const handleSelectPair = useCallback((pair) => {
    setSelected(pair);
    setShowPairs(false);
  }, []);

  const orderList = useMemo(
    () => (activeTab === 'open' ? <OpenOrders /> : <OrderHistory />),
    [activeTab]
  );

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-32 relative bg-[#060911]">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-50 px-3 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-[#060911]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-300 hover:text-white p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-2 group">
            <Menu className="w-5 h-5 text-slate-300" />
            <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center">
              ₿
            </div>
            <span className="text-base font-bold text-white tracking-tight">{selected.symbol}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <button onClick={() => setIsFavorite(!isFavorite)}>
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <button><Bell className="w-4 h-4" /></button>
          <button><Share2 className="w-4 h-4" /></button>
        </div>
      </header>

      {/* 2. PAIR SELECTION DROPDOWN */}
      {showPairs && (
        <div className="mx-3 my-1 border border-slate-800 rounded-xl shadow-2xl p-2 space-y-1 z-50 absolute left-0 right-0 top-12 bg-[#0c101c]">
          {pairs.map((p) => (
            <button
              key={p.symbol}
              onClick={() => handleSelectPair(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${
                selected.symbol === p.symbol ? 'bg-blue-600 text-white' : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <span className="text-sm">{p.symbol}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">{p.ticker}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. LIVE MARKET DATA HEADER */}
      <section className="px-4 py-2 flex items-center justify-between border-b border-slate-800/40 bg-[#060911]">
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {marketData.loading ? "..." : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          </div>
          <div className={`text-xs font-semibold mt-0.5 ${marketData.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}% <span className="text-slate-500 font-normal">24H</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-right text-[11px] font-medium">
          <span className="text-slate-500">High</span>
          <span className="font-semibold text-emerald-400">
            {marketData.loading ? "..." : `$${marketData.high24h.toLocaleString()}`}
          </span>
          <span className="text-slate-500">Low</span>
          <span className="font-semibold text-rose-500">
            {marketData.loading ? "..." : `$${marketData.low24h.toLocaleString()}`}
          </span>
          <span className="text-slate-500">24H Vol</span>
          <span className="font-semibold text-white">
            {marketData.loading ? "..." : `$${(marketData.volume24h / 1e6).toFixed(2)}M`}
          </span>
        </div>
      </section>

      {/* 4. TIMEFRAME SELECTOR */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/60 bg-[#060911]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTimeframe(t)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                activeTimeframe === t ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
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

      {/* 5. LIVE TRADINGVIEW CANDLESTICK CHART */}
      <div className="w-full border-b border-slate-800/80 bg-[#060911] relative" style={{ height: 320 }}>
        <TradingViewWidget 
          symbol={selected.tv} 
          height={320} 
          interval={activeTimeframe} 
          theme="dark" 
        />
      </div>

      {/* 6. TECHNICAL INDICATORS */}
      <div className="px-4 py-2 flex items-center justify-between text-xs font-semibold border-b border-slate-800/60 bg-[#060911]">
        <div className="flex items-center gap-4 text-slate-400">
          {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndicator(i)}
              className={`px-2 py-0.5 rounded ${activeIndicator === i ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              {i}
            </button>
          ))}
        </div>
        <button className="text-slate-400 hover:text-white"><Sliders className="w-3.5 h-3.5" /></button>
      </div>

      {/* 7. ORDERS & HISTORY TABS */}
      <div className="px-4 flex gap-6 border-b border-slate-800/80 text-xs font-bold pt-3 bg-[#060911]">
        <button
          onClick={() => setActiveTab('open')}
          className={`pb-2 border-b-2 ${activeTab === 'open' ? 'text-blue-500 border-blue-500' : 'text-slate-400 border-transparent'}`}
        >
          Open Orders (0)
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 border-b-2 ${activeTab === 'history' ? 'text-blue-500 border-blue-500' : 'text-slate-400 border-transparent'}`}
        >
          Order History
        </button>
      </div>

      {/* 8. TAB CONTENT / EMPTY STATE */}
      <div className="px-4 py-8">
        {activeTab === 'open' ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="relative mb-3 text-slate-500">
              <FileText className="w-12 h-12 stroke-1" />
              <Search className="w-5 h-5 absolute -bottom-1 -right-1 stroke-2 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-200">No open orders</p>
            <p className="text-xs text-slate-500 mt-1">Place a trade to see it here</p>
          </div>
        ) : (
          orderList
        )}
      </div>

      {/* 9. BOTTOM ACTION BUTTONS WITH LIVE EXECUTING PRICES */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#060911] border-t border-slate-800/80 z-40 max-w-lg mx-auto flex gap-3">
        <button
          onClick={() => setModal({ open: true, type: 'long' })}
          className="flex-1 py-2.5 rounded-xl bg-[#10b981] text-white flex flex-col items-center justify-center active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/40"
        >
          <span className="text-sm font-black flex items-center gap-1">
            <TrendingUp className="w-4 h-4 stroke-[3]" /> BUY LONG
          </span>
          <span className="text-[11px] font-semibold opacity-90">
            {marketData.loading ? "..." : marketData.price.toFixed(2)}
          </span>
        </button>

        <button
          onClick={() => setModal({ open: true, type: 'short' })}
          className="flex-1 py-2.5 rounded-xl bg-[#f43f5e] text-white flex flex-col items-center justify-center active:scale-[0.98] transition-all shadow-lg shadow-rose-950/40"
        >
          <span className="text-sm font-black flex items-center gap-1">
            <TrendingDown className="w-4 h-4 stroke-[3]" /> SELL SHORT
          </span>
          <span className="text-[11px] font-semibold opacity-90">
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
  );
}
