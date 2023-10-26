import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Collapse, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import { MonthlyLimitChart } from "@src/pages/overview/components/current-month-chart/MonthlyLimitChart";
import { useAuth } from "@src/features/auth/useAuth";

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

type CurrentMonthChartProps = {
  spendingItems: SpendingItem[];
};

export function CurrentMonthChart({ spendingItems }: CurrentMonthChartProps) {
  const { userProfile } = useAuth();

  const timespan = dayjs().format("MMMM YYYY");
  const chartData = generateChartData(spendingItems);

  const totalAmount = useMemo(
    () => sumValueOfObjects(chartData, "amount"),
    [chartData]
  );

  const monthlySpendingLimit = userProfile?.monthly_spending_limit ?? 0;

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
      <Stack spacing={2}>
        <Typography variant="h2">{timespan}:</Typography>

        <Stack>
          <Typography>Total spent: {formatNumber(totalAmount)} kr</Typography>
          <Typography variant="caption">{percentageSpentText}</Typography>
        </Stack>

        <MonthlyLimitChart
          spendingLimit={monthlySpendingLimit}
          totalSpent={totalAmount}
        />

        <BarChart
          data={chartData}
          xAxisKey={"date"}
          xAxisFormatter={(value) => dayjs(value).format("DD")}
          yAxisKey={"amount"}
          yAxisLabelPosition="inside"
          cartesianGrid={{ horizontal: true }}
          showLegend={false}
        />
      </Stack>
    </Collapse>
  );
}
