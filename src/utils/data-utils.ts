import { SpendingCategory, SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { getNumDaysInMonth } from "./date-utils";
import { getCategoryAbbreviation } from "./string-utils";

type ChartData = {
  date: string;
  amount: number;
};

/**
 * Returns the total amount spent per month of the year
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getYearChartData(spendingItems: SpendingItem[]): ChartData[] {
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

/**
 * Returns the total amount spent per day of the month
 * @param spendingItems - array of spending items
 * @param dateKey - date key in format "YYYY-MM"
 * @returns array of chart data
 */
export function getMonthChartData(
  spendingItems: SpendingItem[],
  dateKey: string
): ChartData[] {
  const daysInMonth = getNumDaysInMonth(new Date(dateKey));

  const chartData: ChartData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs().date(i).format("DD");

    const amount = spendingItems.reduce((acc, item) => {
      const itemDate = dayjs(item.created_at).format("DD");

      if (itemDate === date) {
        return acc + item.amount;
      }

      return acc;
    }, 0);

    chartData.push({ date, amount });
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

    chartData.push({ date: hour, amount });
  });

  return chartData;
}

/**
 * Returns the last 24 hours of spending data, ending with the most recent hour
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function get24HourChartData(spendingItems: SpendingItem[]): ChartData[] {
  if (!spendingItems?.length) {
    return [];
  }

  const mostRecentItem = spendingItems.sort(
    (a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix()
  )[0];

  const hours = Array.from({ length: 24 }, (_, i) =>
    dayjs(mostRecentItem.created_at).subtract(i, "hour").format("DD HH:00")
  );

  const chartData: ChartData[] = [];

  hours.forEach((hour) => {
    const amount = spendingItems
      .filter(
        (spendingItem) =>
          dayjs(spendingItem.created_at).format("DD HH:00") === hour
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    const hourOfDay = hour.split(" ")[1];

    chartData.push({ date: `${hourOfDay}`, amount });
  });

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
