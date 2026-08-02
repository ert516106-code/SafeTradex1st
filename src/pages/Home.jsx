import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabase";
import GreetingHeader from "../components/home/GreetingHeader";
import PortfolioCard from "../components/home/PortfolioCard";
import MarketOverview from "../components/home/MarketOverview";
import BottomNavigation from "../components/layout/BottomNavigation";

// Ordered strongest currency to weakest (by approximate value per unit)
export const CURRENCIES = [
  { code: 'GBP', symbol: '£' },
  { code: 'EUR', symbol: '€' },
  { code: 'USD', symbol: '$' },
  { code: 'PHP', symbol: '₱' },
  { code: 'JPY', symbol: '¥' },
];

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currency, setCurrency] = useState('USD');
  const [fxRates, setFxRates] = useState({ USD: 1 });

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

  // --- FETCH LIVE FX RATES (USD base) — shared across the whole page ---
  useEffect(() => {
    async function fetchFxRates() {
      try {
        const symbols = CURRENCIES.filter(c => c.code !== 'USD').map(c => c.code).join(',');
        const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${symbols}`);
        const data = await res.json();
        setFxRates({ USD: 1, ...data.rates });
      } catch (err) {
        console.error("Failed to fetch FX rates:", err);
        setFxRates({ USD: 1 });
      }
    }
    fetchFxRates();
    const interval = setInterval(fetchFxRates, 60 * 60 * 1000); // refresh hourly
    return () => clearInterval(interval);
  }, []);

  const currencyMeta = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const rate = fxRates[currency] || 1;

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
        <PortfolioCard
          assets={assets}
          loading={loading}
          currency={currency}
          currencySymbol={currencyMeta.symbol}
          rate={rate}
          onCurrencyChange={setCurrency}
        />
        <MarketOverview currency={currency} currencySymbol={currencyMeta.symbol} rate={rate} />
      </div>
      <BottomNavigation />
    </div>
  );
}
