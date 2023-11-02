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
import BalanceIcon from "@mui/icons-material/Balance";
import { SentimentIcon } from "./SentimentIcon";
import { useAuth } from "@src/features/auth/useAuth";
import { useUserProfile } from "@src/api/user-profiles";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { SpendingItem } from "@src/types";
import { AnimatedNumber } from "@src/components/animated-number/AnimatedNumber";

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

  const remainingBudget = useMemo(
    () => calcRemainingBudget(spendingItems, spendingLimit),
    [spendingItems, spendingLimit]
  );

  const percentageRemaining = useMemo(
    () => calcPercentage(remainingBudget, spendingLimit),
    [remainingBudget, spendingLimit]
  );

  const formattedPercentageRemaining = useMemo(
    () =>
      formatNumber(
        percentageRemaining < 0
          ? percentageRemaining * -1
          : percentageRemaining,
        {
          fractions: 1,
          excludeFractionsOnWholeNumbers: true,
        }
      ),
    [percentageRemaining]
  );

  // TODO: Inform that the feature is unavailable if spending limit is not set
  if (isLoadingSpendingItems || !spendingLimit) {
    return null;
  }

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <BalanceIcon />
        <Typography variant="h2">{currentMonth} budget</Typography>
      </Stack>

      <Grid container gap={2}>
        <Grid item xs={12} md={5.85}>
          <Stack spacing={2}>
            <Typography>
              Budget: <b>{formatNumber(spendingLimit)} kr</b>
            </Typography>

            <Typography>
              Amount spent:{" "}
              <AnimatedNumber
                from={0}
                to={totalSpent}
                fontWeight="bold"
                suffix=" kr"
              />
            </Typography>

            <Typography>
              Remaining:{" "}
              <AnimatedNumber
                from={spendingLimit}
                to={remainingBudget}
                fontWeight="bold"
                suffix=" kr"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5.9}>
          <Stack spacing={1} alignItems="center">
            <Paper
              elevation={0}
              component={Stack}
              width="98%"
              py={1}
              px={2}
              spacing={1}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                color={remainingBudget < 0 ? "error.light" : "text.primary"}
              >
                {formattedPercentageRemaining}%{" "}
                {remainingBudget < 0 ? "over budget" : "remaining"}
              </Typography>
              <SentimentIcon percentage={percentageRemaining} />
            </Paper>

            <BarChart
              data={[{ name: "Remaining", amount: remainingBudget }]}
              xAxisKey="name"
              yAxisKey={"amount"}
              hideYAxis
              orientation="vertical"
              height={80}
              colors={[getBarColor(totalSpent, spendingLimit)]}
              loading={isLoadingSpendingItems}
              dataMax={spendingLimit}
              xAxisInterval="preserveStartEnd"
            />
          </Stack>
        </Grid>
      </Grid>
    </PaperStack>
  );
}

function calcRemainingBudget(data: SpendingItem[], limit: number) {
  const totalAmount = sumValueOfObjects(data, "amount");
  const remainingBudget = limit - totalAmount;

  return remainingBudget;
}

function getBarColor(value: number, limit: number) {
  const percentage = calcPercentage(value, limit);

  const max = 0;
  const min = 120;

  // hue must stay within min and max values
  const hue = Math.min(
    Math.max(min - (percentage / 100) * (min - max), max),
    min
  );

  return `hsl(${hue}, 80%, 55%)`;
}
