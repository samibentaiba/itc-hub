import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "../utils";
import type { Member } from "../types";

/**
 * @hook useMembers
 * @description Provides functions for managing team and department members.
 * @param {() => void} handleRefreshData - A function to refresh all page data after a member action.
 * @returns {object} - Functions for adding, removing, and updating member roles.
 */
export const useMembers = (handleRefreshData: () => void) => {
  const { toast } = useToast();

  const handleAddMember = async (entityId: string, entityType: "team" | "department", userId: string, role: Member["role"]) => {
    const roleToSend = role.toUpperCase(); // LEADER or MEMBER
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members`, {
        method: "POST",
        body: JSON.stringify({ userId, role: roleToSend }),
      });
      handleRefreshData();
      toast({ title: "Member Added" });
    } catch (error: unknown) {
      toast({ title: "Error Adding Member", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (entityId: string, entityType: "team" | "department", userId: string) => {
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members/${userId}`, { method: "DELETE" });
      handleRefreshData();
      toast({ title: "Member Removed" });
    } catch (error: unknown) {
      toast({ title: "Error Removing Member", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleChangeMemberRole = async (entityId: string, entityType: "team" | "department", userId: string, newRole: Member["role"]) => {
    const roleToSend = newRole.toUpperCase();
    try {
      await apiRequest(`/api/admin/${entityType}s/${entityId}/members/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ role: roleToSend }),
      });
      handleRefreshData();
      toast({ title: "Member Role Updated" });
    } catch (error: unknown) {
      toast({ title: "Error Updating Role", description: (error as Error).message, variant: "destructive" });
    }
  };

  return {
    handleAddMember,
    handleRemoveMember,
    handleChangeMemberRole,
  };
};