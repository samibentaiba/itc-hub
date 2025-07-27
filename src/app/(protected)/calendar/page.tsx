"use client"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCalendar } from "./hook"

export default function CalendarPage() {
  const { date, setDate, events, loading, getSelectedDateEvents, navigateDate } = useCalendar();

  if (loading) return <div>Loading events...</div>

  return (
    <DashboardShell>
      <DashboardHeader heading="Calendar" text="View and manage your schedule." />
      
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view events</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle>
              Events for {date?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </CardTitle>
            <CardDescription>
              {getSelectedDateEvents().length === 0
                ? "No events scheduled for this date"
                : `${getSelectedDateEvents().length} event${getSelectedDateEvents().length > 1 ? "s" : ""} scheduled`}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getSelectedDateEvents().length === 0 ? (
            <div className="flex h-[300px] items-center justify-center border rounded-md">
              <p className="text-muted-foreground">No events scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getSelectedDateEvents().map((event) => (
                <div key={event.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {event.time}
                    </div>
                    <Badge variant="secondary">{event.team || event.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </DashboardShell>
  )
}
