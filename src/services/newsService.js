// -----------------------------------------------------------------------
// SafeTrade Crypto News Service
// -----------------------------------------------------------------------
// Uses multiple free news APIs with fallbacks:
// 1. CryptoCompare (primary - no API key)
// 2. CoinGecko (secondary - no API key)
// 3. Local cache (if available)
// 4. Static fallback (last resort)
// -----------------------------------------------------------------------

const CRYPTOCOMPARE_URL = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";
const COINGECKO_NEWS_URL = "https://api.coingecko.com/api/v3/news";
const CACHE_KEY = "safetrade_crypto_news_cache";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// ─── STATIC FALLBACK NEWS ───
const FALLBACK_NEWS = [
  {
    id: "fallback-1",
    title: "Bitcoin (BTC) — Live Price, Charts & News",
    description: "Track real-time Bitcoin price action, market cap, and trading volume.",
    source: "CoinMarketCap",
    url: "https://coinmarketcap.com/currencies/bitcoin/",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Ethereum (ETH) — Live Price, Charts & News",
    description: "Track real-time Ethereum price action, market cap, and trading volume.",
    source: "CoinMarketCap",
    url: "https://coinmarketcap.com/currencies/ethereum/",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "Latest Crypto Market News",
    description: "Top headlines across the crypto market, updated continuously.",
    source: "CoinDesk",
    url: "https://www.coindesk.com/",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "Crypto Markets Today",
    description: "Breaking news and analysis on Bitcoin, Ethereum, and altcoins.",
    source: "Cointelegraph",
    url: "https://cointelegraph.com/",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    title: "Solana Ecosystem Expands Rapidly",
    description: "Solana network continues to grow with new projects and increased adoption.",
    source: "Solana News",
    url: "https://solana.com/news",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "fallback-6",
    title: "Bitcoin ETF Sees Record Inflows",
    description: "Institutional investors continue to pour money into Bitcoin ETFs.",
    source: "Bloomberg Crypto",
    url: "https://www.bloomberg.com/crypto",
    imageUrl: null,
    publishedAt: new Date().toISOString(),
  },
];

// ─── CACHE HELPERS ───
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.data) || !parsed.timestamp) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // ignore quota errors
  }
}

// ─── NORMALIZE FUNCTIONS ───
function normalizeCryptoCompare(raw, index) {
  return {
    id: raw.id ? String(raw.id) : `news-${index}-${raw.published_on || index}`,
    title: raw.title || "Untitled",
    description: raw.body ? raw.body.slice(0, 160) : "",
    source: raw.source_info?.name || raw.source || "Unknown",
    url: raw.url || raw.guid || "#",
    imageUrl: raw.imageurl || null,
    publishedAt: raw.published_on
      ? new Date(raw.published_on * 1000).toISOString()
      : new Date().toISOString(),
  };
}

function normalizeCoinGecko(raw, index) {
  return {
    id: raw.id ? String(raw.id) : `cg-news-${index}`,
    title: raw.title || "Untitled",
    description: raw.description ? raw.description.slice(0, 160) : "",
    source: raw.news_site || "CoinGecko",
    url: raw.url || "#",
    imageUrl: raw.thumb_2x || raw.thumb || null,
    publishedAt: raw.created_at ? raw.created_at : new Date().toISOString(),
  };
}

// ─── FETCH FUNCTIONS ───
async function fetchFromCryptoCompare() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(CRYPTOCOMPARE_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`CryptoCompare API responded with status ${res.status}`);
    }

    const json = await res.json();
    const list = Array.isArray(json?.Data) ? json.Data : [];

    if (list.length === 0) {
      throw new Error("CryptoCompare API returned no articles");
    }

    return list.slice(0, 20).map(normalizeCryptoCompare);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function fetchFromCoinGecko() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(COINGECKO_NEWS_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`CoinGecko API responded with status ${res.status}`);
    }

    const json = await res.json();
    const list = Array.isArray(json?.data) ? json.data : [];

    if (list.length === 0) {
      throw new Error("CoinGecko API returned no articles");
    }

    return list.slice(0, 15).map(normalizeCoinGecko);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// ─── MAIN FETCH FUNCTION WITH FALLBACKS ───
async function fetchFromNetwork() {
  // Try CryptoCompare first
  try {
    const result = await fetchFromCryptoCompare();
    if (result && result.length > 0) {
      writeCache(result);
      return result;
    }
  } catch (err) {
    console.warn('CryptoCompare fetch failed:', err.message);
  }

  // If CryptoCompare fails, try CoinGecko
  try {
    const result = await fetchFromCoinGecko();
    if (result && result.length > 0) {
      writeCache(result);
      return result;
    }
  } catch (err) {
    console.warn('CoinGecko fetch failed:', err.message);
  }

  // If both fail, throw to trigger cache/fallback
  throw new Error('All news sources failed');
}

// ─── EXPORTED FUNCTION ───
export async function getCryptoNews() {
  const cache = readCache();
  const isFresh = cache && Date.now() - cache.timestamp < CACHE_TTL_MS;

  // If cache is fresh, return it immediately
  if (isFresh && cache.data && cache.data.length > 0) {
    return cache.data;
  }

  // Try to fetch fresh data
  try {
    const freshData = await fetchFromNetwork();
    if (freshData && freshData.length > 0) {
      return freshData;
    }
  } catch {
    // Network fetch failed
  }

  // If there's any cached data, return it (even if expired)
  if (cache && Array.isArray(cache.data) && cache.data.length > 0) {
    return cache.data;
  }

  // Last resort: return static fallback
  return FALLBACK_NEWS;
}

export function getCacheAgeMs() {
  const cache = readCache();
  if (!cache) return null;
  return Date.now() - cache.timestamp;
}
