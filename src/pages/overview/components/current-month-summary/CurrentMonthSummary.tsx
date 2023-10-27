import { useMemo } from "react";
import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Collapse, Paper, Stack, Typography } from "@mui/material";
import {
  calcPercentage,
  formatNumber,
  sumValueOfObjects,
} from "@src/utils/number-utils";
import { MonthlyLimitChart } from "@src/pages/overview/components/current-month-summary/MonthlyLimitChart";
import { useAuth } from "@src/features/auth/useAuth";
import {
  generateMonthChartData,
  getMostExpensiveSpendingItem,
  getMostFrequentCategoryData,
  getSpendingItemsInMonth,
} from "./utils/current-month-summary-utils";

type CurrentMonthChartProps = {
  spendingItems: SpendingItem[];
};

export function CurrentMonthSummary({ spendingItems }: CurrentMonthChartProps) {
  const now = dayjs();
  const currentMonth = now.month();
  const monthName = now.format("MMMM");

  const { userProfile } = useAuth();
  const monthlySpendingLimit = userProfile?.monthly_spending_limit ?? 0;

  const spendingItemsInCurrentMonth = useMemo(
    () => getSpendingItemsInMonth(spendingItems, currentMonth),
    [spendingItems, currentMonth]
  );

  const totalAmount = useMemo(
    () => sumValueOfObjects(spendingItemsInCurrentMonth, "amount"),
    [spendingItemsInCurrentMonth]
  );

  const chartData = useMemo(
    () => generateMonthChartData(spendingItemsInCurrentMonth, now.toDate()),
    [spendingItemsInCurrentMonth, now]
  );

  const mostExpensiveItem = useMemo(
    () => getMostExpensiveSpendingItem(spendingItemsInCurrentMonth),
    [spendingItemsInCurrentMonth]
  );

  const mostFrequentCategoryData = useMemo(
    () => getMostFrequentCategoryData(spendingItemsInCurrentMonth),
    [spendingItemsInCurrentMonth]
  );

  const percentageSpentText = useMemo(() => {
    const percentage = calcPercentage(totalAmount, monthlySpendingLimit);

    if (percentage > 100) {
      const percentOver = formatNumber(percentage - 100);
      return `is ${percentOver}% over monthly spending limit (${monthlySpendingLimit} kr)`;
    }

    const formattedPercentage = formatNumber(percentage);
    return `is ${formattedPercentage}% of monthly spending limit (${monthlySpendingLimit} kr)`;
  }, [monthlySpendingLimit, totalAmount]);

  return (
    <Collapse
      in={!!spendingItems.length}
      sx={{
        width: "100%",
        opacity: chartData.length ? 1 : 0,
        transition: "opacity 0.5s ease",
        overflow: "hidden",
      }}
    >
      <Paper sx={{ width: "100%", p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h2">Month of {monthName}</Typography>

          <Stack>
            <Typography>
              Total spent: <b>{formatNumber(totalAmount)} kr</b>
            </Typography>
            <Typography variant="body2">{percentageSpentText}</Typography>
          </Stack>

          <MonthlyLimitChart
            spendingLimit={monthlySpendingLimit}
            totalSpent={totalAmount}
          />

          <Typography variant="h3">Amount per day</Typography>

          <BarChart
            data={chartData}
            xAxisKey={"date"}
            xAxisFormatter={(value) => dayjs(value).format("DD")}
            yAxisKey={"amount"}
            yAxisLabelPosition="inside"
            cartesianGrid={{ horizontal: true }}
            showLegend={false}
          />

          <Typography variant="h3">Most expensive purchase</Typography>

          {!!mostExpensiveItem && (
            <Typography>
              Your most expensive purchase overall (
              <b>{mostExpensiveItem.title}</b>,{" "}
              <b>{formatNumber(mostExpensiveItem.amount)} kr</b>) occurred on{" "}
              <b>{dayjs(mostExpensiveItem.created_at).format("MMMM DD")}</b> in
              the <b>{mostExpensiveItem.category_name}</b> category.
            </Typography>
          )}

          <Typography variant="h3">Most frequent category</Typography>

          <Typography>
            Most of your spending ({mostFrequentCategoryData.number_of_items}{" "}
            items) has occurred in the{" "}
            <b>{mostFrequentCategoryData.category_name}</b> category with a
            current total of{" "}
            <b>{formatNumber(mostFrequentCategoryData.totalAmount)} kr</b>.
          </Typography>
        </Stack>
      </Paper>
    </Collapse>
  );
}
