"use client"

import { Building2, Users, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DepartmentsPage() {

  // Mock stats
  const stats = [
    {
      title: "Total Departments",
      value: "8",
      description: "Active departments",
      icon: Building2,
      trend: "+1 this quarter",
    },
    {
      title: "Department Heads",
      value: "8",
      description: "Leadership roles",
      icon: Users,
      trend: "All filled",
    },
    {
      title: "Teams per Dept",
      value: "1.5",
      description: "Average teams",
      icon: Briefcase,
      trend: "Optimal structure",
    },
    {
      title: "Cross-Dept Projects",
      value: "12",
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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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
      <DepartmentsGrid />
    </div>
  )
}

import Link from "next/link"

import { CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"


const mockDepartments = [
  {
    id: "dept-1",
    name: "Engineering",
    description: "Software development and technical infrastructure",
    head: {
      name: "Sami Al-Rashid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "sami",
    },
    teamCount: 3,
    memberCount: 18,
    budget: "$2,400,000",
    teams: [
      { name: "Frontend Team", memberCount: 8 },
      { name: "Backend Team", memberCount: 6 },
      { name: "DevOps Team", memberCount: 4 },
    ],
    recentActivity: "Launched new microservices architecture",
    status: "active",
    color: "bg-blue-500",
  },
  {
    id: "dept-2",
    name: "Design",
    description: "User experience and visual design",
    head: {
      name: "Yasmine Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "yasmine",
    },
    teamCount: 1,
    memberCount: 5,
    budget: "$800,000",
    teams: [{ name: "Design Team", memberCount: 5 }],
    recentActivity: "Completed design system overhaul",
    status: "active",
    color: "bg-purple-500",
  },
  {
    id: "dept-3",
    name: "Product",
    description: "Product strategy and management",
    head: {
      name: "Fatima Al-Zahra",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "fatima",
    },
    teamCount: 1,
    memberCount: 4,
    budget: "$600,000",
    teams: [{ name: "Product Team", memberCount: 4 }],
    recentActivity: "Released Q1 product roadmap",
    status: "active",
    color: "bg-pink-500",
  },
  {
    id: "dept-4",
    name: "Quality Assurance",
    description: "Testing and quality control",
    head: {
      name: "Layla Ibrahim",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "layla",
    },
    teamCount: 1,
    memberCount: 6,
    budget: "$500,000",
    teams: [{ name: "QA Team", memberCount: 6 }],
    recentActivity: "Implemented automated testing suite",
    status: "active",
    color: "bg-orange-500",
  },
  {
    id: "dept-5",
    name: "Infrastructure",
    description: "IT infrastructure and operations",
    head: {
      name: "Ali Mohammed",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "ali",
    },
    teamCount: 1,
    memberCount: 4,
    budget: "$1,200,000",
    teams: [{ name: "DevOps Team", memberCount: 4 }],
    recentActivity: "Migrated to cloud infrastructure",
    status: "active",
    color: "bg-green-500",
  },
  {
    id: "dept-6",
    name: "Marketing",
    description: "Marketing and communications",
    head: {
      name: "Nour Khalil",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "nour",
    },
    teamCount: 2,
    memberCount: 8,
    budget: "$900,000",
    teams: [
      { name: "Digital Marketing", memberCount: 5 },
      { name: "Content Team", memberCount: 3 },
    ],
    recentActivity: "Launched new brand campaign",
    status: "active",
    color: "bg-red-500",
  },
  {
    id: "dept-7",
    name: "Sales",
    description: "Sales and business development",
    head: {
      name: "Ahmed Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "ahmed",
    },
    teamCount: 2,
    memberCount: 12,
    budget: "$1,500,000",
    teams: [
      { name: "Enterprise Sales", memberCount: 7 },
      { name: "SMB Sales", memberCount: 5 },
    ],
    recentActivity: "Exceeded Q4 sales targets",
    status: "active",
    color: "bg-indigo-500",
  },
  {
    id: "dept-8",
    name: "Human Resources",
    description: "People operations and talent management",
    head: {
      name: "Mona Farid",
      avatar: "/placeholder.svg?height=32&width=32",
      id: "mona",
    },
    teamCount: 1,
    memberCount: 3,
    budget: "$400,000",
    teams: [{ name: "HR Team", memberCount: 3 }],
    recentActivity: "Implemented new performance review system",
    status: "active",
    color: "bg-teal-500",
  },
]

export function DepartmentsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockDepartments.map((department) => (
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
              <div className={`w-3 h-3 rounded-full ${department.color}`} />
              <Badge variant="outline" className="text-xs">
                {department.budget}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Department Head */}
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

            {/* Teams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Teams</span>
                <span className="text-xs text-muted-foreground">{department.teamCount} teams</span>
              </div>
              <div className="space-y-1">
                {department.teams.map((team, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{team.name}</span>
                    <span className="text-muted-foreground">{team.memberCount} members</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{department.memberCount}</div>
                <div className="text-xs text-muted-foreground">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {department.status === "active" ? "Active" : "Inactive"}
                </div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Recent:</span> {department.recentActivity}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
