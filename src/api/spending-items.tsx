import {
  useQuery,
  useMutation,
  QueryObserverOptions,
  UseMutationOptions,
} from "react-query";
import { supabase } from "./client";
import { CreateSpendingItem, QUERY_KEY, SpendingItem } from "@src/types";
import { getCurrentUser } from "./auth";
import { useDemo } from "@src/features/demo/useDemo";
import { useAuth } from "@src/features/auth/useAuth";

type FetchSpendingItemsParams = {
  user_id?: string;
  item_id?: string;
  category_id?: number;
  fromDate?: Date;
  toDate?: Date;
};

type CustomMutationOptions<T, E, P> = Omit<
  UseMutationOptions<T, E, P>,
  "mutationFn"
>;

async function fetchSpendingItems(
  params?: Partial<FetchSpendingItemsParams>
): Promise<SpendingItem[]> {
  if (!params?.user_id) {
    throw new Error("User not found");
  }

  const query = supabase
    .from(QUERY_KEY.spending_items)
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

async function createSpendingItem(
  spending: CreateSpendingItem
): Promise<SpendingItem> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: spendingItem, error } = await supabase
    .from(QUERY_KEY.spending_items)
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
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data: spendingItem, error } = await supabase
    .from(QUERY_KEY.spending_items)
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
    .from(QUERY_KEY.spending_items)
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
  const { isDemo, demoData } = useDemo();

  async function fetchDemoData(params?: Partial<FetchSpendingItemsParams>) {
    if (!params?.user_id) {
      throw new Error("User not found");
    }

    const filteredData = demoData.filter(
      (item) => item.user_id === params.user_id
    );

    if (params?.category_id) {
      return filteredData.filter(
        (item) => item.category_id === params.category_id
      );
    }

    if (params?.fromDate && params?.toDate) {
      return filteredData.filter(
        (item) =>
          new Date(item.created_at) >= params.fromDate! &&
          new Date(item.created_at) <= params.toDate!
      );
    }

    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sortedData;
  }

  const {
    data: spendingItems = [],
    isFetching: isFetchingSpendingItems,
    isLoading: isLoadingSpendingItems,
    refetch: refetchSpendingItems,
  } = useQuery({
    queryKey: [QUERY_KEY.spending_items, params, demoData],
    queryFn: isDemo
      ? () => fetchDemoData(params)
      : () => fetchSpendingItems(params),
    ...options,
  });

  return {
    spendingItems,
    isFetchingSpendingItems,
    isLoadingSpendingItems,
    refetchSpendingItems,
  };
}

export function useCreateSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, CreateSpendingItem>
) {
  const { user } = useAuth();
  const { isDemo, setDemoData } = useDemo();

  async function createDemoSpendingItem(
    spending: CreateSpendingItem
  ): Promise<SpendingItem> {
    if (!user) {
      throw new Error("User not found");
    }

    const spendingItem: SpendingItem = {
      ...spending,
      id: crypto.randomUUID(),
      user_id: user.id,
    };

    setDemoData((prev) => [...prev, spendingItem]);
    return spendingItem;
  }

  const {
    mutateAsync,
    isLoading: isCreatingSpendingItem,
    isSuccess: isSpendingItemCreated,
  } = useMutation(isDemo ? createDemoSpendingItem : createSpendingItem, {
    ...options,
  });

  return {
    createSpendingItem: mutateAsync,
    isCreatingSpendingItem,
    isSpendingItemCreated,
  };
}

export function useUpdateSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, Partial<SpendingItem>>
) {
  const { user } = useAuth();
  const { isDemo, setDemoData } = useDemo();

  async function updateDemoSpendingItem(
    spending: Partial<SpendingItem>
  ): Promise<SpendingItem> {
    if (!user) {
      throw new Error("User not found");
    }

    const spendingItem = spending as SpendingItem;
    setDemoData((prev) => {
      const index = prev.findIndex((item) => item.id === spendingItem.id);
      prev[index] = spendingItem;
      return prev;
    });
    return spendingItem;
  }

  const {
    mutateAsync,
    isLoading: isUpdatingSpendingItem,
    isSuccess: isSpendingItemUpdated,
  } = useMutation(isDemo ? updateDemoSpendingItem : updateSpendingItem, {
    ...options,
  });

  return {
    updateSpendingItem: mutateAsync,
    isUpdatingSpendingItem,
    isSpendingItemUpdated,
  };
}

export function useDeleteSpendingItem(
  options?: CustomMutationOptions<SpendingItem, unknown, string>
) {
  const { user } = useAuth();
  const { isDemo, setDemoData } = useDemo();

  async function deleteDemoSpendingItem(id: string): Promise<SpendingItem> {
    if (!user) {
      throw new Error("User not found");
    }

    setDemoData((prev) => prev.filter((item) => item.id !== id));
    return {} as SpendingItem;
  }

  const {
    mutateAsync,
    isLoading: isDeletingSpendingItem,
    isSuccess: isSpendingItemDeleted,
  } = useMutation(isDemo ? deleteDemoSpendingItem : deleteSpendingItem, {
    ...options,
  });

  return {
    deleteSpendingItem: mutateAsync,
    isDeletingSpendingItem,
    isSpendingItemDeleted,
  };
}
