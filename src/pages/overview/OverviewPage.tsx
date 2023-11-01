import { useAuth } from "@src/features/auth/useAuth";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { TwentyFourHourSummary } from "./components/twenty-four-hour-summary/TwentyFourHourSummary";
import { useNavigate } from "react-router-dom";
import { Page } from "@src/components/page/Page";
import { MonthlyBudgetChart } from "./components/monthly-budget-chart/MonthlyBudgetChart";
import { useUserProfile } from "@src/api/user-profiles";
import { SevenDaysSummary } from "./components/seven-days-summary/SevenDaysSummary";

export function OverviewPage() {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);

  return (
    <Page>
      <Typography variant="h1">Overview</Typography>

      <Typography variant="h3">
        Welcome back{userProfile?.name ? `, ${userProfile.name}` : ""}!
      </Typography>

      <MissingMonthlyBudgetReminder />

      <MonthlyBudgetChart />

      <TwentyFourHourSummary />

      <SevenDaysSummary />
    </Page>
  );
}

function MissingMonthlyBudgetReminder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);

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
