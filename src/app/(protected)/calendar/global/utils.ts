// /calendar/global/utils.ts

export const formatDate = (
  date: Date,
  view: "day" | "week" | "month"
): string => {
  if (view === "day") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  if (view === "week") {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${endOfWeek.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
