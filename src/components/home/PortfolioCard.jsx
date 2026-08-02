import { Eye, EyeOff, TrendingUp, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getMarketPrices } from '../../services/marketService';

// Stablecoins pegged to $1 — used when the market feed doesn't return a price for them
const STABLECOINS = ['USDT', 'USDC'];

// Ordered strongest currency to weakest (by approximate value per unit)
const CURRENCIES = [
  { code: 'GBP', symbol: '£' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
];

export default function PortfolioCard({ assets = [], loading = false }) {
  const [showBalance, setShowBalance] = useState(true);
  const [livePrices, setLivePrices] = useState({});
  const [priceLoading, setPriceLoading] = useState(true);

  const [currency, setCurrency] = useState('USD');
  const [fxRates, setFxRates] = useState({});
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // --- FETCH LIVE CRYPTO PRICES ---
  useEffect(() => {
    async function fetchLivePrices() {
      try {
        const marketData = await getMarketPrices();
        const priceMap = {};
        marketData.forEach(coin => {
          priceMap[coin.symbol] = coin.price;
        });
        setLivePrices(priceMap);
        setPriceLoading(false);
      } catch (err) {
        console.error("Failed to fetch live prices for Portfolio:", err);
      }
    }
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 15000);
    return () => clearInterval(interval);
  }, []);

  // --- FETCH LIVE FX RATES (USD base) ---
  useEffect(() => {
    async function fetchFxRates() {
      try {
        const symbols = CURRENCIES.filter(c => c.code !== 'USD').map(c => c.code).join(',');
        const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${symbols}`);
        const data = await res.json();
        setFxRates({ USD: 1, ...data.rates });
      } catch (err) {
        console.error("Failed to fetch FX rates:", err);
        setFxRates({ USD: 1 });
      }
    }
    fetchFxRates();
    const interval = setInterval(fetchFxRates, 60 * 60 * 1000); // refresh hourly
    return () => clearInterval(interval);
  }, []);

  // Close the currency dropdown when clicking outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setCurrencyMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function getPrice(id) {
    if (livePrices[id] != null) return livePrices[id];
    if (STABLECOINS.includes(id)) return 1;
    return 0;
  }

  // --- CALCULATE TOTAL PORTFOLIO VALUE (in USD) ---
  let totalUsdValue = 0;
  if (assets && assets.length > 0 && !loading) {
    totalUsdValue = assets.reduce((sum, asset) => {
      const price = getPrice(asset.id);
      return sum + (asset.balance || 0) * price;
    }, 0);
  }

  const rate = fxRates[currency] || 1;
  const displayValue = totalUsdValue * rate;
  const currencyMeta = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const isLoading = loading || priceLoading;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a2a6e 0%, #2563eb 55%, #3b82f6 100%)",
        borderRadius: 28,
        padding: "26px 22px",
        marginBottom: 20,
        color: "white",
        boxShadow: "0 20px 40px -8px rgba(37, 99, 235, 0.45)",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
      }}
    >
      {/* Decorative background layer — clipped separately so it never clips real UI (like the dropdown) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -40,
            bottom: -50,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
      </div>

      {/* Real content — sits above the clipped decorative layer, never clipped itself */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, letterSpacing: 0.3 }}>
            Total Portfolio Value
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Currency switcher */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setCurrencyMenuOpen((v) => !v)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {currency}
                <ChevronDown style={{ width: 12, height: 12 }} />
              </button>

              {currencyMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 6px)",
                    background: "#101a3d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: 6,
                    minWidth: 110,
                    maxHeight: 220,
                    overflowY: "auto",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
                    zIndex: 20,
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        background: c.code === currency ? "rgba(59,130,246,0.25)" : "transparent",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 10px",
                        color: "white",
                        fontSize: 13,
                        fontWeight: c.code === currency ? 700 : 500,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span>{c.code}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Show/hide balance */}
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              {showBalance ? (
                <Eye style={{ width: 18, height: 18 }} />
              ) : (
                <EyeOff style={{ width: 18, height: 18 }} />
              )}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          {isLoading ? (
            <div style={{ height: 40, width: 200, background: "rgba(255,255,255,0.2)", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
          ) : (
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -0.5 }}>
              {showBalance
                ? `${currencyMeta.symbol}${displayValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "****"}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            background: "rgba(16, 185, 129, 0.18)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            padding: "6px 14px",
            borderRadius: 20,
            width: "fit-content",
          }}
        >
          <TrendingUp style={{ width: 14, height: 14, color: "#34d399" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#34d399" }}>
            +{currencyMeta.symbol}0.00 (+0.00%) Today
          </span>
        </div>
      </div>
    </div>
  );
}
