import { supabase } from "../lib/supabase";

export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data || []).map((n) => ({
    id: n.id,
    category: n.category,
    type: n.type,
    title: n.title,
    description: n.description,
    message: n.description,
    amount: n.amount,
    status: n.status,
    read: n.read,
    createdAt: n.created_at,
  }));
}

export async function markAsRead(id) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    category: data.category,
    type: data.type,
    title: data.title,
    description: data.description,
    message: data.description,
    amount: data.amount,
    status: data.status,
    read: data.read,
    createdAt: data.created_at,
  };
}

export async function markAllAsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);
  if (error) throw new Error(error.message);

  return getNotifications();
}
