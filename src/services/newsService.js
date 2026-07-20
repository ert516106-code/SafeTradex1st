// -----------------------------------------------------------------------
// SafeTrade Crypto News Service
// -----------------------------------------------------------------------
// Primary source: CryptoCompare's public news endpoint. It's free,
// requires no API key, and is CORS-enabled for direct browser fetch.
//
// If the network call fails for any reason (offline, endpoint down,
// blocked by a restrictive network), we fall back to a small curated
// list of real crypto news article links so the UI is never stuck on
// an empty/error state. The fallback is intentionally small and marked
// so it's obvious it isn't a live feed.
// -----------------------------------------------------------------------

const API_URL = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN";
const CACHE_KEY = "safetrade_crypto_news_cache";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

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
];

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

function normalizeArticle(raw, index) {
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

async function fetchFromNetwork() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`News API responded with status ${res.status}`);
    }

    const json = await res.json();
    const list = Array.isArray(json?.Data) ? json.Data : [];

    if (list.length === 0) {
      throw new Error("News API returned no articles");
    }

    const normalized = list.slice(0, 20).map(normalizeArticle);
    writeCache(normalized);
    return normalized;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Returns crypto news articles. Tries a fresh network fetch, falls back
 * to cached data if the fetch fails, and falls back to a small curated
 * static list as a last resort so the UI is never empty.
 *
 * @returns {Promise<Array<{
 *   id: string,
 *   title: string,
 *   description: string,
 *   source: string,
 *   url: string,
 *   imageUrl: string|null,
 *   publishedAt: string
 * }>>}
 */
export async function getCryptoNews() {
  const cache = readCache();
  const isFresh = cache && Date.now() - cache.timestamp < CACHE_TTL_MS;

  if (isFresh) {
    return cache.data;
  }

  try {
    return await fetchFromNetwork();
  } catch {
    if (cache && Array.isArray(cache.data) && cache.data.length > 0) {
      return cache.data;
    }
    return FALLBACK_NEWS;
  }
}

export function getCacheAgeMs() {
  const cache = readCache();
  if (!cache) return null;
  return Date.now() - cache.timestamp;
}
