"use client"

import { Users, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamsGrid } from "@/components/teams-grid"

export default function TeamsPage() {

  // Mock stats
  const stats = [
    {
      title: "Total Teams",
      value: "12",
      description: "Active teams",
      icon: Users,
      trend: "+2 this month",
    },
    {
      title: "Total Members",
      value: "89",
      description: "Across all teams",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "Active Projects",
      value: "34",
      description: "In progress",
      icon: TrendingUp,
      trend: "+8 this week",
    },
    {
      title: "Avg Team Size",
      value: "7.4",
      description: "Members per team",
      icon: Clock,
      trend: "Optimal size",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage teams and their members</p>
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

      {/* Teams Grid */}
      <TeamsGrid />
    </div>
  )
}
