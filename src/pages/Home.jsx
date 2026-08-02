import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import GreetingHeader from "../components/home/GreetingHeader";
import PortfolioCard from "../components/home/PortfolioCard";
import MarketOverview from "../components/home/MarketOverview";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ALL LIVE BALANCES FROM SUPABASE ---
  useEffect(() => {
    async function fetchLiveAssets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('btc, eth, sol, xrp, bnb, usdt, usdc')
          .eq('id', user.id)
          .single();

        if (profile) {
          setAssets([
            { id: 'BTC', balance: profile.btc || 0, symbol: 'BTC' },
            { id: 'ETH', balance: profile.eth || 0, symbol: 'ETH' },
            { id: 'SOL', balance: profile.sol || 0, symbol: 'SOL' },
            { id: 'XRP', balance: profile.xrp || 0, symbol: 'XRP' },
            { id: 'BNB', balance: profile.bnb || 0, symbol: 'BNB' },
            { id: 'USDT', balance: profile.usdt || 0, symbol: 'USDT' },
            { id: 'USDC', balance: profile.usdc || 0, symbol: 'USDC' },
          ]);
        }
      }
      setLoading(false);
    }
    fetchLiveAssets();
    // Refresh every 10 seconds while on this page
    const interval = setInterval(fetchLiveAssets, 10000);
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
        {/* Pass the full asset list so the card can total everything */}
        <PortfolioCard assets={assets} loading={loading} />
        <MarketOverview />
      </div>
      <BottomNavigation />
    </div>
  );
}
