import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Star, StarOff } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';

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

// Fetch price from TradingView
async function fetchTradingViewPrice(symbol) {
  try {
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

export default function Markets() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(['BTC', 'ETH', 'BNB', 'SOL', 'XRP']);

  useEffect(() => {
    async function fetchAllPrices() {
      setLoading(true);
      try {
        const pricePromises = COINS.map(coin => fetchTradingViewPrice(coin.tvSymbol));
        const results = await Promise.all(pricePromises);
        
        const updatedCoins = COINS.map((coin, index) => {
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

  const formatPrice = (price) => {
    if (!price || price === 0) return '$0.00';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(0)}`;
  };

  const toggleFavorite = (symbol) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const filteredCoins = coins.filter(coin => {
    const searchLower = search.toLowerCase();
    return coin.name.toLowerCase().includes(searchLower) ||
           coin.symbol.toLowerCase().includes(searchLower);
  });

  // Sort: Favorites first, then by name
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    const aFav = favorites.includes(a.symbol);
    const bFav = favorites.includes(b.symbol);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.name.localeCompare(b.name);
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
        {!loading && sortedCoins.map((coin) => {
          const isPositive = coin.change >= 0;
          const isFavorite = favorites.includes(coin.symbol);

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
                  border: `1px solid ${getColor(coin.symbol)}44`
                }}>
                  {coin.symbol.charAt(0)}
                </div>
                <div>
                  <div style={{
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {coin.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(coin.symbol);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {isFavorite ? (
                        <Star size={16} fill="#F59E0B" color="#F59E0B" />
                      ) : (
                        <StarOff size={16} color="rgba(255,255,255,0.3)" />
                      )}
                    </button>
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
