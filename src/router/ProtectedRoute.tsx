import { useAuth } from "@src/features/auth/useAuth";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
}
