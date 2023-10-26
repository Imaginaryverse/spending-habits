import { Button, Stack, Typography } from "@mui/material";
import { useSignOut } from "@src/api/auth";
import { useAuth } from "@src/features/auth/useAuth";
import { calcWeeklySpendingLimitAverage } from "@src/utils/number-utils";

export function ProfilePage() {
  const { user, userProfile } = useAuth();
  const { signOut } = useSignOut();

  return (
    <Stack flex={1} spacing={2}>
      <Typography variant="h1">Profile</Typography>

      <Typography>Email: {user?.email}</Typography>

      <Typography>Name: {userProfile?.name}</Typography>

      <Typography>
        Monthly spending limit: {userProfile?.monthly_spending_limit ?? 0} kr
      </Typography>

      <Typography>
        Weekly spending limit:{" "}
        {calcWeeklySpendingLimitAverage(
          userProfile?.monthly_spending_limit ?? 0
        )}{" "}
        kr
      </Typography>

      <Button variant="contained" onClick={() => signOut()}>
        Sign Out
      </Button>
    </Stack>
  );
}
