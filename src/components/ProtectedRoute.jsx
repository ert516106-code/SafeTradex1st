import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import UserNotRegisteredError from "./UserNotRegisteredError";

const DefaultFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}
  >
    Loading...
  </div>
);

export default function ProtectedRoute({
  fallback = <DefaultFallback />,
  unauthenticatedElement
}) {
  const {
    isAuthenticated,
    isLoadingAuth,
    authError
  } = useAuth();

  if (isLoadingAuth) {
    return fallback;
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    return (
      unauthenticatedElement ||
      <Navigate to="/login" replace />
    );
  }

  if (!isAuthenticated) {
    return (
      unauthenticatedElement ||
      <Navigate to="/login" replace />
    );
  }

  return <Outlet />;
}
