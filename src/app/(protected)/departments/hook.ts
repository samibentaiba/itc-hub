// src/app/(protected)/departments/hook.ts

"use client";

import type { 
  DepartmentWithDetails, 
  
  UseDepartmentsPageReturn 
} from "./types";
import type { DepartmentStatLocal} from "../types"
// The hook now accepts the initial data fetched from the server.
// It no longer contains any data fetching or complex state logic.
export function useDepartmentsPage(
  initialDepartments: DepartmentWithDetails[],
  initialStats: DepartmentStatLocal[]
): UseDepartmentsPageReturn {
  return {
    stats: initialStats,
    departments: initialDepartments,
  };
}