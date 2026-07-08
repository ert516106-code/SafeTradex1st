import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { COINS } from "../data/coins";
import { fetchLivePrices } from "../lib/livePrices";

import CoinCard from "../components/market/CoinCard";
import CoinDetailsModal from "../components/market/CoinDetailsModal";

export default function Markets() {
  const [search, setSearch] = useState("");
  const [prices, setPrices] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadPrices() {
      const data = await fetchLivePrices(
        COINS.map((coin) => coin.symbol)
      );

      if (mounted) {
        setPrices(data);
      }
    }

    loadPrices();

    const interval = setInterval(loadPrices, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredCoins = useMemo(() => {
    return COINS.filter((coin) => {
      const keyword = search.toLowerCase();

      return (
        coin.name.toLowerCase().includes(keyword) ||
        coin.symbol.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  return (
    <>
      <div className="min-h-screen bg-background pb-24">

        {/* Header */}
        <div className="sticky top-0 z-20 bg-background border-b border-border">

          <div className="px-5 pt-6 pb-5">

            <h1 className="text-2xl font-bold">
              Markets
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Explore live cryptocurrency prices.
            </p>

            {/* Search */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-secondary px-4 py-3">

              <Search
                size={18}
                className="text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search Bitcoin, Ethereum..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />

            </div>

          </div>

        </div>

        {/* Coin List */}

        <div className="px-5 py-5 space-y-3">

          {filteredCoins.length === 0 && (

            <div className="text-center py-12">

              <h2 className="text-lg font-semibold">
                No coins found
              </h2>

              <p className="text-muted-foreground mt-2">
                Try searching another cryptocurrency.
              </p>

            </div>

          )}

          {filteredCoins.map((coin) => {

            const live = prices[coin.symbol];

            return (

              <CoinCard
                key={coin.symbol}
                coin={coin}
                price={live?.price ?? 0}
                change={live?.change ?? 0}
                onClick={setSelectedCoin}
              />

            );

          })}

        </div>

      </div>

      <CoinDetailsModal
        open={!!selectedCoin}
        coin={selectedCoin}
        onClose={() => setSelectedCoin(null)}
      />
    </>
  );
}
