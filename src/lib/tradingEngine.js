// ========================================
// SafeTrade V2 Trading Engine
// Version 1.0
// ========================================

export const TRADE_PERIODS = [
  { id: 1, seconds: 60, label: "1m", profit: 30 },
  { id: 2, seconds: 120, label: "2m", profit: 45 },
  { id: 3, seconds: 180, label: "3m", profit: 75 },
  { id: 5, seconds: 300, label: "5m", profit: 100 },
];

export function calculateFee(amount) {
  return Number((amount * 0.005).toFixed(2));
}

export function calculateProfit(amount, percent) {
  return Number((amount * (percent / 100)).toFixed(2));
}

export function calculateTotal(amount) {
  return Number((amount + calculateFee(amount)).toFixed(2));
}

export function formatPrice(price) {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomDirection() {
  return Math.random() > 0.5 ? 1 : -1;
}

/*
|--------------------------------------------------------------------------
| Simulated Market Movement
|--------------------------------------------------------------------------
|
| Creates a realistic moving price without using a live exchange.
|
*/

export function generatePricePath({
  startPrice,
  seconds,
  direction,
}) {
  const prices = [];

  let current = startPrice;

  for (let i = 0; i < seconds; i++) {
    const noise = randomBetween(0.05, 0.35);

    const drift =
      direction === "up"
        ? randomBetween(0.01, 0.08)
        : -randomBetween(0.01, 0.08);

    current += current * ((noise * randomDirection() + drift) / 100);

    prices.push(Number(current.toFixed(2)));
  }

  return prices;
}

/*
|--------------------------------------------------------------------------
| Trade Result
|--------------------------------------------------------------------------
*/

export function resolveTrade({
  side,
  amount,
  entryPrice,
  exitPrice,
  payout,
}) {
  const isWin =
    side === "BUY"
      ? exitPrice > entryPrice
      : exitPrice < entryPrice;

  const fee = calculateFee(amount);

  return {
    win: isWin,

    fee,

    payout,

    profit: isWin
      ? calculateProfit(amount, payout)
      : -amount,

    finalBalanceChange: isWin
      ? calculateProfit(amount, payout)
      : -amount,

    entryPrice,

    exitPrice,
  };
}

/*
|--------------------------------------------------------------------------
| Fake Live Price
|--------------------------------------------------------------------------
*/

export function nextPrice(price) {
  const movement = randomBetween(-0.18, 0.18);

  return Number((price + movement).toFixed(2));
}

export function countdown(seconds, callback) {
  let remaining = seconds;

  const timer = setInterval(() => {
    remaining--;

    callback(remaining);

    if (remaining <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  return timer;
}
