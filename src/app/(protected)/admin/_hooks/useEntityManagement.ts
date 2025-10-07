
// /app/(protected)/admin/_hooks/useEntityManagement.ts
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./useApiHelper";
import type { User, Team, Department, UserFormData, TeamFormData, DepartmentFormData } from "../types";

// A helper function to transform API responses into the shape the frontend expects.
const transformApiResponse = (item: any, type: 'user' | 'team' | 'department') => {
  switch (type) {
    case 'user':
      return { ...item, joinedDate: item.createdAt, avatar: item.avatar || `https://i.pravatar.cc/150?u=${item.id}` };
    case 'team':
      return { ...item, createdDate: item.createdAt, status: 'active' };
    case 'department':
      return { ...item, createdDate: item.createdAt, status: 'active' };
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
  const [users, setUsers] = useState<User[]>(initialUsers.map(u => transformApiResponse(u, 'user')));
  const [teams, setTeams] = useState<Team[]>(initialTeams.map(t => transformApiResponse(t, 'team')));
  const [departments, setDepartments] = useState<Department[]>(initialDepartments.map(d => transformApiResponse(d, 'department')));
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
      
      const stateUpdater = {
        user: setUsers,
        team: setTeams,
        department: setDepartments,
      };

      stateUpdater[entityType]((prev: any[]) => 
        isEdit 
          ? prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } : item))
          : [savedItem, ...prev]
      );
      
      toast({ title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${isEdit ? "Updated" : "Created"}` });
      return true;
    } catch (error: any) {
      toast({ title: `Error Saving ${entityType}`, description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  // --- Generic Delete Handler ---
  const handleDelete = async (id: string, entityType: 'user' | 'team' | 'department') => {
    setLoadingAction(`delete-${entityType}-${id}`);
    
    const stateUpdater = {
      user: setUsers,
      team: setTeams,
      department: setDepartments,
    };
    const originalState = {
      user: users,
      team: teams,
      department: departments,
    };

    // Optimistically update UI
    stateUpdater[entityType]((prev: any[]) => prev.filter((item) => item.id !== id));
    if (entityType === 'department') {
      setTeams((prev) => prev.filter((t) => t.departmentId !== id));
    }

    try {
      await apiRequest(`/api/admin/${entityType}s/${id}`, { method: "DELETE" });
      toast({ title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Deleted` });
    } catch (error: any) {
      toast({ title: `Error Deleting ${entityType}`, description: error.message, variant: "destructive" });
      // Rollback on error
      stateUpdater[entityType](originalState[entityType] as any);
      if (entityType === 'department') {
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
      const updatedUser = transformApiResponse(updatedUserData, 'user');
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: "User Verified" });
    } catch (error: any) {
      toast({ title: "Error Verifying User", description: error.message, variant: "destructive" });
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
