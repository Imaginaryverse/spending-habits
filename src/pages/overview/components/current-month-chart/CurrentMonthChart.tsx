import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { BarChart } from "../../../../components/charts/BarChart";
import { Collapse, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";

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
  const timespan = dayjs().format("MMMM, YYYY");
  const chartData = generateChartData(spendingItems);

  const totalAmount = useMemo(
    () => sumValueOfObjects(chartData, "amount"),
    [chartData]
  );

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
        <Typography>Total spent: {formatNumber(totalAmount)} kr</Typography>

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
