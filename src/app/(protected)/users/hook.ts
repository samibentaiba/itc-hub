"use client";

import { useState, useMemo } from "react";
import type { UserLocal } from "../types";

export function useUsersPage(initialUsers: UserLocal[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.role.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [initialUsers, searchTerm, departmentFilter, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Away": return "bg-yellow-500";
      case "Offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "Active": return "default";
      case "Away": return "secondary";
      case "Offline": return "outline";
      default: return "outline";
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    filteredUsers,
    getStatusColor,
    getStatusVariant
  };
}
