import dayjs from "dayjs";

/**
 * Returns the number of days in a month
 * @param date - date object
 * @returns number of days in a month
 */
export function getNumDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Returns a from and to date range based on a date key.
 * Resolution is based on the date key, and determines where the range starts and ends.
 * @param dateKey - date key in format "YYYY", "YYYY-MM" or "YYYY-MM-DD"
 * @returns object with from and to date
 * @example
 * getDateRangeFromDateKey("2021"); // { from: 2021-01-01T00:00:00.000Z, to: 2021-12-31T23:59:59.999Z }
 * getDateRangeFromDateKey("2021-01"); // { from: 2021-01-01T00:00:00.000Z, to: 2021-01-31T23:59:59.999Z }
 * getDateRangeFromDateKey("2021-01-01"); // { from: 2021-01-01T00:00:00.000Z, to: 2021-01-01T23:59:59.999Z }
 */
export function getDateRangeFromDateKey(dateKey: string | null): {
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

type DateFormatTemplate =
  | "YYYY"
  | "YYYY-MM"
  | "YYYY-MM-DD"
  | "YYYY-MM-DD HH:mm"
  | "YYYY-MM-DD HH:mm:ss"
  | "ddd, MMM D YYYY"
  | "ddd, MMM D YYYY, HH:mm"
  | "ddd, MMM D YYYY, HH:mm:ss"
  | "MMM D YYYY"
  | "MMM D YYYY, HH:mm"
  | "MMM D YYYY, HH:mm:ss";

export function formatDate(date: Date, template?: DateFormatTemplate): string {
  const parsedDate = new Date(date);
  return dayjs(parsedDate).format(template || "YYYY-MM-DD HH:mm");
}
