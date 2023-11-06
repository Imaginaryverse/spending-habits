import { SpendingCategory, SpendingItem } from "@src/types";
import dayjs from "dayjs";
import { getCategoryAbbreviation } from "./string-utils";
import { sumValueOfObjects } from "./number-utils";

export type ChartData = {
  label: string;
  dateKey: string;
  amount: number;
  categorySummary: { name: string; amount: number }[];
  accumulatedAmount?: number;
};

/**
 * Returns the total amount spent per year
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getYearsChartData(
  spendingItems: SpendingItem[],
  categories: SpendingCategory[] = []
): ChartData[] {
  const years = Array.from({ length: 3 }, (_, i) =>
    dayjs().subtract(i, "year").format("YYYY")
  );
  const chartData: ChartData[] = [];

  years.forEach((year) => {
    const yearItems = spendingItems.filter(
      (spendingItem) => dayjs(spendingItem.created_at).format("YYYY") === year
    );

    const amount = sumValueOfObjects(yearItems, "amount");
    const label = year;
    const dateKey = year;
    const categorySummary = getAmountPerCategory(yearItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      spendingItems.filter(
        (item) =>
          dayjs(item.created_at).isBefore(year) ||
          dayjs(item.created_at).format("YYYY") === year
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
  });

  return chartData.reverse();
}

/**
 * Returns the total amount spent per month of the year
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getYearChartData(
  spendingItems: SpendingItem[],
  categories: SpendingCategory[] = []
): ChartData[] {
  const monthKeys = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("YYYY-MM")
  );
  const chartData: ChartData[] = [];

  monthKeys.forEach((monthKey) => {
    const monthItems = spendingItems.filter(
      (spendingItem) =>
        dayjs(spendingItem.created_at).format("YYYY-MM") === monthKey
    );

    const amount = sumValueOfObjects(monthItems, "amount");
    const label = dayjs(monthKey).format("MMM");
    const dateKey = monthKey;
    const categorySummary = getAmountPerCategory(monthItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      spendingItems.filter(
        (item) =>
          dayjs(item.created_at).isBefore(monthKey) ||
          dayjs(item.created_at).format("YYYY-MM") === monthKey
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
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
  dateKey: string | null,
  categories: SpendingCategory[] = []
): ChartData[] {
  if (!dateKey) {
    return [];
  }

  const daysInMonth = dayjs(dateKey).daysInMonth();
  const month = dayjs(dateKey).format("YYYY-MM");

  const chartData: ChartData[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const day = dayjs(month).date(i).format("DD");

    const dayItems = spendingItems.filter(
      (spendingItem) =>
        dayjs(spendingItem.created_at).format("YYYY-MM") === month &&
        dayjs(spendingItem.created_at).format("DD") === day
    );

    const amount = sumValueOfObjects(dayItems, "amount");
    const label = day;
    const dateKey = dayjs(month).date(+day).format("YYYY-MM-DD");
    const categorySummary = getAmountPerCategory(dayItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      spendingItems.filter(
        (item) =>
          dayjs(item.created_at).isBefore(dateKey, "day") ||
          dayjs(item.created_at).format("YYYY-MM-DD") === dateKey
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
  }

  return chartData;
}

/**
 * Returns the total amount spent per hour of the day
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function getDayChartData(
  spendingItems: SpendingItem[],
  categories: SpendingCategory[] = []
): ChartData[] {
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const chartData: ChartData[] = [];

  hours.forEach((hour) => {
    const hourItems = spendingItems.filter(
      (spendingItem) => dayjs(spendingItem.created_at).format("HH") === hour
    );

    const amount = sumValueOfObjects(hourItems, "amount");
    const label = hour;
    const dateKey = dayjs().hour(+hour).format("YYYY-MM-DD HH:00");
    const categorySummary = getAmountPerCategory(hourItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      spendingItems.filter(
        (item) =>
          dayjs(item.created_at).isBefore(dateKey) ||
          dayjs(item.created_at).format("YYYY-MM-DD HH:00") === dateKey
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
  });

  return chartData;
}

/**
 * Returns the last 24 hours of spending data, ending at the current hour
 * @param spendingItems - array of spending items
 * @returns array of chart data
 */
