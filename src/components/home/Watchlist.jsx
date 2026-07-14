import {
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

const coins = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$118,420",
    change: "+2.34%",
    up: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$4,280",
    change: "+1.15%",
    up: true,
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: "$812",
    change: "+0.82%",
    up: true,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$184",
    change: "-0.73%",
    up: false,
  },
];

export default function Watchlist() {
  return (
    <div style={{ marginBottom: 30 }}>
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
            color: "#fff",
            margin: 0,
            fontSize: 22,
          }}
        >
          Watchlist
        </h2>

        <span
          style={{
            color: "#6D5DFF",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View All
        </span>
      </div>

      <div
        style={{
          background: "#10182F",
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid #24304d",
        }}
      >
        {coins.map((coin, index) => (
          <div
            key={coin.symbol}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px",
              borderBottom:
                index !== coins.length - 1
                  ? "1px solid #1c2743"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "#1C2743",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {coin.symbol}
              </div>

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
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  {coin.symbol}
                </div>
              </div>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {coin.price}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 4,
                  color: coin.up
                    ? "#22c55e"
                    : "#ef4444",
                  fontSize: 13,
                }}
              >
                {coin.up ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}

                {coin.change}
              </div>
            </div>

            <Star
              size={18}
              color="#64748b"
            />
          </div>
        ))}
      </div>
    </div>
  );
}