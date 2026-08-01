import { supabase } from "../lib/supabase";

/*
|--------------------------------------------------------------------------
| Wallet Address Service
|--------------------------------------------------------------------------
| Reads deposit wallet addresses directly from Supabase.
| This service is shared by SafeTradeX and the Admin Panel.
|--------------------------------------------------------------------------
*/

export async function getWalletAddress(coin, network) {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .select("*")
    .eq("coin", coin)
    .eq("network", network)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getAllWalletAddresses() {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .select("*")
    .order("coin");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function updateWalletAddress({
  id,
  address,
  memo,
  status,
}) {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .update({
      address,
      memo,
      status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function createWalletAddress({
  coin,
  network,
  address,
  memo = "",
  status = "active",
}) {
  const { data, error } = await supabase
    .from("wallet_addresses")
    .insert({
      coin,
      network,
      address,
      memo,
      status,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteWalletAddress(id) {
  const { error } = await supabase
    .from("wallet_addresses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
