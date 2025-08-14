"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import React from "react";

export interface AuthContext {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  isAdmin: boolean;
  isManager: boolean;
  canManageTeam: (teamId: string) => Promise<boolean>;
  canManageDepartment: (departmentId: string) => Promise<boolean>;
  canManageTicket: (ticketId: string) => Promise<boolean>;
  canAccessTeam: (teamId: string) => Promise<boolean>;
  canAccessDepartment: (departmentId: string) => Promise<boolean>;
}

export function useAuthorization() {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const user = session?.user || null;
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';

  // Cache permission checks to avoid repeated API calls
  const checkPermission = async (type: string, entityId: string): Promise<boolean> => {
    if (!user) return false;
    
    const cacheKey = `${type}:${entityId}:${user.id}`;
    if (permissions[cacheKey] !== undefined) {
      return permissions[cacheKey];
    }

    try {
      const response = await fetch(`/api/auth/permissions?type=${type}&entityId=${entityId}`);
      const result = await response.json();
      
      setPermissions(prev => ({
        ...prev,
        [cacheKey]: result.allowed
      }));
      
      return result.allowed;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  };

  const canManageTeam = async (teamId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return checkPermission('team-manage', teamId);
  };

  const canManageDepartment = async (departmentId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return checkPermission('department-manage', departmentId);
  };

  const canManageTicket = async (ticketId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return checkPermission('ticket-manage', ticketId);
  };

  const canAccessTeam = async (teamId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return checkPermission('team-access', teamId);
  };

  const canAccessDepartment = async (departmentId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return checkPermission('department-access', departmentId);
  };

  return {
    user,
    isAdmin,
    isManager,
    canManageTeam,
    canManageDepartment,
    canManageTicket,
    canAccessTeam,
    canAccessDepartment,
    isLoading: status === 'loading'
  };
}

// React component for conditional rendering based on permissions
export function AuthorizedComponent({ 
  children, 
  fallback = null,
  requiresAdmin = false,
  requiresManager = false,
  teamId,
  departmentId,
  ticketId,
  action = 'access' // 'access' or 'manage'
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresAdmin?: boolean;
  requiresManager?: boolean;
  teamId?: string;
  departmentId?: string;
  ticketId?: string;
  action?: 'access' | 'manage';
}) {
  const auth = useAuthorization();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (auth.isLoading) return;
      
      // Check admin requirement
      if (requiresAdmin && !auth.isAdmin) {
        setHasPermission(false);
        return;
      }

      // Check manager requirement  
      if (requiresManager && !auth.isManager && !auth.isAdmin) {
        setHasPermission(false);
        return;
      }

      // Check entity-specific permissions
      if (teamId) {
        const canAccess = action === 'manage' 
          ? await auth.canManageTeam(teamId)
          : await auth.canAccessTeam(teamId);
        setHasPermission(canAccess);
        return;
      }

      if (departmentId) {
        const canAccess = action === 'manage'
          ? await auth.canManageDepartment(departmentId)
          : await auth.canAccessDepartment(departmentId);
        setHasPermission(canAccess);
        return;
      }

      if (ticketId) {
        const canAccess = action === 'manage'
          ? await auth.canManageTicket(ticketId)
          : true; // Anyone can access/view tickets for now
        setHasPermission(canAccess);
        return;
      }

      // Default case - if no specific requirements, allow
      setHasPermission(true);
    };

    checkPermissions();
  }, [auth, requiresAdmin, requiresManager, teamId, departmentId, ticketId, action]);

  if (auth.isLoading || hasPermission === null) {
    return <>{fallback}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}