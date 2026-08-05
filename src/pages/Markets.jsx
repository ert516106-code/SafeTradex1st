import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarket } from '../contexts/MarketContext';
import BottomNavigation from '../components/layout/BottomNavigation';

export default function Markets() {
  const navigate = useNavigate();
  const { coins, loading } = useMarket();
  const [search, setSearch] = useState('');

  const filteredCoins = useMemo(() => {
    if (!coins) return [];
    if (!search) return coins;
    const query = search.toLowerCase();
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query) || 
      coin.symbol.toLowerCase().includes(query)
    );
  }, [coins, search]);

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
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={coin.logo}
                  alt={coin.symbol}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
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
                  ${coin.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: 'flex-end',
                  color: isPositive ? '#34C77B' : '#FF6B6B',
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {coin.change.toFixed(2)}%
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
