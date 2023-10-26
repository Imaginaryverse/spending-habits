import { Grid, Stack, Typography } from "@mui/material";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { PieChart } from "@src/components/charts/PieChart";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { SpendingCategory, SpendingItem } from "@src/types";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import dayjs from "dayjs";
import { useMemo } from "react";

function get24HoursBackDate(now: Date): Date {
  return dayjs(now).subtract(24, "hour").toDate();
}

function isBetweenDates(start: Date, end: Date, date: Date): boolean {
  return dayjs(date).isAfter(start) && dayjs(date).isBefore(end);
}

function getSpendingItemsFor24Hours(
  spendingItems: SpendingItem[],
  now: Date
): SpendingItem[] {
  const twentyFourHoursBackDate = get24HoursBackDate(now);
  return spendingItems.filter((spendingItem) =>
    isBetweenDates(twentyFourHoursBackDate, now, spendingItem.created_at)
  );
}

function get24HourPieChartData(
  items: SpendingItem[],
  categories: SpendingCategory[]
): TwentyFourHourPieChartDataItem[] {
  const data: TwentyFourHourPieChartDataItem[] = [];

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

type TwentyFourHourPieChartDataItem = {
  category: SpendingCategory["name"];
  amount: number;
};

type TwentyFourHourSummaryProps = {
  spendingItems: SpendingItem[];
};

export function TwentyFourHourSummary({
  spendingItems,
}: TwentyFourHourSummaryProps) {
  const { spendingCategories } = useFetchSpendingCategories();

  const spendingItemsFor24Hours = useMemo(() => {
    const now = new Date();
    return getSpendingItemsFor24Hours(spendingItems, now);
  }, [spendingItems]);

  const pieChartData = useMemo(
    () => get24HourPieChartData(spendingItemsFor24Hours, spendingCategories),
    [spendingItemsFor24Hours, spendingCategories]
  );

  const totalSpentInLast24Hours = useMemo(
    () => sumValueOfObjects(spendingItemsFor24Hours, "amount"),
    [spendingItemsFor24Hours]
  );

  return (
    <Stack spacing={2} width="100%">
      <Typography variant="h2">Last 24 hours</Typography>
      <Typography>
        Total spent: {formatNumber(totalSpentInLast24Hours)} kr
      </Typography>

      <Grid container>
        <Grid item xs={12} md={6}>
          <PieChart
            data={pieChartData}
            valueKey="amount"
            labelKey="category"
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SpendingsList spendingItems={spendingItemsFor24Hours} />
        </Grid>
      </Grid>
    </Stack>
  );
}
