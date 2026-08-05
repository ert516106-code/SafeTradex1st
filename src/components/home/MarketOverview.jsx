import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../../contexts/MarketContext";

export default function MarketOverview({ currency = 'USD', currencySymbol = '$', rate = 1 }) {
  const navigate = useNavigate();
  const { coins, loading } = useMarket();

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
      {(coins || []).slice(0, 5).map((coin) => {
        const isPositive = coin.change >= 0;
        const convertedPrice = (coin.price || 0) * rate;
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
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      width: 42px;
                      height: 42px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, #7C3AED33, #2563EB33);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: bold;
                      color: #A78BFA;
                      font-size: 16px;
                    ">${coin.symbol.charAt(0)}</div>
                  `;
                }}
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
                  minimumFractionDigits: 2,
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
                  color: isPositive ? "#22C55E" : "#EF4444",
                  fontSize: 13,
                }}
              >
                {isPositive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {(coin.change ?? 0).toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
