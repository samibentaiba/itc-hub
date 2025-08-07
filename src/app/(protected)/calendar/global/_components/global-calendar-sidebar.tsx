// --- /calendar/global/_components/global-calendar-sidebar.tsx ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, Users, RefreshCw, Download, Loader2 } from "lucide-react";
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

export default function GlobalCalendarSidebar({ upcomingEvents, allEvents, filterType, loadingAction, onFilterChange, onNewEventClick, onEventClick, onRefresh, onExport }: GlobalCalendarSidebarProps) {
  const eventTypes = ["all", ...Array.from(new Set(allEvents.map(e => e.type)))];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={onNewEventClick}><Plus className="h-4 w-4 mr-2" />Create Event</Button>
          <Select value={filterType} onValueChange={onFilterChange}><SelectTrigger className="w-full justify-start"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter Events" /></SelectTrigger><SelectContent>{eventTypes.map(type => (<SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>))}</SelectContent></Select>
          <Button variant="outline" className="w-full justify-start" onClick={onRefresh} disabled={loadingAction === 'refresh'}>{loadingAction === 'refresh' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}Refresh</Button>
          <Button variant="outline" className="w-full justify-start" onClick={onExport} disabled={loadingAction === 'export'}>{loadingAction === 'export' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}Export</Button>
        </CardContent>
      </Card>
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
