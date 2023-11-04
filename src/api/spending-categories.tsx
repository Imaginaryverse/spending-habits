import { useQuery, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { QUERY_KEY, SpendingCategory } from "@src/types";
import { useDemo } from "@src/features/demo/useDemo";
import { useAuth } from "@src/features/auth/useAuth";

export function useFetchSpendingCategories(
  options?: QueryObserverOptions<SpendingCategory[]>
) {
  const { user } = useAuth();
  const { isDemo, demoCategories } = useDemo();

  async function fetchSpendingCategories(): Promise<SpendingCategory[]> {
    if (isDemo) {
      return demoCategories;
    }

    const { data: categories, error } = await supabase
      .from(QUERY_KEY.spending_categories)
      .select("*");

    if (error) {
      throw error;
    }

    return categories as SpendingCategory[];
  }

  const {
    data: spendingCategories = [],
    isFetching: isFetchingSpendingCategories,
    isLoading: isLoadingSpendingCategories,
  } = useQuery({
    queryKey: QUERY_KEY.spending_categories,
    queryFn: fetchSpendingCategories,
    ...{ ...options, enabled: !!user },
  });

  return {
    spendingCategories,
    isFetchingSpendingCategories,
    isLoadingSpendingCategories,
  };
}
