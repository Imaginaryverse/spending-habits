import { useFetchSpendingItems } from "@src/api/spending-items";
import { useAuth } from "@src/features/auth/useAuth";
import { CurrentMonthSummary } from "@src/pages/overview/components/current-month-summary/CurrentMonthSummary";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { TwentyFourHourSummary } from "./components/twenty-four-hour-summary/TwentyFourHourSummary";
import { useNavigate } from "react-router-dom";
import { Page } from "@src/components/page/Page";
import { MonthlySpendingLimitChart } from "./components/monthly-spending-limit-chart/MonthlySpendingLimitChart";
import { useUserProfile } from "@src/api/user-profiles";
import { UserProfile } from "@src/types";
import dayjs from "dayjs";

export function OverviewPage() {
  const now = dayjs();
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);

  const { spendingItems, isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
      fromDate: now.startOf("month").toDate(),
      toDate: now.endOf("month").toDate(),
    },
    {
      enabled: !!user?.id,
    }
  );

  return (
    <Page>
      <Typography variant="h1" sx={{ alignSelf: "flex-start" }}>
        Overview
      </Typography>

      <Typography variant="h3" sx={{ alignSelf: "flex-start" }}>
        Welcome back{userProfile?.name ? `, ${userProfile.name}` : ""}!
      </Typography>

      <MonthlySpendingLimitReminder userProfile={userProfile} />

      {!!userProfile && (
        <MonthlySpendingLimitChart
          userProfile={userProfile}
          spendingItems={spendingItems}
        />
      )}

      <TwentyFourHourSummary
        spendingItems={spendingItems}
        isLoading={isLoadingSpendingItems}
      />

      <CurrentMonthSummary
        spendingItems={spendingItems}
        isLoading={isLoadingSpendingItems}
      />
    </Page>
  );
}

function MonthlySpendingLimitReminder({
  userProfile,
}: {
  userProfile: UserProfile | null;
}) {
  const navigate = useNavigate();

  if (!userProfile || userProfile.monthly_spending_limit > 0) {
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
