import { PropsWithChildren, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  CircularProgress,
  Backdrop,
  useMediaQuery,
} from "@mui/material";

import { useAuth } from "@src/features/auth/useAuth";
import { useSignInOut } from "@src/api/auth";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { NavigationBar, NavigationDrawer } from "../navigation/Navigation";

export function Layout({ children }: PropsWithChildren) {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { isAuthenticated, isAuthenticating } = useAuth();
  const { isSigningIn, isSigningOut } = useSignInOut();
  const { isLoadingSpendingCategories } = useFetchSpendingCategories();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if ((!isMobile && isDrawerOpen) || !isAuthenticated) {
      setIsDrawerOpen(false);
    }
  }, [isMobile, isDrawerOpen, isAuthenticated]);

  const showBackdrop =
    isSigningIn ||
    isSigningOut ||
    isAuthenticating ||
    isLoadingSpendingCategories;

  return (
    <Stack height="100%" width="100%" alignItems="center">
      {!!isAuthenticated && (
        <NavigationBar onMenuClick={() => setIsDrawerOpen(true)} />
      )}

      <NavigationDrawer
        open={!!isAuthenticated && isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <Backdrop open={showBackdrop} sx={{ background: "transparent" }}>
        <Stack spacing={2} justifyContent="center" alignItems="center" flex={1}>
          <CircularProgress />
          <Typography>Loading</Typography>
        </Stack>
      </Backdrop>

      <Stack
        flex={1}
        height="100%"
        width="100%"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          opacity: showBackdrop ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
