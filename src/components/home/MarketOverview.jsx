import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// CoinGecko IDs mapping
const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', logo: 'https://assets.coincap.io/assets/icons/btc@2x.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', logo: 'https://assets.coincap.io/assets/icons/eth@2x.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', logo: 'https://assets.coincap.io/assets/icons/bnb@2x.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', logo: 'https://assets.coincap.io/assets/icons/sol@2x.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', logo: 'https://assets.coincap.io/assets/icons/xrp@2x.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', logo: 'https://assets.coincap.io/assets/icons/doge@2x.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', logo: 'https://assets.coincap.io/assets/icons/ada@2x.png' },
  { id: 'tron', symbol: 'TRX', name: 'TRON', logo: 'https://assets.coincap.io/assets/icons/trx@2x.png' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', logo: 'https://assets.coincap.io/assets/icons/avax@2x.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', logo: 'https://assets.coincap.io/assets/icons/link@2x.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', logo: 'https://assets.coincap.io/assets/icons/dot@2x.png' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', logo: 'https://assets.coincap.io/assets/icons/matic@2x.png' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', logo: 'https://assets.coincap.io/assets/icons/ltc@2x.png' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', logo: 'https://assets.coincap.io/assets/icons/shib@2x.png' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', logo: 'https://assets.coincap.io/assets/icons/uni@2x.png' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', logo: 'https://assets.coincap.io/assets/icons/atom@2x.png' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', logo: 'https://assets.coincap.io/assets/icons/near@2x.png' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', logo: 'https://assets.coincap.io/assets/icons/apt@2x.png' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', logo: 'https://assets.coincap.io/assets/icons/arb@2x.png' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', logo: 'https://assets.coincap.io/assets/icons/op@2x.png' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', logo: 'https://assets.coincap.io/assets/icons/fil@2x.png' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', logo: 'https://assets.coincap.io/assets/icons/icp@2x.png' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', logo: 'https://assets.coincap.io/assets/icons/etc@2x.png' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', logo: 'https://assets.coincap.io/assets/icons/bch@2x.png' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', logo: 'https://assets.coincap.io/assets/icons/algo@2x.png' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain', logo: 'https://assets.coincap.io/assets/icons/vet@2x.png' },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', logo: 'https://assets.coincap.io/assets/icons/sand@2x.png' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', logo: 'https://assets.coincap.io/assets/icons/mana@2x.png' },
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
      {coins.slice(0, 5).map((coin) => {
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
              <img
                src={coin.logo}
                alt={coin.symbol}
                width={42}
                height={42}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
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
                    ">${coin.symbol.charAt(0)}</div>
                  `;
                }}
              />
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
                  {coin.symbol}
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
