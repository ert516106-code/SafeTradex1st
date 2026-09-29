import { useState } from 'react';
import { usePrices } from '../../lib/prices'; // adjust path if your folder differs

// --- COIN LOGOS (hosted, real icons) ---
const ICON_ID_OVERRIDES = { MATIC: 'polygon' };
const COIN_ICON_URL = (symbol) =>
  `https://assets.coincap.io/assets/icons/${ICON_ID_OVERRIDES[symbol] || symbol.toLowerCase()}@2x.png`;

const COIN_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  XRP: '#23292F',
  BNB: '#F3BA2F',
  USDT: '#26A17B',
  USDC: '#2775CA',
  DOGE: '#C2A633',
  ADA: '#0033AD',
  TRX: '#EF0027',
  AVAX: '#E84142',
  LINK: '#2A5ADA',
  DOT: '#E6007A',
  MATIC: '#8247E5',
  LTC: '#345D9D',
};

function CoinIcon({ id }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: COIN_COLORS[id] || '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        {id.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={COIN_ICON_URL(id)}
      alt={id}
      width={44}
      height={44}
      style={{ borderRadius: '50%', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function AssetList({ assets = [], loading = false }) {
  // Shared live prices (CoinGecko, Binance backup), refreshed every 30s
  const { prices, loading: priceLoading } = usePrices();

  if (loading || priceLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 72, borderRadius: 16, background: '#1e293b', opacity: 0.3 }} />
        ))}
      </div>
    );
  }

  // 1. LIVE USD VALUE (0 or missing price = unavailable, never shown as a real $0.00)
  const enrichedAssets = assets.map((asset) => {
    const symbol = String(asset.symbol || asset.id || '').toUpperCase();
    const balance = Number(asset.balance) || 0;
    const price = prices[symbol] > 0 ? prices[symbol] : 0;
    return {
      ...asset,
      id: symbol,
      symbol,
      balance,
      price,
      hasPrice: price > 0,
      usdValue: balance * price,
    };
  });

  // 2. FILTER OUT ZERO BALANCES
  const visibleAssets = enrichedAssets.filter(a => a.balance > 0);

  if (visibleAssets.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>My Assets</div>
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          No assets found. Deposit or buy crypto to get started.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>My Assets</div>

      {visibleAssets.map((asset) => (
        <div
          key={asset.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#1e293b',
            borderRadius: 16,
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CoinIcon id={asset.id} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{asset.id}</div>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{asset.symbol}</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            {/* LIVE USD VALUE */}
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              {asset.hasPrice
                ? `$${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '—'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>
              {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset.symbol}
            </div>
            {!asset.hasPrice && (
              <div style={{ color: '#fbbf24', fontSize: 11, marginTop: 2 }}>Price unavailable</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
