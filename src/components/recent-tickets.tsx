import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { getTickets } from "@/services/ticketService";

interface RecentTicketsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentTickets({ className, ...props }: RecentTicketsProps) {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true)
      const data = await getTickets()
      setTickets(data)
      setLoading(false)
    }
    fetchTickets()
  }, [])

  if (loading) return <div>Loading recent tickets...</div>

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>Overview of your latest tickets and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.slice(0, 4).map((ticket) => (
            <div key={ticket.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{ticket.title}</p>
                  <Badge
                    variant={
                      ticket.status === "VERIFIED"
                        ? "default"
                        : ticket.status === "IN_PROGRESS"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {ticket.status === "VERIFIED"
                      ? "Verified"
                      : ticket.status === "IN_PROGRESS"
                        ? "In Progress"
                        : ticket.status}
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
