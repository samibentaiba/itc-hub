"use client"

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
import { useToast } from "@/hooks/use-toast"

export function AdminPanel() {
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddTeam, setShowAddTeam] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState(false)
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

  const handleAddUser = (formData: any) => {
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
    toast({
      title: "User added successfully!",
      description: `${formData.name} has been added and will receive a verification email.`,
    })
    setShowAddUser(false)
  }

  const handleVerifyUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "verified" } : user)))
    toast({
      title: "User verified",
      description: "User has been verified and can now access the platform.",
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "User deleted",
      description: "User has been removed from the system.",
    })
  }

  const handleAddTeam = (formData: any) => {
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
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
    toast({
      title: "Team deleted",
      description: "Team has been removed from the system.",
    })
  }

  const handleAddDepartment = (formData: any) => {
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
  }

  const handleDeleteDepartment = (deptId: string) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId))
    toast({
      title: "Department deleted",
      description: "Department has been removed from the system.",
    })
  }

  const handleChangeUserRole = (userId: string, newRole: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    toast({
      title: "Role updated",
      description: `User role has been changed to ${newRole}.`,
    })
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-500" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage users, teams, and departments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.status === "pending").length} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{teams.filter((t) => t.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">{teams.length} total teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{departments.length}</div>
            <p className="text-xs text-muted-foreground">All active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{users.filter((u) => u.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add, verify, and manage user accounts</CardDescription>
                </div>
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account and send verification email</DialogDescription>
                    </DialogHeader>
                    <AddUserForm onSubmit={handleAddUser} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={user.role} onValueChange={(value) => handleChangeUserRole(user.id, value)}>
                          <SelectTrigger className="w-32">
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                          {user.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyUser(user.id)}
                              className="h-6 px-2"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.teams.map((team) => (
                            <Badge key={team} variant="outline" className="text-xs">
                              {team}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.departments.map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{user.joinedDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Create and manage teams</CardDescription>
                </div>
                <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                      <DialogDescription>Set up a new team workspace</DialogDescription>
                    </DialogHeader>
                    <AddTeamForm onSubmit={handleAddTeam} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">{team.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{team.leader}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {team.members.slice(0, 3).map((member) => (
                            <Badge key={member} variant="outline" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                          {team.members.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{team.members.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{team.department}</TableCell>
                      <TableCell>
                        <Badge variant={team.status === "active" ? "default" : "secondary"}>{team.status}</Badge>
                      </TableCell>
                      <TableCell>{team.createdDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
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
                            <DropdownMenuItem onClick={() => handleDeleteTeam(team.id)} className="text-destructive">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Management</CardTitle>
                  <CardDescription>Create and manage departments</CardDescription>
                </div>
                <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Department
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Department</DialogTitle>
                      <DialogDescription>Set up a new department</DialogDescription>
                    </DialogHeader>
                    <AddDepartmentForm onSubmit={handleAddDepartment} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Super Leader</TableHead>
                    <TableHead>Leaders</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">{dept.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{dept.superLeader}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {dept.leaders.map((leader) => (
                            <Badge key={leader} variant="outline" className="text-xs">
                              {leader}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
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
                      <TableCell>
                        <Badge variant={dept.status === "active" ? "default" : "secondary"}>{dept.status}</Badge>
                      </TableCell>
                      <TableCell>{dept.createdDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Add User Form Component
function AddUserForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", email: "", role: "member" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userName">Full Name</Label>
        <Input
          id="userName"
          placeholder="Enter user's full name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userEmail">Email Address</Label>
        <Input
          id="userEmail"
          type="email"
          placeholder="Enter user's email..."
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Initial Role</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_leader">Super Leader</SelectItem>
            <SelectItem value="leader">Leader</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Add User
        </Button>
      </div>
    </form>
  )
}

// Add Team Form Component
function AddTeamForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    leader: "",
    department: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", description: "", leader: "", department: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teamName">Team Name</Label>
        <Input
          id="teamName"
          placeholder="Enter team name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teamDescription">Description</Label>
        <Textarea
          id="teamDescription"
          placeholder="Describe the team's purpose..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Team Leader</Label>
          <Select value={formData.leader} onValueChange={(value) => setFormData({ ...formData, leader: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select leader" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sami">Sami</SelectItem>
              <SelectItem value="Yasmine">Yasmine</SelectItem>
              <SelectItem value="Ali">Ali</SelectItem>
              <SelectItem value="Sara">Sara</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Create Team
        </Button>
      </div>
    </form>
  )
}

// Add Department Form Component
function AddDepartmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    superLeader: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", description: "", superLeader: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="deptName">Department Name</Label>
        <Input
          id="deptName"
          placeholder="Enter department name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deptDescription">Description</Label>
        <Textarea
          id="deptDescription"
          placeholder="Describe the department's role..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Super Leader</Label>
        <Select
          value={formData.superLeader}
          onValueChange={(value) => setFormData({ ...formData, superLeader: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select super leader" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sami">Sami</SelectItem>
            <SelectItem value="Yasmine">Yasmine</SelectItem>
            <SelectItem value="Ali">Ali</SelectItem>
            <SelectItem value="Sara">Sara</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Create Department
        </Button>
      </div>
    </form>
  )
}
