
// /app/(protected)/admin/_components/CalendarSidebar.tsx
"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Users } from "lucide-react";
import { useAdminPage } from "../_hooks/hook";

interface CalendarSidebarProps {
  calendarData: ReturnType<typeof useAdminPage>["calendarData"];
}

export function CalendarSidebar({ calendarData }: CalendarSidebarProps) {
  const { upcomingEvents, events, filterType, actions } = calendarData;
  const eventTypes = useMemo(() => ["all", ...Array.from(new Set(events.map((e) => e.type)))], [events]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => actions.setShowNewEventDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          <Select value={filterType} onValueChange={actions.setFilterType}>
            <SelectTrigger className="w-full justify-start bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Events" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your next scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => actions.setSelectedEvent(events.find((e) => e.id === event.id) || null)}
            >
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{event.date}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary">{event.type}</Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.attendees}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
