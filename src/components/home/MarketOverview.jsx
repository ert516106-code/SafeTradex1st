import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// TradingView symbols mapping
const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', tvSymbol: 'BINANCE:BTCUSDT', logo: 'https://assets.coincap.io/assets/icons/btc@2x.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', tvSymbol: 'BINANCE:ETHUSDT', logo: 'https://assets.coincap.io/assets/icons/eth@2x.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', tvSymbol: 'BINANCE:BNBUSDT', logo: 'https://assets.coincap.io/assets/icons/bnb@2x.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', tvSymbol: 'BINANCE:SOLUSDT', logo: 'https://assets.coincap.io/assets/icons/sol@2x.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', tvSymbol: 'BINANCE:XRPUSDT', logo: 'https://assets.coincap.io/assets/icons/xrp@2x.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', tvSymbol: 'BINANCE:DOGEUSDT', logo: 'https://assets.coincap.io/assets/icons/doge@2x.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', tvSymbol: 'BINANCE:ADAUSDT', logo: 'https://assets.coincap.io/assets/icons/ada@2x.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', tvSymbol: 'BINANCE:TRXUSDT', logo: 'https://assets.coincap.io/assets/icons/trx@2x.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', tvSymbol: 'BINANCE:AVAXUSDT', logo: 'https://assets.coincap.io/assets/icons/avax@2x.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', tvSymbol: 'BINANCE:LINKUSDT', logo: 'https://assets.coincap.io/assets/icons/link@2x.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', tvSymbol: 'BINANCE:DOTUSDT', logo: 'https://assets.coincap.io/assets/icons/dot@2x.png' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', tvSymbol: 'BINANCE:MATICUSDT', logo: 'https://assets.coincap.io/assets/icons/matic@2x.png' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', tvSymbol: 'BINANCE:LTCUSDT', logo: 'https://assets.coincap.io/assets/icons/ltc@2x.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', tvSymbol: 'BINANCE:SHIBUSDT', logo: 'https://assets.coincap.io/assets/icons/shib@2x.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', tvSymbol: 'BINANCE:UNIUSDT', logo: 'https://assets.coincap.io/assets/icons/uni@2x.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', tvSymbol: 'BINANCE:ATOMUSDT', logo: 'https://assets.coincap.io/assets/icons/atom@2x.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', tvSymbol: 'BINANCE:NEARUSDT', logo: 'https://assets.coincap.io/assets/icons/near@2x.png' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', tvSymbol: 'BINANCE:APTUSDT', logo: 'https://assets.coincap.io/assets/icons/apt@2x.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', tvSymbol: 'BINANCE:ARBUSDT', logo: 'https://assets.coincap.io/assets/icons/arb@2x.png' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', tvSymbol: 'BINANCE:OPUSDT', logo: 'https://assets.coincap.io/assets/icons/op@2x.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', tvSymbol: 'BINANCE:FILUSDT', logo: 'https://assets.coincap.io/assets/icons/fil@2x.png' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', tvSymbol: 'BINANCE:ICPUSDT', logo: 'https://assets.coincap.io/assets/icons/icp@2x.png' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', tvSymbol: 'BINANCE:ETCUSDT', logo: 'https://assets.coincap.io/assets/icons/etc@2x.png' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', tvSymbol: 'BINANCE:BCHUSDT', logo: 'https://assets.coincap.io/assets/icons/bch@2x.png' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', tvSymbol: 'BINANCE:ALGOUSDT', logo: 'https://assets.coincap.io/assets/icons/algo@2x.png' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain', tvSymbol: 'BINANCE:VETUSDT', logo: 'https://assets.coincap.io/assets/icons/vet@2x.png' },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', tvSymbol: 'BINANCE:SANDUSDT', logo: 'https://assets.coincap.io/assets/icons/sand@2x.png' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', tvSymbol: 'BINANCE:MANAUSDT', logo: 'https://assets.coincap.io/assets/icons/mana@2x.png' },
];

// TradingView Mini Chart Component
function MiniChart({ symbol }) {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Load TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: symbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_top_toolbar: true,
          hide_legend: true,
          hide_volume: true,
          height: 60,
          width: '100%',
          backgroundColor: 'transparent',
          gridColor: 'rgba(255,255,255,0.05)',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [symbol]);

  return <div id={`tv-chart-${symbol.replace(':', '')}`} ref={containerRef} style={{ width: '100%', height: '60px' }} />;
}

// Fetch price data from TradingView via their REST API
async function fetchTradingViewPrice(symbol) {
  try {
    // Use TradingView's REST API endpoint
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.replace(':', '').toLowerCase()}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch price');
    
    const data = await response.json();
    const result = data.chart?.result?.[0];
    
    if (!result) return null;
    
    const meta = result.meta;
    const price = meta.regularMarketPrice || meta.previousClose || 0;
    const change = meta.regularMarketChangePercent || 0;
    
    return { price, change };
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    return null;
  }
}

export default function MarketOverview() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format price for display
  const formatPrice = (price) => {
    if (!price || price === 0) return '$0.00';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(0)}`;
  };

  useEffect(() => {
    async function fetchAllPrices() {
      setLoading(true);
      try {
        // Only fetch prices for the first 5 coins to avoid rate limits
        const pricePromises = COINS.slice(0, 5).map(coin => fetchTradingViewPrice(coin.tvSymbol));
        const results = await Promise.all(pricePromises);
        
        const updatedCoins = COINS.slice(0, 5).map((coin, index) => {
          const data = results[index] || null;
          return {
            ...coin,
            price: data?.price || 0,
            change: data?.change || 0,
          };
        });
        
        setCoins(updatedCoins);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllPrices();

    // Refresh every 60 seconds
    const interval = setInterval(fetchAllPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: "#94A3B8",
          textAlign: "center",
          padding: "40px 0",
        }}
      >
        Loading markets...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 100 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Markets
        </h2>
        <button
          onClick={() => navigate("/markets")}
          style={{
            border: "none",
            background: "transparent",
            color: "#7C5CFF",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          View All
          <ChevronRight size={18} />
        </button>
      </div>
      {coins.map((coin) => {
        const isPositive = coin.change >= 0;
        return (
          <div
            key={coin.symbol}
            onClick={() => navigate(`/trading/${coin.symbol.toLowerCase()}`)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              marginBottom: 14,
              borderRadius: 18,
              background: "#101933",
              border: "1px solid #24304d",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flex: 1,
              }}
            >
              <img
                src={coin.logo}
                alt={coin.symbol}
                width={42}
                height={42}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  const fallback = document.createElement('div');
                  fallback.style.cssText = `
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #7C3AED33, #2563EB33);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #A78BFA;
                    font-size: 16px;
                  `;
                  fallback.textContent = coin.symbol.charAt(0);
                  parent.insertBefore(fallback, e.target);
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {coin.name}
                </div>
                <div
                  style={{
                    color: "#94A3B8",
                    fontSize: 13,
                  }}
                >
                  {coin.symbol}/USDT
                </div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16,
              flex: 1,
              justifyContent: 'flex-end'
            }}>
              <div style={{ 
                width: 100,
                height: 60,
                overflow: 'hidden',
                borderRadius: 8,
              }}>
                <MiniChart symbol={coin.tvSymbol} />
              </div>
              <div style={{ textAlign: "right", minWidth: 80 }}>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {formatPrice(coin.price)}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                    color: isPositive ? "#22C55E" : "#EF4444",
                    fontSize: 13,
                  }}
                >
                  {isPositive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {coin.change.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
