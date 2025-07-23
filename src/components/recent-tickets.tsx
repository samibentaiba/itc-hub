import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentTicketsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentTickets({ className, ...props }: RecentTicketsProps) {
  const tickets = [
    {
      id: "t1",
      title: "Fix login bug",
      description: "Resolve session persistence issue",
      status: "verified",
      type: "task",
      assignee: {
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "t2",
      title: "Weekly Standup",
      description: "Discuss weekly progress",
      status: "scheduled",
      type: "event",
      scheduledAt: "2025-07-24T09:00:00",
    },
    {
      id: "t3",
      title: "Design Review",
      description: "Review new component designs",
      status: "in_progress",
      type: "meeting",
    },
    {
      id: "t4",
      title: "Create landing page",
      description: "Design and structure the homepage layout",
      status: "in_progress",
      type: "task",
      assignee: {
        name: "Ali",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>Overview of your latest tickets and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{ticket.title}</p>
                  <Badge
                    variant={
                      ticket.status === "verified"
                        ? "default"
                        : ticket.status === "in_progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {ticket.status === "verified"
                      ? "Verified"
                      : ticket.status === "in_progress"
                        ? "In Progress"
                        : "Scheduled"}
                  </Badge>
                  <Badge variant="outline">{ticket.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ticket.description}</p>
              </div>
              {ticket.assignee && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ticket.assignee.avatar || "/placeholder.svg"} alt={ticket.assignee.name} />
                  <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
