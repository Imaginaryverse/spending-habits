import { useState, useMemo } from "react";
import {
  Stack,
  Typography,
  Paper,
  Box,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { SpendingCategory, SpendingItem } from "@src/types";
import { sumValueOfObjects } from "@src/utils/number-utils";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { PieChart } from "@src/components/charts/PieChart";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";

type FourtyEightHourSummaryProps = {
  spendingItems: SpendingItem[];
  isLoading: boolean;
};

export function FourtyEightHourSummary({
  spendingItems,
  isLoading,
}: FourtyEightHourSummaryProps) {
  const [open, setOpen] = useState(false);

  const totalSpendingInLastFortyEightHours = useMemo(
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
        <Typography variant="h2">48h summary</Typography>
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
        <Typography>Total: {totalSpendingInLastFortyEightHours} kr</Typography>
      )}

      <Collapse in={open}>
        <Stack
          spacing={2}
          my={2}
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.5s ease" }}
        >
          <FourtyEightHourPieChart spendingItems={spendingItems} />
          <SpendingsList spendingItems={spendingItems} />
        </Stack>
      </Collapse>
    </Paper>
  );
}

type FourtyEightHourPieChartProps = {
  spendingItems: SpendingItem[];
};

type FourtyEightHourPieChartDataItem = {
  category: SpendingCategory["name"];
  amount: number;
};

function FourtyEightHourPieChart({
  spendingItems,
}: FourtyEightHourPieChartProps) {
  const { spendingCategories } = useSpendings();

  if (!spendingCategories.length) {
    return null;
  }

  const data = getFourtyEightHourPieChartData(
    spendingItems,
    spendingCategories
  );

  return (
    <PieChart data={data} valueKey="amount" labelKey="category" height={300} />
  );
}

function getFourtyEightHourPieChartData(
  items: SpendingItem[],
  categories: SpendingCategory[]
): FourtyEightHourPieChartDataItem[] {
  const data: FourtyEightHourPieChartDataItem[] = [];

  categories.forEach((category) => {
    const itemsInCategory = items.filter(
      (item) => item.category_id === category.id
    );

    data.push({
      category: category.name,
      amount: sumValueOfObjects(itemsInCategory, "amount"),
    });
  });

  return data
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}
