import { useMemo } from "react";
import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Grid, Stack, Typography } from "@mui/material";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import {
  getMostExpensiveSpendingItem,
  getMostFrequentCategoryData,
} from "./utils/current-month-summary-utils";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { getAmountPerCategory } from "@src/utils/data-utils";
import { useAuth } from "@src/features/auth/useAuth";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";

function selectItemsOfLastSevenDays(spendingItems: SpendingItem[]) {
  const end = dayjs().toDate();
  const start = dayjs(end).subtract(7, "day").toDate();

  const filteredItems = spendingItems.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= start && itemDate <= end;
  });

  return filteredItems;
}

function getDayChartData(items: SpendingItem[]) {
  if (!items.length) {
    return [];
  }

  const today = dayjs().endOf("day");

  const sevenDays = Array.from({ length: 7 }, (_, i) =>
    today.subtract(i, "day").format("YYYY-MM-DD")
  ).reverse();

  const data = sevenDays.map((day) => {
    const itemsOnDay = items.filter((item) =>
      dayjs(item.created_at).isSame(day, "day")
    );

    const totalAmount = sumValueOfObjects(itemsOnDay, "amount");

    return {
      date: day,
      amount: totalAmount,
    };
  });

  return data;
}

export function SevenDaysSummary() {
  const { user } = useAuth();
  const { spendingItems = [], isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
    },
    { enabled: !!user?.id, select: (data) => selectItemsOfLastSevenDays(data) }
  );

  const { spendingCategories } = useFetchSpendingCategories();

  const totalAmount = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  const dayChartData = useMemo(
    () => getDayChartData(spendingItems),
    [spendingItems]
  );

  const categoryChartData = useMemo(
    () => getAmountPerCategory(spendingItems, spendingCategories),
    [spendingItems, spendingCategories]
  );

  const mostExpensiveItem = useMemo(
    () => getMostExpensiveSpendingItem(spendingItems),
    [spendingItems]
  );

  const mostFrequentCategoryData = useMemo(
    () => getMostFrequentCategoryData(spendingItems),
    [spendingItems]
  );

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CalendarMonthOutlinedIcon />
        <Typography variant="h2">Last 7 days</Typography>
      </Stack>

      <Typography>
        Total spent: <b>{formatNumber(totalAmount)} kr</b>
      </Typography>

      <Grid container columnGap={2} rowGap={2}>
        <Grid item xs={12} md={5.85}>
          <Typography variant="h4" mb={3}>
            Per day
          </Typography>

          <BarChart
            data={dayChartData}
            xAxisKey={"date"}
            xAxisFormatter={(date) => dayjs(date).format("ddd")}
            yAxisKey={"amount"}
            yAxisLabelPosition="inside"
            cartesianGrid={{ horizontal: true }}
            showLegend={false}
            height={250}
            loading={isLoadingSpendingItems}
          />
        </Grid>
        <Grid item xs={12} md={5.9}>
          <Typography variant="h4" mb={3}>
            Per category
          </Typography>

          <BarChart
            data={categoryChartData}
            xAxisKey={"name"}
            yAxisKey={"amount"}
            yAxisLabelPosition="inside"
            cartesianGrid={{ horizontal: true }}
            height={250}
            loading={isLoadingSpendingItems}
            showLegend={false}
          />
        </Grid>
      </Grid>

      <Typography variant="h4">Purchases</Typography>

      <SpendingsList spendingItems={spendingItems} dense maxHeight={450} />

      <Typography variant="h4">Most expensive purchase</Typography>

      {!!mostExpensiveItem && (
        <Typography>
          Your most expensive purchase overall (<b>{mostExpensiveItem.title}</b>
          , <b>{formatNumber(mostExpensiveItem.amount)} kr</b>) occurred on{" "}
          <b>{dayjs(mostExpensiveItem.created_at).format("MMMM DD")}</b> in the{" "}
          <b>{mostExpensiveItem.category_name}</b> category.
        </Typography>
      )}

      <Typography variant="h4">Most frequent category</Typography>

      {!!mostFrequentCategoryData && (
        <Typography>
          Most of your spending ({mostFrequentCategoryData.number_of_items}{" "}
          items) has occurred in the{" "}
          <b>{mostFrequentCategoryData.category_name}</b> category with a
          current total of{" "}
          <b>{formatNumber(mostFrequentCategoryData.totalAmount)} kr</b>.
        </Typography>
      )}
    </PaperStack>
  );
}
