import { useMemo } from "react";
import dayjs from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { SpendingItem } from "@src/types";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { CustomChart } from "@src/components/charts/CustomChart";
import {
  get24HourChartData,
  getAmountPerCategory,
} from "@src/utils/data-utils";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { useAuth } from "@src/features/auth/useAuth";
import { useFetchSpendingItems } from "@src/api/spending-items";

function selectItemsOfLast24Hours(spendingItems: SpendingItem[]) {
  const end = dayjs().toDate();
  const start = dayjs(end).subtract(24, "hour").toDate();

  const filteredItems = spendingItems.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= start && itemDate <= end;
  });

  return filteredItems;
}

export function TwentyFourHourSummary() {
  const { user } = useAuth();
  const { spendingItems = [], isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
    },
    { enabled: !!user?.id, select: (data) => selectItemsOfLast24Hours(data) }
  );
  const { spendingCategories } = useFetchSpendingCategories();

  const hourChartData = useMemo(() => {
    if (!spendingItems.length) {
      return [];
    }

    return get24HourChartData(spendingItems);
  }, [spendingItems]);

  const categoryChartData = useMemo(() => {
    if (!spendingItems.length) {
      return [];
    }

    return getAmountPerCategory(spendingItems, spendingCategories);
  }, [spendingItems, spendingCategories]);

  const totalSpentInLast24Hours = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccessTimeOutlinedIcon />
        <Typography variant="h2">Last 24 hours</Typography>
      </Stack>

      {!!totalSpentInLast24Hours && (
        <Typography mb={3}>
          Total spent: <b>{formatNumber(totalSpentInLast24Hours)} kr</b>
        </Typography>
      )}

      {!spendingItems.length ? (
        <Typography>No spendings in the last 24 hours</Typography>
      ) : (
        <Grid container gap={2}>
          <Grid item xs={12} md={5.85}>
            <Typography variant="h4" mb={3}>
              Per hour
            </Typography>

            <CustomChart
              height={250}
              data={hourChartData}
              xAxisKey="date"
              yAxisKey="amount"
              yAxisUnit=" kr"
              cartesianGrid={{ horizontal: true }}
              loading={isLoadingSpendingItems}
            />
          </Grid>
          <Grid item xs={12} md={5.9}>
            <Typography variant="h4" mb={3}>
              Per category
            </Typography>

            <CustomChart
              height={250}
              data={categoryChartData}
              xAxisKey="name"
              yAxisKey="amount"
              yAxisUnit=" kr"
              cartesianGrid={{ horizontal: true }}
              loading={isLoadingSpendingItems}
            />
          </Grid>
        </Grid>
      )}

      <Typography variant="h4" mb={3}>
        Purchases
      </Typography>

      <SpendingsList spendingItems={spendingItems} dense maxHeight={450} />
    </PaperStack>
  );
}
