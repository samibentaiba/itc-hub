"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MessageSquare, User, ArrowUpRight, Ticket, AlertCircle, CheckCircle2, Timer } from "lucide-react"

export function RecentTickets() {
  const tickets = [
    {
      id: "T-001",
      title: "Fix authentication bug in mobile app",
      description: "Users unable to login using Google OAuth on iOS devices",
      status: "open",
      priority: "high",
      assignee: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SC",
      },
      team: "Frontend Team",
      createdAt: "2 hours ago",
      comments: 5,
      progress: 25,
    },
    {
      id: "T-002",
      title: "Database performance optimization",
      description: "Query response time increased significantly for user dashboard",
      status: "in-progress",
      priority: "medium",
      assignee: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
      team: "Backend Team",
      createdAt: "5 hours ago",
      comments: 12,
      progress: 60,
    },
    {
      id: "T-003",
      title: "Update design system documentation",
      description: "Add new component guidelines and usage examples",
      status: "review",
      priority: "low",
      assignee: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EW",
      },
      team: "Design Team",
      createdAt: "1 day ago",
      comments: 3,
      progress: 90,
    },
    {
      id: "T-004",
      title: "Implement dark mode toggle",
      description: "Add system-wide dark mode support with user preferences",
      status: "completed",
      priority: "medium",
      assignee: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AR",
      },
      team: "Frontend Team",
      createdAt: "2 days ago",
      comments: 8,
      progress: 100,
    },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <AlertCircle className="h-3 w-3" />,
          dot: "bg-red-500",
        }
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Timer className="h-3 w-3" />,
          dot: "bg-blue-500",
        }
      case "review":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-3 w-3" />,
          dot: "bg-yellow-500",
        }
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle2 className="h-3 w-3" />,
          dot: "bg-green-500",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Clock className="h-3 w-3" />,
          dot: "bg-gray-500",
        }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          border: "border-l-red-500",
          bg: "bg-red-500/5",
          indicator: "bg-red-500",
        }
      case "medium":
        return {
          border: "border-l-yellow-500",
          bg: "bg-yellow-500/5",
          indicator: "bg-yellow-500",
        }
      case "low":
        return {
          border: "border-l-green-500",
          bg: "bg-green-500/5",
          indicator: "bg-green-500",
        }
      default:
        return {
          border: "border-l-gray-300",
          bg: "bg-gray-500/5",
          indicator: "bg-gray-500",
        }
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="bg-gradient-to-r from-background to-muted/30 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
              <Ticket className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Recent Tickets</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest ticket updates and progress</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-orange-500/5 hover:text-orange-600 hover:border-orange-500/20 bg-transparent"
          >
            View All Tickets
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status)
            const priorityConfig = getPriorityConfig(ticket.priority)

            return (
              <div
                key={ticket.id}
                className={`p-5 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer group ${priorityConfig.border} ${priorityConfig.bg} bg-card border border-border/30`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {ticket.id}
                      </span>
                      <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                        {statusConfig.icon}
                        {ticket.status.replace("-", " ")}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${priorityConfig.indicator}`}></div>
                    </div>

                    <h4 className="font-semibold text-sm mb-2 truncate group-hover:text-orange-600 transition-colors">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{ticket.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs font-medium">{ticket.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            ticket.progress === 100
                              ? "bg-green-500"
                              : ticket.progress >= 50
                                ? "bg-blue-500"
                                : "bg-orange-500"
                          }`}
                          style={{ width: `${ticket.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{ticket.team}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{ticket.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{ticket.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                      <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                      <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        {ticket.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`w-3 h-3 rounded-full ${statusConfig.dot} animate-pulse`}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
