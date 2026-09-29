import { useState, useEffect, useMemo } from 'react';
import { supabase } from "../lib/supabase";
import { usePrices, balancesFromProfile } from "../lib/prices";
import BalanceCard from "../components/assets/BalanceCard";
import AssetActions from "../components/assets/AssetActions";
import AssetList from "../components/assets/AssetList";
import BottomNavigation from "../components/layout/BottomNavigation";

export default function Assets() {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const { prices } = usePrices();

  // --- FETCH BALANCES DIRECTLY FROM SUPABASE (all coins) ---
  const fetchLiveAssets = async (uid) => {
    if (!uid) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (profile) {
      setBalances(balancesFromProfile(profile));
      setLoading(false);
    }
  };

  // --- REAL-TIME SUBSCRIPTION ---
  useEffect(() => {
    let subscription = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchLiveAssets(user.id);

        subscription = supabase
          .channel(`profile-changes-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            () => {
              // Admin panel or a conversion updated the DB: refetch balances
              fetchLiveAssets(user.id);
            }
          )
          .subscribe();
      }
    }

    init();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  // --- BUILD ASSET LIST WITH LIVE PRICE + USD VALUE ---
  // Recomputes whenever balances OR prices change.
  const assets = useMemo(
    () =>
      Object.entries(balances).map(([symbol, balance]) => {
        const price = prices[symbol] > 0 ? prices[symbol] : 0;
        return {
          id: symbol,
          symbol,
          balance,
          price,            // USD price of 1 coin
          usd: balance * price, // USD value of the balance
        };
      }),
    [balances, prices]
  );

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
