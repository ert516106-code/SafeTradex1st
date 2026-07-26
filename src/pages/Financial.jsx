import { Wallet, TrendingUp, Shield, Gift } from "lucide-react";

import FinancialCard from "../components/financial/FinancialCard";
import NewsList from "../components/financial/NewsList";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Financial() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#18254b 0%,#050816 70%)",
        color: "#FFFFFF",
        padding: 20,
        paddingBottom: 100,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 30,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Financial Services
          </div>

          <div
            style={{
              color: "#94A3B8",
              marginTop: 5,
            }}
          >
            Grow your portfolio with our products
          </div>
        </div>
      </div>

      {/* Products */}

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

      {/* News */}

      <div
        style={{
          marginTop: 40,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Crypto News
        </div>

        <div
          style={{
            color: "#94A3B8",
          }}
        >
          Live headlines, refreshed every 12 hours
        </div>
      </div>

      <div
        style={{
          borderRadius: 20,
          border: "1px solid #23304c",
          background: "#101933",
          overflow: "hidden",
        }}
      >
        <NewsList />
      </div>

      <BottomNavigation />
    </div>
  );
}
