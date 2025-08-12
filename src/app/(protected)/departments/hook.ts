"use client";

import type { DepartmentLocal, DepartmentStatLocal } from "../types";

// The hook now accepts the initial data fetched from the server.
// It no longer contains any data fetching or complex state logic.
export function useDepartmentsPage(
  initialDepartments: DepartmentLocal[],
  initialStats: DepartmentStatLocal[]
) {
  return {
    stats: initialStats,
    departments: initialDepartments,
  };
}
