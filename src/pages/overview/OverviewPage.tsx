import {
  useCreateSpendingItem,
  useFetchSpendingItems,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { useAuth } from "@src/features/auth/useAuth";
import { SpendingItem } from "@src/types";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { FourtyEightHourSummary } from "./components/fourty-eight-hour-Summary/FourtyEightHoursSummary";
import { ThirtyDaySummary } from "./components/thirty-day-summary/ThirtyDaySummary";
import { CurrentMonthChart } from "@src/components/charts/CurrentMonthChart";
import { Typography } from "@mui/material";

function getThirtyDaysAgoDate(now: Date): Date {
  return dayjs(now).subtract(30, "day").toDate();
}

function getFourtyEightHoursAgoDate(now: Date): Date {
  return dayjs(now).subtract(48, "hour").toDate();
}

function getSpendingItemsInLastFortyEightHours(
  spendingItems: SpendingItem[],
  endOfToday: Date
): SpendingItem[] {
  const fourtyEightHoursAgo = getFourtyEightHoursAgoDate(endOfToday);

  return spendingItems.filter((item) => {
    const createdAt = new Date(item.created_at);

    return createdAt >= fourtyEightHoursAgo && createdAt <= endOfToday;
  });
}

function getSpendingItemsInLastThirtyDays(
  spendingItems: SpendingItem[],
  endOfToday: Date
): SpendingItem[] {
  const thirtyDaysAgo = getThirtyDaysAgoDate(endOfToday);

  return spendingItems.filter((item) => {
    const createdAt = new Date(item.created_at);

    return createdAt >= thirtyDaysAgo && createdAt <= endOfToday;
  });
}

export function OverviewPage() {
  const endOfToday = dayjs().endOf("day").toDate();

  const { user } = useAuth();

  const { spendingItems, isFetchingSpendingItems, refetchSpendingItems } =
    useFetchSpendingItems(
      {
        user_id: user?.id,
      },
      {
        enabled: !!user?.id,
      }
    );

  const { isSpendingItemCreated } = useCreateSpendingItem();
  const { isSpendingItemUpdated } = useUpdateSpendingItem();

  useEffect(() => {
    if (isSpendingItemCreated || isSpendingItemUpdated) {
      refetchSpendingItems();
    }
  }, [isSpendingItemCreated, isSpendingItemUpdated, refetchSpendingItems]);

  const spendingItemsInLastThirtyDays = useMemo(
    () => getSpendingItemsInLastThirtyDays(spendingItems, endOfToday),
    [spendingItems, endOfToday]
  );

  const spendingItemsInLastFortyEightHours = useMemo(
    () => getSpendingItemsInLastFortyEightHours(spendingItems, endOfToday),
    [spendingItems, endOfToday]
  );

  return (
    <>
      <Typography variant="h1" sx={{ alignSelf: "flex-start" }}>
        Overview
      </Typography>

      <CurrentMonthChart spendingItems={spendingItems} />

      <FourtyEightHourSummary
        spendingItems={spendingItemsInLastFortyEightHours}
        isLoading={isFetchingSpendingItems}
      />

      <ThirtyDaySummary
        spendingItems={spendingItemsInLastThirtyDays}
        isLoading={isFetchingSpendingItems}
      />
    </>
  );
}
