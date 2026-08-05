import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
];

// Fetch price from CoinGecko
async function fetchPrice(coinId) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) throw new Error('Failed to fetch price');
    
    const data = await response.json();
    return data[coinId];
  } catch (error) {
    console.error(`Error fetching ${coinId} price:`, error);
    return null;
  }
}

export default function MarketOverview() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPrices() {
      setLoading(true);
      try {
        const pricePromises = COINS.map(coin => fetchPrice(coin.id));
        const results = await Promise.all(pricePromises);
        
        const updatedCoins = COINS.map((coin, index) => {
          const data = results[index] || null;
          return {
            ...coin,
            price: data?.usd || 0,
            change: data?.usd_24h_change || 0,
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
            onClick={() => navigate(`/coin/${coin.id}`)}
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
              }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getColor(coin.symbol)}33, ${getColor(coin.symbol)}11)`,
                border: `1px solid ${getColor(coin.symbol)}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {coin.symbol.charAt(0)}
              </div>
              <div>
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
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {coin.price === 0 ? '$0.00' : `$${coin.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
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
        );
      })}
    </div>
  );
}

function getColor(symbol) {
  const colors = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    BNB: '#F3BA2F',
    SOL: '#9945FF',
    XRP: '#00A4E4',
  };
  return colors[symbol] || '#7C3AED';
}
