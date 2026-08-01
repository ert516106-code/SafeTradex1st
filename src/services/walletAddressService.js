import { supabase } from "../lib/supabase";

/**
 * Get a wallet address for a coin + network.
 * Example:
 * BTC + bitcoin
 * USDT + trc20
 */
export async function getWalletAddress(coin, network) {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .select("*")
    .eq("coin", coin)
    .eq("network", network)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Create or update a wallet address.
 * Used by the Admin Panel.
 */
export async function saveWalletAddress({
  coin,
  network,
  address,
  memo = "",
  enabled = true,
}) {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .upsert(
      {
        coin,
        network,
        address,
        memo,
        enabled,
      },
      {
        onConflict: "coin,network",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Load every configured wallet.
 */
export async function getWalletAddresses() {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .select("*")
    .order("coin");

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Delete a wallet.
 */
export async function deleteWalletAddress(id) {
  const { error } = await supabase
    .from("wallet_addresses")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
