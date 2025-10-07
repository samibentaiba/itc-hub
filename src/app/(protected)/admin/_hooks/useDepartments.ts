import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, transformApiResponse } from "../utils";
import type { Department, DepartmentFormData, Team } from "../types";

/**
 * @hook useDepartments
 * @description Manages state and actions related to departments.
 * @param {Department[]} initialDepartments - The initial list of departments.
 * @param {React.Dispatch<React.SetStateAction<Team[]>>} setTeams - A function to update the teams state.
 * @returns {object} - The departments state and action handlers.
 */
export const useDepartments = (
  initialDepartments: Department[],
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
) => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveDepartment = async (data: DepartmentFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/departments/${data.id}` : "/api/admin/departments";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-department");

    try {
      const savedDeptData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedDept = transformApiResponse(savedDeptData, 'department');

      if (isEdit) {
        setDepartments((prev) => prev.map((d) => (d.id === savedDept.id ? { ...d, ...savedDept } : d)));
      } else {
        setDepartments((prev) => [savedDept, ...prev]);
      }
      toast({ title: isEdit ? "Department Updated" : "Department Created" });
      return true;
    } catch (error: any) {
      toast({ title: "Error Saving Department", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    setLoadingAction(`delete-${deptId}`);
    const originalDepts = departments;
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setTeams((prev) => prev.filter((t) => t.departmentId !== deptId)); // Also remove teams from UI
    try {
      await apiRequest(`/api/admin/departments/${deptId}`, { method: "DELETE" });
      toast({ title: "Department Deleted" });
    } catch (error: any) {
      toast({ title: "Error Deleting Department", description: error.message, variant: "destructive" });
      setDepartments(originalDepts);
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    departments,
    setDepartments,
    loadingAction,
    handleSaveDepartment,
    handleDeleteDepartment,
  };
};