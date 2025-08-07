// --- /calendar/global/_components/event-details-dialog.tsx ---
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import type { GlobalEvent } from "../types";
import { getEventTypeColor } from "../utils";
import { format } from "date-fns";
interface EventDetailsDialogProps {
  event: GlobalEvent | null;
  onClose: () => void;
}

export default function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  if (!event) return null;
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div><DialogTitle className="text-2xl font-bold">{event.title}</DialogTitle><DialogDescription className="mt-1"><Badge variant="outline" className="capitalize">{event.type}</Badge></DialogDescription></div>
            <div className={`w-4 h-4 rounded-full mt-2 ${getEventTypeColor(event.type)}`}></div>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">{event.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{format(new Date(event.date), "PPP")}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{event.attendees} attendees</span></div>
          </div>
          <div><h4 className="font-medium mb-2">Organizer</h4><div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" /><span>{event.organizer}</span></div></div>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}