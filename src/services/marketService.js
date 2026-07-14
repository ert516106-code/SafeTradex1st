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
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
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

    cache = COINS.map((coin) => ({
      ...coin,
      price: data[coin.id]?.usd ?? 0,
      change: data[coin.id]?.usd_24h_change ?? 0,
    }));

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
    }));
  }
}