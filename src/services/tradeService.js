import { supabase } from "../lib/supabase";

const tradeSelect = `
  *,
  profiles (
    full_name,
    email
  )
`;

async function queryTrades(buildQuery) {
  let { data, error, count } = await buildQuery(tradeSelect);

  // Still return trades if the profiles relationship is not configured in Supabase.
  if (error) {
    ({ data, error, count } = await buildQuery("*"));
  }

  if (error) {
    throw new Error(error.message);
  }

  return { data, count };
}

// Keeps the Admin panel's existing response shape: { items, total }.
export async function getTrades(params = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    userId,
    coin,
  } = params;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count } = await queryTrades((select) => {
    let query = supabase
      .from("trade_history")
      .select(select, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status) query = query.eq("status", status);
    if (userId) query = query.eq("user_id", userId);
    if (coin) query = query.ilike("coin", `%${coin}%`);

    return query;
  });

  return {
    items: data || [],
    total: count || 0,
  };
}

export async function getTradeById(id) {
  const { data } = await queryTrades((select) =>
    supabase
      .from("trade_history")
      .select(select)
      .eq("id", id)
      .single()
  );

  return data;
}

export async function getRecentTrades(limit = 50) {
  const { data } = await queryTrades((select) =>
    supabase
      .from("trade_history")
      .select(select)
      .order("created_at", { ascending: false })
      .limit(limit)
  );

  return data || [];
}

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

export async function closeTrade(id) {
  const { data, error } = await supabase
    .from("trade_history")
    .update({ status: "closed" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
