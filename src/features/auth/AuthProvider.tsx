import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@src/api/client";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  async function getCurrentUser() {
    setIsLoading(true);
    const { data } = await supabase.auth.getUser();
    setUser(data?.user);
    setIsAuthenticated(Boolean(data?.user));
    setIsLoading(false);
  }

  useEffect(() => {
    getCurrentUser();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session?.user);
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
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
