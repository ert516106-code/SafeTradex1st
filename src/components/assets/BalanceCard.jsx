import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function BalanceCard({ balance = 0, loading = false }) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        borderRadius: 20,
        padding: "20px 20px 24px",
        marginBottom: 24,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
          Account Balance (USDT)
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowBalance(!showBalance)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
          >
            {showBalance ? <Eye style={{ width: 18, height: 18 }} /> : <EyeOff style={{ width: 18, height: 18 }} />}
          </button>
          <RefreshCw style={{ width: 16, height: 16, color: "rgba(255,255,255,0.6)" }} />
        </div>
      </div>

      <div style={{ margin: "8px 0 12px" }}>
        {loading ? (
          <div style={{ height: 36, width: 160, background: "rgba(255,255,255,0.2)", borderRadius: 6 }} />
        ) : (
          <div style={{ fontSize: 36, fontWeight: 700 }}>
            {showBalance ? `$${balance.toLocaleString()}` : "****"}
          </div>
        )}
      </div>

      <div style={{ color: "#34d399", fontSize: 15, fontWeight: 600 }}>
        Today's Profit +0.00
      </div>
    </div>
  );
}
