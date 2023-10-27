import { useAuth } from "@src/features/auth/useAuth";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";
import dayjs from "dayjs";
import { getSpendingItemsInMonth } from "../current-month-summary/utils/current-month-summary-utils";
import { useMemo } from "react";
import {
  calcPercentage,
  formatNumber,
  sumValueOfObjects,
} from "@src/utils/number-utils";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import theme from "@src/theme/theme";
import { BarChart } from "@src/components/charts/BarChart";
import { PaperStack } from "@src/components/paper-stack/PaperStack";

export function MonthlySpendingLimitChart() {
  const now = dayjs();
  const currentMonth = now.month();

  const { userProfile } = useAuth();
  const spendingLimit = userProfile?.monthly_spending_limit ?? 0;

  const { spendingItems } = useSpendings();
  const spendingItemsInCurrentMonth = useMemo(
    () => getSpendingItemsInMonth(spendingItems, currentMonth),
    [spendingItems, currentMonth]
  );

  const totalSpent = useMemo(
    () => sumValueOfObjects(spendingItemsInCurrentMonth, "amount"),
    [spendingItemsInCurrentMonth]
  );

  const spendingPercentage = useMemo(
    () => calcPercentage(totalSpent, spendingLimit),
    [totalSpent, spendingLimit]
  );

  const formattedPercentage = useMemo(
    () =>
      formatNumber(
        spendingPercentage > 100 ? spendingPercentage - 100 : spendingPercentage
      ),
    [spendingPercentage]
  );

  if (!spendingLimit) {
    return null;
  }

  const chartData = [
    {
      name: "Spent",
      amount: totalSpent,
    },
    {
      name: "Budget",
      amount: spendingLimit,
    },
  ];

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <StraightenOutlinedIcon />
        <Typography variant="h2">Monthly budget</Typography>
      </Stack>

      <Grid container gap={2}>
        <Grid item xs={12} md={3.25}>
          <Stack spacing={2}>
            <Typography>
              Total spent: <b>{formatNumber(totalSpent)} kr</b>
            </Typography>

            <Typography>
              Budget: <b>{formatNumber(spendingLimit)} kr</b>
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8.5}>
          <BarChart
            data={chartData}
            xAxisKey="name"
            yAxisKey={"amount"}
            hideYAxis
            orientation="vertical"
            height={100}
            showLegend={false}
            colors={[
              getSpentBarColor(totalSpent, spendingLimit),
              theme.palette.primary.main,
            ]}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} component={Stack} py={1} px={2} textAlign="center">
        <Typography
          variant="h5"
          color={spendingPercentage > 100 ? "error.light" : "text.primary"}
        >
          Currently at <b>{formattedPercentage}%</b>{" "}
          {spendingPercentage > 100 ? "over" : "of"} budget
        </Typography>
      </Paper>
    </PaperStack>
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

  return `hsl(${hue}, 65%, 55%)`;
}
