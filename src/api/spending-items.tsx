import { useQuery, useMutation, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { CreateSpendingItem, SpendingItem } from "@src/types";

async function fetchSpendingItems(
  user_id?: string,
  category_id?: string
): Promise<SpendingItem[]> {
  if (!user_id) {
    throw new Error("user_id is required");
  }

  if (typeof category_id === "string") {
    const { data: spendingItems, error } = await supabase
      .from("spending_items")
      .select("*")
      .eq("user_id", user_id)
      .eq("category_id", category_id);

    if (error) {
      throw error;
    }

    return spendingItems as SpendingItem[];
  }

  const { data: spendingItems, error } = await supabase
    .from("spending_items")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }

  return spendingItems as SpendingItem[];
}

async function createSpendingItem(
  spending: CreateSpendingItem
): Promise<SpendingItem> {
  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .insert(spending)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

export function useFetchSpendingItems(
  user_id?: string,
  category_id?: string,
  options?: QueryObserverOptions<SpendingItem[]>
) {
  const {
    data: spendingItems = [],
    isFetching: isFetchingSpendingItems,
    refetch: refetchSpendingItems,
  } = useQuery({
    queryKey: ["spendingItems", user_id, category_id],
    queryFn: () => fetchSpendingItems(user_id, category_id),
    ...options,
  });

  return {
    spendingItems,
    isFetchingSpendingItems,
    refetchSpendingItems,
  };
}

export function useCreateSpendingItem() {
  const {
    mutateAsync,
    isLoading: isCreatingSpendingItem,
    isSuccess: isSpendingItemCreated,
  } = useMutation(createSpendingItem);

  return {
    createSpendingItem: mutateAsync,
    isCreatingSpendingItem,
    isSpendingItemCreated,
  };
}
