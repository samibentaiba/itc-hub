// --- /calendar/global/utils.ts ---
import { format } from "date-fns";

export const formatDate = (date: Date, view: "month" | "week" | "day"): string => {
  if (view === 'day') return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
  if (view === 'week') {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  }
  return format(date, "MMMM yyyy");
};
export const getDaysInMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
export const getFirstDayOfMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
export const formatDateString = (date: Date): string => format(date, "yyyy-MM-dd");
export const getEventTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    meeting: "bg-blue-500",
    event: "bg-green-500",
    deadline: "bg-red-500",
    networking: "bg-purple-500",
    workshop: "bg-orange-500",
  };
  return colors[type] || "bg-gray-500";
};
export const getEventTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  if (type === "deadline") return "destructive";
  if (type === "meeting") return "default";
  return "secondary";
};
