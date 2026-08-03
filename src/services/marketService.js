import { COINS } from "../data/coins";

let cache = [];
let lastFetch = 0;
let pendingRequest = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMarketPrices(forceRefresh = false) {
  const now = Date.now();
  // Return cached data
  if (
    !forceRefresh &&
    cache.length &&
    now - lastFetch < CACHE_DURATION
  ) {
    return cache;
  }
  // Prevent duplicate requests
  if (pendingRequest) {
    return pendingRequest;
  }
  pendingRequest = fetchPrices();
  try {
    const result = await pendingRequest;
    return result;
  } finally {
    pendingRequest = null;
  }
}

async function fetchPrices() {
  const ids = COINS.map((coin) => coin.id).join(",");
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`CoinGecko ${response.status}`);
    }
    const data = await response.json();

    // Index the response by coin id for quick lookup
    const byId = {};
    data.forEach((entry) => {
      byId[entry.id] = entry;
    });

    cache = COINS.map((coin) => {
      const live = byId[coin.id];
      return {
        ...coin,
        price: live?.current_price ?? 0,
        change: live?.price_change_percentage_24h ?? 0,
        high24h: live?.high_24h ?? 0,
        low24h: live?.low_24h ?? 0,
        volume24h: live?.total_volume ?? 0,
      };
    });
    lastFetch = Date.now();
    console.log("✅ Market prices updated.");
    return cache;
  } catch (error) {
    console.warn("⚠ Using cached market data.");
    if (cache.length) {
      return cache;
    }
    return COINS.map((coin) => ({
      ...coin,
      price: 0,
      change: 0,
      high24h: 0,
      low24h: 0,
      volume24h: 0,
    }));
  }
}
