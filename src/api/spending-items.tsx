import {
  useQuery,
  useMutation,
  QueryObserverOptions,
  UseMutationOptions,
} from "react-query";
import { supabase } from "./client";
import { CreateSpendingItem, SpendingItem } from "@src/types";
import { getCurrentUser } from "./auth";

type FetchSpendingItemsParams = {
  user_id?: string;
  category_id?: number;
  fromDate?: Date;
  toDate?: Date;
};

async function fetchSpendingItems(
  params?: Partial<FetchSpendingItemsParams>
): Promise<SpendingItem[]> {
  if (!params?.user_id) {
    throw new Error("User not found");
  }

  const query = supabase
    .from("spending_items")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", params?.user_id);

  if (params?.category_id) {
    query.eq("category_id", params.category_id);
  }

  if (params?.fromDate) {
    query.gte("created_at", params.fromDate.toISOString());
  }

  if (params?.toDate) {
    query.lte("created_at", params.toDate.toISOString());
  }

  const { data: spendingItems, error } = await query;

  if (error) {
    throw error;
  }

  return spendingItems as SpendingItem[];
}

async function fetchSpendingItemById(
  user_id: string | undefined,
  id: string | null
): Promise<SpendingItem> {
  if (!user_id) {
    throw new Error("User not found");
  }

  if (!id) {
    throw new Error("Missing spending item id");
  }

  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .select("*")
    .eq("user_id", user_id)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

async function createSpendingItem(
  spending: CreateSpendingItem
): Promise<SpendingItem> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("spending_categories")
    .select("*");

  if (categoriesError) {
    throw categoriesError;
  }

  const category = categories.find((c) => c.id === spending.category_id);

  if (!category) {
    throw new Error("Category not found");
  }

  const spendingWithCategoryAndUserId = {
    ...spending,
    user_id: user.id,
    category_name: category.name,
  };

  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .insert(spendingWithCategoryAndUserId)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

async function updateSpendingItem(
  spending: Partial<SpendingItem>
): Promise<SpendingItem> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .update(spending)
    .eq("user_id", user.id)
    .eq("id", spending.id)
    .single();

  if (error) {
    throw error;
  }

  return spendingItem as SpendingItem;
}

async function deleteSpendingItem(id: string): Promise<SpendingItem> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: spendingItem, error } = await supabase
    .from("spending_items")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id)
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
    isLoading: isLoadingSpendingItems,
    refetch: refetchSpendingItems,
  } = useQuery({
    queryKey: ["spendingItems", params],
    queryFn: () => fetchSpendingItems(params),
    ...options,
  });

  return {
    spendingItems,
    isFetchingSpendingItems,
    isLoadingSpendingItems,
    refetchSpendingItems,
  };
}

export function useFetchSpendingItemById(
  user_id: string | undefined,
  spendingItemId: string | null,
  options?: QueryObserverOptions<SpendingItem>
) {
  const {
    data: spendingItem,
    isFetching: isFetchingSpendingItem,
    isLoading: isLoadingSpendingItem,
  } = useQuery({
    queryKey: ["spendingItem", user_id, spendingItemId],
    queryFn: () => fetchSpendingItemById(user_id, spendingItemId),
    enabled: !!spendingItemId,
    ...options,
  });

  return {
    spendingItem,
    isFetchingSpendingItem,
    isLoadingSpendingItem,
  };
}

type CustomMutationOptions<T, E, P> = Omit<
  UseMutationOptions<T, E, P>,
  "mutationFn"
>;

export function useCreateSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, CreateSpendingItem>
) {
  const {
    mutateAsync,
    isLoading: isCreatingSpendingItem,
    isSuccess: isSpendingItemCreated,
  } = useMutation(createSpendingItem, options);

  return {
    createSpendingItem: mutateAsync,
    isCreatingSpendingItem,
    isSpendingItemCreated,
  };
}

export function useUpdateSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, Partial<SpendingItem>>
) {
  const {
    mutateAsync,
    isLoading: isUpdatingSpendingItem,
    isSuccess: isSpendingItemUpdated,
  } = useMutation(updateSpendingItem, options);

  return {
    updateSpendingItem: mutateAsync,
    isUpdatingSpendingItem,
    isSpendingItemUpdated,
  };
}

export function useDeleteSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, string>
) {
  const {
    mutateAsync,
    isLoading: isDeletingSpendingItem,
    isSuccess: isSpendingItemDeleted,
  } = useMutation(deleteSpendingItem, options);

  return {
    deleteSpendingItem: mutateAsync,
    isDeletingSpendingItem,
    isSpendingItemDeleted,
  };
}
