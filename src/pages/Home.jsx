import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import GreetingHeader from "../components/home/GreetingHeader";
import PortfolioCard from "../components/home/PortfolioCard";
import MarketOverview from "../components/home/MarketOverview";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Home() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- FETCH LIVE BALANCE FROM SUPABASE ---
  useEffect(() => {
    async function fetchLiveBalance() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('usdt')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setTotalBalance(profile.usdt || 0);
        }
      }
      setLoading(false);
    }

    fetchLiveBalance();

    // Refresh every 10 seconds while on this page
    const interval = setInterval(fetchLiveBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #18254b 0%, #050816 70%)",
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

        {/* Pass the live balance to the Portfolio Card */}
        <PortfolioCard balance={totalBalance} loading={loading} />

        <MarketOverview />
      </div>

      <BottomNavigation />
    </div>
  );
}
