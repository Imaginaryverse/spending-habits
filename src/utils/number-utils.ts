import { SpendingItem } from "@src/types";
import dayjs from "dayjs";

export function sumValueOfObjects<T>(objects: T[], key: keyof T): number {
  return objects.reduce((acc, curr) => {
    if (typeof curr[key] === "number") {
      return acc + (curr[key] as number);
    } else {
      return acc;
    }
  }, 0);
}

export function calcSevenDaysAmount(items: SpendingItem[]): number {
  const now = new Date();
  const sevenDaysAgo = dayjs(now).subtract(7, "day").toDate();
  const sevenDaysAmount = items
    .filter((item) => dayjs(item.created_at).isAfter(sevenDaysAgo))
    .reduce((acc, curr) => acc + curr.amount, 0);
  return sevenDaysAmount;
}
