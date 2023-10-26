import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditIcon from "@mui/icons-material/Edit";

import {
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { SpendingItem } from "@src/types";

type SpendingsListProps = {
  spendingItems: SpendingItem[];
  dense?: boolean;
};

export function SpendingsList({ spendingItems, dense }: SpendingsListProps) {
  const { openEditDialog, openDeleteDialog } = useSpendingEditor();

  return (
    <List dense={dense}>
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
  return (
    <ListItem sx={{ width: "100%" }} disableGutters>
      <Paper
        elevation={2}
        sx={{
          py: 2,
          pl: 2,
          pr: 1,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack flex={1} justifyContent="space-between">
          <Typography variant="h5">{item.title}</Typography>

          <Typography variant="h3" color="primary">
            {item.amount} kr
          </Typography>

          <Typography variant="caption">
            {formatDate(item.created_at)}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <IconButton onClick={() => onDeleteClick(item)}>
            <DeleteForeverOutlinedIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={() => onEditClick(item)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </ListItem>
  );
}

function formatDate(date: Date): string {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
