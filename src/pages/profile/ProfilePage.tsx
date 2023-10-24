import { Button, Stack, Typography } from "@mui/material";
import { useSignOut } from "@src/api/auth";
import { useAuth } from "@src/features/auth/useAuth";

export function ProfilePage() {
  const { user } = useAuth();
  const { signOut } = useSignOut();

  return (
    <Stack flex={1} spacing={2}>
      <Typography variant="h1">Profile</Typography>

      <Typography variant="h2">User</Typography>

      <Typography variant="body1">{user?.email}</Typography>

      <Button variant="contained" onClick={() => signOut()}>
        Sign Out
      </Button>
    </Stack>
  );
}
