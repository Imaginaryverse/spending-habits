import { SpendingCategory, SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { getCategoryAbbreviation } from "./string-utils";

export type ChartData = {
  label: string;
  dateKey: string;
  amount: number;
};

/**
 * Returns the total amount spent per year
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getYearsChartData(spendingItems: SpendingItem[]): ChartData[] {
  const years = Array.from({ length: 3 }, (_, i) =>
    dayjs().subtract(i, "year").format("YYYY")
  );
  const chartData: ChartData[] = [];

  years.forEach((year) => {
    const amount = spendingItems
      .filter(
        (spendingItem) => dayjs(spendingItem.created_at).format("YYYY") === year
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const label = year;
    const dateKey = year;

    chartData.push({ label, dateKey, amount });
  });

  return chartData.reverse();
}

/**
 * Returns the total amount spent per month of the year
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getYearChartData(spendingItems: SpendingItem[]): ChartData[] {
  const monthKeys = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("YYYY-MM")
  );
  const chartData: ChartData[] = [];

  monthKeys.forEach((monthKey) => {
    const amount = spendingItems
      .filter(
        (spendingItem) =>
          dayjs(spendingItem.created_at).format("YYYY-MM") === monthKey
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const label = dayjs(monthKey).format("MMM");
    const dateKey = monthKey;

    chartData.push({ label, dateKey, amount });
  });

  return chartData;
}

/**
 * Returns the total amount spent per day of the month
 * @param spendingItems - array of spending items
 * @param dateKey - date key in format "YYYY-MM"
 * @returns array of chart data
 */
export function getMonthChartData(
  spendingItems: SpendingItem[],
  dateKey: string | null
): ChartData[] {
  if (!dateKey) {
    return [];
  }

  const daysInMonth = dayjs(dateKey).daysInMonth();
  const month = dayjs(dateKey).format("YYYY-MM");

  const chartData: ChartData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const day = dayjs(month).date(i).format("DD");

    const amount = spendingItems
      .filter(
        (spendingItem) =>
          dayjs(spendingItem.created_at).format("YYYY-MM") === month &&
          dayjs(spendingItem.created_at).format("DD") === day
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const label = day;
    const dateKey = dayjs(month).date(+day).format("YYYY-MM-DD");

    chartData.push({ label, dateKey, amount });
  }

  return chartData;
}

/**
 * Returns the total amount spent per hour of the day
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getDayChartData(spendingItems: SpendingItem[]): ChartData[] {
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

    const label = hour;
    const dateKey = dayjs().hour(+hour).format("YYYY-MM-DD HH:00");

    chartData.push({ label, dateKey, amount });
  });

  return chartData;
}

/**
 * Returns the last 24 hours of spending data, ending at the current hour
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function get24HourChartData(spendingItems: SpendingItem[]): ChartData[] {
  if (!spendingItems?.length) {
    return [];
  }

  const currentHour = dayjs().format("YYYY-MM-DD HH:00");

  const chartData: ChartData[] = [];

  for (let i = 0; i < 24; i++) {
    const hour = dayjs(currentHour).subtract(i, "hour").format("DD HH:00");

    const amount = spendingItems
      .filter(
        (spendingItem) =>
          dayjs(spendingItem.created_at).format("DD HH:00") === hour
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const label = hour.split(" ")[1];
    const dateKey = dayjs().hour(+label).format("YYYY-MM-DD HH:00");

    chartData.push({ label, dateKey, amount });
  }

  return chartData.reverse();
}

/**
 * Returns the total amount spent per category
 * @param items - array of spending items
 * @param categories - array of spending categories
 * @returns array of objects with name and amount
 */
export function getAmountPerCategory(
  items: SpendingItem[],
  categories: SpendingCategory[]
): { name: string; amount: number }[] {
  if (!items?.length || !categories?.length) {
    return [];
  }

  const data: { name: string; amount: number }[] = [];

  categories.forEach((category) => {
    const amount = items.reduce((acc, item) => {
      if (item.category_name === category.name) {
        return acc + item.amount;
      }
      return acc;
    }, 0);

    const abbreviation = getCategoryAbbreviation(category);

    data.push({ name: abbreviation, amount });
  });

  return data;
}
