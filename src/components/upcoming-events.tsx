import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface UpcomingEventsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UpcomingEvents({ className, ...props }: UpcomingEventsProps) {
  const events = [
    {
      id: "t2",
      title: "Weekly Standup",
      description: "Discuss weekly progress",
      date: "July 24, 2025",
      time: "9:00 AM",
      duration: "1 hour",
    },
    {
      id: "t3",
      title: "Design Review",
      description: "Review new component designs",
      date: "July 23, 2025",
      time: "2:00 PM",
      duration: "2 days",
    },
  ]

  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Your scheduled events and meetings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>
                    {event.time} ({event.duration})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
