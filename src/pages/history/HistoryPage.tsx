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

  const days: DayOption[] = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    const numDaysInMonth = getNumDaysInMonth(
      new Date(selectedYear.value, selectedMonth.value)
    );
    return Array.from({ length: numDaysInMonth }, (_, i) => ({
      label: String(i + 1).padStart(2, "0"),
      value: i + 1,
    }));
  }, [selectedYear, selectedMonth]);

  const [selectedDay, setSelectedDay] = useState<DayOption | null>(
    days.find((option) => option.value === dayKey) ?? null
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

  const chartData: ChartData[] = useMemo(
    () => parseChartData(spendingItems ?? [], dateKey ?? ""),
    [spendingItems, dateKey]
  );

  return (
    <Page>
      <Typography variant="h1" sx={{ alignSelf: "flex-start" }}>
        History
      </Typography>

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
            options={days}
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

      <BarChart
        data={chartData}
        xAxisKey={"date"}
        yAxisKey={"amount"}
        yAxisLabelPosition="inside"
        height={250}
        showLegend={false}
        cartesianGrid={{ horizontal: true }}
        emptyDataText={`No data for ${dateKey}`}
        loading={isLoadingSpendingItems}
      />

      <Typography variant="h2" sx={{ alignSelf: "flex-start" }}>
        Spending items
      </Typography>

      <Typography>
        * List of items for selected date range. On year, items should be
        grouped by month. On month, items should be grouped by day. On day,
        items should simply be sorted by time.
      </Typography>

      <Typography variant="h2" sx={{ alignSelf: "flex-start" }}>
        Summary
      </Typography>

      <Typography>
        * Summary of spending behaviour for selected date range. This can
        include total amount spent, most frequent category, most expensive item,
        trend (e.g. spending more or less than previous month), etc.
      </Typography>
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

const getResolutionFromDateKey = (dateKey: string) => {
  const dateKeyParts = dateKey.split("-").length;
  return dateKeyParts === 1 ? "year" : dateKeyParts === 2 ? "month" : "day";
};

type ChartData = {
  date: string; // if year then "jan, feb, mar, etc", if month then "01, 02, 03, etc", if day then "01, 02, 03, etc"
  amount: number;
};

function getYearChartData(spendingItems: SpendingItem[]): ChartData[] {
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMM")
  );
  const chartData: ChartData[] = [];

  months.forEach((month) => {
    const amount = spendingItems
      .filter(
        (spendingItem) => dayjs(spendingItem.created_at).format("MMM") === month
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    chartData.push({ date: month, amount });
  });

  return chartData;
}

function getMonthChartData(
  spendingItems: SpendingItem[],
  dateKey: string
): ChartData[] {
  const daysInMonth = getNumDaysInMonth(new Date(dateKey));
  const chartData: ChartData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const amount = spendingItems
      .filter(
        (spendingItem) =>
          dayjs(spendingItem.created_at).format("DD") ===
          String(i).padStart(2, "0")
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    chartData.push({ date: String(i).padStart(2, "0"), amount });
  }

  return chartData;
}

function getDayChartData(spendingItems: SpendingItem[]): ChartData[] {
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const chartData: ChartData[] = [];

  hours.forEach((hour) => {
    const amount = spendingItems
      .filter(
        (spendingItem) => dayjs(spendingItem.created_at).format("HH") === hour
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    chartData.push({ date: hour, amount });
  });

  return chartData;
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
