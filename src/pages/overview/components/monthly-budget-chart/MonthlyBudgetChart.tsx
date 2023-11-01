import { useMemo } from "react";
import {
  calcPercentage,
  formatNumber,
  sumValueOfObjects,
} from "@src/utils/number-utils";
import dayjs from "dayjs";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { BarChart } from "@src/components/charts/BarChart";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import { SentimentIcon } from "./SentimentIcon";
import { useAuth } from "@src/features/auth/useAuth";
import { useUserProfile } from "@src/api/user-profiles";
import { useFetchSpendingItems } from "@src/api/spending-items";
import theme from "@src/theme/theme";
import { SpendingItem } from "@src/types";

function selectItemsOfCurrentMonth(spendingItems: SpendingItem[]) {
  const currentMonth = dayjs().format("YYYY-MM");
  const start = dayjs(currentMonth).startOf("month").toDate();
  const end = dayjs(currentMonth).endOf("month").toDate();

  const filteredItems = spendingItems.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= start && itemDate <= end;
  });

  return filteredItems;
}

export function MonthlyBudgetChart() {
  const currentMonth = useMemo(() => dayjs().format("MMMM"), []);
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);
  const { spendingItems = [], isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
    },
    {
      enabled: !!user?.id,
      select: (data) => selectItemsOfCurrentMonth(data),
    }
  );

  const spendingLimit = userProfile?.monthly_spending_limit ?? 0;

  const totalSpent = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
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

  // TODO: Inform that the feature is unavailable if spending limit is not set
  if (isLoadingSpendingItems || !spendingLimit) {
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
        <SavingsOutlinedIcon />
        <Typography variant="h2">{currentMonth} budget</Typography>
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
            loading={isLoadingSpendingItems}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} component={Stack} py={2} px={2} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <SentimentIcon percentage={spendingPercentage} />

          <Typography
            variant="body1"
            color={spendingPercentage > 99 ? "error.light" : "text.primary"}
          >
            You're at <b>{formattedPercentage}%</b>{" "}
            {spendingPercentage > 100 ? "over" : "of"} budget
          </Typography>
        </Stack>
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

  return `hsl(${hue}, 80%, 55%)`;
}
