import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { Button, Stack, Typography } from "@mui/material";
import { Page } from "@src/components/page/Page";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { useAuth } from "@src/features/auth/useAuth";
import { SpendingItem } from "@src/types";
import { CustomChart } from "@src/components/charts/CustomChart";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import {
  ChartData,
  getDayChartData,
  getMonthChartData,
  getYearChartData,
  getYearsChartData,
} from "@src/utils/data-utils";
import { sumValueOfObjects } from "@src/utils/number-utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AnimatedCounter } from "@src/components/animated-counter/AnimatedCounter";
import { InfoCard } from "@src/components/info-card/InfoCard";

function selectItemsPerDateKey(
  items: SpendingItem[],
  dateKey: string | null
): SpendingItem[] {
  const resolution = getResolutionFromDateKey(dateKey);

  switch (resolution) {
    case "years":
      return items;
    case "year":
      return items.filter((item) =>
        dayjs(item.created_at).isSame(dateKey, "year")
      );
    case "month":
      return items.filter((item) =>
        dayjs(item.created_at).isSame(dateKey, "month")
      );
    case "day":
      return items.filter((item) => {
        const createdAt = dayjs(item.created_at).format("YYYY-MM-DD");
        return dayjs(createdAt).isSame(dateKey, "day");
      });
    default:
      return [];
  }
}

export function HistoryPage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();

  const dateKey = useMemo(() => params.get("dateKey"), [params]);

  const currentResolution: DataResolution = useMemo(
    () => getResolutionFromDateKey(dateKey),
    [dateKey]
  );

  const prevButtonLabel = useMemo(() => {
    switch (currentResolution) {
      case "years":
        return "At min. level";
      case "year":
        return "To years level";
      case "month":
        return "To year level";
      case "day":
        return "To month level";
      default:
        return "";
    }
  }, [currentResolution]);

  const handleBarClick = useCallback(
    (data: ChartData) => {
      const dataDateKey = data.dateKey;

      // if already at day resolution, prevent digging deeper
      if (currentResolution === "day") {
        return;
      }

      // user is at either years, year, or month resolution, so dig deeper
      setParams({ dateKey: dataDateKey });
    },
    [currentResolution, setParams]
  );

  const handlePrevClick = useCallback(() => {
    // if already at years resolution, prevent going back
    if (!dateKey || currentResolution === "year") {
      setParams(undefined);
      return;
    }

    const dateKeyParts = dateKey.split("-");

    // remove last part of date key
    const newDateKey = dateKeyParts.slice(0, dateKeyParts.length - 1).join("-");

    // update date key
    setParams({ dateKey: newDateKey });
  }, [currentResolution, dateKey, setParams]);

  const { spendingItems, isLoadingSpendingItems } = useFetchSpendingItems(
    { user_id: user?.id },
    {
      enabled: !!user && !!dateKey,
      select: (data) => selectItemsPerDateKey(data, dateKey),
    }
  );

  const totalAmountSpent = useMemo(
    () => sumValueOfObjects(spendingItems, "amount"),
    [spendingItems]
  );

  const chartData = useMemo(
    () => parseChartData(spendingItems, dateKey),
    [spendingItems, dateKey]
  );

  const formattedDateKey = useMemo(() => {
    switch (currentResolution) {
      case "years":
        return "Last 3 years";
      case "year":
        return dateKey;
      case "month":
        return dayjs(dateKey).format("MMM YYYY");
      case "day":
        return dayjs(dateKey).format("MMM D YYYY");
      default:
        return null;
    }
  }, [dateKey, currentResolution]);

  return (
    <Page title="History">
      <InfoCard
        title="How to use"
        content={
          <Typography variant="body2">
            Click on a bar to dig deeper into the data. Use the{" "}
            <ArrowBackIcon
              sx={{ fontSize: "inherit", verticalAlign: "middle" }}
            />{" "}
            button to go back to the previous level. The maximum depth is day,
            while the minimum depth is (last 3) years.
          </Typography>
        }
      />

      <PaperStack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="small"
            startIcon={
              currentResolution === "years" ? undefined : <ArrowBackIcon />
            }
            onClick={handlePrevClick}
            disabled={currentResolution === "years"}
          >
            {prevButtonLabel}
          </Button>

          {!!formattedDateKey && (
            <Typography variant="h3">{formattedDateKey}</Typography>
          )}
        </Stack>

        <Typography>
          Total spent:{" "}
          <AnimatedCounter
            value={totalAmountSpent}
            fontWeight="bold"
            suffix=" kr"
          />
        </Typography>

        <CustomChart
          data={chartData}
          onBarClick={currentResolution !== "day" ? handleBarClick : undefined}
          xAxisKey={"dateKey"}
          xAxisFormatter={(date) => formatXAxisLabel(date, currentResolution)}
          yAxisKey={"amount"}
          height={250}
          showLegend={false}
          cartesianGrid={{ horizontal: true }}
          emptyDataText={`No data for ${dateKey}`}
          loading={isLoadingSpendingItems}
        />
      </PaperStack>

      {/* <PaperStack>
        <Typography variant="h2">Spending items</Typography>

        <Typography>
          * List of items for selected date range. On year, items should be
          grouped by month. On month, items should be grouped by day. On day,
          items should simply be sorted by time.
        </Typography>

        <Typography variant="h2">Summary</Typography>

        <Typography>
          * Summary of spending behaviour for selected date range. This can
          include total amount spent, most frequent category, most expensive
          item, trend (e.g. spending more or less than previous month), etc.
        </Typography>
      </PaperStack> */}
    </Page>
  );
}

type DataResolution = "years" | "year" | "month" | "day";

function getResolutionFromDateKey(dateKey: string | null): DataResolution {
  if (!dateKey) {
    return "years";
  }

  const dateKeyParts = dateKey.split("-").length;

  if (dateKeyParts === 1) {
    return "year";
  } else if (dateKeyParts === 2) {
    return "month";
  } else {
    return "day";
  }
}

function formatXAxisLabel(dateKey: string, resolution: DataResolution) {
  switch (resolution) {
    case "years":
      return dayjs(dateKey).format("YYYY");
    case "year":
      return dayjs(dateKey).format("MMM");
    case "month":
      return dayjs(dateKey).format("DD");
    case "day":
      return dayjs(dateKey).format("HH:mm");
    default:
      return "";
  }
}

function parseChartData(spendingItems: SpendingItem[], dateKey: string | null) {
  const resolution = getResolutionFromDateKey(dateKey);

  if (!spendingItems.length) {
    return [];
  }

  switch (resolution) {
    case "years":
      return getYearsChartData(spendingItems);
    case "year":
      return getYearChartData(spendingItems);
    case "month":
      return getMonthChartData(spendingItems, dateKey);
    case "day":
      return getDayChartData(spendingItems);
    default:
      return [];
  }
}
