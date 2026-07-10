import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import {
  getCurrentSession,
  getCurrentUser,
  getProfile,
  logoutUser,
} from "./authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const currentSession = await getCurrentSession();

      setSession(currentSession);

      if (!currentSession) {
        setUser(null);
        setProfile(null);
        return;
      }

      const currentUser = await getCurrentUser();

      setUser(currentUser);

      if (currentUser) {
        try {
          const userProfile = await getProfile(currentUser.id);
          setProfile(userProfile);
        } catch (error) {
          console.error("Profile load failed:", error);
          setProfile(null);
        }
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        setUser(session.user);

        try {
          const userProfile = await getProfile(session.user.id);
          setProfile(userProfile);
        } catch {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await logoutUser();

    setUser(null);
    setProfile(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signOut,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
