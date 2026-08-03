import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, ChevronDown, ArrowLeft } from 'lucide-react';
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
      console.warn("CoinGecko fetch failed:", error);
    }
  }, [selected.coinId]);

  useEffect(() => {
    setMarketData((prev) => ({ ...prev, loading: true }));
    fetchCoinGeckoData();
    const interval = setInterval(fetchCoinGeckoData, 60000);
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
    <div style={{ minHeight: '100vh', background: '#050816', color: '#f1f5f9', fontFamily: 'sans-serif', paddingBottom: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '520px', padding: '16px', margin: '0 auto' }}>
        {/* CARD CONTAINER with visible border and background */}
        <div style={{
          background: 'rgba(11, 16, 38, 0.9)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Header with back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} />
              </button>
              <button onClick={() => setShowPairs(!showPairs)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f7931a', color: 'black', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>₿</div>
                <span style={{ fontSize: '20px', fontWeight: '800' }}>{selected.symbol}</span>
                <ChevronDown size={16} style={{ color: '#94a3b8' }} />
              </button>
            </div>
            <Menu size={20} style={{ color: '#94a3b8', cursor: 'pointer' }} />
          </div>

          {/* Pair dropdown */}
          {showPairs && (
            <div style={{ position: 'absolute', top: '80px', left: '20px', right: '20px', zIndex: 50, background: 'rgba(11, 16, 38, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              {pairs.map((p) => (
                <button key={p.symbol} onClick={() => handleSelectPair(p)} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selected.symbol === p.symbol ? 'rgba(37, 99, 235, 0.2)' : 'transparent', color: selected.symbol === p.symbol ? '#93c5fd' : '#cbd5e1', border: 'none', cursor: 'pointer' }}>
                  <span>{p.symbol}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{p.ticker}</span>
                </button>
              ))}
            </div>
          )}

          {/* Price and stats */}
          <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px' }}>
                  {marketData.loading ? "---" : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px', color: marketData.change24h >= 0 ? '#34d399' : '#f87171' }}>
                  {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}% <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>24H</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '16px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '600' }}>
                <div><div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>High</div><span style={{ color: '#34d399' }}>${marketData.high24h.toLocaleString()}</span></div>
                <div><div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Low</div><span style={{ color: '#f87171' }}>${marketData.low24h.toLocaleString()}</span></div>
                <div><div style={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vol</div><span style={{ color: 'white' }}>${(marketData.volume24h / 1e6).toFixed(2)}M</span></div>
              </div>
            </div>
          </div>

          {/* Timeframes */}
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
            {timeframes.map((t) => (
              <button key={t} onClick={() => setActiveTimeframe(t)} style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                background: activeTimeframe === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTimeframe === t ? 'white' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
                whiteSpace: 'nowrap'
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div style={{ width: '100%', height: '340px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <TradingViewWidget symbol={selected.tv} height={340} interval={activeTimeframe} theme="dark" />
          </div>

          {/* Indicators */}
          <div style={{ display: 'flex', gap: '4px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button key={i} onClick={() => setActiveIndicator(i)} style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                background: activeIndicator === i ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                color: activeIndicator === i ? '#93c5fd' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s'
              }}>
                {i}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', fontWeight: '700', paddingBottom: '12px', marginTop: '4px' }}>
            <button onClick={() => setActiveTab('open')} style={{
              paddingBottom: '10px',
              borderBottom: '2px solid',
              borderColor: activeTab === 'open' ? 'white' : 'transparent',
              color: activeTab === 'open' ? 'white' : '#64748b',
              background: 'none',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
              Open Orders
            </button>
            <button onClick={() => setActiveTab('history')} style={{
              paddingBottom: '10px',
              borderBottom: '2px solid',
              borderColor: activeTab === 'history' ? 'white' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#64748b',
              background: 'none',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
              Order History
            </button>
          </div>

          {/* Order list */}
          <div style={{ marginTop: '16px' }}>
            {orderList}
          </div>

        </div>
      </div>

      {/* Bottom buttons */}
      <div style={{ position: 'fixed', bottom: '24px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 16px', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '520px', width: '100%', display: 'flex', gap: '12px', pointerEvents: 'auto' }}>
          <button onClick={() => setModal({ open: true, type: 'long' })} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#34d399', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 30px rgba(52, 211, 153, 0.4)', border: 'none', cursor: 'pointer', transition: '0.2s' }}>
            <span style={{ fontSize: '14px', fontWeight: '900' }}>Buy Long</span>
            <span style={{ fontSize: '12px', fontWeight: '700', opacity: 0.9, marginTop: '2px' }}>${marketData.price.toFixed(2)}</span>
          </button>
          <button onClick={() => setModal({ open: true, type: 'short' })} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: '#f87171', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 30px rgba(248, 113, 113, 0.4)', border: 'none', cursor: 'pointer', transition: '0.2s' }}>
            <span style={{ fontSize: '14px', fontWeight: '900' }}>Sell Short</span>
            <span style={{ fontSize: '12px', fontWeight: '700', opacity: 0.9, marginTop: '2px' }}>${marketData.price.toFixed(2)}</span>
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
