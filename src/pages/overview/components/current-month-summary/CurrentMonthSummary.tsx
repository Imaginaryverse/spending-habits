import { useMemo } from "react";
import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Stack, Typography } from "@mui/material";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import {
  generateMonthChartData,
  getMostExpensiveSpendingItem,
  getMostFrequentCategoryData,
  getSpendingItemsInMonth,
} from "./utils/current-month-summary-utils";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { PaperStack } from "@src/components/paper-stack/PaperStack";

type CurrentMonthChartProps = {
  spendingItems: SpendingItem[];
};

export function CurrentMonthSummary({ spendingItems }: CurrentMonthChartProps) {
  const now = dayjs();
  const currentMonth = now.month();
  const monthName = now.format("MMMM");

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

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <CalendarMonthOutlinedIcon />
        <Typography variant="h2">{monthName}</Typography>
      </Stack>

      <Typography>
        Total spent: <b>{formatNumber(totalAmount)} kr</b>
      </Typography>

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
