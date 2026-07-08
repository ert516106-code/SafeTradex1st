import { supabase } from "./supabase";

/**
 * Register a new user
 */
export async function registerUser({
  email,
  password,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

/**
 * Login
 */
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

/**
 * Logout
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

/**
 * Current Session
 */
export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

/**
 * Current User
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Load Profile
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Update Last Login
 */
export async function updateLastLogin(userId) {
  await supabase
    .from("profiles")
    .update({
      last_login: new Date().toISOString(),
      is_online: true,
    })
    .eq("id", userId);
}

/**
 * User Offline
 */
export async function setOffline(userId) {
  await supabase
    .from("profiles")
    .update({
      is_online: false,
    })
    .eq("id", userId);
}
