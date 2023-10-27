import { List, ListItem, Stack, Typography } from "@mui/material";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { SpendingItem } from "@src/types";

export function HistoryPage() {
  const { spendingItems, isFetchingSpendingItems } =
    useFetchSpendingItems(undefined);

  return (
    <Stack flex={1} spacing={2}>
      <Typography variant="h1">History</Typography>

      {isFetchingSpendingItems && (
        <Typography variant="body1">Loading...</Typography>
      )}

      <SpendingItemsList items={spendingItems} />
    </Stack>
  );
}

type SpendingItemsListProps = {
  items: SpendingItem[];
};

function SpendingItemsList({ items }: SpendingItemsListProps) {
  function formatDate(date: Date) {
    const parsedISODate = date.toISOString();

    const formatted = new Date(parsedISODate).toLocaleString("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return formatted;
  }

  if (!items.length) {
    return <Typography variant="body1">No items</Typography>;
  }

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id}>
          <Stack spacing={1}>
            <Typography variant="body1">{item.title}</Typography>
            <Typography variant="body2">{item.comment}</Typography>
            <Typography variant="body1">{item.amount}kr</Typography>
            <Typography variant="body2">
              {formatDate(new Date(item.created_at))}
            </Typography>
          </Stack>
        </ListItem>
      ))}
    </List>
  );
}
