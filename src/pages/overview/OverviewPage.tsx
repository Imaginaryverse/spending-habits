import { useAuth } from "@src/features/auth/useAuth";
import { Button, Stack, Typography } from "@mui/material";
import { TwentyFourHourSummary } from "./components/twenty-four-hour-summary/TwentyFourHourSummary";
import { useNavigate } from "react-router-dom";
import { Page } from "@src/components/page/Page";
import { MonthlyBudgetChart } from "./components/monthly-budget-chart/MonthlyBudgetChart";
import { useUserProfile } from "@src/api/user-profiles";
import { SevenDaysSummary } from "./components/seven-days-summary/SevenDaysSummary";
import { PaperStack } from "@src/components/paper-stack/PaperStack";

export function OverviewPage() {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.id);

  return (
    <Page title="Overview">
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
    <PaperStack sx={{ alignItems: "center" }}>
      <Typography variant="h4">Set spending limit</Typography>

      <Stack>
        <Typography>
          Some features are disabled until a monthly spending limit is set.
        </Typography>

        <Typography>
          To set your monthly spending limit, click the button below and update
          your profile.
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/profile")}
      >
        Profile
      </Button>
    </PaperStack>
  );
}
