"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Define types for our data for better type-safety
export interface User {
  id: string
  name: string
  email: string
  role: string
  status: "verified" | "pending"
  joinedDate: string
  avatar: string
  teams: string[]
  departments: string[]
}

export interface Team {
  id: string
  name: string
  description: string
  leader: string
  members: string[]
  department: string
  createdDate: string
  status: "active" | "planning"
}

export interface Department {
  id: string
  name: string
  description: string
  superLeader: string
  leaders: string[]
  teams: string[]
  createdDate: string
  status: "active"
}

export const useAdminPage = () => {
  const { toast } = useToast()
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Mock data for admin panel
  const [users, setUsers] = useState<User[]>([
    {
      id: "u1",
      name: "Sami",
      email: "sami@itc.com",
      role: "admin",
      status: "verified",
      joinedDate: "2024-01-01",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team"],
      departments: ["Development"],
    },
    {
      id: "u2",
      name: "Yasmine",
      email: "yasmine@itc.com",
      role: "super_leader",
      status: "verified",
      joinedDate: "2024-01-15",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team"],
      departments: ["Development", "Design"],
    },
  ])

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team-1",
      name: "Frontend Team",
      description: "UI/UX development team",
      leader: "Yasmine",
      members: ["Sami", "Ali", "Sara"],
      department: "Development",
      createdDate: "2024-01-01",
      status: "active",
    },
  ])

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "dept-1",
      name: "Development",
      description: "Software development and engineering",
      superLeader: "Sami",
      leaders: ["Yasmine", "Omar"],
      teams: ["Frontend Team", "Backend Team", "Mobile Team"],
      createdDate: "2024-01-01",
      status: "active",
    },
  ])

  // All handler functions are now here
  const handleAddUser = async (formData: {
    name: string
    email: string
    role: string
  }) => {
    setIsLoading(true)
    setLoadingAction("add-user")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newUser: User = {
        id: `u${users.length + 1}`,
        ...formData,
        status: "pending",
        joinedDate: new Date().toISOString().split("T")[0],
        avatar: "/placeholder.svg?height=32&width=32",
        teams: [],
        departments: [],
      }
      setUsers([...users, newUser])
      toast({
        title: "User added successfully!",
        description: `${formData.name} will receive a verification email.`,
      })
      setShowAddUser(false)
    } catch {
      toast({ title: "Error", description: "Failed to add user.", variant: "destructive" })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleVerifyUser = async (userId: string) => {
    setLoadingAction(`verify-${userId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: "verified" } : user)))
      const user = users.find((u) => u.id === userId)
      toast({ title: "User verified", description: `${user?.name} can now access the platform.` })
    } catch {
      toast({ title: "Verification Failed", description: "Failed to verify user.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!window.confirm(`Are you sure you want to delete ${user?.name}?`)) return
    setLoadingAction(`delete-${userId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(users.filter((user) => user.id !== userId))
      toast({ title: "User deleted", description: `${user?.name} has been removed.` })
    } catch {
      toast({ title: "Deletion Failed", description: "Failed to delete user.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSendEmail = async (userId: string) => {
    setLoadingAction(`email-${userId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user = users.find((u) => u.id === userId)
      toast({ title: "Email sent", description: `Email has been sent to ${user?.email}` })
    } catch {
      toast({ title: "Email Failed", description: "Failed to send email.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleAddTeam = async (formData: {
    name: string
    description: string
    department: string
    leader: string
  }) => {
    setIsLoading(true)
    setLoadingAction("add-team")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newTeam: Team = {
        id: `team-${teams.length + 1}`,
        ...formData,
        members: [],
        createdDate: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setTeams([...teams, newTeam])
      toast({ title: "Team created!", description: `${formData.name} has been created.` })
      setShowAddTeam(false)
    } catch {
      toast({ title: "Error", description: "Failed to create team.", variant: "destructive" })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    if (!window.confirm(`Are you sure you want to delete ${team?.name}?`)) return
    setLoadingAction(`delete-team-${teamId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTeams(teams.filter((team) => team.id !== teamId))
      toast({ title: "Team deleted", description: `${team?.name} has been removed.` })
    } catch {
      toast({ title: "Deletion Failed", description: "Failed to delete team.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleAddDepartment = async (formData: {
    name: string
    description: string
    head: string
  }) => {
    setIsLoading(true)
    setLoadingAction("add-department")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const newDepartment: Department = {
        id: `dept-${departments.length + 1}`,
        name: formData.name,
        description: formData.description,
        superLeader: formData.head,
        leaders: [],
        teams: [],
        createdDate: new Date().toISOString().split("T")[0],
        status: "active",
      }
      setDepartments([...departments, newDepartment])
      toast({ title: "Department created!", description: `${formData.name} has been created.` })
      setShowAddDepartment(false)
    } catch {
      toast({ title: "Error", description: "Failed to create department.", variant: "destructive" })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleDeleteDepartment = async (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId)
    if (!window.confirm(`Are you sure you want to delete ${dept?.name}?`)) return
    setLoadingAction(`delete-dept-${deptId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDepartments(departments.filter((dept) => dept.id !== deptId))
      toast({ title: "Department deleted", description: `${dept?.name} has been removed.` })
    } catch {
      toast({ title: "Deletion Failed", description: "Failed to delete department.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    setLoadingAction(`role-${userId}`)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      const user = users.find((u) => u.id === userId)
      toast({ title: "Role updated", description: `${user?.name}'s role is now ${newRole}.` })
    } catch {
      toast({ title: "Role Update Failed", description: "Failed to update role.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExportData = async () => {
    setLoadingAction("export")
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const exportData = { users, teams, departments, exportDate: new Date().toISOString() }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `admin-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({ title: "Data exported", description: "Admin data has been exported." })
    } catch {
      toast({ title: "Export Failed", description: "Failed to export data.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRefreshData = async () => {
    setLoadingAction("refresh")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({ title: "Data refreshed", description: "All data has been updated." })
    } catch {
      toast({ title: "Refresh Failed", description: "Failed to refresh data.", variant: "destructive" })
    } finally {
      setLoadingAction(null)
    }
  }

  // Helper functions
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
      case "super_leader":
        return "destructive"
      case "leader":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "verified" ? "default" : "secondary"
  }

  return {
    users,
    teams,
    departments,
    showAddUser,
    setShowAddUser,
    showAddTeam,
    setShowAddTeam,
    showAddDepartment,
    setShowAddDepartment,
    isLoading,
    loadingAction,
    handleAddUser,
    handleVerifyUser,
    handleDeleteUser,
    handleSendEmail,
    handleAddTeam,
    handleDeleteTeam,
    handleAddDepartment,
    handleDeleteDepartment,
    handleChangeUserRole,
    handleExportData,
    handleRefreshData,
    getRoleBadgeVariant,
    getStatusBadgeVariant,
  }
}
