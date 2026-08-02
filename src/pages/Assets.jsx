import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import BalanceCard from "../components/assets/BalanceCard";
import AssetActions from "../components/assets/AssetActions";
import AssetList from "../components/assets/AssetList";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // --- FUNCTION TO FETCH ASSETS DIRECTLY FROM SUPABASE ---
  const fetchLiveAssets = async (uid) => {
    if (!uid) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('btc, eth, sol, xrp, bnb, usdt, usdc')
      .eq('id', uid)
      .single();
    
    if (profile) {
      const assetList = [
        { id: 'BTC', balance: profile.btc || 0, symbol: 'BTC' },
        { id: 'ETH', balance: profile.eth || 0, symbol: 'ETH' },
        { id: 'SOL', balance: profile.sol || 0, symbol: 'SOL' },
        { id: 'XRP', balance: profile.xrp || 0, symbol: 'XRP' },
        { id: 'BNB', balance: profile.bnb || 0, symbol: 'BNB' },
        { id: 'USDT', balance: profile.usdt || 0, symbol: 'USDT' },
        { id: 'USDC', balance: profile.usdc || 0, symbol: 'USDC' },
      ];
      setAssets(assetList);
      setLoading(false);
    }
  };

  // --- SETUP REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    let subscription = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchLiveAssets(user.id);

        // --- REAL-TIME MAGIC STARTS HERE ---
        // Listen for changes on the 'profiles' table for this specific user
        subscription = supabase
          .channel(`profile-changes-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE', // Only trigger when an UPDATE happens
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`, // Only listen to THIS user's updates
            },
            (payload) => {
              console.log("Real-time update received:", payload);
              // The Admin Panel just updated the DB. Fetch the new numbers instantly.
              fetchLiveAssets(user.id);
            }
          )
          .subscribe();
      }
    }

    init();

    // CLEANUP: Disconnect the listener when the user leaves the Assets page
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
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
      
      <BalanceCard assets={assets} loading={loading} />
      <AssetActions />
      <AssetList assets={assets} loading={loading} />
      
      <BottomNavigation />
    </div>
  );
}
