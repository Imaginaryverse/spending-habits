import { useQuery, useMutation, QueryObserverOptions } from "react-query";
import { supabase } from "./client";
import { CreateSpendingItem, SpendingItem } from "@src/types";

type FetchSpendingItemsParams = {
  user_id?: string;
  category_id?: number;
  fromDate?: Date;
  toDate?: Date;
};

async function fetchSpendingItems(
  params?: Partial<FetchSpendingItemsParams>
): Promise<SpendingItem[]> {
  if (!params || !params.user_id) {
    throw new Error("user_id is required");
  }

  const query = supabase
    .from("spending_items")
    .select("*")
    .eq("user_id", params.user_id);

  if (params.category_id) {
    query.eq("category_id", params.category_id);
  }

  if (params.fromDate) {
    query.gte("created_at", params.fromDate.toISOString());
  }

  if (params.toDate) {
    query.lte("created_at", params.toDate.toISOString());
  }

  const { data: spendingItems, error } = await query;

  if (error) {
    throw error;
  }

  const sortedByCreatedAt = sortByDate(spendingItems, "created_at", "desc");

  return sortedByCreatedAt as SpendingItem[];
}

async function fetchSpendingItemById(id: string | null): Promise<SpendingItem> {
  if (!id) {
    throw new Error("id is required");
  }

  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

function sortByDate<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T,
  sortOrder: "asc" | "desc"
): T[] {
  const sorted = items.sort((a, b) => {
    if (isDateString(a[key]) && isDateString(b[key])) {
      if (a[key] < b[key]) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (a[key] > b[key]) {
        return sortOrder === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    }

    return 0;
  });

  return sorted;
}

function isDateString(date: unknown): date is string {
  return typeof date === "string";
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

async function updateSpendingItem(
  spending: Partial<SpendingItem>
): Promise<SpendingItem> {
  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .update(spending)
    .eq("id", spending.id)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

export function useFetchSpendingItems(
  params?: Partial<FetchSpendingItemsParams>,
  options?: QueryObserverOptions<SpendingItem[]>
) {
  const {
    data: spendingItems = [],
    isFetching: isFetchingSpendingItems,
    refetch: refetchSpendingItems,
  } = useQuery({
    queryKey: ["spendingItems", params],
    queryFn: () => fetchSpendingItems(params),
    ...options,
  });

  return {
    spendingItems,
    isFetchingSpendingItems,
    refetchSpendingItems,
  };
}

export function useFetchSpendingItemById(
  spendingItemId: string | null,
  options?: QueryObserverOptions<SpendingItem>
) {
  const { data: spendingItem, isFetching: isFetchingSpendingItem } = useQuery({
    queryKey: ["spendingItem", spendingItemId],
    queryFn: () => fetchSpendingItemById(spendingItemId),
    enabled: !!spendingItemId,
    ...options,
  });

  return {
    spendingItem,
    isFetchingSpendingItem,
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

export function useUpdateSpendingItem() {
  const {
    mutateAsync,
    isLoading: isUpdatingSpendingItem,
    isSuccess: isSpendingItemUpdated,
  } = useMutation(updateSpendingItem);

  return {
    updateSpendingItem: mutateAsync,
    isUpdatingSpendingItem,
    isSpendingItemUpdated,
  };
}
