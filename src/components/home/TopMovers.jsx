import { TrendingUp, TrendingDown } from "lucide-react";

const movers = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$118,245",
    change: "+2.34%",
    up: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$4,286",
    change: "+4.11%",
    up: true,
  },
  {
    symbol: "XRP",
    name: "Ripple",
    price: "$3.21",
    change: "-1.28%",
    up: false,
  },
];

export default function TopMovers() {
  return (
    <div
      style={{
        marginBottom: 28,
      }}
    >
      <h2
        style={{
          color: "#fff",
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        🔥 Top Movers
      </h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: 16,
          paddingBottom: 6,
          scrollbarWidth: "none",
        }}
      >
        {movers.map((coin) => (
          <div
            key={coin.symbol}
            style={{
              minWidth: 180,
              background:
                "linear-gradient(180deg,#111b35,#0d1429)",
              border: "1px solid #24304d",
              borderRadius: 22,
              padding: 18,
              boxShadow:
                "0 10px 25px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {coin.symbol}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  {coin.name}
                </div>
              </div>

              {coin.up ? (
                <TrendingUp color="#22c55e" />
              ) : (
                <TrendingDown color="#ef4444" />
              )}
            </div>

            <div
              style={{
                marginTop: 18,
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {coin.price}
            </div>

            <div
              style={{
                marginTop: 8,
                color: coin.up
                  ? "#22c55e"
                  : "#ef4444",
                fontWeight: 700,
              }}
            >
              {coin.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}