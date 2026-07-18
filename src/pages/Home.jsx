import GreetingHeader from "../components/home/GreetingHeader";
import PortfolioCard from "../components/home/PortfolioCard";
import QuickActions from "../components/home/QuickActions";
import MarketOverview from "../components/home/MarketOverview";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Home() {
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
        <GreetingHeader />

        <PortfolioCard />

        <QuickActions />

        <MarketOverview />
      </div>

      <BottomNavigation />
    </div>
  );
}
