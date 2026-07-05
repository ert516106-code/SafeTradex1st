import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] =
    useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsLoadingAuth(false);
  }, []);

  const isAuthenticated = !!user;

  const isLoadingPublicSettings = false;
  const authError = null;
  const authChecked = true;

  const login = (userData) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");

    setUser(null);

    window.location.href =
      "/login";
  };

  const navigateToLogin = () => {
    window.location.href =
      "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        authChecked,
        login,
        logout,
        navigateToLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};
