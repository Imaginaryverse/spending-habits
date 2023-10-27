import { useEffect } from "react";
import {
  useCreateSpendingItem,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { useAuth } from "@src/features/auth/useAuth";
import { CurrentMonthChart } from "@src/pages/overview/components/current-month-chart/CurrentMonthChart";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { TwentyFourHourSummary } from "./components/twenty-four-hour-summary/TwentyFourHourSummary";
import { useNavigate } from "react-router-dom";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";

export function OverviewPage() {
  const { spendingItems, refetchSpendingItems } = useSpendings();

  const { isSpendingItemCreated } = useCreateSpendingItem();
  const { isSpendingItemUpdated } = useUpdateSpendingItem();

  useEffect(() => {
    if (isSpendingItemCreated || isSpendingItemUpdated) {
      refetchSpendingItems();
    }
  }, [isSpendingItemCreated, isSpendingItemUpdated, refetchSpendingItems]);

  return (
    <>
      <Typography variant="h1" sx={{ alignSelf: "flex-start" }}>
        Overview
      </Typography>

      <MonthlySpendingLimitReminder />

      <TwentyFourHourSummary spendingItems={spendingItems} />

      <CurrentMonthChart spendingItems={spendingItems} />
    </>
  );
}

function MonthlySpendingLimitReminder() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const isMonthlySpendingLimitSet = userProfile?.monthly_spending_limit ?? 0;

  if (isMonthlySpendingLimitSet) {
    return null;
  }

  return (
    <Paper sx={{ p: 2 }} component={Stack} spacing={2}>
      <Typography variant="h4">Set spending limit</Typography>

      <Typography>
        You haven't set a monthly spending limit yet. Some features will not be
        available.
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/profile")}
      >
        Update
      </Button>
    </Paper>
  );
}
