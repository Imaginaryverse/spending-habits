import { useQuery, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { QUERY_KEY, SpendingCategory } from "@src/types";

async function fetchSpendingCategories(): Promise<SpendingCategory[]> {
  const { data: categories, error } = await supabase
    .from(QUERY_KEY.spending_categories)
    .select("*");

  if (error) {
    throw error;
  }

  return categories as SpendingCategory[];
}

export function useFetchSpendingCategories(
  options?: QueryObserverOptions<SpendingCategory[]>
) {
  const {
    data: spendingCategories = [],
    isFetching: isFetchingSpendingCategories,
    isLoading: isLoadingSpendingCategories,
  } = useQuery({
    queryKey: QUERY_KEY.spending_categories,
    queryFn: fetchSpendingCategories,
    ...options,
  });

  return {
    spendingCategories,
    isFetchingSpendingCategories,
    isLoadingSpendingCategories,
  };
}
