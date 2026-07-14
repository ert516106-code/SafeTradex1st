const FALLBACK_NEWS = [
  {
    id: 1,
    title: "Bitcoin holds above key support as traders await market direction.",
    source: "SafeTrade News",
    url: "https://www.coingecko.com",
    time: "2 hours ago",
    image:
      "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: 2,
    title: "Ethereum ecosystem continues expanding with new Layer 2 activity.",
    source: "SafeTrade News",
    url: "https://www.coingecko.com",
    time: "5 hours ago",
    image:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: 3,
    title: "Altcoins show mixed performance as Bitcoin dominance increases.",
    source: "SafeTrade News",
    url: "https://www.coingecko.com",
    time: "8 hours ago",
    image:
      "https://assets.coingecko.com/coins/images/325/large/Tether.png",
  },
];

export async function getCryptoNews() {
  try {
    return FALLBACK_NEWS;
  } catch (error) {
    console.error(error);
    return FALLBACK_NEWS;
  }
}