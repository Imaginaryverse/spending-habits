import { useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Paper,
  Box,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { SpendingItem } from "@src/types";
import { sumValueOfObjects } from "@src/utils/number-utils";

type ThirtyDaySummaryProps = {
  spendingItems: SpendingItem[];
  isLoading: boolean;
};

export function ThirtyDaySummary({
  spendingItems,
  isLoading,
}: ThirtyDaySummaryProps) {
  const [open, setOpen] = useState(false);

  const totalSpendingInLastThirtyDays = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  if (!spendingItems.length) {
    return null;
  }

  return (
    <Paper
      sx={{ width: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <Typography variant="h2">30d summary</Typography>
        <Button variant="outlined" size="small" onClick={() => setOpen(!open)}>
          {open ? "Hide" : "View"}
        </Button>
      </Box>

      {isLoading ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CircularProgress size={20} />
          <Typography>Loading...</Typography>
        </Stack>
      ) : (
        <Typography>Total: {totalSpendingInLastThirtyDays} kr</Typography>
      )}

      <Collapse in={open}>
        <SpendingsList spendingItems={spendingItems} />
      </Collapse>
    </Paper>
  );
}
