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
 * Formats a date object into a "YYYY-MM-DD" string, respecting the local timezone.
 * This prevents the date from shifting unexpectedly due to UTC conversion.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  // getMonth() is zero-based, so we add 1
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


 /**
   * Formats an event's date and time for the "Upcoming Events" list.
   * @param dateStr - The date string in "YYYY-MM-DD" format.
   * @param timeStr - The time string in "HH:MM" format.
   * @returns A user-friendly, relative date string (e.g., "Today, 10:00 AM").
   */
  export const formatUpcomingEventDate = (dateStr: string, timeStr: string): string => {
      const eventDateTime = new Date(`${dateStr}T${timeStr}`);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const eventDate = new Date(eventDateTime.getFullYear(), eventDateTime.getMonth(), eventDateTime.getDate());

      let dayPart;
      if (eventDate.getTime() === today.getTime()) {
          dayPart = "Today";
      } else if (eventDate.getTime() === tomorrow.getTime()) {
          dayPart = "Tomorrow";
      } else {
          dayPart = eventDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      const timePart = eventDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

      return `${dayPart}, ${timePart}`;
  };
