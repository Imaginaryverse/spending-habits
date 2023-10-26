import { PropsWithChildren, useState } from "react";
import {
  AppBar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuth } from "@src/features/auth/useAuth";
import { useSignOut } from "@src/api/auth";

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
  const { isAuthenticated } = useAuth();

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        py: "4 !important",
        pl: "0.4rem !important",
        pr: "0.1rem !important",
      }}
    >
      {!!isAuthenticated && <Navigation />}
      <Stack
        width="100%"
        flex={1}
        py={4}
        px={1}
        spacing={4}
        justifyContent="flex-start"
        alignItems="center"
      >
        {children}
      </Stack>
    </Container>
  );
}

function Navigation() {
  const { signOut } = useSignOut();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
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
    </AppBar>
  );
}
