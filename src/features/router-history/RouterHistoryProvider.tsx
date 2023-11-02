import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { uniqueArray } from "@src/utils/array-utils";

type RouterHistoryContextProps = {
  history: string[];
  hasVisitedBefore: (currentRoute: string) => boolean;
};

export const RouterHistoryContext = createContext<RouterHistoryContextProps>({
  history: [],
  hasVisitedBefore: () => false,
});

type RouterHistoryProviderProps = PropsWithChildren<{
  /**
   * If true, the history array will contain duplicate routes. Defaults to false.
   * Note that if enabled, this will cause the history array to grow in size and may cause unwanted re-renders.
   */
  keepDuplicateRoutes?: boolean;
}>;

export function RouterHistoryProvider({
  children,
  keepDuplicateRoutes = false,
}: RouterHistoryProviderProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [history, setHistory] = useState<string[]>([]);

  const hasVisitedBefore = (currentRoute: string) => {
    return history.length > 1 && history.includes(currentRoute);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (keepDuplicateRoutes) {
      setHistory((prev) => [...prev, location.pathname]);
    } else {
      setHistory((prev) => uniqueArray([...prev, location.pathname]));
    }
  }, [location.pathname, isAuthenticated, keepDuplicateRoutes]);

  useEffect(() => {
    if (!isAuthenticated) {
      setHistory([]);
    }
  }, [isAuthenticated]);

  return (
    <RouterHistoryContext.Provider value={{ history, hasVisitedBefore }}>
      {children}
    </RouterHistoryContext.Provider>
  );
}
