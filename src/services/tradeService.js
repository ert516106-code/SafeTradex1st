import { supabase } from "../lib/supabase";

// Calculate a realistic exit price based on the entry, direction, and admin result
function calculateExitPrice(entryPrice, direction, adminResult, payoutPercent) {
  const entry = Number(entryPrice);

  // Tiny, realistic price movement: 0.08%
  // Keeps the exit price very close to the entry (about $67 on BTC at $83k)
  const pct = 0.0008;

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

export async function createTrade({
  userId,
  coin,
  direction,
  timeframe,
  amount,
  payoutPercent,
  entryPrice,
  adminResult = "neutral",
  balanceBefore,
}) {
  // 1. Calculate exit price from entry (deterministic, realistic)
  const exitPrice = calculateExitPrice(entryPrice, direction, adminResult, payoutPercent);

  // 2. Calculate profit based on that exit price
  const entry = Number(entryPrice);
  const qty = Number(amount) / entry;
  let profit;

  if (direction === "long") {
    profit = (exitPrice - entry) * qty;
  } else {
    profit = (entry - exitPrice) * qty;
  }
  profit = +profit.toFixed(2);

  const result = profit > 0 ? "win" : profit < 0 ? "lose" : "neutral";
  const balanceAfter = +(Number(balanceBefore) + profit).toFixed(2);

  const { data, error } = await supabase
    .from("trade_history")
    .insert({
      user_id: userId,
      coin,
      direction,
      timeframe,
      amount,
      payout_percent: payoutPercent,
      entry_price: entry,
      exit_price: exitPrice,
      profit,
      result,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      status: "completed",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getUserTrades(userId) {
  const { data, error } = await supabase
    .from("trade_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getRecentTrades(limit = 50) {
  const { data, error } = await supabase
    .from("trade_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}
