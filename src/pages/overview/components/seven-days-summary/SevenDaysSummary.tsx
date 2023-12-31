import { useMemo, useState } from "react";
import { SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { CustomChart } from "@src/components/charts/CustomChart";
import { Grid, Stack, Switch, Typography } from "@mui/material";
import { formatNumber, sumValueOfObjects } from "@src/utils/number-utils";
import {
  getMostExpensiveSpendingItem,
  getMostFrequentCategoryData,
} from "./utils/current-month-summary-utils";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import {
  getAmountPerCategory,
  getSevenDaysChartData,
} from "@src/utils/data-utils";
import { useAuth } from "@src/features/auth/useAuth";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { SpendingsList } from "@src/components/spendings-list/SpendingsList";
import { useNavigate } from "react-router-dom";
import { TooltipWithCategories } from "@src/components/charts/TooltipWithCategories";

type VisualizationOption = "amount" | "accumulatedAmount";

function selectItemsOfLastSevenDays(spendingItems: SpendingItem[]) {
  const end = dayjs().toDate();
  const start = dayjs(end).subtract(7, "day").toDate();

  const filteredItems = spendingItems.filter((item) => {
    const itemDate = new Date(item.created_at);
    return itemDate >= start && itemDate <= end;
  });

  return filteredItems;
}

export function SevenDaysSummary() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { spendingCategories } = useFetchSpendingCategories();
  const { spendingItems = [], isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
    },
    { enabled: !!user?.id, select: (data) => selectItemsOfLastSevenDays(data) }
  );

  const [selectedVisualization, setSelectedVisualization] =
    useState<VisualizationOption>("amount");

  function toggleVisualization() {
    setSelectedVisualization((prev) =>
      prev === "amount" ? "accumulatedAmount" : "amount"
    );
  }

  const totalAmount = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  const dayChartData = useMemo(
    () => getSevenDaysChartData(spendingItems, spendingCategories),
    [spendingItems, spendingCategories]
  );

  const categoryChartData = useMemo(
    () => getAmountPerCategory(spendingItems, spendingCategories),
    [spendingItems, spendingCategories]
  );

  const mostExpensiveItem = useMemo(
    () => getMostExpensiveSpendingItem(spendingItems),
    [spendingItems]
  );

  const mostFrequentCategoryData = useMemo(
    () => getMostFrequentCategoryData(spendingItems),
    [spendingItems]
  );

  return (
    <PaperStack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <DateRangeIcon />
        <Typography variant="h2">Last 7 days</Typography>
      </Stack>

      <Typography>
        Total spent: <b>{formatNumber(totalAmount)} kr</b>
      </Typography>

      <Grid container gap={2}>
        <Grid item xs={12} md={5.85}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            mb={3}
            width="100%"
          >
            <Typography variant="h4">Per day</Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              maxHeight="1rem"
            >
              <Typography variant="caption">Daily amount</Typography>
              <Switch
                size="small"
                checked={selectedVisualization === "accumulatedAmount"}
                onChange={toggleVisualization}
              />
              <Typography variant="caption">Accumulated</Typography>
            </Stack>
          </Stack>

          <CustomChart
            data={dayChartData}
            onBarClick={(data) => navigate(`/history?dateKey=${data.dateKey}`)}
            type={selectedVisualization === "amount" ? "bar" : "area"}
            lineDot={true}
            xAxisKey="dateKey"
            xAxisFormatter={(dateKey) => dayjs(dateKey).format("ddd")}
            yAxisKey={selectedVisualization}
            yAxisUnit=" kr"
            cartesianGrid={{ horizontal: true }}
            height={250}
            loading={isLoadingSpendingItems}
            tooltipRenderFn={(data) => (
              <TooltipWithCategories
                data={data}
                valueKey={selectedVisualization}
                dateKeyFormatter={(dateKey) =>
                  dayjs(dateKey).format("D MMM YYYY")
                }
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={5.9}>
          <Typography variant="h4" mb={3}>
            Per category
          </Typography>

          <CustomChart
            data={categoryChartData}
            xAxisKey={"name"}
            yAxisKey={"amount"}
            yAxisUnit=" kr"
            cartesianGrid={{ horizontal: true }}
            height={250}
            loading={isLoadingSpendingItems}
          />
        </Grid>
      </Grid>

      <Typography variant="h4">Purchases</Typography>

      <SpendingsList spendingItems={spendingItems} />

      <Typography variant="h4">Most expensive purchase</Typography>

      {!!mostExpensiveItem && (
        <Typography>
          Your most expensive purchase overall (<b>{mostExpensiveItem.title}</b>
          , <b>{formatNumber(mostExpensiveItem.amount)} kr</b>) occurred on{" "}
          <b>{dayjs(mostExpensiveItem.created_at).format("MMMM D")}</b> in the{" "}
          <b>{mostExpensiveItem.category_name}</b> category.
        </Typography>
      )}

      <Typography variant="h4">Most frequent category</Typography>

      {!!mostFrequentCategoryData && (
        <Typography>
          Most of your spending ({mostFrequentCategoryData.number_of_items}{" "}
          items) has occurred in the{" "}
          <b>{mostFrequentCategoryData.category_name}</b> category with a
          current total of{" "}
          <b>{formatNumber(mostFrequentCategoryData.totalAmount)} kr</b>.
        </Typography>
      )}
    </PaperStack>
  );
}
