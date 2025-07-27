import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/userService";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "@/services/teamService";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departmentService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  teams: string[];
  departments: string[];
  joinedDate: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  leader: string;
  members: string[];
  department: string;
  status: string;
  createdDate: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  superLeader: string;
  leaders: string[];
  teams: string[];
  status: string;
  createdDate: string;
}

export function useAdmin() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function fetchAll() {
    setLoading(true);
    try {
      const [usersRes, teamsRes, departmentsRes] = await Promise.all([
        getUsers(),
        getTeams(),
        getDepartments(),
      ]);
      setUsers(usersRes);
      setTeams(teamsRes);
      setDepartments(departmentsRes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddUser = async (formData: any) => {
    try {
      const res = await createUser(formData);
      if (res.ok) {
        await fetchAll();
        toast({
          title: "User added successfully!",
          description: `${formData.name} has been added and will receive a verification email.`,
        });
        setShowAddUser(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      // Update user status to verified
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: "verified" } : user
        )
      );
      toast({
        title: "User verified",
        description: "User has been verified and can now access the platform.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Optionally implement DELETE in API
      setUsers(users.filter((user) => user.id !== userId));
      toast({
        title: "User deleted",
        description: "User has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleAddTeam = async (formData: any) => {
    try {
      const res = await createTeam(formData);
      if (res.ok) {
        const newTeam = await res.json();
        setTeams((prev) => [...prev, newTeam]);
        toast({
          title: "Team created successfully!",
          description: `${formData.name} team has been created.`,
        });
        setShowAddTeam(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create team",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      // Optionally implement DELETE in API
      setTeams(teams.filter((team) => team.id !== teamId));
      toast({
        title: "Team deleted",
        description: "Team has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  const handleAddDepartment = async (formData: any) => {
    try {
      const res = await createDepartment(formData);
      if (res.ok) {
        const newDept = await res.json();
        setDepartments((prev) => [...prev, newDept]);
        toast({
          title: "Department created successfully!",
          description: `${formData.name} department has been created.`,
        });
        setShowAddDepartment(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to create department",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    try {
      // Optionally implement DELETE in API
      setDepartments(departments.filter((dept) => dept.id !== deptId));
      toast({
        title: "Department deleted",
        description: "Department has been removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      // Optionally implement PATCH in API
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "SUPERLEADER":
        return "destructive";
      case "LEADER":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "verified"
      ? "default"
      : status === "pending"
      ? "secondary"
      : "outline";
  };

  return {
    // State
    showAddUser,
    setShowAddUser,
    showAddTeam,
    setShowAddTeam,
    showAddDepartment,
    setShowAddDepartment,
    users,
    teams,
    departments,
    loading,

    // Handlers
    handleAddUser,
    handleVerifyUser,
    handleDeleteUser,
    handleAddTeam,
    handleDeleteTeam,
    handleAddDepartment,
    handleDeleteDepartment,
    handleChangeUserRole,

    // Utilities
    getRoleBadgeVariant,
    getStatusBadgeVariant,
  };
}
