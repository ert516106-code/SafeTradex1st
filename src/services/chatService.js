import { supabase } from "../lib/supabase";

export async function getOrCreateChat(userId, uid) {
  const { data: existing, error: findError } = await supabase
    .from("support_chats")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "open")
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("support_chats")
    .insert({ user_id: userId, uid, user_online: true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function setChatOnlineStatus(chatId, online) {
  const { error } = await supabase
    .from("support_chats")
    .update({ user_online: online })
    .eq("id", chatId);
  if (error) console.error("Failed to update online status:", error.message);
}

export async function getMessages(chatId) {
  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function sendMessage(chatId, userId, message) {
  const { error: msgError } = await supabase
    .from("support_messages")
    .insert({ chat_id: chatId, sender_type: "user", sender_id: userId, message });
  if (msgError) throw new Error(msgError.message);

  await supabase
    .from("support_chats")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", chatId);
}

export function subscribeToChat(chatId, onMessage) {
  const channel = supabase
    .channel(`support-chat-${chatId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "support_messages", filter: `chat_id=eq.${chatId}` },
      (payload) => onMessage(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
