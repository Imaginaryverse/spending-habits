import { useMemo } from "react";
import dayjs from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";
import { SpendingCategory, SpendingItem } from "@src/types";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { BarChart } from "@src/components/charts/BarChart";

type TwentyFourHourSummaryProps = {
  spendingItems: SpendingItem[];
};

type TwentyFourHourChartDataItem = {
  category: SpendingCategory["name"];
  amount: number;
};

export function TwentyFourHourSummary({
  spendingItems,
}: TwentyFourHourSummaryProps) {
  const { spendingCategories } = useSpendings();

  const spendingItemsFor24Hours = useMemo(() => {
    const now = new Date();
    return getSpendingItemsFor24Hours(spendingItems, now);
  }, [spendingItems]);

  const barChartData = useMemo(() => {
    if (!spendingItemsFor24Hours.length) {
      return [];
    }

    return get24HourChartData(spendingItemsFor24Hours, spendingCategories);
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

      {!spendingItemsFor24Hours.length ? (
        <Typography>No spendings in the last 24 hours</Typography>
      ) : (
        <Grid container columnGap={1}>
          <Grid item xs={12} md={6}>
            <Typography mb={3}>
              Total spent: <b>{formatNumber(totalSpentInLast24Hours)} kr</b>
            </Typography>

            <BarChart
              height={250}
              data={barChartData}
              xAxisKey="category"
              yAxisLabelPosition="inside"
              yAxisKey="amount"
              cartesianGrid={{ horizontal: true }}
              showLegend={false}
            />
          </Grid>
          <Grid item xs={12} md={5.85}>
            <SpendingsList
              spendingItems={spendingItemsFor24Hours}
              dense
              maxHeight={290}
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

function get24HourChartData(
  spendingItems: SpendingItem[],
  categories: SpendingCategory[]
): TwentyFourHourChartDataItem[] {
  const data: TwentyFourHourChartDataItem[] = [];

  categories.forEach((category) => {
    const itemsInCategory = spendingItems.filter(
      (item) => item.category_id === category.id
    );

    let abbreviation = "";

    switch (category.name) {
      case "Shopping":
        abbreviation = "Shop.";
        break;
      case "Commuting":
        abbreviation = "Com.";
        break;
      case "Entertainment":
        abbreviation = "Ent.";
        break;
      case "Food":
        abbreviation = category.name;
        break;
      case "Other":
        abbreviation = category.name;
        break;
      default:
        break;
    }

    data.push({
      category: abbreviation,
      amount: sumValueOfObjects(itemsInCategory, "amount"),
    });
  });

  return data;
}
