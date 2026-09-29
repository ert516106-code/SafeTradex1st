// src/lib/prices.js
// Shared live prices for the whole app (Home, Assets, Markets, Convert...).
// One fetch loop is shared by every component that calls usePrices().
import { useEffect, useState } from "react";

const COIN_IDS = {
  BTC: "bitcoin", ETH: "ethereum", SOL: "solana", BNB: "binancecoin",
  USDT: "tether", USDC: "usd-coin", XRP: "ripple", DOGE: "dogecoin",
  ADA: "cardano", TRX: "tron", AVAX: "avalanche-2", LINK: "chainlink",
  DOT: "polkadot", MATIC: "matic-network", LTC: "litecoin", SHIB: "shiba-inu",
  UNI: "uniswap", ATOM: "cosmos", NEAR: "near", APT: "aptos",
  ARB: "arbitrum", OP: "optimism", FIL: "filecoin", ICP: "internet-computer",
  ETC: "ethereum-classic", BCH: "bitcoin-cash", ALGO: "algorand",
  VET: "vechain", SAND: "the-sandbox", MANA: "decentraland",
};

const SYMBOLS = Object.keys(COIN_IDS);
const BINANCE_OVERRIDES = { MATIC: "POL" };
const REFRESH_MS = 30_000;
const STALE_AFTER_MS = 90_000;

// ─── module-level shared state ───
let cache = {};
let updatedAt = null;
let failed = false;
let timer = null;
let inFlight = false;
const listeners = new Set();

async function fetchPrices() {
  // Primary: CoinGecko
  try {
    const ids = Object.values(COIN_IDS).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const data = await res.json();
    const out = {};
    SYMBOLS.forEach((s) => {
      const p = data[COIN_IDS[s]]?.usd;
      if (p) out[s] = p;
    });
    if (Object.keys(out).length) return out;
  } catch (e) {
    console.warn("CoinGecko failed, trying Binance:", e);
  }

  // Backup: Binance
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price");
    if (!res.ok) throw new Error(`Binance ${res.status}`);
    const list = await res.json();
    const map = Object.fromEntries(list.map((t) => [t.symbol, parseFloat(t.price)]));
    const out = { USDT: 1, USDC: 1 };
    SYMBOLS.forEach((s) => {
      if (s === "USDT" || s === "USDC") return;
      const p = map[`${BINANCE_OVERRIDES[s] || s}USDT`];
      if (p) out[s] = p;
    });
    return out;
  } catch (e) {
    console.error("All price sources failed:", e);
    return null;
  }
}

async function refresh() {
  if (inFlight) return;
  inFlight = true;
  const p = await fetchPrices();
  inFlight = false;
  if (p) {
    cache = { ...cache, ...p };
    updatedAt = Date.now();
    failed = false;
  } else {
    failed = true; // keep last known prices, but flag them
  }
  listeners.forEach((fn) => fn());
}

// ─── hook ───
export function usePrices() {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    if (!timer) {
      refresh();
      timer = setInterval(refresh, REFRESH_MS);
    }
    return () => {
      listeners.delete(fn);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  const stale = failed || (updatedAt !== null && Date.now() - updatedAt > STALE_AFTER_MS);
  return {
    prices: cache,
    updatedAt,
    loading: updatedAt === null && !failed,
    stale,
  };
}

// ─── helpers ───

// Turn a Supabase profile row into { BTC: 0.1, ETH: 0.03682, USDT: 134.5, ... }
export function balancesFromProfile(profile) {
  const out = {};
  if (!profile) return out;
  SYMBOLS.forEach((s) => {
    out[s] = Number(profile[s.toLowerCase()]) || 0;
  });
  return out;
}

// USD value of one coin balance
export function usdValue(symbol, amount, prices) {
  return (Number(amount) || 0) * (prices[symbol] || 0);
}

// Total USD value of ALL coins
export function totalUsd(balances, prices) {
  return Object.entries(balances).reduce(
    (sum, [symbol, amount]) => sum + usdValue(symbol, amount, prices),
    0
  );
}

// Always 2 decimals: 134.5 -> "134.50" (fixes the "$134,5" display)
export function formatUsd(value) {
  return (Number(value) || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
