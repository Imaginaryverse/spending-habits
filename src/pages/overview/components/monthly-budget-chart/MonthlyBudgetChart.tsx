import { useMemo } from "react";
import {
  calcPercentage,
  formatNumber,
  sumValueOfObjects,
} from "@src/utils/number-utils";
import dayjs, { Dayjs } from "dayjs";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { CustomChart } from "@src/components/charts/CustomChart";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import BalanceIcon from "@mui/icons-material/Balance";
import { SentimentIcon } from "./SentimentIcon";
import { useAuth } from "@src/features/auth/useAuth";
import { useUserProfile } from "@src/api/user-profiles";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { SpendingItem } from "@src/types";
import { AnimatedCounter } from "@src/components/animated-counter/AnimatedCounter";

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
          <Stack spacing={1}>
            <Typography>
              Budget: <b>{formatNumber(spendingLimit)} kr</b>
            </Typography>

            <Typography>
              Amount spent:{" "}
              <AnimatedCounter
                value={totalSpent}
                fontWeight="bold"
                suffix=" kr"
              />
            </Typography>

            <Typography>
              Remaining:{" "}
              <AnimatedCounter
                value={remainingBudget}
                fontWeight="bold"
                suffix=" kr"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5.9}>
          <Stack spacing={1} alignItems="center">
            <Card
              variant="outlined"
              sx={{ width: "99%", p: 1, textAlign: "center" }}
            >
              <Typography
                color={remainingBudget < 0 ? "error.light" : "text.primary"}
              >
                {formattedPercentageRemaining}%{" "}
                {remainingBudget < 0 ? "over budget" : "remaining"}
              </Typography>
            </Card>

            <CustomChart
              data={[{ name: "Remaining", amount: remainingBudget }]}
              xAxisKey="name"
              yAxisKey={"amount"}
              yAxisUnit=" kr"
              hideYAxis
              orientation="vertical"
              height={80}
              colors={[getBarColor(totalSpent, spendingLimit)]}
              loading={isLoadingSpendingItems}
              dataMax={spendingLimit}
              xAxisInterval="preserveStartEnd"
              barStrokeWidth={0}
            />
          </Stack>
        </Grid>
      </Grid>

      <SpendingRateInfo
        totalSpent={totalSpent}
        numItems={spendingItems.length}
        remainingBudget={remainingBudget}
        limit={spendingLimit}
      />
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

type SpendingRateInfoProps = {
  totalSpent: number;
  numItems: number;
  remainingBudget: number;
  limit: number;
};

type SpendingRate = "Very High" | "High" | "Balanced" | "Low" | "Very Low";

function SpendingRateInfo({
  totalSpent,
  numItems,
  remainingBudget,
  limit,
}: SpendingRateInfoProps) {
  const averageAmountPerDay = calcAverageAmountPerDay(totalSpent, numItems);

  const daysToBudgetLimit = calcDaysToBudgetLimit(
    remainingBudget,
    limit,
    averageAmountPerDay
  );

  const dateOfBudgetLimit = calcDateOfBudgetLimit(daysToBudgetLimit);

  const isDateOfBudgetLimitWithinMonth = dateOfBudgetLimit.isBefore(
    dayjs().endOf("month")
  );

  const spendingRatePercent = useMemo(() => {
    // use days left in month to calculate spending rate in percent
    const daysLeftInMonth = dayjs().daysInMonth() - dayjs().date();
    const spendingRatePercent = calcPercentage(
      averageAmountPerDay * daysLeftInMonth,
      remainingBudget
    );

    return Math.round(spendingRatePercent);
  }, [averageAmountPerDay, remainingBudget]);

  const spendingRate: SpendingRate = useMemo(() => {
    if (spendingRatePercent > 125) {
      return "Very High";
    }

    if (spendingRatePercent >= 100) {
      return "High";
    }

    if (spendingRatePercent >= 75) {
      return "Balanced";
    }

    if (spendingRatePercent >= 50) {
      return "Low";
    }

    return "Very Low";
  }, [spendingRatePercent]);

  const message = useMemo(() => {
    const start = `You spend on average ${formatNumber(averageAmountPerDay, {
      fractions: 0,
    })} kr per day.`;

    const mid = isDateOfBudgetLimitWithinMonth
      ? `At this rate, you will reach your budget limit in approximately ${daysToBudgetLimit} days,
      on ${dateOfBudgetLimit.format("MMMM D")}.`
      : `At this rate, you won't reach your budget limit until next month, on ${dateOfBudgetLimit.format(
          "MMMM D"
        )}.`;

    const end = isDateOfBudgetLimitWithinMonth
      ? `
      If you don't spend less, you will exceed your budget limit before the end of this month.`
      : `If you manage to stay within your budget limit this month, consider investing or putting what remains into savings.`;

    const message = `${start} ${mid} ${end}`;

    return message;
  }, [
    averageAmountPerDay,
    daysToBudgetLimit,
    dateOfBudgetLimit,
    isDateOfBudgetLimitWithinMonth,
  ]);

  return (
    <Card variant="outlined" sx={{ width: "100%", p: 2 }}>
      <Grid container gap={1}>
        <Grid item xs={12} md={5.85}>
          <Stack
            height="100%"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <SentimentIcon
              fontSize="large"
              percentage={spendingRatePercent}
              sentimentParser={(percentage) => {
                if (percentage >= 150) {
                  return "Very bad";
                }

                if (percentage > 100) {
                  return "Bad";
                }

                if (percentage === 100) {
                  return "Neutral";
                }

                if (percentage < 100) {
                  return "Good";
                }

                return "Very good";
              }}
            />

            <Typography>
              Spending rate: <b>{spendingRate}</b>
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={5.9}>
          <Typography>{message}</Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

function calcAverageAmountPerDay(totalSpent: number, numItems: number): number {
  if (!numItems) {
    return 0;
  }

  const average = totalSpent / numItems;

  return average;
}

function calcDaysToBudgetLimit(
  remainingBudget: number,
  limit: number,
  average: number
): number {
  if (remainingBudget < 1 || limit < 1 || !average) {
    return 0;
  }

  return Math.ceil(remainingBudget / average);
}

function calcDateOfBudgetLimit(daysToBudgetLimit: number): Dayjs {
  const now = dayjs();
  const dateOfBudgetLimit = now.add(daysToBudgetLimit, "day");

  return dateOfBudgetLimit;
}
