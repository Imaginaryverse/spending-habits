/**
 * Returns the number of days in a month
 * @param date - date object
 * @returns number of days in a month
 */
export function getNumDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
