import { Plus, ArrowUp } from "lucide-react";

export default function PortfolioCard() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: 22,
        marginBottom: 24,
        background:
          "linear-gradient(135deg,#101B3F 0%,#143A9B 55%,#2968FF 100%)",
        boxShadow: "0 20px 45px rgba(0,0,0,.35)",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255,255,255,.12)",
          filter: "blur(35px)",
        }}
      />

      {/* Background Chart */}
      <svg
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: -10,
          right: -20,
          width: "75%",
          height: "75%",
          opacity: .22,
        }}
      >
        <polyline
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="4"
          points="
          0,190
          35,170
          70,175
          105,145
          140,155
          175,125
          210,135
          245,92
          280,110
          315,70
          350,85
          385,35
          420,5"
        />
      </svg>

      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,.75)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Total Portfolio Value
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 46,
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          $0.00
        </div>

        <div
          style={{
            marginTop: 14,
            color: "#36F58B",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          +0.00% (24H)
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
          }}
        >
          <button
            style={{
              flex: 1,
              height: 48,
              border: "none",
              borderRadius: 30,
              background: "#FFFFFF",
              color: "#111827",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={18} />
            Add Funds
          </button>

          <button
            style={{
              flex: 1,
              height: 48,
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,.35)",
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowUp size={18} />
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
