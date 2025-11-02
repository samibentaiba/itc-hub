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
      
      let hasAccess = false;
      if (requiresAdmin && auth.isAdmin) {
        hasAccess = true;
      }

      if (requiresManager && auth.isManager) {
        hasAccess = true;
      }

      if (departmentId) {
        const canManage = await auth.canManageDepartment(departmentId);
        if (requiresManager && canManage) {
          hasAccess = true;
        }
      }

      if (teamId) {
        const canManage = await auth.canManageTeam(teamId);
        if (requiresManager && canManage) {
          hasAccess = true;
        }
      }

      setHasPermission(hasAccess);
    };

    checkPermissions();
  }, [auth, requiresAdmin, requiresManager, teamId, departmentId, action]);

  if (auth.isLoading || hasPermission === null) {
    return <>{fallback}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}