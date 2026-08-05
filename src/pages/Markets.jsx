import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'tron', symbol: 'TRX', name: 'TRON' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
  { id: 'optimism', symbol: 'OP', name: 'Optimism' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland' },
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

export default function Markets() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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

  const formatPrice = (price) => {
    if (!price || price === 0) return '$0.00';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(0)}`;
  };

  const filteredCoins = coins.filter(coin => {
    const searchLower = search.toLowerCase();
    return coin.name.toLowerCase().includes(searchLower) ||
           coin.symbol.toLowerCase().includes(searchLower);
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #18254b 0%, #050816 70%)',
      padding: '20px',
      paddingBottom: '100px',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '8px 12px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Markets</h1>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <Search size={20} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search cryptocurrency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              outline: 'none',
              width: '100%',
            }}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 0',
            color: 'rgba(255,255,255,0.4)'
          }}>
            Loading market data...
          </div>
        )}

        {/* Market List */}
        {!loading && filteredCoins.map((coin) => {
          const isPositive = coin.change >= 0;

          return (
            <div
              key={coin.symbol}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/trading/${coin.symbol.toLowerCase()}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: `linear-gradient(135deg, ${getColor(coin.symbol)}33, ${getColor(coin.symbol)}11)`,
                  border: `1px solid ${getColor(coin.symbol)}44`,
                  color: '#fff'
                }}>
                  {coin.symbol.charAt(0)}
                </div>
                <div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}>
                    {coin.name}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '13px'
                  }}>
                    {coin.symbol}/USDT
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 500
                }}>
                  {formatPrice(coin.price)}
                </div>
                <div style={{
                  color: isPositive ? '#34C77B' : '#FF6B6B',
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {isPositive ? '▲' : '▼'} {coin.change.toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavigation />
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
    DOGE: '#C2A633',
    ADA: '#0033AD',
    TRX: '#EF0027',
    AVAX: '#E84142',
    LINK: '#2A5ADA',
    DOT: '#E6007A',
    MATIC: '#8247E5',
    LTC: '#345D9D',
    SHIB: '#FFA409',
    UNI: '#FF007A',
    ATOM: '#5064FB',
    NEAR: '#00EC97',
    APT: '#2DD8A7',
    ARB: '#28A0F0',
    OP: '#FF0420',
    FIL: '#0090FF',
    ICP: '#29ABE2',
    ETC: '#328332',
    BCH: '#8DC351',
    ALGO: '#00C2A8',
    VET: '#15BDFF',
    SAND: '#00ADEF',
    MANA: '#FF2D55'
  };
  return colors[symbol] || '#7C3AED';
}
