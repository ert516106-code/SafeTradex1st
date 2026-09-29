import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { usePrices } from '../../lib/prices'; // adjust path if your folder differs

export default function PortfolioCard({
  assets = [],
  loading = false,
}) {
  const [showBalance, setShowBalance] = useState(true);
  const { prices, loading: priceLoading, stale } = usePrices();

  // Price for one asset. 0 or missing = "no live price".
  function getPrice(asset) {
    const symbol = String(asset.symbol || asset.id || '').toUpperCase();
    return prices[symbol] > 0 ? prices[symbol] : 0;
  }

  // --- TOTAL PORTFOLIO VALUE (USD), ALL COINS ---
  let totalUsdValue = 0;
  let missingPrice = false;

  if (assets && assets.length > 0 && !loading) {
    totalUsdValue = assets.reduce((sum, asset) => {
      const balance = Number(asset.balance) || 0;
      const price = getPrice(asset);
      if (balance > 0 && price === 0) missingPrice = true;
      return sum + balance * price;
    }, 0);
  }

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
      {/* Decorative background layers */}
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

      {/* Real content */}
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

        <div style={{ marginTop: 14 }}>
          {isLoading ? (
            <div style={{ height: 40, width: 200, background: "rgba(255,255,255,0.2)", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
          ) : (
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -0.5 }}>
              {showBalance
                ? `$${totalUsdValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "****"}
            </div>
          )}
        </div>

        {!isLoading && (missingPrice || stale) && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#fde68a" }}>
            Some prices are unavailable right now. Total may be incomplete.
          </div>
        )}

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
            +$0.00 (+0.00%) Today
          </span>
        </div>
      </div>
    </div>
  );
}
