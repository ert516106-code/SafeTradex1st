import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import BalanceCard from "../components/assets/BalanceCard";
import AssetActions from "../components/assets/AssetActions";
import AssetList from "../components/assets/AssetList";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Assets() {
  const [balance, setBalance] = useState(0);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH LIVE BALANCE AND ASSETS FROM SUPABASE ---
  useEffect(() => {
    async function fetchLiveAssets() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('usdt, btc, eth, sol, xrp, bnb')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setBalance(profile.usdt || 0);
          
          // Format assets for the list
          const assetList = [
            { id: 'BTC', balance: profile.btc || 0, symbol: 'BTC' },
            { id: 'ETH', balance: profile.eth || 0, symbol: 'ETH' },
            { id: 'SOL', balance: profile.sol || 0, symbol: 'SOL' },
            { id: 'XRP', balance: profile.xrp || 0, symbol: 'XRP' },
            { id: 'BNB', balance: profile.bnb || 0, symbol: 'BNB' },
          ];
          setAssets(assetList);
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
        background: "radial-gradient(circle at top,#18254b 0%,#050816 70%)",
        padding: 20,
        color: "#FFFFFF",
        paddingBottom: 110,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Assets</div>
          <div style={{ color: "#94A3B8", marginTop: 4 }}>Manage your crypto portfolio</div>
        </div>
      </div>
      
      <BalanceCard balance={balance} loading={loading} />
      <AssetActions />
      <AssetList assets={assets} loading={loading} />
      
      <BottomNavigation />
    </div>
  );
}
