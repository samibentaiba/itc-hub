// --- /calendar/global/_components/global-calendar-sidebar.tsx ---

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { format } from "date-fns";
import type { GlobalEvent, LoadingAction } from "../types";

interface GlobalCalendarSidebarProps {
  upcomingEvents: GlobalEvent[];
  allEvents: GlobalEvent[];
  filterType: string;
  loadingAction: LoadingAction;
  onFilterChange: (type: string) => void;
  onNewEventClick: () => void;
  onEventClick: (event: GlobalEvent | null) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export default function GlobalCalendarSidebar({ upcomingEvents, onEventClick}: GlobalCalendarSidebarProps) {
  

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader><CardTitle>Upcoming Events</CardTitle><CardDescription>Next 5 scheduled events</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => onEventClick(event)}>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-muted-foreground">{format(new Date(event.date), "MMM dd, yyyy")} at {event.time}</p>
              <div className="flex items-center justify-between mt-2"><Badge variant="secondary" className="capitalize">{event.type}</Badge><span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{event.attendees}</span></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
