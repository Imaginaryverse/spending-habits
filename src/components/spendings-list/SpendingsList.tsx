import {
  Button,
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
};

export function SpendingsList({ spendingItems }: SpendingsListProps) {
  const { openEditDialog } = useSpendingEditor();

  return (
    <List dense sx={{ mt: 1 }}>
      {spendingItems.map((item) => (
        <SpendingsListItem
          key={item.id}
          item={item}
          onEditClick={openEditDialog}
        />
      ))}
    </List>
  );
}

type SpendingsListItemProps = {
  item: SpendingItem;
  onEditClick: (item: SpendingItem) => void;
};

function SpendingsListItem({ item, onEditClick }: SpendingsListItemProps) {
  return (
    <ListItem sx={{ width: "100%" }} disableGutters>
      <Paper
        elevation={5}
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stack>
          <Typography variant="body1">
            {item.title} - {item.amount} kr
          </Typography>
          <Typography variant="body2">{formatDate(item.created_at)}</Typography>
        </Stack>

        <Button variant="contained" onClick={() => onEditClick(item)}>
          Edit
        </Button>
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
