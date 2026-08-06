import { supabase } from "../lib/supabase";

export async function startChat(uid) {
  const { data, error } = await supabase.rpc("start_or_get_guest_chat", { p_uid: uid });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return { chatId: row.chat_id, accessToken: row.access_token };
}

export async function getMessages(chatId, accessToken) {
  const { data, error } = await supabase.rpc("get_guest_messages", {
    p_chat_id: chatId,
    p_access_token: accessToken,
  });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function sendMessage(chatId, accessToken, message) {
  const { error } = await supabase.rpc("send_guest_message", {
    p_chat_id: chatId,
    p_access_token: accessToken,
    p_message: message,
  });
  if (error) throw new Error(error.message);
}

export async function setOffline(chatId, accessToken) {
  try {
    await supabase.rpc("set_guest_chat_offline", { p_chat_id: chatId, p_access_token: accessToken });
  } catch (err) {
    console.warn("Failed to set chat offline:", err);
  }
}
