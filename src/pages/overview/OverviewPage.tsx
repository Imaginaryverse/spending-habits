import { Stack, Typography } from "@mui/material";
import {
  useCreateSpendingItem,
  useFetchSpendingItems,
} from "@src/api/spending-items";
import { CreateSpendingForm } from "@src/components/create-spending-form/CreateSpendingForm";
import { useAuth } from "@src/features/auth/useAuth";
import { CreateSpendingItem } from "@src/types";
import { calcSevenDaysAmount } from "@src/utils/number-utils";
import { useEffect, useMemo } from "react";

export function OverviewPage() {
  const { user } = useAuth();

  const { createSpendingItem, isCreatingSpendingItem, isSpendingItemCreated } =
    useCreateSpendingItem();
  const { spendingItems, isFetchingSpendingItems, refetchSpendingItems } =
    useFetchSpendingItems(user?.id, undefined, {
      enabled: !!user?.id,
    });

  function handleCreateSpendingItem(item: CreateSpendingItem) {
    createSpendingItem(item);
  }

  useEffect(() => {
    if (isSpendingItemCreated) {
      refetchSpendingItems();
    }
  }, [isSpendingItemCreated, refetchSpendingItems]);

  const sevenDaysAmount = useMemo(
    () => calcSevenDaysAmount(spendingItems),
    [spendingItems]
  );

  return (
    <Stack flex={1} spacing={2}>
      <Typography variant="h1">Overview</Typography>

      <CreateSpendingForm
        onSubmit={handleCreateSpendingItem}
        isCreatingSpendingItem={isCreatingSpendingItem}
        isSpendingItemCreated={isSpendingItemCreated}
      />

      <Typography variant="h2">Spending Items</Typography>
      {isFetchingSpendingItems ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Stack spacing={2}>
          {spendingItems.map((item) => (
            <Typography key={item.id} variant="body1">
              {item.title} - {item.amount} kr
            </Typography>
          ))}
        </Stack>
      )}

      <Typography variant="h2">Last 7 Days</Typography>
      <Typography variant="body1">{sevenDaysAmount} kr</Typography>
    </Stack>
  );
}
