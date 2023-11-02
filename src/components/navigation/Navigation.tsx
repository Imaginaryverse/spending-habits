import { ComponentProps } from "react";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { useSignInOut } from "@src/api/auth";

type NavigationLink = {
  label: string;
  href: string;
  defaultParam?: `?${string}`;
};

const navigationLinks: NavigationLink[] = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "History",
    href: "/history",
    defaultParam: `?dateKey=${dayjs().format("YYYY-MM")}`,
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

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

  if (!navigationLinks.some((link) => link.href === pathname)) {
    return null;
  }

  return (
    <Tabs value={pathname} orientation={orientation} sx={containerStyle}>
      {navigationLinks.map((link) => (
        <Tab
          key={link.label}
          label={link.label}
          value={link.href}
          component={Link}
          to={`${link.href}${link.defaultParam ?? ""}`}
          sx={tabStyle}
        />
      ))}
    </Tabs>
  );
}

type NavigationBarProps = {
  onMenuClick: () => void;
};

export function NavigationBar({ onMenuClick }: NavigationBarProps) {
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
            tabStyle={{ py: 1, px: 2, minHeight: "unset" }}
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

export function NavigationDrawer({ open, onClose }: NavigationDrawerProps) {
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
