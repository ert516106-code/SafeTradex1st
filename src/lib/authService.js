import { supabase } from "./supabase";

/**
 * Register a new SafeTradex user
 */
export async function registerUser({
  fullName,
  country,
  email,
  password,
  referralCode,
}) {
  // Create authentication account
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

console.log("Signup result:", data);
console.log("Signup error:", error);

if (error) throw error;

  if (error) throw error;

  const user = data.user;

  if (!user) {
    throw new Error("Unable to create account.");
  }

  // Generate SafeTradex Account ID
  const accountId =
    "STX" +
    String(Date.now()).slice(-7);

  // Create profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      account_id: accountId,
      full_name: fullName,
      email,
      country,
      referral_code: referralCode || null,
      role: "user",
      status: "active",
    });

  if (profileError) {
    throw profileError;
  }

  return data;
}

/**
 * Login
 */
export async function loginUser(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
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
  const { error } =
    await supabase.auth.signOut();

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
  const { data, error } =
    await supabase
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
  const { error } =
    await supabase
      .from("profiles")
      .update({
        last_login: new Date().toISOString(),
        is_online: true,
      })
      .eq("id", userId);

  if (error) throw error;
}

/**
 * Mark Offline
 */
export async function setOffline(userId) {
  const { error } =
    await supabase
      .from("profiles")
      .update({
        is_online: false,
      })
      .eq("id", userId);

  if (error) throw error;
}
