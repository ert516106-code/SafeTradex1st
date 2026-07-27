import { ChevronLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function TradingHeader({ coin, onBack }) {
  const isUp = (coin?.change ?? 0) >= 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid #f3f4f6',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ChevronLeft style={{ width: 18, height: 18, color: '#111' }} />
        </button>

        {coin?.logo ? (
          <img
            src={coin.logo}
            alt={coin.symbol}
            style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#6b7280',
              flexShrink: 0,
            }}
          >
            {coin?.symbol?.slice(0, 2)}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
              {coin?.name || coin?.symbol}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>{coin?.pair || `${coin?.symbol}/USDT`}</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {(coin?.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 2,
            fontSize: 12,
            fontWeight: 600,
            color: isUp ? '#10b981' : '#ef4444',
          }}
        >
          {isUp ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
          {isUp ? '+' : ''}
          {(coin?.change ?? 0).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
