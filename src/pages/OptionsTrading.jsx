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
    <div style={{ minHeight: '100vh', background: '#050816', color: '#f1f5f9', fontFamily: 'sans-serif', paddingBottom: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '520px', padding: '18px', margin: '0 auto' }}>
        {/* CARD CONTAINER with visible border and background */}
        <div style={{
          background: 'rgba(10, 14, 32, 0.95)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Header with back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} />
              </button>
              <button onClick={() => setShowPairs(!showPairs)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f7931a', color: 'black', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>₿</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: 1.2 }}>{selected.symbol}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Perpetual</div>
                </div>
                <ChevronDown size={15} style={{ color: '#64748b' }} />
              </button>
            </div>
            <Menu size={19} style={{ color: '#64748b', cursor: 'pointer' }} />
          </div>

          {/* Pair dropdown */}
          {showPairs && (
            <div style={{ position: 'absolute', top: '80px', left: '20px', right: '20px', zIndex: 50, background: 'rgba(11, 16, 38, 0.97)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
              {pairs.map((p) => (
                <button key={p.symbol} onClick={() => handleSelectPair(p)} style={{ width: '100%', textAlign: 'left', padding: '13px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selected.symbol === p.symbol ? 'rgba(37, 99, 235, 0.18)' : 'transparent', color: selected.symbol === p.symbol ? '#93c5fd' : '#cbd5e1', border: 'none', cursor: 'pointer' }}>
                  <span>{p.symbol}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{p.ticker}</span>
                </button>
              ))}
            </div>
          )}

          {/* Price and stats */}
          <div style={{ background: '#0d1420', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '18px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '30px', fontWeight: '600', letterSpacing: '-0.5px' }}>
                {marketData.loading ? "---" : `$${marketData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: marketData.change24h >= 0 ? '#4ade80' : '#f87171',
                background: marketData.change24h >= 0 ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.12)',
                padding: '3px 9px',
                borderRadius: '7px'
              }}>
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', gap: '22px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '3px' }}>24h high</div>
                <div style={{ color: '#4ade80', fontSize: '13px', fontWeight: '600' }}>${marketData.high24h.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '3px' }}>24h low</div>
                <div style={{ color: '#f87171', fontSize: '13px', fontWeight: '600' }}>${marketData.low24h.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '3px' }}>24h vol</div>
                <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>${(marketData.volume24h / 1e6).toFixed(2)}M</div>
              </div>
            </div>
          </div>

          {/* Timeframes */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '2px 2px 16px' }}>
            {timeframes.map((t) => (
              <button key={t} onClick={() => setActiveTimeframe(t)} style={{
                padding: '7px 13px',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: '600',
                background: activeTimeframe === t ? '#2563eb' : 'transparent',
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
          <div style={{ background: '#0d1420', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '10px', marginBottom: '18px' }}>
            <div style={{ width: '100%', height: '340px', borderRadius: '12px', overflow: 'hidden' }}>
              <TradingViewWidget symbol={selected.tv} height={340} interval={activeTimeframe} theme="dark" />
            </div>
          </div>

          {/* Indicators */}
          <div style={{ display: 'flex', gap: '6px', padding: '2px 2px 16px', overflowX: 'auto' }}>
            {['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'].map((i) => (
              <button key={i} onClick={() => setActiveIndicator(i)} style={{
                padding: '7px 13px',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: '600',
                background: activeIndicator === i ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                color: activeIndicator === i ? '#93c5fd' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                transition: '0.2s',
                whiteSpace: 'nowrap'
              }}>
                {i}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '26px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
            <button onClick={() => setActiveTab('open')} style={{
              paddingBottom: '12px',
              borderBottom: '2px solid',
              borderColor: activeTab === 'open' ? '#2563eb' : 'transparent',
              color: activeTab === 'open' ? 'white' : '#64748b',
              background: 'none',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
              Open Orders
            </button>
            <button onClick={() => setActiveTab('history')} style={{
              paddingBottom: '12px',
              borderBottom: '2px solid',
              borderColor: activeTab === 'history' ? '#2563eb' : 'transparent',
              color: activeTab === 'history' ? 'white' : '#64748b',
              background: 'none',
              cursor: 'pointer',
              transition: '0.2s'
            }}>
              Order History
            </button>
          </div>

          {/* Order list */}
          <div style={{ marginTop: '18px' }}>
            {orderList}
          </div>

        </div>
      </div>

      {/* Bottom buttons */}
      <div style={{ position: 'fixed', bottom: '32px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 18px', pointerEvents: 'none' }}>
        <div style={{ maxWidth: '520px', width: '100%', display: 'flex', gap: '14px', pointerEvents: 'auto' }}>
          <button onClick={() => setModal({ open: true, type: 'long' })} style={{ flex: 1, padding: '18px', borderRadius: '18px', background: '#16a34a', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 32px rgba(22, 163, 74, 0.4)', border: 'none', cursor: 'pointer', transition: '0.2s' }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Buy Long</span>
            <span style={{ fontSize: '12px', fontWeight: '500', opacity: 0.85, marginTop: '3px' }}>${marketData.price.toFixed(2)}</span>
          </button>
          <button onClick={() => setModal({ open: true, type: 'short' })} style={{ flex: 1, padding: '18px', borderRadius: '18px', background: '#dc2626', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 32px rgba(220, 38, 38, 0.4)', border: 'none', cursor: 'pointer', transition: '0.2s' }}>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>Sell Short</span>
            <span style={{ fontSize: '12px', fontWeight: '500', opacity: 0.85, marginTop: '3px' }}>${marketData.price.toFixed(2)}</span>
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
