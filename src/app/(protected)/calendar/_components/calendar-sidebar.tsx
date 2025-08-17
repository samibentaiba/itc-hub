// /calendar/components/CalendarSidebar.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Users, Calendar } from "lucide-react";
import type { CalendarLocalEvent, CalendarUpcomingEvent } from "../../types";
import Link from "next/link";

interface CalendarSidebarProps {
  upcomingEvents: CalendarUpcomingEvent[];
  allEvents: CalendarLocalEvent[];
  filterType: string;
  onFilterChange: (type: string) => void;
  onEventClick: (event: CalendarLocalEvent | null) => void;
}

export default function CalendarSidebar({ upcomingEvents, allEvents, filterType, onFilterChange, onEventClick }: CalendarSidebarProps) {
  const eventTypes = ["all", ...Array.from(new Set(allEvents.map(e => e.type)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
            <Link href="/calendar/global">
              <Calendar className="h-4 w-4 mr-2" />
              Global Calendar
            </Link>
          </Button>
          
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full justify-start bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter Events" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Events' : type.replace('-', ' ')}
                </SelectItem>
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
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events
            </p>
          ) : (
            upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer" 
                onClick={() => onEventClick(allEvents.find(e => e.id === event.id) || null)}
              >
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.date}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="capitalize">
                    {event.type.replace('-', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.attendees}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}