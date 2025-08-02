"use client"

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/users-table"

export default function UsersPage() {

  // Mock stats
  const stats = [
    {
      title: "Total Users",
      value: "89",
      description: "Registered users",
      icon: Users,
      trend: "+12 this month",
    },
    {
      title: "Active Users",
      value: "76",
      description: "Currently active",
      icon: UserCheck,
      trend: "+8 this week",
    },
    {
      title: "Inactive Users",
      value: "13",
      description: "Not recently active",
      icon: UserX,
      trend: "-2 this week",
    },
    {
      title: "New This Month",
      value: "12",
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
}
