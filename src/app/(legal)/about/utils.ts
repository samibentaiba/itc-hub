// /calendar/utils.ts

/**
 * Formats a date object into a string based on the current calendar view.
 * @param date - The date to format.
 * @param view - The current calendar view ('day', 'week', or 'month').
 * @returns A formatted date string.
 */
export const formatDate = (date: Date, view: "month" | "week" | "day"): string => {
  if (view === 'day') {
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
   if (view === 'week') {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Gets the number of days in a given month.
 * @param date - A date within the desired month.
 * @returns The total number of days in that month.
 */
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Gets the day of the week for the first day of a given month.
 * (0 for Sunday, 1 for Monday, etc.)
 * @param date - A date within the desired month.
 * @returns The day of the week (0-6).
 */
export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

/**
 * Formats a date object into a "YYYY-MM-DD" string.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
