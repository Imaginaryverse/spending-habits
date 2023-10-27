import { PropsWithChildren, createContext } from "react";
import { SpendingCategory, SpendingItem } from "@src/types";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { useAuth } from "../auth/useAuth";

type SpendingsContextType = {
  spendingItems: SpendingItem[];
  isLoadingSpendingItems: boolean;
  refetchSpendingItems: () => void;
  spendingCategories: SpendingCategory[];
  isLoadingSpendingCategories: boolean;
  isLoadingInitialData: boolean;
};

export const SpendingsContext = createContext<SpendingsContextType>({
  spendingItems: [],
  isLoadingSpendingItems: false,
  refetchSpendingItems: () => {},
  spendingCategories: [],
  isLoadingSpendingCategories: false,
  isLoadingInitialData: false,
});

export function SpendingsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  const { spendingItems, isFetchingSpendingItems, refetchSpendingItems } =
    useFetchSpendingItems({ user_id: user?.id }, { enabled: !!user?.id });
  const { spendingCategories, isFetchingSpendingCategories } =
    useFetchSpendingCategories();

  const isLoadingInitialData =
    isFetchingSpendingItems && isFetchingSpendingCategories;

  return (
    <SpendingsContext.Provider
      value={{
        spendingItems,
        isLoadingSpendingItems: isFetchingSpendingItems,
        refetchSpendingItems,
        spendingCategories,
        isLoadingSpendingCategories: isFetchingSpendingCategories,
        isLoadingInitialData,
      }}
    >
      {children}
    </SpendingsContext.Provider>
  );
}
