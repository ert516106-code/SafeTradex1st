import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function PortfolioCard({ balance = 0, loading = false }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a3a8a 0%, #2563eb 100%)",
        borderRadius: 24,
        padding: "24px 20px",
        marginBottom: 20,
        color: "white",
        boxShadow: "0 8px 32px rgba(37, 99, 235, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background graphic */}
      <div
        style={{
          position: "absolute",
          right: -20,
          top: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Total Portfolio Value
          </span>
        </div>
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

      <div style={{ marginTop: 12 }}>
        {loading ? (
          <div style={{ height: 40, width: 200, background: "rgba(255,255,255,0.2)", borderRadius: 8, animation: "pulse 1.5s infinite" }} />
        ) : (
          <div style={{ fontSize: 38, fontWeight: 700 }}>
            {showBalance ? `$${balance.toLocaleString()}` : "****"}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 10,
          background: "rgba(16, 185, 129, 0.2)",
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
  );
}
