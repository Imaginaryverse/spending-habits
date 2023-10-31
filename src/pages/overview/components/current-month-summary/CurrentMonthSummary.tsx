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
import { getMonthChartData, getTotalPerCategory } from "@src/utils/data-utils";

type CurrentMonthChartProps = {
  spendingItems: SpendingItem[];
  isLoading: boolean;
};

export function CurrentMonthSummary({
  spendingItems,
  isLoading,
}: CurrentMonthChartProps) {
  const now = dayjs();
  const monthName = now.format("MMMM");

  const { spendingCategories } = useFetchSpendingCategories();

  const totalAmount = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  const dayChartData = useMemo(
    () => getMonthChartData(spendingItems, now.format("YYYY-MM")),
    [spendingItems, now]
  );

  const categoryChartData = useMemo(
    () => getTotalPerCategory(spendingItems, spendingCategories),
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
        <Typography variant="h2">{monthName}</Typography>
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
            yAxisKey={"amount"}
            yAxisLabelPosition="inside"
            cartesianGrid={{ horizontal: true }}
            showLegend={false}
            height={250}
            loading={isLoading}
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
            height={250}
            loading={isLoading}
            showLegend={false}
          />
        </Grid>
      </Grid>

      <Typography variant="h3">Most expensive purchase</Typography>

      {!!mostExpensiveItem && (
        <Typography>
          Your most expensive purchase overall (<b>{mostExpensiveItem.title}</b>
          , <b>{formatNumber(mostExpensiveItem.amount)} kr</b>) occurred on{" "}
          <b>{dayjs(mostExpensiveItem.created_at).format("MMMM DD")}</b> in the{" "}
          <b>{mostExpensiveItem.category_name}</b> category.
        </Typography>
      )}

      <Typography variant="h3">Most frequent category</Typography>

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
