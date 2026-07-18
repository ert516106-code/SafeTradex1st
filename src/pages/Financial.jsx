import { useEffect, useRef } from "react";
import { Wallet, TrendingUp, Shield, Gift } from "lucide-react";
import FinancialCard from "../components/financial/FinancialCard";

function CryptoNewsWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: "market",
      market: "crypto",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "550",
      colorTheme: "dark",
      locale: "en",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: "1px solid #23304c",
        background: "#101933",
      }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default function Financial() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#1E3170 0%,#091120 70%)",
        color: "#FFFFFF",
        padding: 20,
        paddingBottom: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Financial Services</div>
          <div style={{ color: "#8FA4D8", marginTop: 5 }}>
            Grow your portfolio with our products
          </div>
        </div>
      </div>

      <FinancialCard
        icon={<Wallet size={28} />}
        title="Flexible Savings"
        subtitle="Earn interest on your idle assets"
        value="5.20% APY"
        color="#22C55E"
      />

      <FinancialCard
        icon={<TrendingUp size={28} />}
        title="Fixed Deposit"
        subtitle="Lock assets for higher returns"
        value="12.80% APY"
        color="#22C55E"
      />

      <FinancialCard
        icon={<Shield size={28} />}
        title="Insurance Fund"
        subtitle="Protect your investments"
        value="From $10"
        color="#22C55E"
      />

      <FinancialCard
        icon={<Gift size={28} />}
        title="Rewards Hub"
        subtitle="Complete tasks and earn rewards"
        value="Up to $500"
        color="#22C55E"
      />

      <div style={{ marginTop: 40, marginBottom: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Crypto News</div>
        <div style={{ color: "#8FA4D8" }}>Live updates powered by TradingView</div>
      </div>

      <CryptoNewsWidget />
    </div>
  );
}
