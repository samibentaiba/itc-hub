"use client"
import { WorkspaceLayout } from "@/components/workspace-layout"
import type React from "react"
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
} from "lucide-react"
import { RoleBadge } from "@/components/common/RoleBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AvatarDisplay } from "@/components/common/AvatarDisplay";
import { UserForm } from "@/components/forms/UserForm";
import { TeamForm } from "@/components/forms/TeamForm";
import { DepartmentForm } from "@/components/forms/DepartmentForm";
import { useAdmin } from "./hook";

export default function AdminPage() {
  const {
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
    handleAddUser,
    handleVerifyUser,
    handleDeleteUser,
    handleAddTeam,
    handleDeleteTeam,
    handleAddDepartment,
    handleDeleteDepartment,
    handleChangeUserRole,
    getRoleBadgeVariant,
    getStatusBadgeVariant,
  } = useAdmin();

  if (loading) return <div>Loading admin panel...</div>

  return (
    <WorkspaceLayout>
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.status === "pending").length} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {teams.filter((t) => t.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">{teams.length} total teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-red-500">{departments.length}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Admins</CardTitle>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pt-0">
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
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account and send verification email</DialogDescription>
                    </DialogHeader>
                    <UserForm
                      onSubmit={handleAddUser}
                      onCancel={() => setShowAddUser(false)}
                      submitLabel="Add User"
                    />
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
                              <AvatarDisplay name={user.name} avatar={user.avatar} size={8} />
                              <div className="min-w-0">
                                <div className="font-medium text-xs sm:text-sm truncate">{user.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                              <StatusBadge status={user.status} />
                              {user.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerifyUser(user.id)}
                                  className="h-5 px-2 text-xs sm:h-6"
                                >
                                  <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  Verify
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {user.teams.slice(0, 2).map((team: string) => (
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
                              {user.departments.slice(0, 1).map((dept: string) => (
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
                                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
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
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                      <DialogDescription>Set up a new team workspace</DialogDescription>
                    </DialogHeader>
                    <TeamForm
                      onSubmit={handleAddTeam}
                      onCancel={() => setShowAddTeam(false)}
                      submitLabel="Create Team"
                    />
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
                              {team.members.slice(0, 2).map((member: string) => (
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
                                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
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
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Department</DialogTitle>
                      <DialogDescription>Set up a new department</DialogDescription>
                    </DialogHeader>
                    <DepartmentForm
                      onSubmit={handleAddDepartment}
                      onCancel={() => setShowAddDepartment(false)}
                      submitLabel="Create Department"
                    />
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
                              {dept.leaders.map((leader: string) => (
                                <Badge key={leader} variant="outline" className="text-xs">
                                  {leader}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {dept.teams.slice(0, 2).map((team: string) => (
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
                                <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
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
    </WorkspaceLayout>
  )
}

