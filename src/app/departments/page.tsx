"use client"

import { Building2, Users, Briefcase, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DepartmentsGrid } from "@/components/departments-grid"

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
