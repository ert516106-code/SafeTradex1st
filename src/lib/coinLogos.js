export const COIN_LOGOS = {
  BTC:   'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH:   'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL:   'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  BNB:   'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  XRP:   'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  LTC:   'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  DOGE:  'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  TRX:   'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png',
  ADA:   'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  USDT:  'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  USDC:  'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  AVAX:  'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  DOT:   'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  LINK:  'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  UNI:   'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  ATOM:  'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
  XLM:   'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
  ETC:   'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png',
  FIL:   'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
  NEAR:  'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
  APT:   'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
};

const FALLBACK_COLORS = {
  BTC: 'bg-orange-500', ETH: 'bg-indigo-500', SOL: 'bg-purple-500',
  BNB: 'bg-yellow-500', XRP: 'bg-blue-500',   LTC: 'bg-slate-400',
  DOGE: 'bg-yellow-400', TRX: 'bg-red-500',   ADA: 'bg-blue-600',
  USDT: 'bg-emerald-500', USDC: 'bg-blue-400', AVAX: 'bg-red-500',
  DOT: 'bg-pink-500', MATIC: 'bg-purple-600',  LINK: 'bg-blue-500',
  UNI: 'bg-pink-400', ATOM: 'bg-violet-500',   XLM: 'bg-slate-600',
  ETC: 'bg-green-600', FIL: 'bg-blue-700',     NEAR: 'bg-slate-800',
  APT: 'bg-teal-500',
};

export function getFallbackColor(symbol) {
  return FALLBACK_COLORS[symbol] || 'bg-slate-500';
}
