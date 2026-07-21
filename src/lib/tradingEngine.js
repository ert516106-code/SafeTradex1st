// ========================================
// SafeTrade V2 Trading Engine
// Version 2.0
// ========================================

export const TRADE_PERIODS = [
  { id: 1, seconds: 60, label: "1m", profit: 30 },
  { id: 2, seconds: 120, label: "2m", profit: 45 },
  { id: 3, seconds: 180, label: "3m", profit: 75 },
  { id: 5, seconds: 300, label: "5m", profit: 100 },
];

export const PAYOUT_RATIO = {
  "1m": 0.3,
  "2m": 0.45,
  "3m": 0.75,
  "5m": 1.0,
};

// ========================================
// Calculations
// ========================================

export function calculateFee(amount = 0) {
  return Number((Number(amount) * 0.005).toFixed(2));
}

export function calculateProfit(amount = 0, percent = 0) {
  return Number((Number(amount) * (Number(percent) / 100)).toFixed(2));
}

export function calculateTotal(amount = 0) {
  return Number((Number(amount) + calculateFee(amount)).toFixed(2));
}

// ========================================
// Formatting
// ========================================

export function formatPrice(price = 0) {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

// ========================================
// Random Helpers
// ========================================

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomDirection() {
  return Math.random() > 0.5 ? 1 : -1;
}

// ========================================
// Simulated Market Movement
// ========================================

export function generatePricePath({
  startPrice = 0,
  seconds = 60,
  direction = "up",
}) {
  const prices = [];

  let current = Number(startPrice);

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

// ========================================
// Live Price Helpers
// ========================================

export function nextPrice(price = 0) {
  const movement = randomBetween(-0.18, 0.18);
  return Number((Number(price) + movement).toFixed(2));
}

// Alias for compatibility
export function generateNextPrice(price = 0) {
  return nextPrice(price);
}

// ========================================
// Trade Resolution
// ========================================

export function resolveTrade({
  side,
  amount = 0,
  entryPrice = 0,
  exitPrice = 0,
  payout = 0,
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

// ========================================
// Countdown Helper
// ========================================

export function countdown(seconds = 0, callback) {
  let remaining = seconds;

  const timer = setInterval(() => {
    remaining--;

    if (typeof callback === "function") {
      callback(remaining);
    }

    if (remaining <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  return timer;
}
