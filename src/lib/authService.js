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
  console.log("========== REGISTER START ==========");

  // STEP 1 - Create Supabase Auth account
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("Signup Data:", data);
  console.log("Signup Error:", error);

  if (error) {
    throw new Error(error.message);
  }

  const user = data?.user;

  if (!user) {
    throw new Error("Supabase did not return a user.");
  }

  // STEP 2 - Generate SafeTradex Account ID
  const accountId = "STX" + String(Date.now()).slice(-7);

  console.log("Creating profile...");

  // STEP 3 - Create Profile
  const {
    data: profileData,
    error: profileError,
  } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        account_id: accountId,
        full_name: fullName,
        email,
        country,
        referral_code: referralCode || null,
        role: "user",
        status: "active",
      },
    ])
    .select();

  console.log("Profile Data:", profileData);
  console.log("Profile Error:", profileError);

  if (profileError) {
    throw new Error(profileError.message);
  }

  console.log("========== REGISTER SUCCESS ==========");

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

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Logout
 */
export async function logoutUser() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Current Session
 */
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return session;
}

/**
 * Current User
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

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

  if (error) {
    throw new Error(error.message);
  }

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

  if (error) {
    throw new Error(error.message);
  }
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

  if (error) {
    throw new Error(error.message);
  }
}
