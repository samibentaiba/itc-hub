// /admin/hook.ts
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User, Team, Department, Member, UserFormData, TeamFormData, DepartmentFormData, LoadingAction } from "./types";

/**
 * A custom hook to manage all state and logic for the Admin Page.
 * This includes data state, loading states, and all action handlers.
 * @param initialUsers - Server-fetched initial users.
 * @param initialTeams - Server-fetched initial teams.
 * @param initialDepartments - Server-fetched initial departments.
 */
export const useAdminPage = (
  initialUsers: User[],
  initialTeams: Team[],
  initialDepartments: Department[]
) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  // --- SIMULATED API DELAY ---
  const simulateApi = (duration = 1000) => new Promise(res => setTimeout(res, duration));

  // --- USER HANDLERS ---
  const handleSaveUser = async (data: UserFormData & { id?: string }) => {
    const actionId = data.id ? `edit-${data.id}` : 'add-user';
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) { // Edit existing user
        setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
        toast({ title: "User Updated", description: `${data.name}'s details have been saved.` });
      } else { // Add new user
        const newUser: User = {
          id: `u${Date.now()}`,
          ...data,
          status: "pending",
          joinedDate: new Date().toISOString().split("T")[0],
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        };
        setUsers(prev => [...prev, newUser]);
        toast({ title: "User Added", description: `${data.name} can now be managed.` });
      }
    } catch {
      toast({ title: "Error", description: "Could not save user details.", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingAction(`delete-${userId}`);
    // Optimistic update: remove user from UI immediately
    const originalUsers = users;
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await simulateApi();
      toast({ title: "User Deleted" });
    } catch {
      toast({ title: "Error Deleting User", variant: "destructive" });
      setUsers(originalUsers); // Rollback on error
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      await simulateApi(500);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'verified' } : u));
      toast({ title: "User Verified" });
    } catch {
      toast({ title: "Error Verifying User", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  // --- TEAM HANDLERS ---
  const handleSaveTeam = async (data: TeamFormData & { id?: string }) => {
    const actionId = data.id ? `edit-${data.id}` : 'add-team';
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) { // Edit
        setTeams(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
        toast({ title: "Team Updated" });
      } else { // Add
        const newTeam: Team = {
          id: `t${Date.now()}`,
          ...data,
          description: data.description || "",
          members: [],
          createdDate: new Date().toISOString().split("T")[0],
          status: "active",
        };
        setTeams(prev => [...prev, newTeam]);
        toast({ title: "Team Created" });
      }
    } catch {
      toast({ title: "Error Saving Team", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    setLoadingAction(`delete-${teamId}`);
    const originalTeams = teams;
    setTeams(prev => prev.filter(t => t.id !== teamId));
    try {
      await simulateApi();
      toast({ title: "Team Deleted" });
    } catch {
      toast({ title: "Error Deleting Team", variant: "destructive" });
      setTeams(originalTeams);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- DEPARTMENT HANDLERS ---
  const handleSaveDepartment = async (data: DepartmentFormData & { id?: string }) => {
    const actionId = data.id ? `edit-${data.id}` : 'add-department';
    setLoadingAction(actionId);
    try {
      await simulateApi();
      if (data.id) { // Edit
        setDepartments(prev => prev.map(d => d.id === data.id ? { ...d, ...data } : d));
        toast({ title: "Department Updated" });
      } else { // Add
        const newDept: Department = {
          id: `d${Date.now()}`,
          name: data.name,
          description: data.description || "",
          members: [],
          teams: [],
          createdDate: new Date().toISOString().split("T")[0],
          status: "active",
        };
        setDepartments(prev => [...prev, newDept]);
        toast({ title: "Department Created" });
      }
    } catch {
      toast({ title: "Error Saving Department", variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    setLoadingAction(`delete-${deptId}`);
    const originalDepts = departments;
    setDepartments(prev => prev.filter(d => d.id !== deptId));
    try {
      await simulateApi();
      // Also remove teams within that department
      setTeams(prev => prev.filter(t => t.departmentId !== deptId));
      toast({ title: "Department Deleted" });
    } catch {
      toast({ title: "Error Deleting Department", variant: "destructive" });
      setDepartments(originalDepts);
    } finally {
      setLoadingAction(null);
    }
  };

  // --- MEMBER MANAGEMENT ---
  const updateEntityMembers = (
    entityId: string,
    entityType: 'team' | 'department',
    updateFn: (members: Member[]) => Member[]
  ) => {
    const stateSetter = entityType === 'team' ? setTeams : setDepartments;
    stateSetter((prev: any) =>
      prev.map((entity: any) =>
        entity.id === entityId
          ? { ...entity, members: updateFn(entity.members) }
          : entity
      )
    );
  };

  const handleAddMember = (entityId: string, entityType: 'team' | 'department', userId: string, role: Member['role']) => {
    updateEntityMembers(entityId, entityType, (members) => [...members, { userId, role }]);
    toast({ title: "Member Added" });
  };
  
  const handleRemoveMember = (entityId: string, entityType: 'team' | 'department', userId: string) => {
    updateEntityMembers(entityId, entityType, (members) => members.filter((m) => m.userId !== userId));
    toast({ title: "Member Removed" });
  };

  const handleChangeMemberRole = (entityId: string, entityType: 'team' | 'department', userId: string, newRole: Member['role']) => {
    updateEntityMembers(entityId, entityType, (members) => members.map((m) => m.userId === userId ? { ...m, role: newRole } : m));
    toast({ title: "Member Role Updated" });
  };

  const handleRefreshData = async () => {
    setLoadingAction('refresh');
    try {
        await simulateApi(1500);
        // In a real app, you would re-fetch from the API here.
        // For this mock, we can just show a toast.
        toast({ title: "Data Refreshed", description: "Latest data has been loaded." });
    } catch {
        toast({ title: "Error", description: "Could not refresh data.", variant: "destructive" });
    } finally {
        setLoadingAction(null);
    }
  };

  const handleExportData = async () => {
      setLoadingAction('export');
      await simulateApi(1200);
      toast({ title: "Export Started", description: "Your data export will be available shortly." });
      setLoadingAction(null);
  };

  return {
    users, teams, departments, loadingAction,
    handleSaveUser, handleDeleteUser, handleVerifyUser,
    handleSaveTeam, handleDeleteTeam,
    handleSaveDepartment, handleDeleteDepartment,
    handleAddMember, handleRemoveMember, handleChangeMemberRole,
    handleRefreshData, handleExportData
  };
};
