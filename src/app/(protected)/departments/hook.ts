"use client";

import type { Department, DepartmentStat } from "./types";

// The hook now accepts the initial data fetched from the server.
// It no longer contains any data fetching or complex state logic.
export function useDepartmentsPage(
  initialDepartments: Department[],
  initialStats: DepartmentStat[]
) {
  return {
    stats: initialStats,
    departments: initialDepartments,
  };
}
