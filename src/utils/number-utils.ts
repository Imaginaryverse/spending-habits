import dayjs from "dayjs";

/**
 * Sums the value of a key in an array of objects. The value of the key must be a number.
 * @param objects - The array of objects.
 * @param key - The key to sum.
 * @returns The sum of the value of the key in the array of objects.
 */
export function sumValueOfObjects<T>(objects: T[], key: keyof T): number {
  return objects.reduce((acc, curr) => {
    if (typeof curr[key] === "number") {
      return acc + (curr[key] as number);
    } else {
      return acc;
    }
  }, 0);
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

/**
 * Calculates the percentage of a portion of a total.
 * @param portion - The portion of the total.
 * @param total - The total.
 * @param fractions - The number of decimal places to round to.
 * @returns The percentage of the portion of the total.
 * @example
 * calcPercentage(1, 2); // 50
 * calcPercentage(1, 2, 1); // 50.0
 */
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

/**
 * Formats a number to a string.
 * @param value - The number to format.
 * @param options - The options to use when formatting the number. Defaults to `{ fractions: 2, autoFormatInteger: true }`.
 * @returns The formatted number as a string.
 */
export function formatNumber(
  value: number,
  options?: {
    fractions?: number;
    autoFormatInteger?: boolean;
  }
): string {
  const defaultOptions = {
    fractions: 2,
    autoFormatInteger: true,
  };

  const { fractions, autoFormatInteger } = {
    ...defaultOptions,
    ...options,
  };

  if (autoFormatInteger && Number.isInteger(value)) {
    return value.toString();
  }

  const valueRounded = Math.round(value * fractions);

  return (valueRounded / fractions).toString();
}
