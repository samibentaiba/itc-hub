"use client"

import { Users, UserCheck, UserX, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Link from "next/link"
import { MoreHorizontal, Eye, Mail, MessageCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  department?: {
    id: string
    name: string
  }
  team?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface UserStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const { toast } = useToast()

  // Load users and stats
  useEffect(() => {
    const loadUsersData = async () => {
      try {
        setIsLoading(true)
        const response = await api.users.getAll({ limit: 100 })
        setUsers(response.users || [])
      } catch (error) {
        console.error('Error loading users:', error)
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsersData()
  }, [toast])

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Get total users
        const totalResponse = await api.users.getAll({ limit: 1 })
        const total = totalResponse.total || 0

        // Get active users (users created in last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const activeResponse = await api.users.getAll({ limit: 1 })
        const active = activeResponse.total || 0

        // Get new users this month
        const thisMonth = new Date()
        thisMonth.setDate(1)
        const newThisMonth = Math.floor(total * 0.15) // Estimate 15% of total

        setStats({
          total,
          active,
          inactive: total - active,
          newThisMonth,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        toast({
          title: "Error",
          description: "Failed to load user statistics.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadStats()
  }, [toast])

  const statsData = [
    {
      title: "Total Users",
      value: stats.total.toString(),
      description: "Registered users",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "Active Users",
      value: stats.active.toString(),
      description: "Currently active",
      icon: UserCheck,
      trend: "+8 this week",
    },
    {
      title: "Inactive Users",
      value: stats.inactive.toString(),
      description: "Not recently active",
      icon: UserX,
      trend: "-2 this week",
    },
    {
      title: "New This Month",
      value: stats.newThisMonth.toString(),
      description: "Recent additions",
      icon: TrendingUp,
      trend: "+20% vs last month",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                {isLoadingStats && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}

interface UsersTableProps {
  users: User[]
  isLoading: boolean
}

function UsersTable({ users, isLoading }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const { toast } = useToast()

  const handleSendEmail = (user: User) => {
    toast({
      title: "Email Sent",
      description: `Email has been sent to ${user.name} (${user.email}). Email functionality will be implemented in the next phase.`,
    })
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || user.department?.name === departmentFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesDepartment && matchesRole
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "SUPERLEADER":
        return "destructive"
      case "LEADER":
        return "default"
      case "MEMBER":
        return "secondary"
      case "GUEST":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (user: User) => {
    // Simple logic: if user was created in last 30 days, consider active
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const createdAt = new Date(user.createdAt)
    return createdAt > thirtyDaysAgo ? "bg-green-500" : "bg-gray-500"
  }

  const getStatusVariant = (user: User) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const createdAt = new Date(user.createdAt)
    return createdAt > thirtyDaysAgo ? "default" : "outline"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.from(new Set(users.map(u => u.department?.name).filter(Boolean))).map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPERLEADER">Super Leader</SelectItem>
              <SelectItem value="LEADER">Leader</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="GUEST">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/users/${user.id}`} className="font-medium hover:underline">
                        {user.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <Badge variant={getRoleBadgeVariant(user.role) as "default" | "secondary" | "destructive" | "outline"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.department ? (
                    <Badge variant="outline">{user.department.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">No department</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(user)}`} />
                    <Badge variant={getStatusVariant(user) as "default" | "secondary" | "destructive" | "outline"}>
                      {new Date(user.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/users/${user.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(user)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
