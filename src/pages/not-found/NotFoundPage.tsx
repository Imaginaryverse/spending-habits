import { Stack, Typography } from "@mui/material";

export function NotFoundPage() {
  return (
    <Stack flex={1} spacing={2}>
      <Typography variant="h1">Not Found</Typography>

      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Stack>
  );
}
