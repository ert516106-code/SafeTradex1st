import { useMemo, useState } from "react";
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMarket } from "../contexts/MarketContext";

export default function Markets() {
  const navigate = useNavigate();
  const { coins, loading } = useMarket();
  const [search, setSearch] = useState("");

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [coins, search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#18254b 0%,#050816 70%)",
        padding: 20,
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Markets</h1>
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={18} style={{ position: "absolute", left: 15, top: 16, color: "#94A3B8" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cryptocurrency..."
          style={{
            width: "100%",
            padding: "15px 15px 15px 46px",
            borderRadius: 18,
            border: "1px solid #24304d",
            background: "#101933",
            color: "#fff",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: "#94A3B8", padding: 40 }}>
          Loading markets...
        </div>
      )}

      {!loading &&
        filteredCoins.map((coin) => (
          <div
            key={coin.symbol}
            onClick={() => navigate(`/coin/${coin.id}`)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#101933",
              border: "1px solid #23304c",
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={coin.logo} alt={coin.symbol} width={42} height={42} />
              <div>
                <div style={{ fontWeight: 700 }}>{coin.name}</div>
                <div style={{ color: "#94A3B8", fontSize: 13 }}>{coin.pair}</div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>
                ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 5,
                  color: coin.change >= 0 ? "#22C55E" : "#EF4444",
                  fontSize: 13,
                }}
              >
                {coin.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {coin.change.toFixed(2)}%
              </div>
            </div>

            <Star size={18} color="#64748B" />
          </div>
        ))}

      <div
        onClick={() => window.open("https://www.tradingview.com/", "_blank")}
        style={{
          marginTop: 30,
          marginBottom: 80,
          textAlign: "center",
          color: "#94A3B8",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        📈 Charts powered by <b>TradingView</b>
      </div>
    </div>
  );
}
