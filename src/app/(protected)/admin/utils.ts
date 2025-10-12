/**
 * @file utils.ts
 * @description Contains type-safe helper functions for API requests and data transformation.
 */

import type {
  User,
  Team,
  Department,
  Event,
  PendingEvent,
  UserStatus,
} from "./types";

// ===== API REQUEST HELPER =====

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ error: "An unknown error occurred" }))) as ApiErrorResponse;
    throw new Error(errorData.error || "Request failed");
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  return (await response.json()) as T;
}

// ===== DATA TRANSFORMATION HELPERS =====

// Type-safe transformation function that preserves types
export const transformApiResponse = <T extends Record<string, unknown>>(
  item: T,
  type: "user" | "team" | "department" | "event"
): T => {
  switch (type) {
    case "user": {
      const user = item as unknown as User;
      return {
        ...user,
        joinedDate: user.joinedDate || new Date().toISOString(),
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      } as unknown as T;
    }

    case "team": {
      const team = item as unknown as Team;
      return {
        ...team,
        createdDate: team.createdDate || new Date().toISOString(),
        status: (team.status || "active") as "active" | "archived",
      } as unknown as T;
    }

    case "department": {
      const dept = item as unknown as Department;
      return {
        ...dept,
        createdDate: dept.createdDate || new Date().toISOString(),
        status: (dept.status || "active") as "active" | "archived",
        color: dept.color || "#f3f4f6",
      } as unknown as T;
    }

    case "event": {
      const event = item as unknown as Event | PendingEvent;
      
      return {
        ...event,
        date: event.date || new Date().toISOString().split("T")[0],
        type: event.type || "meeting",
      } as unknown as T;
    }

    default:
      return item;
  }
};

// ===== UI HELPER FUNCTIONS =====

export const getStatusBadgeVariant = (
  status: UserStatus | string
): "default" | "secondary" => {
  return status === "verified" ? "default" : "secondary";
};

export const formatLeaders = (leaders: User[]): string => {
  if (!leaders || leaders.length === 0) return "N/A";
  if (leaders.length === 1) return leaders[0].name;
  return `${leaders[0].name} +${leaders.length - 1}`;
};

export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (time: string): string => {
  if (!time) return "--:--";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

export const getDurationLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return "1 hour";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// ===== VALIDATION HELPERS =====

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// ===== FILTERING & SORTING HELPERS =====

export const filterUsersByStatus = (
  users: User[],
  status: UserStatus
): User[] => {
  return users.filter((u) => u.status === status);
};

export const sortUsersByName = (users: User[]): User[] => {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
};

export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// ===== EXPORT HELPERS =====

export const generateCSV = <T extends Record<string, unknown>>(
  data: T[],
  columns: (keyof T)[]
): string => {
  const headers = columns.join(",");
  const rows = data.map((row) =>
    columns.map((col) => {
      const value = row[col];
      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
      }
      return value;
    })
  );

  return [headers, ...rows.map((r) => r.join(","))].join("\n");
};

export const downloadCSV = (content: string, filename: string): void => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};