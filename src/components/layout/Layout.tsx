import React, {
  ComponentProps,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  AppBar,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Backdrop,
  IconButton,
  useMediaQuery,
  Box,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@src/features/auth/useAuth";
import { useSignInOut } from "@src/api/auth";
import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import AddIcon from "@mui/icons-material/Add";

const navigationLinks = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "History",
    href: "/history",
  },
  {
    label: "Profile",
    href: "/profile",
  },
] as const;

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
        maxWidth="xl"
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

type NavigationTabsProps = {
  orientation?: "horizontal" | "vertical";
  containerStyle?: ComponentProps<typeof Stack>["sx"];
  tabStyle?: ComponentProps<typeof Tab>["sx"];
};

function NavigationTabs({
  orientation = "horizontal",
  containerStyle,
  tabStyle,
}: NavigationTabsProps) {
  const { pathname } = useLocation();

  return (
    <Tabs value={pathname} orientation={orientation} sx={containerStyle}>
      {navigationLinks.map((link) => (
        <Tab
          key={link.label}
          label={link.label}
          value={link.href}
          component={Link}
          to={link.href}
          sx={tabStyle}
        />
      ))}
    </Tabs>
  );
}

type NavigationBarProps = {
  onMenuClick: () => void;
};

function NavigationBar({ onMenuClick }: NavigationBarProps) {
  const { openAddDialog } = useSpendingEditor();

  return (
    <AppBar position="sticky">
      <Stack
        direction="row"
        width="100%"
        maxWidth="lg"
        justifyContent="space-between"
        alignItems="center"
        px={{ xs: 2, sm: 3, md: 4 }}
        py={{ xs: 1, sm: 2 }}
        margin="0 auto"
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <NavigationTabs
            containerStyle={{ minHeight: "unset" }}
            tabStyle={{ p: 1, minHeight: "unset" }}
          />
        </Stack>

        <Button
          size="small"
          variant="contained"
          onClick={() => openAddDialog()}
        >
          <AddIcon fontSize="small" sx={{ marginRight: 0.5 }} />
          Add
        </Button>

        <IconButton
          size="medium"
          aria-label="navigation-menu"
          onClick={onMenuClick}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>
    </AppBar>
  );
}

type NavigationDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
  const { signOut } = useSignInOut();

  function toggleDrawer(e: React.KeyboardEvent | React.MouseEvent) {
    if (
      e.type === "keydown" &&
      ["Tab", "Shift"].includes((e as React.KeyboardEvent).key)
    ) {
      return;
    }

    onClose();
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{ display: { xs: "flex", sm: "none" } }}
      elevation={2}
    >
      <Box
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
        py={2}
        width={250}
      >
        <NavigationTabs orientation="vertical" />
      </Box>

      <Stack position="absolute" width="100%" bottom={0}>
        <Divider />

        <Tab label="Sign out" onClick={() => signOut()} />
      </Stack>
    </Drawer>
  );
}
