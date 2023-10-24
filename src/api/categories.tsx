import { useQuery, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { SpendingCategory } from "@src/types";

async function fetchCategories(): Promise<SpendingCategory[]> {
  const { data: categories, error } = await supabase
    .from("spending_categories")
    .select("*");

  if (error) {
    throw error;
  }

  return categories as SpendingCategory[];
}

export function useFetchCategories(
  options?: QueryObserverOptions<SpendingCategory[]>
) {
  const { data: categories = [], isFetching: isFetchingCategories } = useQuery({
    queryKey: "spending_categories",
    queryFn: fetchCategories,
    ...options,
  });

  return {
    categories,
    isFetchingCategories,
  };
}
