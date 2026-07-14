import { ArrowLeft, ArrowDown, Send, TrendingUp } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMarket } from "../contexts/MarketContext";
import CoinChart from "../components/market/CoinChart";

export default function CoinDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { coins } = useMarket();

  const coin = coins.find((c) => c.id === id);

  if (!coin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#08101F",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#1E3170 0%,#091120 70%)",
        padding: 20,
        color: "#fff",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 25,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: "1px solid #293B66",
            background: "#101933",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <img
          src={coin.logo}
          alt={coin.symbol}
          width={42}
          height={42}
        />

        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {coin.name}
          </div>

          <div
            style={{
              color: "#8FA4D8",
              marginTop: 3,
            }}
          >
            {coin.pair}
          </div>
        </div>
      </div>

      {/* Price */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          $
          {coin.price.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </div>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color:
              coin.change >= 0
                ? "#22C55E"
                : "#EF4444",
          }}
        >
          {coin.change >= 0 ? (
            <TrendingUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}

          {coin.change.toFixed(2)}%
        </div>
      </div>

      {/* TradingView */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <CoinChart
          coinId={coin.id}
          currentPrice={coin.price}
          change={coin.change}
        />
      </div>

      {/* Wallet */}

      <div
        style={{
          borderRadius: 20,
          background:
            "linear-gradient(180deg,#132758,#0F1834)",
          border: "1px solid #2D4380",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            color: "#8EA2D8",
            marginBottom: 10,
          }}
        >
          Your Wallet
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          0 {coin.symbol}
        </div>

        <div
          style={{
            marginTop: 8,
            color: "#8EA2D8",
          }}
        >
          ≈ $0.00 USD
        </div>
      </div>

      {/* Buttons */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate(`/deposit/${coin.id}`)}
          style={{
            background: "#3468FF",
            color: "#fff",
            border: "none",
            height: 54,
            borderRadius: 16,
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <ArrowDown size={18} />
          Deposit
        </button>

        <button
          style={{
            background: "#101933",
            color: "#fff",
            border: "1px solid #2C437C",
            height: 54,
            borderRadius: 16,
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <Send size={18} />
          Transfer
        </button>
      </div>

      {/* About */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <h3>About {coin.name}</h3>

        <p
          style={{
            color: "#9BB0DF",
            lineHeight: 1.7,
          }}
        >
          Information about {coin.name} will be
          displayed here. Later this section will
          contain a real description from our market
          service.
        </p>
      </div>

      {/* Statistics */}

      <div
        style={{
          borderRadius: 20,
          background: "#101933",
          border: "1px solid #293B66",
          padding: 20,
        }}
      >
        <h3>Market Statistics</h3>

        <Stat
          label="Market Cap"
          value="Coming Soon"
        />

        <Stat
          label="Volume (24H)"
          value="Coming Soon"
        />

        <Stat
          label="Circulating Supply"
          value="Coming Soon"
        />

        <Stat
          label="All Time High"
          value="Coming Soon"
        />

        <Stat
          label="All Time Low"
          value="Coming Soon"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #1B2A4A",
      }}
    >
      <span>{label}</span>

      <span
        style={{
          color: "#9BB0DF",
        }}
      >
        {value}
      </span>
    </div>
  );
}