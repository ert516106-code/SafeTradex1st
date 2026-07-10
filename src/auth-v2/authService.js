import { supabase } from "../lib/supabase";

// Register
export async function registerUser({
  email,
  password,
  fullName,
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  return data;
}

// Login
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

// Logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

// Current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}

// Current session
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;

  return session;
}

// Profile
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

// Forgot password
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

// Update password
export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;

  return data;
}
