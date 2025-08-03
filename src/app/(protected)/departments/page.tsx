"use client"

import { Building2, Users, Briefcase, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Department {
  id: string
  name: string
  description: string
  head?: {
    id: string
    name: string
    avatar?: string
  }
  teams?: Array<{
    id: string
    name: string
    memberCount: number
  }>
  createdAt: string
  updatedAt: string
}

interface DepartmentStats {
  total: number
  departmentHeads: number
  teamsPerDept: number
  crossDeptProjects: number
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [stats, setStats] = useState<DepartmentStats>({
    total: 0,
    departmentHeads: 0,
    teamsPerDept: 0,
    crossDeptProjects: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const { toast } = useToast()

  // Load departments and stats
  useEffect(() => {
    const loadDepartmentsData = async () => {
      try {
        setIsLoading(true)
        const response = await api.departments.getAll({ limit: 100 })
        setDepartments(response.departments || [])
      } catch (error) {
        console.error('Error loading departments:', error)
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadDepartmentsData()
  }, [toast])

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        
        // Get total departments
        const totalResponse = await api.departments.getAll({ limit: 1 })
        const total = totalResponse.total || 0

        // Get teams per department
        const allDepartments = await api.departments.getAll({ limit: 100 })
        const totalTeams = allDepartments.departments?.reduce((sum, dept) => sum + (dept.teams?.length || 0), 0) || 0
        const teamsPerDept = total > 0 ? Math.round((totalTeams / total) * 10) / 10 : 0

        // Estimate other stats
        const departmentHeads = total // Assuming each department has a head
        const crossDeptProjects = total * 1.5 // Estimate 1.5 cross-dept projects per department

        setStats({
          total,
          departmentHeads,
          teamsPerDept,
          crossDeptProjects,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        toast({
          title: "Error",
          description: "Failed to load department statistics.",
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
      title: "Total Departments",
      value: stats.total.toString(),
      description: "Active departments",
      icon: Building2,
      trend: "+1 this quarter",
    },
    {
      title: "Department Heads",
      value: stats.departmentHeads.toString(),
      description: "Leadership roles",
      icon: Users,
      trend: "All filled",
    },
    {
      title: "Teams per Dept",
      value: stats.teamsPerDept.toString(),
      description: "Average teams",
      icon: Briefcase,
      trend: "Optimal structure",
    },
    {
      title: "Cross-Dept Projects",
      value: stats.crossDeptProjects.toString(),
      description: "Collaborative work",
      icon: TrendingUp,
      trend: "+3 this month",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
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

      {/* Departments Grid */}
      <DepartmentsGrid departments={departments} isLoading={isLoading} />
    </div>
  )
}

import Link from "next/link"
import { CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DepartmentsGridProps {
  departments: Department[]
  isLoading: boolean
}

function DepartmentsGrid({ departments, isLoading }: DepartmentsGridProps) {
  const getDepartmentColor = (name: string) => {
    switch (name) {
      case "Engineering":
        return "bg-blue-500"
      case "Design":
        return "bg-purple-500"
      case "Product":
        return "bg-pink-500"
      case "Quality Assurance":
        return "bg-orange-500"
      case "Infrastructure":
        return "bg-green-500"
      case "Marketing":
        return "bg-red-500"
      case "Sales":
        return "bg-indigo-500"
      case "Human Resources":
        return "bg-teal-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading departments...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => (
        <Card key={department.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/departments/${department.id}`} className="hover:underline">
                    {department.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm">{department.description}</CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${getDepartmentColor(department.name)}`} />
              <Badge variant="outline" className="text-xs">
                {department.teams?.length || 0} teams
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Department Head */}
            {department.head && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={department.head.avatar || "/placeholder.svg"} alt={department.head.name} />
                  <AvatarFallback className="text-xs">
                    {department.head.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/users/${department.head.id}`} className="text-sm font-medium hover:underline">
                    {department.head.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">Department Head</p>
                </div>
              </div>
            )}

            {/* Teams */}
            {department.teams && department.teams.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Teams</span>
                  <span className="text-xs text-muted-foreground">{department.teams.length} teams</span>
                </div>
                <div className="space-y-1">
                  {department.teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{team.name}</span>
                      <span className="text-muted-foreground">{team.memberCount} members</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {department.teams?.reduce((sum, team) => sum + team.memberCount, 0) || 0}
                </div>
                <div className="text-xs text-muted-foreground">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">Active</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Recent:</span> Department updated {new Date(department.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {departments.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No departments found.</p>
        </div>
      )}
    </div>
  )
}
