// /app/(protected)/admin/_hooks/useEntityManagement.ts
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./useApiHelper";
import type { User, Team, Department, UserFormData, TeamFormData, DepartmentFormData } from "../types";

// A helper function to transform API responses into the shape the frontend expects.
const transformApiResponse = (item: Record<string, unknown>, type: 'user' | 'team' | 'department') => {
  switch (type) {
    case 'user':
      return { ...item, joinedDate: item.createdAt, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` } as User;
    case 'team':
      return { ...item, createdDate: item.createdAt, status: 'active' } as Team;
    case 'department':
      return { ...item, createdDate: item.createdAt, status: 'active' } as Department;
    default:
      return item;
  }
};

export const useEntityManagement = (
  initialUsers: User[],
  initialTeams: Team[],
  initialDepartments: Department[]
) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers.map(u => transformApiResponse(u, 'user')) as User[]);
  const [teams, setTeams] = useState<Team[]>(initialTeams.map(t => transformApiResponse(t, 'team')) as Team[]);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.map(d => transformApiResponse(d, 'department')) as Department[]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // --- Generic Save Handler ---
  const handleSave = async <T extends UserFormData | TeamFormData | DepartmentFormData>(
    data: T & { id?: string },
    entityType: 'user' | 'team' | 'department'
  ) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/${entityType}s/${data.id}` : `/api/admin/${entityType}s`;
    const method = isEdit ? "PUT" : "POST";
    const action = isEdit ? `edit-${entityType}-${data.id}` : `add-${entityType}`;
    
    setLoadingAction(action);

    try {
      const resultData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedItem = transformApiResponse(resultData, entityType);
      
 

      if (entityType === 'user') {
        setUsers((prev: User[]) =>
          isEdit
            ? prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } as User : item))
            : [savedItem as User, ...prev]
        );
      } else if (entityType === 'team') {
        setTeams((prev: Team[]) =>
          isEdit
            ? prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } as Team : item))
            : [savedItem as Team, ...prev]
        );
      } else if (entityType === 'department') {
        setDepartments((prev: Department[]) =>
          isEdit
            ? prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } as Department : item))
            : [savedItem as Department, ...prev]
        );
      }
      
      toast({ title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${isEdit ? "Updated" : "Created"}` });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Could not save ${entityType}`;
      toast({ title: `Error Saving ${entityType}`, description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Generic Delete Handler ---
  const handleDelete = async (id: string, entityType: 'user' | 'team' | 'department') => {
    setLoadingAction(`delete-${entityType}-${id}`);
    

    const originalState = {
      user: users,
      team: teams,
      department: departments,
    };

    // Optimistically update UI
    if (entityType === 'user') {
      setUsers((prev) => prev.filter((item) => item.id !== id));
    } else if (entityType === 'team') {
      setTeams((prev) => prev.filter((item) => item.id !== id));
    } else if (entityType === 'department') {
      setDepartments((prev) => prev.filter((item) => item.id !== id));
      setTeams((prev) => prev.filter((t) => t.departmentId !== id));
    }

    try {
      await apiRequest(`/api/admin/${entityType}s/${id}`, { method: "DELETE" });
      toast({ title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Deleted` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : `Could not delete ${entityType}`;
      toast({ title: `Error Deleting ${entityType}`, description: message, variant: "destructive" });
      // Rollback on error
      if (entityType === 'user') {
        setUsers(originalState.user);
      } else if (entityType === 'team') {
        setTeams(originalState.team);
      } else if (entityType === 'department') {
        setDepartments(originalState.department);
        setTeams(originalState.team);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Specific User Action ---
  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      const updatedUserData = await apiRequest(`/api/admin/users/${userId}/verify`, { method: "POST" });
      const updatedUser = transformApiResponse(updatedUserData, 'user') as User;
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: "User Verified" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not verify user";
      toast({ title: "Error Verifying User", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const isUserFormLoading = loadingAction?.includes('user');
  const isTeamFormLoading = loadingAction?.includes('team');
  const isDeptFormLoading = loadingAction?.includes('department');

  return {
    users, setUsers,
    teams, setTeams,
    departments, setDepartments,
    loadingAction, setLoadingAction,
    handleSaveUser: (data: UserFormData & { id?: string }) => handleSave(data, 'user'),
    handleDeleteUser: (id: string) => handleDelete(id, 'user'),
    handleVerifyUser,
    handleSaveTeam: (data: TeamFormData & { id?: string }) => handleSave(data, 'team'),
    handleDeleteTeam: (id: string) => handleDelete(id, 'team'),
    handleSaveDepartment: (data: DepartmentFormData & { id?: string }) => handleSave(data, 'department'),
    handleDeleteDepartment: (id: string) => handleDelete(id, 'department'),
    isUserFormLoading,
    isTeamFormLoading,
    isDeptFormLoading,
    transformApiResponse,
  };
};