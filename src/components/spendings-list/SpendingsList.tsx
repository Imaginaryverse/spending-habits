import { CSSProperties, useState } from "react";
import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { SpendingItem } from "@src/types";
import { formatDate } from "@src/utils/date-utils";

type SpendingsListProps = {
  spendingItems: SpendingItem[];
  dense?: boolean;
  itemElevation?: number;
  maxHeight?: CSSProperties["maxHeight"];
};

export function SpendingsList({
  spendingItems,
  dense = true,
  maxHeight,
}: SpendingsListProps) {
  const { openEditDialog, openDeleteDialog } = useSpendingEditor();

  return (
    <List
      dense={dense}
      sx={{
        flex: 1,
        height: "100%",
        maxHeight: maxHeight ?? `calc(${62}px * 4)`,
        overflowY: "auto",
        paddingRight: 0.5,
        pt: 0,
        pb: 0.5,
      }}
    >
      {spendingItems.map((item) => (
        <SpendingsListItem
          key={item.id}
          item={item}
          onEditClick={openEditDialog}
          onDeleteClick={openDeleteDialog}
        />
      ))}
    </List>
  );
}

type SpendingsListItemProps = {
  item: SpendingItem;
  onEditClick: (item: SpendingItem) => void;
  onDeleteClick: (item: SpendingItem) => void;
};

function SpendingsListItem({
  item,
  onEditClick,
  onDeleteClick,
}: SpendingsListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMoreMenu = Boolean(anchorEl);

  const handleMoreMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem sx={{ width: "100%" }} disableGutters>
      <Card variant="outlined" sx={{ width: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2}
          pl={2}
          pr={1}
        >
          <Grid container spacing={0.5} alignItems="center" maxWidth="sm">
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                {item.title}, {item.category_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" fontWeight="bold">
                {item.amount} kr
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2">
                {formatDate(item.created_at, "MMM D YYYY, HH:mm")}
              </Typography>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={0.5}>
            <IconButton
              color="primary"
              onClick={handleMoreMenuClick}
              size="small"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="more-menu"
              anchorEl={anchorEl}
              open={openMoreMenu}
              onClose={handleMoreMenuClose}
              MenuListProps={{
                "aria-labelledby": "more-menu",
              }}
            >
              <MenuItem onClick={() => onEditClick(item)}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                Edit
              </MenuItem>
              <MenuItem onClick={() => onDeleteClick(item)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>

            <IconButton
              color="primary"
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
            >
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                }}
              />
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={isExpanded}>
          <Stack spacing={2} px={2} pb={2}>
            <Divider />

            <Typography variant="body2">
              {item.comment || "No comment"}
            </Typography>
          </Stack>
        </Collapse>
      </Card>
    </ListItem>
  );
}
