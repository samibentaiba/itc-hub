"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Shield,
  Users,
  Building2,
  UserPlus,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  Mail,
  Settings,
  Loader2,
  Download,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminPanel() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const { toast } = useToast()

  // Mock data for admin panel
  const [users, setUsers] = useState([
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
    {
      id: "u3",
      name: "Ali",
      email: "ali@itc.com",
      role: "member",
      status: "verified",
      joinedDate: "2024-02-01",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Frontend Team", "Backend Team"],
      departments: [],
    },
    {
      id: "u4",
      name: "Sara",
      email: "sara@itc.com",
      role: "leader",
      status: "pending",
      joinedDate: "2024-02-15",
      avatar: "/placeholder.svg?height=32&width=32",
      teams: ["Mobile Team"],
      departments: [],
    },
  ])

  const [teams, setTeams] = useState([
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
    {
      id: "team-2",
      name: "Backend Team",
      description: "Server-side development team",
      leader: "Omar",
      members: ["Ali", "Ahmed"],
      department: "Development",
      createdDate: "2024-01-15",
      status: "active",
    },
    {
      id: "team-3",
      name: "Mobile Team",
      description: "Mobile app development team",
      leader: "Sara",
      members: ["Layla", "Nour"],
      department: "Development",
      createdDate: "2024-02-01",
      status: "planning",
    },
  ])

  const [departments, setDepartments] = useState([
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
    {
      id: "dept-2",
      name: "Design",
      description: "UI/UX design and user research",
      superLeader: "Yasmine",
      leaders: ["Nour"],
      teams: ["Design Team"],
      createdDate: "2024-01-10",
      status: "active",
    },
  ])

  const handleAddUser = async (formData: any) => {
    setIsLoading(true)
    setLoadingAction("add-user")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser = {
        id: `u${users.length + 1}`,
        ...formData,
        status: "pending",
        joinedDate: new Date().toISOString().split("T")[0],
        avatar: "/placeholder.svg?height=32&width=32",
        teams: [],
        departments: [],
      }

      setUsers([...users, newUser])

      // Send verification email (simulated)
      setTimeout(() => {
        toast({
          title: "Verification email sent!",
          description: `Verification email has been sent to ${formData.email}`,
        })
      }, 1000)

      toast({
        title: "User added successfully!",
        description: `${formData.name} has been added and will receive a verification email.`,
      })
      setShowAddUser(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
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

      toast({
        title: "User verified",
        description: `${user?.name} has been verified and can now access the platform.`,
      })
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const user = users.find((u) => u.id === userId)

    if (!confirm(`Are you sure you want to delete ${user?.name}? This action cannot be undone.`)) {
      return
    }

    setLoadingAction(`delete-${userId}`)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUsers(users.filter((user) => user.id !== userId))

      toast({
        title: "User deleted",
        description: `${user?.name} has been removed from the system.`,
      })
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSendEmail = async (userId: string) => {
    setLoadingAction(`email-${userId}`)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = users.find((u) => u.id === userId)

      toast({
        title: "Email sent",
        description: `Email has been sent to ${user?.email}`,
      })
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleAddTeam = async (formData: any) => {
    setIsLoading(true)
    setLoadingAction("add-team")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newTeam = {
        id: `team-${teams.length + 1}`,
        ...formData,
        members: [],
        createdDate: new Date().toISOString().split("T")[0],
        status: "active",
      }

      setTeams([...teams, newTeam])

      toast({
        title: "Team created successfully!",
        description: `${formData.name} team has been created.`,
      })
      setShowAddTeam(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)

    if (!confirm(`Are you sure you want to delete ${team?.name}? This will affect ${team?.members.length} members.`)) {
      return
    }

    setLoadingAction(`delete-team-${teamId}`)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTeams(teams.filter((team) => team.id !== teamId))

      toast({
        title: "Team deleted",
        description: `${team?.name} has been removed from the system.`,
      })
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleAddDepartment = async (formData: any) => {
    setIsLoading(true)
    setLoadingAction("add-department")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newDepartment = {
        id: `dept-${departments.length + 1}`,
        ...formData,
        leaders: [],
        teams: [],
        createdDate: new Date().toISOString().split("T")[0],
        status: "active",
      }

      setDepartments([...departments, newDepartment])

      toast({
        title: "Department created successfully!",
        description: `${formData.name} department has been created.`,
      })
      setShowAddDepartment(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }

  const handleDeleteDepartment = async (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId)

    if (!confirm(`Are you sure you want to delete ${dept?.name}? This will affect ${dept?.teams.length} teams.`)) {
      return
    }

    setLoadingAction(`delete-dept-${deptId}`)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDepartments(departments.filter((dept) => dept.id !== deptId))

      toast({
        title: "Department deleted",
        description: `${dept?.name} has been removed from the system.`,
      })
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete department. Please try again.",
        variant: "destructive",
      })
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

      toast({
        title: "Role updated",
        description: `${user?.name}'s role has been changed to ${newRole}.`,
      })
    } catch (error) {
      toast({
        title: "Role Update Failed",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExportData = async () => {
    setLoadingAction("export")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const exportData = {
        users,
        teams,
        departments,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `admin-data-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported successfully",
        description: "Admin data has been exported to your downloads folder.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRefreshData = async () => {
    setLoadingAction("refresh")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate data refresh
      toast({
        title: "Data refreshed",
        description: "All data has been refreshed from the server.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(null)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "super_leader":
        return "destructive"
      case "leader":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "verified" ? "default" : status === "pending" ? "secondary" : "outline"
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground">Manage users, teams, and departments</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={loadingAction === "refresh"}
            className="text-xs sm:text-sm bg-transparent"
          >
            {loadingAction === "refresh" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={loadingAction === "export"}
            className="text-xs sm:text-sm bg-transparent"
          >
            {loadingAction === "export" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.status === "pending").length} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {teams.filter((t) => t.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">{teams.length} total teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{departments.length}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Admins</CardTitle>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="text-xs sm:text-sm">
            Users
          </TabsTrigger>
          <TabsTrigger value="teams" className="text-xs sm:text-sm">
            Teams
          </TabsTrigger>
          <TabsTrigger value="departments" className="text-xs sm:text-sm">
            Departments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
                  <CardDescription className="text-sm">Add, verify, and manage user accounts</CardDescription>
                </div>
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm" disabled={isLoading}>
                      {loadingAction === "add-user" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="mr-2 h-4 w-4" />
                      )}
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account and send verification email</DialogDescription>
                    </DialogHeader>
                    <AddUserForm onSubmit={handleAddUser} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="rounded-md border overflow-hidden">
                <ScrollArea className="h-[400px] sm:h-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">User</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Role</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Teams</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Departments</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Joined</TableHead>
                        <TableHead className="w-[50px] sm:w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="p-2 sm:p-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="font-medium text-xs sm:text-sm truncate">{user.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleChangeUserRole(user.id, value)}
                              disabled={loadingAction === `role-${user.id}`}
                            >
                              <SelectTrigger className="w-24 sm:w-32 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_leader">Super Leader</SelectItem>
                                <SelectItem value="leader">Leader</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                              <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                                {user.status}
                              </Badge>
                              {user.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifyUser(user.id)}
                                  disabled={loadingAction === `verify-${user.id}`}
                                  className="h-5 px-2 text-xs sm:h-6"
                                >
                                  {loadingAction === `verify-${user.id}` ? (
                                    <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  )}
                                  Verify
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {user.teams.slice(0, 2).map((team) => (
                                <Badge key={team} variant="outline" className="text-xs">
                                  {team}
                                </Badge>
                              ))}
                              {user.teams.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.teams.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {user.departments.slice(0, 1).map((dept) => (
                                <Badge key={dept} variant="outline" className="text-xs">
                                  {dept}
                                </Badge>
                              ))}
                              {user.departments.length > 1 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.departments.length - 1}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-xs">{user.joinedDate}</TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                  disabled={loadingAction?.includes(user.id)}
                                >
                                  {loadingAction?.includes(user.id) ? (
                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSendEmail(user.id)}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Manage Access
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Team Management</CardTitle>
                  <CardDescription className="text-sm">Create and manage teams</CardDescription>
                </div>
                <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm" disabled={isLoading}>
                      {loadingAction === "add-team" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                      <DialogDescription>Set up a new team workspace</DialogDescription>
                    </DialogHeader>
                    <AddTeamForm onSubmit={handleAddTeam} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="rounded-md border overflow-hidden">
                <ScrollArea className="h-[400px] sm:h-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Team Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Leader</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Members</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Department</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Created</TableHead>
                        <TableHead className="w-[50px] sm:w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell className="p-2 sm:p-4">
                            <div>
                              <div className="font-medium text-xs sm:text-sm">{team.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{team.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden sm:table-cell text-xs sm:text-sm">
                            {team.leader}
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {team.members.slice(0, 2).map((member) => (
                                <Badge key={member} variant="outline" className="text-xs">
                                  {member}
                                </Badge>
                              ))}
                              {team.members.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{team.members.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">
                            {team.department}
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <Badge variant={team.status === "active" ? "default" : "secondary"} className="text-xs">
                              {team.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-xs">{team.createdDate}</TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                  disabled={loadingAction?.includes(team.id)}
                                >
                                  {loadingAction?.includes(team.id) ? (
                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Team
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Manage Members
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTeam(team.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Department Management</CardTitle>
                  <CardDescription className="text-sm">Create and manage departments</CardDescription>
                </div>
                <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm" disabled={isLoading}>
                      {loadingAction === "add-department" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Create Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Department</DialogTitle>
                      <DialogDescription>Set up a new department</DialogDescription>
                    </DialogHeader>
                    <AddDepartmentForm onSubmit={handleAddDepartment} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="rounded-md border overflow-hidden">
                <ScrollArea className="h-[400px] sm:h-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Department Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Super Leader</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Leaders</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Teams</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Created</TableHead>
                        <TableHead className="w-[50px] sm:w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell className="p-2 sm:p-4">
                            <div>
                              <div className="font-medium text-xs sm:text-sm">{dept.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{dept.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden sm:table-cell text-xs sm:text-sm">
                            {dept.superLeader}
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {dept.leaders.map((leader) => (
                                <Badge key={leader} variant="outline" className="text-xs">
                                  {leader}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {dept.teams.slice(0, 2).map((team) => (
                                <Badge key={team} variant="outline" className="text-xs">
                                  {team}
                                </Badge>
                              ))}
                              {dept.teams.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{dept.teams.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <Badge variant={dept.status === "active" ? "default" : "secondary"} className="text-xs">
                              {dept.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-xs">{dept.createdDate}</TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                  disabled={loadingAction?.includes(dept.id)}
                                >
                                  {loadingAction?.includes(dept.id) ? (
                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                  ) : (
                                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Department
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Manage Leaders
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Department
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add User Form Component
function AddUserForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
    setFormData({ name: "", email: "", role: "member" })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userName" className="text-sm">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="userName"
          placeholder="Enter user's full name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={cn("text-sm", errors.name && "border-red-500")}
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="userEmail" className="text-sm">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="userEmail"
          type="email"
          placeholder="Enter user's email..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={cn("text-sm", errors.email && "border-red-500")}
          disabled={isLoading}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Initial Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
          disabled={isLoading}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">🛡️ Admin</SelectItem>
            <SelectItem value="super_leader">👑 Super Leader</SelectItem>
            <SelectItem value="leader">⭐ Leader</SelectItem>
            <SelectItem value="member">👤 Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          className="text-sm bg-transparent"
          disabled={isLoading}
          onClick={() => {
            setFormData({ name: "", email: "", role: "member" })
            setErrors({})
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-sm"
          disabled={isLoading || !formData.name || !formData.email}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding User...
            </>
          ) : (
            "Add User"
          )}
        </Button>
      </div>
    </form>
  )
}

// Add Team Form Component
function AddTeamForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    department: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
    setFormData({ name: "", description: "", leader: "", department: "" })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teamName" className="text-sm">
          Team Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="teamName"
          placeholder="Enter team name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={cn("text-sm", errors.name && "border-red-500")}
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamDescription" className="text-sm">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="teamDescription"
          placeholder="Describe the team's purpose..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("text-sm min-h-[80px]", errors.description && "border-red-500")}
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">Team Leader</Label>
          <Select
            value={formData.leader}
            onValueChange={(value) => setFormData({ ...formData, leader: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select leader" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No leader assigned</SelectItem>
              <SelectItem value="Sami">👤 Sami</SelectItem>
              <SelectItem value="Yasmine">👤 Yasmine</SelectItem>
              <SelectItem value="Ali">👤 Ali</SelectItem>
              <SelectItem value="Sara">👤 Sara</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
            disabled={isLoading}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No department</SelectItem>
              <SelectItem value="Development">🏢 Development</SelectItem>
              <SelectItem value="Design">🏢 Design</SelectItem>
              <SelectItem value="Marketing">🏢 Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          className="text-sm bg-transparent"
          disabled={isLoading}
          onClick={() => {
            setFormData({ name: "", description: "", leader: "", department: "" })
            setErrors({})
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-sm"
          disabled={isLoading || !formData.name || !formData.description}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Team...
            </>
          ) : (
            "Create Team"
          )}
        </Button>
      </div>
    </form>
  )
}

// Add Department Form Component
function AddDepartmentForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    superLeader: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
    setFormData({ name: "", description: "", superLeader: "" })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deptName" className="text-sm">
          Department Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="deptName"
          placeholder="Enter department name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={cn("text-sm", errors.name && "border-red-500")}
          disabled={isLoading}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="deptDescription" className="text-sm">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="deptDescription"
          placeholder="Describe the department's role..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("text-sm min-h-[80px]", errors.description && "border-red-500")}
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Super Leader</Label>
        <Select
          value={formData.superLeader}
          onValueChange={(value) => setFormData({ ...formData, superLeader: value })}
          disabled={isLoading}
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select super leader" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No super leader assigned</SelectItem>
            <SelectItem value="Sami">👑 Sami</SelectItem>
            <SelectItem value="Yasmine">👑 Yasmine</SelectItem>
            <SelectItem value="Ali">👑 Ali</SelectItem>
            <SelectItem value="Sara">👑 Sara</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          className="text-sm bg-transparent"
          disabled={isLoading}
          onClick={() => {
            setFormData({ name: "", description: "", superLeader: "" })
            setErrors({})
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-sm"
          disabled={isLoading || !formData.name || !formData.description}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Department...
            </>
          ) : (
            "Create Department"
          )}
        </Button>
      </div>
    </form>
  )
}
