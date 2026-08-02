import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
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
      className="min-h-screen bg-[#050816] text-slate-100 font-sans pb-32 relative flex flex-col items-center"
    >
      <div className="w-full max-w-[520px] px-4 pt-4 flex flex-col relative">
        
        {/* 1. Header with Pair Selector */}
        <header className="py-4 flex items-center justify-between border-b border-white/5">
          <button onClick={() => setShowPairs(!showPairs)} className="flex items-center gap-3 group">
            <Menu className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            <div className="w-8 h-8 rounded-full bg-[#f7931a] text-black font-black text-sm flex items-center justify-center">
              ₿
            </div>
            <span className="text-xl font-extrabold text-white">{selected.symbol}</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </header>

        {/* 2. Dropdown */}
        {showPairs && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-[#0b1026]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            {pairs.map((p) => (
              <button
                key={p.symbol}
                onClick={() => handleSelectPair(p)}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${
                  selected.symbol === p.symbol ? 'bg-blue-600/20 text-blue-300' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>{p.symbol}</span>
                <span className="text-xs text-slate-500">{p.ticker}</span>
              </button>
            ))}
          </div>
        )}

        {/* 3. Live Price and Stats */}
        <section className="py-5 flex items-start justify-between border-b border-white/5">
          <div>
            <div className="text-4xl font-black text-white tracking-tight">
              {marketData.loading ? "---" : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </div>
            <div className={`text-sm font-bold mt-1.5 ${marketData.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
              {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}% <span className="text-slate-500 font-medium text-xs">24H</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-right text-xs font-semibold">
            <div><span className="text-slate-500 block">High</span><span className="text-emerald-400">${marketData.high24h.toLocaleString()}</span></div>
            <div><span className="text-slate-500 block">Low</span><span className="text-rose-500">${marketData.low24h.toLocaleString()}</span></div>
            <div><span className="text-slate-500 block">Vol</span><span className="text-white">${(marketData.volume24h / 1e6).toFixed(2)}M</span></div>
          </div>
        </section>

        {/* 4. Timeframe */}
        <div className="py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {timeframes.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTimeframe === t ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Chart - Added margin bottom to create space */}
        <div className="w-full mt-3 mb-4 rounded-2xl overflow-hidden border border-white/5 shadow-xl" style={{ height: 340 }}>
          <TradingViewWidget symbol={selected.tv} height={340} interval={activeTimeframe} theme="dark" />
        </div>

        {/* 6. Indicators - Added bottom margin and padding */}
        <div className="py-2.5 mb-1 flex items-center justify-between text-xs font-bold border-b border-white/5">
          <div className="flex items-center gap-1 text-slate-500">
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndicator(i)}
                className={`px-2 py-1.5 rounded-md transition-colors ${
                  activeIndicator === i ? 'bg-blue-600/20 text-blue-300' : 'hover:text-white'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Tabs - CRITICAL FIX: Added mt-5 here to stop overlapping */}
        <div className="flex gap-8 border-b border-white/5 text-sm font-bold mt-5 pb-3">
          <button
            onClick={() => setActiveTab('open')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'open' ? 'text-white border-white' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Open Orders
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === 'history' ? 'text-white border-white' : 'text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            Order History
          </button>
        </div>

        {/* 8. Order List Content */}
        <div className="mt-4 flex-1">
          {orderList}
        </div>
      </div>

      {/* 9. Floating Buy/Sell Buttons */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-40 pointer-events-none">
        <div className="w-full max-w-[520px] flex gap-3 pointer-events-auto">
          <button
            onClick={() => setModal({ open: true, type: 'long' })}
            className="flex-1 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white flex flex-col items-center shadow-xl shadow-emerald-900/50 transition-all"
          >
            <span className="text-sm font-black flex items-center gap-1.5">Buy Long</span>
            <span className="text-xs font-bold opacity-90 mt-0.5">${marketData.price.toFixed(2)}</span>
          </button>
          <button
            onClick={() => setModal({ open: true, type: 'short' })}
            className="flex-1 py-4 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-[0.98] text-white flex flex-col items-center shadow-xl shadow-rose-900/50 transition-all"
          >
            <span className="text-sm font-black flex items-center gap-1.5">Sell Short</span>
            <span className="text-xs font-bold opacity-90 mt-0.5">${marketData.price.toFixed(2)}</span>
          </button>
        </div>
      </div>

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
