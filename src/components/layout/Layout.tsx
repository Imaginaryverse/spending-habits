import React, { PropsWithChildren, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "@src/features/auth/useAuth";
import { useSignInOut } from "@src/api/auth";
import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { useFetchSpendingCategories } from "@src/api/spending-categories";

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
  const { isAuthenticated, isAuthenticating } = useAuth();
  const { isSigningIn, isSigningOut } = useSignInOut();
  const { isFetchingSpendingCategories } = useFetchSpendingCategories();

  const showBackdrop =
    isSigningIn ||
    isSigningOut ||
    isAuthenticating ||
    isFetchingSpendingCategories;

  return (
    <Stack height="100%" width="100%" alignItems="center">
      {!!isAuthenticated && <Navigation />}

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

function Navigation() {
  const { signOut } = useSignInOut();
  const { openAddDialog } = useSpendingEditor();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "1rem",
        maxWidth: "xl",
      }}
    >
      <Toolbar>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleOpenMenu}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handleCloseMenu}
          sx={{ display: "flex" }}
        >
          {navigationLinks.map((link) => (
            <MenuItem key={link.label} onClick={handleCloseMenu}>
              <Link
                to={link.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Typography variant="body1">{link.label}</Typography>
              </Link>
            </MenuItem>
          ))}

          <MenuItem
            onClick={() => {
              signOut();
              handleCloseMenu();
            }}
          >
            <Typography variant="body1">Sign out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      <Button size="small" variant="contained" onClick={openAddDialog}>
        Add spending
      </Button>
    </AppBar>
  );
}
