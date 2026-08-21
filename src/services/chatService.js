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

// Called when the user taps a button on a poll/options message —
// tags the reply as a poll answer so the admin side can highlight it
export async function sendPollAnswer(chatId, accessToken, message) {
  const { error } = await supabase.rpc("send_guest_poll_answer", {
    p_chat_id: chatId,
    p_access_token: accessToken,
    p_message: message,
  });
  if (error) throw new Error(error.message);
}

// ── Images ──

export async function uploadChatImage(file) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("chat-images")
    .upload(path, file);
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from("chat-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function sendImageMessage(chatId, accessToken, imageUrl) {
  const { error } = await supabase.rpc("send_guest_image_message", {
    p_chat_id: chatId,
    p_access_token: accessToken,
    p_image_url: imageUrl,
  });
  if (error) throw new Error(error.message);
}

// Called when the user clicks X or the tab closes — starts the 5-minute countdown
export async function markLeft(chatId, accessToken) {
  try {
    await supabase.rpc("mark_chat_left", { p_chat_id: chatId, p_access_token: accessToken });
  } catch (err) {
    console.warn("Failed to mark chat left:", err);
  }
}

// Called when reopening an existing chat — cancels the countdown if still within 5 minutes
export async function resumeChat(uid) {
  return startChat(uid);
}
