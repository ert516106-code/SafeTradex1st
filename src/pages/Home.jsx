import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

import GreetingHeader from "../components/home/GreetingHeader";
import PortfolioCard from "../components/home/PortfolioCard";
import QuickActions from "../components/home/QuickActions";
import MarketOverview from "../components/home/MarketOverview";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #18254b 0%, #050816 70%)",
        padding: "20px",
        paddingBottom: "110px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "12px",
          }}
        >
          <button
            onClick={() => {
              alert("PROFILE BUTTON CLICKED");
              navigate("/profile");
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background:
                "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <User size={20} color="#ffffff" />
          </button>
        </div>

        <GreetingHeader />

        <PortfolioCard />

        <QuickActions />

        <MarketOverview />
      </div>

      <BottomNavigation />
    </div>
  );
}
