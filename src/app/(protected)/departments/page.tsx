"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useDepartmentsPage, type Department, type DepartmentStat } from "./hook"

export default function DepartmentsPage() {
  const { stats, departments } = useDepartmentsPage()

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
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Departments Grid */}
      <DepartmentsGrid departments={departments} />
    </div>
  )
}

const StatCard = ({ stat }: { stat: DepartmentStat }) => (
  <Card>
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
)

const DepartmentsGrid = ({ departments }: { departments: Department[] }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {departments.map((department) => (
      <DepartmentCard key={department.id} department={department} />
    ))}
  </div>
)

const DepartmentCard = ({ department }: { department: Department }) => (
  <Card className="hover:shadow-md transition-shadow">
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
      <DepartmentHead head={department.head} />

      {/* Teams */}
      <TeamsSection teams={department.teams} teamCount={department.teamCount} />

      {/* Stats */}
      <DepartmentStats memberCount={department.memberCount} status={department.status} />

      {/* Recent Activity */}
      <RecentActivity activity={department.recentActivity} />
    </CardContent>
  </Card>
)

const DepartmentHead = ({ head }: { head: Department['head'] }) => (
  <div className="flex items-center gap-2">
    <Avatar className="h-8 w-8">
      <AvatarImage src={head.avatar || "/placeholder.svg"} alt={head.name} />
      <AvatarFallback className="text-xs">
        {head.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
    <div>
      <Link href={`/users/${head.id}`} className="text-sm font-medium hover:underline">
        {head.name}
      </Link>
      <p className="text-xs text-muted-foreground">Department Head</p>
    </div>
  </div>
)

const TeamsSection = ({ 
  teams, 
  teamCount 
}: { 
  teams: Department['teams']
  teamCount: number 
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Teams</span>
      <span className="text-xs text-muted-foreground">{teamCount} teams</span>
    </div>
    <div className="space-y-1">
      {teams.map((team, index) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{team.name}</span>
          <span className="text-muted-foreground">{team.memberCount} members</span>
        </div>
      ))}
    </div>
  </div>
)

const DepartmentStats = ({ 
  memberCount, 
  status 
}: { 
  memberCount: number
  status: string 
}) => (
  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
    <div className="text-center">
      <div className="text-lg font-semibold text-primary">{memberCount}</div>
      <div className="text-xs text-muted-foreground">Total Members</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-semibold text-green-600">
        {status === "active" ? "Active" : "Inactive"}
      </div>
      <div className="text-xs text-muted-foreground">Status</div>
    </div>
  </div>
)

const RecentActivity = ({ activity }: { activity: string }) => (
  <div className="pt-2 border-t">
    <p className="text-xs text-muted-foreground">
      <span className="font-medium">Recent:</span> {activity}
    </p>
  </div>
)