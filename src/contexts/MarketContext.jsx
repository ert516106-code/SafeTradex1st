import { createContext, useContext, useEffect, useState } from "react";
import { getMarketPrices } from "../services/marketService";

const MarketContext = createContext(null);

export function MarketProvider({ children }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPrices(forceRefresh = false) {
    try {
      const data = await getMarketPrices(forceRefresh);
      setCoins(data);
    } catch (error) {
      console.error("MarketContext:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial load (uses cache if available)
    loadPrices();

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      loadPrices();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const refresh = () => loadPrices(true);

  return (
    <MarketContext.Provider
      value={{
        coins,
        loading,
        refresh,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);

  if (!context) {
    throw new Error(
      "useMarket must be used inside <MarketProvider>"
    );
  }

  return context;
}