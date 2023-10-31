import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  Autocomplete,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Page } from "@src/components/page/Page";
import { useFetchSpendingItems } from "@src/api/spending-items";
import { useAuth } from "@src/features/auth/useAuth";
import { getNumDaysInMonth } from "@src/utils/date-utils";
import { SpendingItem } from "@src/types";
import { BarChart } from "@src/components/charts/BarChart";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import {
  getDayChartData,
  getMonthChartData,
  getYearChartData,
} from "@src/utils/data-utils";

const yearOptions = [
  { label: "2023", value: 2023 },
  { label: "2022", value: 2022 },
];

type YearOption = (typeof yearOptions)[number];

const monthOptions = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

type MonthOption = (typeof monthOptions)[number];

type DayOption = {
  label: string;
  value: number;
};

export function HistoryPage() {
  const [params, setParams] = useSearchParams({
    dateKey: dayjs().format("YYYY-MM"),
  }); // will contain a dateKey (e.g. 2023, 2023-01, or 2023-01-01)
  const { user } = useAuth();

  const dateKey = useMemo(() => params.get("dateKey"), [params]);

  const [yearKey, monthKey, dayKey] = useMemo(() => {
    const yyyy = dateKey?.split("-")[0];
    const mm = dateKey?.split("-")[1];
    const dd = dateKey?.split("-")[2];

    return [
      yyyy ? parseInt(yyyy) : 2023,
      mm ? parseInt(mm) - 1 : null,
      dd ? parseInt(dd) - 1 : null,
    ];
  }, [dateKey]);

  const [selectedYear, setSelectedYear] = useState<YearOption>({
    label: String(yearKey),
    value: yearKey,
  });

  const [selectedMonth, setSelectedMonth] = useState<MonthOption | null>(
    monthOptions.find((option) => option.value === monthKey) ?? null
  );

  const dayOptions = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    return getDayOptions(new Date(selectedYear.value, selectedMonth.value));
  }, [selectedYear, selectedMonth]);

  const [selectedDay, setSelectedDay] = useState<DayOption | null>(
    dayOptions.find((option) => option.value === dayKey) ?? null
  );

  function handleYearChange(value: number | null) {
    if (value === null) {
      return;
    }

    setSelectedYear({
      label: String(value),
      value,
    });
  }

  function handleMonthChange(value: number | null) {
    if (value === null) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth({
        label: monthOptions[value].label,
        value,
      });
    }
  }

  function handleDayChange(value: number | null) {
    if (value === null) {
      setSelectedDay(null);
    } else {
      setSelectedDay({
        label: String(value).padStart(2, "0"),
        value,
      });
    }
  }

  const dateRange = useMemo(() => getDateRangeFromDateKey(dateKey), [dateKey]);

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (!selectedYear) return;

    const newDateKey = [
      selectedYear.value,
      selectedMonth && String(selectedMonth.value + 1).padStart(2, "0"),
      selectedDay && String(selectedDay.value).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join("-");
    setParams({ dateKey: newDateKey });
  }

  const { spendingItems, isLoadingSpendingItems } = useFetchSpendingItems(
    {
      user_id: user?.id,
      fromDate: dateRange.from,
      toDate: dateRange.to,
    },
    {
      enabled: !!user && !!dateRange,
    }
  );

  const chartData = useMemo(
    () => parseChartData(spendingItems ?? [], dateKey ?? ""),
    [spendingItems, dateKey]
  );

  return (
    <Page>
      <Typography variant="h1">History</Typography>

      <Stack component="form" spacing={2} sx={{ width: "100%" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <OptionSelect
            label="Year"
            options={yearOptions}
            value={selectedYear}
            onChange={handleYearChange}
            disableClearable
          />

          <OptionSelect
            label="Month"
            options={monthOptions}
            value={selectedMonth ?? null}
            onChange={handleMonthChange}
            disabled={!!selectedDay}
          />

          <OptionSelect
            label="Day"
            options={dayOptions}
            value={selectedDay ?? null}
            onChange={handleDayChange}
            disabled={!selectedMonth}
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          onClick={(e) => handleSubmit(e)}
          disabled={isLoadingSpendingItems}
        >
          Submit
        </Button>
      </Stack>

      <PaperStack>
        <Typography variant="h2">
          {getFormattedDateKey(dateKey) ?? "No date selected"}
        </Typography>

        <BarChart
          data={chartData}
          xAxisKey={"date"}
          yAxisKey={"amount"}
          yAxisLabelPosition="inside"
          height={350}
          showLegend={false}
          cartesianGrid={{ horizontal: true }}
          emptyDataText={`No data for ${dateKey}`}
          loading={isLoadingSpendingItems}
        />
      </PaperStack>

      <PaperStack>
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
      </PaperStack>
    </Page>
  );
}

type OptionSelectProps<T extends { label: string; value: number }> = {
  label?: string;
  options: T[];
  value: T | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  disableClearable?: boolean;
};

function OptionSelect<T extends { label: string; value: number }>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  disableClearable = false,
}: OptionSelectProps<T>) {
  return (
    <Autocomplete
      value={value}
      onChange={(e, option) => onChange(option?.value ?? null)}
      options={options}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => <TextField {...params} label={label} />}
      disabled={disabled}
      disableClearable={disableClearable}
      size="small"
      fullWidth
    />
  );
}

function getDayOptions(date: Date): DayOption[] {
  const numDaysInMonth = getNumDaysInMonth(date);
  return Array.from({ length: numDaysInMonth }, (_, i) => ({
    label: String(i + 1).padStart(2, "0"),
    value: i + 1,
  }));
}

function getDateRangeFromDateKey(dateKey: string | null): {
  from: Date;
  to: Date;
} {
  if (!dateKey) {
    dateKey = dayjs().format("YYYY-MM");
  }

  const dateKeyParts = dateKey.split("-").length;
  const resolution =
    dateKeyParts === 1 ? "year" : dateKeyParts === 2 ? "month" : "day";

  const date = dayjs(dateKey);
  const from = date.startOf(resolution).toDate();
  const to = date.endOf(resolution).toDate();

  return { from, to };
}

function getResolutionFromDateKey(dateKey: string) {
  const dateKeyParts = dateKey.split("-").length;
  return dateKeyParts === 1 ? "year" : dateKeyParts === 2 ? "month" : "day";
}

function getFormattedDateKey(dateKey: string | null) {
  if (!dateKey) return null;

  const resolution = getResolutionFromDateKey(dateKey);

  if (resolution === "year") {
    return dateKey;
  } else if (resolution === "month") {
    return dayjs(dateKey).format("MMMM YYYY");
  } else {
    return dayjs(dateKey).format("MMMM DD YYYY");
  }
}

function parseChartData(spendingItems: SpendingItem[], dateKey: string) {
  const resolution = getResolutionFromDateKey(dateKey);

  if (!spendingItems.length) {
    return [];
  }

  if (resolution === "year") {
    return getYearChartData(spendingItems);
  } else if (resolution === "month") {
    return getMonthChartData(spendingItems, dateKey);
  } else {
    return getDayChartData(spendingItems);
  }
}
