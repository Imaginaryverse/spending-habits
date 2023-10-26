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

export function calcWeeklySpendingLimitAverage(
  monthlySpendingLimit: number,
  fractions: number = 2
): number {
  const now = new Date();
  const daysInMonth = dayjs(now).daysInMonth();
  const weeklySpendingLimitAverage = monthlySpendingLimit / (daysInMonth / 7);

  const weeklySpendingLimitAverageRounded = Math.round(
    weeklySpendingLimitAverage * fractions
  );

  return weeklySpendingLimitAverageRounded / fractions;
}

export function calcPercentage(
  portion: number,
  total: number,
  fractions: number = 2
): number {
  if (portion === 0 || total === 0) {
    return 0;
  }

  const percentage = (portion / total) * 100;

  const percentageRounded = Math.round(percentage * fractions);

  return percentageRounded / fractions;
}
