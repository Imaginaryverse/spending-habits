import { useQuery, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { SpendingCategory } from "@src/types";

async function fetchSpendingCategories(): Promise<SpendingCategory[]> {
  const { data: categories, error } = await supabase
    .from("spending_categories")
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
  } = useQuery({
    queryKey: "spending_categories",
    queryFn: fetchSpendingCategories,
    ...options,
  });

  return {
    spendingCategories,
    isFetchingSpendingCategories,
  };
}
