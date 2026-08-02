import { useState, useEffect } from 'react';
import { getMarketPrices } from '../../services/marketService';

// --- COIN LOGOS (hosted, real icons) ---
const COIN_ICON_URL = (symbol) =>
  `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;

const COIN_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  XRP: '#23292F',
  BNB: '#F3BA2F',
  USDT: '#26A17B',
  USDC: '#2775CA',
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
  const [livePrices, setLivePrices] = useState({});
  const [priceLoading, setPriceLoading] = useState(true);

  // --- FETCH LIVE MARKET PRICES EVERY 15 SECONDS ---
  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const marketData = await getMarketPrices();
        // Convert array into object: { BTC: 63437, ETH: 1882... }
        const priceMap = {};
        marketData.forEach(coin => {
          priceMap[coin.symbol] = coin.price;
        });
        setLivePrices(priceMap);
        setPriceLoading(false);
      } catch (err) {
        console.error("Failed to fetch live prices:", err);
      }
    }

    fetchLivePrices(); // Run immediately
    const interval = setInterval(fetchLivePrices, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading || priceLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 72, borderRadius: 16, background: '#1e293b', opacity: 0.3 }} />
        ))}
      </div>
    );
  }

  // 1. CALCULATE LIVE USD VALUE
  const enrichedAssets = assets.map((asset) => ({
    ...asset,
    price: livePrices[asset.id] || 0,
    usdValue: (asset.balance || 0) * (livePrices[asset.id] || 0)
  }));

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
            {/* REAL LOGO */}
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
              ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>
              {asset.balance} {asset.symbol}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
