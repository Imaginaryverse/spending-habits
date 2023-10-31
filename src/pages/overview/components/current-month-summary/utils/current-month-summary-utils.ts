import { SpendingItem } from "@src/types";

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
): MostFrequentCategoryData | undefined {
  if (!spendingItems?.length) {
    return undefined;
  }

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
