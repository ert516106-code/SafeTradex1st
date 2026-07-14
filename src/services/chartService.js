const cache = {};

const CACHE_TIME = 5 * 60 * 1000;

const DAYS = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "1Y": 365,
  ALL: "max",
};

export async function getCoinChart(coinId, period = "1D") {
  const key = `${coinId}-${period}`;
  const now = Date.now();

  if (
    cache[key] &&
    now - cache[key].timestamp < CACHE_TIME
  ) {
    return cache[key].data;
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${DAYS[period]}`
    );

    if (!response.ok) {
      throw new Error("Chart request failed");
    }

    const json = await response.json();

    const points = json.prices.map(([time, price]) => ({
      time,
      price,
    }));

    cache[key] = {
      timestamp: now,
      data: points,
    };

    return points;
  } catch (error) {
    console.error("Chart Service:", error);

    return cache[key]?.data ?? [];
  }
}