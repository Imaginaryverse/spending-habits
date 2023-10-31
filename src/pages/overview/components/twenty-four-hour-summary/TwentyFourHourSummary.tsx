import { useMemo } from "react";
import dayjs from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { SpendingItem } from "@src/types";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { BarChart } from "@src/components/charts/BarChart";
import { get24HourChartData, getTotalPerCategory } from "@src/utils/data-utils";
import { useFetchSpendingCategories } from "@src/api/spending-categories";

type TwentyFourHourSummaryProps = {
  spendingItems: SpendingItem[];
  isLoading: boolean;
};

export function TwentyFourHourSummary({
  spendingItems,
  isLoading,
}: TwentyFourHourSummaryProps) {
  const { spendingCategories } = useFetchSpendingCategories();

  const spendingItemsFor24Hours = useMemo(() => {
    const now = new Date();
    return getSpendingItemsFor24Hours(spendingItems, now);
  }, [spendingItems]);

  const hourChartData = useMemo(() => {
    if (!spendingItemsFor24Hours.length) {
      return [];
    }

    return get24HourChartData(spendingItemsFor24Hours);
  }, [spendingItemsFor24Hours]);

  const categoryChartData = useMemo(() => {
    if (!spendingItemsFor24Hours.length) {
      return [];
    }

    return getTotalPerCategory(spendingItemsFor24Hours, spendingCategories);
  }, [spendingItemsFor24Hours, spendingCategories]);

  const totalSpentInLast24Hours = useMemo(
    () => sumValueOfObjects(spendingItemsFor24Hours, "amount"),
    [spendingItemsFor24Hours]
  );

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccessTimeOutlinedIcon />
        <Typography variant="h2">24 hours</Typography>
      </Stack>

      {!!totalSpentInLast24Hours && (
        <Typography mb={3}>
          Total spent: <b>{formatNumber(totalSpentInLast24Hours)} kr</b>
        </Typography>
      )}

      <Typography variant="h4" mb={3}>
        Purchases
      </Typography>

      <SpendingsList
        spendingItems={spendingItemsFor24Hours}
        dense
        maxHeight={450}
      />

      {!spendingItemsFor24Hours.length ? (
        <Typography>No spendings in the last 24 hours</Typography>
      ) : (
        <Grid container columnGap={2} rowGap={2}>
          <Grid item xs={12} md={5.85}>
            <Typography variant="h4" mb={3}>
              Per hour
            </Typography>

            <BarChart
              height={250}
              data={hourChartData}
              xAxisKey="date"
              yAxisLabelPosition="inside"
              yAxisKey="amount"
              cartesianGrid={{ horizontal: true }}
              showLegend={false}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={5.9}>
            <Typography variant="h4" mb={3}>
              Per category
            </Typography>

            <BarChart
              height={250}
              data={categoryChartData}
              xAxisKey="name"
              yAxisLabelPosition="inside"
              yAxisKey="amount"
              cartesianGrid={{ horizontal: true }}
              showLegend={false}
              loading={isLoading}
            />
          </Grid>
        </Grid>
      )}
    </PaperStack>
  );
}

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
