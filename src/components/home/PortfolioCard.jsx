import { useMemo, useState } from "react";
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";

// Replace these with real portfolio data once wired up
const PORTFOLIO_VALUE = 0;
const TODAY_CHANGE_VALUE = 0;
const TODAY_CHANGE_PERCENT = 0;

function getLocalCurrency() {
  try {
    const locale = navigator.language || "en-US";
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const symbolPart = parts.find((p) => p.type === "currency");
    return { locale, symbol: symbolPart ? symbolPart.value : "$" };
  } catch {
    return { locale: "en-US", symbol: "$" };
  }
}

export default function PortfolioCard() {
  const [hidden, setHidden] = useState(false);
  const { locale, symbol } = useMemo(getLocalCurrency, []);

  const formattedValue = useMemo(() => {
    return PORTFOLIO_VALUE.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale]);

  const formattedChangeValue = useMemo(() => {
    return Math.abs(TODAY_CHANGE_VALUE).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [locale]);

  const isPositive = TODAY_CHANGE_PERCENT >= 0;
  const pnlColor = isPositive ? "#36F58B" : "#FF5C7A";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        padding: 24,
        marginBottom: 24,
        background:
          "linear-gradient(135deg,#0D1530 0%,#152A6B 45%,#1E3F9E 75%,#2968FF 100%)",
        boxShadow:
          "0 24px 60px -12px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <style>{`
        @keyframes portfolioGlowPulse {
          0%, 100% { opacity: 0.14; transform: scale(1); }
          50% { opacity: 0.24; transform: scale(1.06); }
        }
        @keyframes portfolioChartDrift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-6px) translateY(-4px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes portfolioLineShimmer {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -240; }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: "rgba(125,211,252,.35)",
          filter: "blur(50px)",
          animation: "portfolioGlowPulse 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(124,92,255,.28)",
          filter: "blur(45px)",
          animation: "portfolioGlowPulse 6s ease-in-out infinite reverse",
          pointerEvents: "none",
        }}
      />

      {/* Animated background chart */}
      <svg
        viewBox="0 0 420 220"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: -6,
          right: -16,
          width: "80%",
          height: "70%",
          opacity: 0.28,
          animation: "portfolioChartDrift 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id="pcAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#pcAreaFill)"
          points="0,190 35,170 70,175 105,145 140,155 175,125 210,135 245,92 280,110 315,70 350,85 385,35 420,5 420,220 0,220"
        />
        <polyline
          fill="none"
          stroke="#BAE6FD"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 6"
          style={{ animation: "portfolioLineShimmer 6s linear infinite" }}
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

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            Total Portfolio Value
          </div>

          <button
            onClick={() => setHidden((h) => !h)}
            aria-label={hidden ? "Show balance" : "Hide balance"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.14)",
              background: "rgba(255,255,255,.06)",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              color: "#fff",
              transition: "background .15s ease, transform .15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            fontSize: 44,
            color: "#fff",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -0.5,
          }}
        >
          {hidden ? (
            <span style={{ letterSpacing: 4 }}>{symbol}•••••</span>
          ) : (
            <>
              <span style={{ opacity: 0.6, fontSize: 30, fontWeight: 700 }}>
                {symbol}
              </span>
              <span>{formattedValue}</span>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: isPositive
              ? "rgba(54,245,139,.14)"
              : "rgba(255,92,122,.14)",
            border: `1px solid ${isPositive ? "rgba(54,245,139,.3)" : "rgba(255,92,122,.3)"}`,
          }}
        >
          {isPositive ? (
            <TrendingUp size={14} color={pnlColor} />
          ) : (
            <TrendingDown size={14} color={pnlColor} />
          )}
          <span style={{ color: pnlColor, fontSize: 13.5, fontWeight: 700 }}>
            {hidden
              ? "••••"
              : `${isPositive ? "+" : "-"}${symbol}${formattedChangeValue} (${isPositive ? "+" : ""}${TODAY_CHANGE_PERCENT.toFixed(2)}%)`}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,.45)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Today
          </span>
        </div>
      </div>
    </div>
  );
}
