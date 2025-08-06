import { type Department, type DepartmentStat } from "./types";
import data from "./mock.json";

/**
 * Simulates fetching all department data from an API.
 * @returns A promise that resolves to an array of departments.
 */
export const fetchDepartments = async (): Promise<Department[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.departments as Department[];
};

/**
 * Simulates fetching all department statistics from an API.
 * @returns A promise that resolves to an array of department stats.
 */
export const fetchDepartmentStats = async (): Promise<DepartmentStat[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.stats as DepartmentStat[];
};
