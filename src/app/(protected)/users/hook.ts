import { useState, useEffect } from "react";
import { getUsers } from "@/services/userService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  teams?: any[];
  departments?: any[];
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERLEADER":
        return "default";
      case "LEADER":
        return "secondary";
      case "ADMIN":
        return "destructive";
      case "MEMBER":
        return "outline";
      case "GUEST":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPERLEADER":
        return "Super Leader";
      case "LEADER":
        return "Leader";
      case "ADMIN":
        return "Admin";
      case "MEMBER":
        return "Member";
      case "GUEST":
        return "Guest";
      default:
        return role;
    }
  };

  return {
    users,
    loading,
    getRoleBadgeVariant,
    getRoleDisplayName,
  };
}
