import { SpendingItem } from "@src/types";
import { getNumDaysInMonth } from "@src/utils/date-utils";
import dayjs from "dayjs";

export function getSpendingItemsInMonth(
  spendingItems: SpendingItem[],
  month: number
): SpendingItem[] {
  const spendingItemsInMonth = spendingItems.filter((item) => {
    const itemMonth = dayjs(item.created_at).month();

    return itemMonth === month;
  });

  return spendingItemsInMonth;
}

export function getMostExpensiveSpendingItem(
  spendingItems: SpendingItem[]
): SpendingItem | undefined {
  if (!spendingItems?.length) {
    return undefined;
  }

  return spendingItems.reduce((mostExpensiveItem, item) => {
    if (item.amount > mostExpensiveItem.amount) {
      return item;
    }

    return mostExpensiveItem;
  });
}

type MostFrequentCategoryData = {
  category_name: string;
  number_of_items: number;
  totalAmount: number;
};

export function getMostFrequentCategoryData(
  spendingItems: SpendingItem[]
): MostFrequentCategoryData {
  const categoryData: Record<string, MostFrequentCategoryData> =
    spendingItems.reduce((acc, item) => {
      const { category_name } = item;

      if (acc[category_name]) {
        acc[category_name].number_of_items += 1;
        acc[category_name].totalAmount += item.amount;
      } else {
        acc[category_name] = {
          category_name,
          number_of_items: 1,
          totalAmount: item.amount,
        };
      }

      return acc;
    }, {} as Record<string, MostFrequentCategoryData>);

  const mostFrequentCategoryData = Object.values(categoryData).reduce(
    (mostFrequentCategoryData, categoryData) => {
      if (
        categoryData.number_of_items > mostFrequentCategoryData.number_of_items
      ) {
        return categoryData;
      }

      return mostFrequentCategoryData;
    }
  );

  return mostFrequentCategoryData;
}

type BarChartDataItem = {
  date: string;
  amount: number;
};

export function generateMonthChartData(items: SpendingItem[], date: Date) {
  const daysInMonth = getNumDaysInMonth(date);
  const chartData: BarChartDataItem[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs().date(i).format("YYYY-MM-DD");
    const amount = items.reduce((acc, item) => {
      const itemDate = dayjs(item.created_at).format("YYYY-MM-DD");

      if (itemDate === date) {
        return acc + item.amount;
      }
      return acc;
    }, 0);
    chartData.push({ date, amount });
  }

  return chartData;
}
