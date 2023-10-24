import { useAuth } from "@src/features/auth/useAuth";
import { PropsWithChildren } from "react";
import { useLocation, Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/sign-in"
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}
