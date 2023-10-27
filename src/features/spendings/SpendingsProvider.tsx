import { PropsWithChildren, createContext } from "react";
import { SpendingCategory, SpendingItem } from "@src/types";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { useAuth } from "../auth/useAuth";
import { useFetchSpendingCategories } from "@src/api/spending-categories";

type SpendingsContextType = {
  spendingItems: SpendingItem[];
  isLoadingSpendingItems: boolean;
  refetchSpendingItems: () => void;
  spendingCategories: SpendingCategory[];
  isLoadingSpendingCategories: boolean;
};

export const SpendingsContext = createContext<SpendingsContextType>({
  spendingItems: [],
  isLoadingSpendingItems: false,
  refetchSpendingItems: () => {},
  spendingCategories: [],
  isLoadingSpendingCategories: false,
});

export function SpendingsProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const { spendingItems, isFetchingSpendingItems, refetchSpendingItems } =
    useFetchSpendingItems({ user_id: user?.id }, { enabled: !!user?.id });
  const { spendingCategories, isFetchingSpendingCategories } =
    useFetchSpendingCategories();

  return (
    <SpendingsContext.Provider
      value={{
        spendingItems,
        isLoadingSpendingItems: isFetchingSpendingItems,
        refetchSpendingItems,
        spendingCategories,
        isLoadingSpendingCategories: isFetchingSpendingCategories,
      }}
    >
      {children}
    </SpendingsContext.Provider>
  );
}
