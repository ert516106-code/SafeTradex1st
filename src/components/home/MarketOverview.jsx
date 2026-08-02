import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../contexts/MarketContext";
import { CURRENCIES } from "../../pages/Home"; // Import the exact currency list

export default function MarketOverview({ currency = 'USD', currencySymbol = '$' }) {
  const navigate = useNavigate();
  const { coins, loading } = useMarket();

  // Find the correct exchange rate based on the currency string
  const targetCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const rate = targetCurrency ? 1 : 1; // The rate will be handled by the CoinGecko API directly for the market list

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
        // Directly multiply the USD price by the FX rate
        const convertedPrice = coin.price * rate;
        
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
                {currencySymbol}
                {convertedPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                  color:
                    coin.change >= 0
                      ? "#22C55E"
                      : "#EF4444",
                  fontSize: 13,
                }}
              >
                {coin.change >= 0 ? (
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
