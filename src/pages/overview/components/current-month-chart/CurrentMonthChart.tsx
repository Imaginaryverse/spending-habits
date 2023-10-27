import { useMemo } from "react";
import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Collapse, Paper, Stack, Typography } from "@mui/material";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import { MonthlyLimitChart } from "@src/pages/overview/components/current-month-chart/MonthlyLimitChart";
import { useAuth } from "@src/features/auth/useAuth";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";

type BarChartDataItem = {
  date: string;
  amount: number;
};

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function generateChartData(items: SpendingItem[]) {
  const daysInMonth = getDaysInMonth(new Date());
  const chartData: BarChartDataItem[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs().date(i).format("YYYY-MM-DD");
    const amount = items.reduce((acc, item) => {
      const itemDate = dayjs(item.created_at).format("YYYY-MM-DD");

      if (itemDate === date) {
        return acc + item.amount;
      }
      return acc;
    }, 0);
    chartData.push({ date, amount });
  }

  return chartData;
}

function getMostFrequentCategoryId(spendingItems: SpendingItem[]) {
  const categoryIds = spendingItems.map((item) => item.category_id);
  const categoryCount = categoryIds.reduce((acc, category) => {
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  );

  const mostFrequentCategoryId = sortedCategories[0]?.[0];
  return mostFrequentCategoryId;
}

type CurrentMonthChartProps = {
  spendingItems: SpendingItem[];
};

export function CurrentMonthChart({ spendingItems }: CurrentMonthChartProps) {
  const { userProfile } = useAuth();
  const { spendingCategories } = useSpendings();

  const timespan = dayjs().format("MMMM");
  const monthlySpendingLimit = userProfile?.monthly_spending_limit ?? 0;
  const chartData = generateChartData(spendingItems);

  const totalAmount = useMemo(
    () => sumValueOfObjects(chartData, "amount"),
    [chartData]
  );

  const mostExpensiveItem = useMemo(() => {
    const sortedItems = spendingItems.sort((a, b) => b.amount - a.amount);
    const mostExpensiveItem = sortedItems[0];
    const category = spendingCategories.find(
      (category) => category.id === mostExpensiveItem?.category_id
    );

    return {
      ...mostExpensiveItem,
      category_name: category?.name ?? "",
    };
  }, [spendingItems, spendingCategories]);

  const mostFrequentCategoryId = useMemo(() => {
    return getMostFrequentCategoryId(spendingItems);
  }, [spendingItems]);

  const mostFrequentCategoryName = useMemo(() => {
    const category = spendingCategories.find(
      (category) => String(category.id) === mostFrequentCategoryId
    );

    return category?.name ?? "";
  }, [mostFrequentCategoryId, spendingCategories]);

  const mostFrequentCategoryAmount = useMemo(() => {
    return spendingItems.reduce((acc, item) => {
      if (String(item.category_id) === mostFrequentCategoryId) {
        return acc + item.amount;
      }
      return acc;
    }, 0);
  }, [mostFrequentCategoryId, spendingItems]);

  const percentageSpentText = useMemo(() => {
    const percentage = monthlySpendingLimit
      ? (totalAmount / monthlySpendingLimit) * 100
      : 0;

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
          <Typography variant="h2">Month of {timespan}</Typography>

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

          <Typography>
            Your most expensive purchase overall (
            <b>{mostExpensiveItem.title}</b>,{" "}
            <b>{formatNumber(mostExpensiveItem.amount)} kr</b>) occurred on{" "}
            <b>{dayjs(mostExpensiveItem.created_at).format("MMMM DD")}</b> in
            the <b>{mostExpensiveItem.category_name}</b> category.
          </Typography>

          <Typography variant="h3">Most frequent category</Typography>

          <Typography>
            The majority of your spending has occurred in the{" "}
            <b>{mostFrequentCategoryName}</b> category with a current total of{" "}
            <b>{formatNumber(mostFrequentCategoryAmount)} kr</b>.
          </Typography>
        </Stack>
      </Paper>
    </Collapse>
  );
}
