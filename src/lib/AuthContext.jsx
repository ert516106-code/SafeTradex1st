import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentSession,
  getCurrentUser,
  getProfile,
  logoutUser,
} from "./authService";

import { supabase } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadUser = async () => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);

      const session = await getCurrentSession();

      if (!session) {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        return;
      }

      const currentUser = await getCurrentUser();

      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setIsAuthenticated(false);
        return;
      }

      const currentProfile = await getProfile(currentUser.id);

      setUser(currentUser);
      setProfile(currentProfile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);

      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);

      setAuthError({
        type: "user_not_registered",
        message: error.message,
      });
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await logoutUser();

    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,

        isAuthenticated,
        isLoadingAuth,
        authError,

        refreshProfile: loadUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
