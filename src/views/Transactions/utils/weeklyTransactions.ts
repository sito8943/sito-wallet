export type WeeklyTransactionsScopeType = "current" | "previous";

export type WeeklyTransactionsDateRangeType = {
  start: string;
  end: string;
};

const DAYS_PER_WEEK = 7;

const pad = (value: number): string => String(value).padStart(2, "0");

const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toStartOfDay = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const toEndOfDay = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setHours(23, 59, 59, 0);
  return nextDate;
};

export const getWeeklyTransactionsDateRange = (
  scope: WeeklyTransactionsScopeType,
  now: Date = new Date(),
): WeeklyTransactionsDateRangeType => {
  const yesterday = addDays(now, -1);
  const currentWeekEnd = toEndOfDay(yesterday);

  const scopedWeekOffset = scope === "previous" ? -DAYS_PER_WEEK : 0;
  const scopedWeekEnd = addDays(currentWeekEnd, scopedWeekOffset);
  const scopedWeekStart = toStartOfDay(
    addDays(scopedWeekEnd, -(DAYS_PER_WEEK - 1)),
  );

  return {
    start: formatLocalDateTime(scopedWeekStart),
    end: formatLocalDateTime(scopedWeekEnd),
  };
};
