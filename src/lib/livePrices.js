export const COIN_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', XRP: 'ripple', LTC: 'litecoin', BNB: 'binancecoin',
  SOL: 'solana', DOGE: 'dogecoin', TRX: 'tron', ADA: 'cardano', AVAX: 'avalanche-2',
  DOT: 'polkadot', MATIC: 'matic-network', LINK: 'chainlink', UNI: 'uniswap',
  ATOM: 'cosmos', XLM: 'stellar', ETC: 'ethereum-classic', FIL: 'filecoin',
  NEAR: 'near', APT: 'aptos',
};

export async function fetchLivePrices(symbols) {
  const ids = symbols.map(s => COIN_IDS[s]).filter(Boolean);
  if (!ids.length) return {};
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`);
    const data = await res.json();
    const result = {};
    symbols.forEach(s => {
      const id = COIN_IDS[s];
      if (id && data[id]) {
        result[s] = { price: data[id].usd, change: data[id].usd_24h_change ?? 0 };
      }
    });
    return result;
  } catch {
    return {};
  }
}
