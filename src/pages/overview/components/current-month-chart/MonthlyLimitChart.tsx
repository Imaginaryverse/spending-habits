import { BarChart } from "../../../../components/charts/BarChart";
import { calcPercentage } from "@src/utils/number-utils";
import theme from "@src/theme/theme";

type MonthlyLimitChartProps = {
  spendingLimit: number;
  totalSpent: number;
};

export function MonthlyLimitChart({
  spendingLimit,
  totalSpent,
}: MonthlyLimitChartProps) {
  const chartData = [
    {
      name: "Spent",
      amount: totalSpent,
    },
    {
      name: "Limit",
      amount: spendingLimit,
    },
  ];

  return (
    <BarChart
      data={chartData}
      xAxisKey={"name"}
      yAxisKey={"amount"}
      hideYAxis
      orientation="vertical"
      height={100}
      legendKey="name"
      legendIconType="rect"
      colors={[
        getSpentBarColor(totalSpent, spendingLimit),
        theme.palette.primary.main,
      ]}
    />
  );
}

function getSpentBarColor(value: number, limit: number) {
  const percentage = calcPercentage(value, limit);

  const max = 0;
  const min = 200;

  // hue must stay within min and max values
  const hue = Math.min(
    Math.max(min - (percentage / 100) * (min - max), max),
    min
  );

  return `hsl(${hue}, 85%, 50%)`;
}
