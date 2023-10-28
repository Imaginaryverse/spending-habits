import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@src/api/client";
import { UserProfile } from "@src/types";
import { useFetchUserProfile } from "@src/api/user-profiles";
import { getCurrentUser } from "@src/api/auth";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { userProfile } = useFetchUserProfile(user?.id, {
    enabled: isAuthenticated && !!user?.id,
  });

  async function getSignedInUser() {
    setIsAuthenticating(true);
    const user = await getCurrentUser();
    setUser(user);
    setIsAuthenticated(Boolean(user));

    setIsAuthenticating(false);
  }

  useEffect(() => {
    getSignedInUser();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, isAuthenticated }}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
}
