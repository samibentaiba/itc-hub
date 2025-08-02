"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Ticket, Calendar, TrendingUp, Clock, Building2, ArrowUpRight, Activity } from "lucide-react"

export function OverviewStats() {
  const stats = [
    {
      title: "Active Teams",
      value: "12",
      change: "+2 this month",
      changeType: "positive",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Open Tickets",
      value: "23",
      change: "-5 from last week",
      changeType: "positive",
      icon: Ticket,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Upcoming Events",
      value: "8",
      change: "3 this week",
      changeType: "neutral",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-500/10 to-green-600/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Departments",
      value: "6",
      change: "All active",
      changeType: "neutral",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-500/20",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "ticket",
      title: "New bug report submitted",
      description: "Authentication issue in mobile app",
      time: "2 minutes ago",
      status: "open",
      priority: "high",
      user: "Sarah Chen",
      avatar: "SC",
    },
    {
      id: 2,
      type: "team",
      title: "Frontend Team meeting completed",
      description: "Sprint planning and task assignments",
      time: "1 hour ago",
      status: "completed",
      priority: "medium",
      user: "Mike Johnson",
      avatar: "MJ",
    },
    {
      id: 3,
      type: "event",
      title: "Workshop scheduled",
      description: "React Best Practices - Next Friday",
      time: "3 hours ago",
      status: "scheduled",
      priority: "low",
      user: "Emma Wilson",
      avatar: "EW",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "ticket":
        return <Ticket className="h-4 w-4 text-orange-500" />
      case "team":
        return <Users className="h-4 w-4 text-blue-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-500/5"
      case "medium":
        return "border-l-yellow-500 bg-yellow-500/5"
      case "low":
        return "border-l-green-500 bg-green-500/5"
      default:
        return "border-l-gray-300 bg-gray-500/5"
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`hover:shadow-lg transition-all duration-300 border ${stat.borderColor} ${stat.bgColor} group cursor-pointer`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div
                className={`p-2.5 rounded-xl ${stat.bgColor} border ${stat.borderColor} group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-border/50">
        <CardHeader className="bg-gradient-to-r from-background to-muted/30 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-lg border border-red-500/20">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Latest updates from your workspace</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-red-500/5 hover:text-red-600 hover:border-red-500/20 bg-transparent"
            >
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getPriorityColor(activity.priority)}`}
              >
                <div className="flex-shrink-0 mt-1 p-2 bg-background rounded-lg border border-border/50 shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold truncate mb-1">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                    </div>
                    <Badge className={`${getStatusColor(activity.status)} text-xs font-medium`}>
                      {activity.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{activity.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {activity.avatar}
                        </div>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.priority === "high"
                          ? "bg-red-500"
                          : activity.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
