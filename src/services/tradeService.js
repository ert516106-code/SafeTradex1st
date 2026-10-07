import { supabase } from "../lib/supabase";

// Helper to calculate Exit Price based on Admin Result
function calculateExitPrice(entryPrice, direction, result, payoutPercent) {
  const entry = Number(entryPrice);
  const payout = Number(payoutPercent) / 100; 
  
  // We use a small buffer (0.05%) to ensure the trade is clearly a win/loss
  const buffer = 0.0005; 

  if (result === "win") {
    // WIN: Price must move in favor of the trade
    if (direction === "long") {
      // Long wins when price goes UP
      return entry * (1 + payout + buffer);
    } else {
      // Short wins when price goes DOWN
      return entry * (1 - payout - buffer);
    }
  } 
  else if (result === "lose") {
    // LOSE: Price must move against the trade
    if (direction === "long") {
      // Long loses when price goes DOWN
      return entry * (1 - payout - buffer);
    } else {
      // Short loses when price goes UP
      return entry * (1 + payout + buffer);
    }
  } 
  else {
    // NEUTRAL: Price stays exactly the same (or tiny variation)
    return entry;
  }
}

// Helper to calculate profit/loss mathematically
function calculateProfit(entryPrice, exitPrice, direction, amount) {
  const entry = Number(entryPrice);
  const exit = Number(exitPrice);
  const qty = Number(amount) / entry; // Amount in coins

  if (direction === "long") {
    return (exit - entry) * qty;
  } else {
    return (entry - exit) * qty;
  }
}

export async function createTrade({
  userId,
  coin,
  direction,
  timeframe,
  amount,
  payoutPercent,
  entryPrice,
  adminResult = "neutral", // <--- NEW: Admin inputs "win", "lose", or "neutral"
  balanceBefore,
}) {
  
  // 1. Calculate the Exit Price based on Admin's decision
  const exitPrice = calculateExitPrice(entryPrice, direction, adminResult, payoutPercent);
  
  // 2. Calculate Profit based on the calculated exit price
  const profit = calculateProfit(entryPrice, exitPrice, direction, amount);
  
  // 3. Determine the final result string
  let result = "neutral";
  if (profit > 0) result = "win";
  if (profit < 0) result = "lose";

  // 4. Calculate new balance
  const balanceAfter = Number(balanceBefore) + profit;

  // 5. Save to Supabase
  const { data, error } = await supabase
    .from("trade_history")
    .insert({
      user_id: userId,
      coin,
      direction,
      timeframe,
      amount,
      payout_percent: payoutPercent,
      entry_price: entryPrice,
      exit_price: exitPrice, // Now calculated by Admin logic, not live market
      profit,
      result,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      status: "completed",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getUserTrades(userId) {
  const { data, error } = await supabase
    .from("trade_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

export async function getRecentTrades(limit = 50) {
  const { data, error } = await supabase
    .from("trade_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}
