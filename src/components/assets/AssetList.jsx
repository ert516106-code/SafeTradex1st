import { useState, useEffect } from 'react';
import { getMarketPrices } from '../../services/marketService';

// --- SVG LOGOS (Static) ---
const COIN_LOGOS = {
  BTC: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path d="M22.3 13.3C22.5 11.5 21.1 10.3 19.1 9.6L19.9 6.4L18 6L17.2 9L15.6 8.6L16.4 5.7L14.5 5.3L13.7 8.1C13.4 8.1 13.1 8.1 12.8 8.1L11.4 8.3L10.8 8.5L10.5 8.6L11.3 5.7L8.2 5L7.4 8.2C7.4 8.2 8.2 8.2 8 8.3L3 9.2L3.6 11.7L4.8 12C5.5 12.2 5.7 12.7 5.6 13.3L4.4 18.5L3.7 21.2C3.7 21.5 3.7 22 4.1 22.3L4.3 22.4L2.8 22.7L1.8 25.9L11.7 24.5L10.9 27.4L12.8 27.8L13.6 25L15.3 25.4L14.5 28.2L16.4 28.6L17.2 25.7C19.4 25.4 21.6 25.2 23 23.8C24.5 22.2 25.2 19.6 22.8 17.8C24 17 24.5 15.4 22.3 13.3ZM19.2 19.5C18.5 21.2 15.2 20.5 13.3 20.1L14.3 16.6C16.2 17.1 19.9 17.8 19.2 19.5ZM20 14.4C19.4 16 16.7 15.4 15.2 15.1L16.1 12.1C17.6 12.4 20.6 12.8 20 14.4Z" fill="white"/></svg>,
  ETH: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path d="M16 5L16 12.3L8.1 16.4L16 5Z" fill="#C0CBF6"/><path d="M16 5L23.9 16.4L16 12.3V5Z" fill="#FFFFFF"/><path d="M16 20.8L8.1 16.7L16 27.7V20.8Z" fill="#C0CBF6"/><path d="M16 20.8L23.9 16.7L16 27.7V20.8Z" fill="#FFFFFF"/><path d="M8.1 16.4L16 12.3L23.9 16.4L16 20.8L8.1 16.4Z" fill="#8196EE"/></svg>,
  SOL: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="url(#paint0_linear)"/><path d="M9.3 19.8C9.5 19.6 9.8 19.5 10.1 19.5H26.3L22.7 23.1C22.5 23.3 22.2 23.4 21.9 23.4H5.7L9.3 19.8Z" fill="#fff"/><path d="M9.3 8.9C9.5 8.7 9.8 8.6 10.1 8.6H26.3L22.7 12.2C22.5 12.4 22.2 12.5 21.9 12.5H5.7L9.3 8.9Z" fill="#fff"/><path d="M22.7 14.3C22.5 14.1 22.2 14 21.9 14H5.7L9.3 17.6C9.5 17.8 9.8 17.9 10.1 17.9H26.3L22.7 14.3Z" fill="#fff"/><defs><linearGradient id="paint0_linear" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#00FFA3"/><stop offset="1" stopColor="#DC1FFF"/></linearGradient></defs></svg>,
  XRP: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#23292F"/><path d="M21.4 12.2L25 8.6H23.8L20.3 12.1L18.1 9.9H18C15.7 9.9 13.8 11.3 13 13.1L11.7 11.8L8.2 8.6H7L10.6 12.2L12.2 13.8L10.6 15.3L7 18.9H8.2L11.7 15.4L13.8 17.5H13.9C16.2 17.5 18.1 16.1 18.9 14.3L20.3 15.7L23.8 18.9H25L21.4 15.3L19.8 13.8L21.4 12.2Z" fill="#fff"/></svg>,
  BNB: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path d="M9.9 13.9L16 7.8L22.1 13.9L24.3 11.7L16 3.3L7.7 11.7L9.9 13.9ZM5 16L7.2 13.8L9.4 16L7.2 18.2L5 16ZM16 21.4L10.8 16.2L8.6 18.4L16 25.8L23.4 18.4L21.2 16.2L16 21.4ZM22.6 16L24.8 13.8L27 16L24.8 18.2L22.6 16Z" fill="white"/></svg>,
  USDT: <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.9 17.2V14.4H21.7V12.2H10.4V14.4H14.2V17.2H10.1C8.4 17.5 7.2 18.1 7.2 18.8H7.2V20.3H7.3C7.4 21.1 8.8 21.7 10.5 22V22.1H21.6V22C23.3 21.7 24.7 21.1 24.8 20.3V18.8C24.8 18.1 23.6 17.5 21.9 17.2H17.9Z" fill="#fff"/></svg>,
};

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
              {COIN_LOGOS[asset.id] || <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f7931a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 14 }}>{asset.id.charAt(0)}</div>}
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
