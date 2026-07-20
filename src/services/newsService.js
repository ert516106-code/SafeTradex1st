// -----------------------------------------------------------------------
// SafeTrade Crypto News Service
// -----------------------------------------------------------------------
// Why this file looks the way it does:
//
// TradingView does not provide a public, free, CORS-enabled JSON API for
// news. Their real news feed is powered by an internal service that only
// works on tradingview.com itself, and the third-party "TradingView News
// Scraper" products that exist (e.g. on Apify) are paid scraping services
// meant for backend/server use with an API token — they are not designed
// to be called directly from a browser, and doing so would require
// shipping a paid credential to every client, which is not appropriate.
//
// The supported, official, free way to show TradingView's Bitcoin news
// on a third-party site is TradingView's own embeddable Timeline widget
// (a sanctioned <iframe>/<script> embed, no API key required). That
// widget is rendered directly inside:
//
//   src/components/financial/NewsList.jsx
//
// via TradingView's embed script, scoped to symbol "BITSTAMP:BTCUSD".
// Because that widget renders and fetches its own content internally,
// there is no JSON payload for this service to fetch, cache, or hand
// back to a component.
//
// This file is kept as the single integration seam for news data so
// that if SafeTrade later adds its own backend (e.g. a server that
// proxies a licensed news API, or an Admin Dashboard-curated feed),
// only this file needs to change — no component code would need to
// be touched.
// -----------------------------------------------------------------------

/**
 * Placeholder for a future backend-driven news feed.
 *
 * Not currently used by NewsList.jsx, which renders the official
 * TradingView Timeline widget directly. Left in place so a future
 * SafeTrade backend integration has a clear, single function to
 * implement without requiring changes to any UI component.
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
  throw new Error(
    "getCryptoNews() is not wired to a data source. NewsList renders the official TradingView Timeline widget directly and does not call this function."
  );
}

/**
 * Placeholder for future cache-age reporting once a real backend feed
 * exists. Currently always returns null since there is no local cache.
 *
 * @returns {number|null}
 */
export function getCacheAgeMs() {
  return null;
}
