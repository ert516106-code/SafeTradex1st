import { supabase } from "../lib/supabase";
export async function createTrade({
  userId,
  coin,
  direction,
  timeframe,
  amount,
  payoutPercent,
  entryPrice,
  exitPrice,
  profit,
  result,
  balanceBefore,
  balanceAfter,
}) {
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
      exit_price: exitPrice,
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