export function get24HourChartData(
  spendingItems: SpendingItem[],
  categories: SpendingCategory[] = []
): ChartData[] {
  if (!spendingItems?.length) {
    return [];
  }

  const currentHour = dayjs().format("YYYY-MM-DD HH:00");
  const hours: string[] = [];

  for (let i = 0; i < 24; i++) {
    const hour = dayjs(currentHour).subtract(i, "hour").format("HH");
    hours.push(hour);
  }

  const chartData: ChartData[] = [];

  hours.forEach((hour) => {
    const hourItems = spendingItems.filter(
      (spendingItem) => dayjs(spendingItem.created_at).format("HH") === hour
    );

    const amount = sumValueOfObjects(hourItems, "amount");
    const label = hour;
    const dateKey = dayjs().hour(+hour).format("YYYY-MM-DD HH:00");
    const categorySummary = getAmountPerCategory(hourItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      spendingItems.filter(
        (item) =>
          dayjs(item.created_at).isBefore(dateKey) ||
          dayjs(item.created_at).format("YYYY-MM-DD HH:00") === dateKey
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
  });

  return chartData.reverse();
}

export function getSevenDaysChartData(
  items: SpendingItem[],
  categories: SpendingCategory[] = []
): ChartData[] {
  if (!items?.length) {
    return [];
  }

  const today = dayjs().endOf("day");

  const sevenDays = Array.from({ length: 7 }, (_, i) =>
    today.subtract(i, "day").format("YYYY-MM-DD")
  ).reverse();

  const chartData: ChartData[] = [];

  sevenDays.forEach((day) => {
    const dayItems = items.filter(
      (item) => dayjs(item.created_at).format("YYYY-MM-DD") === day
    );

    const amount = sumValueOfObjects(dayItems, "amount");
    const label = dayjs(day).format("ddd");
    const dateKey = day;
    const categorySummary = getAmountPerCategory(dayItems, categories, {
      filterEmpty: true,
    });
    const accumulatedAmount = sumValueOfObjects(
      items.filter(
        (item) =>
          dayjs(item.created_at).isBefore(day) ||
          dayjs(item.created_at).format("YYYY-MM-DD") === day
      ),
      "amount"
    );

    const item = { label, dateKey, amount, categorySummary, accumulatedAmount };

    chartData.push(item);
  });

  return chartData;
}

/**
 * Returns the total amount spent per category
 * @param items - array of spending items
 * @param categories - array of spending categories
 * @returns array of objects with name and amount
 */
export function getAmountPerCategory(
  items: SpendingItem[],
  categories: SpendingCategory[],
  options?: { sort?: boolean; abbreviate?: boolean; filterEmpty?: boolean }
): { name: string; amount: number }[] {
  if (!items?.length || !categories?.length) {
    return [];
  }

  const defaultOptions = { sort: true, abbreviate: true, filterEmpty: false };
  options = { ...defaultOptions, ...options };

  const data: { name: string; amount: number }[] = [];

  if (options?.sort) {
    categories = sortSpendingCategories(categories);
  }

  categories.forEach((category) => {
    const amount = items.reduce((acc, item) => {
      if (item.category_name === category.name) {
        return acc + item.amount;
      }
      return acc;
    }, 0);

    const name = options?.abbreviate
      ? getCategoryAbbreviation(category)
      : category.name;

    data.push({ name, amount });
  });

  if (options?.filterEmpty) {
    return data.filter((item) => item.amount > 0);
  }

  return data;
}

/**
 * Sorts spending categories by the order in which they appear in the spendingCategoriesSortOrder array
 * @param categories - array of spending categories
 * @returns sorted array of spending categories
 */
export function sortSpendingCategories(categories: SpendingCategory[]) {
  const spendingCategoriesSortOrder: SpendingCategory["name"][] = [
    "Other",
    "Commuting",
    "Food",
    "Entertainment",
    "Groceries",
    "Health",
    "Shopping",
  ];

  return categories.sort((a, b) => {
    const aIndex = spendingCategoriesSortOrder.indexOf(a.name);
    const bIndex = spendingCategoriesSortOrder.indexOf(b.name);

    if (aIndex === -1) {
      return 1;
    }

    if (bIndex === -1) {
      return -1;
    }

    return aIndex - bIndex;
  });
}
