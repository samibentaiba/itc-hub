import { useState, useEffect } from "react";
import { getDepartments } from "@/services/departmentService";

interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  members: DepartmentMember[];
  tickets?: any[];
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const getDepartmentMembersByRole = (department: Department) => {
    const leaders = department.members.filter(
      (m) => m.role === "LEADER" || m.role === "SUPERLEADER"
    );
    const members = department.members.filter((m) => m.role === "MEMBER");
    const memberCount = leaders.length + members.length;
    const ticketCount = department.tickets?.length || 0;

    return {
      leaders,
      members,
      memberCount,
      ticketCount,
    };
  };

  return {
    departments,
    loading,
    getDepartmentMembersByRole,
  };
}
