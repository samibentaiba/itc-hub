import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, transformApiResponse } from "../utils";
import type { User, UserFormData } from "../types";

/**
 * @hook useUsers
 * @description Manages state and actions related to users.
 * @param {User[]} initialUsers - The initial list of users.
 * @returns {object} - The users state and action handlers.
 */
export const useUsers = (initialUsers: User[]) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSaveUser = async (data: UserFormData & { id?: string }) => {
    const isEdit = !!data.id;
    const url = isEdit ? `/api/admin/users/${data.id}` : "/api/admin/users";
    const method = isEdit ? "PUT" : "POST";
    setLoadingAction(isEdit ? `edit-${data.id}` : "add-user");

    try {
      const savedUserData = await apiRequest(url, { method, body: JSON.stringify(data) });
      const savedUser = transformApiResponse(savedUserData as Record<string, unknown>, 'user') as User;

      if (isEdit) {
        setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)));
      } else {
        setUsers((prev) => [savedUser, ...prev]);
      }
      toast({ title: isEdit ? "User Updated" : "User Added" });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Could not save user details.";
      toast({ title: "Error", description: message, variant: "destructive" });
      return false;
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingAction(`delete-${userId}`);
    const originalUsers = users;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    try {
      await apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" });
      toast({ title: "User Deleted" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Deleting User";
      toast({ title: "Error Deleting User", description: message, variant: "destructive" });
      setUsers(originalUsers);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`);
    try {
      const updatedUserData = await apiRequest(`/api/admin/users/${userId}/verify`, { method: "POST" });
      const updatedUser = transformApiResponse(updatedUserData as Record<string, unknown>, 'user') as User;
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      toast({ title: "User Verified" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error Verifying User";
      toast({ title: "Error Verifying User", description: message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return {
    users,
    setUsers,
    loadingAction,
    handleSaveUser,
    handleDeleteUser,
    handleVerifyUser,
  };
};